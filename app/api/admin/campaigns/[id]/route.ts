import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/campaigns/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id },
    include: {
      emailSends: {
        take: 50,
        orderBy: { scheduledAt: "desc" },
        include: { subscriber: { select: { email: true, name: true } } },
      },
      _count: {
        select: { emailSends: true, emailEvents: true, ctaClicks: true },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

// PATCH /api/admin/campaigns/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only allow editing draft campaigns
  if (campaign.status !== "draft" && !body.status) {
    return NextResponse.json(
      { error: "Cannot edit a sent campaign" },
      { status: 400 }
    );
  }

  const updated = await prisma.emailCampaign.update({
    where: { id },
    data: {
      ...(body.subject && { subject: body.subject }),
      ...(body.type && { type: body.type }),
      ...(body.htmlContent !== undefined && { htmlContent: body.htmlContent }),
      ...(body.textContent !== undefined && { textContent: body.textContent }),
      ...(body.abTestId !== undefined && { abTestId: body.abTestId }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.scheduledFor !== undefined && {
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
      }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/campaigns/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (campaign.status === "sending") {
    return NextResponse.json(
      { error: "Cannot delete a campaign that is currently sending" },
      { status: 400 }
    );
  }

  // Delete related records first
  await prisma.emailSend.deleteMany({ where: { campaignId: id } });
  await prisma.emailEvent.deleteMany({ where: { campaignId: id } });
  await prisma.cTAClick.deleteMany({ where: { campaignId: id } });
  await prisma.emailCampaign.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
