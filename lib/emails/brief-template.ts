/**
 * Daily brief template — structured intelligence format.
 * B&W plaintext style, threat levels as text, country-grouped developments.
 */

import { baseTemplate } from "./base-template";
import { renderCTA, type CTAType } from "./cta-blocks";

interface BriefDevelopment {
  country: string;
  paragraphs: string[];
}

interface BriefData {
  date: string;
  bluf?: string;
  threatLevel: string;
  developments: BriefDevelopment[] | string[];
  countries: { name: string; summary: string }[];
  analystNote: string;
}

interface BriefTemplateOptions {
  subject: string;
  brief: BriefData;
  unsubscribeUrl: string;
  ctaType?: CTAType;
  campaignId?: string;
}

/**
 * Normalize developments from any stored format into structured objects.
 * Handles: JSON-stringified arrays, flat string arrays, and new structured format.
 */
function normalizeDevelopments(
  raw: BriefDevelopment[] | string[] | string
): BriefDevelopment[] {
  let devs = raw;

  // Handle JSON-stringified array
  if (typeof devs === "string") {
    try {
      devs = JSON.parse(devs);
    } catch {
      return [{ country: "Region", paragraphs: [devs as string] }];
    }
  }

  if (!Array.isArray(devs) || devs.length === 0) {
    return [];
  }

  // New structured format — objects with country + paragraphs
  if (typeof devs[0] === "object" && "country" in devs[0]) {
    return devs as BriefDevelopment[];
  }

  // Legacy flat string format — try to extract country names from content
  return (devs as string[]).map((d) => {
    const countryMatch = d.match(
      /^(Mexico|Ecuador|Venezuela|Colombia|Brazil|Guatemala|Honduras|El Salvador|Nicaragua|Costa Rica|Panama|Peru|Chile|Argentina|Bolivia|Paraguay|Uruguay|Cuba|Haiti|Dominican Republic|Belize|Guyana|Suriname|Central America|Caribbean)[''s:,\s]/i
    );
    const country = countryMatch ? countryMatch[1] : "Regional";
    return { country, paragraphs: [d] };
  });
}

export function briefTemplate({
  subject,
  brief,
  unsubscribeUrl,
  ctaType = "premium",
  campaignId,
}: BriefTemplateOptions): string {
  const threatColor =
    brief.threatLevel === "CRITICAL"
      ? "#ff4757"
      : brief.threatLevel === "HIGH"
        ? "#ff6348"
        : "#1a1a1a";

  const developments = normalizeDevelopments(brief.developments);

  // Render developments grouped by country
  const developmentsList = developments
    .map((dev) => {
      const header = `<p style="margin: 20px 0 8px; font-size: 13px; line-height: 1.6; color: #00d4aa; font-family: monospace; font-weight: bold; letter-spacing: 0.5px;">${dev.country.toUpperCase()}</p>`;
      const paras = dev.paragraphs
        .map(
          (p) =>
            `<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${p}</p>`
        )
        .join("\n");
      return header + "\n" + paras;
    })
    .join("\n");

  const countriesList = brief.countries
    .map(
      (c) =>
        `<p style="margin: 0 0 4px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>${c.name}:</strong> ${c.summary}</p>`
    )
    .join("\n");

  // Render analyst note as separate paragraphs (split on double newline)
  const analystParagraphs = brief.analystNote
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map(
      (p) =>
        `<p style="margin: 0 0 14px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${p.trim()}</p>`
    )
    .join("\n");

  const content = `<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">THE CENTINELA BRIEF</p>

<p style="margin: 0 0 4px; font-size: 12px; line-height: 1.6; color: #999999;">${brief.date} &mdash; Open Source / For Distribution</p>

<p style="margin: 16px 0 24px; font-size: 13px; line-height: 1.6; color: ${threatColor}; font-family: monospace; letter-spacing: 1px; font-weight: bold;">THREAT LEVEL: ${brief.threatLevel}</p>

${brief.bluf ? `<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">BLUF</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a; font-weight: 500;">${brief.bluf}</p>` : ""}

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">KEY DEVELOPMENTS</p>

${developmentsList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">COUNTRY WATCH</p>

${countriesList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">ANALYST ASSESSMENT</p>

${analystParagraphs}

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>`;

  const ctaBlock = renderCTA(ctaType, { campaignId, position: "footer" });

  // Build preheader from first development
  const firstDev = developments[0];
  const preheaderText = firstDev
    ? `${firstDev.country}: ${firstDev.paragraphs[0]?.substring(0, 80) || ""}`
    : "Daily LatAm security intelligence";

  return baseTemplate({
    content,
    unsubscribeUrl,
    ctaBlock,
    preheader: `${brief.threatLevel} — ${preheaderText}`,
  });
}
