"use client";

import { useEffect, useRef } from "react";
import type { Incident } from "@/lib/ai/generate-country-brief";

// Country center coordinates and zoom levels
const COUNTRY_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  MX: { lat: 23.6345, lng: -102.5528, zoom: 5 },
  GT: { lat: 15.7835, lng: -90.2308, zoom: 7 },
  HN: { lat: 15.1999, lng: -86.2419, zoom: 7 },
  SV: { lat: 13.7942, lng: -88.8965, zoom: 8 },
  NI: { lat: 12.8654, lng: -85.2072, zoom: 7 },
  CR: { lat: 9.7489, lng: -83.7534, zoom: 7 },
  PA: { lat: 8.538, lng: -80.7821, zoom: 7 },
  CO: { lat: 4.5709, lng: -74.2973, zoom: 5 },
  VE: { lat: 6.4238, lng: -66.5897, zoom: 6 },
  EC: { lat: -1.8312, lng: -78.1834, zoom: 6 },
  PE: { lat: -9.19, lng: -75.0152, zoom: 5 },
  BO: { lat: -16.2902, lng: -63.5887, zoom: 6 },
  BR: { lat: -14.235, lng: -51.9253, zoom: 4 },
  AR: { lat: -38.4161, lng: -63.6167, zoom: 4 },
  CL: { lat: -35.6751, lng: -71.543, zoom: 4 },
  UY: { lat: -32.5228, lng: -55.7658, zoom: 7 },
  PY: { lat: -23.4425, lng: -58.4438, zoom: 6 },
  CU: { lat: 21.5218, lng: -77.7812, zoom: 7 },
  DO: { lat: 18.7357, lng: -70.1627, zoom: 8 },
  HT: { lat: 18.9712, lng: -72.2852, zoom: 8 },
  PR: { lat: 18.2208, lng: -66.5901, zoom: 9 },
  TT: { lat: 10.6918, lng: -61.2225, zoom: 9 },
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#ff4757",
  HIGH: "#ff6348",
  MEDIUM: "#ffb347",
  LOW: "#00d4aa",
};

interface ThreatMapProps {
  incidents: Incident[];
  countryCode: string;
}

export default function ThreatMap({ incidents, countryCode }: ThreatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    // Clean up any existing map on this container
    if (mapInstanceRef.current) {
      (mapInstanceRef.current as { remove: () => void }).remove();
      mapInstanceRef.current = null;
    }

    const coords = COUNTRY_COORDS[countryCode] || { lat: 23.6345, lng: -102.5528, zoom: 5 };

    // Dynamic import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([coords.lat, coords.lng], coords.zoom);

      // Dark tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add incidents as circle markers
      incidents.forEach((incident) => {
        const color = SEVERITY_COLORS[incident.severity] || "#ffb347";
        const radius = incident.severity === "CRITICAL" ? 10 : incident.severity === "HIGH" ? 8 : 6;

        L.circleMarker([incident.lat, incident.lng], {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.6,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: system-ui; font-size: 13px; min-width: 180px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${incident.title}</div>
              <div style="font-size: 11px; color: ${color}; font-family: monospace; margin-bottom: 4px;">${incident.severity} — ${incident.category.toUpperCase()}</div>
              <div style="font-size: 12px; color: #666;">${incident.city}</div>
              <div style="font-size: 12px; margin-top: 4px;">${incident.description}</div>
            </div>`
          );

        // Add pulsing effect for CRITICAL incidents
        if (incident.severity === "CRITICAL") {
          L.circleMarker([incident.lat, incident.lng], {
            radius: radius + 6,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.15,
          }).addTo(map);
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [incidents, countryCode]);

  return (
    <div style={{ position: "relative" }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 400,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      />
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "8px 12px",
          zIndex: 1000,
          display: "flex",
          gap: 12,
          fontSize: 11,
          fontFamily: "monospace",
        }}
      >
        {Object.entries(SEVERITY_COLORS).map(([level, color]) => (
          <div key={level} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
              }}
            />
            <span style={{ color: "var(--text-secondary)" }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
