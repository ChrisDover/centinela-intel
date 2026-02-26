import styles from '../home.module.css';

export function ThreatBanner() {
  return (
    <section className={styles.priceDrop}>
      <div className="section-label" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        // What You&apos;d Pay Elsewhere
      </div>
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>
        Enterprise Intelligence at Startup Prices
      </h2>
      <p className="section-desc" style={{ maxWidth: 620, margin: '0 auto 3rem' }}>
        The same daily intelligence, threat monitoring, and analyst-grade assessments that
        Fortune 500 companies pay six figures for — now accessible to any team with
        LatAm operations. No annual contracts. No procurement cycles. Start in 2 minutes.
      </p>

      {/* ── Competitor cards: large, red-tinted, crossed out ── */}
      <div className={styles.priceDropGrid}>
        <div className={styles.priceDropCard} data-competitor>
          <div className={styles.priceDropLogo}>Dataminr</div>
          <div className={styles.priceDropAmount}>
            <span className={styles.strikethrough}>$240K<span className={styles.unit}>/yr</span></span>
          </div>
          <div className={styles.priceDropDetail}>
            Annual enterprise contract. 6-month sales cycle. Global generalist —
            no LatAm specialization. No Spanish-language OSINT. No owned infrastructure.
          </div>
        </div>

        <div className={styles.priceDropCard} data-competitor>
          <div className={styles.priceDropLogo}>Crisis24 / Seerist</div>
          <div className={styles.priceDropAmount}>
            <span className={styles.strikethrough}>$50–250K<span className={styles.unit}>/yr</span></span>
          </div>
          <div className={styles.priceDropDetail}>
            Annual commitment required. Bolt-on AI over legacy platforms.
            Regional coverage is surface-level. Your data runs through their cloud.
          </div>
        </div>
      </div>

      {/* ── Centinela: large, green-tinted, the hero ── */}
      <div className={styles.priceDropHero}>
        <div className={styles.priceDropHeroInner}>
          <div className={styles.priceDropHeroLabel}>Centinela AI</div>
          <div className={styles.priceDropHeroAmounts}>
            <div className={styles.priceDropHeroTier}>
              <span className={styles.priceDropHeroBig}>Free</span>
              <span className={styles.priceDropHeroDesc}>Daily regional brief</span>
            </div>
            <div className={styles.priceDropHeroDivider} />
            <div className={styles.priceDropHeroTier}>
              <span className={styles.priceDropHeroBig}>$29<span className={styles.unit}>/mo</span></span>
              <span className={styles.priceDropHeroDesc}>Per-country intelligence</span>
            </div>
            <div className={styles.priceDropHeroDivider} />
            <div className={styles.priceDropHeroTier}>
              <span className={styles.priceDropHeroBig}>$199<span className={styles.unit}>/mo</span></span>
              <span className={styles.priceDropHeroDesc}>Live intelligence terminal</span>
            </div>
          </div>
          <div className={styles.priceDropHeroBottom}>
            LatAm-specialized. 25-year operator built. Spanish-language OSINT depth.
            1,600 owned GPUs. Private AI available. Cancel anytime.
          </div>
        </div>
      </div>

      {/* ── Savings callout ── */}
      <div className={styles.priceDropSavings}>
        <div className={styles.savingsNumber}>97%</div>
        <div className={styles.savingsText}>
          less than Dataminr for the same daily intelligence coverage —
          plus LatAm specialization they don&apos;t offer at any price.
        </div>
      </div>
    </section>
  );
}
