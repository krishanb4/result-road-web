"use client";

import { useAuth, ROLE_DISPLAY_NAMES } from "@/contexts/AuthContext";

export default function TopBar() {
  const { userProfile, signOut } = useAuth();

  return (
    <header className="h-14 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="font-semibold">Result Road</div>
        <div className="flex items-center gap-3 text-sm">
          {userProfile && (
            <span className="hidden sm:inline text-neutral-600">
              {userProfile.email} ·{" "}
              {ROLE_DISPLAY_NAMES[userProfile.role] ?? userProfile.role}
            </span>
          )}
          <button
            onClick={signOut}
            className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
