"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !userProfile) router.push("/login");
  }, [userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-slate-600 dark:text-slate-300 text-lg font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <TopBar />
      <div className="flex max-w-7xl mx-auto w-full">
        <Sidebar role={userProfile.role} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
