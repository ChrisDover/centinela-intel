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
  whatChanged?: string[];
  developments: BriefDevelopment[] | string[];
  travelStatus?: { location: string; status: string; note: string }[];
  supplyChain?: string;
  countries: { name: string; summary: string }[];
  personnelAdvisory?: string;
  businessRisk?: string;
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

  // Render WHAT CHANGED section
  const whatChangedHtml = brief.whatChanged && brief.whatChanged.length > 0
    ? `<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">WHAT CHANGED</p>
${brief.whatChanged.map(item => `<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; ${item}</p>`).join("\n")}` : "";

  // Render TRAVEL STATUS table
  const travelStatusHtml = brief.travelStatus && brief.travelStatus.length > 0
    ? `<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">TRAVEL STATUS</p>
${brief.travelStatus.map(t => {
  const statusColor = t.status === "CLOSED" ? "#ff4757" : t.status === "DISRUPTED" ? "#ffb347" : "#00d4aa";
  return `<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>${t.location}</strong> &mdash; <span style="color: ${statusColor}; font-family: monospace; font-weight: bold;">${t.status}</span> &mdash; ${t.note}</p>`;
}).join("\n")}` : "";

  // Render SUPPLY CHAIN section
  const supplyChainHtml = brief.supplyChain
    ? `<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">SUPPLY CHAIN &amp; FREIGHT</p>
${brief.supplyChain.split(/\n\n+/).filter(p => p.trim()).map(p => `<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${p.trim()}</p>`).join("\n")}` : "";

  // Render PERSONNEL ADVISORY section
  const personnelHtml = brief.personnelAdvisory
    ? `<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">PERSONNEL &amp; EXPAT ADVISORY</p>
${brief.personnelAdvisory.split(/\n\n+/).filter(p => p.trim()).map(p => `<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${p.trim()}</p>`).join("\n")}` : "";

  // Render BUSINESS RISK section
  const businessRiskHtml = brief.businessRisk
    ? `<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">BUSINESS RISK SIGNALS</p>
<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${brief.businessRisk}</p>` : "";

  const content = `<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">THE CENTINELA BRIEF</p>

<p style="margin: 0 0 4px; font-size: 12px; line-height: 1.6; color: #999999;">${brief.date} &mdash; Open Source / For Distribution</p>

<p style="margin: 16px 0 24px; font-size: 13px; line-height: 1.6; color: ${threatColor}; font-family: monospace; letter-spacing: 1px; font-weight: bold;">THREAT LEVEL: ${brief.threatLevel}</p>

${brief.bluf ? `<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">BLUF</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a; font-weight: 500;">${brief.bluf}</p>` : ""}

${whatChangedHtml}

<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">KEY DEVELOPMENTS</p>

${developmentsList}

${travelStatusHtml}

${supplyChainHtml}

${renderCTA(ctaType, { campaignId, position: "mid" })}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">COUNTRY WATCH</p>

${countriesList}

${personnelHtml}

${businessRiskHtml}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">ANALYST ASSESSMENT</p>

${analystParagraphs}

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>`;

  const ctaBlock = `<p style="margin: 32px 0 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">This brief is published daily and free to read. If it's useful to your work, share it with a colleague or <a href="https://centinelaintel.com?utm_source=centinela&utm_medium=email&utm_content=footer_cta${campaignId ? `&utm_campaign=${campaignId}` : ""}" style="color: #1a1a1a; text-decoration: underline; font-weight: 500;">sign up at centinelaintel.com</a>.</p>`;

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
