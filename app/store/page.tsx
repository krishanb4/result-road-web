// app/store/page.tsx
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
  ShoppingCart,
  Star,
  Heart,
  Package,
  Truck,
  Shield,
  Gift,
  ArrowRight,
  Sparkles,
  Clock,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const storeFeatures = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $150 within Australia",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% satisfaction guarantee on all products",
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "Proceeds support Result Road programs and participants",
  },
  {
    icon: Gift,
    title: "Gift Cards Available",
    description:
      "Perfect gifts with flexible amounts and personalized messages",
  },
];

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Growing Our Store Together",
      heroSubtitle:
        "Shop Result Road branded merchandise and adaptive fitness equipment. Every purchase supports our community programs and participants - growing like spring itself.",
      bgOverlay: "bg-emerald-500/20",
    },
    summer: {
      heroTitle: "Energizing Shopping Experience",
      heroSubtitle:
        "Shop Result Road branded merchandise and adaptive fitness equipment. Every purchase supports our community programs and participants - radiating with summer energy.",
      bgOverlay: "bg-blue-500/20",
    },
    autumn: {
      heroTitle: "Harvesting Community Support",
      heroSubtitle:
        "Shop Result Road branded merchandise and adaptive fitness equipment. Every purchase supports our community programs and participants - celebrating like autumn's harvest.",
      bgOverlay: "bg-orange-500/20",
    },
    winter: {
      heroTitle: "Warming Hearts Through Shopping",
      heroSubtitle:
        "Shop Result Road branded merchandise and adaptive fitness equipment. Every purchase supports our community programs and participants - providing comfort through every season.",
      bgOverlay: "bg-slate-500/20",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function StorePage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const featuresRef = useRef<HTMLElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const newsletterRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isMessageInView = useInView(messageRef, {
    once: true,
    margin: "-100px",
  });
  const isNewsletterInView = useInView(newsletterRef, {
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
            src="/9.jpg"
            alt="Result Road store background"
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
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="font-semibold text-white capitalize">
                {currentSeason} Store
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Result Road Store
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

      {/* Store Features */}
      <section
        ref={featuresRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isFeaturesInView
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
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </motion.div>

                <h3
                  className="text-lg font-bold mb-2 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {feature.title}
                </h3>

                <p
                  className="text-sm relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Loading Message */}
      <section
        ref={messageRef}
        className="py-32"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              isMessageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.8 }}
          >
            {/* Animated Icon */}
            <motion.div
              className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
              }}
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
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Package className="w-12 h-12 text-white" />
              </motion.div>

              {/* Sparkle effects */}
              <motion.div
                className="absolute top-2 right-2"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {/* Main Message */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isMessageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="font-black">
                STORE IS LOADING UP - STAY TUNED
              </span>
            </motion.h2>

            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: seasonalColors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isMessageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              We're working hard to bring you amazing Result Road merchandise
              and adaptive fitness equipment. Sign up below to be the first to
              know when our store goes live!
            </motion.p>

            {/* Loading Animation */}
            <motion.div
              className="flex items-center justify-center space-x-2 mb-8"
              initial={{ opacity: 0 }}
              animate={isMessageInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: seasonalColors.primary }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Notification Bell */}
            <motion.div
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: `${seasonalColors.primary}15`,
                border: `2px solid ${seasonalColors.primary}30`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isMessageInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [-10, 10, -10] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Bell
                  className="w-5 h-5"
                  style={{ color: seasonalColors.primary }}
                />
              </motion.div>
              <span
                className="font-semibold"
                style={{ color: seasonalColors.primary }}
              >
                Get notified when we launch!
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section
        ref={newsletterRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="rounded-3xl p-12 text-center shadow-xl relative overflow-hidden"
            style={{ backgroundColor: seasonalColors.background }}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isNewsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.8 }}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
              style={{ backgroundColor: seasonalColors.accent }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.h2
              className="text-3xl font-bold mb-6 relative z-10"
              style={{ color: seasonalColors.textPrimary }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isNewsletterInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Be First to Shop Our Store
            </motion.h2>

            <motion.p
              className="text-lg mb-8 max-w-2xl mx-auto relative z-10"
              style={{ color: seasonalColors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isNewsletterInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Be the first to know about our store launch, exclusive discounts,
              and special edition items coming soon.
            </motion.p>

            <motion.div
              className="max-w-md mx-auto flex gap-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={
                isNewsletterInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                style={
                  {
                    backgroundColor: seasonalColors.cardBackground,
                    color: seasonalColors.textPrimary,
                    "--tw-ring-color": seasonalColors.primary,
                  } as React.CSSProperties
                }
              />
              <motion.button
                className="px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: seasonalColors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify Me
              </motion.button>
            </motion.div>
          </motion.div>
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
              Support Our Community
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              When our store launches, every purchase will help fund Result Road
              programs and support our amazing community of participants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="bg-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl group"
                  style={{ color: seasonalColors.primary }}
                >
                  <Clock className="w-5 h-5" />
                  <span>Coming Soon</span>
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm hover:bg-white group"
                  style={{ borderColor: "white" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
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
