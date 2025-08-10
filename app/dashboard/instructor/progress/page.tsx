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
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertCircle,
  Loader2,
  Search,
  Users,
  TrendingUp,
  Calendar,
  ClipboardList,
  Edit3,
  Save,
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

interface ParticipantRow {
  uid: string;
  name: string;
  progressScore: number; // 0-100
  adherence?: number; // % if stored
  riskFlag?: boolean;
  lastSession?: Timestamp | null;
  notesPreview?: string;
}

export default function InstructorProgressOverviewPage() {
  const { userProfile } = useAuth() as { userProfile: UserProfile | null };

  if (!userProfile) return null;
  if (userProfile.role !== "instructor") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">This page is only for Instructors.</p>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ParticipantRow[]>([]);
  const [search, setSearch] = useState("");
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<Record<string, number>>({});

  // Load participants assigned to this instructor
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // Find distinct participant UIDs from sessions taught by this instructor
        const sessSnap = await getDocs(
          query(
            collection(db, "sessions"),
            where("instructorUid", "==", userProfile.uid)
          )
        );
        const participantUids = Array.from(
          new Set(
            sessSnap.docs
              .map((d) => (d.data() as any)?.participantUid)
              .filter(Boolean)
          )
        ) as string[];

        // Resolve last session per participant
        const lastByParticipant: Record<string, Timestamp> = {};
        sessSnap.docs.forEach((d) => {
          const s = d.data() as any;
          const p = s?.participantUid as string;
          const when = s?.date as Timestamp;
          if (!p || !when) return;
          if (
            !lastByParticipant[p] ||
            when.toMillis() > lastByParticipant[p].toMillis()
          ) {
            lastByParticipant[p] = when;
          }
        });

        // Fetch participant user docs
        const items: ParticipantRow[] = [];
        for (const uid of participantUids) {
          const uDoc = await getDoc(doc(db, "users", uid));
          const u = uDoc.data() as any;
          items.push({
            uid,
            name:
              u?.displayName ||
              u?.name ||
              `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
              uid,
            progressScore: Math.round(u?.progressScore ?? 0),
            adherence:
              typeof u?.adherence === "number"
                ? Math.round(u.adherence)
                : undefined,
            riskFlag: !!u?.riskFlag,
            lastSession: lastByParticipant[uid] ?? null,
            notesPreview: u?.lastProgressNote || "",
          });
        }

        // Sort by name initially
        items.sort((a, b) => a.name.localeCompare(b.name));
        setRows(items);
        setEditProgress(
          Object.fromEntries(items.map((r) => [r.uid, r.progressScore ?? 0]))
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userProfile.uid]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(s));
  }, [rows, search]);

  const avgProgress = useMemo(() => {
    if (!rows.length) return 0;
    const sum = rows.reduce((a, r) => a + (r.progressScore || 0), 0);
    return Math.round(sum / rows.length);
  }, [rows]);

  const activeCount = rows.length;
  const sessionsThisWeek = useMemo(() => {
    const now = Timestamp.now();
    const weekAgo = Timestamp.fromMillis(
      now.toMillis() - 7 * 24 * 60 * 60 * 1000
    );
    return rows.filter((r) => !!r.lastSession && r.lastSession! >= weekAgo)
      .length;
  }, [rows]);

  const saveProgressFor = async (uid: string) => {
    try {
      setSavingUid(uid);
      const newScore = Math.max(0, Math.min(100, editProgress[uid] ?? 0));
      await updateDoc(doc(db, "users", uid), { progressScore: newScore });
      // reflect in table
      setRows((prev) =>
        prev.map((r) => (r.uid === uid ? { ...r, progressScore: newScore } : r))
      );
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeCount}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Active Participants
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-4">
            <TrendingUp className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {avgProgress}%
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Avg Progress Score
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
            <Calendar className="w-6 h-6 text-purple-700 dark:text-purple-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {sessionsThisWeek}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Had Sessions This Week
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants…"
            className="w-full pl-11 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="text-left px-4 py-3">Participant</th>
              <th className="text-left px-4 py-3">Progress</th>
              <th className="text-left px-4 py-3">Adherence</th>
              <th className="text-left px-4 py-3">Last Session</th>
              <th className="text-left px-4 py-3">Notes</th>
              <th className="text-left px-4 py-3">Risk</th>
              <th className="text-left px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading participants…
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No participants found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.uid}
                  className="border-t border-slate-200/60 dark:border-slate-700/60"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editProgress[r.uid] ?? r.progressScore ?? 0}
                        onChange={(e) =>
                          setEditProgress((prev) => ({
                            ...prev,
                            [r.uid]: Number(e.target.value),
                          }))
                        }
                        className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                      <span className="text-slate-500">% </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {typeof r.adherence === "number" ? `${r.adherence}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.lastSession
                      ? r.lastSession.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 max-w-[280px] truncate">
                    {r.notesPreview || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.riskFlag ? (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                        At Risk
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={savingUid === r.uid}
                      onClick={() => saveProgressFor(r.uid)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
                      title="Save progress score"
                    >
                      {savingUid === r.uid ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick tips */}
      <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <ClipboardList className="w-5 h-5" />
          Progress is saved to each participant’s{" "}
          <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
            users/{`{uid}`}
          </code>{" "}
          doc under{" "}
          <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
            progressScore
          </code>
          . Last-session dates are derived from{" "}
          <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
            sessions
          </code>
          .
        </div>
      </div>
    </div>
  );
}
