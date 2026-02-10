import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/cta-analytics — CTA click data
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaignId = searchParams.get("campaignId");
  const ctaType = searchParams.get("ctaType");

  const where: Record<string, unknown> = {};
  if (campaignId) where.campaignId = campaignId;
  if (ctaType) where.ctaType = ctaType;

  // Clicks by type
  const clicksByType = await prisma.cTAClick.groupBy({
    by: ["ctaType"],
    where,
    _count: { id: true },
  });

  // Clicks by campaign
  const clicksByCampaign = await prisma.cTAClick.groupBy({
    by: ["campaignId"],
    where: { ...where, campaignId: { not: null } },
    _count: { id: true },
  });

  // Clicks by position
  const clicksByPosition = await prisma.cTAClick.groupBy({
    by: ["ctaPosition"],
    where,
    _count: { id: true },
  });

  // Recent clicks
  const recentClicks = await prisma.cTAClick.findMany({
    where,
    orderBy: { clickedAt: "desc" },
    take: 50,
    include: {
      subscriber: { select: { email: true } },
      campaign: { select: { subject: true } },
    },
  });

  // Total clicks
  const totalClicks = await prisma.cTAClick.count({ where });

  return NextResponse.json({
    totalClicks,
    clicksByType: clicksByType.map((c) => ({
      ctaType: c.ctaType,
      clicks: c._count.id,
    })),
    clicksByCampaign: clicksByCampaign.map((c) => ({
      campaignId: c.campaignId,
      clicks: c._count.id,
    })),
    clicksByPosition: clicksByPosition.map((c) => ({
      position: c.ctaPosition || "unknown",
      clicks: c._count.id,
    })),
    recentClicks,
  });
}
