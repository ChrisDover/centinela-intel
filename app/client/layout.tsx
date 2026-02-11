import { getClientFromCookie } from "@/lib/client-auth";
import { redirect } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getClientFromCookie();

  // Login page is accessible without auth
  // Protected pages are handled by middleware

  return (
    <>
      <div className="grid-bg" />
      {client && (
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "color-mix(in srgb, var(--bg-primary) 95%, transparent)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              href="/client/dashboard"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "var(--accent)",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontSize: 16,
                  color: "var(--text-primary)",
                }}
              >
                Centinela<span style={{ color: "var(--accent)" }}>Intel</span>
              </span>
            </a>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: 1,
                padding: "2px 8px",
                border: "1px solid var(--border)",
                borderRadius: 4,
              }}
            >
              COUNTRY MONITOR
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a
              href="/client/dashboard"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Dashboard
            </a>
            <a
              href="/client/briefs"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Briefs
            </a>
            <a
              href="/client/services"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Services
            </a>
            <a
              href="/client/account"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Account
            </a>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 16,
                borderLeft: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                {client.countries
                  ? (() => {
                      const parsed = JSON.parse(client.countries);
                      return parsed.length > 3
                        ? `${parsed.length} Countries`
                        : parsed.map((c: { name: string }) => c.name).join(", ");
                    })()
                  : client.countryName || "Not set"}
              </span>
              <ThemeToggle />
              <a
                href="/api/client/logout"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                Logout
              </a>
            </div>
          </div>
        </nav>
      )}
      <div style={{ paddingTop: client ? 64 : 0 }}>{children}</div>
    </>
  );
}
