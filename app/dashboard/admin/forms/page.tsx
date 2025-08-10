"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

type Role =
  | "participant"
  | "support_worker"
  | "fitness_partner"
  | "service_provider"
  | "instructor"
  | "admin";
type Status = "completed" | "pending_review" | "in_review" | "overdue";
interface Row {
  id: string;
  type: string;
  role: Role;
  submissionDate?: Timestamp;
  status?: Status;
  submittedByUid?: string;
  submittedByName?: string;
}
const PAGE = 25;

export default function AdminForms() {
  const { userProfile } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [last, setLast] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  if (userProfile?.role !== "admin")
    return <div className="p-6">Admin only.</div>;

  const base = useMemo(() => {
    let qRef = query(
      collection(db, "forms"),
      orderBy("submissionDate", "desc"),
      limit(PAGE)
    );
    if (roleFilter !== "all")
      qRef = query(qRef, where("role", "==", roleFilter));
    return qRef;
  }, [roleFilter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const snap = await getDocs(base);
      setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setLast(snap.docs.at(-1) || null);
      setLoading(false);
    })();
  }, [base]);

  const filtered = rows.filter(
    (r) =>
      (typeFilter === "all" || r.type === typeFilter) &&
      (statusFilter === "all" || r.status === statusFilter)
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">All Form Submissions</h1>
      <div className="flex gap-3 flex-wrap">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All roles</option>
          <option value="participant">Participant</option>
          <option value="support_worker">Support Worker</option>
          <option value="fitness_partner">Fitness Partner</option>
          <option value="service_provider">Service Provider</option>
          <option value="instructor">COS/Instructor</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All types</option>
          <option>Client Management Form</option>
          <option>Group Management Form</option>
          <option>Feedback Form</option>
          <option>Progress Overview</option>
          <option>Training Program</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All status</option>
          <option value="completed">Completed</option>
          <option value="pending_review">Pending Review</option>
          <option value="in_review">In Review</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Submitted By</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center">
                  No forms.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.type}</td>
                  <td className="px-4 py-2">
                    {r.submittedByName || r.submittedByUid}
                  </td>
                  <td className="px-4 py-2">{r.role}</td>
                  <td className="px-4 py-2">
                    {r.submissionDate?.toDate().toLocaleString() || "—"}
                  </td>
                  <td className="px-4 py-2">{r.status || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
