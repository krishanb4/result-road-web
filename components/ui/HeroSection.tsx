"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { motion, Variants } from "framer-motion";

// Floating animation variants with proper typing
const floatingVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-20, 20, -20],
    rotate: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatingVariants2: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [20, -20, 20],
    rotate: [5, -5, 5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

const floatingVariants3: Variants = {
  initial: { y: 0, x: 0 },
  animate: {
    y: [-15, 15, -15],
    x: [-10, 10, -10],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2,
    },
  },
};

// Text animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export function HeroSection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating shapes */}
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute -top-20 -left-20 w-96 h-96 opacity-10"
          style={{
            background: `radial-gradient(circle, ${seasonalColors.primary}40, transparent 70%)`,
          }}
        />

        <motion.div
          variants={floatingVariants2}
          initial="initial"
          animate="animate"
          className="absolute -bottom-32 -right-32 w-80 h-80 opacity-10"
          style={{
            background: `radial-gradient(circle, ${seasonalColors.primaryHover}40, transparent 70%)`,
          }}
        />

        <motion.div
          variants={floatingVariants3}
          initial="initial"
          animate="animate"
          className="absolute top-1/3 right-1/4 w-64 h-64 opacity-10"
          style={{
            background: `radial-gradient(circle, ${seasonalColors.primary}30, transparent 70%)`,
          }}
        />

        {/* Animated dots/particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              backgroundColor: seasonalColors.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient mesh overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, ${seasonalColors.primary}10 0deg, transparent 120deg, ${seasonalColors.primaryHover}10 240deg, transparent 360deg)`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight"
            >
              Empowering Through
              <motion.span
                className="block mt-2"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.span
                  className="bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Movement & Connection
                </motion.span>
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              An inclusive fitness and personal development program designed to
              support individuals living with disability and mental health
              challenges through movement, community, and confidence building.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/signup"
                  className="text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2 relative overflow-hidden group"
                  style={{
                    backgroundColor: seasonalColors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      seasonalColors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      seasonalColors.primary;
                  }}
                >
                  {/* Animated background shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.6, ease: "easeInOut" },
                    }}
                  />
                  <span className="relative z-10">Join Result Road</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.button
                variants={buttonVariants}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                {/* Animated pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
                <span>Watch Video</span>
              </motion.button>
            </motion.div>

            {/* Animated stats or features */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-8 text-slate-600 dark:text-slate-400"
            >
              {[
                { number: "247+", label: "Participants" },
                { number: "15", label: "Programs" },
                { number: "94%", label: "Satisfaction" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <motion.div
                    className="text-2xl font-bold mb-1"
                    style={{ color: seasonalColors.primary }}
                    animate={{
                      color: [
                        seasonalColors.primary,
                        seasonalColors.primaryHover,
                        seasonalColors.primary,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-1 h-3 rounded-full mt-2"
            style={{ backgroundColor: seasonalColors.primary }}
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
