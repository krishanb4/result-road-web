// app/dashboard/service-provider/form/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ParticipantProgressForm from "@/components/forms/ParticipantProgressForm";

export default function ParticipantFormPage() {
  const { user } = useAuth();
  if (!user) return <p className="p-4">Please sign in.</p>;
  return <ParticipantProgressForm providerUid={user.uid} />;
}
