"use client";

import dynamic from "next/dynamic";
import type { Incident } from "@/lib/ai/generate-country-brief";

const ThreatMap = dynamic(() => import("./ThreatMap"), { ssr: false });

export default function ThreatMapWrapper({
  incidents,
  countryCode,
}: {
  incidents: Incident[];
  countryCode: string;
}) {
  return <ThreatMap incidents={incidents} countryCode={countryCode} />;
}
