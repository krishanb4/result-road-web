"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FormBuilder({
  uid,
  type,
  fields = [
    { name: "title", label: "Title", kind: "text" },
    { name: "notes", label: "Notes", kind: "textarea" },
  ],
  onSubmitted,
}: {
  uid: string;
  type: string;
  fields?: { name: string; label: string; kind: "text" | "textarea" }[];
  onSubmitted?: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await addDoc(collection(db, "forms"), {
          uid,
          type,
          data: values,
          createdAt: serverTimestamp(),
        });
        setSaving(false);
        onSubmitted?.();
      }}
    >
      {fields.map((f) => (
        <div key={f.name} className="space-y-1">
          <label className="text-sm text-white/80">{f.label}</label>
          {f.kind === "textarea" ? (
            <textarea
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              rows={5}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.name]: e.target.value }))
              }
            />
          ) : (
            <input
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.name]: e.target.value }))
              }
            />
          )}
        </div>
      ))}
      <button
        disabled={saving}
        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
