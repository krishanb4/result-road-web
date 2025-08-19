// components/forms/ServiceProviderFeedbackForm.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
type Assignment = {
  id: string;
  participantId: string;
  programId: string;
  programTitle?: string | null;
};

const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.96)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
  ["--danger" as any]: "#ef4444",
  ["--ok" as any]: "#10b981",
  ["--bar-bg" as any]: "#e2e8f0",
  ["--bar-fg" as any]: "#6366f1",
};

export default function ServiceProviderFeedbackForm({
  providerUid,
}: {
  providerUid: string;
}) {
  // Who
  const [participants, setParticipants] = useState<UserLite[]>([]);
  const [participantId, setParticipantId] = useState("");

  // Program for selected participant
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [programId, setProgramId] = useState("");

  // Session details
  const [sessionDate, setSessionDate] = useState("");
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [durationHours, setDurationHours] = useState<number | "">("");
  const [goalsWorkedOn, setGoalsWorkedOn] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [engagementRating, setEngagementRating] = useState<number | "">("");
  const [risksIssues, setRisksIssues] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  // Attachments
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  const [saving, setSaving] = useState(false);
  const storage = getStorage();

  /* ---- load participants (SPs are allowed by rules to read users) ---- */
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

  /* ---- load assignments for selected participant ---- */
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

  const participantOptions = useMemo(
    () =>
      participants
        .map((p) => ({
          id: p.id,
          label: p.displayName || p.email || p.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [participants]
  );

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

  /* ---------------- Validation ---------------- */
  const durationInvalid =
    durationHours !== "" &&
    (Number(durationHours) <= 0 || Number.isNaN(Number(durationHours)));

  function canSubmit() {
    return (
      providerUid &&
      participantId &&
      programId &&
      sessionDate &&
      serviceType.trim().length > 0 &&
      durationHours !== "" &&
      !durationInvalid &&
      goalsWorkedOn.trim().length > 0 &&
      progressNotes.trim().length > 0 &&
      engagementRating !== ""
    );
  }

  /* ---------------- Submit ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setSaving(true);

    // Resolve program title (nice-to-have)
    let programTitle: string | undefined = undefined;
    try {
      const p = await getDoc(doc(db, "programs", programId));
      if (p.exists()) programTitle = (p.data() as any)?.title || programId;
    } catch {}

    // Create form doc (now includes uid for consistency)
    const formRef = await addDoc(collection(db, "forms"), {
      type: "service_provider_feedback",
      uid: providerUid, // <— added (optional but harmless)
      providerId: providerUid, // <— checked by rules
      participantId,
      programId,
      programTitle: programTitle ?? programId,
      sessionDate, // YYYY-MM-DD
      location: location || null,
      serviceType,
      durationHours: Number(durationHours),
      goalsWorkedOn,
      progressNotes,
      engagementRating: Number(engagementRating), // 1..5
      risksIssues: risksIssues || null,
      nextSteps: nextSteps || null,
      attachmentUrls: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Upload attachments (optional) — path allowed in Storage rules
    const urls: string[] = [];
    if (files && files.length) {
      const total = files.length;
      let done = 0;

      for (const f of Array.from(files)) {
        const path = `service-provider-feedback/${providerUid}/${
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
      await updateDoc(formRef, {
        attachmentUrls: urls,
        updatedAt: serverTimestamp(),
      });
    }

    setSaving(false);
    // Reset
    setParticipantId("");
    setProgramId("");
    setSessionDate("");
    setLocation("");
    setServiceType("");
    setDurationHours("");
    setGoalsWorkedOn("");
    setProgressNotes("");
    setEngagementRating("");
    setRisksIssues("");
    setNextSteps("");
    setFiles(null);
    setUploadPct(0);
    alert("Submitted!");
  }

  /* ---------------- UI tokens & classes ---------------- */
  const field =
    "w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
  const label = "text-sm text-[var(--muted-text)]";
  const panel =
    "rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 md:p-6 backdrop-blur";
  const btnPrimary =
    "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60";
  const btnSecondary =
    "px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50";

  return (
    <form
      className="space-y-6 text-[var(--panel-text)]"
      style={tokens}
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Service Provider Feedback
          </h3>
          <p className="text-sm text-[var(--muted-text)]">
            Log session details, progress, and optional attachments.
          </p>
        </div>
      </div>

      {/* WHO */}
      <section className={panel}>
        <h4 className="text-slate-900 font-medium mb-3">
          Participant & Program
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Participant"
            required
            hint="Start typing to search the list."
          >
            <select
              required
              className={field}
              value={participantId}
              onChange={(e) => {
                setParticipantId(e.target.value);
                setProgramId("");
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
              className={field}
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
        </div>
      </section>

      {/* SESSION */}
      <section className={panel}>
        <h4 className="text-slate-900 font-medium mb-3">Session Details</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Session Date" required>
            <input
              type="date"
              required
              className={field}
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </Field>

          <Field label="Service Type" required>
            <input
              required
              className={field}
              placeholder="e.g., Physiotherapy"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </Field>

          <Field
            label="Duration (hours)"
            required
            error={
              durationInvalid ? "Please enter a positive number." : undefined
            }
          >
            <input
              type="number"
              min={0.25}
              step={0.25}
              required
              className={`${field} ${
                durationInvalid
                  ? "border-[var(--danger)] focus-visible:ring-[var(--danger)]"
                  : ""
              }`}
              placeholder="e.g., 1"
              value={durationHours}
              onChange={(e) =>
                setDurationHours(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Field label="Goals Worked On" required>
            <textarea
              rows={4}
              required
              className={`${field} resize-y`}
              placeholder="Which goals did you target this session?"
              value={goalsWorkedOn}
              onChange={(e) => setGoalsWorkedOn(e.target.value)}
            />
          </Field>

          <Field label="Progress Notes" required>
            <textarea
              rows={4}
              required
              className={`${field} resize-y`}
              placeholder="Participant progress, observations, outcomes…"
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Field label="Engagement Rating (1–5)" required>
            <select
              required
              className={field}
              value={engagementRating}
              onChange={(e) =>
                setEngagementRating(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
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

          <Field label="Location">
            <input
              className={field}
              placeholder="Clinic / Home / Community…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>

          <Field label="Next Steps">
            <input
              className={field}
              placeholder="Planned follow-ups, referrals…"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid md:grid-cols-1 gap-4 mt-4">
          <Field label="Risks / Issues">
            <textarea
              rows={3}
              className={`${field} resize-y`}
              placeholder="Incidents, concerns, risks…"
              value={risksIssues}
              onChange={(e) => setRisksIssues(e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* ATTACHMENTS */}
      <section className={panel}>
        <h4 className="text-slate-900 font-medium mb-3">
          Attachments (optional)
        </h4>
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 hover:file:bg-slate-50"
            onChange={(e) => setFiles(e.target.files)}
          />
          {files && files.length > 0 && (
            <ul className="text-sm text-[var(--muted-text)] list-disc pl-5">
              {Array.from(files).map((f, i) => (
                <li key={i}>
                  {f.name}{" "}
                  <span className="text-xs">
                    ({Math.round(f.size / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>
          )}
          {uploadPct > 0 && uploadPct < 100 && (
            <div className="mt-2">
              <div className="h-2 w-full rounded-full bg-[var(--bar-bg)] overflow-hidden border border-[var(--panel-border)]">
                <div
                  className="h-full bg-[var(--bar-fg)] transition-all"
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
              <div className="text-xs text-[var(--muted-text)] mt-1">
                Uploading… {uploadPct}%
              </div>
            </div>
          )}
          {uploadPct >= 100 && (
            <div className="text-xs text-[var(--ok)]">Upload complete.</div>
          )}
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button disabled={saving || !canSubmit()} className={btnPrimary}>
          {saving ? "Submitting…" : "Submit Feedback"}
        </button>
        <button
          type="button"
          onClick={() => {
            setParticipantId("");
            setProgramId("");
            setSessionDate("");
            setLocation("");
            setServiceType("");
            setDurationHours("");
            setGoalsWorkedOn("");
            setProgressNotes("");
            setEngagementRating("");
            setRisksIssues("");
            setNextSteps("");
            setFiles(null);
            setUploadPct(0);
          }}
          className={btnSecondary}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

/* ---------------- Small UI helper ---------------- */
function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-[var(--muted-text)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <div className="text-xs text-[var(--muted-text)]">{hint}</div>
      )}
      {error && <div className="text-xs text-[var(--danger)]">{error}</div>}
    </div>
  );
}
