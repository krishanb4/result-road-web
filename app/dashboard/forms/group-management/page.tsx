"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function GroupManagementFormPage() {
  const { userProfile } = useAuth();
  const [groupId, setGroupId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [notes, setNotes] = useState("");

  async function submit() {
    if (!userProfile) return;
    await addDoc(collection(db, "groupManagementForms"), {
      fitnessPartnerUid: userProfile.uid,
      groupId,
      sessionDate,
      notes,
      createdAt: serverTimestamp(),
    });
    setNotes("");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Group Management Form</h2>
      <label className="block text-sm">
        Group ID
        <input
          className="mt-1 w-full rounded-lg border p-2"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Session Date
        <input
          type="date"
          className="mt-1 w-full rounded-lg border p-2"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
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
        className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
      >
        Submit
      </button>
    </div>
  );
}
