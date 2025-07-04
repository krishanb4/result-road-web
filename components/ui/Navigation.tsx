"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { useSeasonalColors } from "@/contexts/ThemeContext";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const seasonalColors = useSeasonalColors();

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              About
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
            <Link
              href="/services"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              Services
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
            <Link
              href="/programs"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              Programs
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
            <Link
              href="/events"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              Events
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
            <Link
              href="/store"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              Store
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
            <Link
              href="/contact"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium relative group"
            >
              Contact
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ backgroundColor: seasonalColors.primary }}
              />
            </Link>
          </div>

          {/* Desktop CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium px-5 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center space-x-2"
              style={{
                backgroundColor: seasonalColors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  seasonalColors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = seasonalColors.primary;
              }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="px-6 py-8 space-y-6">
              <a
                href="#about"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#services"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#programs"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Programs
              </a>
              <a
                href="#events"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="#store"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Store
              </a>
              <a
                href="#contact"
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <Link
                  href="/login"
                  className="block text-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium py-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-white font-semibold py-4 rounded-xl text-center"
                  style={{
                    backgroundColor: seasonalColors.primary,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
