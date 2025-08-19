// components/ui/Modal.tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** sm | md | lg */
  size?: "sm" | "md" | "lg";
  /** Optional aria-describedby id */
  descriptionId?: string;
};

const sizeMap = {
  sm: "max-w-sm", // ~24rem
  md: "max-w-xl", // ~36rem
  lg: "max-w-3xl", // ~48rem
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  descriptionId,
}: ModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus management + ESC close
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Click outside to close
  function onBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={descriptionId}
      onMouseDown={onBackdropClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={`relative w-full ${sizeMap[size]} sm:rounded-2xl bg-white border border-slate-200 shadow-2xl sm:mx-auto
                    sm:overflow-hidden overflow-y-auto max-h-[92vh] sm:max-h-[85vh]`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-2">
            <h2
              id="modal-title"
              className="text-sm sm:text-base font-semibold text-slate-900"
            >
              {title || "Dialog"}
            </h2>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200
                         bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-indigo-300/60"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 sm:px-5">{children}</div>
      </div>
    </div>
  );
}
