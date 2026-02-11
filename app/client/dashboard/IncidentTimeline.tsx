"use client";

import type { Incident } from "@/lib/ai/generate-country-brief";

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#ff4757",
  HIGH: "#ff6348",
  MEDIUM: "#ffb347",
  LOW: "#00d4aa",
};

const CATEGORY_LABELS: Record<string, string> = {
  cartel: "CARTEL",
  political: "POLITICAL",
  crime: "CRIME",
  infrastructure: "INFRA",
  protest: "PROTEST",
  kidnapping: "K&R",
  extortion: "EXTORTION",
};

interface IncidentTimelineProps {
  incidents: Incident[];
}

export default function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  if (incidents.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          color: "var(--text-muted)",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        No incidents reported.
      </div>
    );
  }

  // Sort by severity
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sorted = [...incidents].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {sorted.map((incident, i) => {
        const color = SEVERITY_COLORS[incident.severity] || "#ffb347";
        return (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              borderLeft: `3px solid ${color}`,
              background:
                i % 2 === 0
                  ? "rgba(20, 26, 40, 0.5)"
                  : "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {incident.severity}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: 0.5,
                }}
              >
                {CATEGORY_LABELS[incident.category] || incident.category.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginLeft: "auto",
                }}
              >
                {incident.city}
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 2,
              }}
            >
              {incident.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {incident.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
