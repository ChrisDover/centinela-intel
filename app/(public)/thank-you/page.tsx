import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Received — Centinela Intel",
};

export default function ThankYouPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .thankyou-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8rem 2rem 4rem;
          text-align: center;
        }

        .thankyou-container {
          max-width: 520px;
          width: 100%;
        }

        .thankyou-icon {
          width: 64px; height: 64px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 1.5rem;
          color: var(--accent);
        }

        .thankyou-container h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }

        .thankyou-message {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .thankyou-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .thankyou-links .btn-primary,
        .thankyou-links .btn-outline {
          padding: 0.85rem 2rem;
          font-size: 0.95rem;
        }
      `}} />

      <div className="thankyou-page">
        <div className="thankyou-container">
          <div className="thankyou-icon">&#10003;</div>
          <h1>Request Received</h1>
          <p className="thankyou-message">Your briefing request has been received. Our intelligence team will respond within 24 hours with a tailored assessment for your region of interest.</p>
          <div className="thankyou-links">
            <a href="/" className="btn-outline">Back to Home</a>
            <a href="/subscribe" className="btn-primary">Subscribe to Daily Brief</a>
          </div>
        </div>
      </div>
    </>
  );
}
