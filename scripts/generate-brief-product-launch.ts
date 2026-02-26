/**
 * Generate today's daily brief with product launch messaging woven in.
 * Uses streaming to avoid network timeout issues.
 * Usage: DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/generate-brief-product-launch.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { fetchOSINT } from "../lib/ai/fetch-osint";
import { briefTemplate } from "../lib/emails/brief-template";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela AI, a Latin America-focused security intelligence firm. You have 25+ years of experience in global security operations. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across ALL of Latin America. The 22 countries in your coverage area: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, and Guyana/Suriname. Prioritize by significance — lead with wherever the most important developments are happening, not the same country order every day.

CRITICAL — LEAD STORY SELECTION:
Do NOT default to leading with Mexico/CJNG every single day just because it generates headlines. Lead with whatever is genuinely the most significant development in the last 24 hours. CJNG is an ongoing story — only lead with it if there's been a genuinely new, material escalation in the past 24 hours. If the most significant new development is in Ecuador, Colombia, or elsewhere, lead with that instead. Readers notice when the same topic leads every day and it signals lazy analysis. Prioritize genuine news value, not headline volume.

ANALYTICAL APPROACH:
- Write like a seasoned analyst talking to a peer, not a machine generating a report. Have a voice. Be direct.
- For each country covered in developments, break your analysis into SHORT, FOCUSED PARAGRAPHS. Each paragraph should cover ONE specific subject, event, or dynamic. Do NOT write wall-of-text paragraphs. 2-4 sentences per paragraph is ideal.
- Connect stories across borders where relevant.

EACH SECTION HAS A DISTINCT JOB. DO NOT REPEAT INFORMATION ACROSS SECTIONS:
- WHAT CHANGED: 2-5 bullet points. Net new developments only.
- KEY DEVELOPMENTS: WHAT HAPPENED. Facts, events, incidents. This is the news section.
- TRAVEL STATUS: Quick-scan status for major airports and ground routes.
- SUPPLY CHAIN & FREIGHT: Key freight corridors and border crossings.
- COUNTRY WATCH: STATUS ASSESSMENTS, not event recaps. DO NOT re-describe Key Developments.
- PERSONNEL & EXPAT ADVISORY: Clear guidance for organizations with people in-region.
- BUSINESS RISK SIGNALS: Directional indicators for corporate decision-makers.
- ANALYST ASSESSMENT: Look FORWARD. What could happen next?

WRITING STYLE:
- Vary sentence length. Short punchy lines mixed with longer analytical ones.
- Use plain language. Say "is" instead of "serves as." Say "confirmed" instead of "underscores."
- Do NOT use AI-sounding words: underscores, highlights, showcases, pivotal, crucial, landscape, tapestry, fostering, garnering, delve, intricate, enduring, testament, amid, amidst, bolster, spearhead, paradigm, synergy.
- Do NOT stack em dashes. Do NOT use rule-of-three lists repeatedly.
- Avoid passive voice. Name sources when possible.
- Include specific numbers, names, dates, and locations.

THREAT LEVELS: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)

SOURCING: NEVER reference data collection tools. Cite original sources (Reuters, AP, El Financiero).`;

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief",
  input_schema: {
    type: "object" as const,
    properties: {
      bluf: { type: "string", description: "BLUF: 2-3 sentences, most important takeaway." },
      threatLevel: { type: "string", enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"] },
      whatChanged: { type: "array", items: { type: "string" }, description: "2-5 bullets of net new.", minItems: 2, maxItems: 5 },
      developments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            country: { type: "string" },
            paragraphs: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
          },
          required: ["country", "paragraphs"],
        },
        description: "KEY DEVELOPMENTS — 6-12 countries, ordered by importance.",
        minItems: 5, maxItems: 12,
      },
      travelStatus: {
        type: "array",
        items: {
          type: "object",
          properties: {
            location: { type: "string" },
            status: { type: "string", enum: ["OPEN", "DISRUPTED", "CLOSED"] },
            note: { type: "string" },
          },
          required: ["location", "status", "note"],
        },
        minItems: 4, maxItems: 12,
      },
      supplyChain: { type: "string" },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: { name: { type: "string" }, summary: { type: "string" } },
          required: ["name", "summary"],
        },
        description: "ALL 22 countries.",
        minItems: 22, maxItems: 22,
      },
      personnelAdvisory: { type: "string" },
      businessRisk: { type: "string" },
      analystNote: { type: "string", description: "Forward-looking assessment. Final paragraph should naturally mention platform improvements — see editorial direction." },
    },
    required: ["bluf", "threatLevel", "whatChanged", "developments", "travelStatus", "supplyChain", "countries", "personnelAdvisory", "businessRisk", "analystNote"],
  },
};

async function main() {
  const anthropic = new Anthropic();
  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });

  console.log(`[ProductLaunch] Generating brief for ${todayStr}...`);

  // Fetch OSINT
  console.log("[ProductLaunch] Fetching OSINT...");
  let osintData = await fetchOSINT();
  console.log(`[ProductLaunch] Raw OSINT: ${osintData.length} chars`);
  if (osintData.length > 20000) {
    osintData = osintData.slice(0, 20000) + "\n\n[OSINT truncated]";
    console.log("[ProductLaunch] Trimmed to 20K");
  }

  const editorialDirection = `
EDITORIAL DIRECTION:
1. Lead with the genuinely most significant story. If CJNG is truly the top story today because of a new material escalation, lead with it. If it's just ongoing coverage, find the real lead.
2. In the ANALYST NOTE final paragraph, naturally mention as the analyst: "You've probably noticed this brief has gotten more extensive. We rebuilt the platform — deeper intelligence, more robust coverage, better sourcing. And we cut pricing dramatically. Monitor is now $29/country ($10 additional), down from $497. Watch Pro live terminal is $199/mo. For organizations needing full data sovereignty, Secure AI is a private LLM deployment on dedicated GPUs, air-gapped and SOC2 compliant. Details at centinelaintel.com/pricing." Write it in the analyst's voice — direct, not salesy.
3. Make this brief noticeably comprehensive. Show the depth.`;

  const userPrompt = `Today is ${todayStr}. Produce the daily Centinela Brief.

OSINT (last 24h):
${osintData}

${editorialDirection}

Use the create_brief tool. 8-12 countries in developments. ALL 22 countries in country watch. Be direct, specific, analytical.`;

  console.log("[ProductLaunch] Calling Claude (streaming)...");

  // Use streaming to avoid network timeout issues with long generation
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    system: SYSTEM_PROMPT,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_brief" },
    messages: [{ role: "user", content: userPrompt }],
  });

  let chunks = 0;
  stream.on("inputJson", () => {
    chunks++;
    if (chunks % 50 === 0) process.stdout.write(".");
  });

  const finalMessage = await stream.finalMessage();
  console.log(`\n[ProductLaunch] Streaming complete (${chunks} chunks)`);

  const toolBlock = finalMessage.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolBlock) {
    throw new Error("No tool_use block returned");
  }

  const input = toolBlock.input as {
    bluf: string;
    threatLevel: string;
    whatChanged: string[];
    developments: { country: string; paragraphs: string[] }[];
    travelStatus: { location: string; status: string; note: string }[];
    supplyChain: string;
    countries: { name: string; summary: string }[];
    personnelAdvisory: string;
    businessRisk: string;
    analystNote: string;
  };

  const briefData = {
    date: todayStr,
    bluf: input.bluf,
    threatLevel: input.threatLevel,
    whatChanged: input.whatChanged,
    developments: input.developments,
    travelStatus: input.travelStatus,
    supplyChain: input.supplyChain,
    countries: input.countries,
    personnelAdvisory: input.personnelAdvisory,
    businessRisk: input.businessRisk,
    analystNote: input.analystNote,
  };

  console.log(`[ProductLaunch] Brief: ${briefData.threatLevel}, ${briefData.developments.length} devs, ${briefData.countries.length} countries`);
  console.log("\n--- PREVIEW ---");
  console.log(`BLUF: ${briefData.bluf}`);
  console.log(`\nWhat Changed:`);
  briefData.whatChanged.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  console.log(`\nDevelopments (${briefData.developments.length}):`);
  briefData.developments.forEach((d) => console.log(`  ${d.country}: ${d.paragraphs.length} para`));
  console.log(`\nAnalyst Note:\n${briefData.analystNote}`);
  console.log("--- END ---\n");

  // Delete existing drafts, create new
  await prisma.emailCampaign.deleteMany({
    where: { status: "draft", type: "brief", subject: { contains: todayStr } },
  });

  const subject = `The Centinela Brief — ${todayStr}`;
  const campaign = await prisma.emailCampaign.create({
    data: {
      type: "brief",
      status: "draft",
      subject,
      htmlContent: JSON.stringify(briefData),
      tags: "premium",
      notes: "Product launch brief — Monitor/Watch Pro/Secure AI pricing woven into analyst note",
    },
  });

  console.log(`[ProductLaunch] Draft campaign: ${campaign.id}`);

  // Render and send preview
  const previewHtml = briefTemplate({
    subject,
    brief: briefData,
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: campaign.id,
  });

  await resend.emails.send({
    from: "Centinela AI <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[APPROVE] ${subject}`,
    html: `<div style="background:#fffbe6;border:2px solid #ffb347;border-radius:8px;padding:16px;margin-bottom:24px;font-family:sans-serif;">
      <p style="margin:0 0 8px;font-weight:bold;color:#1a1a1a;">Product launch brief ready for review.</p>
      <p style="margin:0 0 8px;color:#666;">New pricing woven into analyst note. Approve from admin dashboard to send.</p>
      <p style="margin:0;"><a href="https://centinelaintel.com/admin/dashboard" style="color:#ff6348;font-weight:bold;">Open Admin Dashboard</a> &nbsp;|&nbsp; Campaign ID: ${campaign.id}</p>
    </div>
    ${previewHtml}`,
  });

  console.log(`[ProductLaunch] Preview sent to chris@centinelaintel.com`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
