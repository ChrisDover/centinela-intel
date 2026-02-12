import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centinela Intel — Honduras Country Monitor — 12 Feb 2026",
  description:
    "Daily intelligence brief for Honduras: security threats, regional assessments, and operational guidance for corporate security teams.",
};

export default function HondurasBriefPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --bg: var(--bg-primary);
          --bg2: var(--bg-secondary);
          --bg3: var(--bg-card);
          --text: var(--text-primary);
          --text2: var(--text-secondary);
          --muted: var(--text-muted);
        }

        .brief-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 7rem 2rem 2rem;
        }

        .brief-masthead {
          border-bottom: 2px solid var(--accent);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .masthead-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .masthead-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-mark {
          width: 32px; height: 32px;
          border: 2px solid var(--accent);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
        }

        .brand-mark::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
        }

        .brand-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem;
        }

        .brand-name span {
          color: var(--text-muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          margin-left: 0.4rem;
        }

        .classification {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 0.25rem 0.6rem;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          background: rgba(255, 71, 87, 0.12);
          color: var(--danger);
          border: 1px solid rgba(255, 71, 87, 0.25);
        }

        .product-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          background: rgba(0, 212, 170, 0.12);
          color: var(--accent);
          border: 1px solid rgba(0, 212, 170, 0.25);
          margin-bottom: 0.75rem;
          display: inline-block;
        }

        .masthead-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.8rem;
          line-height: 1.2;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .masthead-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .section {
          margin-bottom: 2.5rem;
        }

        .section-head {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }

        .section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .section p {
          color: var(--text-secondary);
          font-size: 0.925rem;
          margin-bottom: 1rem;
        }

        .section p strong {
          color: var(--text-primary);
        }

        .threat-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .pips {
          display: flex;
          gap: 4px;
        }

        .pip {
          width: 32px; height: 8px;
          border-radius: 4px;
          background: var(--border);
        }

        .pip.r { background: var(--danger); }
        .pip.y { background: var(--warning); }
        .pip.g { background: var(--safe); }

        .threat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .threat-label.high { color: var(--danger); }
        .threat-label.elevated { color: var(--warning); }

        .threat-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .country-block {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .country-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .country-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .country-level {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .level-critical { background: rgba(255, 71, 87, 0.2); color: var(--danger); }
        .level-high { background: rgba(255, 71, 87, 0.15); color: var(--danger); }
        .level-elevated { background: rgba(255, 179, 71, 0.15); color: var(--warning); }
        .level-moderate { background: rgba(77, 166, 255, 0.15); color: var(--info); }

        .country-block p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }

        .action-item {
          background: rgba(0, 212, 170, 0.08);
          border-left: 3px solid var(--accent);
          padding: 0.75rem 1rem;
          margin-top: 0.75rem;
          border-radius: 0 6px 6px 0;
        }

        .action-item p {
          font-size: 0.825rem;
          color: var(--accent);
          margin: 0;
          font-weight: 500;
        }

        .action-item .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
          color: var(--text-muted);
        }

        .warning-item {
          background: rgba(255, 71, 87, 0.06);
          border-left: 3px solid var(--danger);
          padding: 0.75rem 1rem;
          margin-top: 0.75rem;
          border-radius: 0 6px 6px 0;
        }

        .warning-item p {
          font-size: 0.825rem;
          color: var(--danger);
          margin: 0;
          font-weight: 500;
        }

        .warning-item .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
          color: var(--text-muted);
        }

        .dev-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .dev-item:last-child { border-bottom: none; }

        .dev-sev {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          font-weight: 600;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .sev-crit { background: rgba(255, 71, 87, 0.15); color: var(--danger); }
        .sev-high { background: rgba(255, 71, 87, 0.15); color: var(--danger); }
        .sev-med { background: rgba(255, 179, 71, 0.15); color: var(--warning); }
        .sev-low { background: rgba(0, 212, 170, 0.15); color: var(--safe); }

        .dev-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .dev-text strong { color: var(--text-primary); }

        .analyst-note {
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.05), rgba(77, 166, 255, 0.03));
          border: 1px solid rgba(0, 212, 170, 0.15);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .analyst-note p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .stat-card .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-card .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-card .stat-trend {
          font-size: 0.7rem;
          margin-top: 0.25rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .stat-card .stat-trend.down { color: var(--accent); }
        .stat-card .stat-trend.up { color: var(--danger); }

        .risk-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .risk-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
        }

        .risk-card .risk-title {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .risk-card p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .brief-footer {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          margin-top: 3rem;
          text-align: center;
        }

        .brief-footer p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }

        .brief-cta-box {
          background: var(--bg-card);
          border: 1px solid var(--accent);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 2rem;
        }

        .brief-cta-box h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .brief-cta-box p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .brief-cta-box .price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 0.25rem;
        }

        .brief-cta-box .price-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        @media (max-width: 600px) {
          .masthead-meta { flex-direction: column; gap: 0.5rem; }
          .stat-grid { grid-template-columns: 1fr; }
          .risk-grid { grid-template-columns: 1fr; }
        }

        @media print {
          .brief-container { padding-top: 1rem; }
          .brief-cta-box { display: none; }
          body { background: white !important; color: black !important; }
          .brief-container * { color: #1a1a1a !important; }
          .section-head { color: #0a6b55 !important; }
          .threat-label { color: #cc0000 !important; }
          .action-item p { color: #0a6b55 !important; }
          .warning-item p { color: #cc0000 !important; }
        }
      `,
        }}
      />

      <div className="brief-container">
        {/* MASTHEAD */}
        <div className="brief-masthead">
          <div className="masthead-top">
            <div className="masthead-brand">
              <div className="brand-mark"></div>
              <div className="brand-name">
                Centinela<span>Intel</span>
              </div>
            </div>
            <span className="classification">Client Confidential</span>
          </div>
          <div className="product-badge">Country Monitor — Honduras</div>
          <h1 className="masthead-title">Honduras Daily Intelligence Brief</h1>
          <div className="masthead-meta">
            <span>12 February 2026</span>
            <span>Country Code: HN</span>
            <span>centinelaintel.com</span>
          </div>
        </div>

        {/* THREAT LEVEL */}
        <div className="section">
          <div className="section-head">National Threat Assessment</div>
          <div className="threat-bar">
            <div>
              <div className="pips">
                <div className="pip r"></div>
                <div className="pip r"></div>
                <div className="pip r"></div>
                <div className="pip r"></div>
                <div className="pip"></div>
              </div>
              <div className="threat-sub">Honduras composite threat index</div>
            </div>
            <span className="threat-label high">HIGH</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Honduras remains at HIGH threat level driven by converging political
            transition risks, sustained extortion campaigns against businesses,
            and evolving narco-trafficking dynamics. The January 2026
            inauguration of President Asfura introduces both stabilizing
            U.S. security cooperation and destabilizing political tensions. The
            ongoing state of emergency has reduced homicide rates but shifted
            criminal activity toward extortion, which rose 14% between
            2022-2024. U.S. State Department maintains Level 3 (Reconsider
            Travel) for the country overall, Level 4 (Do Not Travel) for Gracias
            a Dios.
          </p>
        </div>

        {/* KEY METRICS */}
        <div className="section">
          <div className="section-head">Key Indicators</div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">15.3</div>
              <div className="stat-label">Homicide Rate</div>
              <div className="stat-trend down">
                per 100k — down from 26.1 in 2024
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">+14%</div>
              <div className="stat-label">Extortion</div>
              <div className="stat-trend up">increase 2022-2024</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3.5%</div>
              <div className="stat-label">GDP Growth</div>
              <div className="stat-trend down">projected 2026</div>
            </div>
          </div>
        </div>

        {/* TOP DEVELOPMENTS */}
        <div className="section">
          <div className="section-head">Key Developments</div>

          <div className="dev-item">
            <span className="dev-sev sev-crit">CRIT</span>
            <div className="dev-text">
              <strong>
                Trump pardons convicted ex-President Hern&aacute;ndez — signals
                renewed impunity for organized crime.
              </strong>{" "}
              The February 2026 pardon of Juan Orlando Hern&aacute;ndez, convicted
              in a U.S. court of drug trafficking, has alarmed environmental and
              human rights defenders. The decision effectively signals that
              high-level narco-political figures can operate with reduced
              consequence, potentially emboldening criminal networks with
              historical ties to the former administration. Environmental
              defenders and journalists face heightened risk.
            </div>
          </div>

          <div className="dev-item">
            <span className="dev-sev sev-high">HIGH</span>
            <div className="dev-text">
              <strong>
                Asfura inaugurated amid fraud allegations and political
                polarization.
              </strong>{" "}
              President Nasry &ldquo;Tito&rdquo; Asfura took office in January
              2026 following a narrowly contested November 2025 election marred
              by fraud claims and U.S. interference. Trump&apos;s endorsement
              and threats to withhold aid influenced the outcome. The Libre Party
              (left) contests the result. Polarization between left and right
              factions risks protests and operational disruptions near government
              sites, particularly in Tegucigalpa and San Pedro Sula.
            </div>
          </div>

          <div className="dev-item">
            <span className="dev-sev sev-high">HIGH</span>
            <div className="dev-text">
              <strong>
                Bomb attack on National Party lawmaker highlights political
                violence risk.
              </strong>{" "}
              A January 8 bomb attack targeted a National Party legislator,
              indicating that political violence is escalating beyond street
              crime into targeted attacks on officials. This represents a
              qualitative shift in the threat environment — political
              infrastructure, offices, and events should be treated as potential
              soft targets.
            </div>
          </div>

          <div className="dev-item">
            <span className="dev-sev sev-high">HIGH</span>
            <div className="dev-text">
              <strong>
                State of emergency extended again — human rights abuses mounting.
              </strong>{" "}
              The state of emergency, in place since December 2022 and extended
              repeatedly, suspends constitutional rights across much of the
              country. Over 800 complaints of arbitrary detentions were filed by
              April 2025. Military policing has reduced homicides but shifted
              gang operations to extortion, cyber fraud, and rural drug
              trafficking — the threat has not been eliminated, only displaced.
            </div>
          </div>

          <div className="dev-item">
            <span className="dev-sev sev-med">MED</span>
            <div className="dev-text">
              <strong>
                Trump-Asfura security cooperation meeting — potential
                stabilization.
              </strong>{" "}
              A February 2026 meeting between Trump and Asfura emphasized
              enhanced security cooperation, potentially increasing U.S. support
              for anti-gang operations. While this could stabilize business
              environments medium-term, it also aligns Honduras more closely
              with U.S. geopolitical interests, which may trigger political
              backlash domestically.
            </div>
          </div>

          <div className="dev-item">
            <span className="dev-sev sev-med">MED</span>
            <div className="dev-text">
              <strong>
                Coca cultivation surging in eastern Honduras — reshaping rural
                threat landscape.
              </strong>{" "}
              Olancho department and the Mosquitia (Gracias a Dios) are seeing
              increased coca production, altering criminal dynamics in rural
              areas. Supply chains running through eastern Honduras face growing
              risk from narco-checkpoints, vehicle interdiction, and territorial
              enforcement by trafficking organizations.
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* THREATS TO FOREIGN BUSINESSES */}
        <div className="section">
          <div className="section-head">
            Threats to Foreign Companies &amp; Expat Personnel
          </div>

          <div className="risk-grid">
            <div className="risk-card">
              <div className="risk-title" style={{ color: "var(--danger)" }}>
                Extortion
              </div>
              <p>
                Rising 14% over two years. MS-13 and Barrio 18 demand
                &ldquo;war taxes&rdquo; from businesses. Non-payment triggers
                arson or targeted killings. Manufacturing, transport, and retail
                are primary targets. Some businesses pay multiple groups
                simultaneously.
              </p>
            </div>
            <div className="risk-card">
              <div className="risk-title" style={{ color: "var(--danger)" }}>
                Supply Chain Disruption
              </div>
              <p>
                Gang-controlled corridors between San Pedro Sula and
                Tegucigalpa. Rural roads in Olancho and the north coast
                vulnerable to hijacking and armed checkpoints. Narco-transit
                zones create unpredictable blockages.
              </p>
            </div>
            <div className="risk-card">
              <div className="risk-title" style={{ color: "var(--warning)" }}>
                Executive Safety
              </div>
              <p>
                High risk of kidnapping, robbery, and carjacking. U.S. Embassy
                alerts flag potential mass shooting threats in high-profile
                Tegucigalpa locations. Avoid public transport. Limit movement
                after dark. Private security recommended.
              </p>
            </div>
            <div className="risk-card">
              <div className="risk-title" style={{ color: "var(--warning)" }}>
                Political &amp; Regulatory
              </div>
              <p>
                Post-election polarization risks protests disrupting operations.
                Investor-state disputes (e.g., Pr&oacute;spera&apos;s $1.6B
                claim) highlight policy reversal risk. Tax exemptions for
                maquilas could shift under new administration priorities.
              </p>
            </div>
          </div>

          <div className="warning-item">
            <div className="label">Business Migration Trend</div>
            <p>
              Honduran businesses are migrating operations to El Salvador and
              Guatemala due to extortion pressure. Foreign firms should factor
              this into expansion and continuity planning.
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* REGIONAL ASSESSMENTS */}
        <div className="section">
          <div className="section-head">Regional Assessment by Department</div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">
                Cort&eacute;s (San Pedro Sula)
              </span>
              <span className="country-level level-high">HIGH</span>
            </div>
            <p>
              Primary manufacturing hub and maquila zone. Gang violence from
              MS-13 and Barrio 18 drives extortion targeting factories,
              transport companies, and retail. Homicide rate approximately 25-30
              per 100k (down 50% from 2021 peaks). A recent market fire
              destroyed 50+ businesses — arson as extortion enforcement remains a
              live threat. Transport routes disrupted by gang checkpoints.
            </p>
            <div className="action-item">
              <div className="label">Operational Guidance</div>
              <p>
                Manufacturing facilities require dedicated private security.
                Establish relationships with local law enforcement leadership.
                Vary transit routes for executive movement. Maintain insurance
                covering arson and extortion-related losses.
              </p>
            </div>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">
                Francisco Moraz&aacute;n (Tegucigalpa)
              </span>
              <span className="country-level level-high">HIGH</span>
            </div>
            <p>
              Capital and seat of government. Political violence, street crime,
              and kidnapping remain elevated. U.S. Embassy has issued alerts for
              potential mass shootings in high-profile areas. Homicide rate
              approximately 20-25 per 100k (down 44% from 2021). Corporate
              offices and executives are targeted for extortion. Post-election
              protests could escalate near government sites with minimal warning.
            </p>
            <div className="action-item">
              <div className="label">Operational Guidance</div>
              <p>
                Maintain low profile for corporate offices. Avoid predictable
                routines for executive movement. Monitor political calendar for
                protest triggers. Safe rooms and emergency protocols for offices
                near government buildings.
              </p>
            </div>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">
                Atl&aacute;ntida / Col&oacute;n (North Coast)
              </span>
              <span className="country-level level-elevated">ELEVATED</span>
            </div>
            <p>
              North coast port region including La Ceiba. Narco-trafficking and
              coca cultivation in remote areas with limited state presence.
              Homicide rate approximately 15-20 per 100k. Facilities near ports
              face smuggling-related threats. Environmental defender killings
              continue — projects with land-use components face elevated risk.
            </p>
            <div className="action-item">
              <div className="label">Operational Guidance</div>
              <p>
                Port-adjacent facilities need enhanced perimeter security. Avoid
                travel to remote hinterland without advance coordination.
                Environmental and infrastructure projects should conduct
                community engagement risk assessments.
              </p>
            </div>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">Gracias a Dios (Mosquitia)</span>
              <span className="country-level level-critical">CRITICAL</span>
            </div>
            <p>
              U.S. State Department Level 4 — Do Not Travel. Drug transit hub
              with virtually no law enforcement presence. Human trafficking,
              narco-airstrips, and armed trafficking organizations operate with
              impunity. Homicide rate exceeds 30 per 100k. The highest risk zone
              in Honduras for any foreign presence.
            </p>
            <div className="warning-item">
              <div className="label">Critical Warning</div>
              <p>
                No foreign operations or travel recommended under any
                circumstances. Kidnapping and robbery of foreign nationals is
                near-certain in remote areas.
              </p>
            </div>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">Olancho (Rural East)</span>
              <span className="country-level level-elevated">ELEVATED</span>
            </div>
            <p>
              Organized crime, cattle rustling, and intensifying land disputes.
              Coca production increasing as trafficking routes shift inland.
              Homicide rate approximately 15-20 per 100k. Supply chains through
              rural roads vulnerable to ambushes. Limited law enforcement
              response capability outside major towns.
            </p>
            <div className="action-item">
              <div className="label">Operational Guidance</div>
              <p>
                Discourage expat travel. Convoy protocols for supply chain
                vehicles. GPS tracking and check-in procedures for all personnel
                transiting the department.
              </p>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* ORGANIZED CRIME LANDSCAPE */}
        <div className="section">
          <div className="section-head">Organized Crime Landscape</div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">Maras (MS-13 &amp; Barrio 18)</span>
              <span className="country-level level-high">HIGH IMPACT</span>
            </div>
            <p>
              Approximately 25,000 combined members. MS-13 dominates drug
              trafficking while Barrio 18 specializes in extortion, often
              impersonating rival groups to expand collection. They control
              neighborhoods through &ldquo;war taxes&rdquo; on businesses —
              non-payment results in arson or targeted killings. Street violence
              includes muggings, carjackings, and sexual assaults, with
              foreigners targeted due to perceived wealth.
            </p>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">
                Narco-Trafficking Organizations
              </span>
              <span className="country-level level-high">HIGH IMPACT</span>
            </div>
            <p>
              Honduras is a major cocaine transit hub. Domestic groups like the
              Cachiros and Valle Valle collaborate with Mexican cartels
              (Sinaloa, Zetas). Coca cultivation is surging in eastern regions,
              fundamentally altering rural criminal dynamics. Mafia-style
              networks penetrate government institutions — the Hern&aacute;ndez
              pardon underscores ongoing narco-political collusion at the
              highest levels.
            </p>
          </div>

          <div className="country-block">
            <div className="country-header">
              <span className="country-name">Cyber &amp; Financial Crime</span>
              <span className="country-level level-elevated">EMERGING</span>
            </div>
            <p>
              Recent dismantlement of a phishing ring targeting businesses
              signals evolution of criminal tactics. As physical crime becomes
              harder under the state of emergency, expect criminal organizations
              to increasingly target corporate financial systems, wire
              transfers, and executive communications.
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* ANALYST ASSESSMENT */}
        <div className="section">
          <div className="section-head">Analyst Assessment</div>
          <div className="analyst-note">
            <p>
              Honduras in February 2026 presents a paradox: headline homicide
              statistics are improving, but the operational risk environment for
              foreign businesses is not improving at the same rate. The state of
              emergency has suppressed visible street violence but displaced
              criminal revenue-generation into extortion, cyber fraud, and
              deeper narco-trafficking — threats that disproportionately impact
              businesses with fixed facilities, predictable supply chains, and
              visible foreign personnel.
            </p>
            <p>
              <strong>Three dynamics to watch over the next 30 days:</strong>
            </p>
            <p>
              <strong>1. Post-election political stability.</strong> The Libre
              Party has not fully accepted the election result. Any triggering
              event — judicial ruling, policy announcement, or external
              diplomatic pressure — could mobilize protests in Tegucigalpa and
              San Pedro Sula. Businesses should have contingency plans for
              sudden transport disruptions and facility lockdowns.
            </p>
            <p>
              <strong>2. Hern&aacute;ndez pardon fallout.</strong> The pardon
              sends a signal to mid-level narco operators: the consequences are
              manageable. Expect emboldened trafficking operations and potential
              expansion of coca cultivation in eastern departments. This is a
              slow-burn risk that will materialize over months, not days.
            </p>
            <p>
              <strong>3. Extortion escalation against foreign targets.</strong>{" "}
              As domestic businesses migrate to El Salvador to escape extortion,
              foreign companies with fixed investments in Honduras become
              higher-value targets for criminal organizations. Companies that
              pay are marked for escalating demands. Companies that
              don&apos;t pay face operational disruption. Neither option is
              costless — but preparation, intelligence, and security
              partnerships significantly reduce exposure.
            </p>
            <p>
              The Asfura-Trump security cooperation alignment is the most
              positive signal in the current environment. If it materializes
              into sustained operational support (not just rhetoric), it could
              meaningfully improve the security landscape for foreign businesses
              within 6-12 months. Until then, elevated precautions are
              warranted.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="brief-cta-box">
          <h3>Get This Intelligence Daily</h3>
          <p>
            This is a sample of the Centinela Intel Country Monitor — delivered
            every morning with a live threat map, incident feed, and regional
            breakdown for your specific country of operations.
          </p>
          <div className="price">$497/mo</div>
          <div className="price-sub">Single country. Cancel anytime.</div>
          <a
            href="mailto:chris@centinelaintel.com?subject=Country%20Monitor%20—%20Honduras&body=I'd%20like%20to%20learn%20more%20about%20the%20Honduras%20Country%20Monitor."
            className="btn-primary"
            style={{
              display: "inline-block",
              padding: "0.85rem 2rem",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Request Access
          </a>
        </div>

        {/* FOOTER */}
        <div className="brief-footer">
          <p>
            <strong>Centinela Intel</strong> — AI-Powered Security Risk
            Intelligence
          </p>
          <p>A service of Enfocado Capital LLC</p>
          <p style={{ marginTop: "1rem" }}>
            This brief is generated using AI-synthesized OSINT analysis,
            reviewed and annotated by senior analysts with 25+ years of
            operational experience across Latin America. Sources include
            government advisories, local and Spanish-language media, ACLED
            conflict data, OSAC reports, and proprietary monitoring systems.
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            centinelaintel.com &middot; chris@centinelaintel.com
          </p>
        </div>
      </div>
    </>
  );
}
