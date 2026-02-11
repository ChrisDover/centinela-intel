import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const TIER_PRICES: Record<string, number> = {
  "1-country": 497,
  "2-country": 597,
  "3-country": 697,
  "all-countries": 997,
};

export async function GET() {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      planTier: true,
      planStatus: true,
      createdAt: true,
    },
  });

  const activeClients = clients.filter((c) => c.planStatus === "active");

  // MRR calculation
  const mrr = activeClients.reduce(
    (sum, c) => sum + (TIER_PRICES[c.planTier] || 0),
    0
  );

  // Tier breakdown
  const tierBreakdown = Object.entries(TIER_PRICES).map(([tier, price]) => {
    const count = activeClients.filter((c) => c.planTier === tier).length;
    return { tier, count, revenue: count * price };
  });

  // Revenue per client
  const revenuePerClient =
    activeClients.length > 0 ? Math.round(mrr / activeClients.length) : 0;

  // Churn: cancelled in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const churnedCount = clients.filter(
    (c) => c.planStatus === "cancelled"
  ).length;

  // Growth series: cumulative active clients over last 30 days
  const growthSeries: Array<{ date: string; clients: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const activeOnDate = clients.filter(
      (c) =>
        c.createdAt <= date &&
        (c.planStatus === "active" || c.planStatus === "past_due")
    ).length;
    growthSeries.push({ date: dateStr, clients: activeOnDate });
  }

  // Recent signups (last 10)
  const recentSignups = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      email: c.email,
      name: c.name,
      company: c.company,
      planTier: c.planTier,
      planStatus: c.planStatus,
      createdAt: c.createdAt,
    }));

  return NextResponse.json({
    activeClients: activeClients.length,
    totalClients: clients.length,
    mrr,
    revenuePerClient,
    churnedCount,
    tierBreakdown,
    growthSeries,
    recentSignups,
  });
}
