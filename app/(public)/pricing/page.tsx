import type { Metadata } from "next";
import { CheckoutButton } from "../CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — Centinela AI",
  description:
    "From a free daily intel brief to dedicated intelligence cells. AI-first security intelligence that scales with your operations. Starting at $29/mo.",
};

const ALL_TIERS = [
  {
    family: "Free",
    name: "The Centinela Brief",
    price: "Free",
    priceUnit: "",
    desc: "Daily LatAm security intelligence delivered to your inbox — AI-generated, human-verified.",
    features: [
      "Daily intel brief",
      "Regional overview",
      "Analyst assessment",
      "Email delivery",
    ],
    cta: "Subscribe Free",
    ctaLink: "/subscribe",
    selfServe: true,
    tier: null,
  },
  {
    family: "Monitor",
    name: "1 Country",
    price: "$29",
    priceUnit: "/mo",
    desc: "Daily intelligence for a single country — choose from 22 monitored countries across LatAm.",
    features: [
      "Daily intelligence briefs — 1 country",
      "22 countries available",
      "Incident alerts (email)",
      "Monthly threat landscape",
      "Email analyst support",
    ],
    cta: "Start Monitoring",
    ctaLink: null,
    selfServe: true,
    tier: "monitor-1-country",
  },
  {
    family: "Monitor",
    name: "5 Countries",
    price: "$79",
    priceUnit: "/mo",
    desc: "Multi-country coverage across your LatAm operations. +$10 for each additional country.",
    features: [
      "Daily briefs — 5 countries",
      "+$10/mo per additional country",
      "Incident alerts (email + push)",
      "Monthly threat landscape",
      "Quarterly strategic review",
      "Priority analyst support",
    ],
    cta: "Start Monitoring",
    ctaLink: null,
    selfServe: true,
    tier: "monitor-corridor",
    featured: true,
  },
  {
    family: "Watch Pro",
    name: "Intelligence Terminal",
    price: "$199",
    priceUnit: "/mo",
    desc: "Live threat map + real-time incident feed. Base includes 1 country and 1 seat.",
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
    ctaLink: null,
    selfServe: true,
    tier: "watch-pro-starter",
  },
  {
    family: "Secure AI",
    name: "Private Infrastructure",
    price: "$2.5–5K",
    priceUnit: "/mo",
    desc: "Private LLMs on our own GPU cluster. SOC2 certified.",
    features: [
      "Private LLM deployment",
      "Dedicated GPU cluster",
      "Air-gapped option",
      "SOC2 certified",
      "Full data sovereignty",
      "Custom model fine-tuning",
    ],
    cta: "Talk to Us",
    ctaLink: "/contact",
    selfServe: false,
    tier: null,
  },
  {
    family: "Sentinel",
    name: "24/7 Intelligence Cell",
    price: "$10K+",
    priceUnit: "/mo",
    desc: "24/7 red/blue team monitoring with human oversight.",
    features: [
      "Everything in Secure AI",
      "24/7 autonomous monitoring",
      "Human-in-the-loop escalation",
      "Dedicated intelligence cell",
      "Custom OSINT integration",
      "Incident response coordination",
    ],
    cta: "Talk to Us",
    ctaLink: "/contact",
    selfServe: false,
    tier: null,
  },
];

const FAQ = [
  {
    q: "What countries do you cover?",
    a: "We monitor 22 countries across Latin America and the Caribbean, including Mexico, Colombia, Ecuador, Brazil, Guatemala, Honduras, El Salvador, and more. You select your countries during onboarding.",
  },
  {
    q: "How is intelligence delivered?",
    a: "Monitor: daily briefs via email + incident alerts. Watch Pro: everything in Monitor plus a live dashboard with threat maps, incident feeds, and API access — $199/mo base, add countries and seats as needed. Secure AI and Sentinel are custom-scoped.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. Upgrade, downgrade, or change your monitored countries at any time. Contact us and we'll adjust immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. Monitor and Watch Pro are billed monthly — cancel anytime, no contracts. Secure AI and Sentinel are custom-quoted.",
  },
  {
    q: "What makes Centinela different from Dataminr or Crisis24?",
    a: "LatAm specialization (Spanish-language OSINT depth), owned GPU infrastructure (your data never touches third-party APIs), physical + digital convergence, and an accessible entry point at $29/mo vs. $20,000-$250,000+/year.",
  },
];

