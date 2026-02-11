import { getClientFromCookie } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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

export default async function ClientBriefsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; country?: string }>;
}) {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  const params = await searchParams;
  const countryCodes = getClientCountryCodes(client);

  // Filter by country if specified, otherwise show all monitored countries
  const filterCountry = params.country && countryCodes.includes(params.country)
    ? params.country
    : null;

  const briefs = countryCodes.length > 0
    ? await prisma.clientBrief.findMany({
        where: {
          country: filterCountry
            ? filterCountry
            : { in: countryCodes },
        },
        orderBy: { createdAt: "desc" },
        take: 60,
      })
    : [];

  // If an ID is provided, show that brief expanded
  const selectedId = params.id;
  const selectedBrief = selectedId
    ? briefs.find((b) => b.id === selectedId)
    : briefs[0] || null;

  const selectedData = selectedBrief
    ? JSON.parse(selectedBrief.content)
    : null;

  const countries: { code: string; name: string }[] = client.countries
    ? JSON.parse(client.countries)
    : [];

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 20px" }}>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        BRIEF ARCHIVE{filterCountry ? ` — ${briefs[0]?.countryName?.toUpperCase() || filterCountry}` : ""}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "1.75rem",
          marginBottom: 16,
        }}
      >
        Intelligence Briefs
      </h1>

      {/* Country filter tabs (multi-country clients) */}
      {countries.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          <a
            href="/client/briefs"
            style={{
              padding: "5px 12px",
              fontSize: 12,
              fontFamily: "monospace",
              background: !filterCountry ? "var(--accent)" : "var(--bg-card)",
              color: !filterCountry ? "#0a0e17" : "var(--text-secondary)",
              border: !filterCountry ? "1px solid var(--accent)" : "1px solid var(--border)",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: !filterCountry ? 600 : 400,
            }}
          >
            All
          </a>
          {countries.map((c) => (
            <a
              key={c.code}
              href={`/client/briefs?country=${c.code}`}
              style={{
                padding: "5px 12px",
                fontSize: 12,
                fontFamily: "monospace",
                background: filterCountry === c.code ? "var(--accent)" : "var(--bg-card)",
                color: filterCountry === c.code ? "#0a0e17" : "var(--text-secondary)",
                border: filterCountry === c.code ? "1px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 4,
                textDecoration: "none",
                fontWeight: filterCountry === c.code ? 600 : 400,
              }}
            >
              {c.name}
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 24,
        }}
      >
        {/* Brief list */}
        <div>
          {briefs.length > 0 ? (
            briefs.map((b) => {
              const isSelected = selectedBrief?.id === b.id;
              const tc =
                b.threatLevel === "CRITICAL"
                  ? "var(--danger)"
                  : b.threatLevel === "HIGH"
                    ? "#ff6348"
                    : b.threatLevel === "ELEVATED"
                      ? "var(--warning)"
                      : "var(--accent)";
              return (
                <a
                  key={b.id}
                  href={`/client/briefs?id=${b.id}${filterCountry ? `&country=${filterCountry}` : ""}`}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    marginBottom: 4,
                    background: isSelected
                      ? "var(--bg-card-hover)"
                      : "var(--bg-card)",
                    border: isSelected
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                    borderRadius: 6,
                    textDecoration: "none",
                    color: "var(--text-primary)",
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{b.date}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: tc,
                        letterSpacing: 0.5,
                      }}
                    >
                      {b.threatLevel}
                    </span>
                    {countries.length > 1 && (
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 10,
                          color: "var(--text-muted)",
                          letterSpacing: 0.5,
                        }}
                      >
                        {b.countryName}
                      </span>
                    )}
                  </div>
                </a>
              );
            })
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              No briefs yet. Your first brief will be generated tomorrow morning.
            </p>
          )}
        </div>

        {/* Brief detail */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          {selectedData ? (
            <>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                {selectedBrief!.countryName.toUpperCase()} — DAILY INTELLIGENCE
                BRIEF
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                {selectedBrief!.date}
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    selectedBrief!.threatLevel === "CRITICAL"
                      ? "var(--danger)"
                      : selectedBrief!.threatLevel === "HIGH"
                        ? "#ff6348"
                        : selectedBrief!.threatLevel === "ELEVATED"
                          ? "var(--warning)"
                          : "var(--accent)",
                  letterSpacing: 1,
                  marginBottom: 24,
                }}
              >
                THREAT LEVEL: {selectedBrief!.threatLevel}
              </p>

              <div style={{ marginBottom: 24 }}>
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
                {selectedData.developments?.map(
                  (d: string, i: number) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        paddingLeft: 12,
                        marginBottom: 6,
                      }}
                    >
                      &bull; {d}
                    </p>
                  )
                )}
              </div>

              {selectedData.keyRisks && selectedData.keyRisks.length > 0 && (
                <div style={{ marginBottom: 24 }}>
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
                  {selectedData.keyRisks.map(
                    (r: string, i: number) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 14,
                          lineHeight: 1.7,
                          paddingLeft: 12,
                          marginBottom: 6,
                        }}
                      >
                        &bull; {r}
                      </p>
                    )
                  )}
                </div>
              )}

              {selectedData.analystNote && (
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
                  <p style={{ fontSize: 14, lineHeight: 1.8 }}>
                    {selectedData.analystNote}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Select a brief to view its contents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
