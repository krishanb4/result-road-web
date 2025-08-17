"use client";

import { useAuth, ROLE_DISPLAY_NAMES } from "@/contexts/AuthContext";
import Link from "next/link";

export default function TopBar() {
  const { userProfile, signOut } = useAuth();

  return (
    <header
      className="
        h-14 border-b border-neutral-200 bg-white/80 backdrop-blur
        dark:border-white/10 dark:bg-neutral-950/70
      "
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md"
            style={{ background: "var(--seasonal-primary)" }}
            aria-hidden
          />
          <div className="font-semibold">Result Road</div>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {userProfile && (
            <span className="hidden sm:inline text-neutral-600 dark:text-neutral-300">
              {userProfile.email} ·{" "}
              {ROLE_DISPLAY_NAMES[userProfile.role] ?? userProfile.role}
            </span>
          )}
          <button
            onClick={signOut}
            className="rounded-lg border px-3 py-1.5 text-neutral-700 hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-100 dark:hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
