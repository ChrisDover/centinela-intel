"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Campaign {
  id: string;
  type: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  openRate: number | null;
  clickRate: number | null;
}

interface EmailData {
  campaigns: Campaign[];
  kpis: {
    totalCampaigns: number;
    avgOpenRate: number;
    avgClickRate: number;
    bounceRate: number;
  };
  dailyTrends: Array<{ date: string; openRate: number; clickRate: number }>;
}

const TYPE_BADGES: Record<string, string> = {
  welcome: "bg-centinela-accent/15 text-centinela-accent",
  brief: "bg-centinela-info/15 text-centinela-info",
  broadcast: "bg-centinela-warning/15 text-centinela-warning",
  alert: "bg-centinela-danger/15 text-centinela-danger",
};

const FILTER_TYPES = ["all", "welcome", "brief", "broadcast", "alert"];

export default function EmailClient() {
  const [data, setData] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const params = typeFilter !== "all" ? `?type=${typeFilter}` : "";
    setLoading(true);
    fetch(`/api/admin/email-analytics${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [typeFilter]);

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading email analytics...
      </div>
    );
  }

  if (!data) {
    return <div className="text-centinela-danger">Failed to load data</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-centinela-text-primary">
          Email Analytics
        </h1>
        <p className="mt-1 text-sm text-centinela-text-muted">
          Campaign performance and engagement trends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Campaigns
          </div>
          <div className="font-mono text-2xl font-medium">
            {data.kpis.totalCampaigns}
          </div>
        </div>
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Avg Open Rate
          </div>
          <div className="font-mono text-2xl font-medium text-centinela-accent">
            {data.kpis.avgOpenRate}%
          </div>
        </div>
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Avg Click Rate
          </div>
          <div className="font-mono text-2xl font-medium text-centinela-info">
            {data.kpis.avgClickRate}%
          </div>
        </div>
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Bounce Rate
          </div>
          <div className="font-mono text-2xl font-medium text-centinela-danger">
            {data.kpis.bounceRate}%
          </div>
        </div>
      </div>

      {/* Open/Click Rate Trend */}
      <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
          Open / Click Rate Trend — Last 30 Days
        </h3>
        {data.dailyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.dailyTrends}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#5a6680" }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#5a6680" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141a28",
                  border: "1px solid #1e2a3f",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#8a96ad" }}
              />
              <Line
                type="monotone"
                dataKey="openRate"
                name="Open Rate"
                stroke="#00d4aa"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="clickRate"
                name="Click Rate"
                stroke="#4da6ff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-60 items-center justify-center text-sm text-centinela-text-muted">
            No trend data yet
          </div>
        )}
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-1">
        {FILTER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-md px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
              typeFilter === t
                ? "bg-centinela-accent/15 text-centinela-accent"
                : "text-centinela-text-muted hover:text-centinela-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-centinela-border">
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Type
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Subject
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Sent
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Recipients
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Opens
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Clicks
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Bounced
                </th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    No campaigns found
                  </td>
                </tr>
              ) : (
                data.campaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          TYPE_BADGES[c.type] ||
                          "bg-centinela-border text-centinela-text-muted"
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="max-w-xs truncate py-2 text-centinela-text-secondary">
                      {c.subject}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {new Date(c.sentAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {c.recipientCount}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-accent">
                      {c.openedCount}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-info">
                      {c.clickedCount}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-danger">
                      {c.bouncedCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
