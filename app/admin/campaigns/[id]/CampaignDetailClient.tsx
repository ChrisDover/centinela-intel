"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  type: string;
  subject: string;
  status: string;
  htmlContent: string | null;
  tags: string | null;
  notes: string | null;
  sentAt: string | null;
  scheduledFor: string | null;
  createdAt: string;
  abTestId: string | null;
  _count: {
    emailSends: number;
    emailEvents: number;
    ctaClicks: number;
  };
}

interface BriefDevelopment {
  country: string;
  paragraphs: string[];
}

interface BriefData {
  date?: string;
  threatLevel?: string;
  developments?: BriefDevelopment[] | string[];
  countries?: { name: string; summary: string }[];
  analystNote?: string;
}

const STATUS_BADGES: Record<string, string> = {
  draft: "bg-centinela-border text-centinela-text-muted",
  scheduled: "bg-centinela-info/15 text-centinela-info",
  sending: "bg-centinela-warning/15 text-centinela-warning",
  sent: "bg-centinela-accent/15 text-centinela-accent",
};

const TYPE_BADGES: Record<string, string> = {
  welcome: "bg-centinela-accent/15 text-centinela-accent",
  brief: "bg-centinela-info/15 text-centinela-info",
  broadcast: "bg-centinela-warning/15 text-centinela-warning",
  alert: "bg-centinela-danger/15 text-centinela-danger",
};

const THREAT_COLORS: Record<string, string> = {
  CRITICAL: "bg-centinela-danger/15 text-centinela-danger",
  HIGH: "bg-centinela-warning/15 text-centinela-warning",
  ELEVATED: "bg-centinela-info/15 text-centinela-info",
  MODERATE: "bg-centinela-accent/15 text-centinela-accent",
};

