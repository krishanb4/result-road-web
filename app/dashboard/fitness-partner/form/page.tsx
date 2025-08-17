"use client";

import FitnessPartnerFeedbackForm from "@/components/forms/FitnessPartnerFeedbackForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const { user } = useAuth();
  if (!user) return <p className="p-4">Please sign in.</p>;
  return <FitnessPartnerFeedbackForm uid={user.uid} />;
}
