"use client";
import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import Modal from "@/components/ui/Modal";

export default function AdminParticipants() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [programId, setProgramId] = useState("");

  useEffect(() => {
    const unsub1 = onSnapshot(
      query(collection(db, "users"), where("role", "==", "participant")),
      (snap) => {
        setParticipants(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    const unsub2 = onSnapshot(
      query(collection(db, "programs"), where("active", "==", true)),
      (snap) => {
        setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  async function assign() {
    if (!current || !programId) return;
    const p = await getDoc(doc(db, "programs", programId));
    await addDoc(collection(db, "assignments"), {
      participantId: current.id,
      programId,
      programTitle: p.data()?.title ?? programId,
      assignedAt: serverTimestamp(),
      assignedBy: "admin", // replace with admin uid if you store it
      status: "assigned",
    });
    setOpen(false);
    setProgramId("");
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2">Email</th>
              <th className="py-2">UID</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {participants.map((p) => (
              <tr key={p.id}>
                <td className="py-2">{p.email}</td>
                <td className="py-2 text-white/60">{p.id}</td>
                <td className="py-2 text-right">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400"
                    onClick={() => {
                      setCurrent(p);
                      setOpen(true);
                    }}
                  >
                    Assign Program
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Assign program to ${current?.email || ""}`}
      >
        <div className="space-y-3">
          <select
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            onClick={assign}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
            disabled={!programId}
          >
            Assign
          </button>
        </div>
      </Modal>
    </div>
  );
}
