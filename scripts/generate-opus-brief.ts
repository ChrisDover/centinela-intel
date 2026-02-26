/**
 * One-off: Generate today's brief with Opus 4.5 and save as draft campaign.
 */

import Anthropic from "@anthropic-ai/sdk";
import prisma from "../lib/prisma";
import { fetchOSINT } from "../lib/ai/fetch-osint";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel. 25+ years experience in global security operations.

Produce a daily intelligence brief covering ALL of Latin America (22 countries). Prioritize by significance.

Style: Direct, varied sentence length, plain language. No AI-speak (underscores, highlights, showcases, pivotal, crucial, landscape, tapestry, fostering, garnering, delve, intricate, amid, amidst, bolster, spearhead). Short focused paragraphs (2-4 sentences each). Name sources. Specific numbers/names/dates. Sound like a smart person briefing another over coffee.

STALE STORIES — SKIP THESE (weeks old, recycled by outlets):
- The 10 Mexican miners abducted/killed (January 2026)
- The 37 Mexican drug gang members extradited to the US

THREAT LEVELS: MODERATE, ELEVATED, HIGH, CRITICAL

NEVER reference your data collection tools or methods (search engines, RSS feeds, web results, etc.) in the brief. Cite the original reporting source (Reuters, AP, El Financiero, etc.), never the aggregator or search tool used to find it.`;

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief",
  input_schema: {
    type: "object" as const,
    properties: {
      bluf: { type: "string", description: "BLUF: 2-3 sentences, most important takeaway." },
      threatLevel: { type: "string", enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"] },
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
        description: "Key developments, 6-12 countries.",
        minItems: 5,
        maxItems: 12,
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: { name: { type: "string" }, summary: { type: "string" } },
          required: ["name", "summary"],
        },
        description:
          "ALL 22 countries: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, Guyana.",
        minItems: 22,
        maxItems: 22,
      },
      whatChanged: {
        type: "array",
        items: { type: "string" },
        description: "WHAT CHANGED — 2-4 bullet points. What is materially different from 24 hours ago? Net new developments only.",
        minItems: 2,
        maxItems: 5,
      },
      travelStatus: {
        type: "array",
        items: {
          type: "object",
          properties: {
            location: { type: "string", description: "Airport code or route name" },
            status: { type: "string", enum: ["OPEN", "DISRUPTED", "CLOSED"] },
            note: { type: "string", description: "One-line operational note" },
          },
          required: ["location", "status", "note"],
        },
        description: "TRAVEL STATUS — Major airports (MEX, GDL, PVR, CUN, MTY, TIJ) and key ground corridors.",
        minItems: 4,
        maxItems: 12,
      },
      supplyChain: {
        type: "string",
        description: "SUPPLY CHAIN & FREIGHT — Key border crossings, ports, freight corridors. Double newlines between paragraphs.",
      },
      personnelAdvisory: {
        type: "string",
        description: "PERSONNEL & EXPAT ADVISORY — Embassy advisories, areas to avoid, duty-of-care guidance. Double newlines between paragraphs.",
      },
      businessRisk: {
        type: "string",
        description: "BUSINESS RISK SIGNALS — Extortion trends, commercial disruption, regulatory impacts. 2-3 sentences.",
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
  const anthropic = new Anthropic();
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

  console.log("Calling Opus 4.5...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    system: SYSTEM_PROMPT,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_brief" },
    messages: [
      {
        role: "user",
        content: `Today is ${todayStr}. Produce the daily Centinela Brief.\n\nOSINT (last 24h). [age] tags show recency. Only last 24-48h as current news.\n\n${osintData}\n\n8-12 countries in developments. ALL 22 countries in country watch. Skip miners and extradition stories.`,
      },
    ],
  });

  const toolBlock = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (toolBlock == null) {
    throw new Error("No tool_use block returned");
  }

  const input = toolBlock.input as Record<string, unknown>;
  const devs = (input.developments as unknown[]) || [];
  const ctrs = (input.countries as unknown[]) || [];

  console.log(`Result: ${input.threatLevel}, ${devs.length} devs, ${ctrs.length} countries`);

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

  // Delete any existing draft for today, create new
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
      notes: "Opus 4.5 + Brave OSINT, 22-country coverage, swapped CTAs",
    },
  });

  console.log(`Campaign created: ${campaign.id}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
