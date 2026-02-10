import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/linkedin/callback
 * OAuth callback — exchanges authorization code for tokens.
 * One-time use: displays tokens for copying into Vercel env vars.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      { error, description: errorDescription },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET" },
      { status: 500 }
    );
  }

  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/admin/linkedin/callback`;

  // Exchange authorization code for tokens
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    return NextResponse.json(
      { error: "Token exchange failed", details: text },
      { status: 400 }
    );
  }

  const tokens = await tokenResponse.json();

  // Fetch user profile to get person URN
  let personUrn = "";
  try {
    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      personUrn = profile.sub || "";
    }
  } catch {
    // Non-fatal — user can manually find their URN
  }

  // Return tokens for manual env var setup
  // In production, these should ONLY be shown to the admin completing setup
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><title>LinkedIn Connected</title></head>
<body style="font-family: monospace; padding: 40px; max-width: 700px; margin: 0 auto; background: #0a0e17; color: #e0e0e0;">
  <h1 style="color: #00d4aa;">LinkedIn Connected</h1>
  <p>Copy these values into your Vercel environment variables:</p>

  <div style="background: #141a28; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>LINKEDIN_ACCESS_TOKEN</strong></p>
    <textarea readonly style="width: 100%; height: 60px; background: #1a2035; color: #fff; border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 12px;">${tokens.access_token}</textarea>
    <p style="color: #999; font-size: 12px;">Expires in ${Math.round(tokens.expires_in / 86400)} days</p>
  </div>

  ${tokens.refresh_token ? `
  <div style="background: #141a28; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>LINKEDIN_REFRESH_TOKEN</strong></p>
    <textarea readonly style="width: 100%; height: 60px; background: #1a2035; color: #fff; border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 12px;">${tokens.refresh_token}</textarea>
    <p style="color: #999; font-size: 12px;">Expires in ${Math.round((tokens.refresh_token_expires_in || 31536000) / 86400)} days</p>
  </div>
  ` : ""}

  ${personUrn ? `
  <div style="background: #141a28; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>LINKEDIN_PERSON_URN</strong></p>
    <textarea readonly style="width: 100%; height: 40px; background: #1a2035; color: #fff; border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 12px;">${personUrn}</textarea>
  </div>
  ` : `
  <div style="background: #141a28; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>LINKEDIN_PERSON_URN</strong></p>
    <p style="color: #ffb347;">Could not auto-detect. Find your member ID in LinkedIn URL or profile settings.</p>
  </div>
  `}

  <p style="color: #ff4757; margin-top: 30px;">After copying, close this page. Do not share these tokens.</p>
</body>
</html>`,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
