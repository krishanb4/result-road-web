"use client";
import { useEffect, useState } from "react";
import VideoGate from "@/components/dashboard/VideoGate";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ServiceProviderDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <div>
      <VideoGate
        uid={uid}
        role="service_provider"
        videoUrl="/videos/service-provider-intro.mp4"
      >
        <FormBuilder uid={uid} type="service_provider_feedback" />
      </VideoGate>
    </div>
  );
}
