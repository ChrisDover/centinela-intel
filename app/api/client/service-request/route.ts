import { NextRequest, NextResponse } from "next/server";
import { getClientFromRequest } from "@/lib/client-auth";
import resend from "@/lib/resend";

export async function POST(request: NextRequest) {
  const client = await getClientFromRequest(request);

  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, destination, location, topic, dates, details } = body;

    // Send notification email to the Centinela team
    await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to: "chris@centinelaintel.com",
      subject: `[Service Request] ${serviceId} — ${client.email}`,
      html: `<div style="font-family: system-ui; padding: 20px;">
        <h2 style="font-family: monospace; font-size: 14px; color: #666;">SERVICE REQUEST</h2>
        <p><strong>Client:</strong> ${client.name || client.email}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Country:</strong> ${client.countryName} (${client.country})</p>
        <p><strong>Service:</strong> ${serviceId}</p>
        ${destination ? `<p><strong>Destination:</strong> ${destination}</p>` : ""}
        ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
        ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ""}
        ${dates ? `<p><strong>Dates:</strong> ${dates}</p>` : ""}
        <p><strong>Details:</strong></p>
        <p>${details}</p>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Service Request] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
