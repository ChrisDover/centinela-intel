import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createABTest } from "@/lib/ab-testing/create-test";

// GET /api/admin/ab-tests — list all tests
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const tests = await prisma.aBTest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { assignments: true } },
    },
  });

  // Parse variants JSON for each test
  const parsed = tests.map((test) => ({
    ...test,
    variants: JSON.parse(test.variants),
  }));

  return NextResponse.json(parsed);
}

// POST /api/admin/ab-tests — create a new test
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, type, variants, metric, minSampleSize, campaignId } = body;

  if (!name || !type || !variants || variants.length < 2) {
    return NextResponse.json(
      { error: "Name, type, and at least 2 variants are required" },
      { status: 400 }
    );
  }

  try {
    const test = await createABTest({
      name,
      type,
      variants,
      metric,
      minSampleSize,
      campaignId,
    });

    return NextResponse.json(
      { ...test, variants: JSON.parse(test.variants) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create test" },
      { status: 400 }
    );
  }
}
