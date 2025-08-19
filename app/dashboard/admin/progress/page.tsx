// app/dashboard/admin/progress/page.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ---------------- Types ---------------- */
type FBTimestamp = { toDate?: () => Date };
type ProgressDoc = {
  id: string;
  assignmentId: string;
  moduleId: string;
  percent: number; // 0..100
  updatedAt?: FBTimestamp;
};
type Assignment = {
  id: string;
  participantId?: string | null;
  programId?: string | null;
  status?: string | null; // "assigned" | "pending" | ...
};
type ProgramModule = { id: string; title?: string | null } | string;
type Program = {
  id: string;
  title?: string;
  modules?: ProgramModule[];
  fitnessPartnerId?: string | null;
};
type UserLite = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};

/* ---------------- Light UI tokens ---------------- */
const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.95)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--chip-bg" as any]: "rgba(2,6,23,0.04)",
  ["--table-div" as any]: "rgba(15,23,42,0.06)",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
};

/* ---------------- Helpers ---------------- */
function chunk<T>(arr: T[], size = 10): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function toDate(v?: FBTimestamp | Date | null) {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  return null;
}
function nameOf(u?: UserLite | null, fallback?: string) {
  return u?.displayName || u?.email || fallback || "—";
}
function moduleKey(m: ProgramModule) {
  return typeof m === "string" ? m : m?.id || "";
}
function moduleTitle(m: ProgramModule, ix: number) {
  return typeof m === "string" ? m : m?.title || `Module ${ix + 1}`;
}

