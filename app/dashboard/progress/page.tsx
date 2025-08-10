"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Dumbbell,
  FileDown,
  Loader2,
  Target,
} from "lucide-react";

type Role =
  | "admin"
  | "participant"
  | "instructor"
  | "fitness_partner"
  | "service_provider"
  | "support_worker";

interface UserProfile {
  uid: string;
  role: Role;
  displayName: string;
  email?: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  instructorUid?: string;
  instructorName?: string;
  durationWeeks?: number;
  startDate?: Timestamp | null;
  endDate?: Timestamp | null;
}

interface SessionLite {
  id: string;
  date: Timestamp;
  status: "upcoming" | "completed" | "missed";
  title?: string;
  facilityName?: string;
}

interface MyPlan {
  week: number;
  focus: string; // e.g., "Strength / Mobility"
  notes?: string;
}

export default function ParticipantTrainingProgramPage() {
  const { userProfile } = useAuth() as { userProfile: UserProfile | null };

  if (!userProfile) return null;
  if (userProfile.role !== "participant") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">This page is only for Participants.</p>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [upcoming, setUpcoming] = useState<SessionLite[]>([]);
  const [plan, setPlan] = useState<MyPlan[]>([]);
  const [downloading, setDownloading] = useState(false);

  // Load my programs + default active program
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // Programs where I'm enrolled
        const ps = await getDocs(
          query(
            collection(db, "programs"),
            where("participants", "array-contains", userProfile.uid)
          )
        );

        const list: Program[] = [];
        for (const d of ps.docs) {
          const p = d.data() as any;
          let instructorName = p?.instructorName;
          if (!instructorName && p?.instructorUid) {
            const insDoc = await getDoc(doc(db, "users", p.instructorUid));
            const u = insDoc.data() as any;
            instructorName =
              u?.displayName ||
              u?.name ||
              `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim();
          }
          list.push({
            id: d.id,
            name: p?.name || "Untitled Program",
            description: p?.description,
            difficulty: p?.difficulty,
            instructorUid: p?.instructorUid,
            instructorName: instructorName || undefined,
            durationWeeks: p?.durationWeeks,
            startDate: p?.startDate ?? null,
            endDate: p?.endDate ?? null,
          });
        }

        list.sort((a, b) => a.name.localeCompare(b.name));
        setPrograms(list);
        if (!activeId && list[0]) setActiveId(list[0].id);
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.uid]);

  // Load my next sessions & plan for selected program
  useEffect(() => {
    const run = async () => {
      if (!activeId) return;
      setLoading(true);
      try {
        // Next 10 upcoming sessions for me in this program
        const now = Timestamp.now();
        const sSnap = await getDocs(
          query(
            collection(db, "sessions"),
            where("programId", "==", activeId),
            where("participantUid", "==", userProfile.uid),
            where("date", ">=", now),
            orderBy("date", "asc"),
            limit(10)
          )
        );
        setUpcoming(
          sSnap.docs.map((d) => {
            const s = d.data() as any;
            return {
              id: d.id,
              date: s?.date as Timestamp,
              status: (s?.status as SessionLite["status"]) || "upcoming",
              title: s?.title || "Session",
              facilityName: s?.facilityName,
            };
          })
        );

        // Per-user plan:
        // Preferred: programs/{id}/plans/{uid} with { items: [{week, focus, notes}] }
        // Fallback: programs/{id}/plan (same shape for everyone)
        let items: MyPlan[] = [];
        const myPlanDoc = await getDoc(
          doc(db, "programs", activeId, "plans", userProfile.uid)
        );
        if (myPlanDoc.exists()) {
          const data = myPlanDoc.data() as any;
          items = (data?.items || []) as MyPlan[];
        } else {
          const progDoc = await getDoc(doc(db, "programs", activeId));
          const data = progDoc.data() as any;
          items = (data?.plan?.items || []) as MyPlan[];
        }
        // sanitize & sort
        items = (items || [])
          .filter((x) => typeof x?.week === "number" && x?.focus)
          .sort((a, b) => a.week - b.week);
        setPlan(items);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [activeId, userProfile.uid]);

  const activeProgram = useMemo(
    () => programs.find((p) => p.id === activeId),
    [programs, activeId]
  );

  const onDownloadPlan = async () => {
    if (!activeProgram) return;
    setDownloading(true);
    try {
      // Create a CSV on the fly (works offline)
      const header = ["Week", "Focus", "Notes"];
      const rows = plan.map((i) => [
        i.week,
        i.focus,
        (i.notes || "").replace(/\n/g, " "),
      ]);
      const lines = [header, ...rows].map((r) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      );
      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProgram.name.replace(/\s+/g, "_")}_plan.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Your Training Program
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View your assigned programs, upcoming sessions, and weekly plan.
        </p>
      </header>

      {/* Program selector */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Program
          </span>
          <select
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
          >
            {programs.length === 0 ? (
              <option value="">No programs assigned</option>
            ) : (
              programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.difficulty ? ` — ${p.difficulty}` : ""}
                </option>
              ))
            )}
          </select>
        </label>

        {/* Program meta */}
        {activeProgram && (
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                <Dumbbell className="w-5 h-5" />
                {activeProgram.instructorName || "Instructor"}
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {activeProgram.description || "—"}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                <Target className="w-5 h-5" />
                Duration
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {activeProgram.durationWeeks
                  ? `${activeProgram.durationWeeks} weeks`
                  : "—"}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                <Calendar className="w-5 h-5" />
                Dates
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {activeProgram.startDate
                  ? activeProgram.startDate.toDate().toLocaleDateString()
                  : "—"}{" "}
                –{" "}
                {activeProgram.endDate
                  ? activeProgram.endDate.toDate().toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming sessions */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Upcoming Sessions
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-slate-500">No upcoming sessions.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Facility</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">
                      {s.date.toDate().toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{s.title || "Session"}</td>
                    <td className="px-4 py-2">{s.facilityName || "—"}</td>
                    <td className="px-4 py-2 capitalize">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Weekly plan */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Weekly Plan
            </h2>
          </div>
          <button
            onClick={onDownloadPlan}
            disabled={!plan.length || downloading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
            title="Download CSV"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Download Plan
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : plan.length === 0 ? (
          <div className="text-slate-500">
            Your plan isn’t available yet. Check back soon or contact your
            instructor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left px-4 py-2">Week</th>
                  <th className="text-left px-4 py-2">Focus</th>
                  <th className="text-left px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((i) => (
                  <tr key={i.week} className="border-t">
                    <td className="px-4 py-2">Week {i.week}</td>
                    <td className="px-4 py-2">{i.focus}</td>
                    <td className="px-4 py-2">{i.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Completion hint */}
        <div className="mt-4 flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Sessions you complete will show up on your dashboard stats and
          progress.
        </div>
      </div>
    </div>
  );
}
