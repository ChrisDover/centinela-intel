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
- WHAT CHANGED (since yesterday): 2-4 bullet points. What is materially different from 24 hours ago? Net new developments only. If a busy person read yesterday's brief, this tells them what's new. Example: "90% of Jalisco blockades cleared overnight. PVR flights partially resuming. No second wave of retaliatory violence. U.S. Embassy issued third security alert update."
- KEY DEVELOPMENTS: Report WHAT HAPPENED. Facts, events, incidents from the last 24-48 hours. This is the news section. Who did what, where, when, with what result. No editorializing, no predictions.
- TRAVEL STATUS: Quick-scan status for major airports and ground routes. For each entry: location, status (OPEN / DISRUPTED / CLOSED), and one-line note. Cover at minimum: Mexico City (MEX/AIFA), Guadalajara (GDL), Puerto Vallarta (PVR), Cancun (CUN), Monterrey (MTY), Tijuana (TIJ), and any other airports affected by current events. Also cover key ground corridors when relevant (GDL-MEX highway, Laredo crossing, etc.). If an airport is fully normal, say so — that's useful information too.
- SUPPLY CHAIN & FREIGHT: Status of key freight corridors and border crossings relevant to business operations. Cover: major border crossings (Laredo/Nuevo Laredo, Otay Mesa, Reynosa/McAllen, Matamoros/Brownsville), key ports (Manzanillo, Lazaro Cardenas, Veracruz), and major trucking routes when disrupted. Include estimated delay times when available. If corridors are flowing normally, say so.
- COUNTRY WATCH: Provide STATUS ASSESSMENTS, not event recaps. For each country, give the threat level and the overall security posture. For countries already covered in Key Developments, DO NOT re-describe the same events. Instead, summarize the operating environment: "ELEVATED. Cartel fragmentation and border tensions are driving instability. Watch for spillover into X." For countries NOT in Key Developments, give a brief baseline status.
- PERSONNEL & EXPAT ADVISORY: Clear, direct guidance for organizations with people in-region. Which embassy shelter-in-place advisories are active? Which states/cities should personnel avoid? Is it safe to resume normal movement? What should duty-of-care officers communicate to staff? This is the section corporate security directors forward to HR and legal.
- BUSINESS RISK SIGNALS: Short directional indicators for corporate decision-makers. Extortion trends (up/down/stable in key metros), commercial disruption status, insurance/liability considerations, and any regulatory or political developments that affect business operations. Example: "Extortion risk trending UP in Guadalajara metro as CJNG cells operate without centralized oversight. Jalisco state emergency protocols may delay permitting and regulatory processes."
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
If these appear in OSINT feeds, do NOT include them as current developments.

SOURCING: NEVER reference your data collection tools or methods (search engines, RSS feeds, web results, etc.) in the brief. Cite the original reporting source (Reuters, AP, El Financiero, etc.), never the aggregator or search tool used to find it.`;

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
      whatChanged: {
        type: "array",
        items: { type: "string" },
        description:
          "WHAT CHANGED SINCE YESTERDAY — 2-4 short bullet points. Net new developments only. What is materially different from 24 hours ago? Each item should be one direct sentence. Example: 'PVR flights partially resuming — United and Delta operating limited schedules.' This is for the reader who read yesterday's brief and needs the delta.",
        minItems: 2,
        maxItems: 5,
      },
      travelStatus: {
        type: "array",
        items: {
          type: "object",
          properties: {
            location: { type: "string", description: "Airport code or route name, e.g. 'Puerto Vallarta (PVR)' or 'GDL-MEX Highway'" },
            status: { type: "string", enum: ["OPEN", "DISRUPTED", "CLOSED"], description: "Current operational status" },
            note: { type: "string", description: "One-line operational note, e.g. 'Partial flight resumption. 60% of carriers operating. Access roads clear.'" },
          },
          required: ["location", "status", "note"],
        },
        description: "TRAVEL STATUS — Quick-scan grid for corporate travel managers. Cover major Mexico airports (MEX, GDL, PVR, CUN, MTY, TIJ) and any other affected airports. Include key ground corridors when relevant. Always include entries even when things are normal — 'OPEN. Normal operations.' is useful data.",
        minItems: 4,
        maxItems: 12,
      },
      supplyChain: {
        type: "string",
        description: "SUPPLY CHAIN & FREIGHT — Status of key freight corridors, border crossings, and ports. Cover Laredo/Nuevo Laredo, Otay Mesa, Reynosa/McAllen, Manzanillo, Lazaro Cardenas. Include delay estimates when available. 2-4 short paragraphs. Use double newlines between paragraphs. If everything is flowing normally, say so clearly — that's actionable for logistics teams.",
      },
      personnelAdvisory: {
        type: "string",
        description: "PERSONNEL & EXPAT ADVISORY — Clear guidance for organizations with people in-region. Which embassy advisories are active? Which areas to avoid? Safe to resume normal movement? What should duty-of-care officers tell staff? 2-3 short paragraphs separated by double newlines. Be specific and directive — 'Shelter-in-place remains active for Jalisco, Quintana Roo, and Tamaulipas' not vague 'exercise caution.'",
      },
      businessRisk: {
        type: "string",
        description: "BUSINESS RISK SIGNALS — Directional indicators for corporate decision-makers. Extortion trends (up/down/stable by metro), commercial disruption status, regulatory impacts, insurance considerations. 2-3 sentences. Be specific: 'Extortion risk trending UP in Guadalajara metro' not generic 'businesses should be cautious.'",
      },
      analystNote: {
        type: "string",
        description:
          "FORWARD-LOOKING ASSESSMENT — what's coming next, NOT what already happened. The reader just read Key Developments and Country Watch, so DO NOT summarize those events again. Instead: What are the second-order effects? What connections across countries matter? What should a decision-maker prepare for this week? MUST use double newlines (\\n\\n) to separate 3-4 watch items into separate paragraphs. Each paragraph starts with its topic, then explains why you're watching it and what could happen. Write like one analyst thinking out loud, not a committee summary.",
      },
    },
    required: ["bluf", "threatLevel", "whatChanged", "developments", "travelStatus", "supplyChain", "countries", "personnelAdvisory", "businessRisk", "analystNote"],
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
    ? `Here is today's OSINT data (last 24 hours). Pay attention to [age] tags — they show how old each article is. ONLY use articles from the last 24-48 hours as primary sources.\n\n${osintData}`
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
    max_tokens: 12000,
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
    whatChanged: string[];
    developments: { country: string; paragraphs: string[] }[];
    travelStatus: { location: string; status: string; note: string }[];
    supplyChain: string;
    countries: { name: string; summary: string }[];
    personnelAdvisory: string;
    businessRisk: string;
    analystNote: string;
  };

  const briefData: BriefData = {
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

  console.log(
    `[Generate] Brief generated: ${briefData.threatLevel}, ${briefData.developments.length} developments, ${briefData.countries.length} countries`
  );
  return briefData;
}
