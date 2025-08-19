// components/forms/ResultRoadClientMonitoringForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** DB role constants (underscore style as used elsewhere) */
const ROLE = {
  PARTICIPANT: "participant",
  SUPPORT_WORKER: "support_worker",
  FITNESS_PARTNER: "fitness_partner",
} as const;

type UserLite = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};

const GOALS = [
  "Build confidence",
  "Improve fitness",
  "Increase strength",
  "Improve coordination & balance",
  "Reduce anxiety",
  "Improve routine & consistency",
  "Increase social interaction",
  "Improve emotional regulation",
  "Learn new skills",
  "General wellbeing",
] as const;

const SUMMARY = [
  { key: "attendanceImproved", label: "Attendance improved" },
  { key: "confidenceIncreased", label: "Client showed increased confidence" },
  {
    key: "strengthOrCoordinationImproved",
    label: "Physical strength or coordination improved",
  },
  { key: "socialEngagementIncreased", label: "Social engagement increased" },
  {
    key: "enjoymentVerbalised",
    label: "Client verbalised enjoyment of sessions",
  },
  {
    key: "goalOrMilestoneReached",
    label: "Client reached a goal or milestone",
  },
  { key: "ongoingRecommended", label: "Ongoing participation is recommended" },
] as const;

/* ---------- small UI helpers ---------- */
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const chipBase =
  "flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition";
const chipOn =
  "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]";
const chipOff = "bg-white border-slate-300 text-slate-700 hover:bg-slate-50";

