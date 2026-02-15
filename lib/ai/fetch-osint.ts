/**
 * OSINT fetcher — DuckDuckGo search + Google News RSS for regional security intelligence.
 * No API keys required.
 */

// --- Google News RSS ---

const GOOGLE_NEWS_FEEDS = [
  { label: "Mexico security", url: "https://news.google.com/rss/search?q=Mexico+cartel+violence+security&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Mexico border", url: "https://news.google.com/rss/search?q=Mexico+border+fentanyl+Sinaloa+CJNG&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Venezuela politics", url: "https://news.google.com/rss/search?q=Venezuela+oil+energy+politics&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Colombia conflict", url: "https://news.google.com/rss/search?q=Colombia+ELN+FARC+military+ceasefire&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Ecuador security", url: "https://news.google.com/rss/search?q=Ecuador+violence+organized+crime+Guayaquil&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Central America", url: "https://news.google.com/rss/search?q=Guatemala+Honduras+gang+migration+security&hl=en&gl=US&ceid=US:en&when:2d" },
  { label: "Latin America security", url: "https://news.google.com/rss/search?q=Latin+America+security+threat+geopolitics&hl=en&gl=US&ceid=US:en&when:2d" },
  // Spanish-language sources for deeper coverage
  { label: "Mexico seguridad (ES)", url: "https://news.google.com/rss/search?q=M%C3%A9xico+cartel+violencia+seguridad&hl=es&gl=MX&ceid=MX:es&when:2d" },
  { label: "Venezuela (ES)", url: "https://news.google.com/rss/search?q=Venezuela+petroleo+politica+crisis&hl=es&gl=VE&ceid=VE:es&when:2d" },
  { label: "Colombia (ES)", url: "https://news.google.com/rss/search?q=Colombia+ELN+conflicto+armado&hl=es&gl=CO&ceid=CO:es&when:2d" },
];

interface RSSItem {
  title: string;
  source: string;
  pubDate: string;
}

function parseRSSItems(xml: string, maxItems = 8): RSSItem[] {
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
      return `- ${item.title}${src}`;
    });

    sections.push(`## ${label}\n${lines.join("\n")}`);
  }

  return sections.join("\n\n");
}

// --- DuckDuckGo search ---

const DDG_QUERIES = [
  "Mexico cartel violence border security 2026",
  "Venezuela oil energy politics",
  "Colombia ELN military operation",
  "Ecuador organized crime security",
  "Latin America security threat",
];

interface DDGResult {
  title: string;
  snippet: string;
}

async function searchDDG(query: string): Promise<DDGResult[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error(`[OSINT] DDG search failed for "${query}": ${res.status}`);
      return [];
    }

    const html = await res.text();
    const results: DDGResult[] = [];

    // Parse result snippets from DDG HTML response
    const resultRegex = /<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let match;

    while ((match = resultRegex.exec(html)) !== null && results.length < 6) {
      const title = match[1].replace(/<[^>]+>/g, "").trim();
      const snippet = match[2].replace(/<[^>]+>/g, "").trim();
      if (title && snippet) {
        results.push({ title, snippet });
      }
    }

    return results;
  } catch (error) {
    console.error(`[OSINT] DDG search error for "${query}":`, error);
    return [];
  }
}

async function fetchDDGResults(): Promise<string> {
  const allResults = await Promise.allSettled(
    DDG_QUERIES.map((query) => searchDDG(query))
  );

  const sections: string[] = [];

  for (let i = 0; i < DDG_QUERIES.length; i++) {
    const result = allResults[i];
    if (result.status !== "fulfilled" || result.value.length === 0) continue;

    const lines = result.value.map((r) => `- ${r.title}: ${r.snippet}`);
    sections.push(`## ${DDG_QUERIES[i]}\n${lines.join("\n")}`);
  }

  return sections.join("\n\n");
}

// --- Main export ---

export async function fetchOSINT(): Promise<string> {
  console.log("[OSINT] Fetching from Google News RSS + DuckDuckGo...");

  const [googleNews, ddgResults] = await Promise.allSettled([
    fetchGoogleNewsRSS(),
    fetchDDGResults(),
  ]);

  const parts: string[] = [];

  if (googleNews.status === "fulfilled" && googleNews.value) {
    parts.push("# GOOGLE NEWS — LAST 48 HOURS\n\n" + googleNews.value);
    console.log("[OSINT] Google News RSS: collected");
  } else {
    console.warn("[OSINT] Google News RSS: failed or empty");
  }

  if (ddgResults.status === "fulfilled" && ddgResults.value) {
    parts.push("# DUCKDUCKGO WEB RESULTS\n\n" + ddgResults.value);
    console.log("[OSINT] DuckDuckGo: collected");
  } else {
    console.warn("[OSINT] DuckDuckGo: failed or empty");
  }

  if (parts.length === 0) {
    console.warn("[OSINT] No OSINT data collected from any source");
    return "";
  }

  return parts.join("\n\n---\n\n");
}
