import styles from '../home.module.css';

const CAPABILITIES = [
  'LatAm Focus (20+ years)',
  'Spanish-Language OSINT Depth',
  'Owned GPU Infrastructure',
  'Private AI for Client Data',
  'Physical + Digital Convergence',
  'Self-Serve from $29/mo',
  'Operator-Built Credibility',
];

const COMPETITORS: Record<string, Record<string, { text: string; type: 'yes' | 'no' | 'partial' }>> = {
  Dataminr: {
    'LatAm Focus (20+ years)': { text: 'NO', type: 'no' },
    'Spanish-Language OSINT Depth': { text: 'NO', type: 'no' },
    'Owned GPU Infrastructure': { text: 'NO', type: 'no' },
    'Private AI for Client Data': { text: 'NO', type: 'no' },
    'Physical + Digital Convergence': { text: 'NO', type: 'no' },
    'Self-Serve from $29/mo': { text: '$20K+/mo', type: 'no' },
    'Operator-Built Credibility': { text: 'NO', type: 'no' },
  },
  Crisis24: {
    'LatAm Focus (20+ years)': { text: 'PARTIAL', type: 'partial' },
    'Spanish-Language OSINT Depth': { text: 'LIMITED', type: 'partial' },
    'Owned GPU Infrastructure': { text: 'NO', type: 'no' },
    'Private AI for Client Data': { text: 'NO', type: 'no' },
    'Physical + Digital Convergence': { text: 'PARTIAL', type: 'partial' },
    'Self-Serve from $29/mo': { text: '$50K+/yr', type: 'no' },
    'Operator-Built Credibility': { text: 'NO', type: 'no' },
  },
  Seerist: {
    'LatAm Focus (20+ years)': { text: 'NO', type: 'no' },
    'Spanish-Language OSINT Depth': { text: 'NO', type: 'no' },
    'Owned GPU Infrastructure': { text: 'NO', type: 'no' },
    'Private AI for Client Data': { text: 'NO', type: 'no' },
    'Physical + Digital Convergence': { text: 'PARTIAL', type: 'partial' },
    'Self-Serve from $29/mo': { text: '$60K+/yr', type: 'no' },
    'Operator-Built Credibility': { text: 'NO', type: 'no' },
  },
  Centinela: {
    'LatAm Focus (20+ years)': { text: 'YES', type: 'yes' },
    'Spanish-Language OSINT Depth': { text: 'YES', type: 'yes' },
    'Owned GPU Infrastructure': { text: 'YES', type: 'yes' },
    'Private AI for Client Data': { text: 'YES', type: 'yes' },
    'Physical + Digital Convergence': { text: 'YES', type: 'yes' },
    'Self-Serve from $29/mo': { text: 'YES', type: 'yes' },
    'Operator-Built Credibility': { text: '25yr operator', type: 'yes' },
  },
};

const COMPETITOR_NAMES = ['Dataminr', 'Crisis24', 'Seerist', 'Centinela'];

export function CompetitivePositioning() {
  return (
    <section>
      <div className="section-label">// Why Switch to Centinela</div>
      <h2 className="section-title">Same Intelligence. 1/10th the Price.</h2>
      <p className="section-desc">
        Dataminr, Crisis24, and Seerist charge $50K–$250K/year for capabilities
        Centinela delivers from $29/mo. And none of them specialize in LatAm.
      </p>

      <div style={{
        overflowX: 'auto',
        marginTop: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
          minWidth: '700px',
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '1rem 1.25rem',
                textAlign: 'left',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Capability
              </th>
              {COMPETITOR_NAMES.map((name) => (
                <th key={name} style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'center',
                  background: name === 'Centinela' ? 'var(--accent-dim)' : 'var(--bg-card)',
                  borderBottom: '1px solid var(--border)',
                  color: name === 'Centinela' ? 'var(--accent)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}>
                  {name === 'Centinela' ? 'CENTINELA' : name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAPABILITIES.map((cap, i) => (
              <tr key={cap}>
                <td style={{
                  padding: '0.85rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  background: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                }}>
                  {cap}
                </td>
                {COMPETITOR_NAMES.map((name) => {
                  const cell = COMPETITORS[name][cap];
                  const bgColor = cell.type === 'yes'
                    ? name === 'Centinela' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.08)'
                    : cell.type === 'partial'
                    ? 'rgba(245, 166, 35, 0.08)'
                    : i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)';
                  const textColor = cell.type === 'yes'
                    ? 'var(--accent)'
                    : cell.type === 'partial'
                    ? 'var(--accent-orange)'
                    : 'var(--danger)';
                  return (
                    <td key={name} style={{
                      padding: '0.85rem 1.25rem',
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border)',
                      background: bgColor,
                      color: textColor,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                    }}>
                      {cell.text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
