import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { magicLinkEmail } from "@/lib/emails/magic-link";
import { NextRequest } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com";

export async function sendMagicLink(email: string): Promise<void> {
  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) return; // don't leak whether email exists

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.client.update({
    where: { email },
    data: {
      magicLinkToken: token,
      magicLinkExpiresAt: expiresAt,
    },
  });

  const verifyUrl = `${BASE_URL}/api/client/verify?token=${token}`;

  await resend.emails.send({
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: email,
    subject: "Your Centinela Intel Login Link",
    html: magicLinkEmail(verifyUrl),
  });
}

export async function verifyMagicLink(
  token: string
): Promise<{ sessionToken: string; clientId: string } | null> {
  const client = await prisma.client.findFirst({
    where: {
      magicLinkToken: token,
      magicLinkExpiresAt: { gte: new Date() },
    },
  });

  if (!client) return null;

  const sessionToken = randomBytes(32).toString("hex");
  const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.client.update({
    where: { id: client.id },
    data: {
      magicLinkToken: null,
      magicLinkExpiresAt: null,
      sessionToken,
      sessionExpiresAt,
    },
  });

  return { sessionToken, clientId: client.id };
}

export async function getClientFromRequest(request: NextRequest) {
  const sessionToken = request.cookies.get("client_session")?.value;
  if (!sessionToken) return null;

  const client = await prisma.client.findFirst({
    where: {
      sessionToken,
      sessionExpiresAt: { gte: new Date() },
    },
  });

  return client;
}

export async function getClientFromCookie() {
  // For use in Server Components — dynamically import cookies
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("client_session")?.value;
  if (!sessionToken) return null;

  const client = await prisma.client.findFirst({
    where: {
      sessionToken,
      sessionExpiresAt: { gte: new Date() },
    },
  });

  return client;
}
