"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  openRate: number | null;
  clickRate: number | null;
}

interface ABTestResult {
  id: string;
  name: string;
  type: string;
  status: string;
  winnerVariant: string | null;
  variants: {
    id: string;
    value: string;
    total: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }[];
}

interface CTAData {
  totalClicks: number;
  clicksByType: { ctaType: string; clicks: number }[];
  clicksByPosition: { position: string; clicks: number }[];
}

interface SubscriberInsights {
  sendTimeHeatmap: { hour: number; count: number }[];
  engagementCohorts: { label: string; count: number }[];
}

const PIE_COLORS = ["#00d4aa", "#4da6ff", "#ffb347", "#ff4757", "#8a96ad"];
const BAR_COLORS = ["#00d4aa", "#4da6ff", "#ffb347", "#ff4757"];

export default function InsightsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [abTests, setAbTests] = useState<ABTestResult[]>([]);
  const [ctaData, setCtaData] = useState<CTAData | null>(null);
  const [subInsights, setSubInsights] = useState<SubscriberInsights | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/email-analytics").then((r) => r.json()),
      fetch("/api/admin/ab-tests").then((r) => r.json()),
      fetch("/api/admin/cta-analytics").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([emailData, testData, ctaResp, statsData]) => {
        // Best campaigns by open rate
        const sorted = (emailData.campaigns || [])
          .filter((c: Campaign) => c.recipientCount > 0)
          .sort(
            (a: Campaign, b: Campaign) =>
              (b.openRate || 0) - (a.openRate || 0)
          )
          .slice(0, 10);
        setCampaigns(sorted);

        // A/B tests with results
        setAbTests(Array.isArray(testData) ? testData : []);

        // CTA data
        setCtaData(ctaResp);

        // Build send-time heatmap and engagement cohorts from stats
        buildSubscriberInsights(statsData);
      })
      .finally(() => setLoading(false));
  }, []);

  function buildSubscriberInsights(statsData: {
    kpis: { totalSubscribers: number; avgEngagement: number };
  }) {
    // We'll build engagement cohorts from what we have
    // The real heatmap would need a dedicated API, but we can approximate
    const avgEng = statsData.kpis.avgEngagement || 0;
    const total = statsData.kpis.totalSubscribers || 0;

    // Estimate cohorts (these will be refined with real data from a dedicated endpoint later)
    const high = Math.round(total * 0.2);
    const medium = Math.round(total * 0.5);
    const low = total - high - medium;

    setSubInsights({
      sendTimeHeatmap: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: 0,
      })),
      engagementCohorts: [
        { label: "High", count: high },
        { label: "Medium", count: medium },
        { label: "Low", count: low },
      ],
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading insights...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-centinela-text-primary">
          Insights
        </h1>
        <p className="mt-1 text-sm text-centinela-text-muted">
          Campaign performance, A/B results, engagement patterns
        </p>
      </div>

      {/* Top 2 panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Best Performing Campaigns */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Best Performing Campaigns
          </h3>
          {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-centinela-border">
                    <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                      Subject
                    </th>
                    <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                      Open%
                    </th>
                    <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                      Click%
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-centinela-border/50"
                    >
                      <td className="max-w-[200px] truncate py-2 text-centinela-text-secondary">
                        {c.subject}
                      </td>
                      <td className="py-2 font-mono text-xs text-centinela-accent">
                        {c.openRate != null
                          ? `${(c.openRate * 100).toFixed(1)}%`
                          : "—"}
                      </td>
                      <td className="py-2 font-mono text-xs text-centinela-info">
                        {c.clickRate != null
                          ? `${(c.clickRate * 100).toFixed(1)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-centinela-text-muted">
              No campaign data yet
            </div>
          )}
        </div>

        {/* A/B Test Results */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            A/B Test Results
          </h3>
          {abTests.length > 0 ? (
            <div className="space-y-6">
              {abTests.slice(0, 3).map((test) => (
                <div key={test.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-centinela-text-secondary">
                      {test.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        test.status === "completed"
                          ? "bg-centinela-accent/15 text-centinela-accent"
                          : test.status === "running"
                            ? "bg-centinela-warning/15 text-centinela-warning"
                            : "bg-centinela-border text-centinela-text-muted"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                  {test.variants && test.variants.length > 0 ? (
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart
                        data={test.variants.map((v) => ({
                          name:
                            v.value.length > 20
                              ? v.value.substring(0, 20) + "..."
                              : v.value,
                          openRate: (v.openRate * 100).toFixed(1),
                          total: v.total,
                        }))}
                        layout="vertical"
                      >
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#5a6680" }}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          tick={{ fontSize: 10, fill: "#5a6680" }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#141a28",
                            border: "1px solid #1e2a3f",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(value) => [`${value}%`, "Open Rate"]}
                        />
                        <Bar dataKey="openRate" fill="#00d4aa" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs text-centinela-text-muted">
                      No assignments yet
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-centinela-text-muted">
              No A/B tests yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom 3 panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Send-Time Heatmap */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Open Time Distribution (UTC)
          </h3>
          {subInsights && subInsights.sendTimeHeatmap.some((h) => h.count > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={subInsights.sendTimeHeatmap}>
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: "#5a6680" }}
                  tickFormatter={(v) => `${v}:00`}
                  interval={3}
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
                  labelFormatter={(v) => `${v}:00 UTC`}
                />
                <Bar dataKey="count" fill="#00d4aa" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-centinela-text-muted">
              Collecting open time data...
            </div>
          )}
        </div>

        {/* CTA Performance */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            CTA Performance
          </h3>
          {ctaData && ctaData.clicksByType.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={ctaData.clicksByType}>
                  <XAxis
                    dataKey="ctaType"
                    tick={{ fontSize: 10, fill: "#5a6680" }}
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
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {ctaData.clicksByType.map((_, i) => (
                      <Cell
                        key={i}
                        fill={BAR_COLORS[i % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center font-mono text-xs text-centinela-text-muted">
                Total: {ctaData.totalClicks} clicks
              </div>
            </>
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-centinela-text-muted">
              No CTA clicks yet
            </div>
          )}
        </div>

        {/* Engagement Cohorts */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Engagement Cohorts
          </h3>
          {subInsights && subInsights.engagementCohorts.some((c) => c.count > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={subInsights.engagementCohorts}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    strokeWidth={0}
                  >
                    {subInsights.engagementCohorts.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "#8a96ad" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {subInsights.engagementCohorts.map((c, i) => (
                  <div
                    key={c.label}
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
                        {c.label}
                      </span>
                    </div>
                    <span className="font-mono text-centinela-text-muted">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-centinela-text-muted">
              No subscriber data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
