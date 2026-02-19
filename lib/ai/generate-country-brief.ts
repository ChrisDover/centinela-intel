/**
 * Country-specific brief generation — focused OSINT + Claude analysis for a single country.
 */

import Anthropic from "@anthropic-ai/sdk";

const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

export interface Incident {
  title: string;
  description: string;
  city: string;
  lat: number;
  lng: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string; // e.g. "cartel", "political", "crime", "infrastructure", "protest"
  sourceUrl?: string; // URL of the source article from OSINT data
}

export interface RegionAssessment {
  name: string; // state/region name
  threatLevel: string;
  summary: string;
}

export interface CountryBriefData {
  date: string;
  country: string;
  countryName: string;
  threatLevel: string;
  whatChanged: string[]; // 3-5 strictly new events (last 24h) with source citations
  travelAdvisory: string; // 2-3 sentence specific travel posture
  developments: string[];
  keyRisks: string[];
  analystNote: string;
  incidents: Incident[];
  regions: RegionAssessment[];
}

interface BraveSearchResult {
  title: string;
  description: string;
  url: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveSearchResult[];
  };
}

async function searchBrave(
  query: string,
  apiKey: string
): Promise<BraveSearchResult[]> {
  const url = new URL(BRAVE_SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("freshness", "pd");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!res.ok) {
    console.error(`[Country OSINT] Brave Search failed for "${query}": ${res.status}`);
    return [];
  }

  const data: BraveSearchResponse = await res.json();
  return data.web?.results ?? [];
}

async function fetchCountryOSINT(countryName: string, focusAreas: string[] = []): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn("[Country OSINT] BRAVE_SEARCH_API_KEY not set");
    return "";
  }

  const queries = [
    `${countryName} security threat violence today`,
    `${countryName} cartel organized crime today`,
    `${countryName} political crisis protest today`,
    `${countryName} kidnapping extortion robbery today`,
    `${countryName} business economy security risk today`,
    `${countryName} travel advisory embassy warning today`,
    `${countryName} seguridad violencia hoy`,
    `${countryName} crimen organizado narcotráfico hoy`,
    `${countryName} secuestro extorsión hoy`,
  ];

  // Add focus-area queries (up to 3)
  for (const area of focusAreas.slice(0, 3)) {
    queries.push(`${countryName} ${area} security violence today`);
  }

  try {
    const allResults = await Promise.all(
      queries.map((q) => searchBrave(q, apiKey))
    );

    const sections: string[] = [];
    for (let i = 0; i < queries.length; i++) {
      const results = allResults[i];
      if (results.length === 0) continue;
      const items = results
        .map((r) => `- ${r.title}: ${r.description} [Source: ${r.url}]`)
        .join("\n");
      sections.push(`## ${queries[i]}\n${items}`);
    }

    return sections.join("\n\n");
  } catch (error) {
    console.error("[Country OSINT] Fetch failed:", error);
    return "";
  }
}

const COUNTRY_SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel with 25+ years in global security operations and deep Latin America expertise.

Produce a country-specific daily intelligence brief. This is a premium product ($500/month) — every line must justify the price.

STRICT RULES:
1. Every development, risk, and incident MUST include a date and source reference from the OSINT feed. Format: "...event description (Source Name, Date)" — e.g. "(Reuters, Feb 18)" or "(El Universal, 18 Feb)".
2. The "whatChanged" field is ONLY for events that happened in the last 24 hours. Each entry must cite a specific source from the OSINT feed.
3. For incidents: ONLY include events you can trace to a specific article in the OSINT feed. Every incident MUST have a sourceUrl from the feed. Do NOT fabricate or invent incidents.
4. Developments should be analytical, not encyclopedic. Mix breaking events with ongoing dynamics. Explain WHY something matters operationally, not just WHAT happened.
5. Key risks must be specific and actionable with evidence — not generic warnings. Bad: "Travelers should exercise caution." Good: "Overland routes between Guadalajara and Puerto Vallarta face elevated carjacking risk following two incidents on Highway 15D this week (Milenio, Feb 17)."
6. Travel advisory must name specific regions, times of day, or transport modes to avoid — not generic "exercise caution" language.
7. Analyst note must be forward-looking: what happens next, what to watch for, what could escalate. No generic advice.
8. Threat levels: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis).
9. For incidents: provide REAL city names and ACCURATE lat/lng coordinates. These plot on a map — accuracy matters.
10. For regions: assess 3-5 key states/departments/provinces with their own threat levels and specific justification.

