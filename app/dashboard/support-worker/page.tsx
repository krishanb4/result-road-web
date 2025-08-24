"use client";
import { useEffect, useState } from "react";
import VideoGate from "@/components/dashboard/VideoGate";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SupportWorkerDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <div>
      <VideoGate
        uid={uid}
        role="support_worker"
        videoUrl="/videos/support-workers.mov"
      >
        <FormBuilder uid={uid} type="support_worker_monitoring" />
      </VideoGate>
    </div>
  );
}
