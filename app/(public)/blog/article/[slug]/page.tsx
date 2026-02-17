import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, htmlContent: true, publishedAt: true },
  });

  if (!post) return { title: "Article Not Found | Centinela Intel" };

  const plainText = post.htmlContent.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const description = plainText.length > 160 ? plainText.substring(0, 160) + "..." : plainText;

  return {
    title: `${post.title} | Centinela Intel`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: ["Chris Dover"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) notFound();

  const dateStr = post.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .article-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 7rem 2rem 2rem;
        }
        .article-masthead {
          border-bottom: 2px solid var(--accent);
          padding-bottom: 1.5rem;
          margin-bottom: 2.5rem;
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
        .article-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 0.25rem 0.6rem;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          background: rgba(0, 212, 170, 0.12);
          color: var(--accent);
          border: 1px solid rgba(0, 212, 170, 0.3);
        }
        .article-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          line-height: 1.25;
          margin-bottom: 1rem;
          font-weight: 400;
        }
        .article-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .article-body {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-secondary);
        }
        .article-body p {
          margin-bottom: 1.5rem;
        }
        .article-body h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--text-primary);
          margin: 2.5rem 0 1rem;
          line-height: 1.3;
        }
        .article-body h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 2rem 0 0.75rem;
          line-height: 1.4;
        }
        .article-body strong {
          color: var(--text-primary);
        }
        .article-body em {
          color: var(--text-secondary);
        }
        .article-body blockquote {
          border-left: 3px solid var(--accent);
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background: rgba(0, 212, 170, 0.03);
          border-radius: 0 8px 8px 0;
          font-style: italic;
        }
        .article-body a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        .article-subscribe-cta {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-top: 3rem;
        }
        .article-subscribe-cta h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }
        .article-subscribe-cta p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .article-subscribe-form {
          display: flex;
          gap: 0.75rem;
          max-width: 440px;
          margin: 0 auto;
        }
        .article-subscribe-form input[type="email"] {
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
        .article-subscribe-form input[type="email"]:focus {
          border-color: var(--accent);
        }
        .article-subscribe-form button {
          padding: 0.85rem 1.5rem;
          white-space: nowrap;
        }
        .article-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .article-nav a {
          font-size: 0.85rem;
          color: var(--accent);
          text-decoration: none;
        }
        .article-nav a:hover {
          text-decoration: underline;
        }
        .article-footer {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          margin-top: 3rem;
          text-align: center;
        }
        .article-footer p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        @media (max-width: 600px) {
          .article-subscribe-form {
            flex-direction: column;
          }
          .article-subscribe-form button {
            width: 100%;
          }
          .article-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `,
        }}
      />

      <div className="article-container">
        {/* MASTHEAD */}
        <div className="article-masthead">
          <div className="masthead-top">
            <div className="masthead-brand">
              <div className="brand-mark"></div>
              <div className="brand-name">
                Centinela<span>Intel</span>
              </div>
            </div>
            <span className="article-badge">Article</span>
          </div>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span>Chris Dover</span>
            <span>{dateStr}</span>
            <span>centinelaintel.com</span>
          </div>
        </div>

        {/* ARTICLE BODY */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />

        {/* SUBSCRIBE CTA */}
        <div className="article-subscribe-cta">
          <h3>Get daily intelligence in your inbox</h3>
          <p>
            Free daily Latin America security intelligence. Delivered at 0600.
          </p>
          <form
            className="article-subscribe-form"
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
        <div className="article-nav">
          <a href="/blog">&larr; All Posts</a>
          <a href="/contact">Request a Briefing</a>
        </div>

        {/* FOOTER */}
        <div className="article-footer">
          <p>Centinela Intel &mdash; A service of Enfocado Capital LLC</p>
          <p>AI-accelerated OSINT collection. Human-verified analysis.</p>
        </div>
      </div>
    </>
  );
}
