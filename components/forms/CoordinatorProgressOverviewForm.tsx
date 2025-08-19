// components/forms/CoordinatorProgressOverviewForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Plus, Minus, UploadCloud } from "lucide-react";

/* ---------- Types ---------- */
type UserLite = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};
type Assignment = {
  id: string;
  participantId: string;
  programId: string;
  programTitle?: string | null;
};

type GoalRow = {
  goal: string;
  status: "not_started" | "in_progress" | "completed";
  notes?: string;
};

/* ---------- UI helpers ---------- */
function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-sm p-4 md:p-6">
      <div className="mb-3">
        <h3 className="text-base md:text-lg font-semibold text-slate-900">
          {title}
        </h3>
        {description ? (
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white/70 text-slate-900 placeholder:text-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition";
const buttonGhost =
  "px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition";
const buttonPrimary =
  "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed";
const buttonDanger =
  "px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition";
const chip =
  "inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs";

/* ---------- Component ---------- */
export default function CoordinatorProgressOverviewForm({
  coordinatorUid,
}: {
  coordinatorUid: string;
}) {
  // Participants (users with role=participant)
  const [participants, setParticipants] = useState<UserLite[]>([]);
  const [participantId, setParticipantId] = useState("");

  // Assignments for selected participant
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [programId, setProgramId] = useState("");

  // Period
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Metrics
  const [attendance, setAttendance] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">(""); // 1-5 overall rating
  const [overall, setOverall] = useState(""); // free text summary

  // Goals/milestones
  const [goals, setGoals] = useState<GoalRow[]>([
    { goal: "", status: "not_started", notes: "" },
  ]);

  // Risks / Barriers / Next steps
  const [risks, setRisks] = useState("");
  const [barriers, setBarriers] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  // Attachments
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadPct, setUploadPct] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const storage = getStorage();

  /* ---- Load participants ---- */
  useEffect(() => {
    const qUsers = query(
      collection(db, "users"),
      where("role", "==", "participant")
    );
    const unsub = onSnapshot(qUsers, (snap) => {
      setParticipants(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      );
    });
    return () => unsub();
  }, []);

  /* ---- Load assignments for selected participant ---- */
  useEffect(() => {
    if (!participantId) {
      setAssignments([]);
      setProgramId("");
      return;
    }
    const qA = query(
      collection(db, "assignments"),
      where("participantId", "==", participantId),
      orderBy("assignedAt", "desc")
    );
    const unsub = onSnapshot(qA, (snap) => {
      const rows = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Assignment[];
      setAssignments(rows);
      if (rows.length && !programId) setProgramId(rows[0].programId);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]);

  /* ---- Options ---- */
  const participantOptions = useMemo(() => {
    return participants
      .map((p) => ({
        id: p.id,
        label: p.displayName || p.email || p.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [participants]);

  const programOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; title: string }[] = [];
    for (const a of assignments) {
      if (!seen.has(a.programId)) {
        list.push({ id: a.programId, title: a.programTitle || a.programId });
        seen.add(a.programId);
      }
    }
    return list;
  }, [assignments]);

  /* ---- Validation ---- */
  const canSubmit =
    !!coordinatorUid &&
    !!participantId &&
    !!programId &&
    !!fromDate &&
    !!toDate &&
    attendance !== "" &&
    rating !== "" &&
    overall.trim().length > 0 &&
    goals.every((g) => g.goal.trim().length > 0 && g.status);

  const dateError =
    fromDate && toDate && new Date(fromDate) > new Date(toDate)
      ? "“From” date cannot be after “To” date."
      : "";

  /* ---- Submit ---- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || dateError) return;
    setSaving(true);

    // Get a friendly program title
    let programTitle: string | undefined = undefined;
    try {
      const p = await getDoc(doc(db, "programs", programId));
      if (p.exists()) programTitle = (p.data() as any)?.title || programId;
    } catch {}

    // Create the form document
    const formRef = await addDoc(collection(db, "forms"), {
      type: "coordinator_progress_overview",
      coordinatorId: coordinatorUid,
      participantId,
      programId,
      programTitle: programTitle ?? programId,
      periodFrom: fromDate,
      periodTo: toDate,
      attendancePercent: Number(attendance),
      rating: Number(rating),
      overallSummary: overall,
      goals,
      risks: risks || null,
      barriers: barriers || null,
      nextSteps: nextSteps || null,
      attachmentUrls: [],
      createdAt: serverTimestamp(),
    });

    // Upload attachments (optional)
    const urls: string[] = [];
    if (files && files.length) {
      const total = files.length;
      let done = 0;

      for (const f of Array.from(files)) {
        const path = `coordinator-overviews/${coordinatorUid}/${
          formRef.id
        }/${Date.now()}-${f.name}`;
        const r = ref(storage, path);
        const task = uploadBytesResumable(r, f);
        await new Promise<void>((resolve, reject) => {
          task.on(
            "state_changed",
            (snap) => {
              const pct = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
              );
              setUploadPct(Math.round(((done + pct / 100) / total) * 100));
            },
            reject,
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              urls.push(url);
              done += 1;
              setUploadPct(Math.round((done / total) * 100));
              resolve();
            }
          );
        });
      }

      // Patch doc with URLs (make sure your rules allow this update)
      await updateDoc(formRef, {
        attachmentUrls: urls,
        updatedAt: serverTimestamp(),
      });
    }

    setSaving(false);
    // Reset
    setParticipantId("");
    setProgramId("");
    setFromDate("");
    setToDate("");
    setAttendance("");
    setRating("");
    setOverall("");
    setGoals([{ goal: "", status: "not_started", notes: "" }]);
    setRisks("");
    setBarriers("");
    setNextSteps("");
    setFiles(null);
    setUploadPct(0);
    alert("Submitted!");
  }

  /* ---------- UI ---------- */
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Header summary chips */}
      <div className="flex flex-wrap gap-2">
        <span className={chip}>
          Participant
          <span className="font-medium">
            {participantId
              ? participantOptions.find((p) => p.id === participantId)?.label
              : "—"}
          </span>
        </span>
        <span className={chip}>
          Program
          <span className="font-medium">
            {programId
              ? programOptions.find((p) => p.id === programId)?.title
              : "—"}
          </span>
        </span>
      </div>

      <SectionCard
        title="Who & What"
        description="Choose a participant and their program to report on."
      >
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Participant" required>
            <select
              required
              className={inputClass}
              value={participantId}
              onChange={(e) => {
                setParticipantId(e.target.value);
                setProgramId(""); // force re-select after participant changes
              }}
            >
              <option value="">Select participant</option>
              {participantOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Program" required>
            <select
              required
              className={inputClass}
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              disabled={!participantId}
            >
              <option value="">
                {participantId ? "Select program" : "Select participant first"}
              </option>
              {programOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Period From" required>
            <input
              type="date"
              required
              className={inputClass}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Field>

          <Field
            label="Period To"
            required
            hint="Use the inclusive end date for this overview."
          >
            <input
              type="date"
              required
              className={inputClass}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Field>
        </div>
        {dateError ? (
          <div className="mt-3 text-xs text-rose-600">{dateError}</div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Key Metrics"
        description="Attendance and overall rating for the selected period."
      >
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Attendance %" required>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              required
              className={inputClass}
              value={attendance}
              onChange={(e) =>
                setAttendance(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              placeholder="0–100"
            />
          </Field>

          <Field label="Overall Rating (1–5)" required>
            <select
              required
              className={inputClass}
              value={rating}
              onChange={(e) =>
                setRating(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Overview Summary" required>
            <input
              required
              className={inputClass}
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              placeholder="Short summary of participant progress"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Goals & Milestones"
        description="Add goals, mark status, and capture any short notes."
      >
        <div className="space-y-3">
          {goals.map((g, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-3 gap-2 rounded-xl border border-slate-200 p-3 bg-white/70"
            >
              <input
                required
                className={inputClass}
                placeholder="Goal"
                value={g.goal}
                onChange={(e) => {
                  const copy = [...goals];
                  copy[idx].goal = e.target.value;
                  setGoals(copy);
                }}
              />
              <select
                required
                className={inputClass}
                value={g.status}
                onChange={(e) => {
                  const copy = [...goals];
                  copy[idx].status = e.target.value as GoalRow["status"];
                  setGoals(copy);
                }}
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                className={inputClass}
                placeholder="Notes (optional)"
                value={g.notes || ""}
                onChange={(e) => {
                  const copy = [...goals];
                  copy[idx].notes = e.target.value;
                  setGoals(copy);
                }}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonGhost}
              onClick={() =>
                setGoals((arr) => [
                  ...arr,
                  { goal: "", status: "not_started", notes: "" },
                ])
              }
            >
              <Plus className="w-4 h-4" /> Add Goal
            </button>
            {goals.length > 1 && (
              <button
                type="button"
                className={buttonDanger}
                onClick={() => setGoals((arr) => arr.slice(0, -1))}
              >
                <Minus className="w-4 h-4" /> Remove Last
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Risks, Barriers & Next Steps">
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Risks">
            <textarea
              rows={3}
              className={inputClass}
              value={risks}
              onChange={(e) => setRisks(e.target.value)}
              placeholder="Any risks identified…"
            />
          </Field>
          <Field label="Barriers">
            <textarea
              rows={3}
              className={inputClass}
              value={barriers}
              onChange={(e) => setBarriers(e.target.value)}
              placeholder="Any barriers to progress…"
            />
          </Field>
          <Field label="Next Steps">
            <textarea
              rows={3}
              className={inputClass}
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="Planned actions, referrals, follow-ups…"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Attachments (optional)"
        description="Upload reports, letters, or supporting documents."
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <UploadCloud className="w-4 h-4 mr-2" />
              Choose files
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
            />
            <span className="text-xs text-slate-500">
              PDF, images; up to your Storage limits.
            </span>
          </label>

          {files?.length ? (
            <div className="text-xs text-slate-600">
              Selected:{" "}
              {Array.from(files)
                .map((f) => f.name)
                .join(", ")}
            </div>
          ) : null}

          {uploadPct > 0 && uploadPct < 100 && (
            <div className="w-full">
              <div className="h-2 w-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div
                  className="h-2 bg-indigo-500"
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Uploading… {uploadPct}%
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Make sure dates and program are correct before submitting.
        </p>
        <button
          type="submit"
          disabled={saving || !canSubmit || !!dateError}
          className={buttonPrimary}
        >
          {saving ? "Submitting…" : "Submit Overview"}
        </button>
      </div>
    </form>
  );
}
