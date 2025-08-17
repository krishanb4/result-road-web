// app/dashboard/admin/page.tsx
"use client";
import RoleGate from "@/components/RoleGate";
import AdminSubmissionsTable from "@/components/admin/AdminSubmissionsTable";

export default function AdminIndex() {
  return (
    <RoleGate allow={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin – All Submissions</h1>
        <AdminSubmissionsTable />
      </div>
    </RoleGate>
  );
}
