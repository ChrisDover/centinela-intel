"use client";

import { useState } from "react";

export function CheckoutButton({
  className,
  tier = "1-country",
  label = "Get Started",
}: {
  className?: string;
  tier?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ cursor: loading ? "wait" : "pointer" }}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
