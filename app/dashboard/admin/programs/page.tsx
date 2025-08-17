"use client";

import { useEffect, useMemo, useState } from "react";
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
import Modal from "@/components/ui/Modal"; // <-- make sure this exists

// Simple user shape for dropdowns
type SimpleUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

// Helpers
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

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);

  // CREATE form state (full-width form)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState(""); // yyyy-mm-dd
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

  // convenience: quick lookup by id for table rendering
  const fitnessPartnerById = useMemo(
    () => Object.fromEntries(fitnessPartners.map((u) => [u.id, u])),
    [fitnessPartners]
  );
  const serviceProviderById = useMemo(
    () => Object.fromEntries(serviceProviders.map((u) => [u.id, u])),
    [serviceProviders]
  );

  // Load programs (ordered by title; adjust if you prefer)
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

  // ----- CREATE

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

      await addDoc(collection(db, "programs"), {
        title: title.trim(),
        description: description.trim(),
        active: true,
        modules: [],
        fitnessPartnerId,
        serviceProviderId,
        startAt,
        endAt,
      });

      // reset form
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

  // ----- EDIT

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

      await updateDoc(doc(db, "programs", editId), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        fitnessPartnerId: editFP,
        serviceProviderId: editSP,
        startAt,
        endAt,
      });

      setEditOpen(false);
    } finally {
      setEditSubmitting(false);
    }
  }

  // Toggle active (unchanged)
  async function toggleActive(p: any) {
    await updateDoc(doc(db, "programs", p.id), { active: !p.active });
  }

  // ----- DELETE

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
    <div className="space-y-8">
      {/* CREATE: FULL-WIDTH FORM */}
      <section className="rounded-2xl bg-slate-900 border border-white/10 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Create Program</h2>

        <form className="grid md:grid-cols-2 gap-4" onSubmit={onCreate}>
          <div className="space-y-2">
            <label className="text-sm text-white/80">
              Title <span className="text-rose-300">*</span>
            </label>
            <input
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              placeholder="Program title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">
              Fitness Partner <span className="text-rose-300">*</span>
            </label>
            <select
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={fitnessPartnerId}
              onChange={(e) => setFitnessPartnerId(e.target.value)}
            >
              <option value="">— Select Fitness Partner —</option>
              {fitnessPartners.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.email || u.id}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-white/80">
              Description <span className="text-rose-300">*</span>
            </label>
            <textarea
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              placeholder="Describe the program"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">
              Service Provider <span className="text-rose-300">*</span>
            </label>
            <select
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={serviceProviderId}
              onChange={(e) => setServiceProviderId(e.target.value)}
            >
              <option value="">— Select Service Provider —</option>
              {serviceProviders.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName || u.email || u.id}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm text-white/80">
                From <span className="text-rose-300">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">
                To <span className="text-rose-300">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {createDateError ? (
            <div className="md:col-span-2 text-rose-300 text-xs">
              {createDateError}
            </div>
          ) : null}

          <div className="md:col-span-2 mt-2 flex gap-2">
            <button
              type="submit"
              disabled={!createAllRequired || submitting}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
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
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* TABLE BELOW FORM */}
      <section className="rounded-2xl bg-slate-900 border border-white/10 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Programs</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/70 border-b border-white/10">
              <tr>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Fitness Partner</th>
                <th className="py-2 pr-4">Service Provider</th>
                <th className="py-2 pr-4">From</th>
                <th className="py-2 pr-4">To</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {programs.map((p) => {
                const fp = p.fitnessPartnerId
                  ? fitnessPartnerById[p.fitnessPartnerId]
                  : null;
                const sp = p.serviceProviderId
                  ? serviceProviderById[p.serviceProviderId]
                  : null;

                return (
                  <tr key={p.id}>
                    <td className="py-2 pr-4 align-top">
                      <div className="font-medium">{p.title}</div>
                      {p.description ? (
                        <div className="text-white/60 text-xs max-w-[38ch] truncate">
                          {p.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4 align-top">
                      {fp?.displayName ||
                        fp?.email ||
                        p.fitnessPartnerId ||
                        "—"}
                    </td>
                    <td className="py-2 pr-4 align-top">
                      {sp?.displayName ||
                        sp?.email ||
                        p.serviceProviderId ||
                        "—"}
                    </td>
                    <td className="py-2 pr-4 align-top">
                      {fmtHuman(p.startAt)}
                    </td>
                    <td className="py-2 pr-4 align-top">{fmtHuman(p.endAt)}</td>
                    <td className="py-2 pr-4 align-top">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          p.active
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-2 pr-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleActive(p)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400"
                          title="Toggle Active"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete(p)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {programs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white/60">
                    No programs yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Program"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-white/80">Title *</label>
            <input
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Description *</label>
            <textarea
              required
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm text-white/80">Fitness Partner *</label>
              <select
                required
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={editFP}
                onChange={(e) => setEditFP(e.target.value)}
              >
                <option value="">— Select Fitness Partner —</option>
                {fitnessPartners.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || u.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-white/80">
                Service Provider *
              </label>
              <select
                required
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={editSP}
                onChange={(e) => setEditSP(e.target.value)}
              >
                <option value="">— Select Service Provider —</option>
                {serviceProviders.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName || u.email || u.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm text-white/80">From *</label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={editFrom}
                onChange={(e) => setEditFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-white/80">To *</label>
              <input
                required
                type="date"
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                value={editTo}
                onChange={(e) => setEditTo(e.target.value)}
              />
            </div>
          </div>

          {editDateError ? (
            <div className="text-rose-300 text-xs">{editDateError}</div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onEditSubmit}
              disabled={!editAllRequired || editSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
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
          <p className="text-white/80">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {deleteTarget?.title || "this program"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60"
              type="button"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
