// app/about/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import {
  useSeasonalTheme,
  useSeasonalColors,
} from "../../components/ui/SeasonalThemeContext";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  CheckCircle,
  Award,
  Users,
  Target,
  Heart,
  Activity,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

const getSeasonalTeamMembers = (season: string) => {
  const baseMembers = [
    {
      name: "Nathan",
      role: "",
      shortBio:
        "Nathan is a seasoned professional with extensive experience in both the professional sports world and community programs. With a passion for helping individuals overcome challenges, Nathan has dedicated his career to developing successful programs.",
      fullBio:
        "Nathan is a seasoned professional with extensive experience in both the professional sports world and community programs. With a passion for helping individuals overcome challenges, Nathan has dedicated his career to developing successful programs that support individuals with behavioral and developmental disabilities as well as people in the community that have seeked Nathan's help to address all kinds of goals from physical, to health and especially training goals. His work with Result Road reflects his commitment to inclusivity, empowerment and creating opportunities for everyone to thrive. Through his leadership, Result Road has become a beacon of positive change, transforming lives and fostering a sense of community.",
      image: "/team/nathan.jpg",
    },
    {
      name: "Liz",
      role: "",
      shortBio:
        "Liz is a dedicated and highly skilled behavior therapist with a passion for helping individuals achieve their fullest potential. With years of experience in behavior therapy, Liz brings a wealth of knowledge and compassion to Result Road.",
      fullBio:
        "Liz is a dedicated and highly skilled behavior therapist with a passion for helping individuals achieve their fullest potential. With years of experience in behavior therapy, Liz brings a wealth of knowledge and compassion to Result Road. Her expertise lies in creating personalized, evidence based strategies that empower individuals to overcome challenges and thrive in their daily lives.At Result Road Liz plays a pivotal role in shaping our programs to ensure they are inclusive, supportive and effective for participants of all abilities. Her commitment to fostering a positive and encouraging environment aligns perfectly with Result Road's mission to create a community where everyone can succeed. Whether she's working one on one with clients or developing new program initiatives Liz's dedication to her work is evident in every aspect of her practice.Join us at Result Road and experience the difference that compassionate, expert care can make, guided by professionals like Liz who are committed to making a positive impact.",
      image: "/team/liz.jpg",
    },
    {
      name: "Sean",
      role: "",
      shortBio:
        "With extensive experience as a Coordinator of Supports for some of the industry's leading companies, Sean brings a wealth of knowledge and a strong reputation to Result Road in his role as Business Development Manager.",
      fullBio:
        "With extensive experience as a Coordinator of Supports for some of the industry's leading companies, Sean brings a wealth of knowledge and a strong reputation to Result Road in his role. Known for his dedication and expertise, Sean has built a career on creating impactful, person centered support solutions. At Result Road Sean steps into the role of Business Development Manager, where he will leverage his industry insights and connections to help guide the organization towards growth and success. Sean is passionate about making a difference and is committed to ensuring that Result Road continues to be a leader in providing exceptional support services.",
      image: "/team/sean.jpg",
    },
  ];

  const seasonalTitles = {
    spring: {
      suffix: " ",
      focus: "",
    },
    summer: {
      suffix: "",
      focus: "",
    },
    autumn: {
      suffix: "",
      focus: "",
    },
    winter: {
      suffix: "",
      focus: "",
    },
  };

  return baseMembers.map((member) => ({
    ...member,
    seasonalRole:
      member.role +
      (seasonalTitles[season as keyof typeof seasonalTitles]?.suffix || ""),
    seasonalFocus:
      seasonalTitles[season as keyof typeof seasonalTitles]?.focus ||
      "community wellness",
  }));
};

