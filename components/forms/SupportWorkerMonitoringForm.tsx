// components/forms/SupportWorkerMonitoringForm.tsx
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
  updateDoc,
  where,
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

export default function SupportWorkerMonitoringForm({
  supportUid,
}: {
  supportUid: string;
}) {
  // Who
  const [participants, setParticipants] = useState<UserLite[]>([]);
  const [participantId, setParticipantId] = useState("");

  // Program for selected participant
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [programId, setProgramId] = useState("");

  // Shift / session
  const [monitoringDate, setMonitoringDate] = useState("");
  const [startTime, setStartTime] = useState(""); // "HH:MM"
  const [endTime, setEndTime] = useState(""); // "HH:MM"
  const [location, setLocation] = useState("");
  const [kmsTraveled, setKmsTraveled] = useState<number | "">("");

  // Content
  const [activitiesPerformed, setActivitiesPerformed] = useState("");
  const [goalsWorkedOn, setGoalsWorkedOn] = useState("");
  const [outcomesObserved, setOutcomesObserved] = useState("");
  const [engagementRating, setEngagementRating] = useState<number | "">(""); // 1..5
  const [moodRating, setMoodRating] = useState<number | "">(""); // 1..5
  const [risksIssues, setRisksIssues] = useState("");

  // Incident
  const [incidentReported, setIncidentReported] = useState<"no" | "yes">("no");
  const [incidentDetails, setIncidentDetails] = useState("");

  // Attachments
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  const [saving, setSaving] = useState(false);
  const storage = getStorage();

  /* ---- load participants ---- */
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
        .map((p) => ({ id: p.id, label: p.displayName || p.email || p.id }))
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

  function minutesBetween(start: string, end: string) {
    if (!start || !end) return null;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    if (
      Number.isNaN(sh) ||
      Number.isNaN(sm) ||
      Number.isNaN(eh) ||
      Number.isNaN(em)
    )
      return null;
    return eh * 60 + em - (sh * 60 + sm);
  }

  function canSubmit() {
    const mins = minutesBetween(startTime, endTime);
    return (
      supportUid &&
      participantId &&
      programId &&
      monitoringDate &&
      startTime &&
      endTime &&
      mins !== null &&
      mins > 0 &&
      activitiesPerformed.trim().length > 0 &&
      engagementRating !== "" &&
      moodRating !== ""
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    setSaving(true);

    // Program title snapshot
    let programTitle: string | undefined = undefined;
    try {
      const p = await getDoc(doc(db, "programs", programId));
      if (p.exists()) programTitle = (p.data() as any)?.title || programId;
    } catch {}

    const durationMinutes = minutesBetween(startTime, endTime) || 0;

    // Create form doc
    const formRef = await addDoc(collection(db, "forms"), {
      type: "support_worker_monitoring",
      supportWorkerId: supportUid,
      participantId,
      programId,
      programTitle: programTitle ?? programId,

      monitoringDate, // YYYY-MM-DD
      shiftStart: startTime, // HH:MM
      shiftEnd: endTime, // HH:MM
      durationMinutes, // computed
      location: location || null,
      kmsTraveled: kmsTraveled === "" ? null : Number(kmsTraveled),

      activitiesPerformed,
      goalsWorkedOn: goalsWorkedOn || null,
      outcomesObserved: outcomesObserved || null,
      engagementRating: Number(engagementRating),
      moodRating: Number(moodRating),
      risksIssues: risksIssues || null,

      incidentReported: incidentReported === "yes",
      incidentDetails:
        incidentReported === "yes" ? incidentDetails || null : null,

      attachmentUrls: [],
      createdAt: serverTimestamp(),
    });

    // Upload attachments (optional)
    const urls: string[] = [];
    if (files && files.length) {
      const total = files.length;
      let done = 0;

      for (const f of Array.from(files)) {
        const path = `support-worker-monitoring/${supportUid}/${
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
    setMonitoringDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setKmsTraveled("");
    setActivitiesPerformed("");
    setGoalsWorkedOn("");
    setOutcomesObserved("");
    setEngagementRating("");
    setMoodRating("");
    setRisksIssues("");
    setIncidentReported("no");
    setIncidentDetails("");
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

      {/* Shift */}
      <section className="grid md:grid-cols-4 gap-3">
        <Field label="Monitoring Date" required>
          <input
            type="date"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={monitoringDate}
            onChange={(e) => setMonitoringDate(e.target.value)}
          />
        </Field>
        <Field label="Start Time" required>
          <input
            type="time"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Field>
        <Field label="End Time" required>
          <input
            type="time"
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Field>
        <Field label="Location">
          <input
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Home / Community / Clinic…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
      </section>

      {/* Content */}
      <section className="grid md:grid-cols-2 gap-3">
        <Field label="Activities Performed" required>
          <textarea
            rows={4}
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="What activities or supports were provided?"
            value={activitiesPerformed}
            onChange={(e) => setActivitiesPerformed(e.target.value)}
          />
        </Field>
        <div className="grid gap-3">
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
          <Field label="Mood Rating (1–5)" required>
            <select
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={moodRating}
              onChange={(e) =>
                setMoodRating(
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
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Goals Worked On">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Which care goals were targeted?"
            value={goalsWorkedOn}
            onChange={(e) => setGoalsWorkedOn(e.target.value)}
          />
        </Field>
        <Field label="Outcomes Observed">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Results, improvements, challenges…"
            value={outcomesObserved}
            onChange={(e) => setOutcomesObserved(e.target.value)}
          />
        </Field>
        <Field label="Risks / Issues">
          <textarea
            rows={3}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Any issues, risks, behaviours of concern…"
            value={risksIssues}
            onChange={(e) => setRisksIssues(e.target.value)}
          />
        </Field>
      </section>

      {/* Incident */}
      <section className="grid md:grid-cols-3 gap-3">
        <Field label="Incident Reported?" required>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={incidentReported}
            onChange={(e) =>
              setIncidentReported(e.target.value as "no" | "yes")
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>

        <Field label="Incident Details">
          <input
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="If yes, describe briefly"
            value={incidentDetails}
            onChange={(e) => setIncidentDetails(e.target.value)}
            disabled={incidentReported !== "yes"}
          />
        </Field>

        <Field label="KMs Traveled">
          <input
            type="number"
            min={0}
            step={0.1}
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="e.g., 12.5"
            value={kmsTraveled}
            onChange={(e) =>
              setKmsTraveled(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
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
          {saving ? "Submitting…" : "Submit Monitoring"}
        </button>
      </div>
    </form>
  );
}

/* Small field wrapper */
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
