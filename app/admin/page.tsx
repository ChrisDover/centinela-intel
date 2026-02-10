"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e17",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#141a28",
          border: "1px solid #1e2a3f",
          borderRadius: "16px",
          padding: "2.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "2px solid #00d4aa",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                background: "#00d4aa",
                borderRadius: "50%",
                boxShadow: "0 0 12px rgba(0, 212, 170, 0.3)",
              }}
            />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "#e8ecf4",
              marginBottom: "0.5rem",
            }}
          >
            Centinela Admin
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#5a6680",
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}
          >
            Authorized access only
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#8a96ad",
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                background: "#0f1420",
                border: "1px solid #2a3a55",
                borderRadius: "8px",
                color: "#e8ecf4",
                fontSize: "0.95rem",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#ff4757",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: loading ? "#1e2a3f" : "#00d4aa",
              color: loading ? "#5a6680" : "#0a0e17",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "#5a6680",
          }}
        >
          <a href="/" style={{ color: "#00d4aa", textDecoration: "none" }}>
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
