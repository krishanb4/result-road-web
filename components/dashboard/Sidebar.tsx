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
  const glass = useMemo(
    () => ({
      background:
        "linear-gradient(180deg, rgba(30,41,59,0.72), rgba(15,23,42,0.72))",
      backdropFilter: "blur(10px)",
    }),
    []
  );

  const activeStyles = (href: string) =>
    pathname === href
      ? {
          backgroundColor: "rgba(255,255,255,0.08)",
          borderColor: "rgba(255,255,255,0.15)",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px ${primary}40`,
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
        className={`fixed z-50 md:z-auto md:static left-0 top-0 h-full w-72 md:w-64 p-4 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={glass}
      >
        <div className="h-full rounded-2xl border border-white/10 flex flex-col">
          {/* Mobile close */}
          <div className="flex md:hidden items-center justify-between px-3 py-3 border-b border-white/10">
            <div className="text-sm font-semibold">Menu</div>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 hover:bg-white/20 p-1.5"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 text-white/90 hover:text-white hover:bg-white/5"
                style={activeStyles(i.href)}
                onClick={onClose}
              >
                {i.icon}
                <span className="text-sm">{i.label}</span>
              </Link>
            ))}
          </nav>

          {footer ? (
            <div className="p-3 border-t border-white/10">{footer}</div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
