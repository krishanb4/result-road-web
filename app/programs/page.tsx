// app/programs/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import {
  useSeasonalTheme,
  useSeasonalColors,
} from "../../components/ui/SeasonalThemeContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Heart,
  Activity,
  Award,
  Star,
  User,
  UserCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const programFormats = [
  {
    icon: User,
    title: "Solo Format",
    description:
      "Personalised 10-week program at your own pace with individualised plans tailored to your goals and fitness level.",
    features: [
      "Self-paced progression",
      "Individualised plans",
      "Personal focus",
      "Flexible scheduling",
    ],
  },
  {
    icon: Users,
    title: "Team Format",
    description:
      "Structured 10-week program in a class setting led by an instructor with group motivation and camaraderie.",
    features: [
      "Group motivation",
      "Instructor guidance",
      "Collaborative environment",
      "Shared progress",
    ],
  },
];

const programLevels = [
  {
    level: "Entry Level",
    description:
      "Ideal for the beginner that is at the most basic level. The focus is just to start at a very basic start point and build strength and coordination one step at a time.",
    color: "#10b981",
  },
  {
    level: "Moderate Level",
    description:
      "A step up from Entry Level. This level takes off gradually where Entry Level left off. A great achievement from anyone on the rise up.",
    color: "#f59e0b",
  },
  {
    level: "Advanced Level",
    description:
      "Tailored for those capable of challenging themselves beyond Moderate Level. This is for those that have strengthened their ability to push to the top level.",
    color: "#ef4444",
  },
];

