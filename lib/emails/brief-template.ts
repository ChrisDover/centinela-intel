/**
 * Daily brief template — structured intelligence format.
 * B&W plaintext style, threat levels as text, bullet-point developments.
 */

import { baseTemplate } from "./base-template";
import { renderCTA, type CTAType } from "./cta-blocks";

interface BriefData {
  date: string; // e.g. "February 10, 2026"
  threatLevel: string; // e.g. "ELEVATED", "HIGH", "CRITICAL"
  developments: string[]; // bullet points
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

  const developmentsList = brief.developments
    .map(
      (d) =>
        `<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a; padding-left: 16px;">&bull; ${d}</p>`
    )
    .join("\n");

  const countriesList = brief.countries
    .map(
      (c) =>
        `<p style="margin: 0 0 4px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>${c.name}:</strong> ${c.summary}</p>`
    )
    .join("\n");

  const content = `<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">THE CENTINELA BRIEF</p>

<p style="margin: 0 0 4px; font-size: 12px; line-height: 1.6; color: #999999;">${brief.date} &mdash; Open Source / For Distribution</p>

<p style="margin: 16px 0 24px; font-size: 13px; line-height: 1.6; color: ${threatColor}; font-family: monospace; letter-spacing: 1px; font-weight: bold;">THREAT LEVEL: ${brief.threatLevel}</p>

<p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">KEY DEVELOPMENTS</p>

${developmentsList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">COUNTRY WATCH</p>

${countriesList}

<p style="margin: 24px 0 16px; font-size: 13px; line-height: 1.6; color: #666666; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">ANALYST ASSESSMENT</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${brief.analystNote}</p>

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>`;

  const ctaBlock = renderCTA(ctaType, { campaignId, position: "footer" });

  return baseTemplate({
    content,
    unsubscribeUrl,
    ctaBlock,
    preheader: `${brief.threatLevel} — ${brief.developments[0] || "Daily LatAm security intelligence"}`,
  });
}
