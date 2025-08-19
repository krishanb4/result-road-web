"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Users,
  ClipboardList,
  FolderKanban,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react";

/* ---------- helpers ---------- */

function lastNDays(n: number) {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d.toISOString().slice(0, 10)); // yyyy-mm-dd
  }
  return out;
}

function bucketByDay(docs: Array<{ createdAt?: any }>, days: string[]) {
  const map = new Map(days.map((d) => [d, 0]));
  for (const doc of docs) {
    const t =
      doc.createdAt?.toDate?.() instanceof Date
        ? doc.createdAt.toDate()
        : doc.createdAt instanceof Date
        ? doc.createdAt
        : null;
    if (!t) continue;
    const key = new Date(t.getFullYear(), t.getMonth(), t.getDate())
      .toISOString()
      .slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  }
  return days.map((d) => map.get(d) || 0);
}

/* ---------- tiny, dependency-free charts ---------- */

function Sparkline({
  series,
  height = 64,
  stroke = "stroke-emerald-500",
}: {
  series: number[];
  height?: number;
  stroke?: string;
}) {
  const width = 240;
  const points = useMemo(() => {
    if (!series.length) return "";
    const max = Math.max(...series, 1);
    const min = Math.min(...series, 0);
    const span = Math.max(max - min, 1);
    const stepX = width / Math.max(series.length - 1, 1);
    return series
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / span) * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [series, height]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <polyline
        className={`${stroke} fill-none`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function TwoBar({
  a,
  b,
  aLabel,
  bLabel,
}: {
  a: number;
  b: number;
  aLabel: string;
  bLabel: string;
}) {
  const max = Math.max(a, b, 1);
  return (
    <div className="flex items-end gap-3 h-40">
      <div className="flex-1 flex flex-col items-center">
        <div
          className="w-full max-w-16 rounded-t-md bg-emerald-500/20 border border-emerald-400/30"
          style={{ height: `${(a / max) * 100}%` }}
          title={`${aLabel}: ${a}`}
        />
        <div className="text-xs mt-2 text-slate-600">{aLabel}</div>
        <div className="text-xs text-slate-500">{a}</div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div
          className="w-full max-w-16 rounded-t-md bg-rose-500/20 border border-rose-400/30"
          style={{ height: `${(b / max) * 100}%` }}
          title={`${bLabel}: ${b}`}
        />
        <div className="text-xs mt-2 text-slate-600">{bLabel}</div>
        <div className="text-xs text-slate-500">{b}</div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

type Row = { id: string; name?: string; email?: string; createdAt?: any };

export default function AdminHome() {
  const [stats, setStats] = useState({
    participants: 0,
    registrations: 0,
    forms: 0,
    assignments: 0,
    programs: 0,
    programsActive: 0,
    programsInactive: 0,
  });

  const [latestRegs, setLatestRegs] = useState<Row[]>([]);
  const [regSeries, setRegSeries] = useState<number[]>([]);
  const [formSeries, setFormSeries] = useState<number[]>([]);
  const days = useMemo(() => lastNDays(14), []);

  useEffect(() => {
    (async () => {
      // counts
      const participantsQ = query(
        collection(db, "users"),
        where("role", "==", "participant")
      );
      const programsQ = collection(db, "programs");
      const programsActiveQ = query(
        collection(db, "programs"),
        where("active", "==", true)
      );
      const programsInactiveQ = query(
        collection(db, "programs"),
        where("active", "==", false)
      );
      const regsQ = collection(db, "registrations");
      const formsQ = collection(db, "forms");
      const assignmentsQ = collection(db, "assignments");

      const [
        participantsC,
        programsC,
        programsActiveC,
        programsInactiveC,
        regsC,
        formsC,
        assignmentsC,
      ] = await Promise.all([
        getCountFromServer(participantsQ),
        getCountFromServer(programsQ),
        getCountFromServer(programsActiveQ),
        getCountFromServer(programsInactiveQ),
        getCountFromServer(regsQ),
        getCountFromServer(formsQ),
        getCountFromServer(assignmentsQ),
      ]);

      setStats({
        participants: participantsC.data().count,
        registrations: regsC.data().count,
        forms: formsC.data().count,
        assignments: assignmentsC.data().count,
        programs: programsC.data().count,
        programsActive: programsActiveC.data().count,
        programsInactive: programsInactiveC.data().count,
      });

      // latest registrations (5)
      try {
        const latestQ = query(
          collection(db, "registrations"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const latestSnap = await getDocs(latestQ);
        setLatestRegs(
          latestSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        );
      } catch {
        setLatestRegs([]);
      }

      // time-series: last 14 days for registrations & forms
      const start = new Date(days[0] + "T00:00:00");
      const startTs = Timestamp.fromDate(start);

      const [regSnap, formSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, "registrations"),
            where("createdAt", ">=", startTs),
            orderBy("createdAt", "asc")
          )
        ).catch(() => null),
        getDocs(
          query(
            collection(db, "forms"),
            where("createdAt", ">=", startTs),
            orderBy("createdAt", "asc")
          )
        ).catch(() => null),
      ]);

      setRegSeries(
        regSnap
          ? bucketByDay(
              regSnap.docs.map((d) => d.data()),
              days
            )
          : new Array(days.length).fill(0)
      );
      setFormSeries(
        formSnap
          ? bucketByDay(
              formSnap.docs.map((d) => d.data()),
              days
            )
          : new Array(days.length).fill(0)
      );
    })();
  }, [days]);

  // 🎨 Light surface tokens (themeable via ThemeContext)
  const tokens = useMemo(
    () =>
      ({
        ["--panel-bg" as any]: "rgba(255,255,255,0.9)",
        ["--panel-border" as any]: "rgba(15,23,42,0.08)", // slate-900 @ 8%
        ["--panel-text" as any]: "#0f172a", // slate-900
        ["--muted-text" as any]: "#475569", // slate-600
        ["--chip-bg" as any]: "rgba(2,6,23,0.04)",
        ["--table-div" as any]: "rgba(15,23,42,0.06)",
      } as React.CSSProperties),
    []
  );

  const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = "",
  }) => (
    <div
      style={tokens}
      className={`rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur p-4 ${className}`}
    >
      {children}
    </div>
  );

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number | string;
    icon: JSX.Element;
  }) => (
    <div
      style={tokens}
      className="rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 flex items-center gap-3"
    >
      <div className="rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] p-2 text-slate-700">
        {icon}
      </div>
      <div>
        <div className="text-sm text-[var(--muted-text)]">{title}</div>
        <div className="text-2xl font-semibold text-[var(--panel-text)]">
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-[var(--panel-text)]" style={tokens}>
      {/* top stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatCard
          title="Participants"
          value={stats.participants}
          icon={<Users size={18} />}
        />
        <StatCard
          title="Programs"
          value={stats.programs}
          icon={<FolderKanban size={18} />}
        />
        <StatCard
          title="Assignments"
          value={stats.assignments}
          icon={<BarChart3 size={18} />}
        />
        <StatCard
          title="Registrations"
          value={stats.registrations}
          icon={<ClipboardList size={18} />}
        />
        <StatCard
          title="Forms Submitted"
          value={stats.forms}
          icon={<FileText size={18} />}
        />
      </div>

      {/* charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* registrations sparkline */}
        <Panel>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[var(--muted-text)]">
              Registrations · Last 14 days
            </div>
            <Activity size={16} className="text-slate-500" />
          </div>
          <Sparkline series={regSeries} />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{days[0].slice(5)}</span>
            <span>{days[days.length - 1].slice(5)}</span>
          </div>
        </Panel>

        {/* forms sparkline */}
        <Panel>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[var(--muted-text)]">
              Forms · Last 14 days
            </div>
            <Activity size={16} className="text-slate-500" />
          </div>
          <Sparkline series={formSeries} stroke="stroke-cyan-500" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{days[0].slice(5)}</span>
            <span>{days[days.length - 1].slice(5)}</span>
          </div>
        </Panel>

        {/* programs status bars */}
        <Panel>
          <div className="text-sm text-[var(--muted-text)] mb-2">
            Programs Status
          </div>
          <TwoBar
            a={stats.programsActive}
            b={stats.programsInactive}
            aLabel="Active"
            bLabel="Inactive"
          />
        </Panel>
      </div>

      {/* latest registrations */}
      <Panel>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-[var(--muted-text)]">
            Latest Registrations
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600 border-b border-[var(--panel-border)]">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">When</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                ["--tw-divide-opacity" as any]: 1,
                ["--tw-divide-color" as any]: "var(--table-div)",
              }}
            >
              {latestRegs.map((r) => (
                <tr key={r.id} className="text-slate-800">
                  <td className="py-2 pr-4">{(r as any).name || "—"}</td>
                  <td className="py-2 pr-4">{(r as any).email || "—"}</td>
                  <td className="py-2 pr-4 text-slate-500">
                    {r.createdAt?.toDate?.()
                      ? new Date(r.createdAt.toDate()).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
              {latestRegs.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    No recent registrations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* tip */}
      <p className="text-xs text-slate-500">
        Tip: these charts rely on a <code>createdAt</code> timestamp on{" "}
        <code>registrations</code> and <code>forms</code>. Make sure your writes
        use <code>serverTimestamp()</code>.
      </p>
    </div>
  );
}
