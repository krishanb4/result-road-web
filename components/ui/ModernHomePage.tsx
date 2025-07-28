"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Import all section components
import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { AboutSection } from "./AboutSection";
import { ProgramsSection } from "./ProgramsSection";
import { TestimonialsSection } from "./TestamonialsSection";
import { CTASection } from "./CTASection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import {
  SeasonalThemeProvider,
  useSeasonalColors,
} from "./SeasonalThemeContext";

// Loading component
function LoadingScreen() {
  const colors = useSeasonalColors();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: colors.background }}
    >
      <div className="text-center">
        <motion.div
          className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold mb-2"
          style={{ color: colors.textPrimary }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Result Road
        </motion.h2>

        <p className="text-lg" style={{ color: colors.textSecondary }}>
          Loading your experience...
        </p>
      </div>
    </motion.div>
  );
}

// Main page content component
function PageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          {/* Navigation */}
          <Navigation />

          {/* Page Sections */}
          <main>
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* About Section */}
            <AboutSection />

            {/* Programs Section */}
            <ProgramsSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Call to Action Section */}
            <CTASection />

            {/* Contact Section */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main HomePage component with theme provider
export function ModernHomePage() {
  return (
    <SeasonalThemeProvider>
      <PageContent />
    </SeasonalThemeProvider>
  );
}

// Export individual sections for use in other pages
export {
  Navigation,
  HeroSection,
  FeaturesSection,
  AboutSection,
  ProgramsSection,
  TestimonialsSection,
  CTASection,
  ContactSection,
  Footer,
};

// Export the theme context for use in other components
export {
  SeasonalThemeProvider,
  useSeasonalTheme,
  useSeasonalColors,
} from "./SeasonalThemeContext";
