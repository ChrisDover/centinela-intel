"use client";

import { useEffect, useState, useCallback } from "react";

interface Campaign {
  id: string;
  type: string;
  subject: string;
  status: string;
  sentAt: string;
  scheduledFor: string | null;
  recipientCount: number;
  openedCount: number;
  clickedCount: number;
  abTestId: string | null;
}

interface ABTest {
  id: string;
  name: string;
  type: string;
  status: string;
  variants: { id: string; value: string }[];
}

interface NewCampaign {
  type: string;
  subject: string;
  htmlContent: string;
  ctaType: string;
  abTestId: string;
  scheduledFor: string;
  // Brief-specific fields
  threatLevel: string;
  developments: string;
  countries: string;
  analystNote: string;
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

const EMPTY_CAMPAIGN: NewCampaign = {
  type: "brief",
  subject: "",
  htmlContent: "",
  ctaType: "premium",
  abTestId: "",
  scheduledFor: "",
  threatLevel: "ELEVATED",
  developments: "",
  countries: "",
  analystNote: "",
};

export default function CampaignsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [form, setForm] = useState<NewCampaign>(EMPTY_CAMPAIGN);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // A/B variant fields for subject tests
  const [abVariantB, setAbVariantB] = useState("");
  const [showAbVariant, setShowAbVariant] = useState(false);

