// app/dashboard/programs/page.tsx
"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserAndRole } from "../../hooks/useUserRole";
import { Card } from "@/components/ui";

export default function MyPrograms() {
  const { user } = useUserAndRole();
  const [items, setItems] = useState<
    { id: string; title: string; summary?: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const u = await getDoc(doc(db, "users", user.uid));
      const programIds: string[] = u.data()?.assignedPrograms ?? [];
      if (!programIds.length) return setItems([]);
      const snaps = await getDocs(collection(db, "programs"));
      setItems(
        snaps.docs
          .filter((d) => programIds.includes(d.id))
          .map((d) => ({ id: d.id, ...d.data() } as any))
      );
    })();
  }, [user]);

  if (!user) return <p>Please sign in.</p>;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">My Assigned Programs</h1>
      {items.length === 0 && <p className="text-white/70">No programs yet.</p>}
      {items.map((p) => (
        <Card key={p.id}>
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="text-white/70">{p.summary ?? ""}</p>
        </Card>
      ))}
    </div>
  );
}
