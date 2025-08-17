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

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !userProfile) {
      router.push("/login");
    }
  }, [userProfile, loading, router]);

  // Seasonal-accented loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300
                   bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-4 border-neutral-200 dark:border-neutral-800
                       border-t-[color:var(--seasonal-primary)] animate-spin"
            aria-hidden
          />
          <span className="text-lg font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div
      className="min-h-screen w-full selection:bg-[var(--seasonal-primary-light)]
                 selection:text-[var(--seasonal-primary-dark)]
                 bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                   z-[100] rounded-md bg-white/90 px-3 py-2 text-sm shadow
                   dark:bg-neutral-900/90 dark:text-white"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <TopBar />

      {/* Shell */}
      <div className="mx-auto flex w-full max-w-7xl">
        {/* Sidebar (handles its own desktop/mobile UI) */}
        <Sidebar role={userProfile.role} />

        {/* Main content area */}
        <main
          id="main"
          className="flex-1 min-h-[calc(100vh-56px)] p-4 sm:p-6 md:p-8
                     bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50
                     dark:bg-neutral-900/40"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
