import styles from '../home.module.css';

const TIERS = [
  {
    label: 'Monitor',
    name: 'Monitor',
    price: '$29',
    priceUnit: '/mo',
    description: 'Daily intelligence briefs across 22 monitored countries. $29/mo for 1 country, $79/mo for 5 (+$10 each additional).',
    features: ['Daily briefs — 22 countries available', 'Incident alerts', 'Monthly threat landscape', 'Analyst support'],
    cta: 'Start Monitoring',
    ctaLink: '/pricing',
    featured: false,
    selfServe: true,
    gpu: '8–12 GPUs',
  },
  {
    label: 'Watch Pro',
    name: 'Watch Pro',
    price: '$199',
    priceUnit: '/mo',
    description: 'Live intelligence terminal. $199 base (1 country), +$100/country, $499 cap for all 22. +$25/seat.',
    features: ['Everything in Monitor', 'Live dashboard', 'Real-time threat map', 'Flash alerts + API', 'Travel risk assessments'],
    cta: 'Get Watch Pro',
    ctaLink: '/watch',
    featured: true,
    selfServe: true,
    gpu: '20–30 GPUs',
  },
  {
    label: 'Secure AI',
    name: 'Secure AI',
    price: '$2.5–5K',
    priceUnit: '/mo',
    description: 'Private LLM on isolated infrastructure. SOC2 compliant. Client data never leaves.',
    features: ['Private LLM deployment', 'Dedicated GPU cluster', 'Air-gapped option', 'SOC2 certified', 'Full data sovereignty'],
    cta: 'Talk to Us',
    ctaLink: '/contact',
    featured: false,
    selfServe: false,
    gpu: '8 GPUs/client',
  },
  {
    label: 'Sentinel',
    name: 'Sentinel',
    price: '$10K+',
    priceUnit: '/mo',
    description: '24/7 red/blue team monitoring, executive threat assessment, deepfake detection, converged briefings.',
    features: ['Everything in Secure AI', '24/7 autonomous monitoring', 'Dedicated intelligence cell', 'Converged physical + digital', 'Incident response coordination'],
    cta: 'Talk to Us',
    ctaLink: '/contact',
    featured: false,
    selfServe: false,
    gpu: '20–40 GPUs/client',
  },
];

export function ProductLadder() {
  return (
    <section>
      <div className="section-label">// Product Platform</div>
      <h2 className="section-title">Four Tiers. Every Stage of Security Maturity.</h2>
      <p className="section-desc">
        Four tiers serving every stage of security maturity — on the same infrastructure.
      </p>

      <div className={styles.productLadder}>
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`${styles.ladderCard} ${tier.featured ? styles.ladderCardFeatured : ''}`}
          >
            <div className={styles.ladderLabel}>{tier.label}</div>
            <h3>{tier.name}</h3>
            <div className={styles.ladderPrice}>
              {tier.price}
              {tier.priceUnit && <span>{tier.priceUnit}</span>}
            </div>
            <p className={styles.ladderDesc}>{tier.description}</p>
            <ul className={styles.ladderFeatures}>
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '6px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: '1rem',
              fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            }}>
              {tier.gpu}
            </div>
            <a
              href={tier.ctaLink}
              className={`${styles.ladderCta} ${tier.selfServe ? styles.ladderCtaPrimary : styles.ladderCtaSecondary}`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
