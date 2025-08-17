"use client";
import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminProgress() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(
    () =>
      onSnapshot(collection(db, "progress"), (snap) => {
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }),
    []
  );
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2">Participant</th>
              <th className="py-2">Assignment</th>
              <th className="py-2">Module</th>
              <th className="py-2">Percent</th>
              <th className="py-2">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="py-2">{r.participantId}</td>
                <td className="py-2">{r.assignmentId}</td>
                <td className="py-2">{r.moduleId}</td>
                <td className="py-2">{r.percent}%</td>
                <td className="py-2 text-white/60">
                  {r.updatedAt?.toDate?.().toLocaleString?.() || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
