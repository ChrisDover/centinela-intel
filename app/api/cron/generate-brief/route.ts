import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateDailyBrief } from "@/lib/ai/generate-brief";

function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// POST /api/cron/generate-brief — triggered by Vercel cron at 08:00 UTC
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayStr = getTodayDateString();

  // Idempotency: check if a draft brief already exists for today
  const existing = await prisma.emailCampaign.findFirst({
    where: {
      status: "draft",
      type: "brief",
      subject: { contains: todayStr },
    },
  });

  if (existing) {
    return NextResponse.json({
      message: "Draft brief already exists for today",
      campaignId: existing.id,
    });
  }

  try {
    console.log(`[GenerateBrief] Generating brief for ${todayStr}...`);
    const briefData = await generateDailyBrief();

    const campaign = await prisma.emailCampaign.create({
      data: {
        type: "brief",
        status: "draft",
        subject: `The Centinela Brief — ${todayStr}`,
        htmlContent: JSON.stringify(briefData),
        tags: "premium",
        notes: "AI-generated via Claude + Brave Search OSINT",
      },
    });

    console.log(`[GenerateBrief] Draft campaign created: ${campaign.id}`);

    return NextResponse.json({
      message: "Brief generated successfully",
      campaignId: campaign.id,
      briefData,
    });
  } catch (error) {
    console.error("Cron generate-brief error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel cron (Vercel crons use GET)
export async function GET(request: NextRequest) {
  return POST(request);
}
