import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return Response.redirect(new URL("/", request.url));
  }

  let success = false;

  try {
    await prisma.subscriber.update({
      where: { unsubscribeToken: token },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    });
    success = true;
  } catch (error) {
    console.error("Unsubscribe error:", error);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — Centinela AI</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0a0e17;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      max-width: 440px;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #94a3b8;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
    a {
      color: #00d4aa;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    ${
      success
        ? `<h1>You've been unsubscribed.</h1>
         <p>You won't receive any more emails from The Centinela Brief. If this was a mistake, you can <a href="/subscribe">re-subscribe here</a>.</p>`
        : `<h1>Something went wrong.</h1>
         <p>We couldn't process your unsubscribe request. Please try again or contact <a href="mailto:intel@centinelaintel.com">intel@centinelaintel.com</a>.</p>`
    }
    <p><a href="/">← Back to Centinela AI</a></p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
