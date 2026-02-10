import { NextRequest, NextResponse } from "next/server";
import { evaluateAllRunningTests } from "@/lib/ab-testing/evaluate-test";

// GET /api/cron/evaluate-ab-tests — daily check for A/B test winners
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await evaluateAllRunningTests();
    return NextResponse.json({
      message: "A/B test evaluation complete",
      ...result,
    });
  } catch (error) {
    console.error("Cron evaluate-ab-tests error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Evaluation failed" },
      { status: 500 }
    );
  }
}
