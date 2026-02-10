"use client";

import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/insights", label: "Insights" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-centinela-border bg-centinela-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 text-centinela-text-primary no-underline"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-centinela-accent">
              <div className="h-2 w-2 rounded-full bg-centinela-accent shadow-[0_0_8px_rgba(0,212,170,0.3)]" />
            </div>
            <span className="font-display text-lg">
              Centinela
              <span className="ml-1 font-body text-xs text-centinela-text-muted">
                Admin
              </span>
            </span>
          </a>
          <nav className="flex gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 font-mono text-xs tracking-wider transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-centinela-accent/15 text-centinela-accent"
                    : "text-centinela-text-muted hover:text-centinela-text-secondary"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="font-mono text-xs text-centinela-text-muted transition-colors hover:text-centinela-accent"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="rounded-md border border-centinela-border px-3 py-1.5 font-mono text-xs text-centinela-text-muted transition-colors hover:border-centinela-danger hover:text-centinela-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
