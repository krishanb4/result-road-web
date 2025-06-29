// components/SeasonalThemeSelector.tsx
"use client";

import {
  useSeasonalTheme,
  seasonalColors,
  SeasonalTheme,
} from "@/contexts/ThemeContext";
import { Palette, Check } from "lucide-react";
import { useState } from "react";

export function SeasonalThemeSelector() {
  const { seasonalTheme, setSeasonalTheme } = useSeasonalTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = Object.entries(seasonalColors) as [
    SeasonalTheme,
    typeof seasonalColors.default
  ][];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 text-slate-700 dark:text-slate-300 relative group"
        title="Change seasonal theme"
        aria-label="Change seasonal theme"
      >
        <Palette className="w-5 h-5" />

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Seasonal Themes
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
            <div className="p-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-3 py-2">
                Seasonal Themes
              </h3>
              <div className="space-y-1">
                {themes.map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSeasonalTheme(key);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                        style={{ backgroundColor: config.primary }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {config.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {config.description}
                        </div>
                      </div>
                    </div>
                    {seasonalTheme === key && (
                      <Check className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
