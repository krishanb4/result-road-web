// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  getCountFromServer,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

type Counts = {
  users: {
    total: number;
    admin: number;
    participant: number;
    support_worker: number;
    fitness_partner: number;
    service_provider: number;
    instructor: number;
  };
  programs: number;
  forms: {
    total: number;
    completed: number;
    pending_review: number;
    in_review: number;
    overdue: number;
    thisWeek: number;
  };
};

export default function DashboardIndex() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  // If not logged in yet, show nothing (your layout likely guards auth anyway)
  useEffect(() => {
    if (!userProfile) return;
    // Non-admins → send to their role landing
    if (userProfile.role !== "admin") {
      const landing: Record<string, string> = {
        participant: "/dashboard/participant",
        support_worker: "/dashboard/support-worker",
        fitness_partner: "/dashboard/fitness-partner",
        service_provider: "/dashboard/service-provider",
        instructor: "/dashboard/instructor",
        admin: "/dashboard/admin", // admins handled below
      };
      router.replace(landing[userProfile.role] ?? "/dashboard/participant");
    }
  }, [userProfile, router]);

  const startOfWeek = useMemo(() => {
    // ISO week start (Mon 00:00) for "this week" form counts
    const now = new Date();
    const day = (now.getDay() + 6) % 7; // 0..6 with Monday=0
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - day);
    return Timestamp.fromDate(monday);
  }, []);

  useEffect(() => {
    if (!userProfile || userProfile.role !== "admin") return;

    (async () => {
      setLoading(true);

      // USERS
      const usersCol = collection(db, "users");
      const totalUsers = await getCountFromServer(usersCol);
      const adminUsers = await getCountFromServer(
        query(usersCol, where("role", "==", "admin"))
      );
      const participants = await getCountFromServer(
        query(usersCol, where("role", "==", "participant"))
      );
      const supportWorkers = await getCountFromServer(
        query(usersCol, where("role", "==", "support_worker"))
      );
      const fitnessPartners = await getCountFromServer(
        query(usersCol, where("role", "==", "fitness_partner"))
      );
      const serviceProviders = await getCountFromServer(
        query(usersCol, where("role", "==", "service_provider"))
      );
      const instructors = await getCountFromServer(
        query(usersCol, where("role", "==", "instructor"))
      );

      // PROGRAMS
      const programsCol = collection(db, "programs");
      const totalPrograms = await getCountFromServer(programsCol);

      // FORMS (submissions)
      const formsCol = collection(db, "forms");
      const totalForms = await getCountFromServer(formsCol);
      const completed = await getCountFromServer(
        query(formsCol, where("status", "==", "completed"))
      );
      const pendingReview = await getCountFromServer(
        query(formsCol, where("status", "==", "pending_review"))
      );
      const inReview = await getCountFromServer(
        query(formsCol, where("status", "==", "in_review"))
      );
      const overdue = await getCountFromServer(
        query(formsCol, where("status", "==", "overdue"))
      );
      // this week: submissionDate >= Monday 00:00
      const thisWeek = await getCountFromServer(
        query(formsCol, where("submissionDate", ">=", startOfWeek))
      );

      setCounts({
        users: {
          total: totalUsers.data().count,
          admin: adminUsers.data().count,
          participant: participants.data().count,
          support_worker: supportWorkers.data().count,
          fitness_partner: fitnessPartners.data().count,
          service_provider: serviceProviders.data().count,
          instructor: instructors.data().count,
        },
        programs: totalPrograms.data().count,
        forms: {
          total: totalForms.data().count,
          completed: completed.data().count,
          pending_review: pendingReview.data().count,
          in_review: inReview.data().count,
          overdue: overdue.data().count,
          thisWeek: thisWeek.data().count,
        },
      });

      setLoading(false);
    })();
  }, [userProfile, startOfWeek]);

  if (!userProfile) return null;
  if (userProfile.role !== "admin") return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-slate-600">
          Key stats across users, programs, and forms.
        </p>
      </div>

      {loading || !counts ? (
        <div className="rounded-xl border p-6">Loading stats…</div>
      ) : (
        <>
          {/* Users */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={counts.users.total}
              href="/admin/users"
            />
            <StatCard title="Participants" value={counts.users.participant} />
            <StatCard
              title="Support Workers"
              value={counts.users.support_worker}
            />
            <StatCard
              title="Service Providers"
              value={counts.users.service_provider}
            />
            <StatCard
              title="Fitness Partners"
              value={counts.users.fitness_partner}
            />
            <StatCard title="Instructors" value={counts.users.instructor} />
            <StatCard title="Admins" value={counts.users.admin} />
            <StatCard
              title="Programs"
              value={counts.programs}
              href="/dashboard/programs"
            />
          </section>

          {/* Forms */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="All Submissions"
              value={counts.forms.total}
              href="/dashboard/admin/forms"
            />
            <StatCard title="This Week" value={counts.forms.thisWeek} />
            <StatCard title="Completed" value={counts.forms.completed} />
            <StatCard
              title="Pending Review"
              value={counts.forms.pending_review}
            />
            <StatCard title="In Review" value={counts.forms.in_review} />
            <StatCard title="Overdue" value={counts.forms.overdue} />
          </section>

          {/* Quick links */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink
              href="/dashboard/admin/forms"
              title="Review Forms"
              desc="Filter by role, type, status"
            />
            <QuickLink
              href="/admin/users"
              title="Manage Users"
              desc="Roles, activation"
            />
            <QuickLink
              href="/dashboard/programs"
              title="Programs"
              desc="Create & assign programs"
            />
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickLink({
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
      className="rounded-xl border p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition block"
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-slate-500">{desc}</div>
    </Link>
  );
}
