"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Modal from "@/components/ui/Modal";

type SimpleUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};
type Program = { id: string; title: string; active?: boolean };

type Row = {
  id: string;
  source: "registrations" | "carePlans";
  createdAt?: any;
  // common fields (use what you have)
  name?: string;
  email?: string;
  participantId?: string | null;
  goals?: string;
  medicalInfo?: string;
  planDocumentUrl?: string;
};

function fmtWhen(d?: any) {
  const date = d?.toDate?.() || (d instanceof Date ? d : null);
  return date
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : "—";
}

export default function AdminRegistrations() {
  const [rows, setRows] = useState<Row[]>([]);
  const [participants, setParticipants] = useState<SimpleUser[]>([]);
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

  // Reconcile in-progress
  const [reconBusy, setReconBusy] = useState(false);

  // Load programs (active first)
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "programs"), orderBy("title", "asc")),
      (snap) => {
        setPrograms(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      }
    );
    return () => unsub();
  }, []);

  // Load participants
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

  // Load registrations + carePlans and merge
  useEffect(() => {
    (async () => {
      const [regSnap, careSnap] = await Promise.all([
        getDocs(
          query(collection(db, "registrations"), orderBy("createdAt", "desc"))
        ).catch(() => null),
        getDocs(
          query(collection(db, "carePlans"), orderBy("createdAt", "desc"))
        ).catch(() => null),
      ]);

      const regs: Row[] = regSnap
        ? regSnap.docs.map((d) => ({
            id: d.id,
            source: "registrations",
            ...(d.data() as any),
          }))
        : [];

      const cares: Row[] = careSnap
        ? careSnap.docs.map((d) => {
            const v: any = d.data();
            return {
              id: d.id,
              source: "carePlans",
              createdAt: v.createdAt,
              participantId: v.participantId ?? null,
              email: v.email ?? null, // if you store email there
              name: v.name ?? null, // if you store name there
              goals: v.goals,
              medicalInfo: v.medicalInfo,
              planDocumentUrl: v.planDocumentUrl,
            };
          })
        : [];

      // sort newest first and keep reasonable size
      const merged = [...regs, ...cares].sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
      );
      setRows(merged);
      console.log(merged);
    })();
  }, []);

  /* ------------- Link submission -> participant ------------- */

  function openLink(r: Row) {
    setLinkRow(r);
    setSelectedUid("");
    setManualEmail(r.email || "");
    setLinkOpen(true);
  }

  async function doLink() {
    if (!linkRow) return;

    // Strategy:
    // - If selectedUid provided: update the carePlans/registrations doc with participantId + email (optional)
    // - Else if manualEmail given: just store email on the doc; assignments can be created as "pending"
    const targetColl =
      linkRow.source === "carePlans" ? "carePlans" : "registrations";
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
    setAssignOpen(true);
  }

  async function doAssign() {
    if (!assignRow || !programId) return;

    // If we have a linked participant, create a normal assignment.
    // Otherwise create a *pending* assignment with participantEmail,
    // which we’ll reconcile later when the user signs up.
    const hasUid =
      !!assignRow.participantId && assignRow.participantId !== "null";

    if (hasUid) {
      await addDoc(collection(db, "assignments"), {
        participantId: assignRow.participantId,
        programId,
        programTitle:
          programs.find((p) => p.id === programId)?.title || programId,
        assignedAt: serverTimestamp(),
        assignedBy: "admin",
        status: "assigned",
        // optional link back to submission
        registrationRef: { id: assignRow.id, source: assignRow.source },
      });
    } else {
      // pending assignment by email
      const email = assignRow.email || manualEmail;
      if (!email) {
        alert("This submission is not linked to a user and has no email.");
        return;
      }
      await addDoc(collection(db, "assignments"), {
        participantId: null,
        participantEmail: email,
        programId,
        programTitle:
          programs.find((p) => p.id === programId)?.title || programId,
        assignedAt: serverTimestamp(),
        assignedBy: "admin",
        status: "pending", // mark pending until reconciled
        registrationRef: { id: assignRow.id, source: assignRow.source },
      });
    }

    setAssignOpen(false);
  }

  /* ------------- Reconcile pending assignments ------------- */
  // Find assignments with participantId=null but participantEmail set,
  // and if a user with that email exists, attach their uid.

  async function reconcilePending() {
    setReconBusy(true);
    try {
      // load all participants into a lookup by email (lowercased)
      const byEmail = new Map(
        participants
          .filter((p) => p.email)
          .map((p) => [String(p.email).toLowerCase(), p.id])
      );

      // load pending assignments
      const pendingQ = query(
        collection(db, "assignments"),
        where("status", "==", "pending")
      );
      const snap = await getDocs(pendingQ);

      let fixed = 0;
      for (const d of snap.docs) {
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

  const participantsById = useMemo(
    () => Object.fromEntries(participants.map((u) => [u.id, u])),
    [participants]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Registrations & Care Plans</h2>
        <button
          onClick={reconcilePending}
          disabled={reconBusy}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
        >
          {reconBusy ? "Reconciling…" : "Reconcile pending assignments"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-white/10">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70 border-b border-white/10">
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
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => {
              const user = r.participantId
                ? participantsById[r.participantId]
                : null;
              return (
                <tr key={`${r.source}-${r.id}`}>
                  <td className="py-2 px-3 align-top">{r.source}</td>
                  <td className="py-2 px-3 align-top">{r.name || "—"}</td>
                  <td className="py-2 px-3 align-top">{r.email || "—"}</td>
                  <td className="py-2 px-3 align-top">
                    {user ? (
                      user.displayName || user.email || r.participantId
                    ) : r.participantId ? (
                      r.participantId
                    ) : (
                      <span className="text-white/60">Not linked</span>
                    )}
                  </td>
                  <td className="py-2 px-3 align-top">
                    {r.planDocumentUrl ? (
                      <a
                        className="text-indigo-300 hover:underline"
                        href={r.planDocumentUrl}
                        target="_blank"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 px-3 align-top">
                    {fmtWhen(r.createdAt)}
                  </td>
                  <td className="py-2 px-3 align-top">
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                        onClick={() => openLink(r)}
                      >
                        Link to user
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500"
                        onClick={() => openAssign(r)}
                      >
                        Assign program
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-white/60">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Link modal */}
      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Link submission to a user"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-white/80">
              Existing participant
            </label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            <label className="text-sm text-white/80">
              Or store an email on the submission
            </label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              placeholder="email@example.com"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />
            <p className="text-xs text-white/60">
              If the person has not signed up yet, keep the email here. You can
              still create a pending assignment and reconcile later.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              onClick={() => setLinkOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400"
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
            <label className="text-sm text-white/80">Program</label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
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
            <p className="text-xs text-white/60">
              This submission is not linked to a user. We’ll create a{" "}
              <b>pending</b> assignment using the submission’s email. After the
              person signs up, click “Reconcile pending assignments” to attach
              it automatically.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              onClick={() => setAssignOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
              disabled={!programId}
              onClick={doAssign}
            >
              Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
