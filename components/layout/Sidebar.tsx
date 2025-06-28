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
  Activity,
  Building,
  User,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    { name: "Progress", href: "/dashboard/progress", icon: Activity },
  ],
};

export function Sidebar() {
  const { userProfile, signOut } = useAuth();
  const pathname = usePathname();

  if (!userProfile) return null;

  const navigation = roleBasedNavigation[userProfile.role] || [];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-lg z-40">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Result Road</h1>
              <p className="text-sm text-slate-500 capitalize">
                {userProfile.role.replace("_", " ")}
              </p>
            </div>
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
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive
                          ? "text-primary-600"
                          : "text-slate-400 group-hover:text-slate-600"
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
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {userProfile.displayName || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {userProfile.email}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
