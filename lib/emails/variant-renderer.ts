/**
 * Renders the correct A/B variant for a given subscriber.
 * Looks up the subscriber's assigned variant and applies it to the email.
 */

import { briefTemplate } from "./brief-template";
import { broadcastTemplate } from "./broadcast-template";
import { alertTemplate } from "./alert-template";
import type { CTAType } from "./cta-blocks";

interface Variant {
  id: string;
  value: string;
}

interface RenderOptions {
  campaignType: string; // brief, broadcast, alert
  subject: string;
  htmlContent: string; // JSON for brief data, or raw HTML body
  unsubscribeUrl: string;
  ctaType?: CTAType;
  campaignId?: string;
  variant?: Variant; // The assigned variant, if any
  testType?: string; // subject, headline, layout, cta
}

export function renderEmailForSubscriber(opts: RenderOptions): {
  subject: string;
  html: string;
} {
  let { subject } = opts;

  // Apply variant to subject if this is a subject test
  if (opts.variant && opts.testType === "subject") {
    subject = opts.variant.value;
  }

  // Apply variant to CTA if this is a CTA test
  let ctaType = opts.ctaType || "none";
  if (opts.variant && opts.testType === "cta") {
    ctaType = opts.variant.value as CTAType;
  }

  let html: string;

  switch (opts.campaignType) {
    case "brief": {
      const briefData = JSON.parse(opts.htmlContent);

      // Apply variant to headline if this is a headline test
      if (opts.variant && opts.testType === "headline") {
        briefData.analystNote = opts.variant.value;
      }

      html = briefTemplate({
        subject,
        brief: briefData,
        unsubscribeUrl: opts.unsubscribeUrl,
        ctaType: ctaType as CTAType,
        campaignId: opts.campaignId,
      });
      break;
    }

    case "alert": {
      const alertData = JSON.parse(opts.htmlContent);
      html = alertTemplate({
        subject,
        severity: alertData.severity || "HIGH",
        body: alertData.body || opts.htmlContent,
        unsubscribeUrl: opts.unsubscribeUrl,
        ctaType: ctaType as CTAType,
        campaignId: opts.campaignId,
      });
      break;
    }

    case "broadcast":
    default: {
      html = broadcastTemplate({
        subject,
        body: opts.htmlContent,
        unsubscribeUrl: opts.unsubscribeUrl,
        ctaType: ctaType as CTAType,
        campaignId: opts.campaignId,
      });
      break;
    }
  }

  return { subject, html };
}