  const loadCampaigns = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/campaigns").then((r) => r.json()),
      fetch("/api/admin/ab-tests?status=running").then((r) => r.json()),
    ])
      .then(([campaignData, testData]) => {
        setCampaigns(campaignData.campaigns || []);
        setAbTests(Array.isArray(testData) ? testData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  function buildHtmlContent(): string {
    if (form.type === "brief") {
      // Parse developments: lines starting with "Country:" group under that country
      // Lines without a country prefix go under "Regional"
      const devLines = form.developments.split("\n").filter((d) => d.trim());
      const devMap = new Map<string, string[]>();
      let currentCountry = "Regional";
      for (const line of devLines) {
        const countryMatch = line.match(/^([A-Za-z\s]+):\s*(.+)/);
        if (countryMatch) {
          currentCountry = countryMatch[1].trim();
          if (!devMap.has(currentCountry)) devMap.set(currentCountry, []);
          devMap.get(currentCountry)!.push(countryMatch[2].trim());
        } else {
          if (!devMap.has(currentCountry)) devMap.set(currentCountry, []);
          devMap.get(currentCountry)!.push(line.trim());
        }
      }
      const developments = Array.from(devMap.entries()).map(
        ([country, paragraphs]) => ({ country, paragraphs })
      );

      const countries = form.countries
        .split("\n")
        .filter((c) => c.trim())
        .map((line) => {
          const [name, ...rest] = line.split(":");
          return { name: name.trim(), summary: rest.join(":").trim() };
        });

      return JSON.stringify({
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        threatLevel: form.threatLevel,
        developments,
        countries,
        analystNote: form.analystNote,
      });
    }
    return form.htmlContent;
  }

  async function handleCreate() {
    if (!form.subject.trim()) return;
    setSaving(true);

    try {
      // Create A/B test if variant B exists
      let abTestId = form.abTestId || undefined;
      if (showAbVariant && abVariantB.trim()) {
        const testRes = await fetch("/api/admin/ab-tests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Subject test: ${form.subject.substring(0, 30)}...`,
            type: "subject",
            variants: [
              { id: "a", value: form.subject },
              { id: "b", value: abVariantB },
            ],
          }),
        });
        const test = await testRes.json();
        abTestId = test.id;
      }

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          subject: form.subject,
          htmlContent: buildHtmlContent(),
          tags: form.ctaType,
          abTestId: abTestId || null,
          scheduledFor: form.scheduledFor || null,
        }),
      });

      if (res.ok) {
        setShowComposer(false);
        setForm(EMPTY_CAMPAIGN);
        setAbVariantB("");
        setShowAbVariant(false);
        loadCampaigns();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePreview(campaignId: string) {
    const res = await fetch(`/api/admin/campaigns/${campaignId}/preview`);
    const data = await res.json();
    setPreviewHtml(data.html);
  }

  async function handleSend(campaignId: string) {
    if (!confirm("Send this campaign to all active subscribers?")) return;
    setSendingId(campaignId);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/send`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Sent! Scheduled: ${data.scheduled}, Failed: ${data.failed}`);
        loadCampaigns();
      } else {
        alert(`Error: ${data.error}`);
      }
    } finally {
      setSendingId(null);
    }
  }

  async function handleDelete(campaignId: string) {
    if (!confirm("Delete this campaign?")) return;
    await fetch(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" });
    loadCampaigns();
  }

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-centinela-text-muted">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-centinela-text-primary">
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-centinela-text-muted">
            Create, preview, and send email campaigns
          </p>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="rounded-md bg-centinela-accent px-4 py-2 font-mono text-xs font-medium text-centinela-bg-primary transition-colors hover:bg-centinela-accent/90"
        >
          {showComposer ? "Cancel" : "New Campaign"}
        </button>
      </div>

      {/* Composer */}
      {showComposer && (
        <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-6 space-y-5">
          <h3 className="font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
            New Campaign
          </h3>

          {/* Type Selector */}
          <div>
            <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
              Type
            </label>
            <div className="flex gap-2">
              {["brief", "broadcast", "alert"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
                    form.type === t
                      ? TYPE_BADGES[t]
                      : "text-centinela-text-muted hover:text-centinela-text-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
              Subject Line
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Weekly LatAm Security Brief — Feb 10, 2026"
              className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
            />
            {!showAbVariant && (
              <button
                onClick={() => setShowAbVariant(true)}
                className="mt-1 font-mono text-xs text-centinela-accent hover:underline"
              >
                + Add A/B variant
              </button>
            )}
            {showAbVariant && (
              <div className="mt-2">
                <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                  Variant B Subject
                </label>
                <input
                  type="text"
                  value={abVariantB}
                  onChange={(e) => setAbVariantB(e.target.value)}
                  placeholder="Alternative subject line..."
                  className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
                />
                <button
                  onClick={() => {
                    setShowAbVariant(false);
                    setAbVariantB("");
                  }}
                  className="mt-1 font-mono text-xs text-centinela-danger hover:underline"
                >
                  Remove variant
                </button>
              </div>
            )}
          </div>

          {/* Brief-specific fields */}
          {form.type === "brief" && (
            <>
              <div>
                <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                  Threat Level
                </label>
                <div className="flex gap-2">
                  {["MODERATE", "ELEVATED", "HIGH", "CRITICAL"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setForm({ ...form, threatLevel: level })
                      }
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        form.threatLevel === level
                          ? level === "CRITICAL" || level === "HIGH"
                            ? "bg-centinela-danger/15 text-centinela-danger"
                            : "bg-centinela-accent/15 text-centinela-accent"
                          : "text-centinela-text-muted hover:text-centinela-text-secondary"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                  Key Developments (one per line)
                </label>
                <textarea
                  value={form.developments}
                  onChange={(e) =>
                    setForm({ ...form, developments: e.target.value })
                  }
                  rows={4}
                  placeholder={"Mexico: Sinaloa cartel leadership vacuum continues\nEcuador: State of emergency extended in Guayaquil\nColombia: ELN ceasefire talks stall"}
                  className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                  Country Watch (format: Country: Summary, one per line)
                </label>
                <textarea
                  value={form.countries}
                  onChange={(e) =>
                    setForm({ ...form, countries: e.target.value })
                  }
                  rows={4}
                  placeholder={"Mexico: Sinaloa mine worker kidnapping, cartel transfers\nEcuador: Guayaquil car bombing, 9200+ homicides\nColombia: 30% security tariff dispute"}
                  className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                  Analyst Assessment
                </label>
                <textarea
                  value={form.analystNote}
                  onChange={(e) =>
                    setForm({ ...form, analystNote: e.target.value })
                  }
                  rows={3}
                  placeholder="Three dynamics to watch this week..."
                  className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Broadcast/Alert content */}
          {(form.type === "broadcast" || form.type === "alert") && (
            <div>
              <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                {form.type === "alert" ? "Alert Body (HTML)" : "Content (HTML paragraphs)"}
              </label>
              <textarea
                value={form.htmlContent}
                onChange={(e) =>
                  setForm({ ...form, htmlContent: e.target.value })
                }
                rows={8}
                placeholder={'<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Your message here...</p>'}
                className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 font-mono text-xs text-centinela-text-primary placeholder:text-centinela-text-muted/50 focus:border-centinela-accent focus:outline-none"
              />
            </div>
          )}

          {/* CTA Selector */}
          <div>
            <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
              CTA
            </label>
            <div className="flex flex-wrap gap-2">
              {["premium", "trendlock", "thunderdome", "briefing", "none"].map(
                (cta) => (
                  <button
                    key={cta}
                    onClick={() => setForm({ ...form, ctaType: cta })}
                    className={`rounded-md px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
                      form.ctaType === cta
                        ? "bg-centinela-accent/15 text-centinela-accent"
                        : "text-centinela-text-muted hover:text-centinela-text-secondary"
                    }`}
                  >
                    {cta}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Existing A/B Test Link */}
          {abTests.length > 0 && !showAbVariant && (
            <div>
              <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
                Link A/B Test (optional)
              </label>
              <select
                value={form.abTestId}
                onChange={(e) =>
                  setForm({ ...form, abTestId: e.target.value })
                }
                className="w-full rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary focus:border-centinela-accent focus:outline-none"
              >
                <option value="">None</option>
                {abTests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.name} ({test.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Schedule */}
          <div>
            <label className="mb-1 block font-mono text-xs text-centinela-text-muted">
              Schedule (optional — leave blank for optimal send times)
            </label>
            <input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(e) =>
                setForm({ ...form, scheduledFor: e.target.value })
              }
              className="rounded-md border border-centinela-border bg-centinela-bg-primary px-3 py-2 text-sm text-centinela-text-primary focus:border-centinela-accent focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={saving || !form.subject.trim()}
              className="rounded-md bg-centinela-accent px-4 py-2 font-mono text-xs font-medium text-centinela-bg-primary transition-colors hover:bg-centinela-accent/90 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Draft"}
            </button>
            <button
              onClick={() => setShowComposer(false)}
              className="rounded-md border border-centinela-border px-4 py-2 font-mono text-xs text-centinela-text-muted transition-colors hover:text-centinela-text-secondary"
            >
              Cancel
            </button>
          </div>
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

      {/* Campaign List */}
      <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-centinela-border">
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Status
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Type
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Subject
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Date
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Recipients
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Opens
                </th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    No campaigns yet. Create your first one above.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          STATUS_BADGES[c.status] || STATUS_BADGES.draft
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          TYPE_BADGES[c.type] ||
                          "bg-centinela-border text-centinela-text-muted"
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="max-w-xs truncate py-2 text-centinela-text-secondary">
                      <a
                        href={`/admin/campaigns/${c.id}`}
                        className="hover:text-centinela-accent hover:underline"
                      >
                        {c.subject}
                      </a>
                      {c.abTestId && (
                        <span className="ml-2 rounded bg-centinela-info/10 px-1.5 py-0.5 font-mono text-[10px] text-centinela-info">
                          A/B
                        </span>
                      )}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {new Date(c.sentAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {c.recipientCount}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-accent">
                      {c.openedCount}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(c.id)}
                          className="font-mono text-xs text-centinela-text-muted hover:text-centinela-accent"
                        >
                          Preview
                        </button>
                        {c.status === "draft" && (
                          <>
                            <button
                              onClick={() => handleSend(c.id)}
                              disabled={sendingId === c.id}
                              className="font-mono text-xs text-centinela-accent hover:underline disabled:opacity-50"
                            >
                              {sendingId === c.id ? "Sending..." : "Send"}
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="font-mono text-xs text-centinela-danger hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
