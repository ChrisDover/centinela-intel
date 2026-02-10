import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Centinela Intel",
};

export default function TermsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .policy-page {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto;
          padding: 10rem 2rem 4rem;
        }

        .policy-page h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .policy-updated {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 3rem;
        }

        .policy-page h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .policy-page p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .policy-page a {
          color: var(--accent);
          text-decoration: none;
        }

        .policy-page a:hover {
          color: #00e8bb;
        }
      `}} />

      <div className="policy-page">
        <div className="section-label">// Legal</div>
        <h1>Terms of Service</h1>
        <p className="policy-updated">Last updated: February 2026</p>

        <p>These terms govern your use of the Centinela Intel website and services, operated by Enfocado Capital LLC.</p>

        <h2>Services</h2>
        <p>Centinela Intel provides security risk intelligence products including threat assessments, daily briefs, incident alerts, and strategic analysis. Our intelligence products are based on open-source information (OSINT) supplemented by proprietary analysis and are intended for informational purposes to support security decision-making.</p>

        <h2>Use of Intelligence Products</h2>
        <p>Intelligence products delivered to clients are for the exclusive use of the subscribing organization and its authorized personnel. Redistribution, resale, or public disclosure of client-specific intelligence products is prohibited without written consent.</p>
        <p>The Centinela Brief (our free daily newsletter) is classified as open-source and may be shared freely with attribution.</p>

        <h2>Disclaimer</h2>
        <p>Our intelligence products represent our best assessment based on available information at the time of publication. Threat environments are inherently dynamic and unpredictable. Centinela Intel does not guarantee the accuracy, completeness, or timeliness of any intelligence product. Our assessments should be considered one input among many in your security decision-making process.</p>
        <p>Centinela Intel is not a substitute for professional security consulting, legal advice, or emergency services. In any emergency situation, contact local authorities immediately.</p>

        <h2>Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Enfocado Capital LLC and its personnel shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or reliance on our intelligence products or services.</p>

        <h2>Payment and Subscriptions</h2>
        <p>Paid service tiers are billed monthly. Terms of engagement, including scope of coverage, deliverables, and pricing, are established in individual service agreements with each client.</p>

        <h2>Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Changes will be reflected on this page with an updated revision date.</p>

        <h2>Contact</h2>
        <p>Questions about these terms? Contact us at <a href="mailto:intel@centinelaintel.com">intel@centinelaintel.com</a>.</p>
      </div>
    </>
  );
}
