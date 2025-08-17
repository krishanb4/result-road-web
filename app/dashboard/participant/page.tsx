"use client";
import { useEffect, useState } from "react";
import VideoGate from "@/components/dashboard/VideoGate";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";

export default function ParticipantDashboard() {
  const [uid, setUid] = useState<string>("");
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUid(u.uid);
        const q = query(
          collection(db, "assignments"),
          where("participantId", "==", u.uid)
        );
        return onSnapshot(q, (snap) =>
          setAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
      }
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <VideoGate
        uid={uid}
        role="participant"
        videoUrl="/videos/participant-intro.mp4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-900 border border-white/10 p-4">
            <div className="text-lg font-semibold mb-2">
              Assigned Training Program
            </div>
            {assignments.length === 0 ? (
              <div className="text-white/70">No program assigned yet.</div>
            ) : (
              <ul className="space-y-2">
                {assignments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between">
                    <span>{a.programTitle ?? a.programId}</span>
                    <Link
                      href={`/dashboard/participant/assignment/${a.id}`}
                      className="text-indigo-300 hover:underline"
                    >
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl bg-slate-900 border border-white/10 p-4">
            <div className="text-lg font-semibold mb-2">Your Progress</div>
            <div className="text-white/70">
              Open your assignment to mark modules as completed.
            </div>
          </div>
        </div>
      </VideoGate>
    </div>
  );
}
