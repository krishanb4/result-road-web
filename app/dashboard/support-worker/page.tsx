"use client";
import { useAuth } from "@/contexts/AuthContext";
import IntroGate from "../_components/IntroGate";
import Link from "next/link";

export default function SupportWorkerHome() {
  const { userProfile } = useAuth();
  if (!userProfile) return null;
  return (
    <IntroGate uid={userProfile.uid} role={userProfile.role}>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Client Management (Weekly)</h1>
        <p className="text-slate-600">
          Submit this week's monitoring form. Admin will review all submissions.
        </p>
        <Link
          href="/dashboard/forms/support-worker"
          className="btn btn-primary"
        >
          Start Weekly Form
        </Link>
      </div>
    </IntroGate>
  );
}
