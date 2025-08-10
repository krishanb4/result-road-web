"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  Timestamp,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Shield,
  User,
  ClipboardList,
  FileText,
  Calendar,
  Users,
  RefreshCw,
  Save,
} from "lucide-react";
import Link from "next/link";

type Role =
  | "admin"
  | "participant"
  | "instructor"
  | "fitness_partner"
  | "service_provider"
  | "support_worker";

interface UserDoc {
  displayName: string;
  email?: string;
  role: Role;
  active?: boolean;
  createdAt?: Timestamp;
  lastLoginAt?: Timestamp;
  progressScore?: number;
  adherence?: number;
  riskFlag?: boolean;
  phone?: string;
  notes?: string;
}

interface FormRow {
  id: string;
  type: string;
  role: Role;
  submissionDate?: Timestamp;
  status?: string;
  submittedByUid?: string;
  submittedByName?: string;
}

interface SessionRow {
  id: string;
  date: Timestamp;
  status?: string;
  programId?: string;
  participantUid?: string;
  instructorUid?: string;
  facilityName?: string;
  title?: string;
}

export default function AdminUserDetailPage() {
  const { userProfile } = useAuth();
  const params = useParams<{ uid: string }>();
  const uid = params?.uid;

  // Gate
  if (!userProfile) return null;
  if (userProfile.role !== "admin") {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">
          Only administrators can view user details.
        </p>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Editable fields
  const [role, setRole] = useState<Role>("participant");
  const [active, setActive] = useState(true);
  const [progressScore, setProgressScore] = useState<number>(0);
  const [riskFlag, setRiskFlag] = useState(false);
  const [notes, setNotes] = useState("");

  // Activity tabs
  const [forms, setForms] = useState<FormRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [lastFormDoc, setLastFormDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastSessDoc, setLastSessDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [moreFormsLoading, setMoreFormsLoading] = useState(false);
  const [moreSessLoading, setMoreSessLoading] = useState(false);

  const formatDate = (ts?: Timestamp) =>
    ts ? ts.toDate().toLocaleString() : "—";

  // Load profile + first page of activity
  useEffect(() => {
    const run = async () => {
      if (!uid) return;
      setLoading(true);
      setErr(null);
      setInfo(null);
      try {
        // User doc
        const uSnap = await getDoc(doc(db, "users", uid));
        if (!uSnap.exists()) {
          setErr("User not found.");
          setLoading(false);
          return;
        }
        const data = (uSnap.data() as any) || {};
        const base: UserDoc = {
          displayName:
            data.displayName ||
            data.name ||
            `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() ||
            uid,
          email: data.email,
          role: data.role || "participant",
          active: data.active !== false,
          createdAt: data.createdAt,
          lastLoginAt: data.lastLoginAt,
          progressScore:
            typeof data.progressScore === "number"
              ? Math.round(data.progressScore)
              : 0,
          adherence:
            typeof data.adherence === "number"
              ? Math.round(data.adherence)
              : undefined,
          riskFlag: !!data.riskFlag,
          phone: data.phone,
          notes: data.notes,
        };
        setUserDoc(base);
        setRole(base.role);
        setActive(base.active ?? true);
        setProgressScore(base.progressScore ?? 0);
        setRiskFlag(base.riskFlag ?? false);
        setNotes(base.notes ?? "");

        // Forms by/for this user (either submittedByUid == uid OR targetUid == uid)
        const fSnap = await getDocs(
          query(
            collection(db, "forms"),
            where("submissionDate", ">", Timestamp.fromMillis(0)),
            orderBy("submissionDate", "desc"),
            limit(25)
          )
        );
        const fRows: FormRow[] = fSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter((r) => r.submittedByUid === uid || r.targetUid === uid)
          .slice(0, 25);
        setForms(fRows);
        setLastFormDoc(
          fSnap.docs.length ? fSnap.docs[fSnap.docs.length - 1] : null
        );

        // Sessions involving this user
        const sSnap = await getDocs(
          query(
            collection(db, "sessions"),
            where("date", ">", Timestamp.fromMillis(0)),
            orderBy("date", "desc"),
            limit(25)
          )
        );
        const sRows: SessionRow[] = sSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter(
            (s) =>
              s.participantUid === uid ||
              s.instructorUid === uid ||
              s.supportWorkerUid === uid
          )
          .slice(0, 25);
        setSessions(sRows);
        setLastSessDoc(
          sSnap.docs.length ? sSnap.docs[sSnap.docs.length - 1] : null
        );

        // Assignments (if this user is a support worker or a client)
        const asn = await getDocs(collection(db, "assignments"));
        const asnRows = asn.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter((a) => a.supportWorkerUid === uid || a.clientUid === uid);
        setAssignments(asnRows);
      } catch (e: any) {
        setErr(e?.message || "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [uid]);

  const onSave = async () => {
    if (!uid) return;
    setInfo(null);
    setErr(null);
    try {
      await updateDoc(doc(db, "users", uid), {
        role,
        active,
        progressScore: Math.max(0, Math.min(100, progressScore || 0)),
        riskFlag,
        notes: notes.trim() || null,
      });
      setInfo("Profile updated.");
    } catch (e: any) {
      setErr(e?.message || "Update failed.");
    }
  };

  const loadMoreForms = async () => {
    if (!lastFormDoc) return;
    setMoreFormsLoading(true);
    try {
      const snap = await getDocs(
        query(
          collection(db, "forms"),
          orderBy("submissionDate", "desc"),
          startAfter(lastFormDoc),
          limit(25)
        )
      );
      const extra = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter((r) => r.submittedByUid === uid || r.targetUid === uid);
      setForms((prev) => [...prev, ...extra]);
      setLastFormDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
    } finally {
      setMoreFormsLoading(false);
    }
  };

  const loadMoreSessions = async () => {
    if (!lastSessDoc) return;
    setMoreSessLoading(true);
    try {
      const snap = await getDocs(
        query(
          collection(db, "sessions"),
          orderBy("date", "desc"),
          startAfter(lastSessDoc),
          limit(25)
        )
      );
      const extra = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter(
          (s) =>
            s.participantUid === uid ||
            s.instructorUid === uid ||
            s.supportWorkerUid === uid
        );
      setSessions((prev) => [...prev, ...extra]);
      setLastSessDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
    } finally {
      setMoreSessLoading(false);
    }
  };

  const headerStat = useMemo(() => {
    const formsCount = forms.length;
    const sessCount = sessions.length;
    const asnCount = assignments.length;
    return { formsCount, sessCount, asnCount };
  }, [forms, sessions, assignments]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading user…
        </div>
      </div>
    );
  }

  if (!userDoc) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>{err || "User not found."}</div>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 mt-4 text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {userDoc.displayName}
          </h1>
        </div>
        <div className="text-xs text-slate-500">
          UID: <span className="font-mono">{uid}</span>
        </div>
      </div>

      {/* Alerts */}
      {info && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <div>{info}</div>
        </div>
      )}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>{err}</div>
        </div>
      )}

      {/* Profile card */}
      <section className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <User className="w-5 h-5" />
              <span className="font-medium">{userDoc.displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-5 h-5" />
              <span>{userDoc.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Shield className="w-5 h-5" />
              <span className="capitalize">
                {userDoc.role.replace("_", " ")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <div className="text-slate-500">Created</div>
                <div>
                  {userDoc.createdAt
                    ? userDoc.createdAt.toDate().toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Last login</div>
                <div>
                  {userDoc.lastLoginAt
                    ? userDoc.lastLoginAt.toDate().toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Role
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2"
              >
                {[
                  "participant",
                  "support_worker",
                  "fitness_partner",
                  "service_provider",
                  "instructor",
                  "admin",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active
            </label>

            <label className="block">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Progress Score (%)
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={progressScore}
                onChange={(e) => setProgressScore(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2"
              />
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={riskFlag}
                onChange={(e) => setRiskFlag(e.target.checked)}
              />
              Flag as at-risk
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <label className="block h-full">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Admin Notes
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="mt-1 w-full h-[180px] rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2"
                placeholder="Private notes visible to admins only…"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={() => location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </section>

      {/* Quick stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <div className="text-2xl font-bold">{headerStat.formsCount}</div>
            <div className="text-slate-600 text-sm">Forms</div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
            <Calendar className="w-6 h-6 text-purple-700 dark:text-purple-300" />
          </div>
          <div>
            <div className="text-2xl font-bold">{headerStat.sessCount}</div>
            <div className="text-slate-600 text-sm">Sessions</div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-4">
            <Users className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div>
            <div className="text-2xl font-bold">{headerStat.asnCount}</div>
            <div className="text-slate-600 text-sm">Assignments</div>
          </div>
        </div>
      </div>

      {/* Forms table */}
      <section className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <h2 className="font-semibold">Forms</h2>
          </div>
          {lastFormDoc && (
            <button
              onClick={loadMoreForms}
              disabled={moreFormsLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            >
              {moreFormsLoading ? "Loading…" : "Load More"}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Submitted By</th>
                <th className="text-left px-4 py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {forms.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No forms.
                  </td>
                </tr>
              ) : (
                forms.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="px-4 py-2">{f.type}</td>
                    <td className="px-4 py-2 capitalize">
                      {f.role?.replace("_", " ")}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(f.submissionDate)}
                    </td>
                    <td className="px-4 py-2 capitalize">{f.status || "—"}</td>
                    <td className="px-4 py-2">
                      {f.submittedByName || f.submittedByUid || "—"}
                    </td>
                    <td className="px-4 py-2">{f.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sessions table */}
      <section className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="font-semibold">Sessions</h2>
          </div>
          {lastSessDoc && (
            <button
              onClick={loadMoreSessions}
              disabled={moreSessLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            >
              {moreSessLoading ? "Loading…" : "Load More"}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Program</th>
                <th className="text-left px-4 py-2">Facility</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No sessions.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{formatDate(s.date)}</td>
                    <td className="px-4 py-2">{s.title || "Session"}</td>
                    <td className="px-4 py-2 capitalize">{s.status || "—"}</td>
                    <td className="px-4 py-2">{s.programId || "—"}</td>
                    <td className="px-4 py-2">{s.facilityName || "—"}</td>
                    <td className="px-4 py-2">
                      {s.participantUid === uid
                        ? "Participant"
                        : s.instructorUid === uid
                        ? "Instructor"
                        : "Support Worker"}
                    </td>
                    <td className="px-4 py-2">{s.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assignments */}
      <section className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="font-semibold">Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-2">Support Worker</th>
                <th className="text-left px-4 py-2">Client</th>
                <th className="text-left px-4 py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No assignments.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-4 py-2">{a.supportWorkerUid || "—"}</td>
                    <td className="px-4 py-2">{a.clientUid || "—"}</td>
                    <td className="px-4 py-2">{a.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
