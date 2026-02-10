/**
 * Create a new A/B test.
 */

import prisma from "@/lib/prisma";

interface CreateTestOptions {
  name: string;
  type: string; // subject, headline, layout, cta
  variants: { id: string; value: string }[];
  metric?: string; // open_rate, click_rate
  minSampleSize?: number;
  campaignId?: string;
}

export async function createABTest(options: CreateTestOptions) {
  if (options.variants.length < 2) {
    throw new Error("A/B test requires at least 2 variants");
  }

  const test = await prisma.aBTest.create({
    data: {
      name: options.name,
      type: options.type,
      variants: JSON.stringify(options.variants),
      metric: options.metric || "open_rate",
      minSampleSize: options.minSampleSize || 30,
      campaignId: options.campaignId,
    },
  });

  return test;
}
