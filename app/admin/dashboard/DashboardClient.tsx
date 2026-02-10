"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Stats {
  kpis: {
    totalSubscribers: number;
    activeSubscribers: number;
    emailsSent: number;
    avgEngagement: number;
  };
  sourceBreakdown: Array<{ source: string; count: number }>;
  recentSignups: Array<{
    id: string;
    email: string;
    source: string;
    status: string;
    subscribedAt: string;
  }>;
  growthSeries: Array<{ date: string; count: number }>;
}

const PIE_COLORS = ["#00d4aa", "#4da6ff", "#ffb347", "#ff4757", "#8a96ad"];

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
      <div className="mb-1 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
        {label}
      </div>
      <div className="font-mono text-2xl font-medium text-centinela-text-primary">
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs text-centinela-text-muted">{sub}</div>
      )}
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-centinela-danger">Failed to load dashboard data</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-centinela-text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-centinela-text-muted">
          Centinela Intel overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Subscribers"
          value={data.kpis.totalSubscribers}
        />
        <KpiCard
          label="Active"
          value={data.kpis.activeSubscribers}
          sub={`${data.kpis.totalSubscribers > 0 ? Math.round((data.kpis.activeSubscribers / data.kpis.totalSubscribers) * 100) : 0}% of total`}
        />
        <KpiCard label="Emails Sent" value={data.kpis.emailsSent} />
        <KpiCard
          label="Avg Engagement"
          value={data.kpis.avgEngagement}
          sub="engagement score"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Growth Chart */}
        <div className="col-span-2 rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Subscriber Growth — Last 30 Days
          </h3>
          {data.growthSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.growthSeries}>
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
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#141a28",
                    border: "1px solid #1e2a3f",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00d4aa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-sm text-centinela-text-muted">
              No data yet
            </div>
          )}
        </div>

        {/* Source Breakdown */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Source Breakdown
          </h3>
          {data.sourceBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={data.sourceBreakdown}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    strokeWidth={0}
                  >
                    {data.sourceBreakdown.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {data.sourceBreakdown.map((s, i) => (
                  <div
                    key={s.source}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-centinela-text-secondary">
                        {s.source}
                      </span>
                    </div>
                    <span className="font-mono text-centinela-text-muted">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-centinela-text-muted">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Signups + Revenue Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Signups Table */}
        <div className="col-span-2 rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Recent Signups
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-centinela-border">
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Email
                  </th>
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Source
                  </th>
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Status
                  </th>
                  <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentSignups.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2 text-centinela-text-secondary">
                      {sub.email}
                    </td>
                    <td className="py-2 text-centinela-text-muted">
                      {sub.source || "—"}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          sub.status === "active"
                            ? "bg-centinela-accent/15 text-centinela-accent"
                            : sub.status === "bounced"
                              ? "bg-centinela-danger/15 text-centinela-danger"
                              : "bg-centinela-warning/15 text-centinela-warning"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Placeholder */}
        <div className="rounded-xl border border-dashed border-centinela-border bg-centinela-bg-card/50 p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Revenue
          </h3>
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <div className="mb-2 text-2xl text-centinela-text-muted">$</div>
            <div className="text-sm font-medium text-centinela-text-muted">
              Coming Soon
            </div>
            <div className="mt-1 text-xs text-centinela-text-muted">
              Stripe integration planned
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
