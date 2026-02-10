import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { evaluateTest } from "@/lib/ab-testing/evaluate-test";

// GET /api/admin/ab-tests/[id] — get test details with results
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const test = await prisma.aBTest.findUnique({
    where: { id },
    include: {
      assignments: true,
      _count: { select: { assignments: true } },
    },
  });

  if (!test) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Calculate per-variant stats
  const variants: { id: string; value: string }[] = JSON.parse(test.variants);
  const variantStats = variants.map((v) => {
    const assignments = test.assignments.filter((a) => a.variantId === v.id);
    const total = assignments.length;
    const opened = assignments.filter((a) => a.opened).length;
    const clicked = assignments.filter((a) => a.clicked).length;
    return {
      ...v,
      total,
      opened,
      clicked,
      openRate: total > 0 ? opened / total : 0,
      clickRate: total > 0 ? clicked / total : 0,
    };
  });

  return NextResponse.json({
    ...test,
    variants: variantStats,
  });
}

// PATCH /api/admin/ab-tests/[id] — cancel or force-complete
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const test = await prisma.aBTest.findUnique({ where: { id } });
  if (!test) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "cancel") {
    const updated = await prisma.aBTest.update({
      where: { id },
      data: { status: "cancelled", completedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (body.action === "evaluate") {
    const result = await evaluateTest(id);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
