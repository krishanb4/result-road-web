// components/admin/AdminSubmissionsTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, Card, Input, Label, Select } from "@/components/ui";
import RegistrationDrawer, { type Registration } from "./RegistrationDrawer";

type Row =
  | {
      source: "registration";
      id: string;
      uid: string;
      displayName?: string;
      email?: string;
      role?: string;
      city?: string;
      state?: string;
      ndisNumber?: string;
      referralType?: string;
      createdAt?: any;
      raw: Registration;
    }
  | {
      source: "forms" | "commonForms" | "feedback" | "monitoring";
      id: string;
      uid?: string;
      title: string;
      summary?: string;
      createdAt?: any;
      raw: any;
    };

export default function AdminSubmissionsTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [programs, setPrograms] = useState<{ id: string; title: string }[]>([]);
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<Registration | null>(null);

  useEffect(() => {
    (async () => {
      const out: Row[] = [];

      // A) registrations (from app/register snapshot)
      try {
        const qReg = query(
          collection(db, "registrations"),
          orderBy("createdAt", "desc")
        );
        const regs = await getDocs(qReg);
        regs.forEach((d) => {
          const x = d.data() as any;
          out.push({
            source: "registration",
            id: d.id,
            uid: x.uid,
            displayName: x.displayName,
            email: x.email,
            role: x.role,
            city: x.address?.city,
            state: x.address?.state,
            ndisNumber: x.ndis?.ndisNumber,
            referralType: x.referral?.type,
            createdAt: x.createdAt,
            raw: x as Registration,
          });
        });
      } catch {
        // ignore if collection not created yet
      }

      // B) generic forms (optional – keep if you also want these listed)
      try {
        const snaps = await getDocs(
          query(collection(db, "forms"), orderBy("submissionDate", "desc"))
        );
        snaps.forEach((d) => {
          const x = d.data() as any;
          out.push({
            source: "forms",
            id: d.id,
            uid: x.submittedByUid,
            title: x.type || "Form",
            summary: [x.submittedByName, x.status].filter(Boolean).join(" — "),
            createdAt: x.submissionDate,
            raw: x,
          });
        });
      } catch {}

      // C) other role-specific collections (optional)
      for (const spec of [
        {
          key: "commonForms",
          title: "Common Intake",
          order: "createdAt" as const,
        },
        { key: "feedback", title: "Feedback", order: "createdAt" as const },
        { key: "monitoring", title: "Monitoring", order: "createdAt" as const },
      ]) {
        try {
          const snaps = await getDocs(
            query(collection(db, spec.key), orderBy(spec.order, "desc"))
          );
          snaps.forEach((d) => {
            const x = d.data() as any;
            const summary =
              spec.key === "feedback"
                ? [x.sessionId, x.feedback].filter(Boolean).join(" — ")
                : spec.key === "monitoring"
                ? [x.clientId, x.observation].filter(Boolean).join(" — ")
                : [x.name, x.notes].filter(Boolean).join(" — ");
            out.push({
              source: spec.key as any,
              id: d.id,
              uid: x.uid,
              title: spec.title,
              summary,
              createdAt: x.createdAt,
              raw: x,
            });
          });
        } catch {}
      }

      // Programs for assignment dropdown (active only)
      try {
        const p = await getDocs(
          query(collection(db, "programs"), where("active", "==", true))
        );
        setPrograms(
          p.docs.map((d) => ({
            id: d.id,
            title: (d.data() as any).title || d.id,
          }))
        );
      } catch {
        setPrograms([]);
      }

      setRows(out);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows
      .filter((r) => (q ? JSON.stringify(r).toLowerCase().includes(q) : true))
      .sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
      );
  }, [rows, search]);

  async function assignProgram(uid: string, rowId: string, programId: string) {
    if (!uid || !programId) return;
    setAssigning(rowId);
    try {
      await updateDoc(doc(db, "users", uid), {
        assignedPrograms: arrayUnion(programId),
        updatedAt: serverTimestamp(),
      });
      // Optional: mark registration as in_review when assigning from registration source
      const row = rows.find((r) => r.id === rowId);
      if (row?.source === "registration") {
        await updateDoc(doc(db, "registrations", uid), {
          status: "in_review",
          updatedAt: serverTimestamp(),
        });
      }
    } finally {
      setAssigning(null);
      alert("Program assigned");
    }
  }

  return (
    <>
      <Card>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="w-72">
            <Label>Search</Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, city, NDIS, form…"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Person</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Context</th>
                <th className="px-3 py-2">Assign Program</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const person =
                  r.source === "registration"
                    ? `${r.displayName ?? r.email ?? r.uid} · ${r.role ?? ""}`
                    : r.title;
                const contact =
                  r.source === "registration"
                    ? `${r.email ?? ""} ${r.city ? "· " + r.city : ""} ${
                        r.state ? ", " + r.state : ""
                      }`
                    : r.uid ?? "-";
                const context =
                  r.source === "registration"
                    ? [
                        `NDIS: ${r.ndisNumber ?? "-"}`,
                        r.referralType ? `Referred: ${r.referralType}` : "",
                      ]
                        .filter(Boolean)
                        .join(" — ")
                    : r.summary ?? "-";

                return (
                  <tr
                    key={`${r.source}-${r.id}`}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="px-3 py-2 font-medium capitalize text-white">
                      {r.source}
                    </td>
                    <td className="px-3 py-2 text-white/90">{person}</td>
                    <td className="px-3 py-2 text-white/80">{contact}</td>
                    <td className="px-3 py-2 text-white/70">{context}</td>
                    <td className="px-3 py-2">
                      {"uid" in r && r.uid ? (
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue=""
                            onChange={(e) =>
                              assignProgram(
                                (r as any).uid,
                                r.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select…</option>
                            {programs.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title}
                              </option>
                            ))}
                          </Select>
                          <Button
                            loading={assigning === r.id}
                            disabled={assigning === r.id || !programs.length}
                          >
                            Assign
                          </Button>
                        </div>
                      ) : (
                        <span className="text-white/40">No user id</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {r.source === "registration" ? (
                        <Button
                          onClick={() => {
                            setDrawerData(r.raw as Registration);
                            setDrawerOpen(true);
                          }}
                        >
                          View
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-white/60"
                  >
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer */}
      <RegistrationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
      />
    </>
  );
}
