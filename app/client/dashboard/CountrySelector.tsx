"use client";

import { useRouter } from "next/navigation";

export default function CountrySelector({
  countries,
  activeCountry,
}: {
  countries: { code: string; name: string }[];
  activeCountry: string;
}) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {countries.map((c) => (
        <button
          key={c.code}
          onClick={() => router.push(`/client/dashboard?country=${c.code}`)}
          style={{
            padding: "6px 14px",
            fontSize: 13,
            fontFamily: "monospace",
            letterSpacing: 0.3,
            background:
              c.code === activeCountry ? "var(--accent)" : "var(--bg-card)",
            color: c.code === activeCountry ? "#0a0e17" : "var(--text-secondary)",
            border:
              c.code === activeCountry
                ? "1px solid var(--accent)"
                : "1px solid var(--border)",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: c.code === activeCountry ? 600 : 400,
            transition: "all 0.15s",
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
