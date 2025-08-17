"use client";

import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

type ProgramAssignment = {
  id: string;
  participantUid: string;
  programId: string;
  startDate: string;
  endDate: string;
  assignedBy: string;
};

export default function AssignedProgram() {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState<ProgramAssignment[]>([]);

  useEffect(() => {
    if (!userProfile) return;
    const q = query(
      collection(db, "programAssignments"),
      where("participantUid", "==", userProfile.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: ProgramAssignment[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as any) }));
      setAssignments(list);
    });
    return () => unsub();
  }, [userProfile]);

  if (!userProfile) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Assigned Programs</h2>
      {assignments.length === 0 ? (
        <p className="text-sm text-neutral-600">No assignments yet.</p>
      ) : (
        <ul className="space-y-3">
          {assignments.map((a) => (
            <li key={a.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Program: {a.programId}</div>
                  <div className="text-xs text-neutral-600">
                    {a.startDate} → {a.endDate}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
