"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function IntroVideo({ videoKey }: { videoKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "videos", videoKey));
      if (snap.exists()) {
        const data = snap.data() as { url?: string; title?: string };
        setUrl(data.url ?? null);
        setTitle(data.title ?? null);
      }
    })();
  }, [videoKey]);

  if (!url) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white">
      {title && (
        <div className="px-4 py-3 border-b text-sm font-medium">{title}</div>
      )}
      <div className="aspect-video w-full">
        <video controls className="h-full w-full" src={url} />
      </div>
    </div>
  );
}
