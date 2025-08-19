// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { ReactNode, useMemo } from "react";

export type SideItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint =
    clean.length === 3
      ? parseInt(
          clean
            .split("")
            .map((c) => c + c)
            .join(""),
          16
        )
      : parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function rgba(hex: string, a: number) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } catch {
    return `rgba(99, 102, 241, ${a})`; // fallback indigo
  }
}

export default function Sidebar({
  items,
  open,
  onClose,
  footer,
}: {
  items: SideItem[];
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const theme: any = useSeasonalColors?.() ?? {};
  const primary = theme?.primary ?? "#6366F1";

  // 🎨 Acrylic/light tokens (override via ThemeContext if desired)
  const shellStyle = useMemo(
    () =>
      ({
        ["--sb-bg" as any]: theme?.sidebarBg ?? "rgba(255,255,255,0.78)",
        ["--sb-border" as any]: theme?.sidebarBorder ?? "rgba(15,23,42,0.08)", // slate-900 @ 8%
        ["--sb-text" as any]: theme?.sidebarText ?? "#0f172a", // slate-900
        ["--sb-muted" as any]: theme?.sidebarMuted ?? "#475569", // slate-600
        ["--sb-item-border" as any]:
          theme?.sidebarItemBorder ?? "rgba(15,23,42,0.06)",
        ["--sb-primary" as any]: primary,
        ["--sb-shadow" as any]:
          "0 10px 30px rgba(2,6,23,0.06), 0 1px 2px rgba(2,6,23,0.04)",
      } as React.CSSProperties),
    [theme, primary]
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const activeStyles = (href: string) =>
    isActive(href)
      ? {
          backgroundColor: rgba(primary, 0.12),
          borderColor: rgba(primary, 0.28),
          color: primary,
          boxShadow: `inset 0 0 0 1px ${rgba(primary, 0.06)}`,
        }
      : undefined;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:sticky md:top-0 left-0 top-0 h-screen w-72 md:w-64 p-3 md:p-4 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={shellStyle}
        aria-label="Sidebar"
      >
        <div
          className="
            h-full rounded-2xl border bg-[var(--sb-bg)] border-[var(--sb-border)]
            text-[var(--sb-text)] shadow-xl backdrop-blur-xl flex flex-col
            [box-shadow:var(--sb-shadow)]
          "
        >
          {/* Mobile close */}
          <div className="flex md:hidden items-center justify-between px-3 py-3 border-b border-[var(--sb-border)]">
            <div className="text-sm font-semibold">Menu</div>
            <button
              onClick={onClose}
              className="rounded-lg bg-black/5 hover:bg-black/10 p-1.5"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={onClose}
                className="
                  group relative flex items-center gap-3 px-3 py-2 rounded-xl
                  border text-[0.92rem]
                  transition-all outline-none
                  hover:bg-black/[0.025]
                  hover:border-slate-300/70
                  focus-visible:ring-2 focus-visible:ring-indigo-300/50
                "
                style={{
                  borderColor: "var(--sb-item-border)",
                  ...activeStyles(i.href),
                }}
                aria-current={isActive(i.href) ? "page" : undefined}
              >
                <span className="shrink-0 opacity-80 group-hover:opacity-100">
                  {i.icon}
                </span>
                <span
                  className="
                    truncate
                    text-slate-700 group-hover:text-slate-900
                    [color:var(--sb-text)]
                  "
                >
                  {i.label}
                </span>

                {/* right-edge subtle highlight on hover */}
                <span
                  className="
                    pointer-events-none absolute inset-y-0 right-0 w-0.5
                    opacity-0 group-hover:opacity-100
                  "
                  style={{ background: rgba(primary, 0.35) }}
                />
              </Link>
            ))}
          </nav>

          {/* Footer (optional) */}
          {footer ? (
            <div className="p-3 border-t border-[var(--sb-border)] text-[var(--sb-muted)]">
              {footer}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
