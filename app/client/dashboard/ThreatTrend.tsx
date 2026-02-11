"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const THREAT_LEVEL_VALUE: Record<string, number> = {
  MODERATE: 1,
  ELEVATED: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const THREAT_LEVEL_LABEL: Record<number, string> = {
  1: "MOD",
  2: "ELEV",
  3: "HIGH",
  4: "CRIT",
};

const THREAT_LEVEL_COLOR: Record<string, string> = {
  MODERATE: "#00d4aa",
  ELEVATED: "#ffb347",
  HIGH: "#ff6348",
  CRITICAL: "#ff4757",
};

interface ThreatTrendProps {
  briefs: { date: string; threatLevel: string }[];
}

export default function ThreatTrend({ briefs }: ThreatTrendProps) {
  const data = briefs
    .slice()
    .reverse()
    .map((b) => ({
      date: b.date.replace(/,?\s*\d{4}$/, "").replace(/^\w+\s/, ""),
      level: THREAT_LEVEL_VALUE[b.threatLevel] || 1,
      label: b.threatLevel,
    }));

  const latestLevel = briefs[0]?.threatLevel || "MODERATE";
  const lineColor = THREAT_LEVEL_COLOR[latestLevel] || "#00d4aa";

  if (data.length < 2) {
    return (
      <div
        style={{
          padding: 24,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        Trend data will appear after 2+ daily briefs are generated.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "16px 16px 8px 8px",
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: 0.5,
          marginBottom: 12,
          paddingLeft: 8,
        }}
      >
        THREAT LEVEL TREND
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#5a6680", fontSize: 11 }}
            axisLine={{ stroke: "#1e2a3f" }}
            tickLine={false}
          />
          <YAxis
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(v: number) => THREAT_LEVEL_LABEL[v] || ""}
            tick={{ fill: "#5a6680", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#141a28",
              border: "1px solid #1e2a3f",
              borderRadius: 6,
              fontSize: 12,
              color: "#e8ecf4",
            }}
            formatter={(value) => [
              Object.keys(THREAT_LEVEL_VALUE).find(
                (k) => THREAT_LEVEL_VALUE[k] === value
              ) || "MODERATE",
              "Threat Level",
            ]}
          />
          <ReferenceLine
            y={3}
            stroke="#ff634844"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="level"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
