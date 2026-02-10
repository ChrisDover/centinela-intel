import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

const protectedPaths = [
  "/admin/dashboard",
  "/admin/email",
  "/admin/subscribers",
  "/admin/campaigns",
  "/admin/insights",
];

const protectedApiPaths = [
  "/api/admin/stats",
  "/api/admin/subscribers",
  "/api/admin/email-analytics",
  "/api/admin/campaigns",
  "/api/admin/ab-tests",
  "/api/admin/cta-analytics",
  "/api/admin/logout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cron auth — verify CRON_SECRET
  if (pathname.startsWith("/api/cron/")) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isProtectedPage = protectedPaths.some((p) => pathname.startsWith(p));
  const isProtectedApi = protectedApiPaths.some((p) => pathname.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();

  const token = getTokenFromRequest(request);
  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path*", "/api/cron/:path*"],
};
