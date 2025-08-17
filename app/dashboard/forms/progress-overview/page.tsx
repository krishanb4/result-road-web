"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function ProgressOverviewPage() {
  const { userProfile } = useAuth();
  const [participantUid, setParticipantUid] = useState("");
  const [overview, setOverview] = useState("");

  async function submit() {
    if (!userProfile) return;
    await addDoc(collection(db, "progressOverviews"), {
      instructorUid: userProfile.uid,
      participantUid,
      overview,
      createdAt: serverTimestamp(),
    });
    setOverview("");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Progress Overview</h2>
      <label className="block text-sm">
        Participant UID
        <input
          className="mt-1 w-full rounded-lg border p-2"
          value={participantUid}
          onChange={(e) => setParticipantUid(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Overview
        <textarea
          className="mt-1 w-full rounded-lg border p-2"
          rows={6}
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />
      </label>
      <button
        onClick={submit}
        className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
      >
        Submit
      </button>
    </div>
  );
}
