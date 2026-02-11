import { getClientFromCookie } from "@/lib/client-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ClientBriefsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  const params = await searchParams;

  const briefs = client.country
    ? await prisma.clientBrief.findMany({
        where: { country: client.country },
        orderBy: { createdAt: "desc" },
        take: 30,
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
        BRIEF ARCHIVE — {client.countryName?.toUpperCase() || "ALL"}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "1.75rem",
          marginBottom: 32,
        }}
      >
        Intelligence Briefs
      </h1>

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
                  href={`/client/briefs?id=${b.id}`}
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
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: tc,
                      letterSpacing: 0.5,
                    }}
                  >
                    {b.threatLevel}
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
