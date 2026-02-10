import type { Metadata } from 'next';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: "Centinela Intel — AI-Powered Security Risk Intelligence",
  description: "Threat intelligence and risk analysis for organizations operating in Latin America. AI-accelerated monitoring, human-verified assessments.",
};

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Live Intelligence Monitoring</div>
        <h1>Security Intelligence<br />for a <em>Volatile World</em></h1>
        <p className={styles.heroSub}>
          Threat intelligence and risk analysis for organizations operating in Latin America.
          AI-accelerated monitoring, human-verified assessments, delivered by security professionals
          with 25+ years on the ground.
        </p>
        <div className={styles.heroSubscribe}>
          <p className={styles.heroSubscribeLabel}>
            Free weekly LatAm intel brief — every Monday at 0600
          </p>
          <form className={styles.heroSubscribeForm} action="/api/subscribe" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary">Subscribe Free</button>
          </form>
          <p className={styles.heroSubscribeFine}>
            Your email is never shared or sold. <a href="/briefs/2026-02-10">Read this week&#39;s brief</a>
          </p>
        </div>
        <div className={styles.heroProof}>
          <div className={styles.proofItem}>
            <div className="number">25+</div>
            <div className="label">Years Experience</div>
          </div>
          <div className={styles.proofItem}>
            <div className="number">8+</div>
            <div className="label">Years In-Country LatAm</div>
          </div>
          <div className={styles.proofItem}>
            <div className="number">2,000+</div>
            <div className="label">Personnel Managed</div>
          </div>
          <div className={styles.proofItem}>
            <div className="number">24/7</div>
            <div className="label">AI Monitoring</div>
          </div>
        </div>
      </section>

      {/* ============ THREAT CONTEXT ============ */}
      <div className={styles.threatBanner}>
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

      {/* ============ WHAT YOU GET ============ */}
      <section id="services">
        <div className="section-label">// Deliverables</div>
        <h2 className="section-title">What You Get</h2>
        <p className="section-desc">
          Every Centinela engagement delivers actionable intelligence products designed for security
          directors, general counsels, and C-suite leaders — not raw data dumps.
        </p>

        <div className={styles.deliverablesGrid}>
          <div className={styles.deliverableCard}>
            <div className={styles.deliverableIcon}>&#x1F4E1;</div>
            <h3>Daily Intelligence Briefs</h3>
            <p>
              AI-synthesized morning reports covering threat developments, political shifts, criminal
              activity, and operational impacts across your areas of interest. Reviewed and annotated
              by senior analysts. Formatted for duty of care documentation and board-level reporting.
            </p>
            <span className={styles.deliverableTag}>Delivered 0600 Local</span>
          </div>
          <div className={styles.deliverableCard}>
            <div className={styles.deliverableIcon}>&#x1F5FA;&#xFE0F;</div>
            <h3>Travel Risk Assessments</h3>
            <p>
              Route-specific threat analysis for executive and principal travel. Covers ground
              transportation, lodging, meeting venues, and contingency recommendations based on
              real-time conditions. Insurance-ready documentation your risk team and carriers
              actually need.
            </p>
            <span className={styles.deliverableTag}>48hr Turnaround</span>
          </div>
          <div className={styles.deliverableCard}>
            <div className={styles.deliverableIcon}>&#x26A1;</div>
            <h3>Incident Alerts</h3>
            <p>
              Real-time notifications when events occur that affect your personnel, operations, or
              travel routes. AI-monitored OSINT across Spanish and Portuguese language sources,
              triaged by severity and proximity.
            </p>
            <span className={styles.deliverableTag}>Real-Time Push</span>
          </div>
          <div className={styles.deliverableCard}>
            <div className={styles.deliverableIcon}>&#x1F4CA;</div>
            <h3>Quarterly Threat Landscape</h3>
            <p>
              Deep-dive strategic analysis of evolving threats, political risk, cartel dynamics,
              regulatory changes, and security trend forecasts. Board-ready format designed for
              presentation to directors, general counsels, and C-suite leadership.
            </p>
            <span className={styles.deliverableTag}>Executive Format</span>
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
      <section id="dashboard">
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

      {/* ============ WHY CENTINELA ============ */}
      <section>
        <div className="section-label">// Why Centinela</div>
        <h2 className="section-title">Not Another Consulting Firm</h2>
        <p className="section-desc">
          We built Centinela because we&#39;ve lived the problem — overpriced firms that don&#39;t
          understand your operations, or cheap data feeds your team ignores. Security leaders deserve
          better.
        </p>

        <div className={styles.diffGrid}>
          <div className={styles.diffCard}>
            <h3>Built from the Inside</h3>
            <p>
              Our team has built and led corporate security programs from the ground up — advising
              boards of directors, working alongside general counsels and CEOs, managing enterprise
              risk for multinationals and HNW families across Latin America. We&#39;ve sat in the
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
            <h3>Your Data Stays Yours</h3>
            <p>
              Your intelligence never trains third-party models. No client data touches public AI
              systems. No operational details are shared, sold, or exposed. Available with
              locally-hosted AI processing and fully air-gapped environments for clients who require
              it.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECURE INFRASTRUCTURE ============ */}
      <section>
        <div className={styles.infraHighlight}>
          <div className={styles.infraText}>
            <h3>Hyper-Secure Intelligence Infrastructure</h3>
            <p>
              For corporate security teams, family offices, and defense contractors who require it —
              dedicated AI infrastructure that keeps your intelligence fully contained. No client
              data trains public models. No operational details leave your environment. Nothing to
              explain to your GC or your board.
            </p>
            <div className={styles.infraFeatures}>
              <div className={styles.infraFeat}>Air-gapped AI processing</div>
              <div className={styles.infraFeat}>Dedicated GPU compute</div>
              <div className={styles.infraFeat}>Zero third-party API exposure</div>
              <div className={styles.infraFeat}>Encrypted at rest &amp; in transit</div>
              <div className={styles.infraFeat}>SOC 2 aligned controls</div>
              <div className={styles.infraFeat}>Custom deployment options</div>
            </div>
          </div>
          <div className={styles.infraVisual}>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>OSINT Collection Engine ........ ACTIVE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>NLP Analysis Pipeline .......... ACTIVE</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusBlue}`}></div>
              <span>Threat Correlation Model ........ v3.2.1</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Local LLM Instance ............ RUNNING</span>
            </div>
            <div className={styles.infraLine}>
              <div className={`status ${styles.statusGreen}`}></div>
              <span>Encrypted Data Store .......... NOMINAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing">
        <div className="section-label">// Service Tiers</div>
        <h2 className="section-title">Intelligence Packages</h2>
        <p className="section-desc">
          Scalable coverage built around your operational footprint. From regional monitoring to a
          fully embedded intelligence capability.
        </p>

        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Essentials</div>
            <div className={styles.priceName}>Regional Watch</div>
            <div className={styles.priceAmount}>$497<span>/mo</span></div>
            <div className={styles.priceDesc}>
              Single country or region monitoring — the intelligence baseline every team needs.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Weekly intelligence brief — 1 country/region</li>
              <li>Monthly threat landscape summary</li>
              <li>Email-based incident alerts</li>
              <li>Dashboard access (read-only)</li>
              <li>Email analyst support</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaSecondary}`}>
              Get Started
            </a>
          </div>
          <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <div className={styles.priceTier}>Professional</div>
            <div className={styles.priceName}>Operations Intelligence</div>
            <div className={styles.priceAmount}>$5,000<span>/mo</span></div>
            <div className={styles.priceDesc}>
              Multi-country coverage with travel risk, real-time alerts, and duty of care support.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Daily intelligence briefs — up to 3 countries</li>
              <li>10 travel risk assessments / month</li>
              <li>Real-time incident alerts (push)</li>
              <li>Executive threat monitoring</li>
              <li>Full dashboard with custom views</li>
              <li>Monthly analyst strategy call</li>
              <li>Quarterly threat landscape report</li>
              <li>Duty of care documentation support</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaPrimary}`}>
              Request Briefing
            </a>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Enterprise</div>
            <div className={styles.priceName}>Dedicated Intelligence Cell</div>
            <div className={styles.priceAmount}>$10,000+<span>/mo</span></div>
            <div className={styles.priceDesc}>
              Your own intelligence team — dedicated analyst, board-ready reporting, secure
              infrastructure.
            </div>
            <ul className={styles.priceFeatures}>
              <li>Unlimited country coverage</li>
              <li>Unlimited travel risk assessments</li>
              <li>Dedicated senior analyst</li>
              <li>Executive &amp; family threat assessments</li>
              <li>Board-ready reporting &amp; presentations</li>
              <li>Air-gapped local AI processing</li>
              <li>Crisis response support</li>
              <li>Weekly strategy calls</li>
              <li>Custom integrations &amp; white-label</li>
            </ul>
            <a href="/contact" className={`${styles.priceCta} ${styles.priceCtaSecondary}`}>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* ============ CREDIBILITY ============ */}
      <section id="about">
        <div className="section-label">// Who We Are</div>
        <h2 className="section-title">We&#39;ve Done Your Job</h2>

        <div className={styles.credContent}>
          <div className={styles.credStats}>
            <div className={styles.credStat}>
              <div className="value">25+</div>
              <div className="label">Years in security, risk &amp; intelligence</div>
            </div>
            <div className={styles.credStat}>
              <div className="value">8+</div>
              <div className="label">Years living and operating in Latin America</div>
            </div>
            <div className={styles.credStat}>
              <div className="value">2,000+</div>
              <div className="label">Security personnel built, trained &amp; managed</div>
            </div>
          </div>
          <div className={styles.credText}>
            <p>
              Centinela Intel was founded by a <strong>U.S. Marine veteran</strong> who has spent
              over two decades at the intersection of{' '}
              <strong>
                corporate security, enterprise risk management, and emerging technology
              </strong>
              .
            </p>
            <p>
              We&#39;ve built full security departments from the ground up. We&#39;ve advised boards
              of directors, worked alongside general counsels, reported to CEOs. We&#39;ve managed
              executive protection programs, designed duty of care frameworks, and coordinated with
              insurance carriers on complex risk portfolios. We&#39;ve consulted for defense
              contractors and protected HNW families — all while living and operating across
              Colombia, Mexico, and Central America for nearly a decade.
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
