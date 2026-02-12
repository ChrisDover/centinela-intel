import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendCampaign } from "@/lib/campaigns/send-brief";
import { postBriefToLinkedIn, type BriefData } from "@/lib/linkedin/post-brief";

// POST /api/admin/campaigns/[id]/send — trigger campaign send + LinkedIn post
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (campaign.status !== "draft") {
    return NextResponse.json(
      { error: `Campaign is already ${campaign.status}` },
      { status: 400 }
    );
  }

  try {
    const result = await sendCampaign(id);

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

    return NextResponse.json({ ...result, linkedin: linkedinResult });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 }
    );
  }
}
