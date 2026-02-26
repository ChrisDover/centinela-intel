import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure AI — Private Intelligence Infrastructure at 1/10th the Cost | Centinela AI",
  description:
    "Enterprise AI vendors charge $500K+/yr for private LLM deployments. Centinela Secure AI runs local LLMs on our own GPU cluster. SOC2 certified. Air-gap ready. Zero third-party API exposure.",
};

const USE_CASES = [
  {
    title: "Defense & Government Contractors",
    desc: "ITAR-compliant intelligence processing. No data touches commercial AI APIs. Full audit trail for compliance.",
  },
  {
    title: "Family Offices & UHNW Principals",
    desc: "Travel intelligence and threat monitoring that never exposes principal identity or movement patterns to third parties.",
  },
  {
    title: "Regulated Industries",
    desc: "Financial services, healthcare, and energy companies with strict data handling requirements and board-level oversight.",
  },
  {
    title: "Corporate Security Teams",
    desc: "Organizations that need AI-powered intelligence but can't risk operational details flowing through public model APIs.",
  },
];

const INFRA_LINES = [
  { status: "green", text: "MODEL .......................... Local LLM (Private)" },
  { status: "green", text: "GPU CLUSTER .................... Owned Infrastructure" },
  { status: "green", text: "OSINT Collection Engine ........ ACTIVE" },
  { status: "green", text: "NLP Analysis Pipeline ........... ACTIVE" },
  { status: "blue", text: "Compliance ..................... SOC2 Certified" },
  { status: "green", text: "Third-Party API Exposure ........ NONE" },
  { status: "green", text: "Client Data Leakage ............. ZERO" },
  { status: "green", text: "Air-Gap Option .................. AVAILABLE" },
  { status: "green", text: "Custom Model Fine-Tuning ........ SUPPORTED" },
];

