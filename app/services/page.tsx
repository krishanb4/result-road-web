// app/services/page.tsx
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
  Users,
  Target,
  Heart,
  Activity,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Activity,
    title: "Personal Training",
    description:
      "One-on-one coaching tailored to individual needs and abilities.",
    features: [
      "Customized workout plans",
      "Progress tracking",
      "Adaptive equipment",
      "Flexible scheduling",
    ],
    duration: "60 minutes",
    image: "/2.jpg",
  },
  {
    icon: Users,
    title: "Group Fitness Classes",
    description: "Inclusive group sessions fostering community and motivation.",
    features: [
      "Small group settings",
      "Peer support",
      "Qualified instructors",
      "Various ability levels",
    ],
    duration: "60 minutes",
    image: "/4.jpg",
  },
  {
    icon: Heart,
    title: "Wellness Coaching",
    description: "Holistic approach to mental health and wellbeing support.",
    features: [
      "Mental health support",
      "Goal setting",
      "Lifestyle planning",
      "Stress management",
    ],
    duration: "60 minutes",
    image: "/1.jpg",
  },
  {
    icon: Target,
    title: "Specialized Programs",
    description: "Targeted programs for specific conditions and goals.",
    features: [
      "Condition-specific training",
      "Rehabilitation support",
      "Medical partnerships",
      "Evidence-based methods",
    ],
    duration: "8-12 weeks",
    image: "/3.jpg",
  },
];

const additionalServices = [
  {
    icon: Award,
    title: "Assessment & Planning",
    description:
      "Comprehensive fitness and wellness assessments to create personalized plans.",
  },
  {
    icon: Zap,
    title: "Equipment Training",
    description:
      "Learn to use adaptive fitness equipment safely and effectively.",
  },
  {
    icon: Users,
    title: "Family Support",
    description: "Programs and resources for family members and caregivers.",
  },
  {
    icon: Heart,
    title: "Community Events",
    description:
      "Regular social events and activities to build community connections.",
  },
];

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Growing Together Through Service",
      heroSubtitle:
        "Comprehensive fitness and wellness services designed to support your journey towards better health, increased confidence, and community connection - blossoming like spring itself.",
      bgOverlay: "bg-emerald-500/20",
    },
    summer: {
      heroTitle: "Energizing Your Wellness Journey",
      heroSubtitle:
        "Comprehensive fitness and wellness services designed to support your journey towards better health, increased confidence, and community connection - radiating with summer energy.",
      bgOverlay: "bg-blue-500/20",
    },
    autumn: {
      heroTitle: "Harvesting Health & Wellness",
      heroSubtitle:
        "Comprehensive fitness and wellness services designed to support your journey towards better health, increased confidence, and community connection - celebrating your achievements like autumn's harvest.",
      bgOverlay: "bg-orange-500/20",
    },
    winter: {
      heroTitle: "Warming Hearts Through Care",
      heroSubtitle:
        "Comprehensive fitness and wellness services designed to support your journey towards better health, increased confidence, and community connection - providing comfort through every season.",
      bgOverlay: "bg-slate-500/20",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function ServicesPage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const servicesRef = useRef<HTMLElement>(null);
  const additionalRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const isServicesInView = useInView(servicesRef, {
    once: true,
    margin: "-100px",
  });
  const isAdditionalInView = useInView(additionalRef, {
    once: true,
    margin: "-100px",
  });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const seasonalContent = getSeasonalContent(currentSeason);

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
            src="/6.jpg"
            alt="Result Road services background"
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
                {currentSeason} Services
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

      {/* Main Services */}
      <section
        ref={servicesRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Core Services
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Professional services tailored to meet diverse needs and
              abilities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isServicesInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: seasonalColors.primary }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                      style={{ backgroundColor: `${seasonalColors.primary}90` }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      {service.title}
                    </h3>
                    <div className="text-right">
                      <div
                        className="text-lg font-semibold px-3 py-1 rounded-full text-white text-sm"
                        style={{ backgroundColor: seasonalColors.primary }}
                      >
                        Enquire for Bookings
                      </div>
                      <div
                        className="text-sm mt-1 flex items-center justify-end space-x-1"
                        style={{ color: seasonalColors.textMuted }}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: seasonalColors.textSecondary }}
                  >
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isServicesInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{
                          delay: index * 0.1 + featureIndex * 0.05 + 0.3,
                          duration: 0.4,
                        }}
                      >
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: seasonalColors.primary }}
                        />
                        <span style={{ color: seasonalColors.textPrimary }}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto"
                  >
                    <Link
                      href="/contact"
                      className="w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 text-white group"
                      style={{ backgroundColor: seasonalColors.primary }}
                    >
                      <span>Book Consultation</span>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section
        ref={additionalRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isAdditionalInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Additional Support
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Comprehensive support services to enhance your Result Road
              experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isAdditionalInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.1, duration: 0.6 }}
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
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </motion.div>

                <h3
                  className="text-xl font-bold mb-4 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {service.title}
                </h3>

                <p
                  className="leading-relaxed relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {service.description}
                </p>
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
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss which services are right for you and
              book your consultation.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="bg-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-2xl group"
                style={{ color: seasonalColors.primary }}
              >
                <span>Contact Us Today</span>
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
