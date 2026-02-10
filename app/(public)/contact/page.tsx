import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Briefing — Centinela Intel",
};

export default function ContactPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .contact-page {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 10rem 2rem 4rem;
        }

        .contact-page h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 400;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .contact-intro {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.03em;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.85rem 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--accent);
        }

        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a6680' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .form-group select option {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .form-group textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-muted);
        }

        .contact-form button[type="submit"] {
          padding: 1rem 2.5rem;
          font-size: 1rem;
          align-self: flex-start;
        }

        .contact-credibility {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .contact-credibility p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }

        .contact-credibility strong {
          color: var(--text-secondary);
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .contact-form button[type="submit"] {
            width: 100%;
          }
        }
      `}} />

      <div className="contact-page">
        <div className="section-label">// Request a Briefing</div>
        <h1>Let&apos;s Talk Intelligence</h1>
        <p className="contact-intro">Request a complimentary threat briefing for your region of interest, or tell us about your intelligence requirements. Whether you&apos;re a security director building a program, a GC evaluating duty of care exposure, or a family office managing principal travel — we&apos;ll tailor our response to your situation.</p>

        <form className="contact-form" action="https://api.web3forms.com/submit" method="POST">
          {/* Web3Forms access key */}
          <input type="hidden" name="access_key" value="7224f7af-e80d-40d7-b05c-4a2c324ed6a0" />
          <input type="hidden" name="redirect" value="https://centinelaintel.com/thank-you" />
          <input type="hidden" name="subject" value="New Briefing Request — Centinela Intel" />

          {/* Honeypot spam prevention */}
          <input type="checkbox" name="botcheck" style={{ display: "none" }} />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" required placeholder="you@company.com" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company / Organization</label>
              <input type="text" id="company" name="company" placeholder="Your organization" />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role / Title</label>
              <input type="text" id="role" name="role" placeholder="e.g. VP Security, Regional Director" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="regions">Region(s) of Interest</label>
            <select id="regions" name="regions" defaultValue="">
              <option value="" disabled>Select a region</option>
              <option value="Mexico">Mexico</option>
              <option value="Central America">Central America (Guatemala, Honduras, El Salvador)</option>
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Brazil">Brazil</option>
              <option value="Southern Cone">Southern Cone (Argentina, Chile, Uruguay)</option>
              <option value="Caribbean">Caribbean</option>
              <option value="Multiple / All LatAm">Multiple Regions / All LatAm</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">How can we help? *</label>
            <textarea id="message" name="message" required placeholder="Tell us about your intelligence requirements, operational footprint, or specific concerns. We'll tailor our response accordingly."></textarea>
          </div>

          <button type="submit" className="btn-primary">Send Request</button>
        </form>

        <div className="contact-credibility">
          <p><strong>Confidentiality guaranteed.</strong> All inquiries are handled directly by our senior team — the same people who have built corporate security programs, advised boards, and managed enterprise risk across Latin America for over 25 years. Your information is never shared with third parties.</p>
          <p>Prefer email? Reach us directly at <strong>intel@centinelaintel.com</strong></p>
        </div>
      </div>
    </>
  );
}
