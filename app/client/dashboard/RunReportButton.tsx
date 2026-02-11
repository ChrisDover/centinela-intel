"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RunReportButtonProps {
  countryCode: string;
  countryName: string;
}

export default function RunReportButton({
  countryCode,
  countryName,
}: RunReportButtonProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGenerate() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/client/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, countryName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Generation failed");
        return;
      }

      // Refresh the page to show the new brief
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          padding: "8px 16px",
          background: generating ? "var(--bg-card)" : "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 12,
          color: generating ? "var(--text-muted)" : "var(--accent)",
          cursor: generating ? "not-allowed" : "pointer",
          letterSpacing: 0.5,
          transition: "all 0.2s ease",
          opacity: generating ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!generating) {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.background = "rgba(0, 212, 170, 0.08)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = generating
            ? "var(--bg-card)"
            : "transparent";
        }}
      >
        {generating ? "Generating..." : "Run Report"}
      </button>
      {error && (
        <span style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}
