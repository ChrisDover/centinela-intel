"use client";

import { useState } from "react";

const SERVICES = [
  {
    id: "travel-assessment",
    title: "Travel Threat Assessment",
    description:
      "Route-specific threat analysis for executive travel. Covers ground transportation, lodging, meeting venues, and contingency recommendations.",
    details:
      "Includes route analysis, hotel vetting, airport-to-venue security assessment, and emergency extraction protocols.",
    fields: ["destination", "dates", "details"],
  },
  {
    id: "executive-protection",
    title: "Executive Protection",
    description:
      "Close protection for principals traveling to or operating in high-risk regions. Bilingual, culturally fluent operators.",
    details:
      "Advance team deployment, secure ground transportation, and 24/7 protective detail.",
    fields: ["destination", "dates", "details"],
  },
  {
    id: "facility-assessment",
    title: "Physical Security Assessment",
    description:
      "Comprehensive evaluation of your facility, office, or project site security posture in-country.",
    details:
      "Covers access control, surveillance, personnel security, perimeter hardening, and threat-informed recommendations.",
    fields: ["location", "details"],
  },
  {
    id: "custom-report",
    title: "Custom Intelligence Report",
    description:
      "Deep-dive analysis on a specific topic: political risk, cartel dynamics, regulatory changes, supply chain threats, or regional forecasts.",
    details:
      "Scoped to your requirements. Includes source documentation and confidence assessments.",
    fields: ["topic", "details"],
  },
  {
    id: "crisis-support",
    title: "Crisis Management Support",
    description:
      "Immediate advisory and coordination when an incident affects your personnel or operations.",
    details:
      "Includes real-time intelligence updates, coordination with local authorities, extraction planning, and crisis communications support.",
    fields: ["details"],
  },
  {
    id: "other",
    title: "Other Services",
    description:
      "Don't see what you need? Tell us about your security challenge and we'll scope a solution.",
    details:
      "Describe your requirements and our team will respond with a tailored proposal.",
    fields: ["details"],
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    await fetch("/api/client/service-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: selectedService,
        ...formData,
      }),
    });

    setStatus("sent");
    setFormData({});
  }

  const activeService = SERVICES.find((s) => s.id === selectedService);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        ADDITIONAL SERVICES
      </p>
      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "1.75rem",
          marginBottom: 8,
        }}
      >
        Request a Service
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        Your Country Monitor subscription includes access to request these
        premium services. Our team will respond within one business day.
      </p>

      {status === "sent" ? (
        <div
          style={{
            padding: 32,
            background: "var(--bg-card)",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            Request Submitted
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            Our team will review your request and respond within one business
            day.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setSelectedService(null);
            }}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 14 }}
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedService ? "1fr 1fr" : "1fr",
            gap: 24,
          }}
        >
          {/* Service cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id);
                  setFormData({});
                }}
                style={{
                  padding: "16px 20px",
                  background:
                    selectedService === service.id
                      ? "var(--bg-card-hover)"
                      : "var(--bg-card)",
                  border:
                    selectedService === service.id
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  color: "var(--text-primary)",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
                  {service.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </div>
              </button>
            ))}
          </div>

          {/* Request form */}
          {activeService && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 24,
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
                REQUEST: {activeService.title.toUpperCase()}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {activeService.details}
              </p>

              <form onSubmit={handleSubmit}>
                {activeService.fields.includes("destination") && (
                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Destination / Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.destination || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, destination: e.target.value })
                      }
                      placeholder="e.g. Guadalajara, Mexico"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeService.fields.includes("location") && (
                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Facility Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Mexico City, Polanco district"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeService.fields.includes("topic") && (
                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Report Topic
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.topic || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      placeholder="e.g. Sinaloa cartel dynamics and supply chain impact"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeService.fields.includes("dates") && (
                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Travel Dates
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dates || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dates: e.target.value })
                      }
                      placeholder="e.g. March 15-18, 2026"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 4,
                    }}
                  >
                    Additional Details
                  </label>
                  <textarea
                    required
                    value={formData.details || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    placeholder="Describe your requirements, number of personnel, specific concerns..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text-primary)",
                      fontSize: 14,
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    fontSize: 14,
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                >
                  {status === "sending"
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
