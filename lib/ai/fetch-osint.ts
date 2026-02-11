/**
 * Brave Search OSINT fetcher — queries regional security news for brief generation.
 */

const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const REGION_QUERIES = [
  "Mexico security cartel violence today",
  "Venezuela political security news today",
  "Colombia FARC ELN security today",
  "Ecuador violence security today",
  "Central America Guatemala Honduras security today",
  "Latin America security threat today",
];

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

async function searchBrave(query: string, apiKey: string): Promise<BraveSearchResult[]> {
  const url = new URL(BRAVE_SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("freshness", "pd"); // past day

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!res.ok) {
    console.error(`[OSINT] Brave Search failed for "${query}": ${res.status}`);
    return [];
  }

  const data: BraveSearchResponse = await res.json();
  return data.web?.results ?? [];
}

export async function fetchOSINT(): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn("[OSINT] BRAVE_SEARCH_API_KEY not set — skipping OSINT fetch");
    return "";
  }

  try {
    const allResults = await Promise.all(
      REGION_QUERIES.map((query) => searchBrave(query, apiKey))
    );

    const sections: string[] = [];

    for (let i = 0; i < REGION_QUERIES.length; i++) {
      const results = allResults[i];
      if (results.length === 0) continue;

      const items = results
        .map((r) => `- ${r.title}: ${r.description}`)
        .join("\n");

      sections.push(`## ${REGION_QUERIES[i]}\n${items}`);
    }

    if (sections.length === 0) {
      console.warn("[OSINT] No search results returned");
      return "";
    }

    return sections.join("\n\n");
  } catch (error) {
    console.error("[OSINT] Fetch failed:", error);
    return "";
  }
}
