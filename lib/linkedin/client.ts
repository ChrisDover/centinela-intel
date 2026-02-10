/**
 * LinkedIn API client — posting + token refresh.
 * Uses LinkedIn Community Management API v2.
 * Access tokens last 60 days, refresh tokens last 365 days.
 */

interface LinkedInPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

interface TokenRefreshResult {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

function getConfig() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!clientId || !clientSecret) {
    throw new Error("Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET");
  }

  return { clientId, clientSecret, accessToken, refreshToken, personUrn };
}

export async function refreshLinkedInToken(): Promise<TokenRefreshResult> {
  const { clientId, clientSecret, refreshToken } = getConfig();

  if (!refreshToken) {
    throw new Error("Missing LINKEDIN_REFRESH_TOKEN — re-authorize via /api/admin/linkedin");
  }

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LinkedIn token refresh failed (${response.status}): ${text}`);
  }

  return response.json();
}

export async function postToLinkedIn(text: string): Promise<LinkedInPostResult> {
  const { accessToken, personUrn } = getConfig();

  if (!accessToken || !personUrn) {
    return { success: false, error: "Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN" };
  }

  // Try posting — if 401, attempt token refresh and retry once
  let token = accessToken;

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${personUrn}`,
        commentary: text,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
      }),
    });

    if (response.ok || response.status === 201) {
      const locationHeader = response.headers.get("x-restli-id");
      return { success: true, postId: locationHeader || undefined };
    }

    // On 401 (expired token), try refreshing once
    if (response.status === 401 && attempt === 0) {
      try {
        console.log("LinkedIn access token expired, attempting refresh...");
        const refreshed = await refreshLinkedInToken();
        token = refreshed.access_token;
        console.log(
          "LinkedIn token refreshed. Update LINKEDIN_ACCESS_TOKEN in Vercel env vars.",
          "New token expires in", refreshed.expires_in, "seconds."
        );
        // Note: In production, you'd want to store this new token.
        // For now, log it so the operator can update env vars.
        continue;
      } catch (refreshError) {
        return {
          success: false,
          error: `Token expired and refresh failed: ${refreshError instanceof Error ? refreshError.message : "Unknown"}`,
        };
      }
    }

    const errorText = await response.text();
    return { success: false, error: `LinkedIn API error (${response.status}): ${errorText}` };
  }

  return { success: false, error: "Unexpected: exhausted retry attempts" };
}
