/**
 * Daily brief template — IC FORMAT v4
 * Standard Intelligence Community formatting with colorblind-friendly palette.
 * 12pt Times New Roman body, Courier headers/classification markings.
 * Stacked cards for travel status & country watch, color-coded threat badges.
 */

import { baseTemplate } from "./base-template";
import { renderCTA, type CTAType } from "./cta-blocks";

interface BriefDevelopment {
  country: string;
  paragraphs: string[];
}

export interface BriefData {
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

// ── Fonts ──
const BODY_FONT = "'Times New Roman', Times, Georgia, serif";
const MONO_FONT = "'Courier New', Courier, monospace";
const TEXT_COLOR = "#000000";
const LABEL_COLOR = "#444444";

// ── Colorblind-friendly palette ──
// Blue (not green) for safe, bright orange for caution, bright red for danger.
// High saturation + brightness differences — distinguishable even in grayscale.
const THREAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: "#E81123", text: "#ffffff", border: "#E81123" },
  HIGH:     { bg: "#F25C05", text: "#ffffff", border: "#F25C05" },
  ELEVATED: { bg: "#FF9500", text: "#000000", border: "#FF9500" },
  MODERATE: { bg: "#0078D4", text: "#ffffff", border: "#0078D4" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  OPEN:      { bg: "#D4EDFC", text: "#0078D4" },
  DISRUPTED: { bg: "#FFF0D4", text: "#D46B08" },
  CLOSED:    { bg: "#FFD4D4", text: "#D41A1A" },
};

// ── Helpers ──

