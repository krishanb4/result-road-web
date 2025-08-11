"use client";

import { useAuth, ROLE_DISPLAY_NAMES } from "@/contexts/AuthContext";
import IntroVideo from "@/components/video/IntroVideo";
import Link from "next/link";

const roleToVideoKey: Record<string, string> = {
  admin: "admin",
  participant: "participant",
  support_worker: "support_worker",
  fitness_partner: "fitness_partner",
  service_provider: "service_provider",
  instructor: "instructor",
};

export default function DashboardIndex() {
  const { userProfile } = useAuth();
  if (!userProfile) return null;

  const role = userProfile.role;
  const videoDocKey = roleToVideoKey[role] ?? "participant";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{userProfile.displayName ? `, ${userProfile.displayName}` : ""}
        </h1>
        <p className="text-sm text-neutral-600">
          Your role: {ROLE_DISPLAY_NAMES[role] ?? role}
        </p>
      </div>

      <IntroVideo videoKey={videoDocKey} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {role === "participant" && (
          <CardLink
            href="/dashboard/programs/assigned"
            title="Training Program"
            desc="View your assigned program and dates."
          />
        )}
        {role === "support_worker" && (
          <CardLink
            href="/dashboard/forms/monitoring"
            title="Client Monitoring Form"
            desc="Submit weekly monitoring for clients."
          />
        )}
        {role === "fitness_partner" && (
          <CardLink
            href="/dashboard/forms/group-management"
            title="Group Management Form"
            desc="Manage groups and session notes."
          />
        )}
        {role === "service_provider" && (
          <CardLink
            href="/dashboard/forms/feedback"
            title="Feedback Form"
            desc="Provide program/service feedback."
          />
        )}
        {role === "instructor" && (
          <CardLink
            href="/dashboard/forms/progress-overview"
            title="Progress Overview"
            desc="Submit participant progress summaries."
          />
        )}
        {role === "admin" && (
          <>
            <CardLink
              href="/dashboard/admin/assign"
              title="Assign Programs"
              desc="Assign programs to participants with dates."
            />
            <CardLink
              href="/dashboard/admin/data"
              title="All Submissions"
              desc="View/search/export all form data."
            />
          </>
        )}
      </div>
    </div>
  );
}

function CardLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-neutral-600 mt-1">{desc}</p>
    </Link>
  );
}
