// app/dashboard/coordinator/form/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import CoordinatorProgressOverviewForm from "@/components/forms/CoordinatorProgressOverviewForm";

export default function CoordinatorFormPage() {
  const { user } = useAuth();
  if (!user) return <p className="p-4">Please sign in.</p>;
  return <CoordinatorProgressOverviewForm coordinatorUid={user.uid} />;
}