const getSeasonalValues = (season: string, colors: any) => {
  const baseValues = [
    {
      icon: Heart,
      title: "Inclusivity",
      description:
        "We believe everyone deserves access to fitness and wellness opportunities regardless of ability.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building strong, supportive networks that extend beyond our programs.",
    },
    {
      icon: Target,
      title: "Growth",
      description:
        "Fostering personal development through achievable goals and celebrating progress.",
    },
    {
      icon: Activity,
      title: "Excellence",
      description:
        "Maintaining high standards in program delivery and participant support.",
    },
  ];

  const seasonalEnhancements = {
    spring: {
      inclusivity:
        "Like spring flowers, we help everyone bloom at their own pace",
      community: "Growing together like a flourishing garden community",
      growth:
        "Nurturing new beginnings and fresh opportunities for development",
      excellence:
        "Cultivating the highest standards like tending a perfect garden",
    },
    summer: {
      inclusivity:
        "Bringing summer warmth and energy to everyone's fitness journey",
      community:
        "Creating vibrant, sun-filled connections that energize and inspire",
      growth:
        "Harnessing summer's peak energy for maximum personal development",
      excellence:
        "Shining bright with our commitment to outstanding program delivery",
    },
    autumn: {
      inclusivity:
        "Harvesting the benefits of diverse perspectives and abilities",
      community:
        "Gathering together like autumn leaves, each unique and valuable",
      growth: "Reaping the rewards of hard work and celebrating achievements",
      excellence:
        "Like autumn's rich colors, our programs are deep and meaningful",
    },
    winter: {
      inclusivity: "Providing warmth and welcome when the world feels cold",
      community: "Creating cozy connections that sustain us through any season",
      growth: "Finding strength and resilience even in quiet, reflective times",
      excellence:
        "Like winter's pure snow, our commitment remains pristine and unwavering",
    },
  };

  const seasonalDescs =
    seasonalEnhancements[season as keyof typeof seasonalEnhancements];

  return baseValues.map((value, index) => ({
    ...value,
    description: seasonalDescs
      ? Object.values(seasonalDescs)[index]
      : value.description,
  }));
};

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Growing Together at Result Road",
      heroSubtitle:
        "Like spring's renewal, we help you bloom and flourish in your wellness journey",
      missionTitle: "Our Spring Mission",
      mission:
        "At Result Road, our mission blooms like spring itself - empowering individuals and families by creating an inclusive, supportive hub that connects participants, their families, service providers and fitness partners. We run and oversee specialised fitness programs throughout the year, ensuring that each session is designed to foster growth, well-being and a sense of community that flourishes in every season.",
      stats: [
        "247+ participants growing strong",
        "15 specialized programs blooming",
        "8 facilities rooted in the region",
        "94% participant satisfaction flourishing",
      ],
      bgOverlay: "bg-green-500/20",
    },
    summer: {
      heroTitle: "Energizing Lives at Result Road",
      heroSubtitle:
        "Bringing summer's vibrant energy to your fitness and wellness journey",
      missionTitle: "Our Summer Mission",
      mission:
        "At Result Road, our mission radiates with summer energy - empowering individuals and families by creating an inclusive, supportive hub that connects participants, their families, service providers and fitness partners. We run and oversee specialised fitness programs throughout the year, ensuring that each session is designed to foster growth, well-being and a sense of community that thrives with vitality.",
      stats: [
        "247+ participants energized and active",
        "15 specialized programs shining bright",
        "8 facilities lighting up the region",
        "94% participant satisfaction glowing",
      ],
      bgOverlay: "bg-yellow-500/20",
    },
    autumn: {
      heroTitle: "Harvesting Success at Result Road",
      heroSubtitle:
        "Reaping the rewards of dedication, community, and wellness transformation",
      missionTitle: "Our Autumn Mission",
      mission:
        "At Result Road, our mission is like autumn's harvest - empowering individuals and families by creating an inclusive, supportive hub that connects participants, their families, service providers and fitness partners. We run and oversee specialised fitness programs throughout the year, ensuring that each session is designed to foster growth, well-being and a sense of community that celebrates every achievement.",
      stats: [
        "247+ participants harvesting success",
        "15 specialized programs bearing fruit",
        "8 facilities rooted across the region",
        "94% participant satisfaction ripening",
      ],
      bgOverlay: "bg-orange-500/20",
    },
    winter: {
      heroTitle: "Warming Hearts at Result Road",
      heroSubtitle:
        "Creating warmth, connection, and wellness through every season",
      missionTitle: "Our Winter Mission",
      mission:
        "At Result Road, our mission provides warmth like a winter hearth - empowering individuals and families by creating an inclusive, supportive hub that connects participants, their families, service providers and fitness partners. We run and oversee specialised fitness programs throughout the year, ensuring that each session is designed to foster growth, well-being and a sense of community that keeps spirits bright.",
      stats: [
        "247+ participants staying warm and active",
        "15 specialized programs glowing bright",
        "8 facilities providing shelter and strength",
        "94% participant satisfaction warming hearts",
      ],
      bgOverlay: "bg-blue-500/20",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function AboutPage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const missionRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  // State for managing expanded bios
  const [expandedBios, setExpandedBios] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleBio = (index: number) => {
    setExpandedBios((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isMissionInView = useInView(missionRef, {
    once: true,
    margin: "-100px",
  });
  const isValuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });

  const seasonalContent = getSeasonalContent(currentSeason);
  const seasonalValues = getSeasonalValues(currentSeason, seasonalColors);
  const seasonalTeamMembers = getSeasonalTeamMembers(currentSeason);

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
            src="/5.jpg"
            alt="Result Road background"
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
          className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20"
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
          className="absolute bottom-20 right-20 w-24 h-24 opacity-30"
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
              <Sparkles className="w-4 h-4 text-white" />
              <span className="font-semibold text-white capitalize">
                {currentSeason} at Result Road
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-8"
            >
              <motion.a
                href="/services"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
                }}
              >
                <span className="relative z-10">Discover Our Story</span>
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
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision with Seasonal Theming */}
      <section
        ref={missionRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={
                isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="text-4xl font-bold mb-8"
                style={{ color: seasonalColors.textPrimary }}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {seasonalContent.missionTitle}
              </motion.h2>

              <motion.p
                className="text-lg mb-6 leading-relaxed"
                style={{ color: seasonalColors.textSecondary }}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {seasonalContent.mission}
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {seasonalContent.stats.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isMissionInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
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
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: seasonalColors.primary }}
                      />
                    </motion.div>
                    <span
                      className="font-medium"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={
                isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src="/1.jpg"
                  alt="Result Road community in action"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Seasonal overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-20"
                  style={{ backgroundColor: seasonalColors.primary }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values with Seasonal Theming */}
      <section
        ref={valuesRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Our{" "}
              {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}{" "}
              Values
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              The principles that guide everything we do at Result Road,
              enhanced by the spirit of {currentSeason}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seasonalValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  style={{ backgroundColor: seasonalColors.cardBackground }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isValuesInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 50 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  {/* Background animation */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
                    }}
                  />

                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                    style={{ backgroundColor: `${seasonalColors.primary}20` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: seasonalColors.primary }}
                    />
                  </motion.div>

                  <h3
                    className="text-xl font-bold mb-4 relative z-10"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    {value.title}
                  </h3>

                  <p
                    className="leading-relaxed relative z-10"
                    style={{ color: seasonalColors.textSecondary }}
                  >
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team with Seasonal Theming */}
      <section
        ref={teamRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
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
              Meet Our{" "}
              {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}{" "}
              Team
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Passionate professionals dedicated to making a difference in our
              community, bringing the warmth and energy of {currentSeason} to
              everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {seasonalTeamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${seasonalColors.primary}, transparent 70%)`,
                  }}
                />

                <motion.div
                  className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden"
                  style={{
                    border: `4px solid ${seasonalColors.primary}30`,
                    boxShadow: `0 0 0 2px ${seasonalColors.primary}20`,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </motion.div>

                <h3
                  className="text-xl font-bold mb-2 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {member.name}
                </h3>

                <p
                  className="font-semibold mb-4 relative z-10"
                  style={{ color: seasonalColors.primary }}
                >
                  {member.seasonalRole}
                </p>

                {/* Bio content with flex-grow to push button to bottom */}
                <div className="flex-grow flex flex-col justify-between relative z-10">
                  <motion.p
                    className="leading-relaxed mb-6"
                    style={{ color: seasonalColors.textSecondary }}
                    initial={false}
                    animate={{ opacity: 1 }}
                  >
                    {expandedBios[index] ? member.fullBio : member.shortBio}
                  </motion.p>

                  {/* Button positioned consistently at bottom */}
                  <motion.button
                    onClick={() => toggleBio(index)}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md self-center"
                    style={{
                      backgroundColor: `${seasonalColors.primary}20`,
                      color: seasonalColors.primary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>
                      {expandedBios[index] ? "Show Less" : "Load More"}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedBios[index] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedBios[index] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
