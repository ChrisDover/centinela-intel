import { NextRequest, NextResponse } from "next/server";
import { batchUpdateOptimalHours } from "@/lib/send-time/calculate-optimal";

// GET /api/cron/analyze-engagement — daily recalculation of optimal send hours
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await batchUpdateOptimalHours();
    return NextResponse.json({
      message: "Engagement analysis complete",
      ...result,
    });
  } catch (error) {
    console.error("Cron analyze-engagement error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
