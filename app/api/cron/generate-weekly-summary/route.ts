import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import Anthropic from "@anthropic-ai/sdk";

function getWeekRange(): { start: string; end: string; label: string } {
  const now = new Date();
  const end = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const start = weekAgo.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const label = `Week of ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })}`;
  return { start, end, label };
}

export async function POST() {
  try {
    console.log("[Weekly Summary] Starting weekly summary generation...");

    const clients = await prisma.client.findMany({
      where: {
        planStatus: "active",
        country: { not: null },
        countryName: { not: null },
      },
    });

    if (clients.length === 0) {
      return NextResponse.json({ message: "No active clients" });
    }

    const countryMap = new Map<
      string,
      { code: string; name: string; emails: string[] }
    >();
    for (const client of clients) {
      const key = client.country!;
      if (!countryMap.has(key)) {
        countryMap.set(key, {
          code: client.country!,
          name: client.countryName!,
          emails: [],
        });
      }
      countryMap.get(key)!.emails.push(client.email);
    }

    const { start, end, label } = getWeekRange();
    const anthropic = new Anthropic();

    for (const [, info] of countryMap) {
      try {
        // Fetch this week's daily briefs
        const briefs = await prisma.clientBrief.findMany({
          where: {
            country: info.code,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { createdAt: "asc" },
        });

        if (briefs.length === 0) continue;

        const briefSummaries = briefs
          .map((b) => {
            const data = JSON.parse(b.content);
            return `${b.date} (${b.threatLevel}):\n- Developments: ${data.developments?.join("; ")}\n- Risks: ${data.keyRisks?.join("; ")}`;
          })
          .join("\n\n");

        // Generate weekly summary with Claude
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1500,
          system:
            "You are a senior security intelligence analyst. Produce a concise weekly threat landscape summary from the daily briefs provided. Focus on: (1) overall threat trajectory this week, (2) 3-4 key themes/patterns, (3) what to watch next week. Professional intelligence style, no filler.",
          messages: [
            {
              role: "user",
              content: `Produce a weekly threat landscape summary for ${info.name} covering ${start} through ${end}.\n\nDaily briefs this week:\n${briefSummaries}`,
            },
          ],
        });

        const summaryText =
          response.content[0].type === "text"
            ? response.content[0].text
            : "";

        const threatLevels = briefs.map((b) => b.threatLevel);
        const predominantLevel =
          threatLevels.includes("CRITICAL")
            ? "CRITICAL"
            : threatLevels.includes("HIGH")
              ? "HIGH"
              : threatLevels.includes("ELEVATED")
                ? "ELEVATED"
                : "MODERATE";

        // Email to each client
        for (const email of info.emails) {
          try {
            await resend.emails.send({
              from: "Centinela Intel <intel@centinelaintel.com>",
              to: email,
              subject: `${info.name} — Weekly Threat Landscape — ${label}`,
              html: weeklyEmailTemplate(
                info.name,
                label,
                predominantLevel,
                summaryText,
                briefs.length
              ),
            });
          } catch (emailErr) {
            console.error(
              `[Weekly Summary] Failed to email ${email}:`,
              emailErr
            );
          }
        }

        console.log(
          `[Weekly Summary] ${info.name}: sent to ${info.emails.length} clients`
        );
      } catch (err) {
        console.error(`[Weekly Summary] Failed for ${info.name}:`, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Weekly Summary] Fatal error:", error);
    return NextResponse.json(
      { error: "Weekly summary generation failed" },
      { status: 500 }
    );
  }
}

function weeklyEmailTemplate(
  countryName: string,
  weekLabel: string,
  threatLevel: string,
  summary: string,
  briefCount: number
): string {
  const threatColor =
    threatLevel === "CRITICAL"
      ? "#ff4757"
      : threatLevel === "HIGH"
        ? "#ff6348"
        : "#1a1a1a";

  const paragraphs = summary
    .split("\n\n")
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${p.replace(/\n/g, "<br>")}</p>`
    )
    .join("\n");

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Weekly threat landscape for ${countryName}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td>
<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">CENTINELA INTEL — WEEKLY THREAT LANDSCAPE</p>

<p style="margin: 0 0 4px; font-size: 12px; line-height: 1.6; color: #999999;">${countryName} &mdash; ${weekLabel}</p>

<p style="margin: 16px 0 8px; font-size: 13px; line-height: 1.6; color: ${threatColor}; font-family: monospace; letter-spacing: 1px; font-weight: bold;">PREDOMINANT THREAT LEVEL: ${threatLevel}</p>

<p style="margin: 0 0 24px; font-size: 12px; color: #999999;">Based on ${briefCount} daily intelligence briefs this week</p>

${paragraphs}

<p style="margin: 24px 0 0;"><a href="${baseUrl}/client/dashboard" style="color: #1a1a1a; font-size: 14px; font-weight: bold; text-decoration: underline;">View Dashboard &rarr;</a></p>

<p style="margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; line-height: 1.6; color: #999999;">Centinela Intel — Country Monitor<br>A service of Enfocado Capital LLC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
