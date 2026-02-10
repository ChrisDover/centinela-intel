import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const typeFilter = searchParams.get("type") || "";

  const campaignWhere: Record<string, unknown> = {};
  if (typeFilter) {
    campaignWhere.type = typeFilter;
  }

  const [campaigns, aggregates, dailyTrends] = await Promise.all([
    prisma.emailCampaign.findMany({
      where: campaignWhere,
      orderBy: { sentAt: "desc" },
      take: 50,
    }),
    prisma.emailCampaign.aggregate({
      where: campaignWhere,
      _count: true,
      _avg: {
        openRate: true,
        clickRate: true,
      },
      _sum: {
        bouncedCount: true,
        recipientCount: true,
      },
    }),
    prisma.$queryRaw<
      Array<{ date: string; opens: bigint; clicks: bigint; sent: bigint }>
    >`
      SELECT
        DATE("sentAt") as date,
        SUM("openedCount") as opens,
        SUM("clickedCount") as clicks,
        SUM("recipientCount") as sent
      FROM email_campaigns
      WHERE "sentAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("sentAt")
      ORDER BY date ASC
    `,
  ]);

  const totalRecipients = aggregates._sum.recipientCount || 0;
  const totalBounced = aggregates._sum.bouncedCount || 0;

  return NextResponse.json({
    campaigns,
    kpis: {
      totalCampaigns: aggregates._count,
      avgOpenRate:
        Math.round((aggregates._avg.openRate || 0) * 1000) / 10,
      avgClickRate:
        Math.round((aggregates._avg.clickRate || 0) * 1000) / 10,
      bounceRate:
        totalRecipients > 0
          ? Math.round((totalBounced / totalRecipients) * 1000) / 10
          : 0,
    },
    dailyTrends: dailyTrends.map((row) => ({
      date: row.date,
      openRate:
        Number(row.sent) > 0
          ? Math.round((Number(row.opens) / Number(row.sent)) * 1000) / 10
          : 0,
      clickRate:
        Number(row.sent) > 0
          ? Math.round((Number(row.clicks) / Number(row.sent)) * 1000) / 10
          : 0,
    })),
  });
}
