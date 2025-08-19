// app/dashboard/admin/registrations/page.tsx
"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Modal from "@/components/ui/Modal";

/* ---------------- Types ---------------- */
type SimpleUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

type Program = { id: string; title: string; active?: boolean };

type Source = "registrations" | "carePlans" | "forms";

type Row = {
  id: string;
  source: Source;
  createdAt?: any;
  // Common display fields
  name?: string | null;
  email?: string | null;
  participantId?: string | null;
  // carePlans specifics
  goals?: string | null;
  medicalInfo?: string | null;
  planDocumentUrl?: string | null;
  // forms specifics
  formData?: Record<string, any> | null;
};

/* ---------------- UI tokens (light) ---------------- */
const tokens: CSSProperties = {
  ["--panel-bg" as any]: "rgba(255,255,255,0.95)",
  ["--panel-border" as any]: "rgba(15,23,42,0.08)",
  ["--panel-text" as any]: "#0f172a",
  ["--muted-text" as any]: "#475569",
  ["--chip-bg" as any]: "rgba(2,6,23,0.04)",
  ["--table-div" as any]: "rgba(15,23,42,0.06)",
  ["--ring" as any]: "rgba(99,102,241,0.35)",
};

/* ---------------- Utils ---------------- */
function fmtWhen(d?: any) {
  const date = d?.toDate?.() || (d instanceof Date ? d : null);
  return date
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : "—";
}
function safeName(u?: SimpleUser | null) {
  return u?.displayName || u?.email || "—";
}
function shortId(id?: string | null) {
  if (!id) return "—";
  return id.length > 10 ? `${id.slice(0, 6)}…` : id;
}

