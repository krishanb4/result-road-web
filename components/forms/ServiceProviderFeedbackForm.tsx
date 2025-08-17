// components/forms/ServiceProviderFeedbackForm.tsx
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
type Assignment = {
  id: string;
  participantId: string;
  programId: string;
  programTitle?: string | null;
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
  const [serviceType, setServiceType] = useState(""); // e.g., Physio, OT, etc.
  const [durationHours, setDurationHours] = useState<number | "">("");
  const [goalsWorkedOn, setGoalsWorkedOn] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [engagementRating, setEngagementRating] = useState<number | "">(""); // 1-5
  const [risksIssues, setRisksIssues] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  // Attachments
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  const [saving, setSaving] = useState(false);
  const storage = getStorage();

  /* ---- load participants (role=participant) ---- */
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
      providerUid &&
      participantId &&
      programId &&
      sessionDate &&
      serviceType.trim().length > 0 &&
      durationHours !== "" &&
      Number(durationHours) > 0 &&
      goalsWorkedOn.trim().length > 0 &&
      progressNotes.trim().length > 0 &&
      engagementRating !== ""
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setSaving(true);

    // Get a friendly program title
    let programTitle: string | undefined = undefined;
    try {
      const p = await getDoc(doc(db, "programs", programId));
      if (p.exists()) programTitle = (p.data() as any)?.title || programId;
    } catch {}

    // Create form doc
    const formRef = await addDoc(collection(db, "forms"), {
      type: "service_provider_feedback",
      providerId: providerUid,
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
    });

    // Upload attachments (optional)
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Who */}
      <section className="grid md:grid-cols-2 gap-3">
        <Field label="Participant" required>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
      </section>

      {/* Session */}
      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Session Date" required>
          <input
            type="date"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </Field>

        <Field label="Service Type" required>
          <input
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="e.g., Physiotherapy"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
        </Field>

        <Field label="Duration (hours)" required>
          <input
            type="number"
            min={0.25}
            step={0.25}
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="e.g., 1"
            value={durationHours}
            onChange={(e) =>
              setDurationHours(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </Field>
      </section>

      {/* Content */}
      <section className="grid md:grid-cols-2 gap-3">
        <Field label="Goals Worked On" required>
          <textarea
            rows={4}
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Which goals did you target this session?"
            value={goalsWorkedOn}
            onChange={(e) => setGoalsWorkedOn(e.target.value)}
          />
        </Field>

        <Field label="Progress Notes" required>
          <textarea
            rows={4}
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Participant progress, observations, outcomes…"
            value={progressNotes}
            onChange={(e) => setProgressNotes(e.target.value)}
          />
        </Field>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Engagement Rating (1–5)" required>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Clinic / Home / Community…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>

        <Field label="Next Steps">
          <input
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Planned follow-ups, referrals…"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </Field>
      </section>

      <section className="grid md:grid-cols-1 gap-3">
        <Field label="Risks / Issues">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Incidents, concerns, risks…"
            value={risksIssues}
            onChange={(e) => setRisksIssues(e.target.value)}
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
          {saving ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
}

/* ---- small UI helper ---- */
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
