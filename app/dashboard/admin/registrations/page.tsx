// app/dashboard/admin/registrations/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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

type Row = {
  id: string;
  source: "registrations" | "carePlans";
  createdAt?: any;
  // Common display fields (fill what you have)
  name?: string | null;
  email?: string | null;
  participantId?: string | null;
  // carePlans specifics
  goals?: string | null;
  medicalInfo?: string | null;
  planDocumentUrl?: string | null;
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

/* --------------- Page ------------------ */

export default function AdminRegistrations() {
  // live rows from each collection
  const [regRows, setRegRows] = useState<Row[]>([]);
  const [careRows, setCareRows] = useState<Row[]>([]);

  // participants & extra user lookups (by UID)
  const [participants, setParticipants] = useState<SimpleUser[]>([]);
  const [extraUsers, setExtraUsers] = useState<Record<string, SimpleUser>>({}); // fetched by UID if not in participants

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
      () => setRegRows([]) // silently ignore if collection doesn't exist
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
      () => setCareRows([]) // ignore if collection doesn't exist
    );
    return () => unsub();
  }, []);

  // Merge rows & sort
  const merged = useMemo(() => {
    const all = [...regRows, ...careRows];
    return all.sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
  }, [regRows, careRows]);

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
      // direct assignment to participantId
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
      // pending assignment by email
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

  /* ------------- Reconcile pending assignments ------------- */
  // Matches assignments with status "pending" where participantEmail matches a user's email.
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Registrations & Care Plans</h2>
        <button
          onClick={reconcilePending}
          disabled={reconBusy}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-60"
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
            {merged.map((r) => {
              const user =
                (r.participantId && userLookup[r.participantId]) || null;

              return (
                <tr key={`${r.source}-${r.id}`}>
                  <td className="py-2 px-3 align-top">{r.source}</td>
                  <td className="py-2 px-3 align-top">
                    {r.name || user?.displayName || "—"}
                  </td>
                  <td className="py-2 px-3 align-top">
                    {r.email || user?.email || "—"}
                  </td>
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

            {merged.length === 0 && (
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
              If the person hasn’t signed up yet, keep the email here and create
              a pending assignment. Later click “Reconcile pending assignments”
              to auto-attach it when they sign up.
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

          {/* If not linked, allow entering the email used for pending assignment */}
          {!assignRow?.participantId && (
            <div className="space-y-1">
              <label className="text-sm text-white/80">
                Email for pending assignment
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                placeholder="email@example.com"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
              />
              <p className="text-xs text-white/60">
                This submission isn’t linked to a user. We’ll create a{" "}
                <b>pending</b> assignment using this email and you can reconcile
                later.
              </p>
            </div>
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
    </div>
  );
}
