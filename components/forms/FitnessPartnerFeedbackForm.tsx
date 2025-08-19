// components/forms/FitnessPartnerFeedbackForm.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Program = {
  id: string;
  title: string;
  fitnessPartnerId?: string | null;
  active?: boolean;
};

type SimpleUser = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};

/* ---------------- helpers ---------------- */
function chunk<T>(arr: T[], size = 10): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ---------------- light theme tokens ---------------- */
const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.95)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
  ["--hint" as any]: "#0ea5e9",
};

export default function FitnessPartnerFeedbackForm({ uid }: { uid: string }) {
  // programs for this fitness partner
  const [programs, setPrograms] = useState<Program[]>([]);
  // map programId -> participantIds[]
  const [programParticipants, setProgramParticipants] = useState<
    Record<string, string[]>
  >({});
  // user lookup for participant names/emails
  const [usersById, setUsersById] = useState<Record<string, SimpleUser>>({});

  // form state
  const [programId, setProgramId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [sessionDate, setSessionDate] = useState(todayStr()); // yyyy-mm-dd
  const [attendance, setAttendance] = useState<"present" | "absent">("present");
  const [rating, setRating] = useState("3"); // 1..5
  const [minutes, setMinutes] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // 1) Load this partner's programs (live)
  useEffect(() => {
    const qProg = query(
      collection(db, "programs"),
      where("fitnessPartnerId", "==", uid)
    );
    const unsub = onSnapshot(
      qProg,
      (snap) => {
        const rows: Program[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setPrograms(rows);
      },
      (err) => console.error("Failed to load programs:", err)
    );
    return () => unsub();
  }, [uid]);

  // 2) When a program is selected, live-load its assignments → participant IDs
  useEffect(() => {
    if (!programId) return;

    const qA = query(
      collection(db, "assignments"),
      where("programId", "==", programId)
    );

    const unsub = onSnapshot(
      qA,
      async (snap) => {
        const pids = Array.from(
          new Set(
            snap.docs
              .map((d) => (d.data() as any)?.participantId)
              .filter(Boolean)
          )
        ) as string[];

        setProgramParticipants((prev) => ({ ...prev, [programId]: pids }));

        // fetch user docs for these pids (chunk by 10)
        if (pids.length) {
          const newUsers: Record<string, SimpleUser> = {};
          for (const c of chunk(pids, 10)) {
            try {
              const qU = query(
                collection(db, "users"),
                where("__name__", "in", c)
              );
              const uSnap = await getDocs(qU);
              uSnap.docs.forEach((ud) => {
                const v = ud.data() as any;
                newUsers[ud.id] = {
                  id: ud.id,
                  displayName: v?.displayName ?? null,
                  email: v?.email ?? null,
                };
              });
            } catch (err) {
              console.error("Failed to load users for participants:", err);
            }
          }
          setUsersById((prev) => ({ ...prev, ...newUsers }));
        }
      },
      (err) => {
        console.error("Failed to load assignments for program:", err);
        setProgramParticipants((prev) => ({ ...prev, [programId]: [] }));
      }
    );

    return () => unsub();
  }, [programId]);

  // derived: participants for the chosen program
  const participantsForProgram = useMemo(() => {
    return programId ? programParticipants[programId] || [] : [];
  }, [programId, programParticipants]);

  const programTitle = useMemo(
    () => programs.find((p) => p.id === programId)?.title || "",
    [programs, programId]
  );

  const participantName = useMemo(() => {
    if (!participantId) return "";
    const u = usersById[participantId];
    return u?.displayName || u?.email || participantId;
  }, [participantId, usersById]);

  const minutesNum = minutes ? Number(minutes) : null;
  const minutesInvalid = minutes !== "" && Number.isNaN(minutesNum);

  const allRequired =
    !!programId &&
    !!participantId &&
    !!sessionDate &&
    !!attendance &&
    !!rating &&
    !!notes.trim() &&
    !minutesInvalid;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allRequired) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "forms"), {
        uid, // fitness partner UID
        type: "fitness_partner_feedback",
        programId,
        programTitle: programTitle || null,
        participantId,
        participantName: participantName || null,
        sessionDate: new Date(sessionDate + "T00:00:00"),
        attendance, // "present" | "absent"
        rating: Number(rating), // 1..5
        minutes: minutes === "" ? null : Number(minutes), // number|null
        notes: notes.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // reset
      setParticipantId("");
      setProgramId("");
      setSessionDate(todayStr());
      setAttendance("present");
      setRating("3");
      setMinutes("");
      setNotes("");
      alert("Feedback submitted!");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
  const label = "text-sm text-[var(--muted-text)]";
  const panel =
    "rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 md:p-6 backdrop-blur";

  return (
    <form
      className="space-y-6 text-[var(--panel-text)]"
      style={tokens}
      onSubmit={onSubmit}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Session Feedback
          </h3>
          <p className="text-sm text-[var(--muted-text)]">
            Submit notes and attendance for a participant session.
          </p>
        </div>
      </div>

      {/* Program & Participant */}
      <section className={panel}>
        <h4 className="text-slate-900 font-medium mb-3">
          Program & Participant
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={label}>
              Program <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className={field}
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value);
                setParticipantId(""); // reset on program change
              }}
            >
              <option value="">— Select program —</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {programs.length === 0 && (
              <p className="text-xs text-[var(--muted-text)]">
                No programs assigned to you yet.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className={label}>
              Participant <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className={field}
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              disabled={!programId}
            >
              <option value="">
                {!programId
                  ? "Select a program first"
                  : participantsForProgram.length > 0
                  ? "— Select participant —"
                  : "No participants found"}
              </option>
              {participantsForProgram.map((pid) => {
                const u = usersById[pid];
                const labelTxt = u?.displayName || u?.email || pid;
                return (
                  <option key={pid} value={pid}>
                    {labelTxt}
                  </option>
                );
              })}
            </select>
            {!!participantId && (
              <p className="text-xs text-[var(--muted-text)]">
                Selected:{" "}
                <span className="text-[var(--hint)]">{participantName}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Session details */}
      <section className={panel}>
        <h4 className="text-slate-900 font-medium mb-3">Session Details</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={label}>
              Session date <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="date"
              className={field}
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className={label}>
              Attendance <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className={field}
              value={attendance}
              onChange={(e) =>
                setAttendance(e.target.value as "present" | "absent")
              }
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={label}>
              Rating (1–5) <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className={field}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="1">1 – Poor</option>
              <option value="2">2 – Fair</option>
              <option value="3">3 – Good</option>
              <option value="4">4 – Very good</option>
              <option value="5">5 – Excellent</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-1 md:col-span-1">
            <label className={label}>Minutes (optional)</label>
            <input
              type="number"
              min={0}
              step={5}
              placeholder="e.g., 45"
              className={`${field} ${
                minutesInvalid
                  ? "border-rose-300 focus-visible:ring-rose-300"
                  : ""
              }`}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
            {minutesInvalid && (
              <div className="text-xs text-rose-600">
                Please enter a valid number.
              </div>
            )}
            {!minutesInvalid && minutes !== "" && (
              <div className="text-xs text-[var(--muted-text)]">
                ~{minutes} min session
              </div>
            )}
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className={label}>
              Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              className={`${field} resize-y`}
              placeholder="Progress, challenges, next steps…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving || !allRequired}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Submit feedback"}
        </button>
        <button
          type="button"
          onClick={() => {
            setParticipantId("");
            setProgramId("");
            setSessionDate(todayStr());
            setAttendance("present");
            setRating("3");
            setMinutes("");
            setNotes("");
          }}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
