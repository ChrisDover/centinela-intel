/**
 * Core brief generation — calls Brave Search OSINT + Claude to produce BriefData.
 */

import Anthropic from "@anthropic-ai/sdk";
import { fetchOSINT } from "./fetch-osint";
import type { BriefData } from "@/lib/linkedin/post-brief";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience including 8+ years of in-country operations across Latin America. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across Latin America, with focus areas: Mexico, Venezuela, Colombia, Ecuador, and notable events in Central America and the broader region.

ANALYTICAL APPROACH:
- Write like a seasoned analyst talking to a peer, not a machine generating a report. Have a voice. Be direct.
- Go deep on the 2-3 biggest stories of the day. Each top development should be a full analytical paragraph (4-8 sentences) that explains what happened, why it matters, and what it connects to. Do not write shallow one-liners.
- Connect stories across borders. LatAm security doesn't happen in silos — cartel adaptation in Mexico, energy politics in Venezuela, armed group dynamics in Colombia, and organized crime in Ecuador are often linked. Draw those connections explicitly.
- Country summaries should be substantive (3-5 sentences), including threat level, what's driving it, and what to watch.
- The analyst note should name specific things to monitor in the next 72 hours with actual reasoning, not generic "monitor the situation" language. Structure it around 2-4 concrete watch items.

WRITING STYLE — CRITICAL:
- Vary sentence length. Short punchy lines mixed with longer analytical ones.
- Use plain language. Say "is" instead of "serves as." Say "confirmed" instead of "underscores." Say "important" instead of "pivotal/crucial/vital."
- Do NOT use these AI-sounding words: underscores, highlights, showcases, pivotal, crucial, landscape, tapestry, fostering, garnering, delve, intricate, enduring, testament, vibrant, nestled.
- Do NOT stack em dashes. Use them sparingly. Prefer periods and commas.
- Do NOT use rule-of-three lists ("X, Y, and Z" repeated in every sentence).
- Do NOT use -ing participial phrases to pad sentences ("highlighting the...", "underscoring the...", "reflecting broader..."). Just state what happened and why it matters.
- Name sources when possible (AP, Reuters, ACLED, etc.) instead of vague "analysts say" or "reports indicate."
- Include specific numbers, names, dates, and locations. Specificity is credibility.
- The analyst note should read like one person thinking out loud about what's coming, not a committee drafting bullet points.

THREAT LEVELS: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)

If OSINT data is thin for a day, use your knowledge of ongoing regional dynamics to fill gaps — flag when doing so.`;

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief",
  input_schema: {
    type: "object" as const,
    properties: {
      threatLevel: {
        type: "string",
        enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
        description: "Overall regional threat level for the day",
      },
      developments: {
        type: "array",
        items: { type: "string" },
        description:
          "Top 5-6 key security developments, ordered by importance. The top 2-3 should be full analytical paragraphs (4-8 sentences each). Secondary items can be shorter.",
        minItems: 3,
        maxItems: 6,
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Country name" },
            summary: { type: "string", description: "3-5 sentence security summary including threat level, drivers, and what to watch" },
          },
          required: ["name", "summary"],
        },
        description: "Country-by-country security assessments",
        minItems: 3,
        maxItems: 6,
      },
      analystNote: {
        type: "string",
        description:
          "Forward-looking analyst assessment structured around 2-4 specific watch items for the next 72 hours, with reasoning. Should read like one person thinking, not a committee list.",
      },
    },
    required: ["threatLevel", "developments", "countries", "analystNote"],
  },
};

export async function generateDailyBrief(): Promise<BriefData> {
  const anthropic = new Anthropic();
  const todayStr = getTodayFormatted();

  // Gather OSINT
  console.log("[Generate] Fetching OSINT data...");
  const osintData = await fetchOSINT();

  const osintSection = osintData
    ? `Here is today's OSINT data from regional security monitoring:\n\n${osintData}`
    : "No OSINT feed available today. Use your knowledge of current regional dynamics to produce the brief.";

  const userPrompt = `Today is ${todayStr}. Produce the daily Centinela Brief.

${osintSection}

Use the create_brief tool to return the structured brief data. Cover Mexico, Venezuela, Colombia, Ecuador, and any notable Central American or broader LatAm developments.

Go deep on the biggest 2-3 stories. Each top development should be a full paragraph with real analysis — what happened, why it matters, what it connects to across the region. Don't write shallow summaries. Connect dots between countries where the stories intersect (border dynamics, cartel adaptation, geopolitical shifts, narcotrafficking corridors).

Write like a person, not a machine. Vary your sentence length. Be direct. Use specific names, numbers, and sources.`;

  console.log("[Generate] Calling Claude...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_brief" },
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract tool use result
  const toolBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolBlock) {
    throw new Error("Claude did not return a tool_use block");
  }

  const input = toolBlock.input as {
    threatLevel: string;
    developments: string[];
    countries: { name: string; summary: string }[];
    analystNote: string;
  };

  const briefData: BriefData = {
    date: todayStr,
    threatLevel: input.threatLevel,
    developments: input.developments,
    countries: input.countries,
    analystNote: input.analystNote,
  };

  console.log(`[Generate] Brief generated: ${briefData.threatLevel}, ${briefData.developments.length} developments, ${briefData.countries.length} countries`);
  return briefData;
}
