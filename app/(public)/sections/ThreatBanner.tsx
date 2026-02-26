import styles from '../home.module.css';

export function ThreatBanner() {
  return (
    <div className={styles.threatBanner}>
      <div className="section-label" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        // What You&apos;d Pay Elsewhere
      </div>
      <div className={styles.threatInner}>
        <div className={styles.threatStat}>
          <div className="value">$240K+</div>
          <div className="desc">
            Dataminr Pulse — annual contract, enterprise sales cycle, no LatAm specialization
          </div>
        </div>
        <div className={styles.threatStat}>
          <div className="value">$50–250K</div>
          <div className="desc">
            Crisis24 / Seerist — annual commitment, global generalists, bolt-on AI
          </div>
        </div>
        <div className={styles.threatStat}>
          <div className="value">$29/mo</div>
          <div className="desc">
            Centinela Monitor — same daily intel, LatAm-specialized, Spanish OSINT depth, cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
}
