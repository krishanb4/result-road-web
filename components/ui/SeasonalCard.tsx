// components/ui/SeasonalCard.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { ReactNode } from "react";

interface SeasonalCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "gradient";
  hover?: boolean;
}

export function SeasonalCard({
  children,
  className = "",
  variant = "default",
  hover = true,
}: SeasonalCardProps) {
  const seasonalColors = useSeasonalColors();

  const baseClasses = "rounded-2xl border transition-all duration-300";
  const hoverClasses = hover ? "hover:scale-105 hover:shadow-xl" : "";

  const variantClasses = {
    default:
      "p-8 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700",
    elevated:
      "p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg",
    gradient: "p-8 text-white shadow-xl",
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  if (variant === "gradient") {
    return (
      <div
        className={cardClasses}
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${cardClasses} overflow-hidden`}>
      {/* Seasonal color overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: seasonalColors.primary }}
      />

      {/* Seasonal accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: seasonalColors.primary, opacity: 0.8 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// components/ui/SeasonalIcon.tsx
interface SeasonalIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SeasonalIcon({
  icon: Icon,
  size = "md",
  className = "",
}: SeasonalIconProps) {
  const seasonalColors = useSeasonalColors();

  const sizeClasses = {
    sm: { container: "w-10 h-10", icon: "w-5 h-5" },
    md: { container: "w-12 h-12", icon: "w-6 h-6" },
    lg: { container: "w-14 h-14", icon: "w-7 h-7" },
  };

  const { container, icon } = sizeClasses[size];

  return (
    <div
      className={`${container} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg ${className}`}
      style={{ backgroundColor: seasonalColors.primary }}
    >
      <Icon className={`${icon} text-white`} />
    </div>
  );
}

// components/ui/SeasonalButton.tsx
interface SeasonalButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SeasonalButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  fullWidth = false,
}: SeasonalButtonProps) {
  const seasonalColors = useSeasonalColors();

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClasses =
    "font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${widthClass} ${className}`;

  if (variant === "primary") {
    return (
      <button
        className={`${buttonClasses} text-white shadow-lg hover:shadow-xl hover:scale-105`}
        style={{ backgroundColor: seasonalColors.primary }}
        onMouseEnter={(e) => {
          if (!disabled)
            e.currentTarget.style.backgroundColor = seasonalColors.primaryHover;
        }}
        onMouseLeave={(e) => {
          if (!disabled)
            e.currentTarget.style.backgroundColor = seasonalColors.primary;
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        className={`${buttonClasses} bg-transparent border-2 hover:text-white`}
        style={{
          borderColor: seasonalColors.primary,
          color: seasonalColors.primary,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = seasonalColors.primary;
            e.currentTarget.style.color = "white";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = seasonalColors.primary;
          }
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${buttonClasses} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// components/ui/SeasonalBadge.tsx
interface SeasonalBadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function SeasonalBadge({
  children,
  variant = "primary",
  className = "",
}: SeasonalBadgeProps) {
  const seasonalColors = useSeasonalColors();

  if (variant === "primary") {
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium text-white ${className}`}
        style={{ backgroundColor: seasonalColors.primary }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${className}`}
      style={{
        backgroundColor: `${seasonalColors.primary}20`,
        borderColor: `${seasonalColors.primary}40`,
        color: seasonalColors.primary,
      }}
    >
      {children}
    </span>
  );
}

// components/ui/FeatureList.tsx
interface FeatureListItem {
  text: string;
}

interface FeatureListProps {
  items: string[] | FeatureListItem[];
  iconVariant?: "check" | "dot" | "custom";
  customIcon?: LucideIcon;
}

export function FeatureList({
  items,
  iconVariant = "check",
  customIcon,
}: FeatureListProps) {
  const seasonalColors = useSeasonalColors();

  const renderIcon = () => {
    if (iconVariant === "dot") {
      return (
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: seasonalColors.primary }}
        />
      );
    }

    if (iconVariant === "custom" && customIcon) {
      const CustomIcon = customIcon;
      return (
        <CustomIcon
          className="w-4 h-4 flex-shrink-0"
          style={{ color: seasonalColors.primary }}
        />
      );
    }

    // Default check icon
    return (
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        style={{ color: seasonalColors.primary }}
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const text = typeof item === "string" ? item : item.text;
        return (
          <li key={index} className="flex items-center space-x-3">
            {renderIcon()}
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
