// app/dashboard/admin/progress/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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

  /* 1) Live assignments (drive the table from here) */
  useEffect(() => {
    // If you only want active ones, uncomment where("status","==","assigned")
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

  /* 2) Live progress (to fill module percents if present) */
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

  /* 4) Build UI rows from assignments (progress fills in, default 0%) */
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

      // decide module order
      let orderedModules: string[] = [];
      if (program?.modules?.length) {
        orderedModules = program.modules.map(
          (m, i) => moduleKey(m) || `m-${i}`
        );
      } else {
        // no declared modules -> derive from any progress docs for this assignment
        const docs = progressByAssign.get(a.id) || [];
        orderedModules = Array.from(
          new Set(docs.map((p) => p.moduleId).filter(Boolean))
        );
      }

      // build cells with progress (default 0 if missing)
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

  /* 6) UI bits */
  return (
    <div className="space-y-6">
      {/* Filters + Stats */}
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/70">Program</label>
          <select
            className="rounded-lg bg-slate-900 border border-white/10 p-2"
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
          <label className="text-sm text-white/70">Fitness Partner</label>
          <select
            className="rounded-lg bg-slate-900 border border-white/10 p-2"
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

        <div className="flex-1" />

        <div className="grid grid-cols-5 gap-2">
          <StatChip label="Assignments" value={stats.total} />
          <StatChip label="Completed" value={stats.completed} />
          <StatChip label="In Progress" value={stats.inProgress} />
          <StatChip label="Participants" value={stats.participants} />
          <StatChip label="Fitness Partners" value={stats.fps} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2 pr-4">Program</th>
              <th className="py-2 pr-4">Participant</th>
              <th className="py-2 pr-4">Fitness Partner</th>
              <th className="py-2 pr-4">Modules</th>
              <th className="py-2 pr-4">Overall</th>
              <th className="py-2 pr-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredRows.map((r) => (
              <tr key={r.assignmentId}>
                <td className="py-2 pr-4 align-top">{r.programTitle}</td>
                <td className="py-2 pr-4 align-top">{r.participantName}</td>
                <td className="py-2 pr-4 align-top">{r.fitnessPartnerName}</td>
                <td className="py-2 pr-4 align-top">
                  <ModuleGantt cells={r.modules} />
                </td>
                <td className="py-2 pr-4 align-top">
                  <OverallBar value={r.overall} />
                </td>
                <td className="py-2 pr-4 align-top text-white/60">
                  {r.lastUpdated ? r.lastUpdated.toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/60">
                  No assignments yet. Assign participants to the program to
                  track progress.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/50">
        Tip: New programs appear here once they have at least one{" "}
        <b>assignment</b>. Modules come from <code>programs.modules</code>;
        without progress they show as 0%.
      </p>
    </div>
  );
}

/* ---------------- UI bits ---------------- */
function StatChip({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function ModuleGantt({
  cells,
}: {
  cells: {
    id: string;
    title: string;
    percent: number;
    updatedAt: Date | null;
  }[];
}) {
  if (!cells.length) return <span className="text-white/60">No modules</span>;

  return (
    <div className="flex items-center gap-1 flex-wrap max-w-[560px]">
      {cells.map((c, i) => {
        const color =
          c.percent >= 100
            ? "bg-emerald-500/70 border-emerald-300/60"
            : c.percent >= 75
            ? "bg-cyan-500/50 border-cyan-300/50"
            : c.percent >= 25
            ? "bg-amber-500/40 border-amber-300/40"
            : c.percent > 0
            ? "bg-rose-500/40 border-rose-300/40"
            : "bg-white/5 border-white/10";

        return (
          <div
            key={c.id || i}
            className={`h-6 w-8 md:w-10 rounded-[6px] border relative group`}
            title={`${c.title} — ${c.percent}%`}
          >
            <div className={`absolute inset-0 ${color}`} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/80">
              {Math.round(c.percent)}%
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[110%] hidden group-hover:block whitespace-nowrap text-[10px] text-white/80 bg-black/70 px-2 py-1 rounded">
              {c.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverallBar({ value }: { value: number }) {
  return (
    <div className="w-40 h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
      <div
        className={`h-full ${
          value >= 100
            ? "bg-emerald-500"
            : value >= 75
            ? "bg-cyan-500"
            : value >= 25
            ? "bg-amber-500"
            : value > 0
            ? "bg-rose-500"
            : "bg-white/10"
        }`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        title={`${value}%`}
      />
    </div>
  );
}
