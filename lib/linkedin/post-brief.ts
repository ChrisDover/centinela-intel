/**
 * Format a daily brief into a LinkedIn text post and publish it.
 * Target: 1500-2000 chars (max 3000).
 */

import { postToLinkedIn } from "./client";

interface BriefDevelopment {
  country: string;
  paragraphs: string[];
}

interface BriefData {
  date: string;
  bluf?: string;
  threatLevel: string;
  developments: BriefDevelopment[] | string[];
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

  // Count countries covered
  const devCountries = Array.isArray(brief.developments)
    ? brief.developments.length
    : 0;

  const lines = [
    `${threatEmoji} CENTINELA BRIEF - ${brief.threatLevel}`,
    brief.date,
    "",
    brief.bluf || "Latin America security intelligence — daily coverage across 22 countries.",
    "",
    `Today's brief covers ${devCountries} countries in depth with full analyst assessment.`,
    "",
    "Read the full brief for free at https://centinelaintel.com/blog",
    "",
    "Get it delivered to your inbox every morning — free: https://centinelaintel.com/linkedin",
    "",
    "#CentinelaIntel #LatinAmerica #SecurityIntelligence #ThreatAssessment #OSINT",
  ];

  return lines.join("\n");
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
