"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function AssignProgramsPage() {
  const { userProfile } = useAuth();
  const [participantUid, setParticipantUid] = useState("");
  const [programId, setProgramId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function submit() {
    if (!userProfile) return;
    await addDoc(collection(db, "programAssignments"), {
      participantUid,
      programId,
      startDate,
      endDate,
      assignedBy: userProfile.uid,
      createdAt: serverTimestamp(),
    });
    setParticipantUid("");
    setProgramId("");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Assign Program</h2>
      <label className="block text-sm">
        Participant UID
        <input
          className="mt-1 w-full rounded-lg border p-2"
          value={participantUid}
          onChange={(e) => setParticipantUid(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Program ID
        <input
          className="mt-1 w-full rounded-lg border p-2"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          Start
          <input
            type="date"
            className="mt-1 w-full rounded-lg border p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          End
          <input
            type="date"
            className="mt-1 w-full rounded-lg border p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={submit}
        className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
      >
        Assign
      </button>
    </div>
  );
}
