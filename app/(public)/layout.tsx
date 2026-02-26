import { MobileNav } from "./MobileNav";

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
            Centinela<span>AI</span>
          </div>
        </a>
        <div className="nav-links">
          <a href="/pricing">Pricing</a>
          <a href="/watch">Watch Pro</a>
          <a href="/secure-ai">Secure AI</a>
          <a href="/#about">About</a>
          <a href="/blog">Blog</a>
          <a href="/client/login">Client Login</a>
          <a href="/subscribe" className="btn-primary">
            Get the Daily Brief
          </a>
        </div>
        <MobileNav />
      </nav>
      {children}
      <footer>
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="nav-logo" style={{ width: 28, height: 28 }} />
              <span style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: "1.1rem" }}>
                Centinela<span style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.75rem", marginLeft: "0.4rem" }}>AI</span>
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              AI-First Intelligence Infrastructure
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.75rem" }}>
              &copy; 2026 Centinela AI — A service of Enfocado Capital LLC
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <p className="footer-col-title">Products</p>
              <a href="/subscribe">Free Brief</a>
              <a href="/pricing">Monitor</a>
              <a href="/watch">Watch Pro</a>
              <a href="/secure-ai">Secure AI</a>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Company</p>
              <a href="/#about">About</a>
              <a href="/blog">Blog</a>
              <a href="/contact">Contact</a>
              <a href="/client/login">Client Login</a>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Legal</p>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