/* --------------- Page ------------------ */
export default function AdminRegistrations() {
  // live rows from each collection
  const [regRows, setRegRows] = useState<Row[]>([]);
  const [careRows, setCareRows] = useState<Row[]>([]);
  const [formRows, setFormRows] = useState<Row[]>([]);

  // participants & extra user lookups (by UID)
  const [participants, setParticipants] = useState<SimpleUser[]>([]);
  const [extraUsers, setExtraUsers] = useState<Record<string, SimpleUser>>({});

  // programs
  const [programs, setPrograms] = useState<Program[]>([]);

  // Link modal
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkRow, setLinkRow] = useState<Row | null>(null);
  const [selectedUid, setSelectedUid] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  // Assign modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRow, setAssignRow] = useState<Row | null>(null);
  const [programId, setProgramId] = useState("");
  const [assignEmail, setAssignEmail] = useState("");

  // Details modal (shows full form data or row fields)
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState<Row | null>(null);

  // Reconcile busy state
  const [reconBusy, setReconBusy] = useState(false);

  /* ------------- Live data ------------- */

  // Programs (ordered by title)
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "programs"), orderBy("title", "asc")),
      (snap) => {
        setPrograms(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      }
    );
    return () => unsub();
  }, []);

  // Participants (role == participant)
  useEffect(() => {
    const qP = query(
      collection(db, "users"),
      where("role", "==", "participant")
    );
    const unsub = onSnapshot(qP, (snap) => {
      const rows = snap.docs.map((d) => ({
        id: d.id,
        email: (d.data() as any)?.email ?? null,
        displayName: (d.data() as any)?.displayName ?? null,
      }));
      setParticipants(rows);
    });
    return () => unsub();
  }, []);

  // Registrations (newest first)
  useEffect(() => {
    const q = query(
      collection(db, "registrations"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Row[] = snap.docs.map((d) => ({
          id: d.id,
          source: "registrations",
          ...(d.data() as any),
        }));
        setRegRows(rows);
      },
      () => setRegRows([])
    );
    return () => unsub();
  }, []);

  // Care Plans (newest first)
  useEffect(() => {
    const q = query(collection(db, "carePlans"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Row[] = snap.docs.map((d) => {
          const v: any = d.data();
          return {
            id: d.id,
            source: "carePlans",
            createdAt: v.createdAt,
            participantId: v.participantId ?? null,
            email: v.email ?? null,
            name: v.name ?? null,
            goals: v.goals ?? null,
            medicalInfo: v.medicalInfo ?? null,
            planDocumentUrl: v.planDocumentUrl ?? null,
          };
        });
        setCareRows(rows);
      },
      () => setCareRows([])
    );
    return () => unsub();
  }, []);

  // Forms (include ALL forms; admin is allowed by your rules)
  useEffect(() => {
    // Use non-ordered snapshot for safety (some forms may lack createdAt); sort in-memory.
    const unsub = onSnapshot(
      collection(db, "forms"),
      (snap) => {
        const rows: Row[] = snap.docs.map((d) => {
          const v: any = d.data();
          const fullName =
            [v.firstName, v.lastName].filter(Boolean).join(" ").trim() ||
            v.displayName ||
            null;
          const docUrl =
            v.planDocumentUrl ||
            v.fileUploadUrl ||
            v.fileUrl ||
            v.documentUrl ||
            null;

          return {
            id: d.id,
            source: "forms",
            createdAt: v.createdAt,
            participantId: v.uid ?? v.participantId ?? null,
            email: v.emailAddress ?? v.email ?? null,
            name: fullName,
            goals: v.clientGoals ?? v.goals ?? null,
            medicalInfo: v.medicalInformation ?? v.medicalInfo ?? null,
            planDocumentUrl: docUrl,
            formData: v, // keep entire form for details modal
          };
        });

        // sort newest first by createdAt if present
        rows.sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        );
        setFormRows(rows);
      },
      () => setFormRows([])
    );
    return () => unsub();
  }, []);

  // Merge rows & sort
  const merged = useMemo(() => {
    const all = [...regRows, ...careRows, ...formRows];
    return all.sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
  }, [regRows, careRows, formRows]);

  // Build quick lookup for participants
  const participantsById = useMemo(
    () => Object.fromEntries(participants.map((u) => [u.id, u])),
    [participants]
  );

  // Enrich missing users by participantId (if not in participants list)
  useEffect(() => {
    const needed = Array.from(
      new Set(merged.map((r) => r.participantId).filter(Boolean) as string[])
    ).filter((uid) => !participantsById[uid] && !extraUsers[uid]);

    if (needed.length === 0) return;

    (async () => {
      const fetched: Record<string, SimpleUser> = {};
      await Promise.all(
        needed.map(async (uid) => {
          const snap = await getDoc(doc(db, "users", uid)).catch(() => null);
          if (snap && snap.exists()) {
            const d = snap.data() as any;
            fetched[uid] = {
              id: uid,
              email: d?.email ?? null,
              displayName: d?.displayName ?? null,
            };
          }
        })
      );
      if (Object.keys(fetched).length) {
        setExtraUsers((prev) => ({ ...prev, ...fetched }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged, participantsById]);

  const userLookup: Record<string, SimpleUser> = useMemo(
    () => ({ ...participantsById, ...extraUsers }),
    [participantsById, extraUsers]
  );

  /* ------------- Link submission -> user ------------- */
  function openLink(r: Row) {
    setLinkRow(r);
    setSelectedUid("");
    setManualEmail(r.email || "");
    setLinkOpen(true);
  }

  async function doLink() {
    if (!linkRow) return;
    const targetColl =
      linkRow.source === "carePlans"
        ? "carePlans"
        : linkRow.source === "forms"
        ? "forms"
        : "registrations";
    const ref = doc(db, targetColl, linkRow.id);
    await updateDoc(ref, {
      participantId: selectedUid || null,
      email: manualEmail || null,
      updatedAt: serverTimestamp(),
    });
    setLinkOpen(false);
  }

  /* ------------- Assign program ------------- */
  function openAssign(r: Row) {
    setAssignRow(r);
    setProgramId("");
    setAssignEmail(r.email || "");
    setAssignOpen(true);
  }

  async function doAssign() {
    if (!assignRow || !programId) return;

    const programTitle =
      programs.find((p) => p.id === programId)?.title || programId;
    const hasUid =
      !!assignRow.participantId && assignRow.participantId !== "null";

    if (hasUid) {
      await addDoc(collection(db, "assignments"), {
        participantId: assignRow.participantId,
        programId,
        programTitle,
        assignedAt: serverTimestamp(),
        assignedBy: "admin",
        status: "assigned",
        registrationRef: { id: assignRow.id, source: assignRow.source },
      });
    } else {
      const email = assignEmail?.trim();
      if (!email) {
        alert("Please provide an email to create a pending assignment.");
        return;
      }
      await addDoc(collection(db, "assignments"), {
        participantId: null,
        participantEmail: email,
        programId,
        programTitle,
        assignedAt: serverTimestamp(),
        assignedBy: "admin",
        status: "pending",
        registrationRef: { id: assignRow.id, source: assignRow.source },
      });
    }

    setAssignOpen(false);
  }

  /* ------------- Details (show full form data) ------------- */
  function openDetails(r: Row) {
    setDetailsRow(r);
    setDetailsOpen(true);
  }

  /* ------------- Reconcile pending assignments ------------- */
  async function reconcilePending() {
    setReconBusy(true);
    try {
      // Build email -> uid map from ALL users (not just role=participant)
      const allUsersSnap = await getDocs(collection(db, "users"));
      const byEmail = new Map<string, string>();
      allUsersSnap.forEach((d) => {
        const v: any = d.data();
        if (v?.email) byEmail.set(String(v.email).toLowerCase(), d.id);
      });

      // Load pending
      const pendSnap = await getDocs(
        query(collection(db, "assignments"), where("status", "==", "pending"))
      );

      let fixed = 0;
      for (const d of pendSnap.docs) {
        const a: any = d.data();
        const email = String(a.participantEmail || "").toLowerCase();
        const uid = byEmail.get(email);
        if (uid) {
          await updateDoc(doc(db, "assignments", d.id), {
            participantId: uid,
            status: "assigned",
            updatedAt: serverTimestamp(),
          });
          fixed++;
        }
      }
      alert(`Reconciled ${fixed} pending assignment(s).`);
    } finally {
      setReconBusy(false);
    }
  }

  return (
    <div className="space-y-6 text-[var(--panel-text)]" style={tokens}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Registrations, Care Plans & Forms
        </h2>
        <button
          onClick={reconcilePending}
          disabled={reconBusy}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 shadow-sm"
        >
          {reconBusy ? "Reconciling…" : "Reconcile pending assignments"}
        </button>
      </div>

      {/* Desktop/table view */}
      <div className="hidden md:block rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-3 md:p-5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="text-left text-slate-600 border-b border-[var(--panel-border)]">
              <tr>
                <th className="py-2 px-3">Source</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Participant</th>
                <th className="py-2 px-3">Document</th>
                <th className="py-2 px-3">Created</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{
                ["--tw-divide-opacity" as any]: 1,
                ["--tw-divide-color" as any]: "var(--table-div)",
              }}
            >
              {merged.map((r) => {
                const user =
                  (r.participantId && userLookup[r.participantId]) || null;

                return (
                  <tr
                    key={`${r.source}-${r.id}`}
                    className="align-top text-slate-800"
                  >
                    <td className="py-2 px-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          r.source === "forms"
                            ? "bg-cyan-500/10 text-cyan-700 border-cyan-300/60"
                            : r.source === "carePlans"
                            ? "bg-amber-500/10 text-amber-700 border-amber-300/60"
                            : "bg-emerald-500/10 text-emerald-700 border-emerald-300/60"
                        }`}
                      >
                        {r.source}
                      </span>
                    </td>
                    <td className="py-2 px-3">{r.name || safeName(user)}</td>
                    <td className="py-2 px-3">
                      {r.email || user?.email || "—"}
                    </td>
                    <td className="py-2 px-3">
                      {user ? (
                        safeName(user)
                      ) : r.participantId ? (
                        <span className="text-slate-600">
                          UID {shortId(r.participantId)}
                        </span>
                      ) : (
                        <span className="text-slate-500">Not linked</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {r.planDocumentUrl ? (
                        <a
                          className="text-indigo-700 hover:underline"
                          href={r.planDocumentUrl}
                          target="_blank"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-3">{fmtWhen(r.createdAt)}</td>
                    <td className="py-2 px-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg-black/[0.06]"
                          onClick={() => openDetails(r)}
                          title="View details"
                        >
                          Details
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg_black/[0.06]"
                          onClick={() => openLink(r)}
                        >
                          Link to user
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                          onClick={() => openAssign(r)}
                        >
                          Assign program
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {merged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/card view */}
      <div className="md:hidden grid gap-3">
        {merged.length === 0 && (
          <div className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 text-slate-500">
            No submissions found.
          </div>
        )}
        {merged.map((r) => {
          const user = (r.participantId && userLookup[r.participantId]) || null;
          return (
            <div
              key={`${r.source}-${r.id}`}
              className="rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-slate-900 font-medium">
                    {r.name || safeName(user)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.email || user?.email || "—"}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border self-start ${
                    r.source === "forms"
                      ? "bg-cyan-500/10 text-cyan-700 border-cyan-300/60"
                      : r.source === "carePlans"
                      ? "bg-amber-500/10 text-amber-700 border-amber-300/60"
                      : "bg-emerald-500/10 text-emerald-700 border-emerald-300/60"
                  }`}
                >
                  {r.source}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Participant
                  </div>
                  <div>
                    {user ? (
                      safeName(user)
                    ) : r.participantId ? (
                      <>UID {shortId(r.participantId)}</>
                    ) : (
                      "Not linked"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Created
                  </div>
                  <div>{fmtWhen(r.createdAt)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted-text)]">
                    Document
                  </div>
                  <div>
                    {r.planDocumentUrl ? (
                      <a
                        className="text-indigo-700 hover:underline"
                        href={r.planDocumentUrl}
                        target="_blank"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg-black/[0.06]"
                  onClick={() => openDetails(r)}
                >
                  Details
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] text-slate-700 hover:bg-black/[0.06]"
                  onClick={() => openLink(r)}
                >
                  Link
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                  onClick={() => openAssign(r)}
                >
                  Assign
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link modal */}
      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Link submission to a user"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-[var(--muted-text)]">
              Existing participant
            </label>
            <select
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={selectedUid}
              onChange={(e) => setSelectedUid(e.target.value)}
            >
              <option value="">— Select by email/name —</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.displayName || p.email || p.id) as string}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--muted-text)]">
              Or store an email on the submission
            </label>
            <input
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              placeholder="email@example.com"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />
            <p className="text-xs text-[var(--muted-text)]">
              If the person hasn’t signed up yet, keep the email here and create
              a pending assignment. Later click{" "}
              <b>Reconcile pending assignments</b> to auto-attach it when they
              sign up.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
              onClick={() => setLinkOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={doLink}
            >
              Save link
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign modal */}
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign program"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-[var(--muted-text)]">Program</label>
            <select
              className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
            >
              <option value="">— Select program —</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {!assignRow?.participantId && (
            <div className="space-y-1">
              <label className="text-sm text-[var(--muted-text)]">
                Email for pending assignment
              </label>
              <input
                className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-800 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="email@example.com"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
              />
              <p className="text-xs text-[var(--muted-text)]">
                This submission isn’t linked to a user. We’ll create a{" "}
                <b>pending</b> assignment using this email and you can reconcile
                later.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
              onClick={() => setAssignOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
              disabled={
                !programId || (!assignRow?.participantId && !assignEmail.trim())
              }
              onClick={doAssign}
            >
              Assign
            </button>
          </div>
        </div>
      </Modal>

      {/* Details modal: shows EVERY field for forms; reasonable info for others */}
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Submission details"
        size="lg"
      >
        {detailsRow ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-2">
              <KV label="Source">{detailsRow.source}</KV>
              <KV label="Created">{fmtWhen(detailsRow.createdAt)}</KV>
              <KV label="Name">{detailsRow.name || "—"}</KV>
              <KV label="Email">{detailsRow.email || "—"}</KV>
              <KV label="Participant">
                {detailsRow.participantId
                  ? userLookup[detailsRow.participantId]
                    ? safeName(userLookup[detailsRow.participantId])
                    : `UID ${shortId(detailsRow.participantId)}`
                  : "Not linked"}
              </KV>
              <KV label="Document">
                {detailsRow.planDocumentUrl ? (
                  <a
                    className="text-indigo-700 hover:underline"
                    href={detailsRow.planDocumentUrl}
                    target="_blank"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </KV>
            </div>

            {/* Forms: dump ALL fields nicely */}
            {detailsRow.source === "forms" && detailsRow.formData ? (
              <div className="mt-2">
                <div className="text-sm font-medium text-slate-900 mb-2">
                  All form fields
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {Object.entries(detailsRow.formData).map(([k, v]) => (
                    <KV key={k} label={prettyKey(k)}>
                      {renderValue(v)}
                    </KV>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Care plan extras */}
            {detailsRow.source === "carePlans" ? (
              <div className="grid md:grid-cols-2 gap-2">
                <KV label="Goals">{detailsRow.goals || "—"}</KV>
                <KV label="Medical Info">{detailsRow.medicalInfo || "—"}</KV>
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--panel-border)] hover:bg-black/[0.06]"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[var(--muted-text)]">No row selected.</div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Small components ---------------- */
function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-[var(--chip-bg)] border border-[var(--panel-border)] px-3 py-2">
      <div className="text-[11px] text-[var(--muted-text)]">{label}</div>
      <div className="text-slate-800 text-[13px] break-words">{children}</div>
    </div>
  );
}

/* ---------------- Pretty-print form keys/values ---------------- */
function prettyKey(k: string) {
  // turn camel/snake to Title Case
  const spaced = k
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
function renderValue(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number" || typeof v === "string") return String(v);
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  // Firestore timestamps
  if (typeof v?.toDate === "function") {
    try {
      const d = v.toDate();
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {}
  }
  // objects -> JSON
  try {
    return <code className="text-[11px]">{JSON.stringify(v)}</code>;
  } catch {
    return String(v);
  }
}
