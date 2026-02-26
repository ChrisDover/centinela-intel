"use client";

import { useEffect, useState, useCallback } from "react";

interface ClientDetail {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: string;
  planTier: string;
  planStatus: string;
  countries: string | null;
  focusAreas: string | null;
  createdAt: string;
  onboardedAt: string | null;
}

interface Brief {
  id: string;
  country: string;
  countryName: string;
  date: string;
  threatLevel: string;
  createdAt: string;
}

interface ClientDetailData {
  client: ClientDetail;
  briefs: Brief[];
}

const TIER_LABELS: Record<string, string> = {
  "internal": "Internal (Free)",
  "1-country": "1 Country (Legacy)",
  "2-country": "2 Countries (Legacy)",
  "3-country": "3 Countries (Legacy)",
  "all-countries": "All Countries (Legacy)",
  "monitor-1-country": "Monitor 1 Country ($29/mo)",
  "monitor-corridor": "Monitor 5 Countries ($79/mo)",
  "watch-pro-starter": "Watch Pro ($199/mo)",
};

const TIERS = ["internal", "1-country", "2-country", "3-country", "all-countries", "monitor-1-country", "monitor-corridor", "watch-pro-starter"];
const STATUSES = ["active", "past_due", "cancelled"];

function parseJsonArray(json: string | null): string[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) {
      return arr.map((item) =>
        typeof item === "string" ? item : item.name || item.code || String(item)
      );
    }
    return [];
  } catch {
    return [];
  }
}

