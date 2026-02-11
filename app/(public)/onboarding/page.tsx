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

const TIER_LIMITS: Record<string, number> = {
  "1-country": 1,
  "2-country": 2,
  "3-country": 3,
  "all-countries": 999,
};

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

  const [selected, setSelected] = useState<{ code: string; name: string }[]>(
    []
  );
  const [tier, setTier] = useState<string>("1-country");
  const [status, setStatus] = useState<
    "loading" | "selecting" | "submitting" | "done" | "error"
  >("loading");
  const [error, setError] = useState("");

  const maxCountries = TIER_LIMITS[tier] || 1;
  const isAllCountries = tier === "all-countries";

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session. Please complete checkout first.");
      setStatus("error");
      return;
    }

    // Fetch the tier from the session
    fetch(`/api/onboarding?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tier) setTier(data.tier);
        if (data.tier === "all-countries") {
          setSelected(LATAM_COUNTRIES);
        }
        setStatus("selecting");
      })
      .catch(() => {
        setStatus("selecting");
      });
  }, [sessionId]);

  function toggleCountry(c: { code: string; name: string }) {
    if (isAllCountries) return;
    setSelected((prev) => {
      const exists = prev.find((s) => s.code === c.code);
      if (exists) return prev.filter((s) => s.code !== c.code);
      if (prev.length >= maxCountries) return prev;
      return [...prev, c];
    });
  }

  async function handleSubmit() {
    if (selected.length === 0 || !sessionId) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          countries: selected,
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

  if (status === "loading") {
    return (
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
    );
  }

  if (status === "done") {
    const countryNames =
      selected.length > 3
        ? `${selected.length} countries`
        : selected.map((s) => s.name).join(", ");
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
          We&apos;ve sent a login link to your email. Click it to access your
          intelligence dashboard monitoring {countryNames}. The link expires in
          30 minutes.
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
        {isAllCountries
          ? "All Countries Selected"
          : maxCountries === 1
            ? "Select Your Country"
            : `Select ${maxCountries} Countries`}
      </h1>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          marginBottom: 32,
        }}
      >
        {isAllCountries
          ? "Your plan includes all 22 countries. You\u2019ll receive daily intelligence briefs for every country in Latin America and the Caribbean."
          : maxCountries === 1
            ? "Choose the country you want to monitor. You\u2019ll receive a daily intelligence brief and threat alerts specific to this country."
            : `Choose up to ${maxCountries} countries. You\u2019ll receive daily intelligence briefs and threat alerts for each. (${selected.length}/${maxCountries} selected)`}
      </p>

      {error && (
        <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>
      )}

      {!isAllCountries && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 8,
            marginBottom: 32,
          }}
        >
          {LATAM_COUNTRIES.map((c) => {
            const isSelected = selected.some((s) => s.code === c.code);
            const isDisabled =
              !isSelected && selected.length >= maxCountries;
            return (
              <button
                key={c.code}
                onClick={() => toggleCountry(c)}
                disabled={isDisabled}
                style={{
                  padding: "12px 16px",
                  background: isSelected
                    ? "var(--accent)"
                    : "var(--card-bg)",
                  color: isSelected ? "#0a0e17" : "var(--text)",
                  border: isSelected
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                  borderRadius: 6,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: "left",
                  transition: "all 0.15s",
                  opacity: isDisabled ? 0.4 : 1,
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={selected.length === 0 || status === "submitting"}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "14px 24px",
          fontSize: 15,
          opacity:
            selected.length === 0 || status === "submitting" ? 0.5 : 1,
          cursor:
            selected.length === 0 || status === "submitting"
              ? "not-allowed"
              : "pointer",
        }}
      >
        {status === "submitting"
          ? "Setting up..."
          : selected.length === 0
            ? "Select a country to continue"
            : isAllCountries
              ? "Start Monitoring All Countries"
              : selected.length === 1
                ? `Start Monitoring ${selected[0].name}`
                : `Start Monitoring ${selected.length} Countries`}
      </button>
    </section>
  );
}
