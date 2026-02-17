import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog — Daily Latin America Intelligence Briefs | Centinela Intel",
  description:
    "Daily security intelligence covering all 22 Latin American countries. Free analysis from former operators with 25+ years of experience.",
};

export const dynamic = "force-dynamic";

interface BriefData {
  date: string;
  bluf?: string;
  threatLevel: string;
  developments: { country: string; paragraphs: string[] }[];
}

function threatBadgeClass(level: string) {
  if (level === "CRITICAL" || level === "HIGH") return "badge-high";
  if (level === "ELEVATED") return "badge-elevated";
  return "badge-moderate";
}

function dateToSlug(dateStr: string): string {
  // "February 17, 2026" -> "2026-02-17"
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return d.toISOString().split("T")[0];
}

export default async function BlogPage() {
  const campaigns = await prisma.emailCampaign.findMany({
    where: {
      type: "brief",
      status: "sent",
      htmlContent: { not: null },
    },
    orderBy: { sentAt: "desc" },
    take: 60,
    select: { id: true, subject: true, htmlContent: true, sentAt: true },
  });

  const briefs = campaigns
    .map((c) => {
      try {
        const data: BriefData = JSON.parse(c.htmlContent || "{}");
        return { id: c.id, data, sentAt: c.sentAt };
      } catch {
        return null;
      }
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-page {
          max-width: 780px;
          margin: 0 auto;
          padding: 7rem 2rem 4rem;
        }
        .blog-header {
          margin-bottom: 3rem;
        }
        .blog-header h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        .blog-header h1 em {
          font-style: italic;
          color: var(--accent);
        }
        .blog-header p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 600px;
        }
        .blog-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .blog-entry {
          display: block;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          margin-bottom: 0.75rem;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .blog-entry:hover {
          border-color: var(--accent);
          background: rgba(0, 212, 170, 0.03);
        }
        .blog-entry-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }
        .blog-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .blog-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          flex-shrink: 0;
        }
        .badge-high {
          background: rgba(255, 71, 87, 0.15);
          color: var(--danger);
          border: 1px solid rgba(255, 71, 87, 0.3);
        }
        .badge-elevated {
          background: rgba(255, 179, 71, 0.15);
          color: var(--warning);
          border: 1px solid rgba(255, 179, 71, 0.3);
        }
        .badge-moderate {
          background: rgba(77, 166, 255, 0.15);
          color: var(--info);
          border: 1px solid rgba(77, 166, 255, 0.3);
        }
        .blog-bluf {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }
        .blog-countries {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .blog-subscribe-cta {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 2rem;
        }
        .blog-subscribe-cta h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }
        .blog-subscribe-cta p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .blog-subscribe-form {
          display: flex;
          gap: 0.75rem;
          max-width: 440px;
          margin: 0 auto;
        }
        .blog-subscribe-form input[type="email"] {
          flex: 1;
          padding: 0.85rem 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-accent);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .blog-subscribe-form input[type="email"]:focus {
          border-color: var(--accent);
        }
        .blog-subscribe-form button {
          padding: 0.85rem 1.5rem;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .blog-subscribe-form {
            flex-direction: column;
          }
          .blog-subscribe-form button {
            width: 100%;
          }
        }
      `,
        }}
      />

      <div className="blog-page">
        <div className="blog-header">
          <div className="section-label">// Intelligence Archive</div>
          <h1>The Centinela <em>Brief</em></h1>
          <p>
            Daily security intelligence covering all 22 Latin American countries.
            AI-accelerated OSINT, human-verified analysis. Every brief is free to read.
          </p>
        </div>

        <div className="blog-list">
          {briefs.map((brief) => {
            const slug = dateToSlug(brief.data.date);
            const countries = Array.isArray(brief.data.developments)
              ? brief.data.developments
                  .filter((d): d is { country: string; paragraphs: string[] } => typeof d === "object" && "country" in d)
                  .map((d) => d.country)
                  .join(" / ")
              : "";

            return (
              <a key={brief.id} href={`/blog/${slug}`} className="blog-entry">
                <div className="blog-entry-top">
                  <span className="blog-date">{brief.data.date}</span>
                  <span className={`blog-badge ${threatBadgeClass(brief.data.threatLevel)}`}>
                    {brief.data.threatLevel}
                  </span>
                </div>
                {brief.data.bluf && (
                  <p className="blog-bluf">
                    {brief.data.bluf.length > 200
                      ? brief.data.bluf.substring(0, 200) + "..."
                      : brief.data.bluf}
                  </p>
                )}
                {countries && <p className="blog-countries">{countries}</p>}
              </a>
            );
          })}
        </div>

        {briefs.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem 0" }}>
            No briefs published yet. Check back tomorrow.
          </p>
        )}

        <div className="blog-subscribe-cta">
          <h3>Get this brief every morning</h3>
          <p>Free daily Latin America security intelligence. Delivered at 0600.</p>
          <form className="blog-subscribe-form" action="/api/subscribe" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary">Subscribe Free</button>
          </form>
        </div>
      </div>
    </>
  );
}
