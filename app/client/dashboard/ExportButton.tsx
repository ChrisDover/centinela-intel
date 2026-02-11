"use client";

export default function ExportButton({ briefId }: { briefId: string }) {
  function handleExport() {
    window.open(`/client/briefs/export?id=${briefId}`, "_blank");
  }

  return (
    <button
      onClick={handleExport}
      style={{
        padding: "6px 14px",
        fontSize: 12,
        fontFamily: "monospace",
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: 4,
        color: "var(--text-secondary)",
        cursor: "pointer",
        letterSpacing: 0.5,
      }}
    >
      EXPORT PDF
    </button>
  );
}
