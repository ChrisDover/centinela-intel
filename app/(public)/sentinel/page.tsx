import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentinel — 24/7 Autonomous Intelligence | Centinela AI",
  description:
    "24/7 autonomous threat monitoring with human-in-the-loop escalation. Dedicated intelligence cell for your organization.",
};

const CAPABILITIES = [
  {
    title: "24/7 Autonomous Monitoring",
    desc: "AI agents continuously scan OSINT sources across Spanish, Portuguese, and English — around the clock, with zero gaps in coverage.",
  },
  {
    title: "Human-in-the-Loop Escalation",
    desc: "Critical events trigger immediate human analyst review. Machine speed for detection, operator judgment for response recommendations.",
  },
  {
    title: "Dedicated Intelligence Cell",
    desc: "Your own intelligence team with dedicated analyst hours, custom briefing schedules, and direct access to senior operators.",
  },
  {
    title: "Custom OSINT Integration",
    desc: "We integrate your proprietary data sources, internal feeds, and industry-specific channels into our monitoring pipeline.",
  },
  {
    title: "Incident Response Coordination",
    desc: "When monitoring detects a threat, we coordinate the response — from travel rerouting to crisis communication to executive protection activation.",
  },
  {
    title: "Executive Protection Intel",
    desc: "Real-time threat assessment for principal movement. Route analysis, venue security, and advance intelligence for every trip.",
  },
];

export default function SentinelPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sentinel-page { position: relative; z-index: 1; }
        .sentinel-hero {
          padding: 10rem 2rem 5rem;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .sentinel-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.6rem, 6vw, 3.8rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .sentinel-hero h1 em { font-style: italic; color: var(--accent); }
        .sentinel-hero-sub {
          font-size: 1.2rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 660px;
          margin: 0 auto;
        }

        .sentinel-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .sentinel-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
        }
        .sentinel-section-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 620px;
        }

        .sentinel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .sentinel-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .sentinel-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(135deg, #00d4aa, #4da6ff);
        }
        .sentinel-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .sentinel-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .sentinel-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        .sentinel-includes {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem;
          margin-top: 2rem;
        }
        .sentinel-includes h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .sentinel-includes-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem 2rem;
          list-style: none;
          padding: 0;
        }
        .sentinel-includes-list li {
          font-size: 0.95rem;
          color: var(--text-secondary);
          padding: 0.4rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sentinel-includes-list li::before {
          content: '\\2192';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
        }

        .sentinel-cta {
          text-align: center;
          padding: 5rem 2rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .sentinel-cta h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }
        .sentinel-cta p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .sentinel-grid { grid-template-columns: 1fr; }
          .sentinel-includes-list { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .sentinel-hero { padding: 8rem 1.5rem 3rem; }
          .sentinel-section { padding: 3rem 1.5rem; }
        }
      `,
        }}
      />

      <div className="sentinel-page">
        <section className="sentinel-hero">
          <div className="section-label">// Sentinel</div>
          <h1>
            24/7 Autonomous Intelligence.
            <br /><em>Human Oversight.</em>
          </h1>
          <p className="sentinel-hero-sub">
            Continuous threat monitoring powered by private AI infrastructure with
            human-in-the-loop escalation. Your dedicated intelligence cell — always on,
            always watching.
          </p>
        </section>

        <section className="sentinel-section">
          <div className="section-label">// Capabilities</div>
          <h2>Full-Spectrum Intelligence Operations</h2>
          <p className="sentinel-section-desc">
            Sentinel combines autonomous AI monitoring with dedicated human analysts for
            organizations that require 24/7 situational awareness.
          </p>
          <div className="sentinel-grid">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="sentinel-card">
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sentinel-section">
          <div className="section-label">// What&apos;s Included</div>
          <h2>Everything in Secure AI, Plus:</h2>
          <div className="sentinel-includes">
            <h3>Sentinel includes the full Centinela intelligence stack</h3>
            <ul className="sentinel-includes-list">
              <li>Private LLM deployment on owned GPU cluster</li>
              <li>Air-gapped processing option</li>
              <li>SOC2 certified infrastructure</li>
              <li>24/7 autonomous OSINT monitoring</li>
              <li>Human analyst escalation</li>
              <li>Dedicated intelligence cell</li>
              <li>Custom OSINT source integration</li>
              <li>Incident response coordination</li>
              <li>Executive protection intel support</li>
              <li>Weekly strategy calls</li>
              <li>Custom reporting + integration</li>
            </ul>
          </div>
        </section>

        <section className="sentinel-cta">
          <h2>This Is a Conversation, Not a Checkout</h2>
          <p>
            Sentinel is custom-scoped for each organization. Tell us about your operations,
            your threat environment, and your requirements — we&apos;ll design the right
            intelligence architecture.
          </p>
          <div className="cta-buttons">
            <a href="/contact" className="btn-primary" style={{ padding: "0.85rem 2.5rem" }}>
              Start the Conversation
            </a>
            <a href="/pricing" className="btn-outline" style={{ padding: "0.85rem 2.5rem" }}>
              See All Plans
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
