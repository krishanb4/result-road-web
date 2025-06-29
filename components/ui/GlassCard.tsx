import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "dark" | "light" | "seasonal";
}

export function GlassCard({
  children,
  className,
  hover = false,
  variant = "default",
}: GlassCardProps) {
  const baseClasses =
    "relative overflow-hidden rounded-xl transition-all duration-300";

  const getVariantClasses = () => {
    switch (variant) {
      case "seasonal":
        return "bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-600/20 shadow-lg";
      case "dark":
        return "bg-slate-800/95 backdrop-blur-md border border-slate-600/20 shadow-lg";
      case "light":
        return "bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg";
      default:
        return "bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-white/20 dark:border-slate-600/20 shadow-lg";
    }
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-xl" : "";

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), hoverClasses, className)}
    >
      {/* Seasonal accent line for seasonal variant */}
      {variant === "seasonal" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
      )}
      <div className="relative z-10">{children}</div>
      {/* Subtle seasonal glow effect */}
      {variant === "seasonal" && hover && (
        <div className="absolute inset-0 opacity-20 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
      )}
    </div>
  );
}