export default function PricingPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pricing-page { position: relative; z-index: 1; }
        .pricing-hero {
          padding: 10rem 2rem 5rem;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }
        .pricing-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.6rem, 6vw, 3.8rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .pricing-hero h1 em { font-style: italic; color: var(--accent); }
        .pricing-hero-sub {
          font-size: 1.2rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0 auto;
        }

        .pricing-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .pricing-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
        }
        .pricing-section-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .price-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
          position: relative;
        }
        .price-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
        }
        .price-card {
          overflow: hidden;
        }
        .price-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-orange);
        }
        .price-card-featured {
          border-color: var(--accent);
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.08), rgba(20, 26, 40, 0.6));
        }
        .price-card-featured::before {
          background: var(--accent);
        }
        .price-card-featured::before {
          content: 'START HERE';
          position: absolute;
          top: -0.7rem; left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          background: var(--accent);
          color: var(--bg-primary);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .price-family {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .price-card h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.35rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }
        .price-amount {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.75rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        .price-amount span {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .price-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 1.5rem;
        }
        .price-features {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .price-features li {
          padding: 0.35rem 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .price-features li::before {
          content: '\\2192';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .price-cta {
          width: 100%;
          padding: 0.85rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: block;
          text-decoration: none;
        }
        .price-cta-primary {
          background: var(--accent);
          color: var(--bg-primary);
          border: none;
        }
        .price-cta-primary:hover {
          background: #33e0f5;
          box-shadow: 0 0 24px var(--accent-glow);
        }
        .price-cta-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-accent);
        }
        .price-cta-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .faq-list {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
          max-width: 800px;
        }
        .faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem 1.75rem;
        }
        .faq-q {
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
        }
        .faq-a {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .pricing-final-cta {
          text-align: center;
          padding: 5rem 2rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .pricing-final-cta h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }
        .pricing-final-cta p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .pricing-hero { padding: 8rem 1.5rem 3rem; }
          .pricing-section { padding: 3rem 1.5rem; }
        }
      `,
        }}
      />

      <div className="pricing-page">
        <section className="pricing-hero">
          <div className="section-label">// Pricing</div>
          <h1>
            Intelligence That <em>Scales</em> With You
          </h1>
          <p className="pricing-hero-sub">
            From a free daily brief to a dedicated 24/7 intelligence cell.
            Start where you are, grow when you&apos;re ready.
          </p>
        </section>

        <section className="pricing-section">
          <div className="pricing-grid">
            {ALL_TIERS.map((t) => (
              <div
                key={`${t.family}-${t.name}`}
                className={`price-card${t.featured ? " price-card-featured" : ""}`}
              >
                <div className="price-family">{t.family}</div>
                <h3>{t.name}</h3>
                <div className="price-amount">
                  {t.price}
                  {t.priceUnit && <span>{t.priceUnit}</span>}
                </div>
                <p className="price-desc">{t.desc}</p>
                <ul className="price-features">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {t.selfServe && t.tier ? (
                  <CheckoutButton
                    tier={t.tier}
                    className="price-cta price-cta-primary"
                    label={t.cta}
                  />
                ) : t.ctaLink ? (
                  <a
                    href={t.ctaLink}
                    className={`price-cta ${t.selfServe ? "price-cta-primary" : "price-cta-secondary"}`}
                  >
                    {t.cta}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-section">
          <div className="section-label">// FAQ</div>
          <h2>Common Questions</h2>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-final-cta">
          <h2>Not Sure Which Plan?</h2>
          <p>
            Start with the free brief. When you need daily coverage, Monitor is $29/mo for 1 country.
            Need a live terminal? Watch Pro starts at $199/mo. Need private AI? Talk to us.
          </p>
          <div className="cta-buttons">
            <a href="/subscribe" className="btn-primary" style={{ padding: "0.85rem 2.5rem" }}>
              Get the Free Brief
            </a>
            <a href="/contact" className="btn-outline" style={{ padding: "0.85rem 2.5rem" }}>
              Talk to Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
