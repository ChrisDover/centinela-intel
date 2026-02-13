import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe — The Centinela Brief | Centinela Intel",
};

export default function SubscribePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .subscribe-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8rem 2rem 4rem;
        }

        .subscribe-container {
          max-width: 560px;
          width: 100%;
          text-align: center;
        }

        .subscribe-container h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .subscribe-container h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .subscribe-intro {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .subscribe-benefits {
          text-align: left;
          list-style: none;
          padding: 0;
          margin-bottom: 2.5rem;
        }

        .subscribe-benefits li {
          padding: 0.6rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .subscribe-benefits li::before {
          content: '→';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .subscribe-form-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .subscribe-form {
          display: flex;
          gap: 0.75rem;
        }

        .subscribe-form input[type="email"] {
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

        .subscribe-form input[type="email"]:focus {
          border-color: var(--accent);
        }

        .subscribe-form button {
          padding: 0.85rem 2rem;
          white-space: nowrap;
          font-size: 0.95rem;
        }

        .subscribe-fine-print {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
        }

        .subscribe-sample {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .subscribe-sample a {
          color: var(--accent);
          text-decoration: none;
          transition: color 0.2s;
        }

        .subscribe-sample a:hover {
          color: #00e8bb;
        }

        @media (max-width: 600px) {
          .subscribe-form {
            flex-direction: column;
          }
          .subscribe-form button {
            width: 100%;
          }
        }
      `}} />

      <div className="subscribe-page">
        <div className="subscribe-container">
          <div className="section-label" style={{ textAlign: "center" }}>// Daily Intelligence</div>
          <h1>The Centinela <em>Brief</em></h1>
          <p className="subscribe-intro">A free daily Latin America security intelligence brief delivered every morning at 0600. AI-accelerated OSINT collection, human-verified analysis. Signal, not noise.</p>

          <ul className="subscribe-benefits">
            <li>Daily LatAm threat assessment with regional risk levels and trend analysis</li>
            <li>Top security developments across Mexico, Central America, Colombia, and Ecuador</li>
            <li>Country-by-country operational guidance and travel risk updates</li>
            <li>Analyst assessment with forward-looking indicators to watch</li>
          </ul>

          <div className="subscribe-form-card">
            <form className="subscribe-form" action="/api/subscribe" method="POST">
              <input type="email" name="email" placeholder="Enter your email" required />
              <button type="submit" className="btn-primary">Subscribe Free</button>
            </form>
            <p className="subscribe-fine-print">Your email is never shared, sold, or used to train AI models. Unsubscribe anytime.</p>
          </div>

          <p className="subscribe-sample">See what you&apos;ll get: <a href="/briefs/latest">Read today&apos;s brief</a></p>
        </div>
      </div>
    </>
  );
}
