import { getClientFromCookie } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ThreatMapWrapper from "./ThreatMapWrapper";
import ThreatTrend from "./ThreatTrend";
import IncidentTimeline from "./IncidentTimeline";
import RegionBreakdown from "./RegionBreakdown";
import ExportButton from "./ExportButton";
import FocusAreas from "./FocusAreas";
import CountrySelector from "./CountrySelector";
import RunReportButton from "./RunReportButton";

function getClientCountryCodes(client: {
  countries?: string | null;
  country?: string | null;
}): string[] {
  if (client.countries) {
    const parsed: { code: string }[] = JSON.parse(client.countries);
    return parsed.map((c) => c.code);
  }
  if (client.country && client.country !== "ALL") return [client.country];
  return [];
}

export default async function ClientDashboard({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  const params = await searchParams;
  const countryCodes = getClientCountryCodes(client);
  const isAllCountries = client.country === "ALL" || countryCodes.length > 3;
  const countries: { code: string; name: string }[] = client.countries
    ? JSON.parse(client.countries)
    : client.country && client.country !== "ALL"
      ? [{ code: client.country, name: client.countryName || client.country }]
      : [];

  // Determine which country to show (default to first)
  const activeCountry =
    params.country && countryCodes.includes(params.country)
      ? params.country
      : countryCodes[0] || null;

  const activeCountryName =
    countries.find((c) => c.code === activeCountry)?.name || client.countryName || "Country Monitor";

  const latestBrief = activeCountry
    ? await prisma.clientBrief.findFirst({
        where: { country: activeCountry },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const recentBriefs = activeCountry
    ? await prisma.clientBrief.findMany({
        where: { country: activeCountry },
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
            {activeCountryName}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {activeCountry && (
            <RunReportButton
              countryCode={activeCountry}
              countryName={activeCountryName}
            />
          )}
          {latestBrief && <ExportButton briefId={latestBrief.id} countryName={latestBrief.countryName} date={latestBrief.date} />}
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
                  fontSize: 12,
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

      {/* Country Selector (multi-country clients only) */}
      {countries.length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <CountrySelector
            countries={countries}
            activeCountry={activeCountry || ""}
          />
        </div>
      )}

      {/* What Changed + Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: briefData?.whatChanged?.length > 0 ? "1fr auto" : "1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {briefData?.whatChanged?.length > 0 && (
          <div
            style={{
              padding: 20,
              background: "rgba(0, 212, 170, 0.06)",
              border: "1px solid rgba(0, 212, 170, 0.25)",
              borderRadius: 8,
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "var(--accent)",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              What Changed (Last 24h)
            </p>
            {briefData.whatChanged.map((w: string, i: number) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)", paddingLeft: 12, marginBottom: 6 }}>
                &bull; {w}
              </p>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: briefData?.whatChanged?.length > 0 ? 200 : undefined }}>
          <div
            style={{
              padding: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              Active Incidents
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>{incidents.length}</div>
          </div>
          <div
            style={{
              padding: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              Critical / High
            </div>
            <div
              style={{
                fontSize: 22,
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
              flex: 1,
            }}
          >
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              Status
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: client.planStatus === "active" ? "var(--accent)" : "var(--danger)",
              }}
            >
              {client.planStatus === "active" ? "Active" : client.planStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Intelligence Brief */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 28,
          marginBottom: 24,
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
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              {latestBrief!.date} — {latestBrief!.countryName}
            </p>

            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Key Developments
              </p>
              {briefData.developments?.map((d: string, i: number) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)", paddingLeft: 12, marginBottom: 6 }}>
                  &bull; {d}
                </p>
              ))}
            </div>

            {briefData.keyRisks?.length > 0 && (
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Key Risks
                </p>
                {briefData.keyRisks.map((r: string, i: number) => (
                  <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)", paddingLeft: 12, marginBottom: 6 }}>
                    &bull; {r}
                  </p>
                ))}
              </div>
            )}

            {briefData.travelAdvisory && (
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Travel Advisory
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)" }}>{briefData.travelAdvisory}</p>
              </div>
            )}

            <div style={{ paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Analyst Assessment
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)" }}>{briefData.analystNote}</p>
            </div>
          </>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            No briefs generated yet. Your first brief will arrive tomorrow morning.
          </p>
        )}
      </div>

      {/* Two column: Threat Map + Incident Feed */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {incidents.length > 0 && activeCountry ? (
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
              THREAT MAP — {activeCountryName.toUpperCase()}
            </div>
            <ThreatMapWrapper incidents={incidents} countryCode={activeCountry} />
          </div>
        ) : (
          <div />
        )}

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            maxHeight: 400,
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

      {/* Two column: Regional Assessment + Threat Trend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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

        <ThreatTrend briefs={recentBriefs} />
      </div>

      {/* Focus Areas (settings/config — bottom) */}
      <div style={{ marginBottom: 24 }}>
        <FocusAreas initial={client.focusAreas ? JSON.parse(client.focusAreas) : []} />
      </div>

    </div>
    </>
  );
}
