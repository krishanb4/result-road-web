// app/dashboard/admin/forms/page.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ---------------- helpers ---------------- */

function chunk<T>(arr: T[], size = 10): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function titleize(key: string) {
  return key
    .replace(/[_\-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function toJSDate(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  const t = new Date(v);
  return Number.isNaN(t.getTime()) ? null : t;
}

type UserLite = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};

/* --------------- UI tokens (light) ---------------- */
const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.95)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--chip-bg" as any]: "rgba(2,6,23,0.04)",
  ["--table-div" as any]: "rgba(15,23,42,0.06)",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
};

export default function AdminForms() {
  const [rows, setRows] = useState<any[]>([]);
  const [type, setType] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  // user lookup cache (for submitted-by & participant names)
  const [usersById, setUsersById] = useState<Record<string, UserLite>>({});

  // 1) live forms
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "forms"), orderBy("createdAt", "desc")),
        (snap) => {
          setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      ),
    []
  );

  // 2) when rows change, fetch any missing users for submitted-by (uid) + participantId
  useEffect(() => {
    const ids = new Set<string>();
    for (const r of rows) {
      if (r.uid) ids.add(r.uid);
      if (r.participantId) ids.add(r.participantId);
      // also check nested data shapes
      if (r.data?.participantId) ids.add(r.data.participantId);
    }
    const need = Array.from(ids).filter((id) => !usersById[id]);

    if (need.length === 0) return;

    (async () => {
      const next: Record<string, UserLite> = {};
      for (const group of chunk(need, 10)) {
        // query users by document id (__name__ in)
        const q = query(
          collection(db, "users"),
          where("__name__", "in", group)
        );
        const snap = await getDocs(q).catch(() => null);
        if (snap) {
          snap.docs.forEach((d) => {
            const v: any = d.data();
            next[d.id] = {
              id: d.id,
              displayName: v?.displayName ?? null,
              email: v?.email ?? null,
            };
          });
        } else {
          // fallback to individual getDoc (rare)
          for (const id of group) {
            const g = await getDoc(doc(db, "users", id)).catch(() => null);
            if (g?.exists()) {
              const v: any = g.data();
              next[id] = {
                id,
                displayName: v?.displayName ?? null,
                email: v?.email ?? null,
              };
            }
          }
        }
      }
      if (Object.keys(next).length) {
        setUsersById((prev) => ({ ...prev, ...next }));
      }
    })();
  }, [rows, usersById]);

  // 3) filtering
  function submittedBy(r: any) {
    const u = r.uid ? usersById[r.uid] : null;
    return (
      u?.displayName || u?.email || (r.uid ? `User ${r.uid.slice(0, 6)}…` : "—")
    );
  }
  function participantLabel(r: any) {
    const pid = r.participantId || r.data?.participantId;
    const cached = pid ? usersById[pid] : null;
    const embedded = r.participantName || r.data?.participantName;
    return (
      embedded || cached?.displayName || cached?.email || (pid ? pid : "—")
    );
  }

  const filtered = useMemo(() => {
    let base = type === "all" ? rows : rows.filter((r) => r.type === type);
    const s = q.trim().toLowerCase();
    if (!s) return base;
    return base.filter((r) => {
      const sb = submittedBy(r).toLowerCase();
      const email = String(r.email || r.data?.email || "").toLowerCase();
      const pname = participantLabel(r).toLowerCase();
      const t = String(r.type || "").toLowerCase();
      const title = String(r.programTitle || r.data?.programTitle || "")
        .toLowerCase()
        .trim();
      return (
        sb.includes(s) ||
        email.includes(s) ||
        pname.includes(s) ||
        t.includes(s) ||
        title.includes(s)
      );
    });
  }, [rows, type, q, usersById]);

  // 4) dynamic type options
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.type && set.add(r.type));
    return Array.from(set).sort();
  }, [rows]);

  // 5) build human-friendly details for each row (type-aware + generic fallback)
  function buildDetails(
    r: any
  ): Array<{ label: string; value: React.ReactNode }> {
    const details: Array<{ label: string; value: React.ReactNode }> = [];

    switch (r.type) {
      case "fitness_partner_feedback": {
        const session = toJSDate(r.sessionDate);
        if (r.programTitle || r.programId)
          details.push({
            label: "Program",
            value: r.programTitle || r.programId,
          });
        details.push({ label: "Participant", value: participantLabel(r) });
        if (session)
          details.push({
            label: "Session Date",
            value: session.toLocaleDateString(),
          });
        if (r.attendance)
          details.push({ label: "Attendance", value: String(r.attendance) });
        if (typeof r.rating !== "undefined")
          details.push({ label: "Rating", value: String(r.rating) });
        if (typeof r.minutes !== "undefined" && r.minutes !== null)
          details.push({ label: "Minutes", value: String(r.minutes) });
        if (r.notes) details.push({ label: "Notes", value: r.notes });

        if (r.planDocumentUrl) {
          details.push({
            label: "Document",
            value: (
              <a
                className="text-indigo-700 hover:underline"
                href={r.planDocumentUrl}
                target="_blank"
              >
                View file
              </a>
            ),
          });
        }
        break;
      }

      default: {
        // Prefer r.data object if present
        if (r.data && typeof r.data === "object") {
          Object.entries(r.data).forEach(([k, v]) => {
            if (typeof v === "string" && /^https?:\/\//i.test(v)) {
              details.push({
                label: titleize(k),
                value: (
                  <a
                    className="text-indigo-700 hover:underline"
                    href={v}
                    target="_blank"
                  >
                    Open link
                  </a>
                ),
              });
            } else if (typeof v === "object" && v !== null) {
              details.push({
                label: titleize(k),
                value: (
                  <pre className="whitespace-pre-wrap text-[11px] leading-snug text-slate-800 bg-slate-50 rounded p-2 border border-slate-200">
                    {JSON.stringify(v, null, 2)}
                  </pre>
                ),
              });
            } else {
              details.push({ label: titleize(k), value: String(v ?? "—") });
            }
          });
        } else {
          // If no data object, show meaningful top-level fields
          const omit = new Set([
            "id",
            "uid",
            "type",
            "createdAt",
            "updatedAt",
            "programId",
            "participantId",
          ]);
          Object.entries(r).forEach(([k, v]) => {
            if (omit.has(k)) return;
            if (k.endsWith("Id")) return;
            if (k === "programTitle")
              details.push({ label: "Program", value: String(v ?? "—") });
            else if (k === "participantName")
              details.push({ label: "Participant", value: String(v ?? "—") });
            else if (k === "planDocumentUrl" && typeof v === "string")
              details.push({
                label: "Document",
                value: (
                  <a
                    className="text-indigo-700 hover:underline"
                    href={v}
                    target="_blank"
                  >
                    View file
                  </a>
                ),
              });
            else details.push({ label: titleize(k), value: String(v ?? "—") });
          });
        }
        break;
      }
    }

    return details;
  }

  // Row details expand/collapse (show first N by default)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const N = 6;
  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="space-y-6 text-[var(--panel-text)]" style={tokens}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Forms</h2>
          <div className="text-sm text-[var(--muted-text)]">
            Showing <b>{filtered.length}</b> of {rows.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            placeholder="Search name, email, type…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All types</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {titleize(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop/table */}
      <section className="hidden md:block rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-3 md:p-5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="text-left text-slate-600 border-b border-[var(--panel-border)]">
              <tr>
                <th className="py-2 px-3">Submitted By</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Details</th>
                <th className="py-2 px-3">Submitted</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                ["--tw-divide-opacity" as any]: 1,
                ["--tw-divide-color" as any]: "var(--table-div)",
              }}
            >
              {filtered.map((r) => {
                const details = buildDetails(r);
                const created = toJSDate(r.createdAt);
                const id = r.id as string;
                const showAll = !!expanded[id];
                const visible = showAll ? details : details.slice(0, N);

                return (
                  <tr key={id} className="align-top text-slate-800">
                    <td className="py-2 px-3">
                      <div className="font-medium">{submittedBy(r)}</div>
                      <div className="text-xs text-[var(--muted-text)]">
                        Participant: {participantLabel(r)}
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full border bg-[var(--chip-bg)] border-[var(--panel-border)]">
                        {r.type ? titleize(r.type) : "—"}
                      </span>
                    </td>

                    <td className="py-2 px-3">
                      <div className="grid md:grid-cols-2 gap-2">
                        {visible.map((d, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] px-3 py-2"
                          >
                            <div className="text-[11px] text-[var(--muted-text)]">
                              {d.label}
                            </div>
                            <div className="text-slate-800 text-[13px] break-words">
                              {d.value}
                            </div>
                          </div>
                        ))}
                        {details.length === 0 && (
                          <div className="text-slate-500">
                            No details provided.
                          </div>
                        )}
                      </div>
                      {details.length > N && (
                        <button
                          onClick={() => toggle(id)}
                          className="mt-2 text-xs text-indigo-700 hover:underline"
                        >
                          {showAll
                            ? "Show less"
                            : `Show ${details.length - N} more`}
                        </button>
                      )}
                    </td>

                    <td className="py-2 px-3 text-slate-700">
                      {created
                        ? new Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(created)
                        : "—"}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No forms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile/cards */}
      <section className="md:hidden grid gap-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 text-slate-500">
            No forms found.
          </div>
        )}

        {filtered.map((r) => {
          const details = buildDetails(r);
          const created = toJSDate(r.createdAt);
          const id = r.id as string;
          const showAll = !!expanded[id];
          const visible = showAll ? details : details.slice(0, N);

          return (
            <div
              key={id}
              className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-slate-900 font-medium">
                    {submittedBy(r)}
                  </div>
                  <div className="text-sm text-slate-600">
                    Participant: {participantLabel(r)}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border bg-[var(--chip-bg)] border-[var(--panel-border)] self-start">
                  {r.type ? titleize(r.type) : "—"}
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {visible.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] px-3 py-2"
                  >
                    <div className="text-[11px] text-[var(--muted-text)]">
                      {d.label}
                    </div>
                    <div className="text-slate-800 text-[13px] break-words">
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>

              {details.length > N && (
                <button
                  onClick={() => toggle(id)}
                  className="mt-2 text-xs text-indigo-700 hover:underline"
                >
                  {showAll ? "Show less" : `Show ${details.length - N} more`}
                </button>
              )}

              <div className="mt-3 text-xs text-[var(--muted-text)]">
                {created
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(created)
                  : "—"}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
