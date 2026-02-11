"use client";

import type { RegionAssessment } from "@/lib/ai/generate-country-brief";

const THREAT_COLORS: Record<string, string> = {
  CRITICAL: "#ff4757",
  HIGH: "#ff6348",
  ELEVATED: "#ffb347",
  MODERATE: "#00d4aa",
};

interface RegionBreakdownProps {
  regions: RegionAssessment[];
}

export default function RegionBreakdown({ regions }: RegionBreakdownProps) {
  if (regions.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {regions.map((region, i) => {
        const color = THREAT_COLORS[region.threatLevel] || "var(--text-muted)";
        return (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {region.name}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color,
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                {region.threatLevel}
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {region.summary}
            </div>
          </div>
        );
      })}
    </div>
  );
}
