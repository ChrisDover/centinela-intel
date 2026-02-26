import styles from '../home.module.css';

export function SecureAIPreview() {
  return (
    <section id="secure-ai-preview">
      <div className="section-label">// Private AI Infrastructure</div>
      <h2 className="section-title">Private AI That Costs $500K Elsewhere. From $2.5K/mo.</h2>
      <p className="section-desc">
        Every query to OpenAI or Anthropic trains their models — including your threat
        assessments and executive travel routes. Our local LLMs on our own GPU cluster
        means your data never leaves your environment.
      </p>

      <div className={styles.vaultTerminal}>
        <div className={styles.vaultTerminalHeader}>
          <span className={styles.vaultDot} style={{ background: '#ff5f57' }}></span>
          <span className={styles.vaultDot} style={{ background: '#febc2e' }}></span>
          <span className={styles.vaultDot} style={{ background: '#28c840' }}></span>
          <span className={styles.vaultTerminalTitle}>secure-ai-status — centinela-infrastructure</span>
        </div>
        <div className={styles.vaultTerminalBody}>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>MODEL .......................... Local LLM (Private)</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>GPU CLUSTER .................... Owned Infrastructure</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>OSINT Collection Engine ........ ACTIVE</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>NLP Analysis Pipeline ........... ACTIVE</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusBlue}`}></div>
            <span>Compliance ..................... SOC2 Certified</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>Third-Party API Exposure ........ NONE</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>Cost vs. Palantir/IBM ........... 1/10th</span>
          </div>
          <div className={styles.infraLine}>
            <div className={`status ${styles.statusGreen}`}></div>
            <span>Air-Gap Option .................. AVAILABLE</span>
          </div>
        </div>
      </div>

      <div className={styles.secureAiCta}>
        <p>
          Palantir charges $1M+/yr. IBM charges $500K+. We own the GPUs, so Secure AI starts at $2.5K/mo.
        </p>
        <a href="/secure-ai" className="btn-outline" style={{ marginRight: '1rem' }}>
          See How We Do It
        </a>
        <a href="/contact" className="btn-primary">
          Talk to Us
        </a>
      </div>
    </section>
  );
}
