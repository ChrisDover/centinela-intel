/**
 * Import security-related LinkedIn articles into the BlogPost table.
 * Run: npx tsx scripts/import-linkedin-articles.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import prisma from "../lib/prisma";

const ARTICLES_DIR = "/Users/chrisdover/Downloads/Articles/Articles";

// 23 security/intelligence articles to import (excluding trading/crypto/macro, duplicates, empty drafts, and the Feb 13 brief already in DB)
const ARTICLE_FILES = [
  "threat-landscape-one-ai-talking-chris-dover-wgcac.html",
  "most-significant-shift-mexican-criminal-power-35-years-chris-dover-w8l0c.html",
  "do-you-know-what-your-team-uploaded-ai-morning-have-logs-chris-dover-mevbc.html",
  "five-workers-dead-securities-investigation-launched-before-dover-mcv8c.html",
  "board-didnt-plan-42-stock-drop-from-kidnapping-now-theyre-chris-dover-xbepc.html",
  "car-ahead-stopped-four-doors-opened-he-had-1-second-react-chris-dover-4aafc.html",
  "cartels-using-dating-apps-kidnap-people-mexico-heres-exactly-dover-htr9c.html",
  "sent-30-shooters-one-businessman-neighborhood-where-feel-chris-dover-3wmec.html",
  "liability-ones-talking-executive-security-latin-america-chris-dover-qx8xc.html",
  "us-wont-protect-you-venezuela-heres-what-i-learned-doing-chris-dover-jmmmc.html",
  "cyber-breach-physical-fallout-coverage-perfect-storm-boards-dover-f3zqc.html",
  "security-isnt-supposed-slow-you-down-chris-dover-pp8vc.html",
  "43-billion-ai-security-gold-rush-ceos-cant-ignore-chris-dover-mpyec.html",
  "youre-watching-its-intelligence-chris-dover-sipec.html",
  "risk-you-cant-insure-how-public-outrage-social-media-one-chris-dover-53y5c.html",
  "your-directors-voiding-insurance-dont-know-chris-dover-jxnvc.html",
  "i-spent-months-protecting-executives-after-united-healthcare-dover-cjkic.html",
  "venezuela-osint-daily-brief-1-october-2025-chris-dover-klenc.html",
  "daily-osint-executive-protection-threat-intelligence-briefing-dover-u6iac.html",
  "daily-osint-threat-brief-september-25-2025-chris-dover-tgilc.html",
  "daily-corporate-security-osint-threat-brief-september-chris-dover-wn8rc.html",
  "target-venezuela-maduro-chris-dover-dufic.html",
  "one-simple-decision-can-cost-you-millions-chris-dover-fslwc.html",
];

function extractTitle(html: string): string {
  // Try <title> tag first
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch && titleMatch[1].trim()) return titleMatch[1].trim();

  // Fallback: <h1> text
  const h1Match = html.match(/<h1[^>]*>(?:<a[^>]*>)?([^<]+)/);
  if (h1Match) return h1Match[1].trim();

  return "Untitled";
}

function extractPublishedDate(html: string): Date {
  // Match <p class="published">Published on 2026-02-17 00:00</p>
  const pubMatch = html.match(
    /class="published"[^>]*>Published on (\d{4}-\d{2}-\d{2})/
  );
  if (pubMatch) return new Date(pubMatch[1] + "T12:00:00Z");

  // Fallback: try <p class="created">
  const createMatch = html.match(
    /class="created"[^>]*>Created on (\d{4}-\d{2}-\d{2})/
  );
  if (createMatch) return new Date(createMatch[1] + "T12:00:00Z");

  return new Date();
}

function extractSourceUrl(html: string): string | null {
  // <h1><a href="https://www.linkedin.com/pulse/...">
  const match = html.match(/<h1[^>]*>\s*<a\s+href="([^"]+)"/);
  return match ? match[1] : null;
}

function extractBodyHtml(html: string): string {
  // The body content is inside the first <div> after the published date
  // We want everything inside <div>...</div> after the metadata
  const divMatch = html.match(
    /<p class="(?:published|created)"[^>]*>[^<]*<\/p>\s*(?:<p class="(?:published|created)"[^>]*>[^<]*<\/p>\s*)?<div>([\s\S]*?)<\/div>\s*<\/body>/
  );
  if (divMatch) return divMatch[1].trim();

  // Broader fallback: grab content between first <div> and </div> in body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (bodyMatch) {
    const body = bodyMatch[1];
    const innerDiv = body.match(/<div>([\s\S]*?)<\/div>/);
    if (innerDiv) return innerDiv[1].trim();
  }

  return "";
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

async function main() {
  let imported = 0;
  let skipped = 0;

  for (const filename of ARTICLE_FILES) {
    const filepath = join(ARTICLES_DIR, filename);
    let html: string;
    try {
      html = readFileSync(filepath, "utf-8");
    } catch {
      console.error(`  SKIP: Could not read ${filename}`);
      skipped++;
      continue;
    }

    const title = extractTitle(html);
    const publishedAt = extractPublishedDate(html);
    const sourceUrl = extractSourceUrl(html);
    const htmlContent = extractBodyHtml(html);
    const slug = titleToSlug(title);

    if (!htmlContent || htmlContent.length < 50) {
      console.error(`  SKIP: Empty or too short content for "${title}"`);
      skipped++;
      continue;
    }

    // Upsert to handle re-runs
    await prisma.blogPost.upsert({
      where: { slug },
      create: {
        title,
        slug,
        htmlContent,
        publishedAt,
        source: "linkedin",
        sourceUrl,
      },
      update: {
        title,
        htmlContent,
        publishedAt,
        sourceUrl,
      },
    });

    console.log(
      `  OK: "${title}" (${publishedAt.toISOString().split("T")[0]}) -> /blog/article/${slug}`
    );
    imported++;
  }

  console.log(`\nDone: ${imported} imported, ${skipped} skipped.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
