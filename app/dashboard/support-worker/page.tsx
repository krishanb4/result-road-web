"use client";
import { useEffect, useState } from "react";
import LayoutShell from "@/components/dashboard/LayoutShell";
import VideoGate from "@/components/dashboard/VideoGate";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SupportWorkerDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <LayoutShell role="support_worker" title="Support Worker">
      <VideoGate
        uid={uid}
        role="support_worker"
        videoUrl="/videos/support-worker-intro.mp4"
      >
        <FormBuilder uid={uid} type="support_worker_monitoring" />
      </VideoGate>
    </LayoutShell>
  );
}
