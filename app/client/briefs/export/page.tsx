import { getClientFromCookie } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function ExportBriefPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  const params = await searchParams;
  if (!params.id) redirect("/client/briefs");

  const brief = await prisma.clientBrief.findUnique({
    where: { id: params.id },
  });

  if (!brief || brief.country !== client.country) redirect("/client/briefs");

  const data = JSON.parse(brief.content);

  const threatColor =
    brief.threatLevel === "CRITICAL"
      ? "#ff4757"
      : brief.threatLevel === "HIGH"
        ? "#ff6348"
        : brief.threatLevel === "ELEVATED"
          ? "#c87800"
          : "#1a1a1a";

  return (
    <html>
      <head>
        <title>
          {brief.countryName} Intelligence Brief — {brief.date}
        </title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            @page { margin: 1cm; }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1a1a1a;
            background: #fff;
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
          }
          h1 { font-size: 14px; font-family: monospace; letter-spacing: 1px; color: #666; margin: 0 0 4px; font-weight: normal; }
          h2 { font-size: 13px; font-family: monospace; letter-spacing: 0.5px; color: #666; text-transform: uppercase; margin: 24px 0 8px; }
          .date { font-size: 13px; color: #999; margin-bottom: 16px; }
          .threat { font-size: 14px; font-family: monospace; font-weight: bold; letter-spacing: 1px; margin-bottom: 24px; }
          .dev { font-size: 14px; line-height: 1.8; padding-left: 16px; margin-bottom: 6px; }
          .region { margin-bottom: 12px; }
          .region-name { font-weight: 600; }
          .region-level { font-family: monospace; font-size: 11px; letter-spacing: 0.5px; }
          .analyst { font-size: 14px; line-height: 1.8; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
          .print-btn {
            position: fixed; top: 16px; right: 16px;
            padding: 10px 20px; background: #1a1a1a; color: #fff;
            border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
          }
        `,
          }}
        />
      </head>
      <body>
        <PrintButton />

        <h1>CENTINELA INTEL — COUNTRY MONITOR</h1>
        <div className="date">
          {brief.date} — {brief.countryName}
        </div>
        <div className="threat" style={{ color: threatColor }}>
          THREAT LEVEL: {brief.threatLevel}
        </div>

        <h2>Key Developments</h2>
        {data.developments?.map((d: string, i: number) => (
          <div key={i} className="dev">
            &bull; {d}
          </div>
        ))}

        {data.keyRisks && data.keyRisks.length > 0 && (
          <>
            <h2>Key Risks</h2>
            {data.keyRisks.map((r: string, i: number) => (
              <div key={i} className="dev">
                &bull; {r}
              </div>
            ))}
          </>
        )}

        {data.regions && data.regions.length > 0 && (
          <>
            <h2>Regional Assessment</h2>
            {data.regions.map(
              (
                r: { name: string; threatLevel: string; summary: string },
                i: number
              ) => (
                <div key={i} className="region">
                  <span className="region-name">{r.name}</span>{" "}
                  <span
                    className="region-level"
                    style={{
                      color:
                        r.threatLevel === "CRITICAL" || r.threatLevel === "HIGH"
                          ? "#ff4757"
                          : "#666",
                    }}
                  >
                    [{r.threatLevel}]
                  </span>
                  <div style={{ fontSize: 14, color: "#444" }}>{r.summary}</div>
                </div>
              )
            )}
          </>
        )}

        <h2>Analyst Assessment</h2>
        <div className="analyst">{data.analystNote}</div>

        <div className="footer">
          Centinela Intel — Country Monitor — A service of Enfocado Capital LLC
          <br />
          Classification: Client Confidential — Not for distribution
        </div>
      </body>
    </html>
  );
}
