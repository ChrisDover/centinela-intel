import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/campaigns — list campaigns with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 25;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.type = type;

  const [campaigns, total] = await Promise.all([
    prisma.emailCampaign.findMany({
      where,
      orderBy: { sentAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { emailSends: true } },
      },
    }),
    prisma.emailCampaign.count({ where }),
  ]);

  return NextResponse.json({
    campaigns,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/admin/campaigns — create a draft campaign
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    type,
    subject,
    htmlContent,
    textContent,
    abTestId,
    tags,
    notes,
    scheduledFor,
  } = body;

  if (!type || !subject) {
    return NextResponse.json(
      { error: "Type and subject are required" },
      { status: 400 }
    );
  }

  const campaign = await prisma.emailCampaign.create({
    data: {
      type,
      subject,
      htmlContent: htmlContent || null,
      textContent: textContent || null,
      abTestId: abTestId || null,
      tags: tags || null,
      notes: notes || null,
      status: "draft",
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
