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

type UserLite = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};
type Program = { id: string; title?: string | null };
type Assignment = {
  id: string;
  participantId: string;
  programId: string;
  programTitle?: string | null;
};

export default function CoordinatorProgressOverviewForm({
  coordinatorUid,
}: {
  coordinatorUid: string;
}) {
  // Participants (users with role=participant)
  const [participants, setParticipants] = useState<UserLite[]>([]);
  const [participantId, setParticipantId] = useState("");

  // Assignments for the selected participant
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
  type GoalRow = {
    goal: string;
    status: "not_started" | "in_progress" | "completed";
    notes?: string;
  };
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

  // Load participants
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

  // Load assignments for selected participant
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
      // Preselect the most recent program
      if (rows.length && !programId) setProgramId(rows[0].programId);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]);

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

  function canSubmit() {
    return (
      coordinatorUid &&
      participantId &&
      programId &&
      fromDate &&
      toDate &&
      attendance !== "" &&
      rating !== "" &&
      overall.trim().length > 0 &&
      goals.every((g) => g.goal.trim().length > 0 && g.status)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setSaving(true);

    // Pull program title for snapshot
    let programTitle: string | undefined = undefined;
    try {
      const p = await getDoc(doc(db, "programs", programId));
      if (p.exists()) programTitle = (p.data() as any)?.title || programId;
    } catch {}

    // Create form doc first
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
      risks,
      barriers,
      nextSteps,
      attachmentUrls: [],
      createdAt: serverTimestamp(),
    });

    // Upload files (optional)
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
              // aggregate-ish progress (simple)
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

      // Patch doc with URLs
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Who / What */}
      <section className="grid md:grid-cols-2 gap-3">
        <Field label="Participant" required>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Field>

        <Field label="Period To" required>
          <input
            type="date"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Field>
      </section>

      {/* Metrics */}
      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Attendance %" required>
          <input
            type="number"
            min={0}
            max={100}
            step="1"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={attendance}
            onChange={(e) =>
              setAttendance(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="0–100"
          />
        </Field>

        <Field label="Overall Rating (1–5)" required>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={overall}
            onChange={(e) => setOverall(e.target.value)}
            placeholder="Short summary of participant progress"
          />
        </Field>
      </section>

      {/* Goals / Milestones */}
      <section className="space-y-2">
        <div className="text-sm text-white/80">Goals & Milestones</div>
        {goals.map((g, idx) => (
          <div key={idx} className="grid md:grid-cols-3 gap-2">
            <input
              required
              className="rounded-lg bg-slate-900 border border-white/10 p-2"
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
              className="rounded-lg bg-slate-900 border border-white/10 p-2"
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
              className="rounded-lg bg-slate-900 border border-white/10 p-2"
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
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
            onClick={() =>
              setGoals((arr) => [
                ...arr,
                { goal: "", status: "not_started", notes: "" },
              ])
            }
          >
            + Add Goal
          </button>
          {goals.length > 1 && (
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-rose-600/70 hover:bg-rose-600"
              onClick={() => setGoals((arr) => arr.slice(0, -1))}
            >
              − Remove Last
            </button>
          )}
        </div>
      </section>

      {/* Risks / Barriers / Next steps */}
      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Risks">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={risks}
            onChange={(e) => setRisks(e.target.value)}
            placeholder="Any risks identified…"
          />
        </Field>
        <Field label="Barriers">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={barriers}
            onChange={(e) => setBarriers(e.target.value)}
            placeholder="Any barriers to progress…"
          />
        </Field>
        <Field label="Next Steps">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            placeholder="Planned actions, referrals, follow-ups…"
          />
        </Field>
      </section>

      {/* Attachments */}
      <section className="space-y-2">
        <div className="text-sm text-white/80">Attachments (optional)</div>
        <input
          type="file"
          multiple
          className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-1.5 file:hover:bg-white/20"
          onChange={(e) => setFiles(e.target.files)}
        />
        {uploadPct > 0 && uploadPct < 100 && (
          <div className="text-xs text-white/60">Uploading… {uploadPct}%</div>
        )}
      </section>

      {/* Submit */}
      <div className="pt-2">
        <button
          disabled={saving || !canSubmit()}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
        >
          {saving ? "Submitting…" : "Submit Overview"}
        </button>
      </div>
    </form>
  );
}

/* ---------- small UI helper ---------- */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/80">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}
