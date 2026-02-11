import type { Metadata } from 'next';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: "Centinela Intel — Security Intelligence for a Volatile World",
  description: "Threat intelligence and risk analysis for organizations operating in high-risk environments. AI-accelerated monitoring, human-verified assessments, delivered by security professionals with 25+ years of global security operations.",
};

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Live Intelligence Monitoring</div>
        <h1>Security Intelligence<br />for a <em>Volatile World</em></h1>
        <p className={styles.heroSub}>
          Threat intelligence and risk analysis for organizations operating in high-risk
          environments. AI-accelerated monitoring, human-verified assessments, delivered by
          security professionals with 25+ years of global security operations.
        </p>
        <div className={styles.heroSubscribe}>
          <p className={styles.heroSubscribeLabel}>
            Free daily threat briefing — delivered every morning at 0600
          </p>
          <form className={styles.heroSubscribeForm} action="/api/subscribe" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary">Subscribe Free</button>
          </form>
          <p className={styles.heroSubscribeFine}>
            Your email is never shared or sold.{' '}
            <a href="/briefs/2026-02-10">Read today&#39;s brief &rarr;</a>
          </p>
        </div>
        <div className={styles.heroProof}>
          <div className={styles.proofItem}>
            <div className="number">25+</div>
            <div className="label">Years Experience</div>
          </div>
          <div className={styles.proofItem}>
            <div className="number">3</div>
            <div className="label">Continents of Operations</div>
          </div>
          <div className={styles.proofItem}>
            <div className="number">24/7</div>
            <div className="label">AI Monitoring</div>
          </div>
        </div>
      </section>

      {/* ============ THE OPERATING ENVIRONMENT ============ */}
      <div className={styles.threatBanner}>
        <div className="section-label" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          // The Operating Environment
        </div>
        <div className={styles.threatInner}>
          <div className={styles.threatStat}>
            <div className="value">73%</div>
            <div className="desc">
              of multinational corporations report increased security incidents in Latin American
              operations since 2022
            </div>
          </div>
          <div className={styles.threatStat}>
            <div className="value">$4.2B</div>
            <div className="desc">
              estimated annual losses from corporate security incidents across the region
            </div>
          </div>
          <div className={styles.threatStat}>
            <div className="value">18 min</div>
            <div className="desc">
              average response time advantage with AI-powered early warning vs. traditional
              intelligence services
            </div>
          </div>
        </div>
      </div>

      {/* ============ THREE PRODUCT LINES ============ */}
      <section id="services">
        <div className="section-label">// Capabilities</div>
        <h2 className="section-title">Three Capabilities. One Partner.</h2>
        <p className="section-desc">
          Most security firms sell you reports or bodies. Centinela delivers intelligence,
          technology, and operations as an integrated platform — one partner, not five vendors.
        </p>

        <div className={styles.productGrid}>
          <div className={styles.productCard}>
            <div className={styles.productLabel}>Centinela Watch</div>
            <h3>Intelligence Services</h3>
            <p>
              AI-accelerated threat intelligence and risk analysis for your areas of operation.
              Daily briefs, travel risk assessments, incident alerts, and strategic reporting —
              reviewed by senior analysts before it reaches you.
            </p>
            <div className={styles.productFor}>
              For: Corporate security teams, risk managers, travel security, general counsels
            </div>
            <a href="#pricing" className={styles.productCta}>See Plans</a>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productLabel}>Centinela Vault</div>
            <h3>Secure Intelligence Platform</h3>
            <p>
              Secure, dedicated AI infrastructure that keeps your intelligence fully contained.
              We don&#39;t train public models with your data — or our own. No operational details
              leave your environment. Nothing to explain to your GC or your board.
            </p>
            <div className={styles.productFor}>
              For: Defense contractors, family offices, corporate security teams with data
              sovereignty requirements
            </div>
            <a href="#vault" className={styles.productCta}>Learn More</a>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productLabel}>Centinela Shield</div>
            <h3>Operational Security Services</h3>
            <p>
              Boots-on-the-ground security operations coordinated by professionals who have lived
              and operated across Latin America, the Middle East, and the United States. We
              don&#39;t just report threats — we respond to them.
            </p>
            <div className={styles.productFor}>
              For: Organizations deploying personnel in high-risk regions, executives traveling to
              threat environments
            </div>
            <a href="/contact" className={styles.productCta}>Request Consultation</a>
          </div>
        </div>
      </section>

      {/* ============ INTELLIGENCE DELIVERABLES ============ */}
      <section>
        <div className="section-label">// Deliverables</div>
        <h2 className="section-title">What You Get</h2>
        <p className="section-desc">
          Every Centinela engagement delivers actionable intelligence products designed for security
          directors, general counsels, and C-suite leaders — not raw data dumps.
        </p>

        <div className={styles.deliverablesGrid}>
          <div className={styles.deliverableCard}>
            <h3>Daily Intelligence Briefs</h3>
            <p>
              AI-synthesized morning reports covering threat developments, political shifts, criminal
              activity, and operational impacts across your areas of interest. Reviewed and annotated
              by senior analysts. Formatted for duty of care documentation and board-level reporting.
            </p>
          </div>
          <div className={styles.deliverableCard}>
            <h3>Travel Risk Assessments</h3>
            <p>
              Route-specific threat analysis for executive and principal travel. Covers ground
              transportation, lodging, meeting venues, and contingency recommendations based on
              real-time conditions. Insurance-ready documentation your risk team and carriers
              actually need.
            </p>
          </div>
          <div className={styles.deliverableCard}>
            <h3>Incident Alerts</h3>
            <p>
              Notifications when events occur that affect your personnel, operations, or travel
              routes. AI-monitored OSINT across Spanish and Portuguese language sources, triaged by
              severity and proximity.
            </p>
          </div>
          <div className={styles.deliverableCard}>
            <h3>Quarterly Threat Landscape</h3>
            <p>
              Deep-dive strategic analysis of evolving threats, political risk, cartel dynamics,
              regulatory changes, and security trend forecasts. Board-ready format designed for
              presentation to directors, general counsels, and C-suite leadership.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SAMPLE BRIEF ============ */}
      <section id="brief">
        <div className="section-label">// Sample Output</div>
        <h2 className="section-title">Daily Intelligence Brief</h2>
        <p className="section-desc">
          This is what lands in your inbox. Actionable, concise, analyst-verified. No filler, no
          headlines repackaged as intelligence.
        </p>

        <div className={styles.briefPreview}>
          <div className={styles.briefMockup}>
            <div className={styles.briefHeader}>
              <div className={styles.briefHeaderLeft}>
                <span className={`${styles.briefClass} ${styles.classConfidential}`}>
                  Confidential
                </span>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1rem' }}>
                  Centinela Intel
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

      {/* ============ DASHBOARD PREVIEW ============ */}
      <section id="platform">
        <div className="section-label">// Platform</div>
        <h2 className="section-title">Real-Time Threat Dashboard</h2>
        <p className="section-desc">
          Your dedicated intelligence portal. Live monitoring, historical analysis, and threat
          mapping — all in one secure interface.
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
              <div className={`${styles.metricChange} ${styles.metricUp}`}>
                &#x2191; 3 from yesterday
              </div>
            </div>
            <div className={styles.dashMetric}>
              <div className={styles.metricLabel}>Monitored Regions</div>
              <div className={styles.metricValue} style={{ color: 'var(--info)' }}>12</div>
              <div className={`${styles.metricChange} ${styles.metricNeutral}`}>— stable</div>
            </div>
            <div className={styles.dashMetric}>
              <div className={styles.metricLabel}>Incidents (7d)</div>
              <div className={styles.metricValue} style={{ color: 'var(--warning)' }}>34</div>
              <div className={`${styles.metricChange} ${styles.metricUp}`}>
                &#x2191; 12% WoW
              </div>
            </div>
            <div className={styles.dashMetric}>
              <div className={styles.metricLabel}>Risk Score</div>
              <div className={styles.metricValue} style={{ color: 'var(--danger)' }}>7.2</div>
              <div className={`${styles.metricChange} ${styles.metricUp}`}>
                &#x2191; 0.4 from last week
              </div>
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
                  Armed roadblock confirmed on HWY 15D near Compostela, Nayarit. Two vehicles
                  seized.
                </div>
                <span className={`${styles.feedTag} ${styles.tagCritical}`}>CRITICAL</span>
              </div>
              <div className={styles.feedItem}>
                <div className={styles.feedTime}>0521 CST</div>
                <div className={styles.feedText}>
                  Buenaventura port union confirms 48hr stoppage starting Wed. Pacific cargo ops
                  affected.
                </div>
                <span className={`${styles.feedTag} ${styles.tagAdvisory}`}>ADVISORY</span>
              </div>
              <div className={styles.feedItem}>
                <div className={styles.feedTime}>0508 CST</div>
                <div className={styles.feedText}>
                  Guatemala City — Increased PNC checkpoint activity zones 9-10 confirmed via local
                  sources.
                </div>
                <span className={`${styles.feedTag} ${styles.tagAdvisory}`}>ADVISORY</span>
              </div>
              <div className={styles.feedItem}>
                <div className={styles.feedTime}>0445 CST</div>
                <div className={styles.feedText}>
                  Medell&iacute;n — Protest activity near El Poblado subsided overnight. Normal
                  operations resumed.
                </div>
                <span className={`${styles.feedTag} ${styles.tagInfo}`}>RESOLVED</span>
              </div>
              <div className={styles.feedItem}>
                <div className={styles.feedTime}>0412 CST</div>
                <div className={styles.feedText}>
                  Mexico City — Presidential security detail movement observed near Los Pinos. Likely
                  related to Wed summit.
                </div>
                <span className={`${styles.feedTag} ${styles.tagInfo}`}>MONITOR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CENTINELA VAULT — DEEP DIVE ============ */}
      <section id="vault">
        <div className="section-label">// Secure Infrastructure</div>
        <h2 className="section-title">Centinela Vault: Your Intelligence Stays Yours</h2>
        <p className="section-desc">
          For organizations where data sovereignty isn&#39;t optional. Centinela Vault provides
          secure, dedicated AI infrastructure purpose-built for security intelligence. Your
          intelligence is fully contained.
        </p>

        <div className={styles.vaultTerminal}>
          <div className={styles.vaultTerminalHeader}>
            <span className={styles.vaultDot} style={{ background: 'var(--danger)' }}></span>
            <span className={styles.vaultDot} style={{ background: 'var(--warning)' }}></span>
            <span className={styles.vaultDot} style={{ background: 'var(--safe)' }}></span>
            <span className={styles.vaultTerminalTitle}>vault-status — centinela-secure</span>
          </div>
          <div className={styles.vaultTerminalBody}>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>VAULT STATUS ..................... ACTIVE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>OSINT Collection Engine ......... ACTIVE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>NLP Analysis Pipeline ........... ACTIVE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusBlue}`}></div>
              <span>Threat Correlation Model ........ v3.2.1</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Local LLM Instance .............. RUNNING</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Encrypted Data Store ............ NOMINAL</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Third-Party API Exposure ........ NONE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Client Data Leakage ............. ZERO</span>
            </div>
          </div>
        </div>

        <div className={styles.vaultTiers}>
          <div className={styles.vaultTierCard}>
            <div className={styles.vaultTierLabel}>Vault — Managed Secure</div>
            <h3>Your intelligence, our infrastructure, zero exposure.</h3>
            <ul className={styles.vaultFeatures}>
              <li>Dedicated secure environment for your organization&#39;s intelligence</li>
              <li>All Centinela intelligence products delivered through encrypted private instance</li>
              <li>No client data touches public AI models — ever</li>
              <li>Zero third-party API exposure</li>
              <li>Encrypted at rest and in transit</li>
              <li>SOC 2 aligned controls</li>
              <li>Custom threat models trained on your operational profile</li>
              <li>Secure client portal with role-based access</li>
              <li>Available as add-on to any Watch plan or standalone</li>
            </ul>
          </div>
          <div className={styles.vaultTierCard}>
            <div className={styles.vaultTierLabel}>Vault — Dedicated Infrastructure</div>
            <h3>Full air-gap. Full sovereignty. Your environment, your rules.</h3>
            <ul className={styles.vaultFeatures}>
              <li>Everything in Managed Secure</li>
              <li>Air-gapped AI processing on dedicated GPU compute</li>
              <li>Custom deployment — private cloud or on-premise</li>
              <li>Full data sovereignty — nothing leaves your environment</li>
              <li>Custom model training on client operational data</li>
              <li>API integrations with client security systems (GSOC platforms, travel management)</li>
              <li>Dedicated security engineer for platform management</li>
              <li>Incident response automation and playbook integration</li>
            </ul>
          </div>
        </div>
        <p className={styles.vaultNote}>
          Vault pricing is scoped to your infrastructure requirements.{' '}
          <a href="/contact">Contact us to discuss your environment.</a>
        </p>
      </section>

      {/* ============ CENTINELA SHIELD ============ */}
      <section id="shield">
        <div className="section-label">// Operations</div>
        <h2 className="section-title">Centinela Shield: When Intelligence Isn&#39;t Enough</h2>
        <p className="section-desc">
          Threat reports don&#39;t stop bullets. When your people are on the ground, you need a
          partner who has operated in these environments — not one who has read about them.
        </p>

        <div className={styles.shieldGrid}>
          <div className={styles.shieldCard}>
            <h4>Security Program Design</h4>
            <p>
              Build or audit your security program from the ground up. Policies, protocols,
              personnel, and technology aligned to your threat environment.
            </p>
          </div>
          <div className={styles.shieldCard}>
            <h4>Executive Protection</h4>
            <p>
              Close protection for executives, board members, and principals operating in or
              traveling to high-risk regions. Bilingual, culturally fluent operators.
            </p>
          </div>
          <div className={styles.shieldCard}>
            <h4>Secure Transportation &amp; Logistics</h4>
            <p>
              Vetted vehicles, drivers, and routes. Advance work and real-time route monitoring
              for ground movement in threat environments.
            </p>
          </div>
          <div className={styles.shieldCard}>
            <h4>Crisis Management &amp; Extraction</h4>
            <p>
              When things go wrong. Pre-planned extraction protocols, emergency coordination, and
              crisis communication for personnel in hostile or deteriorating environments.
            </p>
          </div>
          <div className={styles.shieldCard}>
            <h4>Physical Security Assessments</h4>
            <p>
              Facility and project site security evaluations. Threat-informed recommendations for
              access control, surveillance, personnel security, and hardening.
            </p>
          </div>
          <div className={styles.shieldCard}>
            <h4>Regulatory &amp; Political Risk Intelligence</h4>
            <p>
              Who&#39;s who in local government, where cartel-state dynamics affect operations, and
              what your team needs to know before deploying.
            </p>
          </div>
        </div>

        <div className={styles.shieldExtended}>
          <div className={styles.shieldExtendedLabel}>Extended Capabilities — Through Vetted Partners</div>
          <div className={styles.shieldExtendedGrid}>
            <div className={styles.shieldExtendedCard}>
              <h4>Kidnap &amp; Ransom Consulting</h4>
              <p>
                Crisis response advisory and coordination with K&amp;R specialists and insurance
                carriers.
              </p>
            </div>
            <div className={styles.shieldExtendedCard}>
              <h4>Technical Surveillance Countermeasures (TSCM)</h4>
              <p>
                Electronic sweep and counter-surveillance for sensitive meetings, executive travel,
                and facility security.
              </p>
            </div>
          </div>
        </div>

        <p className={styles.shieldNote}>
          Every Shield engagement is custom-scoped to your operational footprint and threat
          environment.{' '}
          <a href="/contact">Contact us to discuss your requirements.</a>
        </p>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing">
        <div className="section-label">// Pricing</div>
        <h2 className="section-title">Start With Intelligence. Scale When You&#39;re Ready.</h2>
        <p className="section-desc">
          Centinela Watch is your entry point — real-time threat monitoring for a single country,
          delivered daily. When you need more, we build around you.
        </p>

        <div className={styles.pricingGrid}>
          <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <div className={styles.priceTier}>Centinela Watch</div>
            <div className={styles.priceName}>Country Monitor</div>
            <div className={styles.priceAmount}>$497<span>/mo</span></div>
            <div className={styles.priceDesc}>
              Threat monitoring for a single country — the intelligence baseline every security
              team needs.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Daily intelligence brief — 1 country</li>
              <li>Incident alerts via email</li>
              <li>Read-only dashboard access</li>
              <li>Monthly threat landscape summary</li>
              <li>Email analyst support</li>
              <li>Additional countries available</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaPrimary}`}>
              Get Started
            </a>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Centinela Watch — Professional</div>
            <div className={styles.priceName}>Multi-Country &amp; Custom Intelligence</div>
            <div className={styles.priceAmount}>Contact Us</div>
            <div className={styles.priceDesc}>
              Multi-country coverage, travel risk assessments, executive monitoring, and duty of
              care support — scoped to your operational footprint.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Multi-country daily intelligence briefs</li>
              <li>Travel risk assessments</li>
              <li>Real-time incident alerts (push)</li>
              <li>Executive threat monitoring</li>
              <li>Full dashboard with custom views</li>
              <li>Analyst strategy calls</li>
              <li>Quarterly threat landscape reports</li>
              <li>Duty of care documentation support</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaSecondary}`}>
              Request Briefing
            </a>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Centinela Vault</div>
            <div className={styles.priceName}>Secure Platform</div>
            <div className={styles.priceAmount}>Contact Us</div>
            <div className={styles.priceDesc}>
              Secure, dedicated AI infrastructure for organizations that require data sovereignty
              and zero third-party exposure.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Managed Secure and Dedicated Infrastructure options</li>
              <li>Air-gapped AI processing available</li>
              <li>SOC 2 aligned controls</li>
              <li>Custom deployment options</li>
              <li>Add to any Watch plan or standalone</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaSecondary}`}>
              Contact Us
            </a>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Centinela Shield</div>
            <div className={styles.priceName}>Operational Security</div>
            <div className={styles.priceAmount}>Custom</div>
            <div className={styles.priceDesc}>
              Operational security services for organizations deploying personnel in high-risk
              regions.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Executive protection</li>
              <li>Secure transportation &amp; logistics</li>
              <li>Crisis management &amp; extraction</li>
              <li>Physical security assessments</li>
              <li>Security program consulting</li>
              <li>K&amp;R and TSCM through vetted partners</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaSecondary}`}>
              Request Consultation
            </a>
          </div>
        </div>
      </section>

      {/* ============ WHY CENTINELA ============ */}
      <section>
        <div className="section-label">// Why Centinela</div>
        <h2 className="section-title">Not Another Consulting Firm</h2>

        <div className={styles.diffGrid}>
          <div className={styles.diffCard}>
            <h3>Built from the Inside</h3>
            <p>
              Our team has built and led corporate security programs from the ground up — advising
              boards of directors, working alongside general counsels, reporting to CEOs. We&#39;ve
              managed executive protection programs, designed duty of care frameworks, and
              coordinated with insurance carriers on complex risk portfolios. We&#39;ve sat in the
              rooms where security decisions get made, and we built Centinela to fill the
              intelligence gap we saw firsthand.
            </p>
          </div>
          <div className={styles.diffCard}>
            <h3>AI-Accelerated, Human-Verified</h3>
            <p>
              Our AI monitors thousands of OSINT sources 24/7 across Spanish, Portuguese, and
              English. Every brief and alert is reviewed by a senior analyst before it reaches you.
              Machine speed, operator judgment — no AI hallucinations in your threat feed.
            </p>
          </div>
          <div className={styles.diffCard}>
            <h3>Intelligence + Operations Under One Roof</h3>
            <p>
              Most firms sell you reports. Others sell you bodies. We do both — and the intelligence
              informs the operations. When your travel risk assessment flags a deteriorating
              corridor, the same team that wrote the report can reroute your executive&#39;s ground
              transportation. One partner. One relationship. Full spectrum.
            </p>
          </div>
          <div className={styles.diffCard}>
            <h3>Your Data Stays Yours</h3>
            <p>
              Your intelligence never trains public models. No client data touches third-party AI
              systems. No operational details are shared, sold, or exposed. We don&#39;t train
              public models with your data — or our own. Available with dedicated AI infrastructure
              and fully air-gapped environments for clients who require it.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT / FOUNDER ============ */}
      <section id="about">
        <div className="section-label">// Who We Are</div>
        <h2 className="section-title">We&#39;ve Done Your Job</h2>

        <div className={styles.credContent}>
          <div className={styles.credStats}>
            <div className={styles.credStat}>
              <div className="value">25+</div>
              <div className="label">Years in global security operations</div>
            </div>
            <div className={styles.credStat}>
              <div className="value">3</div>
              <div className="label">Continents of operations</div>
            </div>
          </div>
          <div className={styles.credText}>
            <p>
              Centinela Intel was founded by a <strong>U.S. Marine veteran and former
              Department of State security professional</strong> who has spent over two decades at
              the intersection of{' '}
              <strong>
                diplomatic security, corporate risk management, and emerging technology
              </strong>
              .
            </p>
            <p>
              We&#39;ve provided security for heads of state and diplomatic missions. We&#39;ve
              built full security departments from the ground up — advising boards of directors,
              working alongside general counsels, reporting to CEOs. We&#39;ve managed executive
              protection programs, designed duty of care frameworks, and coordinated with insurance
              carriers on complex risk portfolios. We&#39;ve consulted for defense contractors and
              protected HNW families — living and operating across Latin America, the Middle East,
              and the United States throughout our career.
            </p>
            <p>
              That&#39;s why Centinela exists. We know exactly what intelligence your security team
              needs, because <strong>we&#39;ve been your security team</strong>. We built our
              AI-powered platform to deliver the kind of intelligence we always wanted but could
              never get — at machine speed, with operator judgment, at a price point that doesn&#39;t
              require board approval.
            </p>
            <p>
              Centinela Intel is a service of <strong>Enfocado Capital LLC</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <h2>See What You&#39;re Missing</h2>
        <p>
          Request a complimentary briefing for your region of interest. No obligation, no sales
          pitch — just intelligence.
        </p>
        <div className="cta-buttons">
          <a
            href="/contact"
            className="btn-primary"
            style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
          >
            Request a Briefing
          </a>
          <a
            href="/briefs/2026-02-10"
            className="btn-outline"
            style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
          >
            View Sample Report
          </a>
        </div>
      </section>
    </>
  );
}
