"use client";

import { useState } from "react";

export default function ExportButton({
  briefId,
  countryName,
  date,
}: {
  briefId: string;
  countryName: string;
  date: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      // Fetch the export page HTML
      const res = await fetch(`/client/briefs/export?id=${briefId}`);
      const html = await res.text();

      // Create a hidden container with the export HTML
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "700px";
      container.style.background = "#fff";
      container.style.color = "#1a1a1a";
      container.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      container.style.lineHeight = "1.6";
      container.style.padding = "40px 20px";

      // Parse the HTML and extract just the body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const body = doc.body;

      // Remove the print button from the cloned content
      body.querySelectorAll(".no-print").forEach((el) => el.remove());

      container.innerHTML = body.innerHTML;
      document.body.appendChild(container);

      // Generate PDF
      const html2pdf = (await import("html2pdf.js")).default;
      const filename = `${countryName.replace(/\s+/g, "-")}-brief-${date}.pdf`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (html2pdf as any)()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(container)
        .save();

      // Clean up
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF export failed:", err);
      // Fallback: open export page in new tab
      window.open(`/client/briefs/export?id=${briefId}`, "_blank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{
        padding: "6px 14px",
        fontSize: 12,
        fontFamily: "monospace",
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: 4,
        color: "var(--text-secondary)",
        cursor: loading ? "wait" : "pointer",
        letterSpacing: 0.5,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "GENERATING..." : "EXPORT PDF"}
    </button>
  );
}
