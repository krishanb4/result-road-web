"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define seasonal themes for all four seasons
export const SEASONAL_THEMES = {
  summer: {
    primary: "#3b82f6", // Ocean blue
    primaryHover: "#2563eb",
    secondary: "#06b6d4", // Cyan
    accent: "#f59e0b", // Sun orange
    background:
      "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #fef3c7 75%, #fed7aa 100%)",
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f8fafc",
    navBackground: "rgba(255, 255, 255, 0.85)",
    textPrimary: "#1e3a8a",
    textSecondary: "#1e40af",
    textMuted: "#64748b",
    season: "summer" as const,
    name: "Summer Energy",
    description: "Vibrant and energetic",
  },
  spring: {
    primary: "#10b981", // Fresh emerald green
    primaryHover: "#059669",
    secondary: "#34d399", // Lighter emerald
    accent: "#fbbf24", // Golden yellow
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #dcfce7 100%)",
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f0fdf4",
    navBackground: "rgba(255, 255, 255, 0.85)",
    textPrimary: "#064e3b",
    textSecondary: "#065f46",
    textMuted: "#6b7280",
    season: "spring" as const,
    name: "Spring Renewal",
    description: "Fresh beginnings and growth",
  },

  autumn: {
    primary: "#ea580c", // Warm orange
    primaryHover: "#dc2626",
    secondary: "#d97706", // Amber
    accent: "#dc2626", // Deep red
    background:
      "linear-gradient(135deg, #fef3c7 0%, #fed7aa 25%, #fdba74 75%, #fb923c 100%)",
    cardBackground: "#ffffff",
    cardBackgroundHover: "#fef3c7",
    navBackground: "rgba(255, 255, 255, 0.85)",
    textPrimary: "#7c2d12",
    textSecondary: "#9a3412",
    textMuted: "#78716c",
    season: "autumn" as const,
    name: "Autumn Harvest",
    description: "Warm and cozy atmosphere",
  },

  winter: {
    primary: "#1e40af", // Deep blue
    primaryHover: "#1e3a8a",
    secondary: "#0ea5e9", // Sky blue
    accent: "#6366f1", // Indigo
    background:
      "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 75%, #94a3b8 100%)",
    cardBackground: "#ffffff",
    cardBackgroundHover: "#f1f5f9",
    navBackground: "rgba(255, 255, 255, 0.9)",
    textPrimary: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
    season: "winter" as const,
    name: "Winter Serenity",
    description: "Calm and peaceful",
  },
};

// Dark mode variations (optional for future use)
export const SEASONAL_THEMES_DARK = {
  spring: {
    ...SEASONAL_THEMES.spring,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)",
    cardBackground: "#1e293b",
    cardBackgroundHover: "#334155",
    navBackground: "rgba(15, 23, 42, 0.85)",
    textPrimary: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
  },
  summer: {
    ...SEASONAL_THEMES.summer,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)",
    cardBackground: "#1e293b",
    cardBackgroundHover: "#334155",
    navBackground: "rgba(15, 23, 42, 0.85)",
    textPrimary: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
  },

  autumn: {
    ...SEASONAL_THEMES.autumn,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)",
    cardBackground: "#1e293b",
    cardBackgroundHover: "#334155",
    navBackground: "rgba(15, 23, 42, 0.85)",
    textPrimary: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
  },
  winter: {
    ...SEASONAL_THEMES.winter,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)",
    cardBackground: "#1e293b",
    cardBackgroundHover: "#334155",
    navBackground: "rgba(15, 23, 42, 0.85)",
    textPrimary: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
  },
};

type SeasonType = keyof typeof SEASONAL_THEMES;
type ThemeType = (typeof SEASONAL_THEMES)[SeasonType];

interface SeasonalThemeContextType {
  currentTheme: ThemeType;
  currentSeason: SeasonType;
  isDarkMode: boolean;
  setTheme: (season: SeasonType) => void;
  toggleDarkMode: () => void;
  autoDetectSeason: () => SeasonType;
}

// Create the context
const SeasonalThemeContext = createContext<
  SeasonalThemeContextType | undefined
>(undefined);

// Function to automatically detect season based on current month
function detectSeasonFromDate(): SeasonType {
  const month = new Date().getMonth(); // 0-11

  if (month >= 2 && month <= 7) return "spring"; // March, April, May
  if (month >= 5 && month <= 7) return "summer"; // June, July, August
  if (month >= 8 && month <= 10) return "autumn"; // September, October, November
  return "winter"; // December, January, February
}

