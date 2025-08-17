"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Sun,
  Leaf,
  Snowflake,
  Flower,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Success Stories", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const programLinks = [
  { label: "Strength Building", href: "/programs/strength" },
  { label: "Balance & Coordination", href: "/programs/balance" },
  { label: "Confidence Building", href: "/programs/confidence" },
  { label: "Group Classes", href: "/programs/group" },
  { label: "Personal Training", href: "/programs/personal" },
  { label: "Adaptive Programs", href: "/programs/adaptive" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Careers", href: "/careers" },
  { label: "Press Kit", href: "/press" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const seasonIcons = {
  spring: Flower,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

export function Footer() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const CurrentSeasonIcon = seasonIcons[currentSeason];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const seasonalContent = {
    spring: {
      tagline: "Growing stronger together, one step at a time",
      description:
        "Bloom into your best self with Result Road's spring programs",
    },
    summer: {
      tagline: "Energizing lives with every workout",
      description: "Dive into summer fitness with our dynamic programs",
    },
    autumn: {
      tagline: "Harvesting confidence and strength",
      description: "Reap the rewards of dedication with our autumn community",
    },
    winter: {
      tagline: "Warming hearts through movement",
      description: "Stay motivated through winter with our supportive programs",
    },
  };

  const content = seasonalContent[currentSeason];

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: colors.background }}
      />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <CurrentSeasonIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Result Road
                    </h3>
                    <p className="text-sm" style={{ color: colors.primary }}>
                      {currentTheme.name}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {content.description}
                </p>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4" style={{ color: colors.accent }} />
                  <span>{content.tagline}</span>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  {/* <Phone
                    className="w-4 h-4"
                    style={{ color: colors.primary }} 
                  // /> *}
                  {/* <a
                    href="tel:0456194251"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    0456 194 251
                  </a> */}
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" style={{ color: colors.primary }} />
                  <a
                    href="mailto:nath@boxcamp.page"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    hello@resultroad.com.au
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin
                    className="w-4 h-4 mt-1"
                    style={{ color: colors.primary }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Newcastle, Lake Macquarie , Nelson Bay & Hunter Region
                  </span>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex space-x-4"
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300 group"
                      style={{ background: `${colors.primary}10` }}
                      whileHover={{
                        scale: 1.1,
                        background: `${colors.primary}20`,
                        borderColor: `${colors.primary}40`,
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group inline-block"
                    >
                      {link.label}
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Programs
              </h4>
              <ul className="space-y-3">
                {programLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group inline-block"
                    >
                      {link.label}
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group inline-block"
                    >
                      {link.label}
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400"
              >
                <span>© 2024 Result Road. All rights reserved.</span>
                <div className="flex items-center space-x-2">
                  <span>Designed and developed by </span>
                  {/* <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* <Heart
                      className="w-4 h-4 fill-current"
                      style={{ color: colors.accent }}
                    /> 
                  </motion.div> */}
                  <Link
                    href="https://www.upwork.com/freelancers/layanrusiru"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group inline-block"
                  >
                    <span>Layan R.</span>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  <span>Empowering lives through movement</span>
                </div>

                <motion.button
                  onClick={scrollToTop}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300"
                  style={{ background: `${colors.primary}10` }}
                  whileHover={{
                    scale: 1.1,
                    background: `${colors.primary}20`,
                    borderColor: `${colors.primary}40`,
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Scroll to top"
                >
                  <ArrowUp
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
