import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [
    totalSubscribers,
    activeSubscribers,
    totalEmailsSent,
    avgEngagement,
    sourceBreakdown,
    recentSignups,
    growthSeries,
  ] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: "active" } }),
    prisma.subscriber.aggregate({ _sum: { emailsSent: true } }),
    prisma.subscriber.aggregate({
      _avg: { engagementScore: true },
      where: { status: "active" },
    }),
    prisma.subscriber.groupBy({
      by: ["source"],
      _count: true,
      orderBy: { _count: { source: "desc" } },
    }),
    prisma.subscriber.findMany({
      take: 10,
      orderBy: { subscribedAt: "desc" },
      select: {
        id: true,
        email: true,
        source: true,
        status: true,
        subscribedAt: true,
      },
    }),
    // 30-day growth: count subscribers by day
    prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("subscribedAt") as date, COUNT(*) as count
      FROM subscribers
      WHERE "subscribedAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("subscribedAt")
      ORDER BY date ASC
    `,
  ]);

  return NextResponse.json({
    kpis: {
      totalSubscribers,
      activeSubscribers,
      emailsSent: totalEmailsSent._sum.emailsSent || 0,
      avgEngagement: Math.round((avgEngagement._avg.engagementScore || 0) * 10) / 10,
    },
    sourceBreakdown: sourceBreakdown.map((s) => ({
      source: s.source || "unknown",
      count: s._count,
    })),
    recentSignups,
    growthSeries: growthSeries.map((row) => ({
      date: row.date,
      count: Number(row.count),
    })),
  });
}
