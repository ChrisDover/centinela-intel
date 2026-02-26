/**
 * Generate today's brief using the updated generate-brief lib (with corporate sections).
 * Uses longer timeout for the Anthropic SDK.
 */

import Anthropic from "@anthropic-ai/sdk";
import prisma from "../lib/prisma";
import { fetchOSINT } from "../lib/ai/fetch-osint";
import resend from "../lib/resend";
import { briefTemplate } from "../lib/emails/brief-template";

// Import the system prompt and tool from generate-brief but with custom timeout
const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience in global security operations.

Produce a daily intelligence brief covering ALL of Latin America (22 countries). Prioritize by significance.

Style: Direct, varied sentence length, plain language. No AI-speak. Short focused paragraphs (2-4 sentences each). Name sources. Specific numbers/names/dates. Sound like a smart person briefing another over coffee.

EACH SECTION HAS A DISTINCT JOB:
- WHAT CHANGED: 2-4 bullets. Net new from yesterday.
- KEY DEVELOPMENTS: WHAT HAPPENED. Facts only.
- TRAVEL STATUS: Airport and ground route status grid.
- SUPPLY CHAIN & FREIGHT: Border crossings, ports, freight corridors.
- COUNTRY WATCH: Status assessments, not event recaps. ALL 22 countries.
- PERSONNEL & EXPAT ADVISORY: Embassy advisories, shelter-in-place, duty-of-care guidance.
- BUSINESS RISK SIGNALS: Extortion trends, commercial disruption, regulatory impacts.
- ANALYST ASSESSMENT: Forward-looking. What's coming next.

Do NOT repeat information across sections.

THREAT LEVELS: MODERATE, ELEVATED, HIGH, CRITICAL

SOURCING: NEVER reference data collection tools or methods. Cite the original reporting source (Reuters, AP, etc.), never the aggregator.`;

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief with corporate-actionable sections",
  input_schema: {
    type: "object" as const,
    properties: {
      bluf: { type: "string", description: "BLUF: 2-3 sentences, most important takeaway." },
      threatLevel: { type: "string", enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"] },
      whatChanged: {
        type: "array",
        items: { type: "string" },
        description: "2-4 bullet points. What is materially different from 24 hours ago?",
        minItems: 2,
        maxItems: 5,
      },
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
        description: "Key developments by country, 6-12 countries.",
        minItems: 5,
        maxItems: 12,
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
        description: "Major airports (MEX, GDL, PVR, CUN, MTY, TIJ) and key ground corridors.",
        minItems: 4,
        maxItems: 12,
      },
      supplyChain: {
        type: "string",
        description: "Key freight corridors, border crossings, ports. Double newlines between paragraphs.",
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: { name: { type: "string" }, summary: { type: "string" } },
          required: ["name", "summary"],
        },
        description: "ALL 22 countries with status assessments.",
        minItems: 22,
        maxItems: 22,
      },
      personnelAdvisory: {
        type: "string",
        description: "Embassy advisories, areas to avoid, duty-of-care guidance. Double newlines between paragraphs.",
      },
      businessRisk: {
        type: "string",
        description: "Extortion trends, commercial disruption, regulatory impacts. 2-3 sentences.",
      },
      analystNote: {
        type: "string",
        description: "Forward-looking assessment. Double newlines between paragraphs. 3-5 watch items.",
      },
    },
    required: ["bluf", "threatLevel", "whatChanged", "developments", "travelStatus", "supplyChain", "countries", "personnelAdvisory", "businessRisk", "analystNote"],
  },
};

async function main() {
  const anthropic = new Anthropic({ timeout: 300000 }); // 5 min timeout
  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });

  console.log("Fetching OSINT...");
  let osintData = await fetchOSINT();
  console.log(`Raw OSINT: ${osintData.length} chars`);
  if (osintData.length > 20000) {
    osintData = osintData.slice(0, 20000) + "\n\n[OSINT truncated]";
    console.log("Trimmed to 20K");
  }

  console.log("Calling Claude (Sonnet 4.6) with streaming...");
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    system: SYSTEM_PROMPT,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_brief" },
    messages: [
      {
        role: "user",
        content: `Today is ${todayStr}. Produce the daily Centinela Brief.\n\nOSINT (last 24h). [age] tags show recency. Only last 24-48h as current news.\n\n${osintData}\n\n8-12 countries in developments. ALL 22 countries in country watch.`,
      },
    ],
  });

  // Log progress
  stream.on("text", () => process.stdout.write("."));

  const response = await stream.finalMessage();
  console.log("\nGeneration complete.");

  const toolBlock = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolBlock) throw new Error("No tool_use block returned");

  const input = toolBlock.input as Record<string, unknown>;
  const devs = (input.developments as unknown[]) || [];
  const ctrs = (input.countries as unknown[]) || [];

  console.log(`Result: ${input.threatLevel}, ${devs.length} devs, ${ctrs.length} countries`);
  console.log(`What Changed: ${(input.whatChanged as string[])?.length || 0} items`);
  console.log(`Travel Status: ${(input.travelStatus as unknown[])?.length || 0} entries`);
  console.log(`Supply Chain: ${((input.supplyChain as string) || "").length} chars`);
  console.log(`Personnel Advisory: ${((input.personnelAdvisory as string) || "").length} chars`);
  console.log(`Business Risk: ${((input.businessRisk as string) || "").length} chars`);

  const briefData = {
    date: todayStr,
    bluf: input.bluf || "",
    threatLevel: input.threatLevel,
    whatChanged: (input.whatChanged as string[]) || [],
    developments: devs,
    travelStatus: (input.travelStatus as { location: string; status: string; note: string }[]) || [],
    supplyChain: (input.supplyChain as string) || "",
    countries: ctrs,
    personnelAdvisory: (input.personnelAdvisory as string) || "",
    businessRisk: (input.businessRisk as string) || "",
    analystNote: input.analystNote || "",
  };

  // Delete existing drafts for today
  await prisma.emailCampaign.deleteMany({
    where: { status: "draft", type: "brief", subject: { contains: todayStr } },
  });

  const campaign = await prisma.emailCampaign.create({
    data: {
      type: "brief",
      status: "draft",
      subject: `The Centinela Brief — ${todayStr}`,
      htmlContent: JSON.stringify(briefData),
      tags: "premium",
      notes: "Sonnet 4.6 + OSINT, corporate sections (travel, supply chain, personnel, business risk)",
    },
  });

  console.log(`Campaign created: ${campaign.id}`);

  // Send preview
  const previewHtml = briefTemplate({
    subject: `The Centinela Brief — ${todayStr}`,
    brief: briefData,
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: campaign.id,
  });

  const preview = await resend.emails.send({
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[PREVIEW] The Centinela Brief — ${todayStr}`,
    html: previewHtml,
  });

  console.log(`Preview sent: ${preview.data?.id}`);
  console.log(`\nTo send to full list:\nnpx tsx scripts/send-campaign.ts ${campaign.id}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
