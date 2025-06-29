// contexts/ThemeContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

export type SeasonalTheme =
  | "default"
  | "spring"
  | "summer"
  | "autumn"
  | "winter";

interface SeasonalContextType {
  seasonalTheme: SeasonalTheme;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
}

const SeasonalContext = createContext<SeasonalContextType | undefined>(
  undefined
);

// Seasonal color configurations
const seasonalColors = {
  default: {
    primary: "#10B981", // emerald-500
    primaryHover: "#059669", // emerald-600
    primaryLight: "#D1FAE5", // emerald-100
    primaryDark: "#064E3B", // emerald-900
    name: "Default",
    description: "Classic Result Road branding",
  },
  spring: {
    primary: "#A8E6A1", // Light Green
    primaryHover: "#86D67C",
    primaryLight: "#E8F5E8",
    primaryDark: "#2D5016",
    name: "Spring",
    description: "Fresh and vibrant",
  },
  summer: {
    primary: "#FFD54F", // Warm Yellow
    primaryHover: "#FFC107",
    primaryLight: "#FFF8E1",
    primaryDark: "#FF6F00",
    name: "Summer",
    description: "Bright and energetic",
  },
  autumn: {
    primary: "#FF8C42", // Burnt Orange
    primaryHover: "#FF7043",
    primaryLight: "#FFF3E0",
    primaryDark: "#BF360C",
    name: "Autumn",
    description: "Warm and cozy",
  },
  winter: {
    primary: "#4FC3F7", // Cool Blue
    primaryHover: "#29B6F6",
    primaryLight: "#E1F5FE",
    primaryDark: "#01579B",
    name: "Winter",
    description: "Cool and crisp",
  },
};

interface SeasonalProviderProps {
  children: ReactNode;
}

function SeasonalProvider({ children }: SeasonalProviderProps) {
  const [seasonalTheme, setSeasonalTheme] = useState<SeasonalTheme>("default");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize seasonal theme on mount
  useEffect(() => {
    const savedSeasonalTheme = localStorage.getItem(
      "seasonal-theme"
    ) as SeasonalTheme;

    if (
      savedSeasonalTheme &&
      Object.keys(seasonalColors).includes(savedSeasonalTheme)
    ) {
      setSeasonalTheme(savedSeasonalTheme);
    } else {
      // Load admin-set global theme from localStorage
      const globalSeasonalTheme = localStorage.getItem(
        "global-seasonal-theme"
      ) as SeasonalTheme;
      if (
        globalSeasonalTheme &&
        Object.keys(seasonalColors).includes(globalSeasonalTheme)
      ) {
        setSeasonalTheme(globalSeasonalTheme);
      }
    }

    setIsInitialized(true);
  }, []);

  // Apply seasonal theme CSS variables and classes
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    const colors = seasonalColors[seasonalTheme];

    // Apply seasonal theme CSS variables
    root.style.setProperty("--seasonal-primary", colors.primary);
    root.style.setProperty("--seasonal-primary-hover", colors.primaryHover);
    root.style.setProperty("--seasonal-primary-light", colors.primaryLight);
    root.style.setProperty("--seasonal-primary-dark", colors.primaryDark);

    // Add seasonal theme class
    root.classList.remove(
      "theme-default",
      "theme-spring",
      "theme-summer",
      "theme-autumn",
      "theme-winter"
    );
    root.classList.add(`theme-${seasonalTheme}`);
  }, [seasonalTheme, isInitialized]);

  // Save to localStorage when seasonal theme changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("seasonal-theme", seasonalTheme);
  }, [seasonalTheme, isInitialized]);

  // Listen for global theme changes
  useEffect(() => {
    const handleGlobalThemeChange = (event: CustomEvent) => {
      const { theme } = event.detail;
      if (Object.keys(seasonalColors).includes(theme)) {
        setSeasonalTheme(theme);
      }
    };

    window.addEventListener(
      "globalThemeChange",
      handleGlobalThemeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "globalThemeChange",
        handleGlobalThemeChange as EventListener
      );
    };
  }, []);

  const handleSetSeasonalTheme = (theme: SeasonalTheme) => {
    setSeasonalTheme(theme);
  };

  return (
    <SeasonalContext.Provider
      value={{
        seasonalTheme,
        setSeasonalTheme: handleSetSeasonalTheme,
      }}
    >
      {children}
    </SeasonalContext.Provider>
  );
}

// Combined Theme Provider
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SeasonalProvider>{children}</SeasonalProvider>
    </NextThemeProvider>
  );
}

// Custom hooks
export function useSeasonalTheme() {
  const context = useContext(SeasonalContext);
  if (context === undefined) {
    throw new Error("useSeasonalTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper hook for getting current seasonal colors with proper mounting
export function useSeasonalColors() {
  const { seasonalTheme } = useSeasonalTheme();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return default colors during SSR and initial client render
  if (!mounted) {
    return seasonalColors.default;
  }

  return seasonalColors[seasonalTheme];
}

// Export seasonal colors for external use
export { seasonalColors };

// Helper function for admin to save global theme
export async function saveGlobalSeasonalTheme(theme: SeasonalTheme) {
  try {
    // In a real app, this would be an API call
    // await fetch('/api/admin/global-theme', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ seasonalTheme: theme })
    // });

    // For now, save to localStorage to simulate global setting
    localStorage.setItem("global-seasonal-theme", theme);

    // Dispatch custom event to notify all tabs/windows
    window.dispatchEvent(
      new CustomEvent("globalThemeChange", {
        detail: { theme },
      })
    );

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
