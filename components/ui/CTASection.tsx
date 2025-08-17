"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Award,
  Heart,
  Sparkles,
  Play,
  CheckCircle,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const quickStats = [
  {
    icon: Users,
    number: "247+",
    label: "Active Members",
    description: "Join our growing community",
  },
  {
    icon: Star,
    number: "4.9",
    label: "Average Rating",
    description: "Consistently excellent service",
  },
  {
    icon: Award,
    number: "94%",
    label: "Success Rate",
    description: "Participants achieve their goals",
  },
];

const ctaOptions = [
  // {
  //   icon: Calendar,
  //   title: "Book Free Consultation",
  //   description:
  //     "Meet with our team to discuss your goals and find the perfect program",
  //   action: "Schedule Now",
  //   href: "/contact",
  //   primary: true,
  // },
  {
    icon: User,
    title: "Join Our Community",
    description: "Start your journey with our welcoming, supportive community",
    action: "Register Today",
    href: "/register",
    primary: false,
  },
  // {
  //   icon: Phone,
  //   title: "Call Us Direct",
  //   description:
  //     "Speak with our team immediately about programs and availability",
  //   action: "0456 194 251",
  //   href: "tel:0456194251",
  //   primary: false,
  // },
];

// const benefits = [
//   // "No long-term contracts required",
//   // "Free initial consultation",
//   // "Flexible scheduling options",
//   // "Adaptive equipment provided",
//   // "Qualified, experienced coaches",
//   // "Supportive community environment",
// ];

export function CTASection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const rotateX = useTransform(smoothMouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const seasonalContent = {
    spring: {
      title: "Bloom Into Your Best Self",
      subtitle: "Start Your Spring Transformation",
      description:
        "Spring is the season of new beginnings. Let Result Road help you plant the seeds for a healthier, more confident you.",
      urgency: "Spring programs filling fast!",
      specialOffer: "",
      backgroundEmoji: "🌸🌱🦋",
      theme: "renewal and growth",
    },
    summer: {
      title: "Dive Into Summer Fitness",
      subtitle: "Make This Summer Count",
      description:
        "Don't let summer pass you by. Join our high-energy programs and make the most of the season with confidence and strength.",
      urgency: "Summer sessions starting soon!",
      specialOffer: "Beat the heat with our climate-controlled facilities",
      backgroundEmoji: "☀️🏖️🏄‍♀️",
      theme: "energy and vitality",
    },
    autumn: {
      title: "Harvest Your Potential",
      subtitle: "Fall Into Fitness Excellence",
      description:
        "As autumn brings change, transform your health and wellness. Build lasting habits that will carry you through the seasons.",
      urgency: "Autumn programs now enrolling!",
      specialOffer: "Enroll now and lock in 2024 pricing",
      backgroundEmoji: "🍂🎃🌾",
      theme: "transformation and dedication",
    },
    winter: {
      title: "Stay Strong This Winter",
      subtitle: "Warm Up Your Wellness Journey",
      description:
        "Don't hibernate this winter. Join our cozy community and keep your fitness journey going strong through the colder months.",
      urgency: "Winter programs available now!",
      specialOffer: "Stay warm with heated facilities and hot beverages",
      backgroundEmoji: "❄️⛄🏔️",
      theme: "warmth and community",
    },
  };

  const content = seasonalContent[currentSeason];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ background: colors.background }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background elements */}
        {/* {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              rotate: [-10, 10, -10],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            {content.backgroundEmoji[Math.floor(Math.random() * 3)]}
          </motion.div>
        ))} */}

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, ${colors.secondary})`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 opacity-5"
          style={{
            background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})`,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="text-center mb-20"
        >
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-white/20"
            style={{
              background: `${colors.accent}20`,
              borderColor: `${colors.accent}40`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            </motion.div>
            <span className="font-semibold" style={{ color: colors.accent }}>
              {content.urgency}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ color: colors.textPrimary }}
          >
            {content.title.split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-4"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
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

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: colors.secondary }}
          >
            {content.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            {content.description}
          </motion.p>

          {/* Special Offer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ delay: 1.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl mb-12 backdrop-blur-xl border border-white/20"
            style={{ background: `${colors.primary}15` }}
          >
            <Star className="w-5 h-5" style={{ color: colors.primary }} />
            <span className="font-semibold text-gray-800 dark:text-white">
              {content.specialOffer}
            </span>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center p-8 rounded-3xl backdrop-blur-xl border border-white/20 relative overflow-hidden group"
                style={{ background: `${colors.primary}08` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                />

                <motion.div
                  className="relative z-10"
                  animate={{
                    y: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div
                    className="text-4xl font-bold mb-2"
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

                  <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {stat.label}
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {ctaOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ delay: 2.2 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative group"
              >
                <Link
                  href={option.href}
                  className={`block p-8 rounded-3xl backdrop-blur-xl border border-white/20 text-center transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden`}
                  style={{
                    background: option.primary
                      ? `${colors.primary}15`
                      : `${colors.primary}08`,
                    boxShadow: option.primary
                      ? `0 0 0 2px ${colors.primary}`
                      : "none",
                  }}
                >
                  {/* Background effect for primary CTA */}
                  {option.primary && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      }}
                    />
                  )}

                  {/* Sparkle for primary CTA */}
                  {option.primary && (
                    <motion.div
                      className="absolute top-6 right-6"
                      animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles
                        className="w-6 h-6"
                        style={{ color: colors.accent }}
                      />
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                        option.primary ? "" : ""
                      }`}
                      style={{
                        background: option.primary
                          ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                          : `${colors.primary}20`,
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: option.primary ? 5 : 0,
                      }}
                    >
                      <Icon
                        className="w-10 h-10"
                        style={{
                          color: option.primary ? "white" : colors.primary,
                        }}
                      />
                    </motion.div>

                    <h3
                      className={`text-2xl font-bold mb-4 ${
                        option.primary
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {option.description}
                    </p>

                    <motion.div
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        option.primary ? "text-white shadow-lg" : "border-2"
                      }`}
                      style={{
                        background: option.primary
                          ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                          : "transparent",
                        borderColor: option.primary
                          ? "transparent"
                          : colors.primary,
                        color: option.primary ? "white" : colors.primary,
                      }}
                      whileHover={{
                        scale: 1.05,
                        background: option.primary
                          ? `linear-gradient(135deg, ${colors.primaryHover}, ${colors.secondary})`
                          : `${colors.primary}10`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{option.action}</span>
                      {option.title !== "Call Us Direct" && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits List */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What You Get When You Join
          </h3>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-sm border border-white/10"
                style={{ background: `${colors.primary}05` }}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ delay: 3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                >
                  <CheckCircle
                    className="w-6 h-6 flex-shrink-0"
                    style={{ color: colors.primary }}
                  />
                </motion.div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div> 
        </motion.div> */}

        {/* Final Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            {/* <motion.a
              href="tel:0456194251"
              className="flex items-center space-x-2 text-lg font-medium"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="w-5 h-5" />
              <span>0456 194 251</span>
            </motion.a> */}
            <motion.a
              href="mailto:nath@boxcamp.page"
              className="flex items-center space-x-2 text-lg font-medium"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="w-5 h-5" />
              <span>hello@resultroad.com.au</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