/* ---------------- Page ---------------- */
export default function AdminProgress() {
  // live: assignments + progress
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );
  const [progress, setProgress] = useState<ProgressDoc[]>([]);

  // joined caches
  const [programs, setPrograms] = useState<Record<string, Program>>({});
  const [users, setUsers] = useState<Record<string, UserLite>>({});

  // filters
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [fpFilter, setFpFilter] = useState<string>("all");

  /* 1) Live assignments */
  useEffect(() => {
    // If you only want active ones, uncomment:
    // const qA = query(collection(db, "assignments"), where("status","==","assigned"));
    const qA = query(collection(db, "assignments"));
    const unsub = onSnapshot(qA, (snap) => {
      const acc: Record<string, Assignment> = {};
      snap.docs.forEach(
        (d) => (acc[d.id] = { id: d.id, ...(d.data() as any) })
      );
      setAssignments(acc);
    });
    return () => unsub();
  }, []);

  /* 2) Live progress */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "progress"), (snap) => {
      setProgress(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  /* 3) Load programs & users referenced by assignments */
  useEffect(() => {
    const a = Object.values(assignments);
    if (a.length === 0) {
      setPrograms({});
      setUsers({});
      return;
    }

    const programIds = Array.from(
      new Set(a.map((x) => x.programId).filter(Boolean) as string[])
    );
    const participantIds = Array.from(
      new Set(a.map((x) => x.participantId).filter(Boolean) as string[])
    );

    (async () => {
      // programs
      const prog: Record<string, Program> = {};
      for (const group of chunk(programIds, 10)) {
        const q = query(
          collection(db, "programs"),
          where("__name__", "in", group)
        );
        const snap = await getDocs(q).catch(() => null);
        if (snap)
          snap.docs.forEach(
            (d) => (prog[d.id] = { id: d.id, ...(d.data() as any) })
          );
      }
      setPrograms(prog);

      // users = participants + fitness partners
      const fpIds = Array.from(
        new Set(
          Object.values(prog)
            .map((p) => p.fitnessPartnerId)
            .filter(Boolean) as string[]
        )
      );
      const userIds = Array.from(new Set([...participantIds, ...fpIds]));

      const nextUsers: Record<string, UserLite> = {};
      for (const group of chunk(userIds, 10)) {
        const q = query(
          collection(db, "users"),
          where("__name__", "in", group)
        );
        const snap = await getDocs(q).catch(() => null);
        if (snap) {
          snap.docs.forEach((d) => {
            const v: any = d.data();
            nextUsers[d.id] = {
              id: d.id,
              displayName: v?.displayName ?? null,
              email: v?.email ?? null,
            };
          });
        } else {
          for (const id of group) {
            const g = await getDoc(doc(db, "users", id)).catch(() => null);
            if (g?.exists()) {
              const v: any = g.data();
              nextUsers[id] = {
                id,
                displayName: v?.displayName ?? null,
                email: v?.email ?? null,
              };
            }
          }
        }
      }
      setUsers(nextUsers);
    })();
  }, [assignments]);

  /* 4) Build UI rows */
  type UiRow = {
    assignmentId: string;
    programId?: string | null;
    programTitle: string;
    fitnessPartnerId?: string | null;
    fitnessPartnerName: string;
    participantId?: string | null;
    participantName: string;
    modules: {
      id: string;
      title: string;
      percent: number;
      updatedAt: Date | null;
    }[];
    overall: number;
    lastUpdated: Date | null;
  };

  const progressByAssign = useMemo(() => {
    const map = new Map<string, ProgressDoc[]>();
    for (const p of progress) {
      if (!p.assignmentId) continue;
      const arr = map.get(p.assignmentId) || [];
      arr.push(p);
      map.set(p.assignmentId, arr);
    }
    return map;
  }, [progress]);

  const uiRows: UiRow[] = useMemo(() => {
    const out: UiRow[] = [];
    for (const a of Object.values(assignments)) {
      // optional: skip pending assignments
      // if (a.status && a.status !== "assigned") continue;

      const program = a.programId ? programs[a.programId] : undefined;
      const programTitle =
        program?.title ||
        (a.programId ? `Program ${String(a.programId).slice(0, 6)}…` : "—");
      const fpName = nameOf(
        program?.fitnessPartnerId ? users[program.fitnessPartnerId] : null,
        program?.fitnessPartnerId || undefined
      );
      const participantName = nameOf(
        a.participantId ? users[a.participantId] : null,
        a.participantId || undefined
      );

      // module order
      let orderedModules: string[] = [];
      if (program?.modules?.length) {
        orderedModules = program.modules.map(
          (m, i) => moduleKey(m) || `m-${i}`
        );
      } else {
        const docs = progressByAssign.get(a.id) || [];
        orderedModules = Array.from(
          new Set(docs.map((p) => p.moduleId).filter(Boolean))
        );
      }

      // progress cells
      const docsByModule = new Map<string, ProgressDoc[]>();
      (progressByAssign.get(a.id) || []).forEach((p) => {
        const arr = docsByModule.get(p.moduleId) || [];
        arr.push(p);
        docsByModule.set(p.moduleId, arr);
      });

      const cells = (orderedModules.length ? orderedModules : ["m-1"]).map(
        (mid, i) => {
          const docs = docsByModule.get(mid) || [];
          let latest = docs[0] || null;
          for (const d of docs) {
            if (!latest) latest = d;
            const lu = toDate(latest?.updatedAt)?.getTime() || 0;
            const cu = toDate(d.updatedAt)?.getTime() || 0;
            if (cu > lu) latest = d;
          }
          const percent = latest?.percent ?? 0;
          const uAt = toDate(latest?.updatedAt);
          const title = program?.modules?.length
            ? moduleTitle(program.modules[i], i)
            : orderedModules.length
            ? `Module ${i + 1}`
            : "Module 1";
          return { id: mid || `m-${i}`, title, percent, updatedAt: uAt };
        }
      );

      const overall =
        cells.length > 0
          ? Math.round(
              cells.reduce(
                (s, c) => s + (Number.isFinite(c.percent) ? c.percent : 0),
                0
              ) / cells.length
            )
          : 0;

      const lastUpdated =
        cells.reduce<Date | null>((acc, c) => {
          if (!c.updatedAt) return acc;
          if (!acc) return c.updatedAt;
          return c.updatedAt.getTime() > acc.getTime() ? c.updatedAt : acc;
        }, null) || null;

      out.push({
        assignmentId: a.id,
        programId: a.programId,
        programTitle,
        fitnessPartnerId: program?.fitnessPartnerId,
        fitnessPartnerName: fpName,
        participantId: a.participantId,
        participantName,
        modules: cells,
        overall,
        lastUpdated,
      });
    }

    // sort: program -> participant
    out.sort(
      (x, y) =>
        (x.programTitle || "").localeCompare(y.programTitle || "") ||
        (x.participantName || "").localeCompare(y.participantName || "")
    );
    return out;
  }, [assignments, programs, users, progressByAssign]);

  /* 5) Filters & stats */
  const programOptions = useMemo(() => {
    const set = new Map<string, string>();
    Object.values(programs).forEach((p) => set.set(p.id, p.title || p.id));
    return Array.from(set.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, title]) => ({ id, title }));
  }, [programs]);

  const fpOptions = useMemo(() => {
    const set = new Map<string, string>();
    Object.values(programs).forEach((p) => {
      if (p.fitnessPartnerId) {
        set.set(
          p.fitnessPartnerId,
          nameOf(users[p.fitnessPartnerId], p.fitnessPartnerId)
        );
      }
    });
    return Array.from(set.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, label]) => ({ id, label }));
  }, [programs, users]);

  const filteredRows = useMemo(() => {
    return uiRows.filter((r) => {
      if (programFilter !== "all" && r.programId !== programFilter)
        return false;
      if (fpFilter !== "all" && r.fitnessPartnerId !== fpFilter) return false;
      return true;
    });
  }, [uiRows, programFilter, fpFilter]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const completed = filteredRows.filter((r) => r.overall >= 100).length;
    const inProgress = filteredRows.filter(
      (r) => r.overall > 0 && r.overall < 100
    ).length;
    const participants = new Set(
      filteredRows.map((r) => r.participantId).filter(Boolean)
    ).size;
    const fps = new Set(
      filteredRows.map((r) => r.fitnessPartnerId).filter(Boolean)
    ).size;
    return { total, completed, inProgress, participants, fps };
  }, [filteredRows]);

  /* 6) UI */
  return (
    <div className="space-y-6 text-[var(--panel-text)]" style={tokens}>
      {/* Filters + Stats */}
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--muted-text)]">Program</label>
            <select
              className="rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
            >
              <option value="all">All</option>
              {programOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--muted-text)]">
              Fitness Partner
            </label>
            <select
              className="rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={fpFilter}
              onChange={(e) => setFpFilter(e.target.value)}
            >
              <option value="all">All</option>
              {fpOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1" />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <StatChip label="Assignments" value={stats.total} />
          <StatChip label="Completed" value={stats.completed} />
          <StatChip label="In Progress" value={stats.inProgress} />
          <StatChip label="Participants" value={stats.participants} />
          <StatChip label="Fitness Partners" value={stats.fps} />
        </div>
      </div>

      {/* Desktop/table */}
      <section className="hidden md:block rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-3 md:p-5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="text-left text-slate-600 border-b border-[var(--panel-border)]">
              <tr>
                <th className="py-2 px-3">Program</th>
                <th className="py-2 px-3">Participant</th>
                <th className="py-2 px-3">Fitness Partner</th>
                <th className="py-2 px-3">Modules</th>
                <th className="py-2 px-3">Overall</th>
                <th className="py-2 px-3">Updated</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                ["--tw-divide-opacity" as any]: 1,
                ["--tw-divide-color" as any]: "var(--table-div)",
              }}
            >
              {filteredRows.map((r) => (
                <tr key={r.assignmentId} className="align-top">
                  <td className="py-2 px-3">{r.programTitle}</td>
                  <td className="py-2 px-3">{r.participantName}</td>
                  <td className="py-2 px-3">{r.fitnessPartnerName}</td>
                  <td className="py-2 px-3">
                    <ModuleGantt cells={r.modules} />
                  </td>
                  <td className="py-2 px-3">
                    <OverallBar value={r.overall} />
                  </td>
                  <td className="py-2 px-3 text-[var(--muted-text)]">
                    {r.lastUpdated
                      ? new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(r.lastUpdated)
                      : "—"}
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-[var(--muted-text)]"
                  >
                    No assignments yet. Assign participants to a program to
                    start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile/cards */}
      <section className="md:hidden grid gap-3">
        {filteredRows.length === 0 && (
          <div className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 text-[var(--muted-text)]">
            No assignments yet.
          </div>
        )}

        {filteredRows.map((r) => (
          <div
            key={r.assignmentId}
            className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-900 font-medium">
                  {r.programTitle}
                </div>
                <div className="text-sm text-[var(--muted-text)]">
                  {r.participantName} · {r.fitnessPartnerName}
                </div>
              </div>
              <div className="shrink-0">
                <OverallBar value={r.overall} className="w-28" />
              </div>
            </div>

            <div className="mt-3">
              <ModuleGantt cells={r.modules} compact />
            </div>

            <div className="mt-3 text-xs text-[var(--muted-text)]">
              {r.lastUpdated
                ? new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(r.lastUpdated)
                : "—"}
            </div>
          </div>
        ))}
      </section>

      <p className="text-xs text-[var(--muted-text)]">
        Tip: Programs appear once they have at least one <b>assignment</b>.
        Modules come from <code>programs.modules</code>; without progress they
        show as 0%.
      </p>
    </div>
  );
}

