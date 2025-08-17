// app/dashboard/support-worker/form/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import SupportWorkerMonitoringForm from "@/components/forms/SupportWorkerMonitoringForm";

export default function SupportWorkerFormPage() {
  const { user } = useAuth();
  if (!user) return <p className="p-4">Please sign in.</p>;
  return <SupportWorkerMonitoringForm supportUid={user.uid} />;
}
