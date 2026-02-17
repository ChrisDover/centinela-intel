/**
 * Core brief generation — calls Brave Search OSINT + Claude to produce BriefData.
 */

import Anthropic from "@anthropic-ai/sdk";
import { fetchOSINT } from "./fetch-osint";
import type { BriefData } from "@/lib/linkedin/post-brief";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience including 8+ years of in-country operations across Latin America. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across ALL of Latin America. The 22 countries in your coverage area: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, and Guyana/Suriname. Prioritize by significance — lead with wherever the most important developments are happening, not the same country order every day.

ANALYTICAL APPROACH:
- Write like a seasoned analyst talking to a peer, not a machine generating a report. Have a voice. Be direct.
- For each country covered in developments, break your analysis into SHORT, FOCUSED PARAGRAPHS. Each paragraph should cover ONE specific subject, event, or dynamic. Do NOT write wall-of-text paragraphs. 2-4 sentences per paragraph is ideal.
- Connect stories across borders where relevant. LatAm security doesn't happen in silos — cartel adaptation in Mexico, energy politics in Venezuela, armed group dynamics in Colombia, and organized crime in Ecuador are often linked.
- Country summaries should be substantive (3-5 sentences), including threat level, what's driving it, and what to watch.
- The analyst note MUST be structured as separate paragraphs, one per watch item. Start each paragraph with a clear topic sentence. Use double newlines between paragraphs.

WRITING STYLE — CRITICAL:
- Vary sentence length. Short punchy lines mixed with longer analytical ones.
- Use plain language. Say "is" instead of "serves as." Say "confirmed" instead of "underscores." Say "important" instead of "pivotal/crucial/vital."
- Do NOT use these AI-sounding words: underscores, highlights, showcases, pivotal, crucial, landscape, tapestry, fostering, garnering, delve, intricate, enduring, testament, vibrant, nestled, underscore, highlight, remains, continues to, trajectory, dynamics, amid, amidst, bolster, spearhead, paradigm, synergy.
- Do NOT stack em dashes. Use them sparingly. Prefer periods and commas.
- Do NOT use rule-of-three lists ("X, Y, and Z" repeated in every sentence).
- Do NOT use -ing participial phrases to pad sentences ("highlighting the...", "underscoring the...", "reflecting broader..."). Just state what happened and why it matters.
- Do NOT use "Meanwhile" or "Furthermore" as paragraph transitions. Just start the new point.
- Avoid passive voice. "The cartel attacked" not "an attack was carried out."
- Name sources when possible (AP, Reuters, ACLED, etc.) instead of vague "analysts say" or "reports indicate."
- Include specific numbers, names, dates, and locations. Specificity is credibility.
- Read each paragraph out loud in your head. If it sounds like a press release or academic paper, rewrite it. It should sound like a smart person briefing another smart person over coffee.

THREAT LEVELS: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)

If OSINT data is thin for a day, use your knowledge of ongoing regional dynamics to fill gaps — flag when doing so.

