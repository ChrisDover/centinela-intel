import styles from '../home.module.css';

export function DashboardPreview() {
  return (
    <section id="platform">
      <div className="section-label">// Watch Pro — $199/mo</div>
      <h2 className="section-title">The $20K/mo Intelligence Terminal. For $199.</h2>
      <p className="section-desc">
        Dataminr charges $20,000/mo for a platform like this. Watch Pro gives you the same
        live threat map, real-time feed, and flash alerts — built by operators who actually
        work in Latin America. Starting at $199/mo.
      </p>

      <div className={styles.dashboardPreview}>
        <div className={styles.dashToolbar}>
          <div className={styles.dashTabs}>
            <button className={`${styles.dashTab} ${styles.dashTabActive}`}>Overview</button>
            <button className={styles.dashTab}>Incidents</button>
            <button className={styles.dashTab}>Routes</button>
            <button className={styles.dashTab}>Reports</button>
          </div>
          <div className={styles.dashTime}>LIVE — Last updated 0547 CST</div>
        </div>
        <div className={styles.dashGrid}>
          <div className={styles.dashMetric}>
            <div className={styles.metricLabel}>Active Alerts</div>
            <div className={styles.metricValue} style={{ color: 'var(--danger)' }}>7</div>
            <div className={`${styles.metricChange} ${styles.metricUp}`}>&#x2191; 3 from yesterday</div>
          </div>
          <div className={styles.dashMetric}>
            <div className={styles.metricLabel}>Countries Monitored</div>
            <div className={styles.metricValue} style={{ color: 'var(--info)' }}>5</div>
            <div className={`${styles.metricChange} ${styles.metricNeutral}`}>MX CO EC GT HN</div>
          </div>
          <div className={styles.dashMetric}>
            <div className={styles.metricLabel}>Incidents (7d)</div>
            <div className={styles.metricValue} style={{ color: 'var(--warning)' }}>34</div>
            <div className={`${styles.metricChange} ${styles.metricUp}`}>&#x2191; 12% WoW</div>
          </div>
          <div className={styles.dashMetric}>
            <div className={styles.metricLabel}>Risk Score</div>
            <div className={styles.metricValue} style={{ color: 'var(--danger)' }}>7.2</div>
            <div className={`${styles.metricChange} ${styles.metricUp}`}>&#x2191; 0.4 from last week</div>
          </div>
        </div>
        <div className={styles.dashBody}>
          <div className={styles.dashMapArea}>
            <div className={styles.mapOutline}></div>
            <div className={`${styles.mapPing} ${styles.ping1}`}></div>
            <div className={`${styles.mapPing} ${styles.ping2}`}></div>
            <div className={`${styles.mapPing} ${styles.ping3}`}></div>
            <div className={`${styles.mapPing} ${styles.ping4}`}></div>
          </div>
          <div className={styles.dashFeed}>
            <div className={styles.feedTitle}>Live Intelligence Feed</div>
            <div className={styles.feedItem}>
              <div className={styles.feedTime}>0543 CST</div>
              <div className={styles.feedText}>
                Armed roadblock confirmed on HWY 15D near Compostela, Nayarit. Two vehicles seized.
              </div>
              <span className={`${styles.feedTag} ${styles.tagCritical}`}>CRITICAL</span>
            </div>
            <div className={styles.feedItem}>
              <div className={styles.feedTime}>0521 CST</div>
              <div className={styles.feedText}>
                Buenaventura port union confirms 48hr stoppage starting Wed. Pacific cargo ops affected.
              </div>
              <span className={`${styles.feedTag} ${styles.tagAdvisory}`}>ADVISORY</span>
            </div>
            <div className={styles.feedItem}>
              <div className={styles.feedTime}>0508 CST</div>
              <div className={styles.feedText}>
                Guatemala City — Increased PNC checkpoint activity zones 9-10 confirmed via local sources.
              </div>
              <span className={`${styles.feedTag} ${styles.tagAdvisory}`}>ADVISORY</span>
            </div>
            <div className={styles.feedItem}>
              <div className={styles.feedTime}>0445 CST</div>
              <div className={styles.feedText}>
                Medell&iacute;n — Protest activity near El Poblado subsided overnight. Normal operations resumed.
              </div>
              <span className={`${styles.feedTag} ${styles.tagInfo}`}>RESOLVED</span>
            </div>
            <div className={styles.feedItem}>
              <div className={styles.feedTime}>0412 CST</div>
              <div className={styles.feedText}>
                Mexico City — Presidential security detail movement observed near Los Pinos. Related to Wed summit.
              </div>
              <span className={`${styles.feedTag} ${styles.tagInfo}`}>MONITOR</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <a href="/watch" className="btn-primary" style={{ padding: '0.85rem 2.5rem' }}>
          See Watch Pro — $199/mo
        </a>
        <a href="/subscribe" className="btn-outline" style={{ padding: '0.85rem 2.5rem' }}>
          Start Free First
        </a>
      </div>
    </section>
  );
}