export default function SecureAIPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sai-page { position: relative; z-index: 1; }
        .sai-hero {
          padding: 10rem 2rem 5rem;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .sai-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.6rem, 6vw, 3.8rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .sai-hero h1 em { font-style: italic; color: var(--accent); }
        .sai-hero-sub {
          font-size: 1.2rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 660px;
          margin: 0 auto;
        }
        .sai-hero-credibility {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          margin-top: 1.5rem;
          font-style: italic;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .sai-hero-cta-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .sai-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .sai-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
        }
        .sai-section h2 em { font-style: italic; color: var(--accent); }
        .sai-section-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 620px;
        }

        /* Price comparison strip */
        .sai-compare-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .sai-compare-card {
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sai-compare-competitor {
          background: rgba(255, 71, 87, 0.06);
          border: 1px solid rgba(255, 71, 87, 0.25);
        }
        .sai-compare-competitor .sai-compare-price {
          text-decoration: line-through;
          text-decoration-color: #ff4757;
          text-decoration-thickness: 3px;
          color: #ffffff;
        }
        .sai-compare-centinela {
          background: linear-gradient(180deg, rgba(0, 212, 170, 0.1), rgba(20, 26, 40, 0.6));
          border: 2px solid rgba(0, 212, 170, 0.35);
          box-shadow: 0 0 30px rgba(0, 212, 170, 0.1);
        }
        .sai-compare-centinela::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
        }
        .sai-compare-name {
          font-size: 1rem; font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sai-compare-centinela .sai-compare-name {
          color: var(--accent);
        }
        .sai-compare-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.4rem; font-weight: 700;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .sai-compare-price span {
          font-size: 0.8rem; font-weight: 400;
          color: rgba(255,255,255,0.5);
        }
        .sai-compare-centinela .sai-compare-price {
          text-decoration: none;
        }
        .sai-compare-note {
          font-size: 0.9rem; color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }
        .sai-compare-savings {
          margin-top: 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem; font-weight: 700;
          color: var(--safe);
          background: rgba(0, 212, 170, 0.15);
          padding: 6px 16px; border-radius: 100px;
          display: inline-block;
        }

        /* Risk examples */
        .sai-risk-examples {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .sai-risk-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .sai-risk-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--danger);
        }
        .sai-risk-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .sai-risk-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 1rem;
          background: rgba(255, 71, 87, 0.12);
          color: var(--danger);
        }
        .sai-risk-headline {
          font-size: 1.1rem; font-weight: 600;
          margin-bottom: 0.75rem; color: #fff;
        }
        .sai-risk-detail {
          font-size: 0.9rem; color: rgba(255,255,255,0.7);
          line-height: 1.65; margin-bottom: 1rem;
        }
        .sai-risk-source {
          font-size: 0.7rem; color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
          font-style: italic;
        }

        /* Terminal mockup */
        .sai-terminal {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          background: #080b12;
          margin-top: 3rem;
          max-width: 740px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
        }
        .sai-terminal-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #060910;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sai-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .sai-terminal-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          margin-left: 0.75rem;
        }
        .sai-terminal-live {
          margin-left: auto;
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; color: #28c840;
        }
        .sai-live-dot {
          width: 6px; height: 6px; background: #28c840; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(40, 200, 64, 0.5);
        }
        .sai-terminal-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sai-infra-line {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1rem;
          background: rgba(10, 14, 23, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          animation: feed-in 0.4s ease-out both;
        }
        .sai-infra-line:nth-child(1) { animation-delay: 0.1s; }
        .sai-infra-line:nth-child(2) { animation-delay: 0.2s; }
        .sai-infra-line:nth-child(3) { animation-delay: 0.3s; }
        .sai-infra-line:nth-child(4) { animation-delay: 0.4s; }
        .sai-infra-line:nth-child(5) { animation-delay: 0.5s; }
        .sai-infra-line:nth-child(6) { animation-delay: 0.6s; }
        .sai-infra-line:nth-child(7) { animation-delay: 0.7s; }
        .sai-infra-line:nth-child(8) { animation-delay: 0.8s; }
        .sai-infra-line:nth-child(9) { animation-delay: 0.9s; }
        @keyframes feed-in {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sai-status {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sai-status-green { background: #28c840; box-shadow: 0 0 8px rgba(40, 200, 64, 0.4); }
        .sai-status-blue { background: var(--info); box-shadow: 0 0 8px rgba(77, 166, 255, 0.3); }

        /* Use cases */
        .sai-use-cases {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .sai-use-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .sai-use-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent-orange);
        }
        .sai-use-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .sai-use-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .sai-use-card p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.65;
        }

        /* Stats */
        .sai-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .sai-feature {
          text-align: center;
          padding: 2rem 1.5rem;
          background: rgba(20, 26, 40, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }
        .sai-feature-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.4rem;
          font-weight: 500;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }
        .sai-feature-label {
          font-size: 1rem;
          color: rgba(255,255,255,0.6);
        }

        /* CTA */
        .sai-cta {
          text-align: center;
          padding: 5rem 2rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .sai-cta h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }
        .sai-cta p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .sai-use-cases, .sai-features, .sai-risk-examples { grid-template-columns: 1fr; }
          .sai-compare-strip { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .sai-hero { padding: 8rem 1.5rem 3rem; }
          .sai-section { padding: 3rem 1.5rem; }
          .sai-compare-strip { grid-template-columns: 1fr; max-width: 320px; margin-left: auto; margin-right: auto; }
          .sai-hero-cta-row { flex-direction: column; align-items: center; }
        }
      `,
        }}
      />

      <div className="sai-page">
        {/* HERO — pain-point framing */}
        <section className="sai-hero">
          <div className="section-label">// Secure AI</div>
          <h1>
            Private AI That Costs $500K Elsewhere.<br /><em>From $2.5K/mo.</em>
          </h1>
          <p className="sai-hero-sub">
            Enterprise vendors charge half a million a year for private LLM deployments.
            We run local LLMs on our own GPU cluster — SOC2 certified, air-gap ready,
            zero third-party API exposure. Your data never leaves your environment.
          </p>
          <div className="sai-hero-credibility">
            Owned GPU infrastructure. Not rented cloud instances — our own hardware,
            meaning we can price this at a fraction of what IBM, Palantir, or Booz Allen charge.
          </div>
          <div className="sai-hero-cta-row">
            <a href="/contact" className="btn-primary" style={{ padding: '0.85rem 2.5rem', display: 'inline-block', textDecoration: 'none' }}>
              Talk to Us
            </a>
            <a href="/watch" className="btn-outline" style={{ padding: '0.85rem 2.5rem', display: 'inline-block', textDecoration: 'none' }}>
              Start With Watch Pro — $199/mo
            </a>
          </div>
        </section>

        {/* WHAT YOU'D PAY ELSEWHERE */}
        <section className="sai-section">
          <div className="section-label">// Price Comparison</div>
          <h2>What Private AI <em>Actually Costs</em></h2>
          <p className="sai-section-desc">
            Every enterprise AI vendor quotes six or seven figures for private LLM infrastructure.
            We own the GPUs, so we don&apos;t.
          </p>
          <div className="sai-compare-strip">
            <div className="sai-compare-card sai-compare-competitor">
              <div className="sai-compare-name">Palantir AIP</div>
              <div className="sai-compare-price">$1M+<span>/yr</span></div>
              <div className="sai-compare-note">Multi-year contracts. 6-month deployment.</div>
            </div>
            <div className="sai-compare-card sai-compare-competitor">
              <div className="sai-compare-name">IBM watsonx</div>
              <div className="sai-compare-price">$500K+<span>/yr</span></div>
              <div className="sai-compare-note">Enterprise licensing + consulting fees.</div>
            </div>
            <div className="sai-compare-card sai-compare-competitor">
              <div className="sai-compare-name">Booz Allen</div>
              <div className="sai-compare-price">$750K+<span>/yr</span></div>
              <div className="sai-compare-note">Government contracts. Long procurement.</div>
            </div>
            <div className="sai-compare-card sai-compare-centinela">
              <div className="sai-compare-name">Secure AI</div>
              <div className="sai-compare-price">$30K<span>/yr</span></div>
              <div className="sai-compare-note">No contract. Owned GPUs. Start in weeks.</div>
              <div className="sai-compare-savings">Save $470K+ vs. IBM</div>
            </div>
          </div>
        </section>

        {/* WHY THEY CHARGE SO MUCH — AND WHY WE DON'T */}
        <section className="sai-section">
          <div className="section-label">// The Risk of Public AI</div>
          <h2>What Happens When You Use <em>Their APIs</em></h2>
          <p className="sai-section-desc">
            Every query to OpenAI, Anthropic, or Google trains their models.
            For security intelligence, that means your threat assessments,
            principal movements, and operational plans are someone else&apos;s training data.
          </p>
          <div className="sai-risk-examples">
            <div className="sai-risk-card">
              <div className="sai-risk-badge">Exposure risk</div>
              <div className="sai-risk-headline">Executive Travel Routes Leaked</div>
              <p className="sai-risk-detail">
                A Fortune 500 company used ChatGPT to draft travel risk assessments.
                Prompt data — including executive names, hotel locations, and convoy routes —
                was ingested into OpenAI&apos;s training pipeline. With Centinela, that data
                never leaves your GPU cluster.
              </p>
              <div className="sai-risk-source">Scenario: Composite from reported enterprise AI incidents</div>
            </div>
            <div className="sai-risk-card">
              <div className="sai-risk-badge">Compliance failure</div>
              <div className="sai-risk-headline">ITAR Violation via Cloud AI</div>
              <p className="sai-risk-detail">
                Defense contractors processing threat intelligence through commercial APIs
                risk ITAR violations when controlled technical data crosses jurisdictional
                boundaries. Our air-gapped deployments eliminate this vector entirely.
              </p>
              <div className="sai-risk-source">Scenario: Based on published ITAR compliance guidance</div>
            </div>
            <div className="sai-risk-card">
              <div className="sai-risk-badge">Data sovereignty</div>
              <div className="sai-risk-headline">UHNW Principal Pattern Exposure</div>
              <p className="sai-risk-detail">
                Family offices using cloud AI for threat monitoring inadvertently create
                a pattern-of-life database on their principals — travel patterns, threat
                responses, security protocols — all stored on someone else&apos;s servers.
              </p>
              <div className="sai-risk-source">Scenario: Common pattern in UHNW security consulting</div>
            </div>
          </div>
        </section>

        {/* Infrastructure terminal */}
        <section className="sai-section">
          <div className="section-label">// Infrastructure Status</div>
          <h2>Your <em>Private</em> Intelligence Stack</h2>
          <p className="sai-section-desc">
            Not a managed service on someone else&apos;s cloud. Dedicated hardware, your models, your data.
          </p>
          <div className="sai-terminal">
            <div className="sai-terminal-header">
              <span className="sai-dot" style={{ background: "#ff5f57" }}></span>
              <span className="sai-dot" style={{ background: "#febc2e" }}></span>
              <span className="sai-dot" style={{ background: "#28c840" }}></span>
              <span className="sai-terminal-title">secure-ai-status — centinela-infrastructure</span>
              <div className="sai-terminal-live">
                <span className="sai-live-dot" />
                ALL SYSTEMS NOMINAL
              </div>
            </div>
            <div className="sai-terminal-body">
              {INFRA_LINES.map((line, i) => (
                <div key={i} className="sai-infra-line">
                  <div className={`sai-status sai-status-${line.status}`}></div>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="sai-section">
          <div className="sai-features">
            <div className="sai-feature">
              <div className="sai-feature-value">Owned</div>
              <div className="sai-feature-label">GPU Infrastructure</div>
            </div>
            <div className="sai-feature">
              <div className="sai-feature-value">Private</div>
              <div className="sai-feature-label">Local LLM Deployment</div>
            </div>
            <div className="sai-feature">
              <div className="sai-feature-value">0</div>
              <div className="sai-feature-label">Third-Party API Calls</div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="sai-section">
          <div className="section-label">// Use Cases</div>
          <h2>Built For Organizations That <em>Can&apos;t Compromise</em></h2>
          <p className="sai-section-desc">
            When your intelligence operations touch classified programs, UHNW principals,
            or regulated data — you need infrastructure that never leaks.
          </p>
          <div className="sai-use-cases">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="sai-use-card">
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="sai-cta">
          <h2>Stop Paying Enterprise Prices for Rented Infrastructure</h2>
          <p>
            Palantir and IBM charge $500K+ because they rent cloud GPUs and mark them up 10x.
            We own our hardware. That&apos;s why we can offer Secure AI at a fraction of the cost.
          </p>
          <div className="sai-hero-cta-row">
            <a href="/contact" className="btn-primary" style={{ padding: "0.85rem 2.5rem", display: "inline-block", textDecoration: "none" }}>
              Scope Your Deployment
            </a>
            <a href="/pricing" className="btn-outline" style={{ padding: "0.85rem 2.5rem", display: "inline-block", textDecoration: "none" }}>
              See All Plans
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