export default function CampaignDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [subjectValue, setSubjectValue] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const fetchCampaign = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/campaigns/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setCampaign(null);
        } else {
          setCampaign(data);
          setSubjectValue(data.subject);
          setNoteValue(data.notes || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  function parseBriefData(): BriefData | null {
    if (!campaign || campaign.type !== "brief" || !campaign.htmlContent) return null;
    try {
      const data = JSON.parse(campaign.htmlContent);
      // Normalize developments from any stored format
      if (typeof data.developments === "string") {
        try {
          data.developments = JSON.parse(data.developments);
        } catch {
          data.developments = [{ country: "Regional", paragraphs: [data.developments] }];
        }
      }
      // Convert legacy flat string array to structured format
      if (Array.isArray(data.developments) && data.developments.length > 0 && typeof data.developments[0] === "string") {
        data.developments = (data.developments as string[]).map((d: string) => ({
          country: "Regional",
          paragraphs: [d],
        }));
      }
      return data;
    } catch {
      return null;
    }
  }

  async function handlePreview() {
    const res = await fetch(`/api/admin/campaigns/${id}/preview`);
    const data = await res.json();
    setPreviewHtml(data.html);
  }

  async function handleSend() {
    if (!confirm("Send this campaign to all active subscribers?")) return;
    setSendingId(id);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Sent! Scheduled: ${data.scheduled}, Failed: ${data.failed}`);
        fetchCampaign();
      } else {
        alert(`Error: ${data.error}`);
      }
    } finally {
      setSendingId(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this campaign?")) return;
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    router.push("/admin/campaigns");
  }

  async function saveSubject() {
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: subjectValue }),
    });
    setEditingSubject(false);
    fetchCampaign();
  }

  async function saveNote() {
    // For brief campaigns, update the analystNote inside htmlContent JSON
    if (campaign?.type === "brief") {
      const briefData = parseBriefData();
      if (briefData) {
        briefData.analystNote = noteValue;
        await fetch(`/api/admin/campaigns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlContent: JSON.stringify(briefData) }),
        });
      }
    } else {
      await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteValue }),
      });
    }
    setEditingNote(false);
    fetchCampaign();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-centinela-danger">Failed to load campaign data</div>
    );
  }

  const briefData = parseBriefData();
  const isDraft = campaign.status === "draft";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <a
            href="/admin/campaigns"
            className="mb-2 inline-block font-mono text-xs text-centinela-text-muted transition-colors hover:text-centinela-accent"
          >
            &larr; Back to Campaigns
          </a>
          {editingSubject && isDraft ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subjectValue}
                onChange={(e) => setSubjectValue(e.target.value)}
                className="w-full max-w-lg rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 font-display text-xl text-centinela-text-primary focus:border-centinela-accent focus:outline-none"
              />
              <button
                onClick={saveSubject}
                className="rounded-md bg-centinela-accent px-3 py-2 font-mono text-xs text-centinela-bg-primary"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingSubject(false);
                  setSubjectValue(campaign.subject);
                }}
                className="font-mono text-xs text-centinela-text-muted hover:text-centinela-text-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1
              className={`font-display text-2xl text-centinela-text-primary ${isDraft ? "cursor-pointer hover:text-centinela-accent" : ""}`}
              onClick={() => isDraft && setEditingSubject(true)}
              title={isDraft ? "Click to edit subject" : undefined}
            >
              {campaign.subject}
            </h1>
          )}
          <p className="mt-1 text-sm text-centinela-text-muted">
            Created {new Date(campaign.createdAt).toLocaleDateString()}
            {campaign.sentAt &&
              ` · Sent ${new Date(campaign.sentAt).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs ${
              STATUS_BADGES[campaign.status] || STATUS_BADGES.draft
            }`}
          >
            {campaign.status}
          </span>
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs ${
              TYPE_BADGES[campaign.type] ||
              "bg-centinela-border text-centinela-text-muted"
            }`}
          >
            {campaign.type}
          </span>
        </div>
      </div>

      {/* Stats + Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stats */}
        <div className="col-span-2 rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Campaign Stats
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Recipients" value={campaign._count.emailSends} />
            <StatCard label="Events" value={campaign._count.emailEvents} />
            <StatCard label="CTA Clicks" value={campaign._count.ctaClicks} />
            <StatCard
              label="CTA Type"
              value={campaign.tags || "—"}
              isText
            />
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={handlePreview}
              className="w-full rounded-lg border border-centinela-border px-4 py-2 font-mono text-xs text-centinela-text-secondary transition-colors hover:border-centinela-accent hover:text-centinela-accent"
            >
              Preview Email
            </button>
            {isDraft && (
              <>
                <button
                  onClick={handleSend}
                  disabled={sendingId === id}
                  className="w-full rounded-lg bg-centinela-accent px-4 py-2 font-mono text-xs font-medium text-centinela-bg-primary transition-colors hover:bg-centinela-accent/90 disabled:opacity-50"
                >
                  {sendingId === id ? "Sending..." : "Send Campaign"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full rounded-lg border border-centinela-danger/30 px-4 py-2 font-mono text-xs text-centinela-danger transition-colors hover:border-centinela-danger hover:bg-centinela-danger/10"
                >
                  Delete Campaign
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Brief Content */}
      {briefData && (
        <div className="space-y-6">
          {/* Threat Level + Date */}
          <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Threat Level
                </div>
                <span
                  className={`mt-1 inline-block rounded px-3 py-1 font-mono text-sm font-medium ${
                    THREAT_COLORS[briefData.threatLevel || ""] ||
                    THREAT_COLORS.MODERATE
                  }`}
                >
                  {briefData.threatLevel || "N/A"}
                </span>
              </div>
              {briefData.date && (
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                    Brief Date
                  </div>
                  <div className="mt-1 text-sm text-centinela-text-secondary">
                    {briefData.date}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Developments */}
          {briefData.developments && briefData.developments.length > 0 && (
            <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                Key Developments
              </h3>
              <div className="space-y-6">
                {(briefData.developments as BriefDevelopment[]).map((dev, i) => (
                  <div key={i}>
                    <div className="mb-2 font-mono text-xs font-medium text-centinela-accent">
                      {dev.country}
                    </div>
                    <div className="space-y-2">
                      {dev.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          className="text-sm leading-relaxed text-centinela-text-secondary"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country Summaries */}
          {briefData.countries && briefData.countries.length > 0 && (
            <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                Country Watch
              </h3>
              <div className="space-y-4">
                {briefData.countries.map((country, i) => (
                  <div key={i}>
                    <div className="font-mono text-xs font-medium text-centinela-accent">
                      {country.name}
                    </div>
                    <div className="mt-1 text-sm text-centinela-text-secondary">
                      {country.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyst Note */}
          <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                Analyst Assessment
              </h3>
              {isDraft && !editingNote && (
                <button
                  onClick={() => {
                    setNoteValue(briefData.analystNote || "");
                    setEditingNote(true);
                  }}
                  className="font-mono text-xs text-centinela-accent hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {editingNote && isDraft ? (
              <div className="space-y-2">
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary focus:border-centinela-accent focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNote}
                    className="rounded-md bg-centinela-accent px-3 py-1.5 font-mono text-xs text-centinela-bg-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNote(false)}
                    className="font-mono text-xs text-centinela-text-muted hover:text-centinela-text-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(briefData.analystNote || "No analyst note")
                  .split(/\n\n+/)
                  .filter((p) => p.trim())
                  .map((p, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-centinela-text-secondary"
                    >
                      {p.trim()}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Non-brief HTML content */}
      {!briefData && campaign.htmlContent && (
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            Content
          </h3>
          <div
            className="prose prose-sm max-w-none text-centinela-text-secondary"
            dangerouslySetInnerHTML={{ __html: campaign.htmlContent }}
          />
        </div>
      )}

      {/* Preview Modal */}
      {previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-centinela-border bg-white">
            <button
              onClick={() => setPreviewHtml(null)}
              className="absolute right-3 top-3 rounded-md bg-black/10 px-3 py-1 text-sm text-black hover:bg-black/20"
            >
              Close
            </button>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  isText,
}: {
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
        {label}
      </div>
      <div
        className={`mt-1 ${isText ? "text-sm text-centinela-text-secondary" : "font-mono text-lg text-centinela-text-primary"}`}
      >
        {value}
      </div>
    </div>
  );
}
