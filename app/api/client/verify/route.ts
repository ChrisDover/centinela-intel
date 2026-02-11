import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/client-auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/client/login?error=missing_token", request.url)
    );
  }

  const result = await verifyMagicLink(token);

  if (!result) {
    return NextResponse.redirect(
      new URL("/client/login?error=invalid_or_expired", request.url)
    );
  }

  const response = NextResponse.redirect(
    new URL("/client/dashboard", request.url)
  );

  response.cookies.set("client_session", result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}