const soloPrograms = [
  {
    title: "Balance and Flow",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Progressive program designed to enhance stability, flexibility and balance. Builds core strength and body awareness.",
    outcomes: [
      "Improved core strength",
      "Enhanced flexibility",
      "Better balance",
      "Increased confidence",
    ],
    image: "/1.jpg",
    featured: false,
  },
  {
    title: "Strength and Stability",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Focus on building foundational muscle strength while maintaining and improving stability through progressive exercises.",
    outcomes: [
      "Increased muscle tone",
      "Better posture",
      "Stronger core",
      "Enhanced coordination",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Power and Endurance",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Combines strength training with cardiovascular conditioning to build explosive power and enhance endurance.",
    outcomes: [
      "Increased stamina",
      "Improved cardiovascular health",
      "Greater athletic performance",
      "Enhanced power",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Agility and Speed",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Enhances quickness, coordination and overall athleticism through drills focusing on reaction time, footwork and speed.",
    outcomes: [
      "Enhanced agility",
      "Faster movement",
      "Improved coordination",
      "Greater athletic confidence",
    ],
    image: "/4.jpg",
    featured: false,
  },
  {
    title: "Core and Upper Body Sculpt",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Focused on building a strong, stable core and enhancing upper body strength through progressive sculpting exercises.",
    outcomes: [
      "Improved posture",
      "Enhanced upper body strength",
      "Stable powerful core",
      "Defined muscle tone",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Total Body Master",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Advanced program bringing together all elements of fitness - strength, endurance, agility and flexibility.",
    outcomes: [
      "Complete fitness mastery",
      "Enhanced strength",
      "Improved agility",
      "Better balance",
    ],
    image: "/1.jpg",
    featured: false,
  },
  {
    title: "Bodyweight Beast",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Dynamic calisthenics program using only bodyweight to build impressive strength, flexibility and endurance.",
    outcomes: [
      "Enhanced control",
      "Increased power",
      "Master bodyweight movements",
      "Improved flexibility",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Zen Stretch",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo & Team",
    description:
      "Calming program enhancing flexibility and reducing stress through gentle yoga flows and mindful stretching.",
    outcomes: [
      "Improved flexibility",
      "Reduced stress",
      "Enhanced mobility",
      "Inner peace",
    ],
    image: "/4.jpg",
    featured: false,
  },
];

const teamPrograms = [
  {
    title: "Rhythm and Motion",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Exciting dance and movement program combining different dance styles and creative movement exercises.",
    outcomes: [
      "Improved coordination",
      "Enhanced cardiovascular health",
      "Better rhythm",
      "Renewed love for movement",
    ],
    image: "/1.jpg",
    featured: false,
  },
  {
    title: "BoxCamp",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Fun and energetic team boxing class with punching bags, basic techniques and engaging fitness games.",
    outcomes: [
      "Increased confidence",
      "Great workout",
      "Basic boxing skills",
      "Team camaraderie",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Kick Blast",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Exhilarating class combining kickboxing fundamentals with fun, engaging workouts and basic techniques.",
    outcomes: [
      "Enhanced fitness",
      "Kickboxing skills",
      "Increased confidence",
      "Great workout experience",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Wrestle Time",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Engaging class introducing wrestling fundamentals in a fun, supportive, no-contact team environment.",
    outcomes: [
      "Improved strength",
      "Enhanced agility",
      "Wrestling basics",
      "Increased confidence",
    ],
    image: "/4.jpg",
    featured: false,
  },
  {
    title: "Kick Punch and Wrestle",
    levels: ["Moderate"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Intensive program with dynamic rotation of boxing, kickboxing, and wrestling. Designed for those who thrive with structure.",
    outcomes: [
      "Enhanced discipline",
      "Physical fitness",
      "Self-confidence",
      "Personal growth",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Fun and Fit",
    levels: ["Entry", "Moderate"],
    duration: "10 weeks",
    format: "Team",
    description:
      "High-energy, game-based program with fun activities making fitness feel like a party for all ages and abilities.",
    outcomes: [
      "Active lifestyle",
      "Improved coordination",
      "Fitness enjoyment",
      "Social connection",
    ],
    image: "/1.jpg",
    featured: false,
  },
];

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Growing Through Structured Programs",
      heroSubtitle:
        "Structured, evidence-based 10-week programs designed to build strength, coordination, and confidence for participants of all ability levels. Like spring's growth, choose between Solo and Team formats to flourish.",
      bgOverlay: "bg-emerald-500/20",
    },
    summer: {
      heroTitle: "Energizing Fitness Programs",
      heroSubtitle:
        "Structured, evidence-based 10-week programs designed to build strength, coordination, and confidence for participants of all ability levels. Harness summer's energy with Solo and Team formats.",
      bgOverlay: "bg-blue-500/20",
    },
    autumn: {
      heroTitle: "Harvesting Strength Programs",
      heroSubtitle:
        "Structured, evidence-based 10-week programs designed to build strength, coordination, and confidence for participants of all ability levels. Reap the rewards with Solo and Team formats.",
      bgOverlay: "bg-orange-500/20",
    },
    winter: {
      heroTitle: "Warming Up Through Programs",
      heroSubtitle:
        "Structured, evidence-based 10-week programs designed to build strength, coordination, and confidence for participants of all ability levels. Stay warm and active with Solo and Team formats.",
      bgOverlay: "bg-slate-500/20",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function ProgramsPage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const formatsRef = useRef<HTMLElement>(null);
  const levelsRef = useRef<HTMLElement>(null);
  const soloRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const isFormatsInView = useInView(formatsRef, {
    once: true,
    margin: "-100px",
  });
  const isLevelsInView = useInView(levelsRef, { once: true, margin: "-100px" });
  const isSoloInView = useInView(soloRef, { once: true, margin: "-100px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const seasonalContent = getSeasonalContent(currentSeason);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "#10b981";
      case "Moderate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return seasonalColors.primary;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: seasonalColors.background }}
    >
      <Navigation />

      {/* Hero Section with Seasonal Background */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/7.jpg"
            alt="Result Road programs background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Seasonal Overlay */}
          <div
            className={`absolute inset-0 ${seasonalContent.bgOverlay}`}
          ></div>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>

        {/* Seasonal Decorations */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: seasonalColors.primary }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 opacity-30"
          style={{
            backgroundColor: seasonalColors.accent,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Seasonal Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-white/30"
              style={{ background: `${seasonalColors.primary}20` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Activity className="w-4 h-4 text-white" />
              <span className="font-semibold text-white capitalize">
                {currentSeason} Programs
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {seasonalContent.heroTitle}
            </motion.h1>

            <motion.p
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {seasonalContent.heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Program Formats */}
      <section
        ref={formatsRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isFormatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Program Formats
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Choose the format that best suits your learning style and
              preferences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {programFormats.map((format, index) => (
              <motion.div
                key={index}
                className="rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isFormatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${seasonalColors.primary}, transparent 70%)`,
                  }}
                />

                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <format.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </motion.div>

                <h3
                  className="text-2xl font-bold mb-4 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {format.title}
                </h3>

                <p
                  className="mb-6 leading-relaxed relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {format.description}
                </p>

                <div className="space-y-3 relative z-10">
                  {format.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isFormatsInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{
                        delay: index * 0.2 + featureIndex * 0.1 + 0.3,
                        duration: 0.4,
                      }}
                    >
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span style={{ color: seasonalColors.textSecondary }}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Levels */}
      <section
        ref={levelsRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isLevelsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Program Levels
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              We assess each participant to guide them to the level that best
              suits their current abilities and goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programLevels.map((level, index) => (
              <motion.div
                key={index}
                className="rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isLevelsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${level.color}, transparent)`,
                  }}
                />

                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10"
                  style={{ backgroundColor: `${level.color}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-8 h-8" style={{ color: level.color }} />
                </motion.div>

                <h3
                  className="text-xl font-bold mb-4 relative z-10"
                  style={{ color: level.color }}
                >
                  {level.level}
                </h3>

                <p
                  className="leading-relaxed relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {level.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solo Programs */}
      <section
        ref={soloRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isSoloInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Solo Programs
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Personalised programs that allow you to progress at your own pace
              with individualised plans.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {soloPrograms.map((program, index) => (
              <motion.div
                key={index}
                className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSoloInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {program.featured && (
                  <motion.div
                    className="px-6 py-2 text-white text-sm font-semibold flex items-center justify-center space-x-2 flex-shrink-0"
                    style={{ backgroundColor: seasonalColors.primary }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Popular Program</span>
                  </motion.div>
                )}

                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: seasonalColors.primary }}
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                        style={{
                          backgroundColor: `${seasonalColors.primary}CC`,
                        }}
                      >
                        {program.format}
                      </span>
                      <span className="text-white font-semibold">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    {program.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.levels.map((level, levelIndex) => (
                      <span
                        key={levelIndex}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getLevelColor(level) }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>

                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: seasonalColors.textSecondary }}
                  >
                    {program.description}
                  </p>

                  <div className="space-y-6 flex-grow">
                    <div>
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: seasonalColors.textPrimary }}
                      >
                        Expected Outcomes:
                      </h4>
                      <div className="space-y-2">
                        {program.outcomes.map((outcome, outIndex) => (
                          <motion.div
                            key={outIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isSoloInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{
                              delay: index * 0.1 + outIndex * 0.05 + 0.8,
                              duration: 0.4,
                            }}
                          >
                            <Target
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: seasonalColors.primary }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: seasonalColors.textSecondary }}
                            >
                              {outcome}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-8 pt-6 flex-shrink-0"
                    style={{
                      borderTop: `1px solid ${seasonalColors.textMuted}30`,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/signup"
                        className="w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 text-white group"
                        style={{ backgroundColor: seasonalColors.primary }}
                      >
                        <span>Enroll Now</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Programs */}
      <section
        ref={teamRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Team Programs
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Structured group programs led by instructors, emphasizing
              collaboration, encouragement and shared progress.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {teamPrograms.map((program, index) => (
              <motion.div
                key={index}
                className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {program.featured && (
                  <motion.div
                    className="px-6 py-2 text-white text-sm font-semibold flex items-center justify-center space-x-2 flex-shrink-0"
                    style={{ backgroundColor: seasonalColors.primary }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Popular Program</span>
                  </motion.div>
                )}

                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: seasonalColors.primary }}
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                        style={{
                          backgroundColor: `${seasonalColors.primary}CC`,
                        }}
                      >
                        {program.format}
                      </span>
                      <span className="text-white font-semibold">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    {program.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.levels.map((level, levelIndex) => (
                      <span
                        key={levelIndex}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getLevelColor(level) }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>

                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: seasonalColors.textSecondary }}
                  >
                    {program.description}
                  </p>

                  <div className="space-y-6 flex-grow">
                    <div>
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: seasonalColors.textPrimary }}
                      >
                        Expected Outcomes:
                      </h4>
                      <div className="space-y-2">
                        {program.outcomes.map((outcome, outIndex) => (
                          <motion.div
                            key={outIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isTeamInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{
                              delay: index * 0.1 + outIndex * 0.05 + 0.8,
                              duration: 0.4,
                            }}
                          >
                            <Target
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: seasonalColors.primary }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: seasonalColors.textSecondary }}
                            >
                              {outcome}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-8 pt-6 flex-shrink-0"
                    style={{
                      borderTop: `1px solid ${seasonalColors.textMuted}30`,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/contact"
                        className="w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 text-white group"
                        style={{ backgroundColor: seasonalColors.primary }}
                      >
                        <span>Enroll Now</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
        }}
      >
        {/* Background decorations */}
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: "white" }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center bg-white/20 backdrop-blur-sm"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join a Program?
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We assess each participant to help guide them to the program and
              level that best suits their current abilities and goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="bg-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl group"
                  style={{ color: seasonalColors.primary }}
                >
                  <span>Contact Us</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm hover:bg-white group"
                  style={{
                    borderColor: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <span>Learn More</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
