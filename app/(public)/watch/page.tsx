import type { Metadata } from "next";
import { CheckoutButton } from "../CheckoutButton";

export const metadata: Metadata = {
  title: "Centinela Watch — Daily Intelligence Briefs | Centinela Intel",
  description:
    "Country-specific intelligence briefs delivered daily. Incident alerts, live dashboard, analyst support. From $497/mo.",
};

const TIERS = [
  {
    name: "1 Country",
    price: "$497",
    tier: "1-country",
    desc: "Threat monitoring for a single country — the intelligence baseline every security team needs.",
    features: [
      "Daily intelligence brief — 1 country",
      "Incident alerts via email",
      "Live intelligence dashboard",
      "Monthly threat landscape summary",
      "Email analyst support",
    ],
  },
  {
    name: "2 Countries",
    price: "$597",
    tier: "2-country",
    featured: true,
    desc: "Expand your coverage. Monitor two countries with unified dashboard and cross-border intelligence.",
    features: [
      "Daily intelligence briefs — 2 countries",
      "Cross-border incident correlation",
      "Unified dashboard with country toggle",
      "Monthly threat landscape summary",
      "Email analyst support",
    ],
  },
  {
    name: "3 Countries",
    price: "$697",
    tier: "3-country",
    desc: "Regional coverage for organizations with operations spanning multiple countries in Latin America.",
    features: [
      "Daily intelligence briefs — 3 countries",
      "Cross-border incident correlation",
      "Unified dashboard with country toggle",
      "Quarterly threat landscape reports",
      "Email analyst support",
    ],
  },
  {
    name: "All Countries",
    price: "$997",
    tier: "all-countries",
    desc: "Full regional coverage — every country in Latin America and the Caribbean. Built for broad operational footprints.",
    features: [
      "Daily intelligence briefs — all 22 countries",
      "Cross-border incident correlation",
      "Unified dashboard with country toggle",
      "Quarterly threat landscape reports",
      "Priority analyst support",
    ],
  },
];

const DELIVERABLES = [
  {
    label: "Daily Intelligence Briefs",
    desc: "Country-specific threat assessments delivered every morning at 0600. AI-accelerated OSINT collection, human-verified analysis.",
  },
  {
    label: "Incident Alerts",
    desc: "Real-time email alerts when security events affect your monitored countries. No noise — only actionable intelligence.",
  },
  {
    label: "Live Intelligence Dashboard",
    desc: "Threat map, incident feed, and risk metrics updated continuously. Toggle between countries, filter by threat type.",
  },
  {
    label: "Monthly Threat Landscape",
    desc: "Analyst-written summary of emerging trends, shifting risk levels, and forward-looking indicators for your region.",
  },
  {
    label: "Analyst Support",
    desc: "Direct access to our intelligence team for questions, ad-hoc requests, and operational guidance.",
  },
];

const FAQ = [
  {
    q: "What countries do you cover?",
    a: "We monitor 22 countries across Latin America and the Caribbean, including Mexico, Colombia, Ecuador, Brazil, Guatemala, Honduras, El Salvador, and more. You select your countries during onboarding.",
  },
  {
    q: "How is intelligence delivered?",
    a: "Daily briefs arrive via email every morning at 0600. Incident alerts are sent in real time. You also get 24/7 access to a live intelligence dashboard with threat maps and incident feeds.",
  },
  {
    q: "Can I change my plan or countries later?",
    a: "Yes. You can upgrade your plan or change your monitored countries at any time. Contact us and we'll adjust your coverage immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. All subscriptions are billed monthly. Cancel anytime — no long-term contracts.",
  },
];

