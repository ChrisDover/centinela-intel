import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendCampaign } from "@/lib/campaigns/send-brief";

// POST /api/cron/send-brief — triggered by Vercel cron
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the latest draft brief campaign
  const campaign = await prisma.emailCampaign.findFirst({
    where: {
      status: "draft",
      type: "brief",
    },
    orderBy: { sentAt: "desc" },
  });

  if (!campaign) {
    return NextResponse.json({ message: "No draft brief campaign found" });
  }

  try {
    const result = await sendCampaign(campaign.id);
    return NextResponse.json({
      message: "Brief sent successfully",
      ...result,
    });
  } catch (error) {
    console.error("Cron send-brief error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel cron (Vercel crons use GET)
export async function GET(request: NextRequest) {
  return POST(request);
}
