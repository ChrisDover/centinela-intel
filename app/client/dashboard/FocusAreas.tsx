"use client";

import { useState } from "react";

export default function FocusAreas({ initial }: { initial: string[] }) {
  const [areas, setAreas] = useState<string[]>(initial);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(updated: string[]) {
    setSaving(true);
    setSaved(false);
    await fetch("/api/client/focus-areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ focusAreas: updated }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function add() {
    const value = input.trim();
    if (!value || areas.includes(value) || areas.length >= 10) return;
    const updated = [...areas, value];
    setAreas(updated);
    setInput("");
    save(updated);
  }

  function remove(area: string) {
    const updated = areas.filter((a) => a !== area);
    setAreas(updated);
    save(updated);
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        FOCUS AREAS
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        Add states, cities, or regions for deeper coverage in your daily briefs.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Guadalajara, Sinaloa, Tamaulipas..."
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={add}
          disabled={!input.trim() || saving}
          className="btn-primary"
          style={{
            padding: "8px 14px",
            fontSize: 12,
            opacity: !input.trim() ? 0.4 : 1,
          }}
        >
          Add
        </button>
      </div>

      {areas.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {areas.map((area) => (
            <span
              key={area}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "var(--accent-dim)",
                border: "1px solid var(--accent)",
                borderRadius: 4,
                fontSize: 12,
                color: "var(--accent)",
                fontFamily: "monospace",
              }}
            >
              {area}
              <button
                onClick={() => remove(area)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {saved && (
        <p
          style={{
            fontSize: 11,
            color: "var(--accent)",
            marginTop: 8,
            fontFamily: "monospace",
          }}
        >
          Saved — will be included in your next daily brief.
        </p>
      )}
    </div>
  );
}
