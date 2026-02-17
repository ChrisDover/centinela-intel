/**
 * OSINT fetcher — Brave Search API (primary) + Google News RSS (fallback).
 * Brave provides better recency filtering and richer snippets with dates.
 */

// --- Brave Search API ---

const BRAVE_QUERIES = [
  // Core focus countries
  { label: "Mexico security", query: "Mexico cartel violence security Sinaloa CJNG fentanyl" },
  { label: "Mexico border", query: "Mexico border security military operations drug trafficking" },
  { label: "Colombia conflict", query: "Colombia ELN FARC military armed groups conflict" },
  { label: "Venezuela", query: "Venezuela politics energy oil crisis security" },
  { label: "Ecuador security", query: "Ecuador organized crime violence Guayaquil security" },
  { label: "Brazil security", query: "Brazil security crime politics military operations" },
  // Regional coverage
  { label: "Argentina Chile", query: "Argentina Chile security politics economy protest" },
  { label: "Peru Bolivia", query: "Peru Bolivia security politics protest mining" },
  { label: "Central America", query: "Guatemala Honduras El Salvador Nicaragua security gang migration" },
  { label: "Costa Rica Panama", query: "Costa Rica Panama security drug trafficking crime" },
  { label: "Caribbean LatAm", query: "Cuba Haiti Dominican Republic security crisis politics" },
  { label: "Paraguay Uruguay", query: "Paraguay Uruguay security crime politics border" },
  // Spanish-language queries for deeper OSINT
  { label: "México seguridad (ES)", query: "México cartel violencia seguridad operativo militar" },
  { label: "Colombia conflicto (ES)", query: "Colombia ELN conflicto armado operación militar desplazamiento" },
  { label: "Latinoamérica (ES)", query: "Latinoamérica seguridad crimen organizado narcotráfico" },
];

interface BraveResult {
  title: string;
  description: string;
  url: string;
  age?: string;
  publishedDate?: string;
}

async function searchBrave(query: string): Promise<BraveResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      count: "8",
      freshness: "pd",  // past day — strict 24h filter
      text_decorations: "false",
    });

    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      // If "past day" returns nothing useful, try "past week" as fallback
      if (res.status === 422) return [];
      console.error(`[OSINT] Brave search failed for "${query}": ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results: BraveResult[] = [];

    for (const item of data.web?.results || []) {
      results.push({
        title: item.title || "",
        description: item.description || "",
        url: item.url || "",
        age: item.age || "",
        publishedDate: item.page_age || "",
      });
    }

    return results;
  } catch (error) {
    console.error(`[OSINT] Brave search error for "${query}":`, error);
    return [];
  }
}

async function fetchBraveResults(): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn("[OSINT] BRAVE_SEARCH_API_KEY not set, skipping Brave Search");
    return "";
  }

  // Run all queries in parallel
  const allResults = await Promise.allSettled(
    BRAVE_QUERIES.map(async ({ label, query }) => {
      const results = await searchBrave(query);
      return { label, results };
    })
  );

  const sections: string[] = [];

  for (const result of allResults) {
    if (result.status !== "fulfilled") continue;
    const { label, results } = result.value;
    if (results.length === 0) continue;

    const lines = results.map((r) => {
      const age = r.age ? ` [${r.age}]` : "";
      return `- ${r.title}${age}: ${r.description}`;
    });

    sections.push(`## ${label}\n${lines.join("\n")}`);
  }

  return sections.join("\n\n");
}

// --- Google News RSS (fallback) ---

const GOOGLE_NEWS_FEEDS = [
  { label: "Mexico security", url: "https://news.google.com/rss/search?q=Mexico+cartel+violence+security&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Venezuela", url: "https://news.google.com/rss/search?q=Venezuela+oil+energy+politics+crisis&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Colombia conflict", url: "https://news.google.com/rss/search?q=Colombia+ELN+FARC+military+ceasefire&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Ecuador security", url: "https://news.google.com/rss/search?q=Ecuador+violence+organized+crime+Guayaquil&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Brazil security", url: "https://news.google.com/rss/search?q=Brazil+security+crime+politics+military&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Central America", url: "https://news.google.com/rss/search?q=Guatemala+Honduras+El+Salvador+gang+migration+security&hl=en&gl=US&ceid=US:en&when:1d" },
  { label: "Latin America security", url: "https://news.google.com/rss/search?q=Latin+America+security+threat+geopolitics&hl=en&gl=US&ceid=US:en&when:1d" },
  // Spanish-language
  { label: "México seguridad (ES)", url: "https://news.google.com/rss/search?q=M%C3%A9xico+cartel+violencia+seguridad&hl=es&gl=MX&ceid=MX:es&when:1d" },
  { label: "Colombia (ES)", url: "https://news.google.com/rss/search?q=Colombia+ELN+conflicto+armado&hl=es&gl=CO&ceid=CO:es&when:1d" },
];

interface RSSItem {
  title: string;
  source: string;
  pubDate: string;
}

function parseRSSItems(xml: string, maxItems = 6): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < maxItems) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>(.*?)<\/title>/)?.[1]
      || "";
    const source = block.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

    if (title) {
      items.push({ title: decodeHTMLEntities(title), source, pubDate });
    }
  }

  return items;
}

function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchGoogleNewsRSS(): Promise<string> {
  const sections: string[] = [];

  const results = await Promise.allSettled(
    GOOGLE_NEWS_FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CentinelaIntel/1.0)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) return { label: feed.label, items: [] };
      const xml = await res.text();
      return { label: feed.label, items: parseRSSItems(xml) };
    })
  );

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { label, items } = result.value;
    if (items.length === 0) continue;

    const lines = items.map((item) => {
      const src = item.source ? ` (${item.source})` : "";
      const date = item.pubDate ? ` [${item.pubDate}]` : "";
      return `- ${item.title}${src}${date}`;
    });

    sections.push(`## ${label}\n${lines.join("\n")}`);
  }

  return sections.join("\n\n");
}

// --- Main export ---

export async function fetchOSINT(): Promise<string> {
  console.log("[OSINT] Fetching from Brave Search + Google News RSS...");

  const [braveResults, googleNews] = await Promise.allSettled([
    fetchBraveResults(),
    fetchGoogleNewsRSS(),
  ]);

  const parts: string[] = [];

  if (braveResults.status === "fulfilled" && braveResults.value) {
    parts.push("# BRAVE SEARCH — LAST 24 HOURS\n\n" + braveResults.value);
    console.log("[OSINT] Brave Search: collected");
  } else {
    console.warn("[OSINT] Brave Search: failed or empty");
  }

  if (googleNews.status === "fulfilled" && googleNews.value) {
    parts.push("# GOOGLE NEWS RSS — LAST 24 HOURS\n\n" + googleNews.value);
    console.log("[OSINT] Google News RSS: collected");
  } else {
    console.warn("[OSINT] Google News RSS: failed or empty");
  }

  if (parts.length === 0) {
    console.warn("[OSINT] No OSINT data collected from any source");
    return "";
  }

  return parts.join("\n\n---\n\n");
}
