export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid-bg" />
      <nav>
        <a href="/" className="nav-brand">
          <div className="nav-logo" />
          <div className="nav-name">
            Centinela<span>Intel</span>
          </div>
        </a>
        <div className="nav-links">
          <a href="/#services">Services</a>
          <a href="/#platform">Platform</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#about">About</a>
          <a href="/briefs/2026-02-10">Daily Brief</a>
          <a href="/contact" className="btn-primary">
            Request Briefing
          </a>
        </div>
      </nav>
      {children}
      <footer>
        <div className="footer-left">
          &copy; 2026 Centinela Intel —{" "}
          <span>A service of Enfocado Capital LLC</span>
        </div>
        <div className="footer-right">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </>
  );
}
