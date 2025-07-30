"use client";

import React, { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Zap,
  Shield,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const features = [
  {
    icon: Heart,
    title: "Inclusive Environment",
    description:
      "A welcoming space designed for all abilities and backgrounds, fostering acceptance and growth.",
    benefits: [
      "Non-judgmental atmosphere",
      "Adaptive equipment",
      "Supportive community",
    ],
    color: "red",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description:
      "Qualified coaches with lived experience provide personalized support and motivation.",
    benefits: [
      "Certified trainers",
      "Individual attention",
      "Progress tracking",
    ],
    color: "blue",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description:
      "Structured programs designed to help you reach your personal fitness and wellness goals.",
    benefits: [
      "Customized plans",
      "Measurable outcomes",
      "Milestone celebrations",
    ],
    color: "green",
  },
  {
    icon: Zap,
    title: "Flexible Scheduling",
    description:
      "Choose from multiple time slots and program options that fit your lifestyle and commitments.",
    benefits: [
      "Morning & evening classes",
      "Weekend options",
      "Make-up sessions",
    ],
    color: "yellow",
  },
  {
    icon: Shield,
    title: "Safe & Supportive",
    description:
      "Priority on safety with proper equipment, trained staff, and emergency protocols.",
    benefits: [
      "Safety-first approach",
      "Emergency protocols",
      "Insurance coverage",
    ],
    color: "purple",
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "Join hundreds of participants who have achieved their fitness and confidence goals.",
    benefits: [
      "94% satisfaction rate",
      "Documented progress",
      "Success stories",
    ],
    color: "orange",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    // ✅ No transition here!
  },
};

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const colors = useSeasonalColors();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.6, ease: "easeOut" }} // ✅ Add it here
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <div className="relative h-full p-8 rounded-3xl border border-white/20 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
            }}
          />
        </div>

        {/* Floating sparkle */}
        <motion.div
          className="absolute top-6 right-6"
          animate={{
            y: [-2, 2, -2],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              border: `2px solid ${colors.primary}20`,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 },
            }}
          >
            <Icon className="w-8 h-8" style={{ color: colors.primary }} />

            {/* Icon glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: `${colors.primary}20` }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
            whileHover={{
              color: colors.primary,
              transition: { duration: 0.3 },
            }}
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {feature.description}
          </p>

          {/* Benefits */}
          <motion.div className="space-y-3 mb-6">
            {feature.benefits.map((benefit, benefitIndex) => (
              <motion.div
                key={benefitIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{
                  delay: 0.5 + benefitIndex * 0.1,
                  duration: 0.4,
                }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: benefitIndex * 0.2,
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Learn more link */}
          <motion.div
            className="flex items-center space-x-2 text-sm font-medium cursor-pointer group/link"
            style={{ color: colors.primary }}
            whileHover={{ x: 4 }}
          >
            <span>Learn more</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  const seasonalContent = {
    spring: {
      title: "Grow with Spring",
      subtitle: "Fresh opportunities for growth and renewal",
      description:
        "Like nature's awakening, discover new possibilities for your health and wellness journey this spring.",
    },
    summer: {
      title: "Summer Energy",
      subtitle: "High-energy programs for active lifestyles",
      description:
        "Embrace the vibrant energy of summer with our dynamic fitness programs designed to keep you motivated.",
    },
    autumn: {
      title: "Harvest Success",
      subtitle: "Reap the rewards of consistent effort",
      description:
        "Build lasting habits and see the fruits of your dedication with our structured autumn programs.",
    },
    winter: {
      title: "Winter Wellness",
      subtitle: "Stay strong through the winter months",
      description:
        "Maintain your momentum with our cozy indoor programs designed for the winter season.",
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
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-6 backdrop-blur-sm border border-white/20"
            style={{ background: `${colors.primary}10` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Why Choose Result Road
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{ color: colors.textPrimary }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {content.title}
          </motion.h2>

          <motion.h3
            className="text-2xl md:text-3xl font-semibold mb-4"
            style={{ color: colors.secondary }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {content.subtitle}
          </motion.h3>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-20"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            href="/services"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <span className="relative z-10">Explore All Features</span>
            <motion.div
              className="relative z-10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
