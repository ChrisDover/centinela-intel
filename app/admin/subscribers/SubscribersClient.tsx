"use client";

import { useEffect, useState, useCallback } from "react";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string | null;
  subscribedAt: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  engagementScore: number;
}

interface SubscriberData {
  subscribers: Subscriber[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SubscribersClient() {
  const [data, setData] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sort, setSort] = useState("subscribedAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFilter) params.set("status", statusFilter);
    if (sourceFilter) params.set("source", sourceFilter);
    params.set("sort", sort);
    params.set("order", order);
    params.set("page", String(page));

    setLoading(true);
    fetch(`/api/admin/subscribers?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [debouncedSearch, statusFilter, sourceFilter, sort, order, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, sort, order]);

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "unsubscribed" : "active";
    await fetch("/api/admin/subscribers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchData();
  }

  function handleSort(field: string) {
    if (sort === field) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSort(field);
      setOrder("desc");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-centinela-text-primary">
          Subscribers
        </h1>
        <p className="mt-1 text-sm text-centinela-text-muted">
          Manage newsletter subscribers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-4 py-2 text-sm text-centinela-text-primary outline-none transition-colors placeholder:text-centinela-text-muted focus:border-centinela-accent"
          style={{ minWidth: 240 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-3 py-2 text-sm text-centinela-text-secondary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-3 py-2 text-sm text-centinela-text-secondary outline-none"
        >
          <option value="">All Sources</option>
          <option value="homepage">Homepage</option>
          <option value="subscribe-page">Subscribe Page</option>
          <option value="brief">Brief</option>
          <option value="direct">Direct</option>
        </select>
        {data && (
          <span className="ml-auto font-mono text-xs text-centinela-text-muted">
            {data.total} result{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-centinela-border bg-centinela-bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-centinela-border">
                {[
                  { key: "email", label: "Email" },
                  { key: "status", label: "Status" },
                  { key: "source", label: "Source" },
                  { key: "subscribedAt", label: "Date" },
                  { key: "emailsSent", label: "Sent" },
                  { key: "emailsOpened", label: "Opened" },
                  { key: "emailsClicked", label: "Clicked" },
                  { key: "engagementScore", label: "Engagement" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer select-none pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted transition-colors hover:text-centinela-accent"
                  >
                    {col.label}
                    {sort === col.key && (
                      <span className="ml-1">
                        {order === "desc" ? "↓" : "↑"}
                      </span>
                    )}
                  </th>
                ))}
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-centinela-text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data?.subscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    No subscribers found
                  </td>
                </tr>
              ) : (
                data?.subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2 text-centinela-text-secondary">
                      {sub.email}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          sub.status === "active"
                            ? "bg-centinela-accent/15 text-centinela-accent"
                            : sub.status === "bounced"
                              ? "bg-centinela-danger/15 text-centinela-danger"
                              : "bg-centinela-warning/15 text-centinela-warning"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-2 text-centinela-text-muted">
                      {sub.source || "—"}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {sub.emailsSent}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {sub.emailsOpened}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {sub.emailsClicked}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {sub.engagementScore}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => toggleStatus(sub.id, sub.status)}
                        className={`rounded px-2 py-1 font-mono text-xs transition-colors ${
                          sub.status === "active"
                            ? "text-centinela-warning hover:bg-centinela-warning/10"
                            : "text-centinela-accent hover:bg-centinela-accent/10"
                        }`}
                      >
                        {sub.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-centinela-border pt-4">
            <span className="font-mono text-xs text-centinela-text-muted">
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-centinela-border px-3 py-1 font-mono text-xs text-centinela-text-muted transition-colors hover:border-centinela-accent hover:text-centinela-accent disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-centinela-border px-3 py-1 font-mono text-xs text-centinela-text-muted transition-colors hover:border-centinela-accent hover:text-centinela-accent disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
