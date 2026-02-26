import styles from '../home.module.css';

export function SampleBrief() {
  return (
    <section id="brief">
      <div className="section-label">// What Lands in Your Inbox</div>
      <h2 className="section-title">This Is the $20K/mo Brief. It&apos;s Free.</h2>
      <p className="section-desc">
        The same caliber of intelligence that Dataminr and Crisis24 clients pay
        five and six figures for. Actionable, concise, analyst-verified.
        No filler, no headlines repackaged as intelligence.
      </p>

      <div className={styles.briefPreview}>
        <div className={styles.briefMockup}>
          <div className={styles.briefHeader}>
            <div className={styles.briefHeaderLeft}>
              <span className={`${styles.briefClass} ${styles.classConfidential}`}>
                Confidential
              </span>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1rem' }}>
                Centinela AI
              </span>
            </div>
            <div className={styles.briefDate}>09 FEB 2026 — 0600 CST</div>
          </div>
          <div className={styles.briefBody}>
            <div className={styles.briefTitleLine}>
              Mexico &amp; Northern Triangle — Daily Situation Report
            </div>
            <div className={styles.briefSubtitle}>
              PREPARED FOR: [CLIENT] // ANALYST: C. MARTINEZ // PERIOD: 08-09 FEB 2026
            </div>

            <div className={styles.briefSection}>
              <div className={styles.briefSectionTitle}>Regional Threat Level</div>
              <div className={styles.threatLevelBar}>
                <div className={styles.threatLevelIndicator}>
                  <div className={`${styles.threatPip} ${styles.threatPipDanger}`}></div>
                  <div className={`${styles.threatPip} ${styles.threatPipDanger}`}></div>
                  <div className={`${styles.threatPip} ${styles.threatPipDanger}`}></div>
                  <div className={`${styles.threatPip} ${styles.threatPipWarning}`}></div>
                  <div className={styles.threatPip}></div>
                </div>
                <span className={`${styles.threatLevelLabel} ${styles.threatLabelHigh}`}>
                  ELEVATED — Trending Higher
                </span>
              </div>
            </div>

            <div className={styles.briefSection}>
              <div className={styles.briefSectionTitle}>Key Developments</div>
              <ul className={styles.incidentList}>
                <li>
                  <span className={`${styles.incidentSeverity} ${styles.sevHigh}`}>HIGH</span>
                  <span>
                    Jalisco — Armed roadblock reported on Highway 15D between Guadalajara and
                    Tepic. Two commercial vehicles seized. CJNG-attributed activity.{' '}
                    <strong>Impact: Avoid GDL-Tepic corridor until further notice.</strong>
                    {' '}<em style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>
                      [Flagged 47 min before Dataminr via WhatsApp OSINT]
                    </em>
                  </span>
                </li>
                <li>
                  <span className={`${styles.incidentSeverity} ${styles.sevMed}`}>MED</span>
                  <span>
                    Guatemala City — National Police announced heightened checkpoint activity in
                    zones 9 and 10 following diplomatic summit. Expect 15-30 min delays on
                    Roosevelt Ave corridor through Friday.
                  </span>
                </li>
                <li>
                  <span className={`${styles.incidentSeverity} ${styles.sevMed}`}>MED</span>
                  <span>
                    Colombia — Port workers union in Buenaventura announced 48-hour work stoppage
                    beginning Wednesday. Cargo delays expected for Pacific coast operations.
                  </span>
                </li>
                <li>
                  <span className={`${styles.incidentSeverity} ${styles.sevLow}`}>LOW</span>
                  <span>
                    Honduras — San Pedro Sula international airport runway maintenance on track for
                    completion. No further delays expected beyond published NOTAM schedule.
                  </span>
                </li>
              </ul>
            </div>

            <div className={styles.briefSection}>
              <div className={styles.briefSectionTitle}>Analyst Assessment</div>
              <p>
                The GDL-Tepic corridor disruption follows a pattern of CJNG territorial
                enforcement actions observed over the past 72 hours. We assess this is linked to
                an ongoing internal dispute within the organization&#39;s Nayarit plaza structure.
                Recommend all client personnel avoid ground transit on this route for a minimum
                96-hour period. Air alternatives via Volaris/VivaAerobus GDL-TIJ remain
                unaffected. Full route analysis available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
