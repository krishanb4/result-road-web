"use client";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function AdminDataPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const colls = [
      "monitoringForms",
      "groupManagementForms",
      "serviceProviderFeedback",
      "progressOverviews",
    ];

    const unsubs = colls.map((c) =>
      onSnapshot(
        query(collection(db, c), orderBy("createdAt", "desc")),
        (snap) => {
          setRows((prev) => {
            const others = prev.filter((r) => r._collection !== c);
            const fresh = snap.docs.map((d) => ({
              _collection: c,
              id: d.id,
              ...d.data(),
            }));
            return [...others, ...fresh];
          });
        }
      )
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Submissions</h2>
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <Th>Collection</Th>
              <Th>ID</Th>
              <Th>Created</Th>
              <Th>Preview</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r._collection}-${r.id}`} className="border-t">
                <Td>{r._collection}</Td>
                <Td className="font-mono text-xs">{r.id}</Td>
                <Td>{r.createdAt?.toDate?.().toLocaleString?.() ?? ""}</Td>
                <Td className="max-w-[420px] truncate">{JSON.stringify(r)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left font-medium text-neutral-700">
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
