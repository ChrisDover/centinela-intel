/**
 * Core brief generation — calls Brave Search OSINT + Claude to produce BriefData.
 */

import Anthropic from "@anthropic-ai/sdk";
import { fetchOSINT } from "./fetch-osint";
import type { BriefData } from "@/lib/linkedin/post-brief";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience in global security operations. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across ALL of Latin America. The 22 countries in your coverage area: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, and Guyana/Suriname. Prioritize by significance — lead with wherever the most important developments are happening, not the same country order every day.

ANALYTICAL APPROACH:
- Write like a seasoned analyst talking to a peer, not a machine generating a report. Have a voice. Be direct.
- For each country covered in developments, break your analysis into SHORT, FOCUSED PARAGRAPHS. Each paragraph should cover ONE specific subject, event, or dynamic. Do NOT write wall-of-text paragraphs. 2-4 sentences per paragraph is ideal.
- Connect stories across borders where relevant. LatAm security doesn't happen in silos — cartel adaptation in Mexico, energy politics in Venezuela, armed group dynamics in Colombia, and organized crime in Ecuador are often linked.

CRITICAL — EACH SECTION HAS A DISTINCT JOB. DO NOT REPEAT INFORMATION ACROSS SECTIONS:
- KEY DEVELOPMENTS: Report WHAT HAPPENED. Facts, events, incidents from the last 24-48 hours. This is the news section. Who did what, where, when, with what result. No editorializing, no predictions.
- COUNTRY WATCH: Provide STATUS ASSESSMENTS, not event recaps. For each country, give the threat level and the overall security posture. For countries already covered in Key Developments, DO NOT re-describe the same events. Instead, summarize the operating environment: "ELEVATED. Cartel fragmentation and border tensions are driving instability. Watch for spillover into X." For countries NOT in Key Developments, give a brief baseline status.
- ANALYST ASSESSMENT: Look FORWARD. What could happen next? What connections across countries matter? What should a decision-maker prepare for? Do NOT summarize what already happened — the reader just read that. This section is your professional opinion on what's coming and why it matters. Structure as separate paragraphs, one per watch item, with double newlines between them.

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
          "KEY DEVELOPMENTS — WHAT HAPPENED (facts only, no editorializing). Each country gets its own entry with multiple short paragraphs covering different events/subjects. Cover 6-12 countries, ordered by importance. Report the news: who, what, where, when, with what result. Do NOT include threat assessments or predictions here — save those for Country Watch and Analyst Assessment.",
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
                "STATUS ASSESSMENT (not event recap). Start with threat level word (MODERATE/ELEVATED/HIGH/CRITICAL). Then describe the operating environment and posture in 2-3 sentences. For countries covered in Key Developments, DO NOT repeat the same events — instead assess the security climate. For quiet countries, one sentence baseline is fine.",
            },
          },
          required: ["name", "summary"],
        },
        description: "COUNTRY WATCH — STATUS ASSESSMENTS (not event recaps). You MUST include ALL 22 countries: Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru, Bolivia, Brazil, Paraguay, Uruguay, Argentina, Chile, Cuba, Haiti, Dominican Republic, Guyana. DO NOT re-describe events from Key Developments. Instead give the security posture: threat level, what's driving it, what to watch. For quiet countries: 'MODERATE. No significant developments. Baseline conditions.'",
        minItems: 22,
        maxItems: 22,
      },
      analystNote: {
        type: "string",
        description:
          "FORWARD-LOOKING ASSESSMENT — what's coming next, NOT what already happened. The reader just read Key Developments and Country Watch, so DO NOT summarize those events again. Instead: What are the second-order effects? What connections across countries matter? What should a decision-maker prepare for this week? MUST use double newlines (\\n\\n) to separate 3-4 watch items into separate paragraphs. Each paragraph starts with its topic, then explains why you're watching it and what could happen. Write like one analyst thinking out loud, not a committee summary.",
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

  // Trim OSINT to avoid context overflow (~60k chars ≈ ~15k tokens)
  if (osintData.length > 60000) {
    console.log(`[Generate] Trimming OSINT from ${osintData.length} to 60000 chars`);
    osintData = osintData.slice(0, 60000) + "\n\n[OSINT data truncated for size]";
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
- KEY DEVELOPMENTS: Report the news. Facts only. Each country gets MULTIPLE SHORT paragraphs (2-4 sentences each), one subject per paragraph.
- COUNTRY WATCH: Status assessments. DO NOT repeat Key Developments events. Give threat level + operating environment + what to watch. Keep it tight.
- ANALYST ASSESSMENT: Look forward. What's coming? What connections matter? DO NOT summarize what already happened — the reader just read it.
- Each section must add NEW information. If a reader could skip a section without missing anything, you've failed.

IMPORTANT: Only report developments that are CURRENT (last 24-48 hours). If OSINT sources reference older events, note them as context but do NOT present them as new. If an event happened weeks ago, say so explicitly.

Write like a person, not a machine. Vary your sentence length. Be direct. Use specific names, numbers, and sources.`;

  console.log("[Generate] Calling Claude...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
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
