"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ROLE_ROUTES, type Role } from "@/types/roles";
import { useRouter } from "next/navigation";

export default function DashboardIndex() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking session...");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/signin");
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = (snap.data()?.role ?? "participant") as Role;
      router.replace(ROLE_ROUTES[role] || "/signin");
    });
    return () => unsub();
  }, [router]);

  return <div className="p-6 text-white">{status}</div>;
}
