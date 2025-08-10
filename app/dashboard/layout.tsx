"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, loading, signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(3); // Mock notification count

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push("/login");
    }
  }, [userProfile, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
          <span className="text-slate-600 dark:text-slate-300 text-lg font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      {/* Header Bar */}
      <div className="ml-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-300">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search forms, users, programs..."
                className="w-full pl-12 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {userProfile.displayName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {userProfile.role.replace("_", " ")}
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userProfile.displayName?.charAt(0) || "U"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 min-h-screen transition-all duration-300">
          {children}
        </div>
      </main>

      {/* Admin Data Access Banner */}
      {userProfile.role === "admin" && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">
              Admin Access: Full Data Control
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
