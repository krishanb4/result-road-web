"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import React from "react";

const SECTIONS: Record<string, { label: string; href: string }[]> = {
  common: [{ label: "Home", href: "/dashboard" }],
  participant: [
    { label: "Assigned Program", href: "/dashboard/programs/assigned" },
  ],
  support_worker: [
    { label: "Monitoring Form", href: "/dashboard/forms/monitoring" },
  ],
  fitness_partner: [
    { label: "Group Management", href: "/dashboard/forms/group-management" },
  ],
  service_provider: [{ label: "Feedback", href: "/dashboard/forms/feedback" }],
  instructor: [
    { label: "Progress Overview", href: "/dashboard/forms/progress-overview" },
  ],
  admin: [
    { label: "Assign Programs", href: "/dashboard/admin/assign" },
    { label: "All Submissions", href: "/dashboard/admin/data" },
  ],
};

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const links = [...SECTIONS.common, ...(SECTIONS[role] ?? [])];

  return (
    <>
      <aside className="sticky top-0 h-[calc(100vh-56px)] hidden md:block w-64 shrink-0 border-r border-neutral-200 bg-white">
        <nav className="p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 ${
                pathname === l.href ? "bg-neutral-100 font-medium" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile toggle */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full border bg-white p-3 shadow"
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 p-4 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 ${
                pathname === l.href ? "bg-neutral-100 font-medium" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
