// app/dashboard/service-provider/form/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import ServiceProviderFeedbackForm from "@/components/forms/ServiceProviderFeedbackForm";

export default function ServiceProviderFormPage() {
  const { user } = useAuth();
  if (!user) return <p className="p-4">Please sign in.</p>;
  return <ServiceProviderFeedbackForm providerUid={user.uid} />;
}
