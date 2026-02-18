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
  url.searchParams.set("count", "5");
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

async function fetchCountryOSINT(countryName: string): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn("[Country OSINT] BRAVE_SEARCH_API_KEY not set");
    return "";
  }

  const queries = [
    `${countryName} security threat violence today`,
    `${countryName} political crisis news today`,
    `${countryName} crime cartel organized crime today`,
    `${countryName} seguridad crimen violencia hoy`,
  ];

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

const COUNTRY_SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, specializing in Latin American security intelligence. You have 25+ years of experience in global security operations.

Your task is to produce a country-specific daily intelligence brief for a single country. This is a premium product for paying clients who need focused, actionable intelligence on their specific country of operation.

Guidelines:
- Write in a concise, professional intelligence style — no filler
- Focus exclusively on the specified country
- 4-6 key developments, ordered by operational impact
- 3-4 key risks that a corporate security team or executive should be aware of
- Analyst note: 2-3 sentences, forward-looking assessment
- Threat levels: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)
- For incidents: provide REAL city names and ACCURATE lat/lng coordinates for the actual city. These plot on a map — accuracy matters.
- For regions: assess 3-5 key states/departments/provinces with their own threat levels
- Categories for incidents: cartel, political, crime, infrastructure, protest, kidnapping, extortion
- IMPORTANT: For every incident based on an OSINT article, include the sourceUrl field with the article URL. This is critical — clients click through to read the full source. Always include sourceUrl when the OSINT data provides a [Source: ...] URL.
- If OSINT data is thin, use your knowledge of the country's current dynamics`;

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
      developments: {
        type: "array",
        items: { type: "string" },
        description:
          "4-6 key security developments in this country, ordered by importance",
        minItems: 3,
        maxItems: 6,
      },
      keyRisks: {
        type: "array",
        items: { type: "string" },
        description:
          "3-4 key risks for corporate security teams operating in this country",
        minItems: 2,
        maxItems: 4,
      },
      analystNote: {
        type: "string",
        description: "Forward-looking analyst assessment (2-3 sentences)",
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
              description: "1-2 sentence incident description",
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
                "URL of the source article from OSINT data, if available. Include this when the incident is based on a specific news article from the provided OSINT feed.",
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
          ],
        },
        description:
          "5-8 geolocated security incidents across the country. Use real cities with accurate coordinates.",
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
              description: "1-2 sentence assessment of this region",
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
  const osintData = await fetchCountryOSINT(countryName);

  const osintSection = osintData
    ? `Here is today's OSINT data for ${countryName}:\n\n${osintData}`
    : `No OSINT feed available for ${countryName} today. Use your knowledge of current dynamics.`;

  const focusSection =
    focusAreas.length > 0
      ? `\n\nIMPORTANT — The client has requested focused coverage on these areas: ${focusAreas.join(", ")}. Ensure your brief includes specific incidents, developments, and regional assessments relevant to these locations. Prioritize these areas in your analysis.`
      : "";

  const userPrompt = `Today is ${todayStr}. Produce the daily intelligence brief for ${countryName} (country code: ${country}).

${osintSection}${focusSection}

Use the create_country_brief tool to return the structured brief data. Include geolocated incidents with accurate lat/lng for real cities, and regional state-level assessments.`;

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
    developments: input.developments,
    keyRisks: input.keyRisks,
    analystNote: input.analystNote,
    incidents: input.incidents || [],
    regions: input.regions || [],
  };

  console.log(
    `[Country Brief] ${countryName}: ${briefData.threatLevel}, ${briefData.developments.length} developments, ${briefData.incidents.length} incidents, ${briefData.regions.length} regions`
  );
  return briefData;
}
