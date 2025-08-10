"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertCircle,
  Loader2,
  Search,
  ShieldCheck,
  UserCog,
  UserMinus,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type Role =
  | "admin"
  | "participant"
  | "instructor"
  | "fitness_partner"
  | "service_provider"
  | "support_worker";

interface UserRow {
  uid: string;
  role: Role;
  displayName: string;
  email?: string;
  active?: boolean;
  createdAt?: Timestamp;
  lastLoginAt?: Timestamp;
  progressScore?: number;
}

const PAGE_SIZE = 30;
const ROLE_OPTIONS: Role[] = [
  "participant",
  "support_worker",
  "fitness_partner",
  "service_provider",
  "instructor",
  "admin",
];

export default function AdminUsersPage() {
  const { userProfile } = useAuth();

  // Gate
  if (!userProfile) return null;
  if (userProfile.role !== "admin") {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-500">Only administrators can access Users.</p>
      </div>
    );
  }

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [activeOnly, setActiveOnly] = useState(false);

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Base query (keep index needs minimal)
  const baseQuery = useMemo(() => {
    let qRef = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    if (roleFilter !== "all")
      qRef = query(qRef, where("role", "==", roleFilter));
    return qRef;
  }, [roleFilter]);

  const matchesClientFilters = (u: UserRow) => {
    if (activeOnly && u.active === false) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      (u.displayName || "").toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      u.uid.toLowerCase().includes(s)
    );
  };

  const fetchFirstPage = async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const snap = await getDocs(baseQuery);
      const list = snap.docs.map((d) => {
        const u = d.data() as any;
        return {
          uid: d.id,
          role: (u?.role || "participant") as Role,
          displayName:
            u?.displayName ||
            u?.name ||
            `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
            d.id,
          email: u?.email,
          active: u?.active !== false, // default true
          createdAt: u?.createdAt,
          lastLoginAt: u?.lastLoginAt,
          progressScore:
            typeof u?.progressScore === "number"
              ? Math.round(u.progressScore)
              : undefined,
        } as UserRow;
      });
      setRows(list);
      setLastDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
    } catch (e: any) {
      setErrMsg(e?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const qMore = query(baseQuery, startAfter(lastDoc));
      const snap = await getDocs(qMore);
      const list = snap.docs.map((d) => {
        const u = d.data() as any;
        return {
          uid: d.id,
          role: (u?.role || "participant") as Role,
          displayName:
            u?.displayName ||
            u?.name ||
            `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() ||
            d.id,
          email: u?.email,
          active: u?.active !== false,
          createdAt: u?.createdAt,
          lastLoginAt: u?.lastLoginAt,
          progressScore:
            typeof u?.progressScore === "number"
              ? Math.round(u.progressScore)
              : undefined,
        } as UserRow;
      });
      setRows((prev) => [...prev, ...list]);
      setLastDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQuery]);

  const filtered = rows.filter(matchesClientFilters);

  const refresh = async () => {
    setInfoMsg(null);
    setErrMsg(null);
    setLastDoc(null);
    await fetchFirstPage();
  };

  const updateUser = async (uid: string, patch: Partial<UserRow>) => {
    setSavingUid(uid);
    setErrMsg(null);
    setInfoMsg(null);
    try {
      await updateDoc(doc(db, "users", uid), patch as any);
      setRows((prev) =>
        prev.map((r) => (r.uid === uid ? { ...r, ...patch } : r))
      );
      setInfoMsg("User updated.");
    } catch (e: any) {
      setErrMsg(e?.message || "Update failed.");
    } finally {
      setSavingUid(null);
    }
  };

  const onChangeRole = async (uid: string, role: Role) => {
    await updateUser(uid, { role });
  };

  const onToggleActive = async (uid: string, current?: boolean) => {
    await updateUser(uid, { active: !current });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View and manage all users by role. (Live from Firestore)
          </p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {infoMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <div>{infoMsg}</div>
        </div>
      )}
      {errMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>{errMsg}</div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm grid gap-3 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or UID…"
            className="w-full pl-11 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
        >
          <option value="all">All roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active users only
        </label>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Active</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-left px-4 py-3">Last Login</th>
              <th className="text-left px-4 py-3">Progress</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading users…
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.uid}
                  className="border-t border-slate-200/60 dark:border-slate-700/60"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {u.displayName}
                    <div className="text-xs text-slate-500">{u.uid}</div>
                  </td>
                  <td className="px-4 py-3">{u.email || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-500" />
                      <select
                        disabled={savingUid === u.uid}
                        value={u.role}
                        onChange={(e) =>
                          onChangeRole(u.uid, e.target.value as Role)
                        }
                        className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${
                        u.active
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                      }`}
                    >
                      {u.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.createdAt
                      ? u.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {u.lastLoginAt
                      ? u.lastLoginAt.toDate().toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {typeof u.progressScore === "number"
                      ? `${u.progressScore}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={savingUid === u.uid}
                        onClick={() => onToggleActive(u.uid, u.active)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                        title={u.active ? "Disable user" : "Enable user"}
                      >
                        <UserMinus className="w-4 h-4" />
                        {u.active ? "Disable" : "Enable"}
                      </button>
                      <a
                        href={`/admin/users/${u.uid}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white"
                        title="View details"
                      >
                        <UserCog className="w-4 h-4" />
                        Details
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {lastDoc && (
        <div className="text-center">
          <button
            onClick={fetchMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <div className="text-xs text-slate-500">
        Tip: role/active changes write to <code>users/{`{uid}`}</code>. Ensure
        your Firestore rules allow admins to update these fields.
      </div>
    </div>
  );
}