export default function ClientDetailClient({ id }: { id: string }) {
  const [data, setData] = useState<ClientDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [magicLinkSending, setMagicLinkSending] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [changingTier, setChangingTier] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/clients/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function sendMagicLink() {
    setMagicLinkSending(true);
    await fetch(`/api/admin/clients/${id}/magic-link`, { method: "POST" });
    setMagicLinkSending(false);
    setMagicLinkSent(true);
    setTimeout(() => setMagicLinkSent(false), 3000);
  }

  async function updateField(field: string, value: string) {
    await fetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading client...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-centinela-danger">Failed to load client data</div>
    );
  }

  const { client, briefs } = data;
  const countries = parseJsonArray(client.countries);
  const focusAreas = parseJsonArray(client.focusAreas);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <a
            href="/admin/clients"
            className="mb-2 inline-block font-mono text-xs text-centinela-text-muted transition-colors hover:text-centinela-accent"
          >
            &larr; Back to Clients
          </a>
          <h1 className="font-display text-2xl text-centinela-text-primary">
            {client.name || client.email}
          </h1>
          <p className="mt-1 text-sm text-centinela-text-muted">
            {client.company || "No company"} &middot; Member since{" "}
            {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs ${
              client.planStatus === "active"
                ? "bg-centinela-accent/15 text-centinela-accent"
                : client.planStatus === "past_due"
                  ? "bg-centinela-warning/15 text-centinela-warning"
                  : "bg-centinela-danger/15 text-centinela-danger"
            }`}
          >
            {client.planStatus}
          </span>
          <span className="rounded bg-centinela-info/15 px-2 py-0.5 font-mono text-xs text-centinela-info">
            {TIER_LABELS[client.planTier] || client.planTier}
          </span>
        </div>
      </div>

      {/* Info Grid + Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Grid */}
        <div className="col-span-2 rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Client Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Email" value={client.email} />
            <InfoRow label="Company" value={client.company || "—"} />
            <InfoRow label="Plan" value={client.plan} />
            <InfoRow
              label="Onboarded"
              value={
                client.onboardedAt
                  ? new Date(client.onboardedAt).toLocaleDateString()
                  : "Not yet"
              }
            />
            <InfoRow
              label="Countries"
              value={countries.length > 0 ? countries.join(", ") : "—"}
            />
            <InfoRow
              label="Focus Areas"
              value={focusAreas.length > 0 ? focusAreas.join(", ") : "—"}
            />
            {client.stripeCustomerId && (
              <InfoRow
                label="Stripe Customer"
                value={
                  <a
                    href={`https://dashboard.stripe.com/customers/${client.stripeCustomerId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-centinela-accent hover:underline"
                  >
                    {client.stripeCustomerId}
                  </a>
                }
              />
            )}
            {client.stripeSubscriptionId && (
              <InfoRow
                label="Stripe Subscription"
                value={
                  <a
                    href={`https://dashboard.stripe.com/subscriptions/${client.stripeSubscriptionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-centinela-accent hover:underline"
                  >
                    {client.stripeSubscriptionId}
                  </a>
                }
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
              Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={sendMagicLink}
                disabled={magicLinkSending}
                className="w-full rounded-lg border border-centinela-border px-4 py-2 font-mono text-xs text-centinela-text-secondary transition-colors hover:border-centinela-accent hover:text-centinela-accent disabled:opacity-50"
              >
                {magicLinkSending
                  ? "Sending..."
                  : magicLinkSent
                    ? "Magic Link Sent!"
                    : "Send Magic Link"}
              </button>

              {client.stripeCustomerId && (
                <a
                  href={`https://dashboard.stripe.com/customers/${client.stripeCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg border border-centinela-border px-4 py-2 text-center font-mono text-xs text-centinela-text-secondary transition-colors hover:border-centinela-info hover:text-centinela-info"
                >
                  View in Stripe
                </a>
              )}

              {/* Change Tier */}
              {changingTier ? (
                <div className="space-y-2">
                  <div className="font-mono text-xs text-centinela-text-muted">
                    Select tier:
                  </div>
                  {TIERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        updateField("planTier", t);
                        setChangingTier(false);
                      }}
                      className={`w-full rounded border px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                        t === client.planTier
                          ? "border-centinela-accent bg-centinela-accent/10 text-centinela-accent"
                          : "border-centinela-border text-centinela-text-muted hover:border-centinela-accent hover:text-centinela-accent"
                      }`}
                    >
                      {TIER_LABELS[t] || t}
                    </button>
                  ))}
                  <button
                    onClick={() => setChangingTier(false)}
                    className="w-full font-mono text-xs text-centinela-text-muted hover:text-centinela-text-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setChangingTier(true)}
                  className="w-full rounded-lg border border-centinela-border px-4 py-2 font-mono text-xs text-centinela-text-secondary transition-colors hover:border-centinela-warning hover:text-centinela-warning"
                >
                  Change Tier
                </button>
              )}

              {/* Change Status */}
              {changingStatus ? (
                <div className="space-y-2">
                  <div className="font-mono text-xs text-centinela-text-muted">
                    Select status:
                  </div>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateField("planStatus", s);
                        setChangingStatus(false);
                      }}
                      className={`w-full rounded border px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                        s === client.planStatus
                          ? "border-centinela-accent bg-centinela-accent/10 text-centinela-accent"
                          : "border-centinela-border text-centinela-text-muted hover:border-centinela-accent hover:text-centinela-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => setChangingStatus(false)}
                    className="w-full font-mono text-xs text-centinela-text-muted hover:text-centinela-text-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setChangingStatus(true)}
                  className="w-full rounded-lg border border-centinela-border px-4 py-2 font-mono text-xs text-centinela-text-secondary transition-colors hover:border-centinela-danger hover:text-centinela-danger"
                >
                  Change Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brief Delivery History */}
      <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
          Brief Delivery History — Last 30
        </h3>
        {briefs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-centinela-border">
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Date
                  </th>
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Country
                  </th>
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Threat Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {briefs.map((brief) => (
                  <tr
                    key={brief.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {brief.date}
                    </td>
                    <td className="py-2 text-centinela-text-secondary">
                      {brief.countryName}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          brief.threatLevel === "CRITICAL"
                            ? "bg-centinela-danger/15 text-centinela-danger"
                            : brief.threatLevel === "HIGH"
                              ? "bg-centinela-warning/15 text-centinela-warning"
                              : brief.threatLevel === "ELEVATED"
                                ? "bg-centinela-info/15 text-centinela-info"
                                : "bg-centinela-accent/15 text-centinela-accent"
                        }`}
                      >
                        {brief.threatLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-sm text-centinela-text-muted">
            No briefs delivered yet
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
        {label}
      </div>
      <div className="mt-1 text-sm text-centinela-text-secondary">{value}</div>
    </div>
  );
}
