"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function MonitoringFormPage() {
  const { userProfile } = useAuth();
  const [participantUid, setParticipantUid] = useState("");
  const [notes, setNotes] = useState("");
  const [weekOf, setWeekOf] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!userProfile) return;
    setLoading(true);
    await addDoc(collection(db, "monitoringForms"), {
      workerUid: userProfile.uid,
      participantUid,
      weekOf,
      notes,
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    setNotes("");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Client Monitoring Form</h2>
      <label className="block text-sm">
        Participant UID
        <input
          className="mt-1 w-full rounded-lg border p-2"
          value={participantUid}
          onChange={(e) => setParticipantUid(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Week of
        <input
          type="date"
          className="mt-1 w-full rounded-lg border p-2"
          value={weekOf}
          onChange={(e) => setWeekOf(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Notes
        <textarea
          className="mt-1 w-full rounded-lg border p-2"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <button
        onClick={submit}
        disabled={loading}
        className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
