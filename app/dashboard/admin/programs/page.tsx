// app/dashboard/admin/programs/page.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Modal from "@/components/ui/Modal";

type SimpleUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

function toDateInputStr(d?: any) {
  const date =
    d?.toDate?.() || (d instanceof Date ? d : d ? new Date(d) : null);
  if (!date || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const da = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
function fmtHuman(d?: any) {
  const date = d?.toDate?.() || (d instanceof Date ? d : null);
  return date
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
    : "—";
}
function nameOf(u?: { displayName?: string | null; email?: string | null }) {
  return u?.displayName || u?.email || "—";
}

const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.95)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--chip-bg" as any]: "rgba(2,6,23,0.04)",
  ["--table-div" as any]: "rgba(15,23,42,0.06)",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);

  // CREATE form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fitnessPartners, setFitnessPartners] = useState<SimpleUser[]>([]);
  const [serviceProviders, setServiceProviders] = useState<SimpleUser[]>([]);
  const [fitnessPartnerId, setFitnessPartnerId] = useState("");
  const [serviceProviderId, setServiceProviderId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // EDIT modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFP, setEditFP] = useState("");
  const [editSP, setEditSP] = useState("");
  const [editFrom, setEditFrom] = useState("");
  const [editTo, setEditTo] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // DELETE confirm state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  // quick lookups
  const fitnessPartnerById = useMemo(
    () => Object.fromEntries(fitnessPartners.map((u) => [u.id, u])),
    [fitnessPartners]
  );
  const serviceProviderById = useMemo(
    () => Object.fromEntries(serviceProviders.map((u) => [u.id, u])),
    [serviceProviders]
  );

  // Load programs
  useEffect(() => {
    const qProg = query(collection(db, "programs"), orderBy("title"));
    return onSnapshot(qProg, (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Load fitness partners
  useEffect(() => {
    const qFP = query(
      collection(db, "users"),
      where("role", "==", "fitness_partner")
    );
    return onSnapshot(qFP, (snap) => {
      const rows = snap.docs.map((d) => ({
        id: d.id,
        email: d.data()?.email ?? null,
        displayName: d.data()?.displayName ?? null,
      }));
      setFitnessPartners(rows);
    });
  }, []);

  // Load service providers
  useEffect(() => {
    const qSP = query(
      collection(db, "users"),
      where("role", "==", "service_provider")
    );
    return onSnapshot(qSP, (snap) => {
      const rows = snap.docs.map((d) => ({
        id: d.id,
        email: d.data()?.email ?? null,
        displayName: d.data()?.displayName ?? null,
      }));
      setServiceProviders(rows);
    });
  }, []);

  // CREATE
  const createDateError =
    fromDate && toDate && new Date(fromDate) > new Date(toDate)
      ? "From date cannot be after To date."
      : "";
  const createAllRequired =
    !!title.trim() &&
    !!description.trim() &&
    !!fitnessPartnerId &&
    !!serviceProviderId &&
    !!fromDate &&
    !!toDate &&
    !createDateError;

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createAllRequired) return;
    setSubmitting(true);
    try {
      const startAt = new Date(fromDate + "T00:00:00");
      const endAt = new Date(toDate + "T23:59:59");
      const fpRow = fitnessPartners.find((u) => u.id === fitnessPartnerId);
      const spRow = serviceProviders.find((u) => u.id === serviceProviderId);

      await addDoc(collection(db, "programs"), {
        title: title.trim(),
        description: description.trim(),
        active: true,
        modules: [],
        fitnessPartnerId,
        serviceProviderId,
        // ✅ store names so we never show IDs
        fitnessPartnerName: nameOf(fpRow),
        serviceProviderName: nameOf(spRow),
        startAt,
        endAt,
      });

      setTitle("");
      setDescription("");
      setFromDate("");
      setToDate("");
      setFitnessPartnerId("");
      setServiceProviderId("");
    } finally {
      setSubmitting(false);
    }
  }

  // EDIT
  function openEdit(p: any) {
    setEditId(p.id);
    setEditTitle(p.title ?? "");
    setEditDescription(p.description ?? "");
    setEditFP(p.fitnessPartnerId ?? "");
    setEditSP(p.serviceProviderId ?? "");
    setEditFrom(toDateInputStr(p.startAt));
    setEditTo(toDateInputStr(p.endAt));
    setEditOpen(true);
  }
  const editDateError =
    editFrom && editTo && new Date(editFrom) > new Date(editTo)
      ? "From date cannot be after To date."
      : "";
  const editAllRequired =
    !!editTitle.trim() &&
    !!editDescription.trim() &&
    !!editFP &&
    !!editSP &&
    !!editFrom &&
    !!editTo &&
    !editDateError;

  async function onEditSubmit() {
    if (!editAllRequired || !editId) return;
    setEditSubmitting(true);
    try {
      const startAt = new Date(editFrom + "T00:00:00");
      const endAt = new Date(editTo + "T23:59:59");
      const fpRowE = fitnessPartners.find((u) => u.id === editFP);
      const spRowE = serviceProviders.find((u) => u.id === editSP);

      await updateDoc(doc(db, "programs", editId), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        fitnessPartnerId: editFP,
        serviceProviderId: editSP,
        // ✅ keep names synced
        fitnessPartnerName: nameOf(fpRowE),
        serviceProviderName: nameOf(spRowE),
        startAt,
        endAt,
      });
      setEditOpen(false);
    } finally {
      setEditSubmitting(false);
    }
  }

  async function toggleActive(p: any) {
    await updateDoc(doc(db, "programs", p.id), { active: !p.active });
  }

  // DELETE
  function openDelete(p: any) {
    setDeleteTarget(p);
    setDeleteOpen(true);
  }
  async function onDeleteConfirm() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "programs", deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8 text-[var(--panel-text)]" style={tokens}>
      {/* CREATE */}
      <section className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 md:p-6 backdrop-blur">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">
          Create Program
        </h2>

        <form className="grid md:grid-cols-2 gap-4" onSubmit={onCreate}>
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-text)]">
              Title <span className="text-rose-600">*</span>
            </label>
            <input
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              placeholder="Program title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-text)]">
              Fitness Partner <span className="text-rose-600">*</span>
            </label>
            <select
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={fitnessPartnerId}
              onChange={(e) => setFitnessPartnerId(e.target.value)}
            >
              <option value="">— Select Fitness Partner —</option>
              {fitnessPartners.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.email || "(unknown user)"}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-[var(--muted-text)]">
              Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              placeholder="Describe the program"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-text)]">
              Service Provider <span className="text-rose-600">*</span>
            </label>
            <select
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={serviceProviderId}
              onChange={(e) => setServiceProviderId(e.target.value)}
            >
              <option value="">— Select Service Provider —</option>
              {serviceProviders.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.email || "(unknown user)"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-text)]">
                From <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-text)]">
                To <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {createDateError ? (
            <div className="md:col-span-2 text-rose-600 text-xs">
              {createDateError}
            </div>
          ) : null}

          <div className="md:col-span-2 mt-2 flex gap-2">
            <button
              type="submit"
              disabled={!createAllRequired || submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add Program"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                setFromDate("");
                setToDate("");
                setFitnessPartnerId("");
                setServiceProviderId("");
              }}
              className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* PROGRAMS LIST */}
      {/* Desktop/table */}
      <section className="hidden md:block rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-3 md:p-5 backdrop-blur">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">Programs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="text-left text-slate-600 border-b border-[var(--panel-border)]">
              <tr>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Fitness Partner</th>
                <th className="py-2 pr-4">Service Provider</th>
                <th className="py-2 pr-4">From</th>
                <th className="py-2 pr-4">To</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                ["--tw-divide-opacity" as any]: 1,
                ["--tw-divide-color" as any]: "var(--table-div)",
              }}
            >
              {programs.map((p) => (
                <tr key={p.id} className="text-slate-800 align-top">
                  <td className="py-2 pr-4">
                    <div className="font-medium">{p.title}</div>
                    {p.description ? (
                      <div className="text-slate-600 text-xs max-w-[48ch] truncate">
                        {p.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4">
                    {p.fitnessPartnerName ||
                      nameOf(fitnessPartnerById[p.fitnessPartnerId])}
                  </td>
                  <td className="py-2 pr-4">
                    {p.serviceProviderName ||
                      nameOf(serviceProviderById[p.serviceProviderId])}
                  </td>
                  <td className="py-2 pr-4">{fmtHuman(p.startAt)}</td>
                  <td className="py-2 pr-4">{fmtHuman(p.endAt)}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        p.active
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-300/60"
                          : "bg-rose-500/10 text-rose-700 border-rose-300/60"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 pr-0">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleActive(p)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                        title="Toggle Active"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg-black/[0.06]"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(p)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {programs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No programs yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile/card list */}
      <section className="md:hidden grid gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Programs</h2>
        {programs.length === 0 && (
          <div className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 text-slate-500">
            No programs yet. Create one above.
          </div>
        )}
        {programs.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-900 font-medium">{p.title}</div>
                {p.description ? (
                  <div className="text-sm text-slate-600 line-clamp-2">
                    {p.description}
                  </div>
                ) : null}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded border self-start ${
                  p.active
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-300/60"
                    : "bg-rose-500/10 text-rose-700 border-rose-300/60"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
              <div>
                <div className="text-[11px] text-[var(--muted-text)]">
                  Fitness Partner
                </div>
                <div>
                  {p.fitnessPartnerName ||
                    nameOf(fitnessPartnerById[p.fitnessPartnerId])}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[var(--muted-text)]">
                  Service Provider
                </div>
                <div>
                  {p.serviceProviderName ||
                    nameOf(serviceProviderById[p.serviceProviderId])}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[var(--muted-text)]">From</div>
                <div>{fmtHuman(p.startAt)}</div>
              </div>
              <div>
                <div className="text-[11px] text-[var(--muted-text)]">To</div>
                <div>{fmtHuman(p.endAt)}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => toggleActive(p)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              >
                Toggle
              </button>
              <button
                onClick={() => openEdit(p)}
                className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg-black/[0.06]"
              >
                Edit
              </button>
              <button
                onClick={() => openDelete(p)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Program"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-[var(--muted-text)]">Title *</label>
            <input
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--muted-text)]">
              Description *
            </label>
            <textarea
              required
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm text-[var(--muted-text)]">
                Fitness Partner *
              </label>
              <select
                required
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={editFP}
                onChange={(e) => setEditFP(e.target.value)}
              >
                <option value="">— Select Fitness Partner —</option>
                {fitnessPartners.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || "(unknown user)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[var(--muted-text)]">
                Service Provider *
              </label>
              <select
                required
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={editSP}
                onChange={(e) => setEditSP(e.target.value)}
              >
                <option value="">— Select Service Provider —</option>
                {serviceProviders.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || "(unknown user)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm text-[var(--muted-text)]">From *</label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={editFrom}
                onChange={(e) => setEditFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--muted-text)]">To *</label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={editTo}
                onChange={(e) => setEditTo(e.target.value)}
              />
            </div>
          </div>

          {editDateError ? (
            <div className="text-rose-600 text-xs">{editDateError}</div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onEditSubmit}
              disabled={!editAllRequired || editSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
              type="button"
            >
              {editSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Program"
      >
        <div className="space-y-4">
          <p className="text-[var(--muted-text)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {deleteTarget?.title || "this program"}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onDeleteConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-60"
            type="button"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
