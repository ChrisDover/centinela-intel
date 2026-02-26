/**
 * Re-send today's brief in standard IC (Intelligence Community) formatting.
 * v4: Stacked travel cards, colorblind-friendly bright colors, 12pt TNR.
 * Usage: DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/send-ic-format-brief.ts
 */

import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { baseTemplate } from "../lib/emails/base-template";

// Fonts
const BODY_FONT = "'Times New Roman', Times, Georgia, serif";
const MONO_FONT = "'Courier New', Courier, monospace";
const TEXT_COLOR = "#000000";
const LABEL_COLOR = "#444444";

// ── Colorblind-friendly palette ──
// Uses blue (not green) for safe, bright orange for caution, bright red for danger.
// High saturation + brightness differences so they're distinguishable even in grayscale.

const THREAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: "#E81123", text: "#ffffff", border: "#E81123" },  // bright red
  HIGH:     { bg: "#F25C05", text: "#ffffff", border: "#F25C05" },  // bright orange-red
  ELEVATED: { bg: "#FF9500", text: "#000000", border: "#FF9500" },  // bright amber
  MODERATE: { bg: "#0078D4", text: "#ffffff", border: "#0078D4" },  // bright blue
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  OPEN:      { bg: "#D4EDFC", text: "#0078D4", label: "OPEN" },       // bright blue
  DISRUPTED: { bg: "#FFF0D4", text: "#D46B08", label: "DISRUPTED" },  // bright amber/orange
  CLOSED:    { bg: "#FFD4D4", text: "#D41A1A", label: "CLOSED" },     // bright red
};

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

// Section header — Courier for IC convention
const sectionHeader = (text: string) =>
  `<p style="margin: 28px 0 6px; font-size: 10pt; line-height: 1.4; color: ${TEXT_COLOR}; font-family: ${MONO_FONT}; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 1px solid ${TEXT_COLOR}; padding-bottom: 4px;">${text}</p>`;

// Body paragraph — 12pt TNR
const para = (text: string) =>
  `<p style="margin: 0 0 10px; font-size: 12pt; line-height: 1.7; color: ${TEXT_COLOR}; font-family: ${BODY_FONT};">${text}</p>`;

// Bullet point — 12pt TNR
const bullet = (text: string) =>
  `<p style="margin: 0 0 6px; font-size: 12pt; line-height: 1.7; color: ${TEXT_COLOR}; font-family: ${BODY_FONT}; padding-left: 16px;">&#8226; ${text}</p>`;

// Country sub-header in developments
const countryHeader = (name: string) =>
  `<p style="margin: 18px 0 6px; font-size: 12pt; line-height: 1.4; color: ${TEXT_COLOR}; font-family: ${BODY_FONT}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px;">${name}</p>`;

// ── Travel status: stacked card per entry ──
// Location + badge on line 1, note as full-width line 2. No cramped columns.
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

