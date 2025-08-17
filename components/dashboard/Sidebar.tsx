"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import clsx from "clsx";
import {
  Home,
  ClipboardList,
  FileText,
  Users,
  GraduationCap,
  ClipboardCheck,
  Layers,
  Gauge,
  Menu,
  X,
} from "lucide-react";

// Type is flexible: string or your exported UserRole
export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const sections = buildSections(role);
  const links = sections.flatMap((s) => s.items);

  React.useEffect(() => {
    // close drawer on route change
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop */}
      <aside
        className={clsx(
          "sticky top-0 hidden h-[calc(100vh-56px)] w-72 shrink-0 md:block",
          "border-r border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70",
          "dark:bg-neutral-950/70 dark:border-white/10"
        )}
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {role ? "Signed in as" : "Navigation"}
          </div>
          {role && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                background: "var(--seasonal-primary-light)",
                color: "var(--seasonal-primary-dark)",
              }}
            >
              {role.replace("_", " ")}
            </span>
          )}
        </div>

        <nav className="h-[calc(100%-44px)] overflow-y-auto px-2 pb-6 scrollbar-thin">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              {section.title && (
                <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {section.title}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href + "/"));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        data-active={active}
                        className={clsx(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          "hover:bg-neutral-100 dark:hover:bg-white/5",
                          "text-neutral-700 dark:text-neutral-200",
                          "data-[active=true]:bg-neutral-100 dark:data-[active=true]:bg-white/10",
                          "data-[active=true]:text-neutral-900 dark:data-[active=true]:text-white",
                          "ring-1 ring-transparent hover:ring-neutral-200 dark:hover:ring-white/10"
                        )}
                      >
                        <item.icon
                          className={clsx(
                            "h-4 w-4 shrink-0",
                            "text-neutral-400 dark:text-neutral-400",
                            "group-data-[active=true]:text-[color:var(--seasonal-primary)]"
                          )}
                        />
                        <span>{item.label}</span>

                        {/* active accent bar */}
                        <span
                          className={clsx(
                            "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full opacity-0 transition",
                            "group-data-[active=true]:opacity-100"
                          )}
                          style={{ background: "var(--seasonal-primary)" }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile toggle */}
      <button
        className={clsx(
          "md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full p-3 shadow-lg",
          "border bg-white/90 backdrop-blur dark:border-white/10 dark:bg-neutral-900/80"
        )}
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          "md:hidden fixed inset-y-0 left-0 z-50 w-80 transform border-r p-4 transition-transform",
          "bg-white/95 backdrop-blur border-neutral-200 dark:bg-neutral-950/90 dark:border-white/10",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold">Menu</div>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {role && (
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "var(--seasonal-primary-light)",
              color: "var(--seasonal-primary-dark)",
            }}
          >
            Role: {role.replace("_", " ")}
          </div>
        )}

        <nav className="space-y-4 overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.title}>
              {section.title && (
                <div className="px-1 pb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {section.title}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href + "/"));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        data-active={active}
                        className={clsx(
                          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          "hover:bg-neutral-100 dark:hover:bg-white/5",
                          "data-[active=true]:bg-neutral-100 dark:data-[active=true]:bg-white/10"
                        )}
                      >
                        <item.icon
                          className={clsx(
                            "h-4 w-4",
                            "text-neutral-400 group-data-[active=true]:text-[color:var(--seasonal-primary)]"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

type Item = { label: string; href: string; icon: React.ComponentType<any> };
type Section = { title: string; items: Item[] };

function buildSections(role: string): Section[] {
  const common: Section = {
    title: "Common",
    items: [{ label: "Home", href: "/dashboard", icon: Home }],
  };

  const map: Record<string, Section> = {
    participant: {
      title: "Participant",
      items: [
        {
          label: "Assigned Program",
          href: "/dashboard/programs/assigned",
          icon: ClipboardList,
        },
      ],
    },
    support_worker: {
      title: "Support Worker",
      items: [
        {
          label: "Monitoring Form",
          href: "/dashboard/forms/monitoring",
          icon: ClipboardCheck,
        },
      ],
    },
    fitness_partner: {
      title: "Fitness Partner",
      items: [
        {
          label: "Group Management",
          href: "/dashboard/forms/group-management",
          icon: Users,
        },
      ],
    },
    service_provider: {
      title: "Service Provider",
      items: [
        {
          label: "Feedback",
          href: "/dashboard/forms/feedback",
          icon: FileText,
        },
      ],
    },
    instructor: {
      title: "Instructor",
      items: [
        {
          label: "Progress Overview",
          href: "/dashboard/forms/progress-overview",
          icon: GraduationCap,
        },
      ],
    },
    admin: {
      title: "Admin",
      items: [
        {
          label: "Assign Programs",
          href: "/dashboard/admin/assign",
          icon: Layers,
        },
        {
          label: "All Submissions",
          href: "/dashboard/admin/data",
          icon: Gauge,
        },
      ],
    },
  };

  const out: Section[] = [common];
  if (map[role]) out.push(map[role]);
  return out;
}
