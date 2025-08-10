"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function IntroGate({
  uid,
  role,
  children,
}: {
  uid: string;
  role: string;
  children: React.ReactNode;
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const uref = doc(db, "users", uid);
      const usnap = await getDoc(uref);
      const seen = usnap.data()?.seenIntro?.[role] === true;
      if (seen) {
        setReady(true);
        return;
      }
      const vsnap = await getDoc(doc(db, "videos", role));
      const url = vsnap.exists() ? (vsnap.data() as any).url : null;
      setVideoUrl(url);
    })();
  }, [uid, role]);

  if (!ready && videoUrl) {
    return (
      <div className="fixed inset-0 bg-black/80 grid place-items-center z-50">
        <video
          src={videoUrl}
          autoPlay
          controls
          onEnded={async () => {
            await updateDoc(doc(db, "users", uid), {
              [`seenIntro.${role}`]: true,
            });
            setReady(true);
          }}
          className="w-full max-w-3xl rounded-xl"
        />
      </div>
    );
  }

  return <>{children}</>;
}
