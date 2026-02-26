import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Centinela AI",
};

export default function PrivacyPage() {
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

        .policy-page ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
        }

        .policy-page ul li {
          padding: 0.4rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .policy-page ul li::before {
          content: '\\2014';
          color: var(--accent);
          flex-shrink: 0;
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
        <h1>Privacy Policy</h1>
        <p className="policy-updated">Last updated: February 2026</p>

        <p>Centinela AI, a service of Enfocado Capital LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>

        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul>
          <li>Name, email address, and company information when you request a briefing</li>
          <li>Email address when you subscribe to The Centinela Brief</li>
          <li>Any other information you choose to provide via our contact form</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries and briefing requests</li>
          <li>Deliver The Centinela Brief newsletter to subscribers</li>
          <li>Communicate with you about our services</li>
          <li>Improve our website and services</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. We may use trusted third-party services (such as email delivery platforms) to operate our newsletter, subject to their own privacy policies.</p>

        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. Given the nature of our business, we take data security seriously and apply the same operational security principles to client data that we apply to intelligence products.</p>

        <h2>Newsletter</h2>
        <p>Our newsletter, The Centinela Brief, is delivered via Beehiiv. You can unsubscribe at any time using the link provided in every email. Upon unsubscribing, your email address will be removed from our mailing list.</p>

        <h2>Contact</h2>
        <p>Questions about this policy? Contact us at <a href="mailto:intel@centinelaintel.com">intel@centinelaintel.com</a>.</p>
      </div>
    </>
  );
}
