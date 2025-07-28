"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  ChevronDown,
  Flower,
  Leaf,
  Snowflake,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useSeasonalTheme,
  useSeasonalColors,
  SEASONAL_THEMES,
} from "./SeasonalThemeContext";

const seasonIcons = {
  spring: Flower,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const seasonColors = {
  spring: "#22c55e",
  summer: "#3b82f6",
  autumn: "#ea580c",
  winter: "#1e40af",
};

export function EnhancedThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [showSeasonMenu, setShowSeasonMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const {
    currentSeason,
    currentTheme,
    setTheme: setSeasonalTheme,
    autoDetectSeason,
  } = useSeasonalTheme();
  const colors = useSeasonalColors();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "system":
        return <Monitor className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const CurrentSeasonIcon = seasonIcons[currentSeason];

  return (
    <div className="flex items-center space-x-2 relative">
      {/* Dark/Light Theme Toggle */}
      <div className="relative">
        <motion.button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200 flex items-center justify-center relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-gray-700 dark:text-gray-300"
          >
            {getThemeIcon()}
          </motion.div>

          {/* Hover background effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200"
            style={{ background: colors.primary }}
          />
        </motion.button>

        <AnimatePresence>
          {showThemeMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-600/20 overflow-hidden z-50"
            >
              <div className="p-2">
                {["light", "dark", "system"].map((themeOption) => {
                  const isActive = theme === themeOption;
                  const Icon =
                    themeOption === "light"
                      ? Sun
                      : themeOption === "dark"
                      ? Moon
                      : Monitor;

                  return (
                    <motion.button
                      key={themeOption}
                      onClick={() => {
                        setTheme(themeOption);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {themeOption}
                        </span>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check
                            className="w-4 h-4"
                            style={{ color: colors.primary }}
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Seasonal Theme Toggle */}
      <div className="relative">
        <motion.button
          onClick={() => setShowSeasonMenu(!showSeasonMenu)}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200 relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-5 h-5"
            style={{ color: colors.primary }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CurrentSeasonIcon />
          </motion.div>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize hidden sm:inline">
            {currentSeason}
          </span>

          <motion.div
            animate={{ rotate: showSeasonMenu ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.div>

          {/* Hover background effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200"
            style={{ background: colors.primary }}
          />
        </motion.button>

        <AnimatePresence>
          {showSeasonMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-600/20 overflow-hidden z-50"
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50 dark:border-gray-600/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Seasonal Theme
                  </h3>
                  <motion.button
                    onClick={() => {
                      const detectedSeason = autoDetectSeason();
                      setSeasonalTheme(detectedSeason);
                      setShowSeasonMenu(false);
                    }}
                    className="text-xs px-2 py-1 rounded-lg transition-colors"
                    style={{
                      background: `${colors.primary}20`,
                      color: colors.primary,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Auto
                  </motion.button>
                </div>

                {Object.entries(SEASONAL_THEMES).map(([season, theme]) => {
                  const isActive = season === currentSeason;
                  const SeasonIcon =
                    seasonIcons[season as keyof typeof seasonIcons];

                  return (
                    <motion.button
                      key={season}
                      onClick={() => {
                        setSeasonalTheme(
                          season as keyof typeof SEASONAL_THEMES
                        );
                        setShowSeasonMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-200 mb-1 ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primary}20` }}
                        >
                          <SeasonIcon
                            className="w-4 h-4"
                            style={{ color: theme.primary }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white capitalize">
                            {season}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {theme.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check
                              className="w-4 h-4"
                              style={{ color: theme.primary }}
                            />
                          </motion.div>
                        )}
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(showSeasonMenu || showThemeMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSeasonMenu(false);
            setShowThemeMenu(false);
          }}
        />
      )}
    </div>
  );
}

// Export the original simple theme toggle for compatibility
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "system":
        return <Monitor className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200 flex items-center justify-center text-gray-700 dark:text-gray-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
}
