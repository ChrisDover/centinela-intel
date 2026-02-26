import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get the Daily Brief — Centinela AI",
  description:
    "Free daily Latin America security intelligence delivered every morning. 22 countries. AI-accelerated OSINT. Human-verified analysis.",
};

export default function LinkedInLandingPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .li-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8rem 2rem 4rem;
        }
        .li-container {
          max-width: 520px;
          width: 100%;
          text-align: center;
        }
        .li-container h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 400;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .li-container h1 em {
          font-style: italic;
          color: var(--accent);
        }
        .li-intro {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .li-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .li-stat {
          text-align: center;
        }
        .li-stat-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent);
        }
        .li-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .li-form-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .li-form {
          display: flex;
          gap: 0.75rem;
        }
        .li-form input[type="email"] {
          flex: 1;
          padding: 0.85rem 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-accent);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .li-form input[type="email"]:focus {
          border-color: var(--accent);
        }
        .li-form button {
          padding: 0.85rem 2rem;
          white-space: nowrap;
          font-size: 0.95rem;
        }
        .li-fine {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
        }
        .li-what {
          text-align: left;
          list-style: none;
          padding: 0;
          margin-bottom: 2.5rem;
        }
        .li-what li {
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .li-what li::before {
          content: '→';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .li-sample {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .li-sample a {
          color: var(--accent);
          text-decoration: none;
        }
        .li-sample a:hover {
          text-decoration: underline;
        }
        .li-cred {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        @media (max-width: 600px) {
          .li-form {
            flex-direction: column;
          }
          .li-form button {
            width: 100%;
          }
          .li-stats {
            gap: 1.5rem;
          }
        }
      `,
        }}
      />

      <div className="li-page">
        <div className="li-container">
          <h1>
            Latin America <em>Intelligence</em>
            <br />
            in Your Inbox
          </h1>
          <p className="li-intro">
            The Centinela Brief is a free daily security intelligence report
            covering all 22 Latin American countries. Written by operators, not
            algorithms.
          </p>

          <div className="li-stats">
            <div className="li-stat">
              <div className="li-stat-num">22</div>
              <div className="li-stat-label">Countries</div>
            </div>
            <div className="li-stat">
              <div className="li-stat-num">Daily</div>
              <div className="li-stat-label">Delivery</div>
            </div>
            <div className="li-stat">
              <div className="li-stat-num">Free</div>
              <div className="li-stat-label">Always</div>
            </div>
          </div>

          <ul className="li-what">
            <li>Regional threat level with trend analysis</li>
            <li>Key security developments across the full region</li>
            <li>22-country watch with per-country risk assessment</li>
            <li>Analyst assessment with forward-looking indicators</li>
          </ul>

          <div className="li-form-card">
            <form className="li-form" action="/api/subscribe" method="POST">
              <input
                type="hidden"
                name="source"
                value="linkedin"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="btn-primary">
                Get the Brief
              </button>
            </form>
            <p className="li-fine">
              No spam, no sales calls. Just intelligence. Unsubscribe anytime.
            </p>
          </div>

          <p className="li-sample">
            See what you&apos;ll get:{" "}
            <a href="/briefs/latest?utm_source=linkedin&utm_medium=landing">
              Read today&apos;s brief
            </a>
          </p>

          <div className="li-cred">
            Built by a Marine veteran with 25+ years in global security
            operations. AI-accelerated OSINT collection, human-verified analysis.
          </div>
        </div>
      </div>
    </>
  );
}
