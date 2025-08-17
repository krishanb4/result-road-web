"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "../../components/ui";
import VideoCard from "../../components/VideoCard";
import Link from "next/link";

const INTRO: Record<
  | "admin"
  | "participant"
  | "instructor"
  | "fitness_partner"
  | "service_provider"
  | "support_worker",
  string
> = {
  admin: "https://www.youtube.com/embed/dQw4w9WgXcQ", // TODO
  participant: "https://www.youtube.com/embed/VIDEO_PARTICIPANT", // TODO
  instructor: "https://www.youtube.com/embed/VIDEO_INSTRUCTOR", // TODO
  fitness_partner: "https://www.youtube.com/embed/VIDEO_FP", // TODO
  service_provider: "https://www.youtube.com/embed/VIDEO_SP", // TODO
  support_worker: "https://www.youtube.com/embed/VIDEO_SW", // TODO
};

export default function DashboardHome() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user || !userProfile) return <p>Please sign in.</p>;

  const role = userProfile.role;

  const links: { href: string; label: string }[] =
    role === "admin"
      ? [
          { href: "/dashboard/admin", label: "View All Submissions" },
          { href: "/dashboard/forms/common", label: "Open Common Form" },
        ]
      : role === "participant"
      ? [
          { href: "/dashboard/programs", label: "My Assigned Programs" },
          { href: "/dashboard/forms/common", label: "Common Form" },
        ]
      : role === "fitness_partner"
      ? [
          {
            href: "/dashboard/forms/feedback?kind=fitness_partner",
            label: "Group Feedback Form",
          },
          { href: "/dashboard/forms/common", label: "Common Form" },
        ]
      : role === "service_provider"
      ? [
          {
            href: "/dashboard/forms/feedback?kind=service_provider",
            label: "Feedback Form",
          },
          { href: "/dashboard/forms/common", label: "Common Form" },
        ]
      : role === "support_worker"
      ? [
          {
            href: "/dashboard/forms/monitoring",
            label: "Client Monitoring Form",
          },
          { href: "/dashboard/forms/common", label: "Common Form" },
        ]
      : [{ href: "/dashboard/forms/common", label: "Common Form" }];

  return (
    <div className="grid gap-8">
      <VideoCard title="Intro Video" src={INTRO[role]} />
      <Card>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
