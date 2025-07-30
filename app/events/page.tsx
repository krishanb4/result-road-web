// app/events/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import {
  useSeasonalTheme,
  useSeasonalColors,
} from "../../components/ui/SeasonalThemeContext";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  PartyPopper,
  Ticket,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const upcomingEvents = [
  {
    title: "Result Road Spring Season Celebration",
    date: "Friday 7th November",
    time: "6PM",
    location: "Dudley Footy Ground",
    participants: "Community Welcome",
    description:
      "Come and celebrate the wins, growth, and journey of the Result Road Spring Season with an unforgettable evening. Join us as we celebrate our community's achievements and progress together.",
    highlights: [
      "Celebrating spring season wins",
      "Recognition of growth and achievements",
      "Community gathering",
      "Unforgettable evening experience",
      "Food and refreshments",
      "Awards and presentations",
    ],
    image: "/11.jpg",
    featured: true,
    category: "Celebration",
    special: "Tickets available at www.resultroad.com.au",
  },
];

const eventTypes = [
  {
    icon: Award,
    title: "Competitions",
    description:
      "Friendly competitions and challenges to showcase progress and achievements.",
  },
  {
    icon: Heart,
    title: "Community Events",
    description:
      "Social gatherings that bring our community together for fun and connection.",
  },
  {
    icon: Zap,
    title: "Workshops",
    description:
      "Educational sessions covering fitness, wellness, and personal development topics.",
  },
  {
    icon: Users,
    title: "Family Days",
    description:
      "Inclusive events designed for participants and their families to enjoy together.",
  },
];

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Celebrating Growth & Community",
      heroSubtitle:
        "Join us for exciting events, competitions, workshops, and community gatherings that celebrate progress and build lasting connections - blossoming like spring itself.",
      bgOverlay: "bg-emerald-500/20",
      eventsTitle: "Spring Events & Activities",
    },
    summer: {
      heroTitle: "Energizing Community Events",
      heroSubtitle:
        "Join us for exciting events, competitions, workshops, and community gatherings that celebrate progress and build lasting connections - radiating with summer energy.",
      bgOverlay: "bg-blue-500/20",
      eventsTitle: "Summer Events & Activities",
    },
    autumn: {
      heroTitle: "Harvesting Community Connections",
      heroSubtitle:
        "Join us for exciting events, competitions, workshops, and community gatherings that celebrate progress and build lasting connections - celebrating like autumn's harvest.",
      bgOverlay: "bg-orange-500/20",
      eventsTitle: "Autumn Events & Activities",
    },
    winter: {
      heroTitle: "Warming Hearts Through Events",
      heroSubtitle:
        "Join us for exciting events, competitions, workshops, and community gatherings that celebrate progress and build lasting connections - bringing warmth through every season.",
      bgOverlay: "bg-slate-500/20",
      eventsTitle: "Winter Events & Activities",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function EventsPage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const typesRef = useRef<HTMLElement>(null);
  const eventsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // State for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isTypesInView = useInView(typesRef, { once: true, margin: "-100px" });
  const isEventsInView = useInView(eventsRef, { once: true, margin: "-100px" });
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
            src="/8.jpg"
            alt="Result Road events background"
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
              <PartyPopper className="w-4 h-4 text-white" />
              <span className="font-semibold text-white capitalize">
                {currentSeason} Events
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {seasonalContent.eventsTitle}
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

      {/* Event Types */}
      <section
        ref={typesRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isTypesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Types of Events
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              We host a variety of events throughout the year to engage our
              community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventTypes.map((type, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isTypesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
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
                  <type.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </motion.div>

                <h3
                  className="text-xl font-bold mb-4 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {type.title}
                </h3>

                <p
                  className="relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event - Spring Celebration */}
      <section
        ref={eventsRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isEventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              Featured Event
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Don't miss our upcoming special celebration event!
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 relative group"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isEventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.3, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -10 }}
              >
                {/* Featured Badge */}
                <motion.div
                  className="px-6 py-3 text-white font-semibold flex items-center justify-center space-x-2 text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Star className="w-5 h-5" />
                  </motion.div>
                  <span>Special Spring Event</span>
                </motion.div>

                <div className="relative h-64 md:h-80">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundColor: seasonalColors.primary }}
                  />

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-6 right-6 px-4 py-2 rounded-full text-white font-semibold backdrop-blur-sm text-lg"
                    style={{ backgroundColor: `${seasonalColors.accent}90` }}
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {event.category}
                  </motion.div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.h3
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isEventsInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      {event.title}
                    </motion.h3>
                    <motion.p
                      className="text-white/90 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isEventsInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      {event.date} at {event.time}
                    </motion.p>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  {/* Event Details */}
                  <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-4">
                      <motion.div
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isEventsInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <Calendar
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: seasonalColors.textPrimary }}
                        >
                          {event.date}
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isEventsInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: 1.3, duration: 0.5 }}
                      >
                        <Clock
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                        <span style={{ color: seasonalColors.textSecondary }}>
                          {event.time}
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isEventsInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: 1.4, duration: 0.5 }}
                      >
                        <MapPin
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                        <span style={{ color: seasonalColors.textSecondary }}>
                          {event.location}
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isEventsInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: 1.5, duration: 0.5 }}
                      >
                        <Users
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                        <span style={{ color: seasonalColors.textSecondary }}>
                          {event.participants}
                        </span>
                      </motion.div>
                    </div>

                    {/* Clickable Event Poster */}
                    <motion.div
                      className="rounded-2xl relative overflow-hidden"
                      style={{
                        backgroundColor: `${seasonalColors.accent}05`,
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={
                        isEventsInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.9 }
                      }
                      transition={{ delay: 1.6, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <Ticket
                          className="w-6 h-6"
                          style={{ color: seasonalColors.accent }}
                        />
                      </motion.div>

                      {/* Clickable Event Poster Image */}
                      <div
                        className="rounded-lg overflow-hidden cursor-pointer relative group/image"
                        onClick={() => setIsImageModalOpen(true)}
                      >
                        <Image
                          src="/images/event.jpg"
                          alt="Spring Season Celebration Poster"
                          width={500}
                          height={600}
                          className="w-full max-w-[500px] mx-auto object-cover rounded-lg shadow-xl transition-transform duration-300 group-hover/image:scale-105"
                          style={{ aspectRatio: "1280/1600" }}
                        />
                        {/* Zoom overlay on hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <ZoomIn className="w-6 h-6 text-gray-800" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.p
                    className="text-lg mb-8 leading-relaxed"
                    style={{ color: seasonalColors.textSecondary }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isEventsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: 1.7, duration: 0.6 }}
                  >
                    {event.description}
                  </motion.p>

                  {/* Event Highlights */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isEventsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: 1.8, duration: 0.6 }}
                  >
                    <h4
                      className="font-bold mb-4 text-xl"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      Event Highlights:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {event.highlights.map((highlight, highlightIndex) => (
                        <motion.div
                          key={highlightIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            isEventsInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{
                            delay: 1.9 + highlightIndex * 0.1,
                            duration: 0.4,
                          }}
                        >
                          <Sparkles
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: seasonalColors.primary }}
                          />
                          <span style={{ color: seasonalColors.textSecondary }}>
                            {highlight}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isEventsInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ delay: 2.2, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <a
                        href="/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center justify-center space-x-3 text-white text-lg group"
                        style={{
                          background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
                        }}
                      >
                        <Ticket className="w-5 h-5" />
                        <span>Get Tickets</span>
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
                      </a>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isEventsInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ delay: 2.4, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/contact"
                        className="w-full font-semibold py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 border-2 text-lg"
                        style={{
                          borderColor: seasonalColors.primary,
                          color: seasonalColors.primary,
                        }}
                      >
                        <span>Learn More</span>
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
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Don't Miss Out on Future Events
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Stay connected with Result Road to be the first to know about
              upcoming events and activities.
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
                  <span>Get Event Updates</span>
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
                  href="/programs"
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm hover:bg-white group"
                  style={{ borderColor: "white" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <span>View Programs</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Large Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/event.jpg"
                  alt="Spring Season Celebration Poster - Full Size"
                  width={1280}
                  height={1600}
                  className="w-full h-auto object-contain max-h-[85vh]"
                  style={{ aspectRatio: "1280/1600" }}
                  priority
                />
              </div>

              {/* Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white"
              >
                <h3 className="font-bold text-lg mb-1">
                  Result Road Spring Season Celebration
                </h3>
                <p className="text-white/80 text-sm">
                  Friday 7th November at 6PM • Dudley Footy Ground
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
