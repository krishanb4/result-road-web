"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const impactStats = [
  {
    number: "247+",
    label: "Active Participants",
    description: "Community members achieving their goals",
    icon: Users,
  },
  {
    number: "15",
    label: "Specialized Programs",
    description: "Tailored fitness programs for all abilities",
    icon: Target,
  },
  {
    number: "8",
    label: "Partner Facilities",
    description: "Convenient locations across the region",
    icon: Award,
  },
  {
    number: "94%",
    label: "Satisfaction Rate",
    description: "Participants who recommend our programs",
    icon: Heart,
  },
];

const values = [
  "Inclusive and welcoming environment for all",
  "Evidence-based program design and implementation",
  "Qualified coaches with lived experience",
  "Flexible scheduling to fit your lifestyle",
  "Progress tracking and celebration of achievements",
  "Strong community support and connection",
];

export function AboutSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const seasonalContent = {
    spring: {
      title: "Growing Together",
      subtitle: "Like spring's renewal, we help you bloom",
      mission:
        "At Result Road, we believe everyone deserves the chance to grow and flourish. Our spring programs focus on new beginnings, fresh goals, and the support needed to achieve them.",
      imageAlt: "Spring transformation and growth",
    },
    summer: {
      title: "Energizing Lives",
      subtitle: "Bringing summer energy to your fitness journey",
      mission:
        "Result Road harnesses the vibrant energy of summer to create dynamic, engaging programs that keep you motivated and moving toward your goals all season long.",
      imageAlt: "Summer energy and vitality",
    },
    autumn: {
      title: "Harvesting Success",
      subtitle: "Reaping the rewards of dedication and community",
      mission:
        "Like autumn's harvest, Result Road helps you gather the fruits of your hard work. Our programs build lasting habits and celebrate every achievement along the way.",
      imageAlt: "Autumn achievements and success",
    },
    winter: {
      title: "Warming Hearts",
      subtitle: "Creating warmth and connection through wellness",
      mission:
        "During winter's quiet months, Result Road provides a warm, supportive environment where community thrives and personal growth continues regardless of the season.",
      imageAlt: "Winter wellness and community",
    },
  };

  const content = seasonalContent[currentSeason];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ background: colors.background }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 opacity-10"
          style={{
            background: `linear-gradient(45deg, ${colors.accent}, ${colors.secondary})`,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-white/20"
              style={{ background: `${colors.primary}10` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Heart className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                About Result Road
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: colors.textPrimary }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {content.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.h3
              className="text-2xl md:text-3xl font-semibold mb-8"
              style={{ color: colors.secondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {content.subtitle}
            </motion.h3>

            {/* Mission */}
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {content.mission}
            </motion.p>

            {/* Values */}
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    className="mt-1"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                  </motion.div>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {value}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <span className="relative z-10">Learn More About Us</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            {/* Image Section */}
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl group"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-video relative">
                <motion.img
                  src="/4.jpg"
                  alt={content.imageAlt}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Image overlay with gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />

                {/* Image content overlay */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="text-white text-sm font-medium">
                      Our Community in Action
                    </span>
                  </div>
                  <h4 className="text-white text-xl font-bold mb-2">
                    Making a Difference Together
                  </h4>
                  <p className="text-white/90 text-sm">
                    See how our programs transform lives and build stronger
                    communities
                  </p>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20"
                  style={{ background: `${colors.primary}20` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white text-xs font-semibold">
                    Featured
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {impactStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="p-6 rounded-2xl backdrop-blur-xl border border-white/20 relative overflow-hidden group hover:scale-105 transition-all duration-300"
                    style={{ background: `${colors.primary}10` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Background gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      className="flex items-center justify-between mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${colors.primary}20` }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.5,
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: colors.accent }}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Number */}
                    <motion.div
                      className="text-3xl font-bold mb-2"
                      style={{ color: colors.primary }}
                      animate={{
                        scale: [1, 1.05, 1],
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

                    {/* Label */}
                    <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.description}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