BANNED PHRASES: "underscores", "highlights", "pivotal", "it is important to note", "remains to be seen", "the landscape", "in the wake of", "amid growing concerns", "serves as a reminder". Write like a field operator, not a think tank.`;

const COUNTRY_BRIEF_TOOL: Anthropic.Tool = {
  name: "create_country_brief",
  description:
    "Create a structured country-specific intelligence brief with geolocated incidents and regional assessments",
  input_schema: {
    type: "object" as const,
    properties: {
      threatLevel: {
        type: "string",
        enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
        description: "Country threat level for today",
      },
      whatChanged: {
        type: "array",
        items: { type: "string" },
        description:
          "3-5 events that happened in the LAST 24 HOURS ONLY. Each must cite a source from the OSINT feed. These are strictly new developments, not ongoing situations.",
        minItems: 2,
        maxItems: 5,
      },
      travelAdvisory: {
        type: "string",
        description:
          "2-3 sentences of specific travel posture guidance. Name regions, routes, times, or transport modes. No generic 'exercise caution' language.",
      },
      developments: {
        type: "array",
        items: { type: "string" },
        description:
          "4-6 key security developments — analytical, not encyclopedic. Mix new events with ongoing dynamics. Each must include a date and source reference.",
        minItems: 3,
        maxItems: 6,
      },
      keyRisks: {
        type: "array",
        items: { type: "string" },
        description:
          "3-4 specific, actionable risks with evidence. Each must reference a source or data point. Written for corporate security teams making operational decisions.",
        minItems: 2,
        maxItems: 4,
      },
      analystNote: {
        type: "string",
        description:
          "Forward-looking analyst assessment (2-3 sentences). Predict what happens next, name triggers to watch, assess escalation probability. No generic advice.",
      },
      incidents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Short incident title (5-10 words)",
            },
            description: {
              type: "string",
              description: "1-2 sentence incident description with date",
            },
            city: {
              type: "string",
              description: "City or locality name",
            },
            lat: {
              type: "number",
              description: "Latitude of the city (accurate coordinates)",
            },
            lng: {
              type: "number",
              description: "Longitude of the city (accurate coordinates)",
            },
            severity: {
              type: "string",
              enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
            },
            category: {
              type: "string",
              enum: [
                "cartel",
                "political",
                "crime",
                "infrastructure",
                "protest",
                "kidnapping",
                "extortion",
              ],
            },
            sourceUrl: {
              type: "string",
              description:
                "REQUIRED: URL of the source article from the OSINT feed. Every incident must be traceable to a source.",
            },
          },
          required: [
            "title",
            "description",
            "city",
            "lat",
            "lng",
            "severity",
            "category",
            "sourceUrl",
          ],
        },
        description:
          "5-8 geolocated security incidents. ONLY from the OSINT feed — do NOT fabricate. Each must have a sourceUrl.",
        minItems: 4,
        maxItems: 8,
      },
      regions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "State, department, or province name",
            },
            threatLevel: {
              type: "string",
              enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
            },
            summary: {
              type: "string",
              description: "1-2 sentence assessment with specific justification",
            },
          },
          required: ["name", "threatLevel", "summary"],
        },
        description:
          "3-5 regional/state-level threat assessments within the country",
        minItems: 3,
        maxItems: 5,
      },
    },
    required: [
      "threatLevel",
      "whatChanged",
      "travelAdvisory",
      "developments",
      "keyRisks",
      "analystNote",
      "incidents",
      "regions",
    ],
  },
};

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateCountryBrief(
  country: string,
  countryName: string,
  focusAreas: string[] = []
): Promise<CountryBriefData> {
  const anthropic = new Anthropic();
  const todayStr = getTodayFormatted();

  console.log(`[Country Brief] Fetching OSINT for ${countryName}...`);
  const osintData = await fetchCountryOSINT(countryName, focusAreas);

  const osintSection = osintData
    ? `Here is today's OSINT data for ${countryName}:\n\n${osintData}`
    : `No OSINT feed available for ${countryName} today. Use your knowledge of current dynamics.`;

  const focusSection =
    focusAreas.length > 0
      ? `\n\nIMPORTANT — The client has requested focused coverage on these areas: ${focusAreas.join(", ")}. Ensure your brief includes specific incidents, developments, and regional assessments relevant to these locations. Prioritize these areas in your analysis.`
      : "";

  const userPrompt = `Today is ${todayStr}. Produce the daily intelligence brief for ${countryName} (country code: ${country}).

${osintSection}${focusSection}

Use the create_country_brief tool to return the structured brief data. Include geolocated incidents with accurate lat/lng for real cities, and regional state-level assessments.

REMINDERS:
- whatChanged: ONLY last-24h events, each citing a source from the OSINT feed above
- incidents: ONLY from the OSINT feed — every incident needs a sourceUrl from the feed
- developments: analytical with date/source references, not encyclopedia entries
- keyRisks: specific + actionable, not generic warnings
- travelAdvisory: name specific regions/routes/times, not "exercise caution"
- analystNote: forward-looking predictions, not generic advice`;

  console.log(`[Country Brief] Calling Claude for ${countryName}...`);
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: COUNTRY_SYSTEM_PROMPT,
    tools: [COUNTRY_BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_country_brief" },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolBlock) {
    throw new Error("Claude did not return a tool_use block");
  }

  const input = toolBlock.input as {
    threatLevel: string;
    whatChanged: string[];
    travelAdvisory: string;
    developments: string[];
    keyRisks: string[];
    analystNote: string;
    incidents: Incident[];
    regions: RegionAssessment[];
  };

  const briefData: CountryBriefData = {
    date: todayStr,
    country,
    countryName,
    threatLevel: input.threatLevel,
    whatChanged: input.whatChanged || [],
    travelAdvisory: input.travelAdvisory || "",
    developments: input.developments,
    keyRisks: input.keyRisks,
    analystNote: input.analystNote,
    incidents: input.incidents || [],
    regions: input.regions || [],
  };

  console.log(
    `[Country Brief] ${countryName}: ${briefData.threatLevel}, ${briefData.whatChanged.length} changes, ${briefData.developments.length} developments, ${briefData.incidents.length} incidents, ${briefData.regions.length} regions`
  );
  return briefData;
}
