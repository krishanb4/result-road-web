// components/forms/FitnessPartnerFeedbackForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
    if (!programId) {
      setProgramParticipants((prev) => ({ ...prev, [programId]: [] }));
      return;
    }

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

  const allRequired =
    !!programId &&
    !!participantId &&
    !!sessionDate &&
    !!attendance &&
    !!rating &&
    !!notes.trim() &&
    (minutes === "" || !Number.isNaN(minutesNum));

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
        minutes: minutesNum, // number|null
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

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Program */}
      <div className="space-y-1">
        <label className="text-sm text-white/80">
          Program <span className="text-rose-300">*</span>
        </label>
        <select
          required
          className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
          <p className="text-xs text-white/60">
            No programs assigned to you yet.
          </p>
        )}
      </div>

      {/* Participant (filtered by program) */}
      <div className="space-y-1">
        <label className="text-sm text-white/80">
          Participant <span className="text-rose-300">*</span>
        </label>
        <select
          required
          className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
          disabled={!programId}
        >
          <option value="">
            {!programId
              ? "Select a program first"
              : (programParticipants[programId]?.length ?? 0) > 0
              ? "— Select participant —"
              : "No participants found"}
          </option>
          {(programParticipants[programId] ?? []).map((pid) => {
            const u = usersById[pid];
            const label = u?.displayName || u?.email || pid;
            return (
              <option key={pid} value={pid}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {/* Session details */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-white/80">
            Session date <span className="text-rose-300">*</span>
          </label>
          <input
            required
            type="date"
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-white/80">
            Attendance <span className="text-rose-300">*</span>
          </label>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
          <label className="text-sm text-white/80">
            Rating (1–5) <span className="text-rose-300">*</span>
          </label>
          <select
            required
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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

      {/* Minutes (optional) */}
      <div className="space-y-1">
        <label className="text-sm text-white/80">Minutes (optional)</label>
        <input
          type="number"
          min={0}
          step={5}
          placeholder="e.g., 45"
          className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-sm text-white/80">
          Notes <span className="text-rose-300">*</span>
        </label>
        <textarea
          required
          rows={5}
          className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
          placeholder="Progress, challenges, next steps…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        disabled={saving || !allRequired}
        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Submit feedback"}
      </button>
    </form>
  );
}