function formatDTG(): string {
  const now = new Date();
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins = String(now.getUTCMinutes()).padStart(2, "0");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${day}${hours}${mins}Z ${months[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
}

function extractThreatLevel(summary: string): string {
  const upper = summary.toUpperCase();
  if (upper.startsWith("CRITICAL")) return "CRITICAL";
  if (upper.startsWith("HIGH")) return "HIGH";
  if (upper.startsWith("ELEVATED")) return "ELEVATED";
  return "MODERATE";
}

/**
 * Normalize developments from any stored format into structured objects.
 */
function normalizeDevelopments(
  raw: BriefDevelopment[] | string[] | string
): BriefDevelopment[] {
  let devs = raw;
  if (typeof devs === "string") {
    try { devs = JSON.parse(devs); } catch { return [{ country: "Region", paragraphs: [devs as string] }]; }
  }
  if (!Array.isArray(devs) || devs.length === 0) return [];
  if (typeof devs[0] === "object" && "country" in devs[0]) return devs as BriefDevelopment[];
  return (devs as string[]).map((d) => {
    const m = d.match(/^(Mexico|Ecuador|Venezuela|Colombia|Brazil|Guatemala|Honduras|El Salvador|Nicaragua|Costa Rica|Panama|Peru|Chile|Argentina|Bolivia|Paraguay|Uruguay|Cuba|Haiti|Dominican Republic|Belize|Guyana|Suriname|Central America|Caribbean)[''s:,\s]/i);
    return { country: m ? m[1] : "Regional", paragraphs: [d] };
  });
}

// ── Rendering helpers ──

const sectionHeader = (text: string) =>
  `<p style="margin: 28px 0 6px; font-size: 10pt; line-height: 1.4; color: ${TEXT_COLOR}; font-family: ${MONO_FONT}; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 1px solid ${TEXT_COLOR}; padding-bottom: 4px;">${text}</p>`;

const para = (text: string) =>
  `<p style="margin: 0 0 10px; font-size: 12pt; line-height: 1.7; color: ${TEXT_COLOR}; font-family: ${BODY_FONT};">${text}</p>`;

const bullet = (text: string) =>
  `<p style="margin: 0 0 6px; font-size: 12pt; line-height: 1.7; color: ${TEXT_COLOR}; font-family: ${BODY_FONT}; padding-left: 16px;">&#8226; ${text}</p>`;

const countryDevHeader = (name: string) =>
  `<p style="margin: 18px 0 6px; font-size: 12pt; line-height: 1.4; color: ${TEXT_COLOR}; font-family: ${BODY_FONT}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px;">${name}</p>`;

const travelCard = (location: string, status: string, note: string) => {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.OPEN;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 8px; border-left: 4px solid ${sc.text}; background: ${sc.bg};">
    <tr><td style="padding: 8px 12px;">
      <p style="margin: 0 0 4px; font-size: 12pt; font-family: ${BODY_FONT}; color: ${TEXT_COLOR}; font-weight: bold;">
        ${location}
        &nbsp;&nbsp;<span style="display: inline-block; padding: 1px 10px; font-size: 8pt; font-family: ${MONO_FONT}; font-weight: bold; color: ${sc.text}; background: #ffffff; border: 1px solid ${sc.text}; border-radius: 3px; letter-spacing: 0.5px; vertical-align: middle;">${status}</span>
      </p>
      <p style="margin: 0; font-size: 11pt; font-family: ${BODY_FONT}; color: ${TEXT_COLOR}; line-height: 1.5;">${note}</p>
    </td></tr>
  </table>`;
};

const countryWatchCard = (name: string, summary: string) => {
  const level = extractThreatLevel(summary);
  const colors = THREAT_COLORS[level] || THREAT_COLORS.MODERATE;
  const cleanSummary = summary.replace(/^(CRITICAL|HIGH|ELEVATED|MODERATE)[.\s:—\-]*/i, "").trim();
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 6px; border-left: 4px solid ${colors.border};">
    <tr><td style="padding: 6px 12px;">
      <p style="margin: 0; font-size: 12pt; font-family: ${BODY_FONT}; color: ${TEXT_COLOR}; line-height: 1.6;">
        <strong>${name.toUpperCase()}</strong>
        &nbsp;<span style="display: inline-block; padding: 1px 8px; font-size: 8pt; font-family: ${MONO_FONT}; font-weight: bold; color: ${colors.text}; background: ${colors.bg}; border-radius: 3px; letter-spacing: 0.5px; vertical-align: middle;">${level}</span>
        &nbsp;&mdash; ${cleanSummary}
      </p>
    </td></tr>
  </table>`;
};

/**
 * Supply chain status grid — HTML table, colorblind-friendly.
 */
function buildSupplyChainGrid(travelStatus: { location: string; status: string; note: string }[]): string {
  const regions: { region: string; nodes: { name: string; status: string }[] }[] = [
    {
      region: "U.S.\u2013MEXICO BORDER CROSSINGS",
      nodes: [
        { name: "Laredo / Nuevo Laredo", status: "DISRUPTED" },
        { name: "McAllen / Reynosa", status: "DISRUPTED" },
        { name: "Brownsville / Matamoros", status: "DISRUPTED" },
        { name: "Otay Mesa / Tijuana", status: "OPEN" },
        { name: "El Paso / Ju\u00e1rez", status: "OPEN" },
      ],
    },
    {
      region: "MEXICO AIRPORTS",
      nodes: [
        { name: "Mexico City (MEX)", status: "DISRUPTED" },
        { name: "Guadalajara (GDL)", status: "DISRUPTED" },
        { name: "Puerto Vallarta (PVR)", status: "DISRUPTED" },
        { name: "Canc\u00fan (CUN)", status: "OPEN" },
        { name: "Monterrey (MTY)", status: "DISRUPTED" },
        { name: "Tijuana (TIJ)", status: "OPEN" },
      ],
    },
    {
      region: "PACIFIC PORTS",
      nodes: [
        { name: "Manzanillo", status: "OPEN" },
        { name: "L\u00e1zaro C\u00e1rdenas", status: "OPEN" },
        { name: "Guayaquil", status: "OPEN" },
      ],
    },
    {
      region: "GULF / ATLANTIC PORTS",
      nodes: [
        { name: "Veracruz", status: "OPEN" },
        { name: "Cartagena", status: "OPEN" },
      ],
    },
    {
      region: "KEY GROUND CORRIDORS",
      nodes: [
        { name: "GDL\u2013MEX Highway", status: "DISRUPTED" },
        { name: "Laredo\u2013Monterrey Corridor", status: "DISRUPTED" },
        { name: "Pan-American (Central Am)", status: "OPEN" },
      ],
    },
  ];

  // Override statuses from actual travel data
  for (const region of regions) {
    for (const node of region.nodes) {
      const match = travelStatus.find(t => {
        const tLoc = t.location.toUpperCase();
        const nName = node.name.toUpperCase();
        return tLoc.includes(nName.split(" (")[0].split(" /")[0]) ||
               nName.includes(tLoc.split(" (")[0].split(" /")[0]) ||
               (tLoc.includes("PVR") && nName.includes("PUERTO VALLARTA")) ||
               (tLoc.includes("GDL") && nName.includes("GUADALAJARA")) ||
               (tLoc.includes("MEX") && nName.includes("MEXICO CITY")) ||
               (tLoc.includes("CUN") && nName.includes("CANC")) ||
               (tLoc.includes("MTY") && nName.includes("MONTERREY")) ||
               (tLoc.includes("TIJ") && nName.includes("TIJUANA"));
      });
      if (match) node.status = match.status;
    }
  }

  let html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 12px 0 20px; border: 1px solid #999;">`;

  html += `<tr><td colspan="3" style="background: ${TEXT_COLOR}; padding: 8px 12px;">
    <p style="margin: 0; font-size: 9pt; font-family: ${MONO_FONT}; color: #ffffff; letter-spacing: 1px; font-weight: bold; text-align: center;">SUPPLY CHAIN &amp; LOGISTICS \u2014 KEY NODES STATUS</p>
  </td></tr>`;

  html += `<tr><td colspan="3" style="padding: 6px 12px; background: #f5f5f0; border-bottom: 1px solid #999;">
    <span style="font-size: 9pt; font-family: ${MONO_FONT}; color: #333;">
      <span style="display: inline-block; padding: 1px 6px; font-size: 8pt; font-weight: bold; color: ${STATUS_COLORS.OPEN.text}; background: ${STATUS_COLORS.OPEN.bg}; border: 1px solid ${STATUS_COLORS.OPEN.text}; border-radius: 2px;">OPEN</span> &nbsp;&nbsp;
      <span style="display: inline-block; padding: 1px 6px; font-size: 8pt; font-weight: bold; color: ${STATUS_COLORS.DISRUPTED.text}; background: ${STATUS_COLORS.DISRUPTED.bg}; border: 1px solid ${STATUS_COLORS.DISRUPTED.text}; border-radius: 2px;">DISRUPTED</span> &nbsp;&nbsp;
      <span style="display: inline-block; padding: 1px 6px; font-size: 8pt; font-weight: bold; color: ${STATUS_COLORS.CLOSED.text}; background: ${STATUS_COLORS.CLOSED.bg}; border: 1px solid ${STATUS_COLORS.CLOSED.text}; border-radius: 2px;">CLOSED</span>
    </span>
  </td></tr>`;

  for (const region of regions) {
    html += `<tr><td colspan="3" style="background: #e8e8e0; padding: 5px 12px; border-bottom: 1px solid #ccc; border-top: 1px solid #ccc;">
      <p style="margin: 0; font-size: 9pt; font-family: ${MONO_FONT}; color: ${TEXT_COLOR}; font-weight: bold; letter-spacing: 0.5px;">${region.region}</p>
    </td></tr>`;

    for (const node of region.nodes) {
      const sc = STATUS_COLORS[node.status] || STATUS_COLORS.OPEN;
      html += `<tr>
        <td style="padding: 4px 12px; font-size: 11pt; font-family: ${BODY_FONT}; color: ${TEXT_COLOR}; border-bottom: 1px solid #eee; border-left: 3px solid ${sc.text};" colspan="2">${node.name}</td>
        <td style="padding: 4px 12px; border-bottom: 1px solid #eee; text-align: right;">
          <span style="display: inline-block; padding: 1px 8px; font-size: 8pt; font-family: ${MONO_FONT}; font-weight: bold; color: ${sc.text}; background: ${sc.bg}; border: 1px solid ${sc.text}; border-radius: 2px;">${node.status}</span>
        </td>
      </tr>`;
    }
  }

  html += `</table>`;
  return html;
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════

export function briefTemplate({
  subject,
  brief,
  unsubscribeUrl,
  ctaType = "premium",
  campaignId,
}: BriefTemplateOptions): string {
  const developments = normalizeDevelopments(brief.developments);
  const threatColor = THREAT_COLORS[brief.threatLevel] || THREAT_COLORS.MODERATE;
  const dtg = formatDTG();

  let content = "";

  // ── Classification & Header Block ──
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid ${TEXT_COLOR}; margin-bottom: 24px;">
    <tr><td style="background: ${TEXT_COLOR}; padding: 6px 12px; text-align: center;">
      <p style="margin: 0; font-size: 10pt; font-family: ${MONO_FONT}; color: #ffffff; letter-spacing: 2px; font-weight: bold;">UNCLASSIFIED // FOR OFFICIAL USE ONLY</p>
    </td></tr>
    <tr><td style="padding: 16px;">
      <p style="margin: 0 0 4px; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">SERIAL: CENT-DB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001</p>
      <p style="margin: 0 0 4px; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">DTG: ${dtg}</p>
      <p style="margin: 0 0 4px; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">FROM: CENTINELA AI / INTELLIGENCE DIRECTORATE</p>
      <p style="margin: 0 0 4px; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">TO: ALL SUBSCRIBERS</p>
      <p style="margin: 0 0 4px; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">SUBJ: DAILY INTELLIGENCE SUMMARY \u2014 WESTERN HEMISPHERE (LATIN AMERICA &amp; CARIBBEAN)</p>
      <p style="margin: 0 0 0; font-size: 10pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR};">REFERENCE: OPEN SOURCE INTELLIGENCE (OSINT)</p>
    </td></tr>
  </table>`;

  // ── Threat Assessment Banner ──
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid ${threatColor.border}; margin-bottom: 20px;">
    <tr><td style="background: ${threatColor.bg}; padding: 10px 14px;">
      <p style="margin: 0; font-size: 11pt; font-family: ${MONO_FONT}; color: ${threatColor.text}; font-weight: bold; letter-spacing: 1px; text-align: center;">REGIONAL THREAT ASSESSMENT: ${brief.threatLevel}</p>
    </td></tr>
  </table>`;

  // ── BLUF ──
  if (brief.bluf) {
    content += sectionHeader("BOTTOM LINE UP FRONT (BLUF)");
    content += para(brief.bluf);
  }

  // ── WHAT CHANGED ──
  if (brief.whatChanged && brief.whatChanged.length > 0) {
    content += sectionHeader("SUMMARY OF CHANGES (LAST 24 HRS)");
    for (const item of brief.whatChanged) {
      content += bullet(item);
    }
  }

  // ── KEY DEVELOPMENTS ──
  content += sectionHeader("KEY INTELLIGENCE DEVELOPMENTS");
  for (const dev of developments) {
    content += countryDevHeader(dev.country);
    for (const p of dev.paragraphs) {
      content += bullet(p);
    }
  }

  // ── TRAVEL STATUS — stacked cards ──
  if (brief.travelStatus && brief.travelStatus.length > 0) {
    content += sectionHeader("TRAVEL STATUS \u2014 TRANSPORTATION NODES");
    for (const t of brief.travelStatus) {
      content += travelCard(t.location, t.status, t.note);
    }
  }

  // ── SUPPLY CHAIN — grid + text ──
  if (brief.supplyChain) {
    content += sectionHeader("SUPPLY CHAIN &amp; LOGISTICS ASSESSMENT");
    if (brief.travelStatus) {
      content += buildSupplyChainGrid(brief.travelStatus);
    }
    const scParas = brief.supplyChain.split(/\n\n+/).filter((p) => p.trim());
    for (const p of scParas) {
      content += bullet(p.trim());
    }
  }

  // ── Mid-brief CTA ──
  content += renderCTA(ctaType, { campaignId, position: "mid" });

  // ── COUNTRY WATCH — stacked cards ──
  content += sectionHeader("COUNTRY WATCH \u2014 22-NATION STATUS ASSESSMENT");
  for (const c of brief.countries) {
    content += countryWatchCard(c.name, c.summary);
  }

  // ── PERSONNEL ADVISORY ──
  if (brief.personnelAdvisory) {
    content += sectionHeader("PERSONNEL &amp; FORCE PROTECTION ADVISORY");
    const persParas = brief.personnelAdvisory.split(/\n\n+/).filter((p) => p.trim());
    for (const p of persParas) {
      content += bullet(p.trim());
    }
  }

  // ── BUSINESS RISK ──
  if (brief.businessRisk) {
    content += sectionHeader("COMMERCIAL &amp; BUSINESS RISK INDICATORS");
    const brParas = brief.businessRisk.split(/\n\n+/).filter((p) => p.trim());
    for (const p of brParas) {
      content += bullet(p.trim());
    }
  }

  // ── ANALYST ASSESSMENT ──
  content += sectionHeader("ANALYST ASSESSMENT &amp; FORWARD OUTLOOK");
  const anParas = brief.analystNote.split(/\n\n+/).filter((p) => p.trim());
  for (const p of anParas) {
    content += para(p.trim());
  }

  // ── Sign-off ──
  content += `<p style="margin: 16px 0 0; font-size: 12pt; line-height: 1.7; color: ${TEXT_COLOR}; font-family: ${BODY_FONT};">&mdash; Centinela AI</p>`;

  // ── Classification footer ──
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid ${TEXT_COLOR}; margin-top: 28px;">
    <tr><td style="padding: 12px 0;">
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center; letter-spacing: 1px;">UNCLASSIFIED // FOR OFFICIAL USE ONLY</p>
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center;">DERIVED FROM: OPEN SOURCE MATERIALS</p>
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center;">DECLASSIFY ON: SOURCE MARKED FOUO</p>
    </td></tr>
  </table>`;

  // ── Preheader ──
  const firstDev = developments[0];
  const preheaderText = firstDev
    ? `${firstDev.country}: ${firstDev.paragraphs[0]?.substring(0, 80) || ""}`
    : "Daily LatAm security intelligence";

  return baseTemplate({
    content,
    unsubscribeUrl,
    preheader: `${brief.threatLevel} \u2014 ${preheaderText}`,
  });
}
