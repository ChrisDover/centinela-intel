export function CTASection() {
  return (
    <section className="cta-section">
      <h2>Stop Overpaying for Intelligence</h2>
      <p>
        Your competitors pay $200K+/year for what you can start getting free today.
        Begin with the daily brief. Upgrade to Watch Pro when you need a live terminal.
        No contracts, no sales calls.
      </p>
      <div className="cta-buttons">
        <a
          href="/subscribe"
          className="btn-primary"
          style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
        >
          Get the Daily Brief — Free
        </a>
        <a
          href="/watch"
          className="btn-outline"
          style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
        >
          See Watch Pro — $199/mo
        </a>
      </div>
    </section>
  );
}
