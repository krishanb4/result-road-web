// app/dashboard/forms/feedback/page.tsx
"use client";

import { Suspense } from "react";
import FeedbackForm from "@/components/forms/FeedbackForm";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedbackFormPage() {
  return (
    <Suspense fallback={<div className="p-4 text-white/70">Loading…</div>}>
      <FeedbackFormInner />
    </Suspense>
  );
}

function FeedbackFormInner() {
  const { user } = useAuth();
  const params = useSearchParams();

  const kind = (params.get("kind") ?? "service_provider") as
    | "service_provider"
    | "fitness_partner";

  if (!user) return <p className="p-4">Please sign in.</p>;
  return <FeedbackForm uid={user.uid} kind={kind} />;
}
