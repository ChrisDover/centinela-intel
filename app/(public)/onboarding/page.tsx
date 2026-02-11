"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const LATAM_COUNTRIES = [
  { code: "MX", name: "Mexico" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "SV", name: "El Salvador" },
  { code: "NI", name: "Nicaragua" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "CO", name: "Colombia" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "PE", name: "Peru" },
  { code: "BO", name: "Bolivia" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "UY", name: "Uruguay" },
  { code: "PY", name: "Paraguay" },
  { code: "CU", name: "Cuba" },
  { code: "DO", name: "Dominican Republic" },
  { code: "HT", name: "Haiti" },
  { code: "PR", name: "Puerto Rico" },
  { code: "TT", name: "Trinidad & Tobago" },
];

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <section
          style={{
            maxWidth: 560,
            margin: "80px auto",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </section>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [selected, setSelected] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [status, setStatus] = useState<
    "selecting" | "submitting" | "done" | "error"
  >("selecting");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session. Please complete checkout first.");
      setStatus("error");
    }
  }, [sessionId]);

  async function handleSubmit() {
    if (!selected || !sessionId) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          country: selected.code,
          countryName: selected.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section
        style={{
          maxWidth: 560,
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "#999",
            letterSpacing: 0.5,
            marginBottom: 16,
          }}
        >
          CENTINELA INTEL — COUNTRY MONITOR
        </p>
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: "2rem",
            marginBottom: 16,
          }}
        >
          Check Your Email
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
          }}
        >
          We&apos;ve sent a login link to your email. Click it to access your{" "}
          {selected?.name} intelligence dashboard. The link expires in 30
          minutes.
        </p>
      </section>
    );
  }

  if (status === "error" && !sessionId) {
    return (
      <section
        style={{
          maxWidth: 560,
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: "2rem",
            marginBottom: 16,
          }}
        >
          Something Went Wrong
        </h1>
        <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>
        <a href="/" className="btn-primary">
          Return Home
        </a>
      </section>
    );
  }

  return (
    <section
      style={{ maxWidth: 640, margin: "60px auto", padding: "0 20px" }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "#999",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        CENTINELA INTEL — COUNTRY MONITOR
      </p>
      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "2rem",
          marginBottom: 8,
        }}
      >
        Select Your Country
      </h1>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          marginBottom: 32,
        }}
      >
        Choose the country you want to monitor. You&apos;ll receive a daily
        intelligence brief and threat alerts specific to this country.
      </p>

      {error && (
        <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
          marginBottom: 32,
        }}
      >
        {LATAM_COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelected(c)}
            style={{
              padding: "12px 16px",
              background:
                selected?.code === c.code
                  ? "var(--accent)"
                  : "var(--card-bg)",
              color: selected?.code === c.code ? "#0a0e17" : "var(--text)",
              border:
                selected?.code === c.code
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: selected?.code === c.code ? 600 : 400,
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || status === "submitting"}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "14px 24px",
          fontSize: 15,
          opacity: !selected || status === "submitting" ? 0.5 : 1,
          cursor:
            !selected || status === "submitting"
              ? "not-allowed"
              : "pointer",
        }}
      >
        {status === "submitting"
          ? "Setting up..."
          : selected
            ? `Start Monitoring ${selected.name}`
            : "Select a country to continue"}
      </button>
    </section>
  );
}
