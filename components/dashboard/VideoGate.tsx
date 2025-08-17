"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function VideoGate({
  uid,
  role,
  videoUrl,
  children,
}: {
  uid: string;
  role: string;
  videoUrl: string;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const ackId = `${uid}_${role}`;

  useEffect(() => {
    getDoc(doc(db, "acknowledgements", ackId)).then((s) =>
      setUnlocked(s.exists())
    );
  }, [ackId]);

  if (unlocked) return <>{children}</>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-white/10">
        <video src={videoUrl} controls className="w-full h-auto" />
      </div>
      <button
        onClick={async () => {
          await setDoc(doc(db, "acknowledgements", ackId), {
            uid,
            role,
            watchedAt: serverTimestamp(),
          });
          setUnlocked(true);
        }}
        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white"
      >
        I watched the intro
      </button>
    </div>
  );
}
