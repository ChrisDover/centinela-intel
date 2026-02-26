import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're In — The Centinela Brief | Centinela AI",
};

export default function WelcomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .welcome-page {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 10rem 2rem 4rem;
        }

        .welcome-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: var(--accent-dim);
          border: 1px solid rgba(0, 212, 170, 0.25);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

        .welcome-status::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .welcome-page h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 400;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .welcome-intro {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .welcome-confirm {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .welcome-confirm-icon {
          width: 40px; height: 40px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--accent);
          font-size: 1.1rem;
        }

        .welcome-confirm-text p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 0.25rem;
        }

        .welcome-confirm-text strong {
          color: var(--text-primary);
        }

        .welcome-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1rem;
        }

        .welcome-brief-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          transition: border-color 0.2s;
        }

        .welcome-brief-card:hover {
          border-color: var(--accent);
        }

        .welcome-brief-card h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.3rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .welcome-brief-card .brief-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .welcome-brief-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .welcome-brief-card a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: gap 0.2s;
        }

        .welcome-brief-card a:hover {
          gap: 0.75rem;
        }

        .welcome-expect {
          margin-bottom: 2.5rem;
        }

        .welcome-expect h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .expect-list {
          list-style: none;
          padding: 0;
        }

        .expect-list li {
          padding: 0.6rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .expect-list li::before {
          content: '\\2192';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .expect-list li strong {
          color: var(--text-primary);
        }

        .welcome-cta {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .welcome-cta p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .welcome-cta a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
        }

        .welcome-cta a:hover {
          color: #00e8bb;
        }
      `}} />

      <div className="welcome-page">
        <div className="welcome-status">Subscription confirmed</div>
        <h1>You&apos;re on the list.</h1>
        <p className="welcome-intro">The Centinela Brief lands every morning at 0600. AI-accelerated LatAm security intelligence, verified by analysts with 25+ years on the ground. Your email is never shared or used to train AI models.</p>

        <div className="welcome-confirm">
          <div className="welcome-confirm-icon">&#10003;</div>
          <div className="welcome-confirm-text">
            <p><strong>Check your email.</strong> You&apos;ll receive a welcome message from Centinela AI. Check spam if you don&apos;t see it within a few minutes.</p>
          </div>
        </div>

        <div className="welcome-section-label">// Your First Brief</div>

        <div className="welcome-brief-card">
          <h3>Latin America Daily Security Brief</h3>
          <div className="brief-meta">Open Source — For Distribution</div>
          <p>Regional threat assessment, top security developments across Mexico, Central America, Colombia, and Ecuador. Country-by-country operational guidance and forward-looking analyst assessment.</p>
          <a href="/briefs/latest">Read today&apos;s brief &#8594;</a>
        </div>

        <div className="welcome-expect">
          <h3>What to expect</h3>
          <ul className="expect-list">
            <li><strong>Every morning at 0600 CST</strong> — a concise threat assessment covering Mexico, Central America, Colombia, Ecuador, and the wider region</li>
            <li><strong>Top developments</strong> — ranked by severity with operational impact analysis, not just headlines</li>
            <li><strong>Country-by-country guidance</strong> — actionable recommendations for security teams and travelers</li>
            <li><strong>Analyst assessment</strong> — forward-looking indicators and dynamics to watch over the coming weeks</li>
          </ul>
        </div>

        <div className="welcome-cta">
          <p>Need daily country-specific intelligence? Monitor starts at $29/mo with daily briefs, incident alerts, and analyst support.</p>
          <a href="/pricing">Explore Monitor Plans &#8594;</a>
        </div>
      </div>
    </>
  );
}
