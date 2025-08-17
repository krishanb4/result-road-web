"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function AssignmentView() {
  const params = useParams<{ id: string }>();
  const [uid, setUid] = useState<string>("");
  const [assignment, setAssignment] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUid(u.uid);
      const a = await getDoc(doc(db, "assignments", params.id));
      setAssignment({ id: a.id, ...a.data() });
      const p = await getDoc(doc(db, "programs", a.data()?.programId));
      setProgram({ id: p.id, ...p.data() });
    });
    return () => unsub();
  }, [params.id]);

  async function toggleModule(mid: string, checked: boolean) {
    setCompleted((v) => ({ ...v, [mid]: checked }));
    await setDoc(doc(collection(db, "progress")), {
      assignmentId: assignment.id,
      moduleId: mid,
      participantId: uid,
      percent: checked ? 100 : 0,
      updatedAt: serverTimestamp(),
    });
  }

  return (
    <div>
      {!program ? (
        <div className="text-white/70">Loading...</div>
      ) : (
        <ul className="space-y-2">
          {program.modules?.map((m: any) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg bg-slate-900 border border-white/10 p-3"
            >
              <div>
                <div className="font-medium">{m.title}</div>
                {m.videoUrl && (
                  <a
                    className="text-indigo-300 hover:underline text-sm"
                    href={m.videoUrl}
                    target="_blank"
                  >
                    Watch
                  </a>
                )}
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={!!completed[m.id]}
                  onChange={(e) => toggleModule(m.id, e.target.checked)}
                />
                <span className="text-sm">Completed</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
