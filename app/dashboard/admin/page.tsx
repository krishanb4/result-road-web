"use client";
import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-slate-600">
        Manage users, review forms, and programs.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/forms"
          className="border rounded-xl p-4 hover:bg-slate-50"
        >
          <h2 className="font-medium">All Form Submissions</h2>
          <p className="text-sm text-slate-500">
            Filter by role, form, period, status.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="border rounded-xl p-4 hover:bg-slate-50"
        >
          <h2 className="font-medium">Users</h2>
          <p className="text-sm text-slate-500">
            View, edit roles, activate/deactivate.
          </p>
        </Link>

        <Link
          href="/dashboard/programs"
          className="border rounded-xl p-4 hover:bg-slate-50"
        >
          <h2 className="font-medium">Programs</h2>
          <p className="text-sm text-slate-500">
            Create and assign training programs.
          </p>
        </Link>
      </div>
    </div>
  );
}
