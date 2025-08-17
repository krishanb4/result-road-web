"use client";
import ClientMonitoringForm from "@/components/forms/ClientMonitoringForm";
import { useAuth } from "@/contexts/AuthContext";

export default function MonitoringFormPage() {
  const { user } = useAuth();
  if (!user) return <p>Please sign in.</p>;
  return <ClientMonitoringForm uid={user.uid} />;
}
