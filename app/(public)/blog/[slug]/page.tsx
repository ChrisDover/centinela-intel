import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface BriefDevelopment {
  country: string;
  paragraphs: string[];
}

interface BriefData {
  date: string;
  bluf?: string;
  threatLevel: string;
  developments: BriefDevelopment[] | string[];
  countries: { name: string; summary: string }[];
  analystNote: string;
}

function normalizeDevelopments(
  raw: BriefDevelopment[] | string[] | string
): BriefDevelopment[] {
  let devs = raw;
  if (typeof devs === "string") {
    try {
      devs = JSON.parse(devs);
    } catch {
      return [{ country: "Regional", paragraphs: [devs as string] }];
    }
  }
  if (!Array.isArray(devs) || devs.length === 0) return [];
  if (typeof devs[0] === "object" && "country" in devs[0]) {
    return devs as BriefDevelopment[];
  }
  return (devs as string[]).map((d) => ({
    country: "Regional",
    paragraphs: [d],
  }));
}

function threatPips(level: string) {
  switch (level) {
    case "CRITICAL":
      return ["r", "r", "r", "r", "r"];
    case "HIGH":
      return ["r", "r", "r", "r", ""];
    case "ELEVATED":
      return ["r", "r", "r", "", ""];
    default:
      return ["r", "r", "", "", ""];
  }
}

function threatColorClass(level: string) {
  if (level === "CRITICAL" || level === "HIGH") return "high";
  if (level === "ELEVATED") return "elevated";
  return "moderate";
}

// Slug is "2026-02-17" -> search for "February 17, 2026" in subject
function slugToDateSearch(slug: string): string {
  const d = new Date(slug + "T12:00:00Z");
  if (isNaN(d.getTime())) return slug;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dateStr = slugToDateSearch(slug);
  return {
    title: `Centinela Brief — ${dateStr} | Centinela Intel`,
    description: `Latin America security intelligence brief for ${dateStr}. Threat assessment, key developments, and analyst assessment covering 22 countries.`,
    openGraph: {
      title: `Centinela Brief — ${dateStr}`,
      description: `Daily Latin America security intelligence for ${dateStr}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dateStr = slugToDateSearch(slug);

  const campaign = await prisma.emailCampaign.findFirst({
    where: {
      type: "brief",
      status: "sent",
      subject: { contains: dateStr },
      htmlContent: { not: null },
    },
    select: { id: true, htmlContent: true },
  });

  if (!campaign || !campaign.htmlContent) {
    notFound();
  }

  let brief: BriefData;
  try {
    brief = JSON.parse(campaign.htmlContent);
  } catch {
    notFound();
  }

  const developments = normalizeDevelopments(brief.developments);
  const pips = threatPips(brief.threatLevel);
  const analystParagraphs = brief.analystNote
    .split(/\n\n+/)
    .filter((p) => p.trim());

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
          background: rgba(77, 166, 255, 0.15);
          color: var(--info);
          border: 1px solid rgba(77, 166, 255, 0.3);
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
        .section p {
          color: var(--text-secondary);
          font-size: 0.925rem;
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .section p strong {
          color: var(--text-primary);
        }
        .bluf-section {
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.05), rgba(77, 166, 255, 0.03));
          border: 1px solid rgba(0, 212, 170, 0.15);
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .bluf-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-primary);
          font-weight: 500;
          margin: 0;
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
        .threat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .threat-label.high { color: var(--danger); }
        .threat-label.elevated { color: var(--warning); }
        .threat-label.moderate { color: var(--info); }
        .threat-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        .dev-country {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .dev-country:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }
        .dev-para {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.75;
          margin-bottom: 0.75rem;
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
        .country-block p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
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
          margin-bottom: 0.75rem;
        }
        .analyst-note p:last-child {
          margin-bottom: 0;
        }
        .divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }
        .brief-subscribe-cta {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 2rem;
        }
        .brief-subscribe-cta h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }
        .brief-subscribe-cta p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .brief-subscribe-form {
          display: flex;
          gap: 0.75rem;
          max-width: 440px;
          margin: 0 auto;
        }
        .brief-subscribe-form input[type="email"] {
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
        .brief-subscribe-form input[type="email"]:focus {
          border-color: var(--accent);
        }
        .brief-subscribe-form button {
          padding: 0.85rem 1.5rem;
          white-space: nowrap;
        }
        .blog-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .blog-nav a {
          font-size: 0.85rem;
          color: var(--accent);
          text-decoration: none;
        }
        .blog-nav a:hover {
          text-decoration: underline;
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
        @media (max-width: 600px) {
          .brief-subscribe-form {
            flex-direction: column;
          }
          .brief-subscribe-form button {
            width: 100%;
          }
          .masthead-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
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
            <span className="classification">
              Open Source &mdash; For Distribution
            </span>
          </div>
          <h1 className="masthead-title">Latin America Daily Security Brief</h1>
          <div className="masthead-meta">
            <span>{brief.date}</span>
            <span>centinelaintel.com</span>
          </div>
        </div>

        {/* THREAT LEVEL */}
        <div className="section">
          <div className="section-head">Regional Threat Assessment</div>
          <div className="threat-bar">
            <div>
              <div className="pips">
                {pips.map((p, i) => (
                  <div key={i} className={`pip ${p}`}></div>
                ))}
              </div>
              <div className="threat-sub">LatAm composite threat index</div>
            </div>
            <span
              className={`threat-label ${threatColorClass(brief.threatLevel)}`}
            >
              {brief.threatLevel}
            </span>
          </div>
        </div>

        {/* BLUF */}
        {brief.bluf && (
          <div className="section">
            <div className="section-head">Bottom Line Up Front</div>
            <div className="bluf-section">
              <p>{brief.bluf}</p>
            </div>
          </div>
        )}

        {/* KEY DEVELOPMENTS */}
        <div className="section">
          <div className="section-head">Key Developments</div>
          {developments.map((dev, i) => (
            <div key={i}>
              <div
                className="dev-country"
                style={
                  i === 0
                    ? { marginTop: 0, paddingTop: 0, borderTop: "none" }
                    : undefined
                }
              >
                {dev.country}
              </div>
              {dev.paragraphs.map((p, j) => (
                <p key={j} className="dev-para">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* COUNTRY WATCH */}
        <div className="section">
          <div className="section-head">Country Watch</div>
          {brief.countries.map((country, i) => (
            <div key={i} className="country-block">
              <div className="country-header">
                <span className="country-name">{country.name}</span>
              </div>
              <p>{country.summary}</p>
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* ANALYST ASSESSMENT */}
        <div className="section">
          <div className="section-head">Analyst Assessment</div>
          <div className="analyst-note">
            {analystParagraphs.map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
        </div>

        {/* SUBSCRIBE CTA */}
        <div className="brief-subscribe-cta">
          <h3>Get this brief every morning</h3>
          <p>
            Free daily Latin America security intelligence. Delivered at 0600.
          </p>
          <form
            className="brief-subscribe-form"
            action="/api/subscribe"
            method="POST"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn-primary">
              Subscribe Free
            </button>
          </form>
        </div>

        {/* NAV */}
        <div className="blog-nav">
          <a href="/blog">&larr; All Briefs</a>
          <a href="/contact">Request a Briefing</a>
        </div>

        {/* FOOTER */}
        <div className="brief-footer">
          <p>Centinela Intel &mdash; A service of Enfocado Capital LLC</p>
          <p>AI-accelerated OSINT collection. Human-verified analysis.</p>
        </div>
      </div>
    </>
  );
}
