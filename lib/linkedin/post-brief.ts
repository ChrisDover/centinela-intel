/**
 * Format a weekly brief into a LinkedIn text post and publish it.
 * Target: 1500-2000 chars (max 3000).
 */

import { postToLinkedIn } from "./client";

interface BriefData {
  date: string;
  threatLevel: string;
  developments: string[];
  countries: { name: string; summary: string }[];
  analystNote: string;
}

interface PostBriefResult {
  success: boolean;
  postId?: string;
  error?: string;
}

function formatBriefForLinkedIn(brief: BriefData): string {
  const threatEmoji =
    brief.threatLevel === "CRITICAL"
      ? "\u{1F534}"
      : brief.threatLevel === "HIGH"
        ? "\u{1F7E0}"
        : "\u{1F7E1}";

  const developments = brief.developments
    .slice(0, 5)
    .map((d) => `\u2192 ${d}`)
    .join("\n");

  const countries = brief.countries
    .slice(0, 4)
    .map((c) => `${c.name}: ${c.summary}`)
    .join("\n");

  // Trim analyst note to first 2-3 sentences (~300 chars)
  const analystTrimmed = trimToSentences(brief.analystNote, 300);

  const post = `${threatEmoji} CENTINELA BRIEF \u2014 ${brief.threatLevel}
${brief.date} | Latin America Security Intelligence

KEY DEVELOPMENTS:
${developments}

COUNTRY WATCH:
${countries}

ANALYST ASSESSMENT:
${analystTrimmed}

Read the full brief \u2192 centinelaintel.com
Subscribe free \u2192 centinelaintel.com/subscribe

#CentinelaIntel #LatinAmerica #SecurityIntelligence #ThreatAssessment #OSINT`;

  // LinkedIn max is 3000 chars — truncate if needed
  if (post.length > 3000) {
    return post.slice(0, 2997) + "...";
  }

  return post;
}

function trimToSentences(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Find the last sentence boundary before maxLength
  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxLength * 0.5) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated + "...";
}

export async function postBriefToLinkedIn(
  briefData: BriefData,
  campaignId: string
): Promise<PostBriefResult> {
  try {
    const text = formatBriefForLinkedIn(briefData);
    console.log(`[LinkedIn] Posting brief for campaign ${campaignId} (${text.length} chars)`);

    const result = await postToLinkedIn(text);

    if (result.success) {
      console.log(`[LinkedIn] Posted successfully. Post ID: ${result.postId}`);
    } else {
      console.error(`[LinkedIn] Post failed: ${result.error}`);
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[LinkedIn] Unexpected error: ${message}`);
    return { success: false, error: message };
  }
}

export type { BriefData };
