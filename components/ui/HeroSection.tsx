"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Users,
  Award,
  Target,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const stats = [
  { number: "247+", label: "Participants", icon: Users },
  { number: "15", label: "Programs", icon: Target },
  { number: "94%", label: "Satisfaction", icon: Award },
];

const seasonalContent = {
  spring: {
    headline: "Bloom Into Your Best Self",
    subheadline: "Spring Season Registration Open",
    description: "10 Week Camp - 1st to 7th November 2025",
    ctaPrimary: "Start Your Journey",
    ctaSecondary: "Watch Our Story",
    videoUrl: "/videos/2.mp4", // Add your spring video path
  },
  summer: {
    headline: "Dive Into Summer Fitness",
    subheadline: "Summer Intensive Programs Available",
    description:
      "Make this summer count with high-energy programs, outdoor activities, and beach-ready confidence building sessions.",
    ctaPrimary: "Join Summer Session",
    ctaSecondary: "Explore Programs",
    videoUrl: "/videos/2.mp4", // Add your summer video path
  },
  autumn: {
    headline: "Harvest Your Potential",
    subheadline: "Fall Programs Now Enrolling",
    description:
      "Embrace the season of change with our autumn fitness programs. Build strength, community, and lasting habits.",
    ctaPrimary: "Enroll Today",
    ctaSecondary: "Learn More",
    videoUrl: "/videos/2.mp4", // Add your autumn video path
  },
  winter: {
    headline: "Winter Wellness Awaits",
    subheadline: "Stay Strong Through Winter",
    description:
      "Don't let winter slow you down. Join our cozy indoor programs designed to keep you motivated and healthy all season long.",
    ctaPrimary: "Get Started",
    ctaSecondary: "View Schedule",
    videoUrl: "/videos/2.mp4", // Add your winter video path
  },
};

export function HeroSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();

  const content = seasonalContent[currentSeason];

  // Function to scroll to programs section
  const scrollToPrograms = () => {
    const programsSection = document.getElementById("programs-section");
    if (programsSection) {
      programsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
        >
          <source src={content.videoUrl} type="video/mp4" />
          {/* Fallback background */}
          <div
            className="w-full h-full"
            style={{ background: colors.background }}
          />
        </video>

        {/* Video Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center py-8 pb-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Season badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 backdrop-blur-sm border border-white/20"
            style={{
              background: `${colors.primary}15`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="font-semibold text-white text-sm sm:text-base">
              {currentTheme.name}
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            </motion.div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight text-white px-2"
          >
            {content.headline.split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2 sm:mr-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  color: colors.primary,
                  transition: { duration: 0.2 },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-white/90 px-2"
          >
            {content.subheadline}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-white/80 px-4"
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <span className="relative z-10">{content.ctaPrimary}</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPrograms}
              className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 text-white border-white/50 bg-white/10 w-full sm:w-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.div>
              <span>{content.ctaSecondary}</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/20 bg-white/10"
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  >
                    <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm sm:text-lg font-medium text-white/80">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2 cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
        >
          <span className="text-xs sm:text-sm font-medium text-white/80">
            Scroll to explore
          </span>
          <motion.div
            className="w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border-2 border-white/50"
            whileHover={{ scale: 1.1 }}
          >
            <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
