/**
 * Client brief email template — country-specific intelligence brief for paying clients.
 */

import type { CountryBriefData } from "@/lib/ai/generate-country-brief";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com";

export function clientBriefEmail(brief: CountryBriefData): string {
  const threatColor =
    brief.threatLevel === "CRITICAL"
      ? "#ff4757"
      : brief.threatLevel === "HIGH"
        ? "#ff6348"
        : "#1a1a1a";

  const developmentsList = brief.developments
    .map(
      (d) =>
        `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a; padding-left: 16px;">&bull; ${d}</p>`
    )
    .join("\n");

  const keyRisksList = brief.keyRisks
    .map(
      (r) =>
        `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a; padding-left: 16px;">&bull; ${r}</p>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centinela Intel — ${brief.countryName} Brief</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${brief.threatLevel} — ${brief.countryName}: ${brief.developments[0] || "Daily intelligence brief"}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td>
<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">CENTINELA INTEL — COUNTRY MONITOR</p>

<p style="margin: 0 0 4px; font-size: 12px; line-height: 1.6; color: #999999;">${brief.date} &mdash; ${brief.countryName}</p>

<p style="margin: 16px 0 24px; font-size: 13px; line-height: 1.6; color: ${threatColor}; font-family: monospace; letter-spacing: 1px; font-weight: bold;">THREAT LEVEL: ${brief.threatLevel}</p>

<p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">KEY DEVELOPMENTS</p>

${developmentsList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">KEY RISKS</p>

${keyRisksList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">ANALYST ASSESSMENT</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${brief.analystNote}</p>

<p style="margin: 24px 0 0;"><a href="${BASE_URL}/client/dashboard" style="color: #1a1a1a; font-size: 14px; font-weight: bold; text-decoration: underline;">View in Dashboard &rarr;</a></p>

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
