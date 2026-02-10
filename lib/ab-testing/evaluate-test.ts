/**
 * Evaluate A/B test results.
 * Per-variant open/click rates, declare winner after min sample size met.
 * Auto-complete after 14 days regardless.
 */

import prisma from "@/lib/prisma";

interface VariantResult {
  variantId: string;
  total: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}

interface TestEvaluation {
  testId: string;
  status: string;
  variants: VariantResult[];
  winner: string | null;
  reason: string;
}

const AUTO_COMPLETE_DAYS = 14;

export async function evaluateTest(testId: string): Promise<TestEvaluation> {
  const test = await prisma.aBTest.findUniqueOrThrow({
    where: { id: testId },
    include: { assignments: true },
  });

  if (test.status !== "running") {
    return {
      testId,
      status: test.status,
      variants: [],
      winner: test.winnerVariant,
      reason: "Test already completed",
    };
  }

  const variants: Variant[] = JSON.parse(test.variants);
  const results: VariantResult[] = [];

  for (const variant of variants) {
    const assignments = test.assignments.filter(
      (a) => a.variantId === variant.id
    );
    const total = assignments.length;
    const opened = assignments.filter((a) => a.opened).length;
    const clicked = assignments.filter((a) => a.clicked).length;

    results.push({
      variantId: variant.id,
      total,
      opened,
      clicked,
      openRate: total > 0 ? opened / total : 0,
      clickRate: total > 0 ? clicked / total : 0,
    });
  }

  // Check if we can declare a winner
  const allMeetMinSample = results.every(
    (r) => r.total >= test.minSampleSize
  );
  const daysSinceCreation = Math.floor(
    (Date.now() - test.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const autoComplete = daysSinceCreation >= AUTO_COMPLETE_DAYS;

  let winner: string | null = null;
  let reason = "Insufficient data";

  if (allMeetMinSample || autoComplete) {
    // Find winner based on metric
    const metricKey =
      test.metric === "click_rate" ? "clickRate" : "openRate";
    const sorted = [...results].sort((a, b) => b[metricKey] - a[metricKey]);

    if (sorted.length > 0 && sorted[0][metricKey] > 0) {
      winner = sorted[0].variantId;
      reason = autoComplete
        ? `Auto-completed after ${AUTO_COMPLETE_DAYS} days`
        : `Min sample size (${test.minSampleSize}) reached for all variants`;

      // Update test in database
      await prisma.aBTest.update({
        where: { id: testId },
        data: {
          status: "completed",
          winnerVariant: winner,
          completedAt: new Date(),
        },
      });
    }
  }

  return {
    testId,
    status: winner ? "completed" : "running",
    variants: results,
    winner,
    reason,
  };
}

/**
 * Evaluate all running tests. Called by daily cron.
 */
export async function evaluateAllRunningTests(): Promise<{
  evaluated: number;
  completed: number;
}> {
  const runningTests = await prisma.aBTest.findMany({
    where: { status: "running" },
  });

  let completed = 0;
  for (const test of runningTests) {
    const result = await evaluateTest(test.id);
    if (result.status === "completed") completed++;
  }

  return { evaluated: runningTests.length, completed };
}

interface Variant {
  id: string;
  value: string;
}