export function SeasonalThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSeason, setCurrentSeason] = useState<SeasonType>(() => {
    // Check if there's a saved preference in localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-season");
      if (saved && saved in SEASONAL_THEMES) {
        return saved as SeasonType;
      }
    }
    return detectSeasonFromDate();
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dark-mode");
      return saved === "true";
    }
    return false;
  });

  const autoDetectSeason = (): SeasonType => {
    return detectSeasonFromDate();
  };

  const setTheme = (season: SeasonType) => {
    setCurrentSeason(season);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-season", season);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("dark-mode", newDarkMode.toString());
    }
  };

  // Auto-update season on component mount and season changes
  useEffect(() => {
    const checkSeason = () => {
      const detectedSeason = detectSeasonFromDate();
      // Only auto-update if user hasn't manually selected a season
      const hasManualSelection = localStorage.getItem("preferred-season");
      if (!hasManualSelection) {
        setCurrentSeason(detectedSeason);
      }
    };

    checkSeason();

    // Optional: Check for season changes daily
    const interval = setInterval(checkSeason, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Apply CSS custom properties for the current theme
  useEffect(() => {
    const theme = isDarkMode
      ? SEASONAL_THEMES_DARK[currentSeason]
      : SEASONAL_THEMES[currentSeason];
    const root = document.documentElement;

    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-primary-hover", theme.primaryHover);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--background-gradient", theme.background);
    root.style.setProperty("--card-background", theme.cardBackground);
    root.style.setProperty(
      "--card-background-hover",
      theme.cardBackgroundHover
    );
    root.style.setProperty("--nav-background", theme.navBackground);
    root.style.setProperty("--text-primary", theme.textPrimary);
    root.style.setProperty("--text-secondary", theme.textSecondary);
    root.style.setProperty("--text-muted", theme.textMuted);

    // Update body class for dark mode
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [currentSeason, isDarkMode]);

  const currentTheme = isDarkMode
    ? SEASONAL_THEMES_DARK[currentSeason]
    : SEASONAL_THEMES[currentSeason];

  const value: SeasonalThemeContextType = {
    currentTheme,
    currentSeason,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    autoDetectSeason,
  };

  return (
    <SeasonalThemeContext.Provider value={value}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext);
  if (context === undefined) {
    throw new Error(
      "useSeasonalTheme must be used within a SeasonalThemeProvider"
    );
  }
  return context;
}

// Utility hook for easy access to current colors
export function useSeasonalColors() {
  const { currentTheme } = useSeasonalTheme();
  return {
    primary: currentTheme.primary,
    primaryHover: currentTheme.primaryHover,
    secondary: currentTheme.secondary,
    accent: currentTheme.accent,
    background: currentTheme.background,
    cardBackground: currentTheme.cardBackground,
    cardBackgroundHover: currentTheme.cardBackgroundHover,
    navBackground: currentTheme.navBackground,
    textPrimary: currentTheme.textPrimary,
    textSecondary: currentTheme.textSecondary,
    textMuted: currentTheme.textMuted,
  };
}

// Utility function to get seasonal CSS classes
export function useSeasonalClasses() {
  const { currentSeason, isDarkMode } = useSeasonalTheme();

  const seasonalClasses = {
    spring: {
      gradient: "from-emerald-50 to-green-50",
      card: "bg-white/80 backdrop-blur-sm",
      button: "bg-emerald-500 hover:bg-emerald-600",
      text: "text-emerald-900",
      accent: "text-emerald-600",
    },
    summer: {
      gradient: "from-blue-50 to-yellow-50",
      card: "bg-white/80 backdrop-blur-sm",
      button: "bg-blue-500 hover:bg-blue-600",
      text: "text-blue-900",
      accent: "text-blue-600",
    },
    autumn: {
      gradient: "from-orange-50 to-red-50",
      card: "bg-white/80 backdrop-blur-sm",
      button: "bg-orange-500 hover:bg-orange-600",
      text: "text-orange-900",
      accent: "text-orange-600",
    },
    winter: {
      gradient: "from-slate-50 to-blue-50",
      card: "bg-white/80 backdrop-blur-sm",
      button: "bg-blue-500 hover:bg-blue-600",
      text: "text-slate-900",
      accent: "text-blue-600",
    },
  };

  const darkClasses = {
    spring: {
      gradient: "from-slate-900 to-emerald-900/20",
      card: "bg-slate-800/80 backdrop-blur-sm",
      button: "bg-emerald-600 hover:bg-emerald-700",
      text: "text-emerald-100",
      accent: "text-emerald-400",
    },
    summer: {
      gradient: "from-slate-900 to-blue-900/20",
      card: "bg-slate-800/80 backdrop-blur-sm",
      button: "bg-blue-600 hover:bg-blue-700",
      text: "text-blue-100",
      accent: "text-blue-400",
    },
    autumn: {
      gradient: "from-slate-900 to-orange-900/20",
      card: "bg-slate-800/80 backdrop-blur-sm",
      button: "bg-orange-600 hover:bg-orange-700",
      text: "text-orange-100",
      accent: "text-orange-400",
    },
    winter: {
      gradient: "from-slate-900 to-slate-800",
      card: "bg-slate-800/80 backdrop-blur-sm",
      button: "bg-blue-600 hover:bg-blue-700",
      text: "text-slate-100",
      accent: "text-blue-400",
    },
  };

  return isDarkMode
    ? darkClasses[currentSeason]
    : seasonalClasses[currentSeason];
}

// Export the context for direct access if needed
export { SeasonalThemeContext };

// Export types for use in other components
export type { SeasonType, ThemeType, SeasonalThemeContextType };
