"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/watch", label: "Watch Pro" },
  { href: "/secure-ai", label: "Secure AI" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/client/login", label: "Client Login" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span
          style={{
            display: "block",
            width: 20,
            height: 2,
            background: "var(--text-primary)",
            transition: "all 0.3s",
            transform: open ? "rotate(45deg) translate(4px, 4px)" : "none",
          }}
        />
        <span
          style={{
            display: "block",
            width: 20,
            height: 2,
            background: "var(--text-primary)",
            transition: "all 0.3s",
            opacity: open ? 0 : 1,
            marginTop: 5,
          }}
        />
        <span
          style={{
            display: "block",
            width: 20,
            height: 2,
            background: "var(--text-primary)",
            transition: "all 0.3s",
            transform: open ? "rotate(-45deg) translate(4px, -4px)" : "none",
            marginTop: open ? 0 : 5,
          }}
        />
      </button>

      {open && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`mobile-nav-drawer ${open ? "mobile-nav-open" : ""}`}>
        <div className="mobile-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/subscribe"
            className="btn-primary"
            onClick={() => setOpen(false)}
            style={{ textAlign: "center", marginTop: 8 }}
          >
            Get the Daily Brief
          </a>
        </div>
      </div>
    </>
  );
}
