/**
 * Text-only CTA blocks for emails.
 * No buttons, no colors — just underlined text links with UTM tracking.
 */

const BASE_UTMS = "utm_source=centinela&utm_medium=email";

interface CTAOptions {
  campaignId?: string;
  position?: string; // header, body, footer
}

function utmParams(ctaType: string, opts: CTAOptions = {}): string {
  const parts = [BASE_UTMS, `utm_content=${ctaType}`];
  if (opts.campaignId) parts.push(`utm_campaign=${opts.campaignId}`);
  if (opts.position) parts.push(`utm_term=${opts.position}`);
  return parts.join("&");
}

export function trendlockCTA(opts: CTAOptions = {}): string {
  const url = `https://trendlock.io?${utmParams("trendlock", opts)}`;
  return `<p style="margin: 32px 0 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">Want systematic trading signals alongside your intelligence? Check out <a href="${url}" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">TrendLock</a> — algorithmic entries, no discretionary guessing.</p>`;
}

export function thunderdomeCTA(opts: CTAOptions = {}): string {
  const url = `https://tradingthunderdome.com?${utmParams("thunderdome", opts)}`;
  return `<p style="margin: 32px 0 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">Learning to trade? <a href="${url}" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Trading Thunderdome</a> — real education, zero hype.</p>`;
}

export function premiumCTA(opts: CTAOptions = {}): string {
  const monitorUrl = `https://centinelaintel.com/pricing?${utmParams("monitor", opts)}`;
  const watchUrl = `https://centinelaintel.com/watch?${utmParams("watch-pro", opts)}`;
  return `<p style="margin: 32px 0 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">Want this level of coverage for your specific countries? <a href="${monitorUrl}" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Centinela Monitor</a> — daily country-specific briefs, incident alerts, and analyst access. $29/mo per country. Need a live terminal? <a href="${watchUrl}" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Watch Pro</a> — real-time threat map, flash alerts, and API access. $199/mo.</p>`;
}

export function briefingCTA(opts: CTAOptions = {}): string {
  const url = `https://centinelaintel.com/contact?${utmParams("briefing", opts)}`;
  return `<p style="margin: 32px 0 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">Want a threat briefing tailored to your operations? <a href="${url}" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Request a complimentary briefing</a>.</p>`;
}

export type CTAType = "trendlock" | "thunderdome" | "premium" | "briefing" | "none";

export function renderCTA(ctaType: CTAType, opts: CTAOptions = {}): string {
  switch (ctaType) {
    case "trendlock":
      return trendlockCTA(opts);
    case "thunderdome":
      return thunderdomeCTA(opts);
    case "premium":
      return premiumCTA(opts);
    case "briefing":
      return briefingCTA(opts);
    case "none":
    default:
      return "";
  }
}
