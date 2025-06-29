// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Building,
  User,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const roleBasedNavigation = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Programs", href: "/dashboard/programs", icon: BookOpen },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  participant: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Programs", href: "/dashboard/programs", icon: BookOpen },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart3 },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  ],
  instructor: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Sessions", href: "/dashboard/sessions", icon: Calendar },
    { name: "Participants", href: "/dashboard/participants", icon: Users },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  ],
  fitness_partner: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Facilities", href: "/dashboard/facilities", icon: Building },
    { name: "Instructors", href: "/dashboard/instructors", icon: User },
    { name: "Programs", href: "/dashboard/programs", icon: BookOpen },
  ],
  service_provider: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Care Plans", href: "/dashboard/care-plans", icon: BookOpen },
    { name: "Staff", href: "/dashboard/staff", icon: User },
  ],
  support_worker: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Clients", href: "/dashboard/clients", icon: Users },
    { name: "Sessions", href: "/dashboard/sessions", icon: Calendar },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  ],
};

export function Sidebar() {
  const { userProfile, signOut } = useAuth();
  const pathname = usePathname();
  const seasonalColors = useSeasonalColors();

  if (!userProfile) return null;

  const navigation = roleBasedNavigation[userProfile.role] || [];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg z-40 transition-all duration-300">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="mb-4">
            <Logo size="md" />
          </div>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400 mb-4">
            {userProfile.role.replace("_", " ")}
          </p>

          {/* Theme Toggle in Sidebar */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      )}
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${seasonalColors.primary} rounded-xl flex items-center justify-center`}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                {userProfile.displayName || "User"}
              </p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                {userProfile.email}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 transition-colors text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
