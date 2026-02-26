import styles from '../home.module.css';

const MOATS = [
  {
    number: 1,
    title: 'Spanish-Language OSINT Depth',
    description:
      'We monitor the sources Dataminr can\'t read — WhatsApp grupos, local police radio, narco forums, regional press. That\'s why we flag threats 47 minutes before English-language platforms.',
  },
  {
    number: 2,
    title: 'Owned Infrastructure, Not Rented',
    description:
      '1,600 V100 GPUs we own outright — not rented AWS instances marked up 10x. That\'s why Secure AI starts at $2.5K/mo instead of the $500K IBM and Palantir charge.',
  },
  {
    number: 3,
    title: 'Operator Judgment at Machine Scale',
    description:
      '25 years of intelligence tradecraft encoded into our models. IC analytical frameworks, source reliability scoring, threat classification — not just NLP on news articles.',
  },
  {
    number: 4,
    title: 'Physical + Digital Convergence',
    description:
      'Dataminr is digital-only. Crisis24 is physical-only. We\'re the connective tissue — the only platform that correlates cyber threats with on-the-ground security events.',
  },
  {
    number: 5,
    title: '85%+ Margins at Any Scale',
    description:
      'Owned GPUs mean our marginal cost per client approaches zero. Profitable at $75K MRR. Dataminr raised $1.24B and still isn\'t profitable. We are from day one.',
  },
];

export function MoatsSection() {
  return (
    <section>
      <div className="section-label">// Why Centinela Wins</div>
      <h2 className="section-title">Five Reasons We Beat the $200K Incumbents</h2>

      <div className={styles.moatsGrid}>
        {MOATS.map((moat) => (
          <div key={moat.number} className={styles.moatCard}>
            <div className={styles.moatNumber}>{String(moat.number).padStart(2, '0')}</div>
            <h3>{moat.title}</h3>
            <p>{moat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
