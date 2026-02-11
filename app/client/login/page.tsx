"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");
    await fetch("/api/client/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus("sent");
  }

  return (
    <section
      style={{
        maxWidth: 440,
        margin: "120px auto",
        padding: "0 20px",
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
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
        Client Login
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        Enter your email to receive a secure login link.
      </p>

      {urlError === "invalid_or_expired" && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: 14,
            marginBottom: 16,
            padding: "8px 12px",
            background: "rgba(255, 71, 87, 0.1)",
            borderRadius: 6,
          }}
        >
          That link has expired or is invalid. Request a new one below.
        </p>
      )}

      {status === "sent" ? (
        <div
          style={{
            padding: 24,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Check Your Email
          </p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            If an account exists for that email, we&apos;ve sent a login link.
            It expires in 30 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontSize: 15,
              marginBottom: 12,
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: 15,
              opacity: status === "sending" ? 0.6 : 1,
            }}
          >
            {status === "sending" ? "Sending..." : "Send Login Link"}
          </button>
        </form>
      )}

      <p
        style={{
          marginTop: 32,
          fontSize: 13,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        Not a client yet?{" "}
        <a href="/#pricing" style={{ color: "var(--accent)" }}>
          View plans
        </a>
      </p>
    </section>
  );
}