/* ---------- component ---------- */
export default function ParticipantProgressForm({
  providerUid,
}: {
  /** Authenticated submitter UID — will be stored as `uid` for rules */
  providerUid: string;
}) {
  /* --- directory data (dropdowns) --- */
  const [participants, setParticipants] = useState<UserLite[]>([]);
  const [workers, setWorkers] = useState<UserLite[]>([]);
  const [coaches, setCoaches] = useState<UserLite[]>([]);
  const [dirErr, setDirErr] = useState<
    null | "participants" | "workers" | "coaches"
  >(null);

  useEffect(() => {
    // Participants
    const unsubP = onSnapshot(
      query(collection(db, "users"), where("role", "==", ROLE.PARTICIPANT)),
      (snap) => {
        setParticipants(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        );
      },
      () => setDirErr((prev) => prev ?? "participants")
    );

    // Support Workers
    const unsubW = onSnapshot(
      query(collection(db, "users"), where("role", "==", ROLE.SUPPORT_WORKER)),
      (snap) =>
        setWorkers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))),
      () => setDirErr((prev) => prev ?? "workers")
    );

    // Coaches / Fitness Partners
    const unsubC = onSnapshot(
      query(collection(db, "users"), where("role", "==", ROLE.FITNESS_PARTNER)),
      (snap) =>
        setCoaches(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))),
      () => setDirErr((prev) => prev ?? "coaches")
    );

    return () => {
      unsubP();
      unsubW();
      unsubC();
    };
  }, []);

  const participantOpts = useMemo(
    () =>
      participants
        .map((u) => ({ id: u.id, label: u.displayName || u.email || u.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [participants]
  );
  const workerOpts = useMemo(
    () =>
      workers
        .map((u) => ({ id: u.id, label: u.displayName || u.email || u.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [workers]
  );
  const coachOpts = useMemo(
    () =>
      coaches
        .map((u) => ({ id: u.id, label: u.displayName || u.email || u.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [coaches]
  );

  const labelOf = (list: { id: string; label: string }[], id?: string) =>
    list.find((x) => x.id === id)?.label || null;

  /* --- form state --- */
  const [participantId, setParticipantId] = useState("");
  const [supportWorkerId, setSupportWorkerId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [improvements, setImprovements] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [coachComments, setCoachComments] = useState("");

  const [summary, setSummary] = useState<Record<string, boolean>>(
    Object.fromEntries(SUMMARY.map((s) => [s.key, false]))
  );

  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  /* --- validation --- */
  const goalsValid = selectedGoals.length >= 2 && selectedGoals.length <= 4;
  const canSubmit =
    !!providerUid &&
    !!participantId &&
    !!supportWorkerId &&
    !!coachId &&
    !!startDate &&
    !!reviewDate &&
    goalsValid;

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }
  function toggleSummary(key: string) {
    setSummary((s) => ({ ...s, [key]: !s[key] }));
  }
  function clearStatus() {
    setOk(null);
    setErr(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearStatus();
    if (!canSubmit) {
      setErr("Please complete all required fields. Select 2–4 goals.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "forms"), {
        // rules: allow create when uid == request.auth.uid
        uid: providerUid,
        type: "rr_client_progress_monitoring",

        // relationships (IDs + snapshot labels for readability)
        participantId,
        participantName: labelOf(participantOpts, participantId),
        supportWorkerId,
        supportWorkerName: labelOf(workerOpts, supportWorkerId),
        coachId,
        coachName: labelOf(coachOpts, coachId),

        // dates
        startDate: new Date(startDate + "T00:00:00"),
        reviewDate: new Date(reviewDate + "T00:00:00"),

        // goals + notes
        goals: selectedGoals,
        additionalNotes: additionalNotes.trim() || null,

        // reflections
        improvements: improvements.trim() || null,
        clientFeedback: clientFeedback.trim() || null,
        coachComments: coachComments.trim() || null,

        // summary flags
        summary,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // reset
      setParticipantId("");
      setSupportWorkerId("");
      setCoachId("");
      setStartDate("");
      setReviewDate("");
      setSelectedGoals([]);
      setAdditionalNotes("");
      setImprovements("");
      setClientFeedback("");
      setCoachComments("");
      setSummary(Object.fromEntries(SUMMARY.map((s) => [s.key, false])));
      setOk("Submitted. Thanks!");
    } catch (e: any) {
      const msg =
        e?.code === "permission-denied"
          ? "Missing or insufficient permissions. Your account needs read access to /users for these dropdowns, and create access to /forms."
          : e?.message || "Submit failed. Please try again.";
      setErr(msg);
      console.error("RR Client Monitoring submit failed:", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={onSubmit}
      onChange={clearStatus}
      noValidate
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            RESULT ROAD — Client Progress Monitoring
          </h2>
          <span className="text-xs text-slate-500">
            {selectedGoals.length}/4 goals selected
          </span>
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        )}
        {ok && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {ok}
          </div>
        )}

        {/* Header: dropdowns + dates */}
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Participant" required>
            <select
              className={inputBase}
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              aria-invalid={!participantId}
            >
              <option value="">Select participant</option>
              {participantOpts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            {dirErr === "participants" && (
              <p className="text-xs text-amber-600 mt-1">
                Couldn’t load participants (permissions). Ask an admin to grant
                read access to
                <code className="ml-1 rounded bg-slate-100 px-1">
                  /users
                </code>{" "}
                or submit as an admin / fitness partner.
              </p>
            )}
          </Field>

          <Field label="Support Worker" required>
            <select
              className={inputBase}
              value={supportWorkerId}
              onChange={(e) => setSupportWorkerId(e.target.value)}
              aria-invalid={!supportWorkerId}
            >
              <option value="">Select support worker</option>
              {workerOpts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            {dirErr === "workers" && (
              <p className="text-xs text-amber-600 mt-1">
                Couldn’t load support workers (permissions).
              </p>
            )}
          </Field>

          <Field label="Coach / Fitness Partner" required>
            <select
              className={inputBase}
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              aria-invalid={!coachId}
            >
              <option value="">Select coach / fitness partner</option>
              {coachOpts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            {dirErr === "coaches" && (
              <p className="text-xs text-amber-600 mt-1">
                Couldn’t load coaches (permissions).
              </p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" required>
              <input
                type="date"
                className={inputBase}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={todayStr()}
                aria-invalid={!startDate}
              />
            </Field>
            <Field label="Review Date" required>
              <input
                type="date"
                className={inputBase}
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                aria-invalid={!reviewDate}
              />
            </Field>
          </div>
        </div>

        {/* Goals */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">
              Participant Goals{" "}
              <span className="text-slate-400">(select 2–4)</span>
            </div>
            {!goalsValid && (
              <div className="text-xs font-medium text-rose-600">
                Please select 2–4 goals
              </div>
            )}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {GOALS.map((g) => {
              const checked = selectedGoals.includes(g);
              return (
                <label
                  key={g}
                  className={`${chipBase} ${checked ? chipOn : chipOff}`}
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={checked}
                    onChange={() => toggleGoal(g)}
                  />
                  <span className="text-sm">{g}</span>
                </label>
              );
            })}
          </div>

          <Field label="Additional Notes" hint="Optional">
            <textarea
              rows={3}
              className={inputBase}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any goal-related notes…"
            />
          </Field>
        </div>

        {/* End of Term Reflections */}
        <div className="mt-6 space-y-3">
          <div className="text-sm font-medium text-slate-700">
            End of Term Reflections
          </div>

          <Field label="What improvements have you noticed?">
            <textarea
              rows={3}
              className={inputBase}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
            />
          </Field>

          <Field label="Client’s Feedback">
            <textarea
              rows={3}
              className={inputBase}
              value={clientFeedback}
              onChange={(e) => setClientFeedback(e.target.value)}
            />
          </Field>

          <Field label="Support Worker / Coach Comments">
            <textarea
              rows={3}
              className={inputBase}
              value={coachComments}
              onChange={(e) => setCoachComments(e.target.value)}
            />
          </Field>
        </div>

        {/* Overall Summary */}
        <div className="mt-6 space-y-2">
          <div className="text-sm font-medium text-slate-700">
            Overall Summary
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {SUMMARY.map((s) => (
              <label
                key={s.key}
                className={`${chipBase} ${summary[s.key] ? chipOn : chipOff}`}
              >
                <input
                  type="checkbox"
                  className="accent-indigo-600"
                  checked={!!summary[s.key]}
                  onChange={() => toggleSummary(s.key)}
                />
                <span className="text-sm">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Submitting…" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              setParticipantId("");
              setSupportWorkerId("");
              setCoachId("");
              setStartDate("");
              setReviewDate("");
              setSelectedGoals([]);
              setAdditionalNotes("");
              setImprovements("");
              setClientFeedback("");
              setCoachComments("");
              setSummary(
                Object.fromEntries(SUMMARY.map((s) => [s.key, false]))
              );
              clearStatus();
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </section>
    </form>
  );
}
