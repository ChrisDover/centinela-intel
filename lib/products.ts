// ============================================================
// Centinela Intel — Product Data (Single Source of Truth)
// ============================================================

export type TierSlug =
  | "free-brief"
  | "monitor-1-country"
  | "monitor-corridor"
  | "watch-pro-starter"
  | "secure-ai"
  | "sentinel";

export type ProductFamily = "free" | "monitor" | "watch-pro" | "secure-ai" | "sentinel";

export interface ProductTier {
  slug: TierSlug;
  family: ProductFamily;
  name: string;
  tagline: string;
  price: number | null; // null = contact us
  priceLabel: string;
  interval: "mo" | "yr" | null;
  countries: number | "unlimited";
  featured: boolean;
  selfServe: boolean; // true = Stripe checkout, false = Contact Us
  features: string[];
  cta: string;
  ctaLink: string;
}

// --------------- Product Tiers ---------------

export const TIERS: ProductTier[] = [
  {
    slug: "free-brief",
    family: "free",
    name: "The Centinela Brief",
    tagline: "Weekly LatAm security intelligence — free",
    price: 0,
    priceLabel: "Free",
    interval: null,
    countries: "unlimited",
    featured: false,
    selfServe: true,
    features: [
      "Weekly LatAm security brief",
      "Regional threat overview",
      "Analyst assessment",
      "Email delivery",
    ],
    cta: "Subscribe Free",
    ctaLink: "/subscribe",
  },
  {
    slug: "monitor-1-country",
    family: "monitor",
    name: "Monitor — 1 Country",
    tagline: "Daily intelligence for a single country focus",
    price: 29,
    priceLabel: "$29",
    interval: "mo",
    countries: 1,
    featured: false,
    selfServe: true,
    features: [
      "Daily intelligence briefs — 1 country",
      "22 countries available",
      "Incident alerts (email)",
      "Monthly threat landscape",
      "Email analyst support",
    ],
    cta: "Start Monitoring",
    ctaLink: "/api/checkout",
  },
  {
    slug: "monitor-corridor",
    family: "monitor",
    name: "Monitor — 5 Countries",
    tagline: "Multi-country coverage across your LatAm operations",
    price: 79,
    priceLabel: "$79",
    interval: "mo",
    countries: 5,
    featured: true,
    selfServe: true,
    features: [
      "Daily briefs — 5 countries",
      "+$10/mo per additional country",
      "Incident alerts (email + push)",
      "Monthly threat landscape",
      "Quarterly strategic review",
      "Priority analyst support",
    ],
    cta: "Start Monitoring",
    ctaLink: "/api/checkout",
  },
  {
    slug: "watch-pro-starter",
    family: "watch-pro",
    name: "Watch Pro",
    tagline: "Live intelligence terminal for your operations",
    price: 199,
    priceLabel: "$199",
    interval: "mo",
    countries: 1,
    featured: false,
    selfServe: true,
    features: [
      "Everything in Monitor",
      "Live intelligence dashboard",
      "Real-time threat map",
      "Incident feed + flash alerts",
      "API access",
      "+$100/country (cap $499 for all 22)",
      "+$25/additional seat",
    ],
    cta: "Get Watch Pro",
    ctaLink: "/api/checkout",
  },
  {
    slug: "secure-ai",
    family: "secure-ai",
    name: "Secure AI",
    tagline: "Your intelligence. Your infrastructure. Zero exposure.",
    price: null,
    priceLabel: "Contact Us",
    interval: null,
    countries: "unlimited",
    featured: false,
    selfServe: false,
    features: [
      "Private LLM deployment on owned GPU cluster",
      "Air-gapped processing option",
      "SOC2-aligned infrastructure",
      "No third-party API exposure",
      "Full data sovereignty",
      "Custom model fine-tuning",
    ],
    cta: "Talk to Us",
    ctaLink: "/contact",
  },
  {
    slug: "sentinel",
    family: "sentinel",
    name: "Sentinel",
    tagline: "24/7 autonomous monitoring with human oversight",
    price: null,
    priceLabel: "Contact Us",
    interval: null,
    countries: "unlimited",
    featured: false,
    selfServe: false,
    features: [
      "Everything in Secure AI",
      "24/7 autonomous threat monitoring",
      "Human-in-the-loop escalation",
      "Dedicated intelligence cell",
      "Custom OSINT source integration",
      "Executive protection intel support",
      "Incident response coordination",
    ],
    cta: "Talk to Us",
    ctaLink: "/contact",
  },
];

