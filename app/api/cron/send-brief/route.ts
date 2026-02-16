import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendCampaign } from "@/lib/campaigns/send-brief";
import { postBriefToLinkedIn, type BriefData } from "@/lib/linkedin/post-brief";

export const maxDuration = 120;

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

    // Post to LinkedIn (non-blocking — email send is the priority)
    let linkedinResult: { success: boolean; postId?: string; error?: string } | null = null;
    if (campaign.htmlContent) {
      try {
        const briefData: BriefData = JSON.parse(campaign.htmlContent);
        linkedinResult = await postBriefToLinkedIn(briefData, campaign.id);
      } catch (linkedinError) {
        console.error("LinkedIn post failed:", linkedinError);
        linkedinResult = {
          success: false,
          error: linkedinError instanceof Error ? linkedinError.message : "LinkedIn post failed",
        };
      }
    }

    return NextResponse.json({
      message: "Brief sent successfully",
      ...result,
      linkedin: linkedinResult,
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
