"use client";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGate({
  allow,
  children,
}: {
  allow: Array<
    | "admin"
    | "participant"
    | "instructor"
    | "fitness_partner"
    | "service_provider"
    | "support_worker"
  >;
  children: ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <p className="text-white/70">Loading…</p>;
  if (!user) return <p className="text-white">Please sign in.</p>;

  const role = userProfile?.role;
  if (!role || !allow.includes(role)) {
    return <p className="text-red-400">You don’t have access to this area.</p>;
  }
  return <>{children}</>;
}
