// app/dashboard/layout.tsx (or wherever this lives)
"use client";

import { ReactNode, useMemo, useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import Topbar from "@/components/dashboard/TopBar";
import Sidebar, { SideItem } from "@/components/dashboard/Sidebar";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  BarChart3,
  Users,
  FolderKanban,
  ClipboardList,
  FileText,
  Home,
} from "lucide-react";

/** NAV ITEMS */
const ADMIN_ITEMS: SideItem[] = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: <BarChart3 size={16} />,
  },
  { href: "/dashboard/admin/users", label: "Users", icon: <Users size={16} /> },
  {
    href: "/dashboard/admin/programs",
    label: "Programs",
    icon: <FolderKanban size={16} />,
  },
  {
    href: "/dashboard/admin/registrations",
    label: "Registrations",
    icon: <ClipboardList size={16} />,
  },
  {
    href: "/dashboard/admin/forms",
    label: "Forms",
    icon: <FileText size={16} />,
  },
  {
    href: "/dashboard/admin/progress",
    label: "Progress",
    icon: <BarChart3 size={16} />,
  },
];

const ROLE_ITEMS: Record<string, SideItem[]> = {
  participant: [
    { href: "/dashboard/participant", label: "Home", icon: <Home size={16} /> },
    {
      href: "/dashboard/participant/form",
      label: "Form",
      icon: <FileText size={16} />,
    },
  ],
  "service-provider": [
    {
      href: "/dashboard/service-provider",
      label: "Home",
      icon: <Home size={16} />,
    },
    {
      href: "/dashboard/service-provider/form",
      label: "Form",
      icon: <FileText size={16} />,
    },
  ],
  "fitness-partner": [
    {
      href: "/dashboard/fitness-partner",
      label: "Home",
      icon: <Home size={16} />,
    },
    {
      href: "/dashboard/fitness-partner/form",
      label: "Form",
      icon: <FileText size={16} />,
    },
  ],
  "support-worker": [
    {
      href: "/dashboard/support-worker",
      label: "Home",
      icon: <Home size={16} />,
    },
    {
      href: "/dashboard/support-worker/form",
      label: "Form",
      icon: <FileText size={16} />,
    },
  ],
  coordinator: [
    { href: "/dashboard/coordinator", label: "Home", icon: <Home size={16} /> },
    {
      href: "/dashboard/coordinator/form",
      label: "Form",
      icon: <FileText size={16} />,
    },
  ],
};

function computeTitle(segments: string[]): string {
  const [first, second] = segments;

  if (first === "admin") {
    const map: Record<string, string> = {
      undefined: "Overview",
      "": "Overview",
      participants: "Participants",
      programs: "Programs",
      registrations: "Registrations",
      forms: "Forms",
      progress: "Progress",
    };
    const sub = map[second ?? ""] ?? "Overview";
    return `Admin · ${sub}`;
  }

  const roleTitle: Record<string, string> = {
    participant: "Participant",
    "service-provider": "Service Provider",
    "fitness-partner": "Fitness Partner",
    "support-worker": "Support Worker",
    coordinator: "Coordinator of Supports",
  };

  if (first === "participant" && second === "assignment")
    return "Participant · Assignment";

  const base = roleTitle[first] ?? "Dashboard";
  if (!second) return base;
  if (second === "form") return `${base} · Form`;
  return base;
}

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const segments = useSelectedLayoutSegments();
  const theme: any = useSeasonalColors?.() ?? {};

  const isAdmin = segments[0] === "admin";
  const items: SideItem[] = isAdmin
    ? ADMIN_ITEMS
    : ROLE_ITEMS[segments[0] ?? ""] ?? [];
  const title = computeTitle(segments as string[]);

  // 👉 Light background (supports ThemeContext overrides: lightBg1/lightBg2)
  const bgStyle = useMemo(() => {
    const base1 = theme?.lightBg1 ?? "#F8FAFC"; // slate-50-ish
    const base2 = theme?.lightBg2 ?? "#EEF2FF"; // indigo-50-ish
    return { background: `linear-gradient(135deg, ${base1}, ${base2})` };
  }, [theme]);

  return (
    <div className="min-h-screen" style={bgStyle}>
      <Topbar title={title} onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          items={items}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8">
          {/* Keep a darker card so existing components with text-white remain readable */}
          <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
