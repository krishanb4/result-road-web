"use client";
import FeedbackForm from "@/components/forms/FeedbackForm";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedbackFormPage() {
  const { user } = useAuth();
  const kind = (useSearchParams().get("kind") ?? "service_provider") as
    | "service_provider"
    | "fitness_partner";
  if (!user) return <p>Please sign in.</p>;
  return <FeedbackForm uid={user.uid} kind={kind} />;
}