// ── Country watch: stacked card per country ──
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
function buildSupplyChainMap(travelStatus: { location: string; status: string; note: string }[]): string {
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

  // Title bar
  html += `<tr><td colspan="3" style="background: ${TEXT_COLOR}; padding: 8px 12px;">
    <p style="margin: 0; font-size: 9pt; font-family: ${MONO_FONT}; color: #ffffff; letter-spacing: 1px; font-weight: bold; text-align: center;">SUPPLY CHAIN &amp; LOGISTICS \u2014 KEY NODES STATUS</p>
  </td></tr>`;

  // Legend row — colorblind-friendly
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

async function main() {
  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York",
  });

  const campaign = await prisma.emailCampaign.findFirst({
    where: { type: "brief", subject: { contains: todayStr } },
    orderBy: { id: "desc" },
  });

  if (!campaign) {
    throw new Error(`No brief found for ${todayStr}`);
  }

  const brief = JSON.parse(campaign.htmlContent as string);
  const dtg = formatDTG();
  const threatColor = THREAT_COLORS[brief.threatLevel] || THREAT_COLORS.MODERATE;

  // === BUILD IC-FORMATTED CONTENT ===
  let content = "";

  // Classification & Header Block
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

  // Threat Assessment — color-coded banner
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid ${threatColor.border}; margin-bottom: 20px;">
    <tr><td style="background: ${threatColor.bg}; padding: 10px 14px;">
      <p style="margin: 0; font-size: 11pt; font-family: ${MONO_FONT}; color: ${threatColor.text}; font-weight: bold; letter-spacing: 1px; text-align: center;">REGIONAL THREAT ASSESSMENT: ${brief.threatLevel}</p>
    </td></tr>
  </table>`;

  // BLUF
  content += sectionHeader("BOTTOM LINE UP FRONT (BLUF)");
  content += para(brief.bluf);

  // SUMMARY OF CHANGES
  content += sectionHeader("SUMMARY OF CHANGES (LAST 24 HRS)");
  for (const item of brief.whatChanged) {
    content += bullet(item);
  }

  // KEY DEVELOPMENTS
  content += sectionHeader("KEY INTELLIGENCE DEVELOPMENTS");
  for (const dev of brief.developments) {
    content += countryHeader(dev.country);
    dev.paragraphs.forEach((p: string) => {
      content += bullet(p);
    });
  }

  // TRAVEL STATUS — stacked cards
  content += sectionHeader("TRAVEL STATUS \u2014 TRANSPORTATION NODES");
  for (const t of brief.travelStatus) {
    content += travelCard(t.location, t.status, t.note);
  }

  // SUPPLY CHAIN — HTML table map + text
  content += sectionHeader("SUPPLY CHAIN &amp; LOGISTICS ASSESSMENT");
  content += buildSupplyChainMap(brief.travelStatus);
  const scParas = brief.supplyChain.split(/\n\n+/).filter((p: string) => p.trim());
  scParas.forEach((p: string) => {
    content += bullet(p.trim());
  });

  // Mid-brief CTA
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #bbbbbb; margin: 24px 0; background: #f8f8f5;">
    <tr><td style="padding: 12px 14px;">
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; font-weight: bold; letter-spacing: 0.5px;">ENHANCED COVERAGE AVAILABLE</p>
      <p style="margin: 0; font-size: 12pt; line-height: 1.7; font-family: ${BODY_FONT}; color: ${TEXT_COLOR};">Country-specific daily briefs: <a href="https://centinelaintel.com/pricing?utm_source=centinela&utm_medium=email&utm_content=ic-brief" style="color: ${TEXT_COLOR}; font-weight: bold;">Centinela Monitor</a> ($29/country/mo). Live intelligence terminal: <a href="https://centinelaintel.com/watch?utm_source=centinela&utm_medium=email&utm_content=ic-brief" style="color: ${TEXT_COLOR}; font-weight: bold;">Watch Pro</a> ($199/mo).</p>
    </td></tr>
  </table>`;

  // COUNTRY WATCH — stacked cards with color-coded threat badges
  content += sectionHeader("COUNTRY WATCH \u2014 22-NATION STATUS ASSESSMENT");
  for (const c of brief.countries) {
    content += countryWatchCard(c.name, c.summary);
  }

  // PERSONNEL ADVISORY
  content += sectionHeader("PERSONNEL &amp; FORCE PROTECTION ADVISORY");
  const persParas = brief.personnelAdvisory.split(/\n\n+/).filter((p: string) => p.trim());
  persParas.forEach((p: string) => {
    content += bullet(p.trim());
  });

  // BUSINESS RISK
  content += sectionHeader("COMMERCIAL &amp; BUSINESS RISK INDICATORS");
  const brParas = brief.businessRisk.split(/\n\n+/).filter((p: string) => p.trim());
  brParas.forEach((p: string) => {
    content += bullet(p.trim());
  });

  // ANALYST ASSESSMENT
  content += sectionHeader("ANALYST ASSESSMENT &amp; FORWARD OUTLOOK");
  const anParas = brief.analystNote.split(/\n\n+/).filter((p: string) => p.trim());
  anParas.forEach((p: string) => {
    content += para(p.trim());
  });

  // Classification footer
  content += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid ${TEXT_COLOR}; margin-top: 28px;">
    <tr><td style="padding: 12px 0;">
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center; letter-spacing: 1px;">UNCLASSIFIED // FOR OFFICIAL USE ONLY</p>
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center;">DERIVED FROM: OPEN SOURCE MATERIALS</p>
      <p style="margin: 0 0 4px; font-size: 9pt; font-family: ${MONO_FONT}; color: ${LABEL_COLOR}; text-align: center;">DECLASSIFY ON: SOURCE MARKED FOUO</p>
      <p style="margin: 0; font-size: 9pt; font-family: ${MONO_FONT}; color: #666; text-align: center;">CENTINELA AI \u2014 A SERVICE OF ENFOCADO CAPITAL LLC</p>
    </td></tr>
  </table>`;

  // Render
  const html = baseTemplate({
    content,
    unsubscribeUrl: "#",
    preheader: `${brief.threatLevel} \u2014 DAILY INTELLIGENCE SUMMARY \u2014 WESTERN HEMISPHERE`,
  });

  // Send
  await resend.emails.send({
    from: "Centinela AI <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[IC FORMAT v4] The Centinela Brief \u2014 ${todayStr}`,
    html,
  });

  console.log(`Sent IC-formatted brief (v4) to chris@centinelaintel.com`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
