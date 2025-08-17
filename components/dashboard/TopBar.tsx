"use client";

import { useMemo } from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useSeasonalColors } from "@/contexts/ThemeContext";

export default function Topbar({
  title,
  onOpenSidebar,
}: {
  title: string;
  onOpenSidebar: () => void;
}) {
  // Pull themed colors (safe fallbacks if keys differ)
  const theme: any = useSeasonalColors?.() ?? {};
  const primary = theme?.primary ?? "#6366F1"; // indigo-500
  const accent = theme?.accent ?? theme?.secondary ?? "#22D3EE"; // cyan-400
  const textOn = theme?.onPrimary ?? "#ffffff";

  const gradient = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, ${primary}, ${accent})`,
      color: textOn,
    }),
    [primary, accent, textOn]
  );

  return (
    <header className="sticky top-0 z-40">
      <div
        style={gradient}
        className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/15"
      >
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden inline-flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 w-9 h-9"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <h1 className="text-base md:text-lg font-semibold tracking-tight flex-1">
          {title}
        </h1>

        {/* Quick search (non-functional shell; hook up later) */}
        <div className="hidden md:flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5">
          <Search size={16} />
          <input
            placeholder="Search…"
            className="bg-transparent outline-none text-sm placeholder-white/70 w-56"
          />
        </div>

        {/* Icons */}
        <button
          className="inline-flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 w-9 h-9"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          className="inline-flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 w-9 h-9"
          onClick={() => auth.signOut()}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