/* ---------------- UI bits ---------------- */
function StatChip({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] px-3 py-2">
      <div className="text-[11px] text-[var(--muted-text)]">{label}</div>
      <div className="text-lg font-semibold text-[var(--panel-text)]">
        {value}
      </div>
    </div>
  );
}

function ModuleGantt({
  cells,
  compact = false,
}: {
  cells: {
    id: string;
    title: string;
    percent: number;
    updatedAt: Date | null;
  }[];
  compact?: boolean;
}) {
  if (!cells.length)
    return <span className="text-[var(--muted-text)]">No modules</span>;

  const boxW = compact ? "w-8" : "w-10";

  return (
    <div className="flex items-center gap-1 flex-wrap max-w-[560px]">
      {cells.map((c, i) => {
        const color =
          c.percent >= 100
            ? "bg-emerald-500 border-emerald-300"
            : c.percent >= 75
            ? "bg-cyan-500/80 border-cyan-300"
            : c.percent >= 25
            ? "bg-amber-500/80 border-amber-300"
            : c.percent > 0
            ? "bg-rose-500/80 border-rose-300"
            : "bg-slate-200 border-slate-300";

        return (
          <div
            key={c.id || i}
            className={`h-6 ${boxW} rounded-md border relative group overflow-hidden`}
            title={`${c.title} — ${c.percent}%`}
          >
            <div className={`absolute inset-0 ${color}`} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/90">
              {Math.round(c.percent)}%
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[110%] hidden group-hover:block whitespace-nowrap text-[10px] text-white bg-black/70 px-2 py-1 rounded shadow">
              {c.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverallBar({
  value,
  className = "w-40",
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor =
    value >= 100
      ? "bg-emerald-500"
      : value >= 75
      ? "bg-cyan-500"
      : value >= 25
      ? "bg-amber-500"
      : value > 0
      ? "bg-rose-500"
      : "bg-slate-200";

  return (
    <div
      className={`${className} h-3 rounded-full bg-slate-100 overflow-hidden border border-[var(--panel-border)]`}
    >
      <div
        className={`h-full ${barColor}`}
        style={{ width: `${pct}%` }}
        title={`${value}%`}
      />
    </div>
  );
}
