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

interface AssignedClient {
  uid: string;
  name: string;
}

// Simple helper to get the start of the week (Mon)
function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Mon=0..Sun=6
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function SupportWorkerClientManagementFormPage() {
  const { userProfile } = useAuth() as { userProfile: UserProfile | null };
  const [loading, setLoading] = useState(true);

  // Assigned clients
  const [clients, setClients] = useState<AssignedClient[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [clientUid, setClientUid] = useState("");
  const [weekOf, setWeekOf] = useState<string>(() =>
    startOfWeek().toISOString().slice(0, 10)
  ); // yyyy-mm-dd
  const [attendance, setAttendance] = useState<number>(0);
  const [mood, setMood] = useState<"poor" | "fair" | "good" | "great">("good");
  const [incidents, setIncidents] = useState("");
  const [notes, setNotes] = useState("");
  const [goalsProgress, setGoalsProgress] = useState<number>(0); // 0-100

  // Recent submissions (for this worker)
  const [recent, setRecent] = useState<
    Array<{
      id: string;
      submissionDate: Timestamp;
      clientName?: string;
      weekOf?: Timestamp;
      status: string;
    }>
  >([]);

  // Gate: only support workers
  if (!userProfile) return null;
  if (userProfile.role !== "support_worker") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">This page is only for Support Workers.</p>
      </div>
    );
  }

  // Load assigned clients & recent submissions
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // 1) Assigned clients from `assignments` (supportWorkerUid -> clientUid)
        const asnSnap = await getDocs(
          query(
            collection(db, "assignments"),
            where("supportWorkerUid", "==", userProfile.uid)
          )
        );
        const clientUids = Array.from(
          new Set(asnSnap.docs.map((d) => d.data()?.clientUid as string))
        );

        // Resolve client names from `users`
        const resolved: AssignedClient[] = [];
        for (const uid of clientUids) {
          const uDoc = await getDoc(doc(db, "users", uid));
          const d = uDoc.data();
          resolved.push({
            uid,
            name:
              d?.displayName ||
              d?.name ||
              `${d?.firstName ?? ""} ${d?.lastName ?? ""}`.trim() ||
              uid,
          });
        }
        // Sort by name
        resolved.sort((a, b) => a.name.localeCompare(b.name));
        setClients(resolved);
        if (!clientUid && resolved[0]) setClientUid(resolved[0].uid);

        // 2) Recent submissions (this worker)
        const rSnap = await getDocs(
          query(
            collection(db, "forms"),
            where("role", "==", "support_worker"),
            where("submittedByUid", "==", userProfile.uid),
            orderBy("submissionDate", "desc"),
            limit(10)
          )
        );
        setRecent(
          rSnap.docs.map((d) => ({
            id: d.id,
            submissionDate: d.data()?.submissionDate as Timestamp,
            clientName: d.data()?.clientName,
            weekOf: d.data()?.weekOf as Timestamp | undefined,
            status: d.data()?.status || "submitted",
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

  const canSubmit = useMemo(() => {
    return clientUid && weekOf && attendance >= 0 && goalsProgress >= 0;
  }, [clientUid, weekOf, attendance, goalsProgress]);

  const resetForm = () => {
    setAttendance(0);
    setMood("good");
    setIncidents("");
    setNotes("");
    setGoalsProgress(0);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessId(null);
    try {
      const clientName = clients.find((c) => c.uid === clientUid)?.name || "";

      // Construct Firestore doc (aligns with admin table you have)
      const payload = {
        type: "Client Management Form",
        role: "support_worker" as const,
        submittedByUid: userProfile.uid,
        submittedByName: userProfile.displayName,
        submissionDate: Timestamp.now(),
        status: "pending_review" as const, // admin/service_provider can change later
        // form-specific fields:
        targetUid: clientUid,
        clientName,
        weekOf: Timestamp.fromDate(new Date(weekOf + "T00:00:00")),
        attendance, // number of sessions attended this week
        mood,
        incidents: incidents.trim() || null,
        notes: notes.trim() || null,
        goalsProgress, // %
        // meta for admin stats
        dataPoints: [
          attendance,
          goalsProgress,
          mood ? 1 : 0,
          incidents ? 1 : 0,
          notes ? 1 : 0,
        ].filter((v) => v !== null && v !== undefined).length,
        completionRate: Math.min(
          100,
          Math.round(
            ([
              attendance !== null,
              !!mood,
              true, // weekOf
              true, // client
            ].filter(Boolean).length /
              4) *
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
          clientName: payload.clientName,
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
          Weekly Client Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Submit your weekly monitoring form for each assigned client.
        </p>
      </header>

      {/* Alerts */}
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

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading assigned clients & recent submissions…
        </div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Client */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Client
                </span>
                <select
                  value={clientUid}
                  onChange={(e) => setClientUid(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                >
                  {clients.length === 0 ? (
                    <option value="">No clients assigned</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.uid} value={c.uid}>
                        {c.name}
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
              {/* Attendance */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Sessions Attended (this week)
                </span>
                <input
                  type="number"
                  min={0}
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>

              {/* Mood */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Overall Mood
                </span>
                <select
                  value={mood}
                  onChange={(e) =>
                    setMood(
                      e.target.value as "poor" | "fair" | "good" | "great"
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="great">Great</option>
                </select>
              </label>

              {/* Goals */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Goals Progress (%)
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={goalsProgress}
                  onChange={(e) => setGoalsProgress(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Incidents / Risks (optional)
              </span>
              <textarea
                value={incidents}
                onChange={(e) => setIncidents(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Any incidents, safeguarding concerns, or risk notes…"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Notes (optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="General observations, wins, concerns, next steps…"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit || submitting || clients.length === 0}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Weekly Form
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
                      <th className="text-left px-4 py-2">Client</th>
                      <th className="text-left px-4 py-2">Week Of</th>
                      <th className="text-left px-4 py-2">Submitted</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-2">{r.clientName || "—"}</td>
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
