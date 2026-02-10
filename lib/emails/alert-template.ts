/**
 * Alert template — emergency/critical with danger color header bar.
 * Red header bar, otherwise same B&W style.
 */

import { baseTemplate } from "./base-template";
import { renderCTA, type CTAType } from "./cta-blocks";

interface AlertTemplateOptions {
  subject: string;
  severity: string; // CRITICAL, HIGH, MODERATE
  body: string; // Pre-formatted HTML paragraphs
  unsubscribeUrl: string;
  ctaType?: CTAType;
  campaignId?: string;
}

export function alertTemplate({
  severity,
  body,
  unsubscribeUrl,
  ctaType = "premium",
  campaignId,
}: AlertTemplateOptions): string {
  const content = `<p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">CENTINELA ALERT &mdash; ${severity}</p>

${body}

<p style="margin: 24px 0 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>`;

  const ctaBlock = renderCTA(ctaType, { campaignId, position: "footer" });

  return baseTemplate({
    content,
    unsubscribeUrl,
    ctaBlock,
    isAlert: true,
    preheader: `${severity} ALERT — ${body.substring(0, 80).replace(/<[^>]*>/g, "")}`,
  });
}
