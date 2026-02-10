/**
 * Broadcast template — ad-hoc messages, deeper dives, announcements.
 * B&W plaintext style.
 */

import { baseTemplate } from "./base-template";
import { renderCTA, type CTAType } from "./cta-blocks";

interface BroadcastTemplateOptions {
  subject: string;
  body: string; // Pre-formatted HTML paragraphs
  unsubscribeUrl: string;
  ctaType?: CTAType;
  campaignId?: string;
}

export function broadcastTemplate({
  body,
  unsubscribeUrl,
  ctaType = "none",
  campaignId,
}: BroadcastTemplateOptions): string {
  const content = `${body}

<p style="margin: 24px 0 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>`;

  const ctaBlock = renderCTA(ctaType, { campaignId, position: "footer" });

  return baseTemplate({ content, unsubscribeUrl, ctaBlock });
}
