"use client";
import { useEffect, useState } from "react";
import LayoutShell from "@/components/dashboard/LayoutShell";
import VideoGate from "@/components/dashboard/VideoGate";
import FormBuilder from "@/components/dashboard/FormBuilder";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function FitnessPartnerDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <LayoutShell role="fitness_partner" title="Fitness Partner">
      <VideoGate
        uid={uid}
        role="fitness_partner"
        videoUrl="/videos/fitness-partner-intro.mp4"
      >
        <FormBuilder uid={uid} type="fitness_partner_group_feedback" />
      </VideoGate>
    </LayoutShell>
  );
}
