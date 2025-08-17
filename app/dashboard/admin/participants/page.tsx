// app/dashboard/admin/participants/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "@/lib/firebase";
import Modal from "@/components/ui/Modal";
import { Eye, Ban, CheckCircle2, Trash2 } from "lucide-react";

/* ---------------- Types ---------------- */
type UserRow = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  role?: string | null;
  disabled?: boolean | null;
  createdAt?: any;
};

type Program = {
  id: string;
  title?: string;
  active?: boolean;
  fitnessPartnerId?: string | null;
};
type Assignment = {
  id: string;
  participantId: string;
  programId: string;
  programTitle?: string;
};

const ROLE_OPTIONS = [
  { value: "participant", label: "Participant" },
  { value: "fitness_partner", label: "Fitness Partner" },
  { value: "service_provider", label: "Service Provider" },
  { value: "coordinator", label: "Coordinator" },
  { value: "admin", label: "Admin" },
];

/* ---------------- UI helpers ---------------- */
function RoleBadge({ role }: { role?: string | null }) {
  const label =
    ROLE_OPTIONS.find((r) => r.value === role)?.label || (role ?? "—");
  const cls =
    role === "admin"
      ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
      : role === "coordinator"
      ? "bg-sky-500/20 text-sky-300 border-sky-400/30"
      : role === "service_provider"
      ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
      : role === "fitness_partner"
      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
      : role === "participant"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
      : "bg-white/10 text-white/70 border-white/15";
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function maskEmail(email?: string | null) {
  if (!email) return "—";
  const [local, domain = ""] = email.split("@");
  if (!local) return email;
  const keep = Math.min(2, local.length);
  return `${local.slice(0, keep)}****@${domain}`;
}

function toJSDate(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/* ---------------- Page ---------------- */
export default function AdminParticipants() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [programs, setPrograms] = useState<Record<string, Program>>({});
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Assign Program modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);
  const [programId, setProgramId] = useState("");

  // Change Role modal
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState("participant");
  const [roleBusy, setRoleBusy] = useState(false);

  // Delete modal
  const [delOpen, setDelOpen] = useState(false);
  const [delBusy, setDelBusy] = useState(false);

  // NEW: Details modal
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const functions = getFunctions();

  /* ---- live users ---- */
  useEffect(() => {
    const qUsers = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  /* ---- live programs ---- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "programs"), (snap) => {
      const map: Record<string, Program> = {};
      snap.docs.forEach(
        (d) => (map[d.id] = { id: d.id, ...(d.data() as any) })
      );
      setPrograms(map);
    });
    return () => unsub();
  }, []);

  /* ---- live assignments ---- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "assignments"), (snap) => {
      setAssignments(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Assignment[]
      );
    });
    return () => unsub();
  }, []);

  /* ---- derived: programs per user ---- */
  const programsByUser = useMemo(() => {
    const map = new Map<string, { id: string; title: string }[]>();
    for (const a of assignments) {
      const list = map.get(a.participantId) || [];
      const title =
        a.programTitle ||
        programs[a.programId]?.title ||
        `Program ${String(a.programId).slice(0, 6)}…`;
      if (!list.find((x) => x.id === a.programId))
        list.push({ id: a.programId, title });
      map.set(a.participantId, list);
    }
    return map;
  }, [assignments, programs]);

  const programOptions = useMemo(() => {
    return Object.values(programs)
      .filter((p) => p?.id)
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [programs]);

  /* ---- filtered users ---- */
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && (u.role || "") !== roleFilter) return false;
      if (statusFilter === "active" && u.disabled) return false;
      if (statusFilter === "disabled" && !u.disabled) return false;
      if (programFilter !== "all") {
        const progs = programsByUser.get(u.id) || [];
        if (!progs.some((p) => p.id === programFilter)) return false;
      }
      if (q) {
        const name = (u.displayName || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        if (!name.includes(q) && !email.includes(q)) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, programFilter, search, programsByUser]);

  /* ---- actions ---- */
  async function assignProgram() {
    if (!currentUser || !programId) return;
    const pSnap = await getDoc(doc(db, "programs", programId));
    const programTitle =
      (pSnap.exists() ? pSnap.data()?.title : null) ?? programId;
    await addDoc(collection(db, "assignments"), {
      participantId: currentUser.id,
      programId,
      programTitle,
      assignedAt: serverTimestamp(),
      assignedBy: "admin",
      status: "assigned",
    });
    setAssignOpen(false);
    setProgramId("");
  }

  async function toggleDisable(u: UserRow) {
    const next = !u.disabled;
    try {
      const call = httpsCallable(functions, "adminSetDisabled");
      await call({ uid: u.id, disabled: next });
    } catch (e) {
      console.warn(
        "adminSetDisabled callable failed; ensure Cloud Function is deployed.",
        e
      );
    }
  }

  function openRole(u: UserRow) {
    setCurrentUser(u);
    setRoleValue(u.role || "participant");
    setRoleOpen(true);
  }

  async function saveRole() {
    if (!currentUser) return;
    setRoleBusy(true);
    try {
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", currentUser.id), {
        role: roleValue,
        updatedAt: serverTimestamp(),
      });

      try {
        const call = httpsCallable(functions, "adminSetRole");
        await call({ uid: currentUser.id, role: roleValue });
      } catch (e) {
        console.warn(
          "adminSetRole callable failed; ensure Cloud Function is deployed.",
          e
        );
      }

      setRoleOpen(false);
    } finally {
      setRoleBusy(false);
    }
  }

  function openDelete(u: UserRow) {
    setCurrentUser(u);
    setDelOpen(true);
  }

  async function deleteUserNow() {
    if (!currentUser) return;
    setDelBusy(true);
    try {
      const call = httpsCallable(functions, "adminDeleteUser");
      await call({ uid: currentUser.id });
      setDelOpen(false);
    } finally {
      setDelBusy(false);
    }
  }

  function openDetails(u: UserRow) {
    setCurrentUser(u);
    setDetailsOpen(true);
  }

  const currentPrograms = useMemo(() => {
    if (!currentUser) return [];
    return programsByUser.get(currentUser.id) || [];
  }, [currentUser, programsByUser]);

  const createdAtLabel = useMemo(() => {
    if (!currentUser) return "—";
    const d = toJSDate(currentUser.createdAt);
    return d ? d.toLocaleString() : "—";
  }, [currentUser]);

  /* ---- UI ---- */
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/70">Role</label>
          <select
            className="rounded-lg bg-slate-900 border border-white/10 p-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-white/70">Status</label>
          <select
            className="rounded-lg bg-slate-900 border border-white/10 p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <div className="flex items-center gap-2 min-w-[220px]">
          <label className="text-sm text-white/70">Program</label>
          <select
            className="flex-1 rounded-lg bg-slate-900 border border-white/10 p-2"
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
          >
            <option value="all">All</option>
            {programOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <input
            className="w-64 rounded-lg bg-slate-900 border border-white/10 p-2"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Count */}
      <div className="text-xs text-white/60">
        Showing <b>{filteredUsers.length}</b> of {users.length}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Programs</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredUsers.map((u) => {
              const progs = programsByUser.get(u.id) || [];
              return (
                <tr key={u.id}>
                  <td className="py-2 pr-4 align-top">
                    {u.displayName || "—"}
                  </td>
                  <td className="py-2 pr-4 align-top">{maskEmail(u.email)}</td>
                  <td className="py-2 pr-4 align-top">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="py-2 pr-4 align-top">
                    {progs.length ? (
                      <div className="flex flex-wrap gap-1">
                        {progs.map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs"
                            title={p.id}
                          >
                            {p.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white/60">No programs</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 align-top">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        u.disabled
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {u.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="py-2 pr-4 align-top">
                    <div className="flex justify-end gap-2">
                      {/* View details (icon) */}
                      <button
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                        onClick={() => openDetails(u)}
                        title="View details"
                        aria-label="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Assign Program (keep as text or icon—your call) */}
                      <button
                        className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400"
                        onClick={() => {
                          setCurrentUser(u);
                          setAssignOpen(true);
                        }}
                      >
                        Assign Program
                      </button>

                      {/* Change Role (kept as text for clarity) */}
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                        onClick={() => openRole(u)}
                        title="Change Role"
                      >
                        Change Role
                      </button>

                      {/* Disable / Enable (icon only) */}
                      <button
                        className={`p-2 rounded-lg ${
                          u.disabled
                            ? "bg-emerald-600 hover:bg-emerald-500"
                            : "bg-amber-600 hover:bg-amber-500"
                        }`}
                        onClick={() => toggleDisable(u)}
                        title={u.disabled ? "Enable login" : "Disable login"}
                        aria-label={
                          u.disabled ? "Enable login" : "Disable login"
                        }
                      >
                        {u.disabled ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete (icon only) */}
                      <button
                        className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500"
                        onClick={() => openDelete(u)}
                        title="Delete user"
                        aria-label="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/60">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Program Modal */}
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Assign program to ${
          currentUser?.email || currentUser?.displayName || ""
        }`}
      >
        <div className="space-y-3">
          <select
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option value="">Select a program</option>
            {programOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.id}
              </option>
            ))}
          </select>
          <button
            onClick={assignProgram}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
            disabled={!programId}
          >
            Assign
          </button>
        </div>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        title={`Change role for ${
          currentUser?.email || currentUser?.displayName || ""
        }`}
      >
        <div className="space-y-3">
          <select
            className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRoleOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={saveRole}
              disabled={roleBusy}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
              type="button"
            >
              {roleBusy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title={`Delete ${
          currentUser?.email || currentUser?.displayName || ""
        }?`}
      >
        <div className="space-y-4">
          <p className="text-white/80">
            This will remove the user from Firebase Authentication. You can also
            clean up Firestore data in the Cloud Function.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDelOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={deleteUserNow}
              disabled={delBusy}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60"
              type="button"
            >
              {delBusy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* NEW: Details Modal */}
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`User details`}
      >
        {currentUser ? (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-2">
              <Field label="Name" value={currentUser.displayName || "—"} />
              <Field
                label="Email"
                value={
                  currentUser.email ? (
                    <a
                      className="text-indigo-300 hover:underline"
                      href={`mailto:${currentUser.email}`}
                    >
                      {currentUser.email}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Field
                label="Role"
                value={<RoleBadge role={currentUser.role} />}
              />
              <Field
                label="Status"
                value={
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      currentUser.disabled
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {currentUser.disabled ? "Disabled" : "Active"}
                  </span>
                }
              />
              <Field
                label="UID"
                value={<code className="text-xs">{currentUser.id}</code>}
              />
              <Field label="Created" value={createdAtLabel} />
            </div>

            <div className="space-y-1">
              <div className="text-sm text-white/70">Programs</div>
              {currentPrograms.length ? (
                <ul className="list-disc pl-5 text-sm">
                  {currentPrograms.map((p) => (
                    <li key={p.id}>{p.title}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-white/60 text-sm">
                  No programs assigned.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-white/70">No user selected.</div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Small components ---------------- */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="text-white/90 text-[13px]">{value}</div>
    </div>
  );
}
