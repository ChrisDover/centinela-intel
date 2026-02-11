import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import {
  generateCountryBrief,
  type CountryBriefData,
} from "@/lib/ai/generate-country-brief";
import { clientBriefEmail } from "@/lib/emails/client-brief";

export async function POST() {
  try {
    console.log("[Client Briefs] Starting daily client brief generation...");

    // Get all active clients with a country set
    const clients = await prisma.client.findMany({
      where: {
        planStatus: "active",
        country: { not: null },
        countryName: { not: null },
      },
    });

    if (clients.length === 0) {
      console.log("[Client Briefs] No active clients with countries");
      return NextResponse.json({ message: "No clients to process" });
    }

    // Group by country to avoid duplicate generations
    const countryMap = new Map<
      string,
      { code: string; name: string; clientEmails: string[]; focusAreas: string[] }
    >();

    for (const client of clients) {
      const key = client.country!;
      if (!countryMap.has(key)) {
        countryMap.set(key, {
          code: client.country!,
          name: client.countryName!,
          clientEmails: [],
          focusAreas: [],
        });
      }
      const entry = countryMap.get(key)!;
      entry.clientEmails.push(client.email);
      // Merge all clients' focus areas for this country
      if (client.focusAreas) {
        const areas: string[] = JSON.parse(client.focusAreas);
        for (const a of areas) {
          if (!entry.focusAreas.includes(a)) entry.focusAreas.push(a);
        }
      }
    }

    console.log(
      `[Client Briefs] ${clients.length} clients, ${countryMap.size} unique countries`
    );

    const results: {
      country: string;
      status: string;
      clients: number;
    }[] = [];

    // Generate brief for each unique country
    for (const [, countryInfo] of countryMap) {
      try {
        console.log(
          `[Client Briefs] Generating brief for ${countryInfo.name}...`
        );
        const briefData = await generateCountryBrief(
          countryInfo.code,
          countryInfo.name,
          countryInfo.focusAreas
        );

        // Store in database
        await prisma.clientBrief.upsert({
          where: {
            country_date: {
              country: briefData.country,
              date: briefData.date,
            },
          },
          update: {
            threatLevel: briefData.threatLevel,
            content: JSON.stringify(briefData),
          },
          create: {
            country: briefData.country,
            countryName: briefData.countryName,
            date: briefData.date,
            threatLevel: briefData.threatLevel,
            content: JSON.stringify(briefData),
          },
        });

        // Send email to each client for this country
        for (const email of countryInfo.clientEmails) {
          try {
            await resend.emails.send({
              from: "Centinela Intel <intel@centinelaintel.com>",
              to: email,
              subject: `${briefData.countryName} — ${briefData.threatLevel} — ${briefData.date}`,
              html: clientBriefEmail(briefData),
            });
            console.log(`[Client Briefs] Email sent to ${email}`);
          } catch (emailError) {
            console.error(
              `[Client Briefs] Failed to email ${email}:`,
              emailError
            );
          }
        }

        results.push({
          country: countryInfo.name,
          status: "success",
          clients: countryInfo.clientEmails.length,
        });
      } catch (error) {
        console.error(
          `[Client Briefs] Failed for ${countryInfo.name}:`,
          error
        );
        results.push({
          country: countryInfo.name,
          status: "error",
          clients: countryInfo.clientEmails.length,
        });
      }
    }

    console.log("[Client Briefs] Generation complete:", results);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("[Client Briefs] Fatal error:", error);
    return NextResponse.json(
      { error: "Client brief generation failed" },
      { status: 500 }
    );
  }
}
