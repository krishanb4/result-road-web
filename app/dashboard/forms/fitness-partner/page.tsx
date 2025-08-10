"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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

interface ManagedGroup {
  id: string;
  name: string;
  facilityName?: string;
  capacity?: number;
}

function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Mon=0..Sun=6
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function FitnessPartnerGroupManagementFormPage() {
  const { userProfile } = useAuth() as { userProfile: UserProfile | null };

  // Gate
  if (!userProfile) return null;
  if (userProfile.role !== "fitness_partner") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">This page is only for Fitness Partners.</p>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<ManagedGroup[]>([]);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [groupId, setGroupId] = useState("");
  const [weekOf, setWeekOf] = useState<string>(() =>
    startOfWeek().toISOString().slice(0, 10)
  ); // yyyy-mm-dd
  const [sessionsHeld, setSessionsHeld] = useState<number>(0);
  const [avgAttendance, setAvgAttendance] = useState<number>(0);
  const [incidents, setIncidents] = useState("");
  const [notes, setNotes] = useState("");
  const [equipmentIssues, setEquipmentIssues] = useState("");
  const [capacityUtilization, setCapacityUtilization] = useState<number>(0); // %

  // Recent submissions (this partner)
  const [recent, setRecent] = useState<
    Array<{
      id: string;
      submissionDate: Timestamp;
      groupName?: string;
      weekOf?: Timestamp;
      status: string;
    }>
  >([]);

  // Load partner groups + recent submissions
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // 1) Groups managed by this partner
        const gSnap = await getDocs(
          query(
            collection(db, "groups"),
            where("fitnessPartnerUid", "==", userProfile.uid)
          )
        );
        const items: ManagedGroup[] = [];
        for (const d of gSnap.docs) {
          const data = d.data() as any;
          let facilityName: string | undefined = data?.facilityName;
          if (!facilityName && data?.facilityId) {
            const fDoc = await getDoc(doc(db, "facilities", data.facilityId));
            facilityName = (fDoc.data() as any)?.name;
          }
          items.push({
            id: d.id,
            name: data?.name || "Unnamed Group",
            capacity: data?.capacity ?? undefined,
            facilityName,
          });
        }
        items.sort((a, b) => a.name.localeCompare(b.name));
        setGroups(items);
        if (!groupId && items[0]) setGroupId(items[0].id);

        // 2) Recent submissions by this partner
        const rSnap = await getDocs(
          query(
            collection(db, "forms"),
            where("role", "==", "fitness_partner"),
            where("submittedByUid", "==", userProfile.uid),
            orderBy("submissionDate", "desc"),
            limit(10)
          )
        );
        setRecent(
          rSnap.docs.map((d) => ({
            id: d.id,
            submissionDate: (d.data() as any)?.submissionDate as Timestamp,
            groupName: (d.data() as any)?.groupName,
            weekOf: (d.data() as any)?.weekOf,
            status: (d.data() as any)?.status || "submitted",
          }))
        );
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.uid]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === groupId),
    [groups, groupId]
  );

  const canSubmit = useMemo(() => {
    return (
      groupId &&
      weekOf &&
      sessionsHeld >= 0 &&
      avgAttendance >= 0 &&
      capacityUtilization >= 0 &&
      capacityUtilization <= 100
    );
  }, [groupId, weekOf, sessionsHeld, avgAttendance, capacityUtilization]);

  const resetForm = () => {
    setSessionsHeld(0);
    setAvgAttendance(0);
    setIncidents("");
    setNotes("");
    setEquipmentIssues("");
    setCapacityUtilization(0);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessId(null);
    try {
      const groupName = selectedGroup?.name || "";
      const facilityName = selectedGroup?.facilityName || "";
      const capacity = selectedGroup?.capacity ?? null;

      // Compose Firestore payload — matches Admin/Forms schema
      const payload = {
        type: "Group Management Form",
        role: "fitness_partner" as const,
        submittedByUid: userProfile.uid,
        submittedByName: userProfile.displayName,
        submissionDate: Timestamp.now(),
        status: "pending_review" as const,

        // form-specific fields
        groupId,
        groupName,
        facilityName: facilityName || null,
        capacity,
        weekOf: Timestamp.fromDate(new Date(weekOf + "T00:00:00")),
        sessionsHeld,
        avgAttendance,
        capacityUtilization, // %
        incidents: incidents.trim() || null,
        equipmentIssues: equipmentIssues.trim() || null,
        notes: notes.trim() || null,

        // meta for admin stats
        dataPoints: [
          sessionsHeld,
          avgAttendance,
          capacityUtilization,
          incidents ? 1 : 0,
          equipmentIssues ? 1 : 0,
          notes ? 1 : 0,
        ].length,
        completionRate: Math.min(
          100,
          Math.round(
            ([
              sessionsHeld !== null,
              avgAttendance !== null,
              capacityUtilization !== null,
              true, // group
              true, // weekOf
            ].filter(Boolean).length /
              5) *
              100
          )
        ),
      };

      const ref = await addDoc(collection(db, "forms"), payload);
      setSuccessId(ref.id);

      // prepend to recent
      setRecent((prev) => [
        {
          id: ref.id,
          submissionDate: payload.submissionDate,
          groupName: payload.groupName,
          weekOf: payload.weekOf,
          status: payload.status,
        },
        ...prev,
      ]);

      resetForm();
    } catch (e: any) {
      setErrorMsg(e?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Group Management (Weekly)
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Submit weekly group activity details for the groups you manage.
        </p>
      </header>

      {errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}
      {successId && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <div>Form submitted successfully (ID: {successId}).</div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading groups & recent submissions…
        </div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Group */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Group
                </span>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                >
                  {groups.length === 0 ? (
                    <option value="">No groups assigned</option>
                  ) : (
                    groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                        {g.facilityName ? ` — ${g.facilityName}` : ""}
                      </option>
                    ))
                  )}
                </select>
              </label>

              {/* Week Of */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Week Of (Monday)
                </span>
                <input
                  type="date"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Sessions Held */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Sessions Held (this week)
                </span>
                <input
                  type="number"
                  min={0}
                  value={sessionsHeld}
                  onChange={(e) => setSessionsHeld(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>

              {/* Avg Attendance */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Average Attendance
                </span>
                <input
                  type="number"
                  min={0}
                  value={avgAttendance}
                  onChange={(e) => setAvgAttendance(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>

              {/* Capacity Utilization */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Capacity Utilization (%)
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={capacityUtilization}
                  onChange={(e) =>
                    setCapacityUtilization(Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>
            </div>

            {/* Equipment Issues */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Equipment Issues (optional)
              </span>
              <textarea
                value={equipmentIssues}
                onChange={(e) => setEquipmentIssues(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Report any equipment faults or shortages…"
              />
            </label>

            {/* Incidents */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Incidents / Risks (optional)
              </span>
              <textarea
                value={incidents}
                onChange={(e) => setIncidents(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Any incidents, safeguarding concerns, or risks…"
              />
            </label>

            {/* Notes */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Notes (optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="General updates, feedback, or requests…"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit || submitting || groups.length === 0}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Weekly Group Form
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Recent submissions */}
          <section className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
              Your Recent Submissions
            </h2>
            {recent.length === 0 ? (
              <div className="text-slate-500">No submissions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-700/50">
                    <tr>
                      <th className="text-left px-4 py-2">Group</th>
                      <th className="text-left px-4 py-2">Week Of</th>
                      <th className="text-left px-4 py-2">Submitted</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-2">{r.groupName || "—"}</td>
                        <td className="px-4 py-2">
                          {r.weekOf
                            ? r.weekOf.toDate().toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          {r.submissionDate.toDate().toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{r.status}</td>
                        <td className="px-4 py-2">{r.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
