"use client";

import { useEffect, useMemo, useState } from "react";
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

/* --------------- component ---------------- */

export default function AdminForms() {
  const [rows, setRows] = useState<any[]>([]);
  const [type, setType] = useState<string>("all");

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
    // exclude ids we already have
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
          // fall back to individual getDoc (rare, but safe)
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

  // 3) filtering (still available, but not shown in the table)
  const filtered = useMemo(
    () => (type === "all" ? rows : rows.filter((r) => r.type === type)),
    [rows, type]
  );

  // 4) dynamic type options (so you don't have to hardcode)
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.type && set.add(r.type));
    return Array.from(set).sort();
  }, [rows]);

  // 5) submitted-by label
  function submittedBy(r: any) {
    const u = r.uid ? usersById[r.uid] : null;
    return (
      u?.displayName || u?.email || (r.uid ? `User ${r.uid.slice(0, 6)}…` : "—")
    );
  }

  // 6) participant label (if present)
  function participantLabel(r: any) {
    const pid = r.participantId || r.data?.participantId;
    const cached = pid ? usersById[pid] : null;
    const embedded = r.participantName || r.data?.participantName;
    return (
      embedded || cached?.displayName || cached?.email || (pid ? pid : "—")
    );
  }

  // 7) build human-friendly details for each row (type-aware + generic fallback)
  function buildDetails(
    r: any
  ): Array<{ label: string; value: React.ReactNode }> {
    const details: Array<{ label: string; value: React.ReactNode }> = [];

    switch (r.type) {
      case "fitness_partner_feedback": {
        // New structured FP feedback (flattened fields)
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
                className="text-indigo-300 hover:underline"
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
        // Generic fallback: show everything from r.data (if present)
        if (r.data && typeof r.data === "object") {
          Object.entries(r.data).forEach(([k, v]) => {
            // linkify obvious URLs
            if (typeof v === "string" && /^https?:\/\//i.test(v)) {
              details.push({
                label: titleize(k),
                value: (
                  <a
                    className="text-indigo-300 hover:underline"
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
                  <pre className="whitespace-pre-wrap text-[11px] leading-snug text-white/80 bg-white/5 rounded p-2 border border-white/10">
                    {JSON.stringify(v, null, 2)}
                  </pre>
                ),
              });
            } else {
              details.push({ label: titleize(k), value: String(v ?? "—") });
            }
          });
        } else {
          // If no data object, show any meaningful top-level fields (except system fields)
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
                    className="text-indigo-300 hover:underline"
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

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="flex items-center gap-2">
        <select
          className="rounded-lg bg-slate-900 border border-white/10 p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All types</option>
          {/* dynamic types from data */}
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {titleize(t)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2 pr-4">Submitted By</th>
              <th className="py-2 pr-4">Details</th>
              <th className="py-2 pr-4">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((r) => {
              const details = buildDetails(r);
              const created = toJSDate(r.createdAt);

              return (
                <tr key={r.id}>
                  <td className="py-2 pr-4 align-top">{submittedBy(r)}</td>
                  <td className="py-2 pr-4 align-top">
                    <div className="grid md:grid-cols-2 gap-2">
                      {details.map((d, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2"
                        >
                          <div className="text-[11px] text-white/60">
                            {d.label}
                          </div>
                          <div className="text-white/90 text-[13px]">
                            {d.value}
                          </div>
                        </div>
                      ))}
                      {details.length === 0 && (
                        <div className="text-white/60">
                          No details provided.
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4 align-top text-white/60">
                    {created ? created.toLocaleString() : "—"}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-white/60">
                  No forms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
