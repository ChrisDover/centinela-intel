import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("client_session")?.value;

  if (sessionToken) {
    // Invalidate the session in the database
    await prisma.client.updateMany({
      where: { sessionToken },
      data: { sessionToken: null, sessionExpiresAt: null },
    });
  }

  const response = NextResponse.redirect(
    new URL("/client/login", request.url)
  );

  response.cookies.set("client_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
