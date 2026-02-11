/**
 * Core brief generation — calls Brave Search OSINT + Claude to produce BriefData.
 */

import Anthropic from "@anthropic-ai/sdk";
import { fetchOSINT } from "./fetch-osint";
import type { BriefData } from "@/lib/linkedin/post-brief";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience including 8+ years of in-country operations across Latin America. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across Latin America, with focus areas: Mexico, Venezuela, Colombia, Ecuador, and notable events in Central America and the broader region.

Guidelines:
- Write in a concise, professional intelligence style — no filler, no speculation beyond what evidence supports
- Prioritize developments by operational impact: violence, political instability, infrastructure disruption, cartel activity, kidnappings
- Each development should be 1-2 sentences, actionable and specific
- Country summaries should be 2-3 sentences capturing the current security posture
- The analyst note should provide forward-looking assessment (2-3 sentences)
- Threat levels: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)
- If OSINT data is thin for a day, use your knowledge of ongoing regional dynamics to fill gaps — flag when doing so`;

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
        description: "Top 5-6 key security developments, ordered by importance",
        minItems: 3,
        maxItems: 6,
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Country name" },
            summary: { type: "string", description: "2-3 sentence security summary" },
          },
          required: ["name", "summary"],
        },
        description: "Country-by-country security assessments",
        minItems: 3,
        maxItems: 6,
      },
      analystNote: {
        type: "string",
        description: "Forward-looking analyst assessment (2-3 sentences)",
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

Use the create_brief tool to return the structured brief data. Focus on Mexico, Venezuela, Colombia, Ecuador, and any notable Central American or broader LatAm developments.`;

  console.log("[Generate] Calling Claude...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
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
