import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "dark" | "light";
}

export function GlassCard({
  children,
  className,
  hover = false,
  variant = "default",
}: GlassCardProps) {
  const baseClasses =
    "relative overflow-hidden rounded-xl transition-all duration-300";

  const variantClasses = {
    default: "bg-white/95 backdrop-blur-md border border-white/20 shadow-lg",
    dark: "bg-slate-800/95 backdrop-blur-md border border-slate-600/20 shadow-lg",
    light: "bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg",
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-xl" : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