export default function WatchPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .watch-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        /* ---- Hero ---- */
        .watch-hero {
          padding: 10rem 2rem 5rem;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }
        .watch-hero .section-label {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .watch-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        .watch-hero h1 em {
          font-style: italic;
          color: var(--accent);
        }
        .watch-hero-sub {
          font-size: 1.1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        /* ---- Sections shared ---- */
        .watch-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .watch-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
        }
        .watch-section h2 em {
          font-style: italic;
          color: var(--accent);
        }
        .watch-section-desc {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        /* ---- Deliverables ---- */
        .watch-deliverables {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .watch-del-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.75rem;
          transition: border-color 0.2s;
        }
        .watch-del-card:hover {
          border-color: var(--border-accent);
        }
        .watch-del-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .watch-del-title {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .watch-del-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ---- Pricing ---- */
        .watch-pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .watch-price-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem 1.75rem;
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .watch-price-card:hover {
          border-color: var(--border-accent);
          transform: translateY(-4px);
        }
        .watch-price-card-featured {
          border-color: var(--accent);
          background: linear-gradient(180deg, rgba(0, 212, 170, 0.05), var(--bg-card));
        }
        .watch-price-card-featured::before {
          content: 'MOST POPULAR';
          position: absolute;
          top: -0.75rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          background: var(--accent);
          color: var(--bg-primary);
          padding: 0.3rem 1rem;
          border-radius: 100px;
          letter-spacing: 0.08em;
          font-weight: 600;
          white-space: nowrap;
        }
        .watch-price-tier {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .watch-price-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
        }
        .watch-price-amount {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        .watch-price-amount span {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .watch-price-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        .watch-price-features {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
          flex: 1;
        }
        .watch-price-features li {
          padding: 0.4rem 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .watch-price-features li::before {
          content: '\\2192';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .watch-price-cta {
          width: 100%;
          padding: 0.85rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: block;
          background: var(--accent);
          color: var(--bg-primary);
          border: none;
        }
        .watch-price-cta:hover {
          background: #00e8bb;
          box-shadow: 0 0 24px var(--accent-glow);
        }

        /* ---- Credibility ---- */
        .watch-cred {
          text-align: center;
          padding: 5rem 2rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .watch-cred-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .watch-cred-stat-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2rem;
          font-weight: 500;
          color: var(--accent);
        }
        .watch-cred-stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .watch-cred-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }
        .watch-cred-text strong {
          color: var(--text-primary);
        }

        /* ---- FAQ ---- */
        .watch-faq-list {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }
        .watch-faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem 1.75rem;
        }
        .watch-faq-q {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .watch-faq-a {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* ---- Final CTA ---- */
        .watch-final-cta {
          text-align: center;
          padding: 5rem 2rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .watch-final-cta h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }
        .watch-final-cta p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .watch-final-cta a {
          display: inline-block;
          padding: 0.85rem 2.5rem;
          background: var(--accent);
          color: var(--bg-primary);
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .watch-final-cta a:hover {
          background: #00e8bb;
          box-shadow: 0 0 24px var(--accent-glow);
        }

        /* ---- Responsive ---- */
        @media (max-width: 900px) {
          .watch-pricing-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
          }
          .watch-cred-stats {
            gap: 2rem;
          }
        }
        @media (max-width: 600px) {
          .watch-hero {
            padding: 8rem 1.5rem 3rem;
          }
          .watch-section {
            padding: 3rem 1.5rem;
          }
        }
      `,
        }}
      />

      <div className="watch-page">
        {/* ---- Hero ---- */}
        <section className="watch-hero">
          <div className="section-label">// Centinela Watch</div>
          <h1>
            Intelligence That Arrives Before the <em>Threat</em> Does
          </h1>
          <p className="watch-hero-sub">
            Daily country-specific intelligence briefs for Latin America.
            AI-accelerated OSINT collection, human-verified analysis. Delivered
            to your inbox every morning at 0600.
          </p>
        </section>

        {/* ---- What You Get ---- */}
        <section className="watch-section">
          <div className="section-label">// What You Get</div>
          <h2>
            Everything You Need to <em>Monitor</em> Your Region
          </h2>
          <p className="watch-section-desc">
            Centinela Watch is your daily intelligence baseline — real-time
            threat monitoring delivered in formats your team can act on.
          </p>
          <div className="watch-deliverables">
            {DELIVERABLES.map((d, i) => (
              <div key={i} className="watch-del-card">
                <div className="watch-del-label">0{i + 1}</div>
                <div className="watch-del-title">{d.label}</div>
                <div className="watch-del-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Pricing ---- */}
        <section className="watch-section" id="pricing">
          <div className="section-label">// Pricing</div>
          <h2>
            Add Countries as Your Operations <em>Grow</em>
          </h2>
          <p className="watch-section-desc">
            Start with one country. Scale when you need to. Every plan includes
            the full Centinela Watch intelligence stack.
          </p>
          <div className="watch-pricing-grid">
            {TIERS.map((t) => (
              <div
                key={t.tier}
                className={`watch-price-card${t.featured ? " watch-price-card-featured" : ""}`}
              >
                <div className="watch-price-tier">Centinela Watch</div>
                <div className="watch-price-name">{t.name}</div>
                <div className="watch-price-amount">
                  {t.price}
                  <span>/mo</span>
                </div>
                <div className="watch-price-desc">{t.desc}</div>
                <ul className="watch-price-features">
                  {t.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <CheckoutButton
                  tier={t.tier}
                  className="watch-price-cta"
                  label="Get Started"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ---- Credibility ---- */}
        <section className="watch-cred">
          <div className="section-label" style={{ textAlign: "center" }}>
            // Who Builds This
          </div>
          <div className="watch-cred-stats">
            <div>
              <div className="watch-cred-stat-val">25+</div>
              <div className="watch-cred-stat-label">Years in Security</div>
            </div>
            <div>
              <div className="watch-cred-stat-val">8+</div>
              <div className="watch-cred-stat-label">Years in Latin America</div>
            </div>
            <div>
              <div className="watch-cred-stat-val">2,000+</div>
              <div className="watch-cred-stat-label">Personnel Managed</div>
            </div>
          </div>
          <p className="watch-cred-text">
            Centinela Intel is built by a <strong>Marine veteran and security
            operations professional</strong> with over two decades of experience
            in global security. AI-accelerated collection, human-verified analysis.
            Operator judgment, not algorithm guessing.
          </p>
        </section>

        {/* ---- FAQ ---- */}
        <section className="watch-section">
          <div className="section-label">// FAQ</div>
          <h2>Common Questions</h2>
          <div className="watch-faq-list">
            {FAQ.map((item, i) => (
              <div key={i} className="watch-faq-item">
                <div className="watch-faq-q">{item.q}</div>
                <div className="watch-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Final CTA ---- */}
        <section className="watch-final-cta">
          <h2>Ready to Start Monitoring?</h2>
          <p>
            Pick a plan above, select your countries, and your first brief
            arrives tomorrow morning at 0600.
          </p>
          <a href="#pricing">View Plans</a>
        </section>
      </div>
    </>
  );
}