STALE STORIES — SKIP THESE (weeks old, recycled by outlets):
- The 10 Mexican miners abducted/killed (January 2026 — NOT new)
- The 37 Mexican drug gang members extradited to the US (old news)
If these appear in OSINT feeds, do NOT include them as current developments.`;

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief",
  input_schema: {
    type: "object" as const,
    properties: {
      bluf: {
        type: "string",
        description:
          "BLUF (Bottom Line Up Front): 2-3 sentences that capture the single most important takeaway from today's intelligence picture. What does a busy executive need to know RIGHT NOW? Be direct, specific, and actionable. No filler.",
      },
      threatLevel: {
        type: "string",
        enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
        description: "Overall regional threat level for the day",
      },
      developments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            country: {
              type: "string",
              description:
                "Country or region name (e.g. Mexico, Ecuador, Central America)",
            },
            paragraphs: {
              type: "array",
              items: { type: "string" },
              description:
                "Array of short focused paragraphs (2-4 sentences each). Each paragraph covers ONE specific event, subject, or dynamic. Do NOT combine multiple subjects into one paragraph.",
              minItems: 1,
              maxItems: 5,
            },
          },
          required: ["country", "paragraphs"],
        },
        description:
          "Key developments grouped by country. Each country gets its own entry with multiple short paragraphs covering different subjects. Cover 6-12 countries across the full region, ordered by importance. Always cover the major countries (Mexico, Colombia, Venezuela, Ecuador, Brazil) plus any others with significant developments.",
        minItems: 5,
        maxItems: 12,
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Country name" },
            summary: {
              type: "string",
              description:
                "3-5 sentence security summary including threat level, drivers, and what to watch",
            },
          },
          required: ["name", "summary"],
        },
        description: "Country-by-country security assessments. You MUST include ALL 22 Latin American countries: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, Guyana. Every country gets a summary even if brief (e.g. 'MODERATE. No significant security developments in the last 24 hours. Baseline conditions.').",
        minItems: 22,
        maxItems: 22,
      },
      analystNote: {
        type: "string",
        description:
          "Forward-looking analyst assessment. MUST use double newlines (\\n\\n) to separate each watch item into its own paragraph. Each paragraph should start with its topic, then explain why you're watching it and what could happen. 3-4 watch items, each its own paragraph. Write like one person thinking out loud, not a committee list.",
      },
    },
    required: ["bluf", "threatLevel", "developments", "countries", "analystNote"],
  },
};

export async function generateDailyBrief(): Promise<BriefData> {
  const anthropic = new Anthropic();
  const todayStr = getTodayFormatted();

  // Gather OSINT
  console.log("[Generate] Fetching OSINT data...");
  let osintData = await fetchOSINT();

  // Trim OSINT to avoid socket/timeout issues with very large payloads
  if (osintData.length > 20000) {
    console.log(`[Generate] Trimming OSINT from ${osintData.length} to 20000 chars`);
    osintData = osintData.slice(0, 20000) + "\n\n[OSINT data truncated for size]";
  }

  const osintSection = osintData
    ? `Here is today's OSINT data from Brave Search and Google News (last 24 hours). Pay attention to [age] tags — they show how old each article is. ONLY use articles from the last 24-48 hours as primary sources.\n\n${osintData}`
    : "No OSINT feed available today. Use your knowledge of current regional dynamics to produce the brief.";

  const userPrompt = `Today is ${todayStr}. Produce the daily Centinela Brief.

${osintSection}

Use the create_brief tool to return the structured brief data. Aim for 8-12 countries in the KEY DEVELOPMENTS section, covering wherever the most significant events are happening.

For the COUNTRY WATCH section, you MUST include ALL 22 countries: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, Guyana. Every single one. For countries with no major developments, a 1-2 sentence baseline status is fine (e.g. "MODERATE. No significant security incidents in the last 24 hours.").

IMPORTANT FORMATTING RULES:
- BLUF: Start with the single most important thing happening today. 2-3 punchy sentences. If a busy person reads nothing else, they get the picture from this.
- For developments: each country gets its own object with MULTIPLE SHORT paragraphs (2-4 sentences each). Break analysis into separate paragraphs by subject. ONE subject per paragraph. If Mexico has cartel infighting AND a displacement crisis, those are two separate paragraphs.
- For the analyst note: use double newlines between each watch item. Each watch item is its own paragraph starting with its topic. Do NOT write one continuous block of text.

IMPORTANT: Only report developments that are CURRENT (last 24-48 hours). If OSINT sources reference older events, note them as context but do NOT present them as new. If an event happened weeks ago, say so explicitly.

Write like a person, not a machine. Vary your sentence length. Be direct. Use specific names, numbers, and sources.`;

  console.log("[Generate] Calling Claude...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
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
    bluf: string;
    threatLevel: string;
    developments: { country: string; paragraphs: string[] }[];
    countries: { name: string; summary: string }[];
    analystNote: string;
  };

  const briefData: BriefData = {
    date: todayStr,
    bluf: input.bluf,
    threatLevel: input.threatLevel,
    developments: input.developments,
    countries: input.countries,
    analystNote: input.analystNote,
  };

  console.log(
    `[Generate] Brief generated: ${briefData.threatLevel}, ${briefData.developments.length} developments, ${briefData.countries.length} countries`
  );
  return briefData;
}
