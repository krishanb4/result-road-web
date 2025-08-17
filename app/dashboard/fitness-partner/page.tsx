"use client";
import { useEffect, useState } from "react";
import VideoGate from "@/components/dashboard/VideoGate";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import FitnessPartnerFeedbackForm from "@/components/forms/FitnessPartnerFeedbackForm";

export default function FitnessPartnerDashboard() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, (u) => u && setUid(u.uid)), []);
  return (
    <div>
      <VideoGate
        uid={uid}
        role="fitness_partner"
        videoUrl="/videos/fitness-partners.mov"
      >
        <FitnessPartnerFeedbackForm uid={uid} />
      </VideoGate>
    </div>
  );
}
