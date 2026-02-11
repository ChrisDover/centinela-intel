import { NextRequest, NextResponse } from "next/server";
import { getClientFromRequest } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { generateCountryBrief } from "@/lib/ai/generate-country-brief";

export async function POST(request: NextRequest) {
  const client = await getClientFromRequest(request);
  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { countryCode, countryName } = await request.json();

  if (!countryCode || !countryName) {
    return NextResponse.json(
      { error: "countryCode and countryName required" },
      { status: 400 }
    );
  }

  // Verify the client has access to this country
  const clientCountries: { code: string; name: string }[] = client.countries
    ? JSON.parse(client.countries)
    : client.country && client.country !== "ALL"
      ? [{ code: client.country, name: client.countryName || client.country }]
      : [];

  const isAllCountries = client.country === "ALL";
  const hasAccess =
    isAllCountries || clientCountries.some((c) => c.code === countryCode);

  if (!hasAccess) {
    return NextResponse.json(
      { error: "No access to this country" },
      { status: 403 }
    );
  }

  // Parse focus areas
  const focusAreas: string[] = client.focusAreas
    ? JSON.parse(client.focusAreas)
    : [];

  try {
    const briefData = await generateCountryBrief(
      countryCode,
      countryName,
      focusAreas
    );

    // Store in database (upsert for today)
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

    return NextResponse.json({ success: true, threatLevel: briefData.threatLevel });
  } catch (error) {
    console.error("[On-demand Brief] Failed:", error);
    return NextResponse.json(
      { error: "Brief generation failed" },
      { status: 500 }
    );
  }
}
