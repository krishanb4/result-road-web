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

interface ParticipantLite {
  uid: string;
  name: string;
}

export default function ServiceProviderFeedbackFormPage() {
  const { userProfile } = useAuth() as { userProfile: UserProfile | null };

  if (!userProfile) return null;
  if (userProfile.role !== "service_provider") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">
          This page is only for Service Providers.
        </p>
      </div>
    );
  }

  // Loading/state
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<ParticipantLite[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [participantUid, setParticipantUid] = useState("");
  const [overallRating, setOverallRating] = useState<number>(3); // 1-5
  const [engagement, setEngagement] = useState<number>(3); // 1-5
  const [adherence, setAdherence] = useState<number>(3); // 1-5
  const [risks, setRisks] = useState("");
  const [notes, setNotes] = useState("");
  const [nextActions, setNextActions] = useState("");
  const [followUpDate, setFollowUpDate] = useState<string>(""); // yyyy-mm-dd

  // Recent submissions (for this provider)
  const [recent, setRecent] = useState<
    Array<{
      id: string;
      submissionDate: Timestamp;
      participantName?: string;
      status: string;
    }>
  >([]);

  // Load active participants in this provider's caseload + recent submissions
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // Participants tied to this provider (collection: clients OR users where role==participant)
        // If you store a clients collection, prefer that. Fallback to users with role filter.
        const clSnap = await getDocs(
          query(
            collection(db, "clients"),
            where("serviceProviderUid", "==", userProfile.uid),
            where("active", "==", true)
          )
        );

        let list: ParticipantLite[] = clSnap.docs.map((d) => {
          const c = d.data() as any;
          return {
            uid: c?.participantUid || c?.uid || d.id,
            name:
              c?.participantName ||
              c?.name ||
              `${c?.firstName ?? ""} ${c?.lastName ?? ""}`.trim() ||
              c?.participantUid ||
              d.id,
          };
        });

        // If no clients collection found/used, try users role=participant (comment this out if not needed)
        if (list.length === 0) {
          const uSnap = await getDocs(
            query(collection(db, "users"), where("role", "==", "participant"))
          );
          list = uSnap.docs.map((d) => {
            const u = d.data() as any;
            return {
              uid: d.id,
              name:
                u?.displayName ||
                u?.name ||
                `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
                d.id,
            };
          });
        }

        list.sort((a, b) => a.name.localeCompare(b.name));
        setParticipants(list);
        if (!participantUid && list[0]) setParticipantUid(list[0].uid);

        // Recent submissions by this provider
        const rSnap = await getDocs(
          query(
            collection(db, "forms"),
            where("role", "==", "service_provider"),
            where("submittedByUid", "==", userProfile.uid),
            orderBy("submissionDate", "desc"),
            limit(10)
          )
        );
        setRecent(
          rSnap.docs.map((d) => ({
            id: d.id,
            submissionDate: (d.data() as any)?.submissionDate as Timestamp,
            participantName: (d.data() as any)?.participantName,
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

  // Derived
  const selectedParticipant = useMemo(
    () => participants.find((p) => p.uid === participantUid),
    [participants, participantUid]
  );

  const canSubmit = useMemo(() => {
    return (
      participantUid &&
      overallRating >= 1 &&
      overallRating <= 5 &&
      engagement >= 1 &&
      engagement <= 5 &&
      adherence >= 1 &&
      adherence <= 5
    );
  }, [participantUid, overallRating, engagement, adherence]);

  const resetForm = () => {
    setOverallRating(3);
    setEngagement(3);
    setAdherence(3);
    setRisks("");
    setNotes("");
    setNextActions("");
    setFollowUpDate("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessId(null);
    setErrorMsg(null);

    try {
      // If you need participant name, resolve from users if not in list
      let participantName =
        selectedParticipant?.name ||
        (await (async () => {
          const uDoc = await getDoc(doc(db, "users", participantUid));
          const u = uDoc.data() as any;
          return (
            u?.displayName ||
            u?.name ||
            `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
            participantUid
          );
        })());

      const payload = {
        type: "Feedback Form",
        role: "service_provider" as const,
        submittedByUid: userProfile.uid,
        submittedByName: userProfile.displayName,
        submissionDate: Timestamp.now(),
        status: "pending_review" as const,

        // form-specific
        targetUid: participantUid,
        participantName,
        overallRating, // 1-5
        engagement, // 1-5
        adherence, // 1-5
        risks: risks.trim() || null,
        notes: notes.trim() || null,
        nextActions: nextActions.trim() || null,
        followUpDate: followUpDate
          ? Timestamp.fromDate(new Date(followUpDate + "T00:00:00"))
          : null,

        // meta for admin stats
        dataPoints: [
          overallRating,
          engagement,
          adherence,
          followUpDate ? 1 : 0,
          risks ? 1 : 0,
          notes ? 1 : 0,
          nextActions ? 1 : 0,
        ].length,
        completionRate: Math.min(
          100,
          Math.round(
            ([
              overallRating >= 1,
              engagement >= 1,
              adherence >= 1,
              true, // participant
            ].filter(Boolean).length /
              4) *
              100
          )
        ),
      };

      const ref = await addDoc(collection(db, "forms"), payload);
      setSuccessId(ref.id);

      // Prepend to recent
      setRecent((prev) => [
        {
          id: ref.id,
          submissionDate: payload.submissionDate,
          participantName: payload.participantName,
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
          Participant Feedback / Assessment
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Record professional feedback, risks, and next steps for a participant.
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
          <div>Feedback submitted (ID: {successId}).</div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading participants & your recent feedback…
        </div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Participant */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Participant
                </span>
                <select
                  value={participantUid}
                  onChange={(e) => setParticipantUid(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                >
                  {participants.length === 0 ? (
                    <option value="">No participants available</option>
                  ) : (
                    participants.map((p) => (
                      <option key={p.uid} value={p.uid}>
                        {p.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              {/* Follow-up date */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Follow-up Date (optional)
                </span>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Overall rating */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Overall Rating (1–5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={overallRating}
                  onChange={(e) => setOverallRating(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>

              {/* Engagement */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Engagement (1–5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={engagement}
                  onChange={(e) => setEngagement(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>

              {/* Adherence */}
              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Adherence (1–5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={adherence}
                  onChange={(e) => setAdherence(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                />
              </label>
            </div>

            {/* Risks */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Risks / Safeguarding (optional)
              </span>
              <textarea
                value={risks}
                onChange={(e) => setRisks(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Any risk factors, incidents, or safeguarding notes…"
              />
            </label>

            {/* Notes */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Professional Notes (optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Observations, clinical notes, and context…"
              />
            </label>

            {/* Next actions */}
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Next Actions (optional)
              </span>
              <textarea
                value={nextActions}
                onChange={(e) => setNextActions(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white"
                placeholder="Recommended interventions, referrals, or adjustments…"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit || submitting || participants.length === 0}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Feedback
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
              Your Recent Feedback
            </h2>
            {recent.length === 0 ? (
              <div className="text-slate-500">No submissions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-700/50">
                    <tr>
                      <th className="text-left px-4 py-2">Participant</th>
                      <th className="text-left px-4 py-2">Submitted</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-2">
                          {r.participantName || "—"}
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
