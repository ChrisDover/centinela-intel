/**
 * Calculate optimal send hour for a subscriber based on open history.
 * Builds a 24-hour histogram of when they open emails.
 * Falls back to cohort average or 06:00 UTC for new subscribers.
 */

import prisma from "@/lib/prisma";

interface OptimalSendTime {
  hour: number; // 0-23 UTC
  confidence: number; // 0-1
}

const MIN_OPENS_FOR_CONFIDENCE = 5;
const ANALYSIS_WINDOW_DAYS = 90;
const DEFAULT_HOUR = 6; // 06:00 UTC fallback

/**
 * Calculate optimal send hour for a single subscriber
 */
export async function calculateOptimalHour(
  subscriberId: string
): Promise<OptimalSendTime> {
  const since = new Date();
  since.setDate(since.getDate() - ANALYSIS_WINDOW_DAYS);

  const openEvents = await prisma.emailEvent.findMany({
    where: {
      subscriberId,
      type: "email.opened",
      timestamp: { gte: since },
    },
    select: { timestamp: true },
  });

  if (openEvents.length < MIN_OPENS_FOR_CONFIDENCE) {
    return { hour: DEFAULT_HOUR, confidence: 0 };
  }

  // Build 24-hour histogram
  const histogram = new Array(24).fill(0);
  for (const event of openEvents) {
    const hour = event.timestamp.getUTCHours();
    histogram[hour]++;
  }

  // Find peak hour
  let peakHour = 0;
  let peakCount = 0;
  for (let h = 0; h < 24; h++) {
    if (histogram[h] > peakCount) {
      peakCount = histogram[h];
      peakHour = h;
    }
  }

  const confidence = peakCount / openEvents.length;

  return { hour: peakHour, confidence };
}

/**
 * Calculate cohort average optimal hour across all active subscribers.
 * Used as fallback for new subscribers with no open history.
 */
export async function calculateCohortAverage(): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - ANALYSIS_WINDOW_DAYS);

  const openEvents = await prisma.emailEvent.findMany({
    where: {
      type: "email.opened",
      timestamp: { gte: since },
      subscriberId: { not: null },
    },
    select: { timestamp: true },
  });

  if (openEvents.length === 0) return DEFAULT_HOUR;

  const histogram = new Array(24).fill(0);
  for (const event of openEvents) {
    histogram[event.timestamp.getUTCHours()]++;
  }

  let peakHour = DEFAULT_HOUR;
  let peakCount = 0;
  for (let h = 0; h < 24; h++) {
    if (histogram[h] > peakCount) {
      peakCount = histogram[h];
      peakHour = h;
    }
  }

  return peakHour;
}

/**
 * Batch update optimal send hours for all active subscribers.
 * Called by the daily cron job.
 */
export async function batchUpdateOptimalHours(): Promise<{
  updated: number;
  errors: number;
}> {
  const subscribers = await prisma.subscriber.findMany({
    where: { status: "active" },
    select: { id: true },
  });

  const cohortAvg = await calculateCohortAverage();
  let updated = 0;
  let errors = 0;

  for (const sub of subscribers) {
    try {
      const result = await calculateOptimalHour(sub.id);
      const hour = result.confidence > 0 ? result.hour : cohortAvg;

      await prisma.subscriber.update({
        where: { id: sub.id },
        data: {
          optimalSendHour: hour,
          sendTimeConfidence: result.confidence,
          lastOpenAnalyzedAt: new Date(),
        },
      });
      updated++;
    } catch {
      errors++;
    }
  }

  return { updated, errors };
}
