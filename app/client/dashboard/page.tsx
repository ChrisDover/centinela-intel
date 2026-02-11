import { getClientFromCookie } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ThreatMapWrapper from "./ThreatMapWrapper";
import ThreatTrend from "./ThreatTrend";
import IncidentTimeline from "./IncidentTimeline";
import RegionBreakdown from "./RegionBreakdown";
import ExportButton from "./ExportButton";
import FocusAreas from "./FocusAreas";

export default async function ClientDashboard() {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  const latestBrief = client.country
    ? await prisma.clientBrief.findFirst({
        where: { country: client.country },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const recentBriefs = client.country
    ? await prisma.clientBrief.findMany({
        where: { country: client.country },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { id: true, date: true, threatLevel: true },
      })
    : [];

  const briefData = latestBrief ? JSON.parse(latestBrief.content) : null;

  const incidents = briefData?.incidents || [];
  const regions = briefData?.regions || [];

  const threatColor =
    latestBrief?.threatLevel === "CRITICAL"
      ? "var(--danger)"
      : latestBrief?.threatLevel === "HIGH"
        ? "#ff6348"
        : latestBrief?.threatLevel === "ELEVATED"
          ? "var(--warning)"
          : "var(--accent)";

  const criticalCount = incidents.filter(
    (i: { severity: string }) => i.severity === "CRITICAL"
  ).length;
  const highCount = incidents.filter(
    (i: { severity: string }) => i.severity === "HIGH"
  ).length;

  return (
    <>
      {/* Sticky Service CTA Bar */}
      <div
        style={{
          position: "sticky",
          top: 52,
          zIndex: 90,
          background: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Need a travel threat assessment, executive protection, or custom report?
        </span>
        <a
          href="/client/services"
          className="btn-primary"
          style={{
            padding: "6px 16px",
            fontSize: 12,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Request a Service
        </a>
      </div>

    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: 0.5,
              marginBottom: 4,
            }}
          >
            INTELLIGENCE DASHBOARD
          </p>
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "1.75rem",
            }}
          >
            {client.countryName || "Country Monitor"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {latestBrief && <ExportButton briefId={latestBrief.id} />}
          {latestBrief && (
            <div
              style={{
                padding: "8px 16px",
                background: "var(--bg-card)",
                border: `1px solid ${threatColor}`,
                borderRadius: 6,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                THREAT LEVEL
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 600,
                  color: threatColor,
                  letterSpacing: 1,
                }}
              >
                {latestBrief.threatLevel}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: 16,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Active Incidents
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{incidents.length}</div>
        </div>
        <div
          style={{
            padding: 16,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Critical / High
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: criticalCount > 0 ? "var(--danger)" : highCount > 0 ? "#ff6348" : "var(--text-primary)",
            }}
          >
            {criticalCount + highCount}
          </div>
        </div>
        <div
          style={{
            padding: 16,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Status
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: client.planStatus === "active" ? "var(--accent)" : "var(--danger)",
            }}
          >
            {client.planStatus === "active" ? "Active" : client.planStatus}
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div style={{ marginBottom: 24 }}>
        <FocusAreas initial={client.focusAreas ? JSON.parse(client.focusAreas) : []} />
      </div>

      {/* Threat Map */}
      {incidents.length > 0 && client.country && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            THREAT MAP — {client.countryName?.toUpperCase()}
          </div>
          <ThreatMapWrapper incidents={incidents} countryCode={client.country} />
        </div>
      )}

      {/* Two column: Trend + Incidents */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <ThreatTrend briefs={recentBriefs} />

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            maxHeight: 340,
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: 0.5,
              padding: "12px 12px 8px",
              position: "sticky",
              top: 0,
              background: "var(--bg-card)",
              zIndex: 1,
            }}
          >
            INCIDENT FEED
          </div>
          <IncidentTimeline incidents={incidents} />
        </div>
      </div>

      {/* Two column: Regions + Brief */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            REGIONAL ASSESSMENT
          </div>
          <RegionBreakdown regions={regions} />
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: 0.5,
              marginBottom: 16,
            }}
          >
            LATEST INTELLIGENCE BRIEF
          </div>

          {briefData ? (
            <>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                {latestBrief!.date} — {latestBrief!.countryName}
              </p>

              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Key Developments
                </p>
                {briefData.developments?.map((d: string, i: number) => (
                  <p key={i} style={{ fontSize: 14, lineHeight: 1.7, paddingLeft: 12, marginBottom: 6 }}>
                    &bull; {d}
                  </p>
                ))}
              </div>

              {briefData.keyRisks?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Key Risks
                  </p>
                  {briefData.keyRisks.map((r: string, i: number) => (
                    <p key={i} style={{ fontSize: 14, lineHeight: 1.7, paddingLeft: 12, marginBottom: 6 }}>
                      &bull; {r}
                    </p>
                  ))}
                </div>
              )}

              <div>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Analyst Assessment
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8 }}>{briefData.analystNote}</p>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              No briefs generated yet. Your first brief will arrive tomorrow morning.
            </p>
          )}
        </div>
      </div>

    </div>
    </>
  );
}
