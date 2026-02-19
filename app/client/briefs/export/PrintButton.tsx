"use client";

import { useCallback } from "react";

export default function PrintButton({
  countryName,
  date,
}: {
  countryName: string;
  date: string;
}) {
  const handleDownload = useCallback(async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.body;
    const filename = `${countryName.replace(/\s+/g, "-")}-brief-${date}.pdf`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (html2pdf as any)()
      .set({
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(element)
      .save();
  }, [countryName, date]);

  return (
    <button className="no-print print-btn" onClick={handleDownload}>
      Download PDF
    </button>
  );
}
