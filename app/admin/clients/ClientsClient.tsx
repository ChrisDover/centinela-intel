"use client";

import { useEffect, useState, useCallback } from "react";

interface Client {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  planTier: string;
  planStatus: string;
  countries: string | null;
  createdAt: string;
}

interface ClientData {
  clients: Client[];
  total: number;
  page: number;
  totalPages: number;
}

const TIER_LABELS: Record<string, string> = {
  "1-country": "1 Country",
  "2-country": "2 Countries",
  "3-country": "3 Countries",
  "all-countries": "All Countries",
};

function parseCountries(json: string | null): string {
  if (!json) return "—";
  try {
    const arr = JSON.parse(json) as Array<{ code: string; name: string }>;
    return arr.map((c) => c.name).join(", ") || "—";
  } catch {
    return "—";
  }
}

export default function ClientsClient() {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [sort, setSort] = useState("createdAt");
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
    if (tierFilter) params.set("tier", tierFilter);
    params.set("sort", sort);
    params.set("order", order);
    params.set("page", String(page));

    setLoading(true);
    fetch(`/api/admin/clients?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [debouncedSearch, statusFilter, tierFilter, sort, order, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, tierFilter, sort, order]);

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
          Clients
        </h1>
        <p className="mt-1 text-sm text-centinela-text-muted">
          Manage Country Monitor subscribers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-4 py-2 text-sm text-centinela-text-primary outline-none transition-colors placeholder:text-centinela-text-muted focus:border-centinela-accent"
          style={{ minWidth: 280 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-3 py-2 text-sm text-centinela-text-secondary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border border-centinela-border bg-centinela-bg-card px-3 py-2 text-sm text-centinela-text-secondary outline-none"
        >
          <option value="">All Tiers</option>
          <option value="1-country">1 Country ($497)</option>
          <option value="2-country">2 Countries ($597)</option>
          <option value="3-country">3 Countries ($697)</option>
          <option value="all-countries">All Countries ($997)</option>
        </select>
        {data && (
          <span className="ml-auto font-mono text-xs text-centinela-text-muted">
            {data.total} client{data.total !== 1 ? "s" : ""}
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
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "company", label: "Company" },
                  { key: "planTier", label: "Tier" },
                  { key: "planStatus", label: "Status" },
                  { key: "countries", label: "Countries" },
                  { key: "createdAt", label: "Member Since" },
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data?.clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-centinela-text-muted"
                  >
                    No clients found
                  </td>
                </tr>
              ) : (
                data?.clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-centinela-border/50"
                  >
                    <td className="py-2 text-centinela-text-secondary">
                      {client.name || "—"}
                    </td>
                    <td className="py-2 text-centinela-text-secondary">
                      {client.email}
                    </td>
                    <td className="py-2 text-centinela-text-muted">
                      {client.company || "—"}
                    </td>
                    <td className="py-2">
                      <span className="rounded bg-centinela-info/15 px-2 py-0.5 font-mono text-xs text-centinela-info">
                        {TIER_LABELS[client.planTier] || client.planTier}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs ${
                          client.planStatus === "active"
                            ? "bg-centinela-accent/15 text-centinela-accent"
                            : client.planStatus === "past_due"
                              ? "bg-centinela-warning/15 text-centinela-warning"
                              : "bg-centinela-danger/15 text-centinela-danger"
                        }`}
                      >
                        {client.planStatus}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate py-2 text-xs text-centinela-text-muted">
                      {parseCountries(client.countries)}
                    </td>
                    <td className="py-2 font-mono text-xs text-centinela-text-muted">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <a
                        href={`/admin/clients/${client.id}`}
                        className="rounded px-2 py-1 font-mono text-xs text-centinela-accent transition-colors hover:bg-centinela-accent/10"
                      >
                        View
                      </a>
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
