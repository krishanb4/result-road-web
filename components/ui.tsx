// components/ui.tsx
"use client";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import React from "react";

export function Card({
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-neutral-900/50 p-5 shadow-lg backdrop-blur",
        className
      )}
      {...p}
    />
  );
}

export function Button({
  className,
  loading,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
        "bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white hover:brightness-110 active:brightness-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...p}
    >
      {p.children}
      {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-lg bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full rounded-lg bg-neutral-900/60 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-500",
        props.className
      )}
    />
  );
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={clsx(
        "block text-xs uppercase tracking-wide text-white/70",
        props.className
      )}
    />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-lg font-semibold tracking-tight text-white">
      {children}
    </h2>
  );
}
