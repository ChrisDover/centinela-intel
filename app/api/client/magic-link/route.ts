import { NextRequest, NextResponse } from "next/server";
import { sendMagicLink } from "@/lib/client-auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await sendMagicLink(email.toLowerCase().trim());

    // Always return success to avoid leaking whether the email exists
    return NextResponse.json({
      message: "If an account exists, a login link has been sent.",
    });
  } catch (error) {
    console.error("[Magic Link] Error:", error);
    return NextResponse.json(
      { message: "If an account exists, a login link has been sent." },
      { status: 200 }
    );
  }
}
