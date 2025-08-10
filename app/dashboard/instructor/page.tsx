"use client";
import { useAuth } from "@/contexts/AuthContext";
import IntroGate from "../_components/IntroGate";
import Link from "next/link";

export default function InstructorHome() {
  const { userProfile } = useAuth();
  if (!userProfile) return null;
  return (
    <IntroGate uid={userProfile.uid} role={userProfile.role}>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Progress Overview</h1>
        <Link href="/dashboard/progress/instructor" className="btn btn-primary">
          Open Overview
        </Link>
      </div>
    </IntroGate>
  );
}
