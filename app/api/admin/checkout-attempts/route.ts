import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

  const where = status ? { status } : {};

  const [attempts, total, statusCounts] = await Promise.all([
    prisma.checkoutAttempt.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.checkoutAttempt.count({ where }),
    prisma.checkoutAttempt.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const summary = {
    total: 0,
    initiated: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  };
  for (const row of statusCounts) {
    summary.total += row._count;
    if (row.status in summary) {
      summary[row.status as keyof typeof summary] = row._count;
    }
  }

  return NextResponse.json({
    attempts,
    total,
    summary,
  });
}
