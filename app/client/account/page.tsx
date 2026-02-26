import { getClientFromCookie } from "@/lib/client-auth";
import { redirect } from "next/navigation";

export default async function ClientAccountPage() {
  const client = await getClientFromCookie();
  if (!client) redirect("/client/login");

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        ACCOUNT SETTINGS
      </p>
      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "1.75rem",
          marginBottom: 32,
        }}
      >
        Your Account
      </h1>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
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
          SUBSCRIPTION
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Plan
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {({
                "1-country": "Monitor (1 Country)",
                "2-country": "Monitor (2 Countries)",
                "3-country": "Monitor (3 Countries)",
                "all-countries": "Monitor (All Countries)",
                "monitor-1-country": "Monitor 1 Country — $29/mo",
                "monitor-corridor": "Monitor 5 Countries — $79/mo",
                "watch-pro-starter": "Watch Pro — $199/mo",
              } as Record<string, string>)[client.planTier] || client.planTier}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Status
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color:
                  client.planStatus === "active"
                    ? "var(--accent)"
                    : "var(--danger)",
              }}
            >
              {client.planStatus === "active"
                ? "Active"
                : client.planStatus === "past_due"
                  ? "Past Due"
                  : "Cancelled"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Countries
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {client.countries
                ? (() => {
                    const parsed = JSON.parse(client.countries);
                    return parsed.length > 3
                      ? `${parsed.length} countries (All)`
                      : parsed.map((c: { name: string }) => c.name).join(", ");
                  })()
                : client.countryName || "Not selected"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Email
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{client.email}</div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Member Since
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {client.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
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
          BILLING
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          Manage your subscription, update payment methods, or view invoices
          through the Stripe customer portal.
        </p>
        <form action="/api/client/portal" method="POST">
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 14 }}
          >
            Manage Billing
          </button>
        </form>
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <a
          href="/api/client/logout"
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            textDecoration: "underline",
          }}
        >
          Log Out
        </a>
      </div>
    </div>
  );
}
