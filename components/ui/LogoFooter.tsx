// components/ui/Logo.tsx
"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "white" | "dark";
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  variant = "default",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: {
      container: "w-14 h-14",
      text: "text-lg",
      spacing: "space-x-2",
    },
    md: {
      container: "w-18 h-18", // Increased size for better visibility
      text: "text-xl",
      spacing: "space-x-3",
    },
    lg: {
      container: "w-24 h-24",
      text: "text-2xl",
      spacing: "space-x-4",
    },
  };

  const { container, text, spacing } = sizeClasses[size];

  const getLogoSrc = () => {
    if (variant === "white") {
      return "/main-logo-dark.png"; // Always use light logo for white variant
    }
    if (variant === "dark") {
      return "/main-logo-dark.png"; // Always use dark logo for dark variant
    }
    // For default variant, use theme-aware logic
    if (!mounted) {
      return "/main-logo-dark.png"; // Default to dark logo during SSR
    }
    // Fixed logic: dark theme should use light logo, light theme should use dark logo
    return resolvedTheme === "dark"
      ? "/main-logo-dark.png"
      : "/main-logo-dark.png";
  };

  const getTextClasses = () => {
    switch (variant) {
      case "white":
        return "text-white";
      case "dark":
        return "text-slate-900";
      default:
        return "text-slate-900 dark:text-white";
    }
  };

  // Show a placeholder during SSR to prevent hydration issues
  if (!mounted) {
    return (
      <div className={`flex items-center ${spacing} group ${className}`}>
        <div
          className={`${container} rounded bg-slate-200 dark:bg-slate-700 animate-pulse`}
        />
        {showText && (
          <div
            className={`${text} bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-32 h-8`}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${spacing} group ${className}`}>
      <div
        className={`${container} relative group-hover:scale-105 transition-transform duration-200`}
      >
        <Image
          src={getLogoSrc()}
          alt="Result Road Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 56px, (max-width: 1200px) 72px, 96px"
          onError={() => {
            console.log("Logo image failed to load:", getLogoSrc());
          }}
        />
      </div>
      {/* {showText && (
        <span
          className={`${text} font-bold transition-colors ${getTextClasses()}`}
        >
          Result Road
        </span>
      )} */}
    </div>
  );
}
