"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Info,
  Settings,
  Calendar,
  Store,
  Phone,
  UserPlus,
  LogIn,
  Sparkles,
  Sun,
  Leaf,
  Snowflake,
  Flower,
  Heart, // Added for Services
} from "lucide-react";
import {
  useSeasonalTheme,
  useSeasonalColors,
  SEASONAL_THEMES,
} from "./SeasonalThemeContext";
import { ThemeToggle } from "./ThemeToggle";

const navigationItems = [
  { name: "About", href: "/about", icon: Info },
  { name: "Services", href: "/services", icon: Heart }, // Added Services
  { name: "Programs", href: "/programs", icon: Settings },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Store", href: "/store", icon: Store },
  { name: "Contact", href: "/contact", icon: Phone },
];

const seasonIcons = {
  spring: Flower,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

// Logo images for each season/theme
const logoImages = {
  spring: "/logos/main-logo-light.png", // Add your spring logo path
  summer: "/logos/main-logo-light.png", // Add your summer logo path
  autumn: "/logos/main-logo-light.png", // Add your autumn logo path
  winter: "/logos/main-logo-light.png", // Add your winter logo path
};

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);
  const { currentTheme, currentSeason, setTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const CurrentSeasonIcon = seasonIcons[currentSeason];
  const currentLogo = logoImages[currentSeason];

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className={`relative rounded-2xl transition-all duration-500 ${
              isScrolled
                ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/20"
                : "bg-white/60 backdrop-blur-md shadow-md shadow-black/5 border border-white/10"
            }`}
            style={{
              background: isScrolled
                ? `${colors.navBackground} backdrop-filter: blur(20px)`
                : `rgba(255, 255, 255, 0.6)`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-2">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-lg bg-white/80 backdrop-blur-sm border border-white/20">
                    <img
                      src={currentLogo}
                      alt={`Result Road ${currentSeason} logo`}
                      className="w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: `drop-shadow(0 2px 4px ${colors.primary}20)`,
                      }}
                    />
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-0.5">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 relative group text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                          }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Season Selector */}
                {/* <div className="relative">
                  <motion.button
                    onClick={() => setShowSeasonSelector(!showSeasonSelector)}
                    className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CurrentSeasonIcon
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showSeasonSelector && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                      >
                        <div className="p-2">
                          {Object.entries(SEASONAL_THEMES).map(
                            ([season, theme]) => {
                              const SeasonIcon =
                                seasonIcons[season as keyof typeof seasonIcons];
                              return (
                                <motion.button
                                  key={season}
                                  onClick={() => {
                                    setTheme(
                                      season as keyof typeof SEASONAL_THEMES
                                    );
                                    setShowSeasonSelector(false);
                                  }}
                                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                                    season === currentSeason
                                      ? "bg-gray-100"
                                      : "hover:bg-gray-50"
                                  }`}
                                  whileHover={{ x: 4 }}
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                      backgroundColor: `${theme.primary}20`,
                                    }}
                                  >
                                    <SeasonIcon
                                      className="w-4 h-4"
                                      style={{ color: theme.primary }}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 capitalize">
                                      {season}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {theme.description}
                                    </div>
                                  </div>
                                </motion.button>
                              );
                            }
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}

                {/* Theme Toggle */}
                {/* <ThemeToggle /> */}

                {/* Auth Buttons - Desktop */}
                <div className="hidden lg:flex items-center space-x-1">
                  <Link
                    href="/login"
                    className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-white/50 transition-all duration-200 text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/register"
                      className="flex items-center space-x-1.5 px-4 py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </Link>
                  </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4 text-gray-700" />
                  ) : (
                    <Menu className="w-4 h-4 text-gray-700" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
                      <img
                        src={currentLogo}
                        alt={`Result Road ${currentSeason} logo`}
                        className="w-full h-full object-contain p-1 transition-all duration-500"
                        style={{
                          filter: `drop-shadow(0 2px 4px ${colors.primary}20)`,
                        }}
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Result Road</h2>
                      <p className="text-xs text-gray-600">
                        {currentTheme.name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6">
                  <nav className="px-6 space-y-2">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center space-x-4 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${colors.primary}15` }}
                            >
                              <Icon
                                className="w-5 h-5"
                                style={{ color: colors.primary }}
                              />
                            </div>
                            <span>{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>

                {/* Auth Buttons - Mobile */}
                <div className="border-t border-gray-200/50 p-6 space-y-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close season selector */}
      {/* {showSeasonSelector && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSeasonSelector(false)}
        />
      )} */}
    </>
  );
}
