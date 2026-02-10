import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/linkedin
 * - Without ?action=connect: returns connection status
 * - With ?action=connect: redirects to LinkedIn OAuth authorization
 */
export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");

  if (action === "connect") {
    return startOAuthFlow(request);
  }

  return getConnectionStatus();
}

function getConnectionStatus() {
  const hasAccessToken = !!process.env.LINKEDIN_ACCESS_TOKEN;
  const hasRefreshToken = !!process.env.LINKEDIN_REFRESH_TOKEN;
  const hasPersonUrn = !!process.env.LINKEDIN_PERSON_URN;
  const hasClientId = !!process.env.LINKEDIN_CLIENT_ID;

  return NextResponse.json({
    connected: hasAccessToken && hasPersonUrn,
    hasAccessToken,
    hasRefreshToken,
    hasPersonUrn,
    hasClientId,
  });
}

function startOAuthFlow(request: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "LINKEDIN_CLIENT_ID not configured" },
      { status: 500 }
    );
  }

  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/admin/linkedin/callback`;
  const state = crypto.randomUUID();

  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "w_member_social openid profile");

  return NextResponse.redirect(authUrl.toString());
}
