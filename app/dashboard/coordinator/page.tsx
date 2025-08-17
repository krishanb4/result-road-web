"use client";
import { useEffect, useState } from "react";
import VideoGate from "@/components/dashboard/VideoGate";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CoordinatorDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <div>
      <VideoGate
        uid={uid}
        role="coordinator"
        videoUrl="/videos/coordinator-intro.mp4"
      >
        <FormBuilder uid={uid} type="coordinator_progress_overview" />
      </VideoGate>
    </div>
  );
}