// --------------- Helpers ---------------

export function getTier(slug: TierSlug): ProductTier {
  return TIERS.find((t) => t.slug === slug)!;
}

export function getTiersByFamily(family: ProductFamily): ProductTier[] {
  return TIERS.filter((t) => t.family === family);
}

export function getMonitorTiers(): ProductTier[] {
  return getTiersByFamily("monitor");
}

// --------------- Competitive Positioning ---------------

export interface Competitor {
  name: string;
  description: string;
  priceRange: string;
  weaknesses: string[];
}

export const COMPETITORS: Competitor[] = [
  {
    name: "Dataminr",
    description: "Real-time AI alerts from public data",
    priceRange: "$10,000+/mo",
    weaknesses: [
      "No LatAm depth — English-first OSINT",
      "Alert fatigue — volume over context",
      "No analyst layer — raw signals only",
      "No private AI option",
    ],
  },
  {
    name: "Crisis24",
    description: "Global risk consulting + monitoring",
    priceRange: "$5,000+/mo",
    weaknesses: [
      "Legacy consulting model — slow turnaround",
      "Generalist coverage — no LatAm specialization",
      "High cost, opaque pricing",
      "No self-serve tier",
    ],
  },
  {
    name: "Seerist",
    description: "AI-powered threat intelligence platform",
    priceRange: "$3,000+/mo",
    weaknesses: [
      "Platform complexity — steep learning curve",
      "Dependent on third-party AI APIs",
      "No Spanish-language OSINT depth",
      "Enterprise-only — no accessible entry point",
    ],
  },
];

// --------------- Five Moats ---------------

export interface Moat {
  number: number;
  title: string;
  description: string;
}

export const MOATS: Moat[] = [
  {
    number: 1,
    title: "Operator-Built Intelligence",
    description:
      "25+ years of global security operations across 3 continents. Our briefs are written by operators who've managed 2,000+ security personnel — not by analysts who've never left a desk.",
  },
  {
    number: 2,
    title: "Spanish-Language OSINT Depth",
    description:
      "We monitor Mexican narco-blogs, Ecuadorian judicial feeds, Colombian military communiqués, and hundreds of regional sources that English-first platforms miss entirely.",
  },
  {
    number: 3,
    title: "AI-Accelerated, Human-Verified",
    description:
      "Machine speed for monitoring and correlation, operator judgment for the 'so what.' Every brief passes through human review before delivery.",
  },
  {
    number: 4,
    title: "Private AI Infrastructure",
    description:
      "Local LLMs on our own GPU cluster. Your queries, your data, your models — never touching third-party APIs. Full data sovereignty for regulated industries.",
  },
  {
    number: 5,
    title: "Accessible Price Point",
    description:
      "Enterprise-grade intelligence starting at $29/mo. We sit between expensive consulting firms ($10K+/mo) and unreliable free sources — the sweet spot most organizations need.",
  },
];

// --------------- Proof Points ---------------

export const PROOF_POINTS = {
  gpus: "Owned",
  gpuType: "GPU Cluster",
  margins: "85%+",
  experience: "25+",
  continents: 3,
  osmTam: "$49–134B",
  aiTam: "$49.8B",
  countries: 22,
  personnelManaged: "2,000+",
} as const;
