"use client";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function AdminForms() {
  const [rows, setRows] = useState<any[]>([]);
  const [type, setType] = useState<string>("all");

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "forms"), orderBy("createdAt", "desc")),
        (snap) => {
          setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      ),
    []
  );

  const filtered = useMemo(
    () => (type === "all" ? rows : rows.filter((r) => r.type === type)),
    [rows, type]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <select
          className="rounded-lg bg-slate-900 border border-white/10 p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="service_provider_feedback">
            Service Provider Feedback
          </option>
          <option value="fitness_partner_group_feedback">
            Fitness Partner Group Feedback
          </option>
          <option value="support_worker_monitoring">
            Support Worker Monitoring
          </option>
          <option value="coordinator_progress_overview">
            Coordinator Progress Overview
          </option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2">Type</th>
              <th className="py-2">User</th>
              <th className="py-2">Data</th>
              <th className="py-2">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="py-2">{r.type}</td>
                <td className="py-2 text-white/80">{r.uid}</td>
                <td className="py-2 text-white/70">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(r.data, null, 2)}
                  </pre>
                </td>
                <td className="py-2 text-white/60">
                  {r.createdAt?.toDate?.().toLocaleString?.() || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
