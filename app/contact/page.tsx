// app/contact/page.tsx
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
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  HeadphonesIcon,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";
import Image from "next/image";

const contactMethods = [
  // {
  //   icon: Phone,
  //   title: "Phone",
  //   value: "0456 194 251",
  //   description: "Call us during business hours for immediate assistance",
  //   available: "Mon-Fri 9AM-5PM",
  //},
  {
    icon: Mail,
    title: "Email",
    value: "hello@resultroad.com.au",
    description: "Send us an email and we'll respond within 24 hours",
    available: "24/7 Response",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Newcastle, Lake Macquarie, Nelson Bay & Hunter Region",
    description: "We serve multiple locations across the region",
    available: "8 Facilities",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    value: "Online Support",
    description: "Chat with our team during business hours",
    available: "Mon-Fri 9AM-5PM",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
  { day: "Sunday", hours: "Closed" },
  { day: "Public Holidays", hours: "Closed" },
];

const teamMembers = [
  {
    name: "Nathan",
    role: "Program Director",
    email: "hello@resultroad.com.au",
    phone: "",
    specialties: [
      "Program Innovation",
      "Strategic Leadership",
      "Inclusive Service Design",
    ],
    image: "/team/nathan.jpg",
  },
  {
    name: "Liz",
    role: "Behaviour Therapist",
    email: "hello@resultroad.com.au",
    phone: "",
    specialties: [
      "Positive Behaviour Support",
      "Complex Needs Management",
      "Individualised Intervention Planning",
    ],
    image: "/team/liz.jpg",
  },
  {
    name: "Sean",
    role: "Business Development Manager",
    email: "hello@resultroad.com.au",
    phone: "",
    specialties: [
      "Community Partnerships",
      "Program Growth",
      "Client Engagement",
    ],
    image: "/team/sean.jpg",
  },
];

const inquiryTypes = [
  {
    icon: Users,
    title: "Program Enrollment",
    description: "Questions about joining our programs and getting started",
  },
  {
    icon: Calendar,
    title: "Schedule Information",
    description: "Program schedules, session times, and availability",
  },
  {
    icon: HeadphonesIcon,
    title: "General Support",
    description: "General questions about Result Road and our services",
  },
  {
    icon: Phone,
    title: "Partnership Inquiries",
    description: "Collaboration opportunities and community partnerships",
  },
];

const getSeasonalContent = (season: string) => {
  const content = {
    spring: {
      heroTitle: "Growing Connections Together",
      heroSubtitle:
        "Ready to start your Result Road journey? We're here to answer your questions, provide information, and help you take the next step towards better health and wellness - blooming like spring.",
      bgOverlay: "bg-emerald-500/20",
    },
    summer: {
      heroTitle: "Energizing Your Communication",
      heroSubtitle:
        "Ready to start your Result Road journey? We're here to answer your questions, provide information, and help you take the next step towards better health and wellness - radiating with summer energy.",
      bgOverlay: "bg-blue-500/20",
    },
    autumn: {
      heroTitle: "Harvesting Great Conversations",
      heroSubtitle:
        "Ready to start your Result Road journey? We're here to answer your questions, provide information, and help you take the next step towards better health and wellness - celebrating connections like autumn's harvest.",
      bgOverlay: "bg-orange-500/20",
    },
    winter: {
      heroTitle: "Warming Hearts Through Connection",
      heroSubtitle:
        "Ready to start your Result Road journey? We're here to answer your questions, provide information, and help you take the next step towards better health and wellness - providing warmth through every season.",
      bgOverlay: "bg-slate-500/20",
    },
  };

  return content[season as keyof typeof content] || content.spring;
};

export default function ContactPage() {
  const { currentSeason } = useSeasonalTheme();
  const seasonalColors = useSeasonalColors();
  const methodsRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  const isMethodsInView = useInView(methodsRef, {
    once: true,
    margin: "-100px",
  });
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });

  const seasonalContent = getSeasonalContent(currentSeason);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: seasonalColors.background }}
    >
      <Navigation />

      {/* Hero Section with Seasonal Background */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background decorations */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: seasonalColors.primary }}
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

        <motion.div
          className="absolute bottom-10 left-20 w-24 h-24 opacity-20"
          style={{
            backgroundColor: seasonalColors.accent,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
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
              <MessageCircle
                className="w-4 h-4"
                style={{ color: seasonalColors.primary }}
              />
              <span
                className="font-semibold capitalize"
                style={{ color: seasonalColors.primary }}
              >
                {currentSeason} Contact
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Get In Touch
            </motion.h1>

            <motion.p
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: seasonalColors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {seasonalContent.heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section
        ref={methodsRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isMethodsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: seasonalColors.textPrimary }}
            >
              How to Reach Us
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Choose the contact method that works best for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                className="rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: seasonalColors.background }}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isMethodsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
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
                  style={{ backgroundColor: seasonalColors.primary }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <method.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3
                  className="text-xl font-bold mb-2 relative z-10"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  {method.title}
                </h3>

                <p
                  className="text-md font-semibold mb-3 relative z-10 text-center"
                  style={{ color: seasonalColors.primary }}
                >
                  {method.value}
                </p>

                <p
                  className="text-sm mb-3 relative z-10"
                  style={{ color: seasonalColors.textSecondary }}
                >
                  {method.description}
                </p>

                <span
                  className="text-xs font-medium relative z-10"
                  style={{ color: seasonalColors.textMuted }}
                >
                  {method.available}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section
        ref={formRef}
        className="py-20"
        style={{ backgroundColor: seasonalColors.background }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              className="rounded-3xl p-8 shadow-xl relative overflow-hidden"
              style={{ backgroundColor: seasonalColors.cardBackground }}
              initial={{ opacity: 0, x: -50 }}
              animate={
                isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
            >
              {/* Background decoration */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: seasonalColors.primary }}
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

              <motion.h3
                className="text-3xl font-bold mb-6 relative z-10"
                style={{ color: seasonalColors.textPrimary }}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Send us a Message
              </motion.h3>

              <motion.p
                className="mb-8 relative z-10"
                style={{ color: seasonalColors.textSecondary }}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Fill out the form below and we'll get back to you as soon as
                possible.
              </motion.p>

              <motion.form
                className="space-y-6 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      style={
                        {
                          backgroundColor: seasonalColors.background,
                          color: seasonalColors.textPrimary,
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      style={
                        {
                          backgroundColor: seasonalColors.background,
                          color: seasonalColors.textPrimary,
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      style={
                        {
                          backgroundColor: seasonalColors.background,
                          color: seasonalColors.textPrimary,
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: seasonalColors.textPrimary }}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      style={
                        {
                          backgroundColor: seasonalColors.background,
                          color: seasonalColors.textPrimary,
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="0400 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    Inquiry Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={
                      {
                        backgroundColor: seasonalColors.background,
                        color: seasonalColors.textPrimary,
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                  >
                    <option value="">Select an inquiry type</option>
                    <option value="enrollment">Program Enrollment</option>
                    <option value="schedule">Schedule Information</option>
                    <option value="support">General Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-300"
                    style={
                      {
                        backgroundColor: seasonalColors.background,
                        color: seasonalColors.textPrimary,
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  style={{ backgroundColor: seasonalColors.primary }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
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
                </motion.button>
              </motion.form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={
                isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Office Hours */}
              {/* <motion.div
                className="rounded-3xl p-8 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${seasonalColors.primary}20` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Clock
                      className="w-6 h-6"
                      style={{ color: seasonalColors.primary }}
                    />
                  </motion.div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center py-2"
                      style={{
                        borderBottom: `1px solid ${seasonalColors.textMuted}30`,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isFormInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: seasonalColors.textSecondary }}
                      >
                        {schedule.day}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: seasonalColors.primary }}
                      >
                        {schedule.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div> */}

              {/* Inquiry Types */}
              <motion.div
                className="rounded-3xl p-8 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: seasonalColors.cardBackground }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ color: seasonalColors.textPrimary }}
                >
                  What can we help you with?
                </h3>
                <div className="space-y-4">
                  {inquiryTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isFormInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                        style={{
                          backgroundColor: `${seasonalColors.primary}20`,
                        }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <type.icon
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                      </motion.div>
                      <div>
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: seasonalColors.textPrimary }}
                        >
                          {type.title}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: seasonalColors.textSecondary }}
                        >
                          {type.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Emergency Contact */}
              {/* <motion.div
                className="rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.secondary})`,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: "white" }}
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

                <h3 className="text-2xl font-bold mb-4 relative z-10">
                  Need Immediate Assistance?
                </h3>
                <p className="mb-4 opacity-90 relative z-10">
                  For urgent matters or emergencies related to our programs,
                  please call our emergency line.
                </p>
                <div className="flex items-center space-x-3 relative z-10">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg font-semibold">0456 194 251</span>
                </div>
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our Team
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: seasonalColors.textSecondary }}
            >
              Get to know the passionate professionals behind Result Road.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
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
                  className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden"
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
                    sizes="96px"
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
                  {member.role}
                </p>

                <div className="space-y-2 mb-6 text-sm relative z-10">
                  <div
                    className="flex items-center justify-center space-x-2"
                    style={{ color: seasonalColors.textSecondary }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div
                      className="flex items-center justify-center space-x-2"
                      style={{ color: seasonalColors.textSecondary }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <h4
                    className="font-semibold mb-2 text-sm"
                    style={{ color: seasonalColors.textPrimary }}
                  >
                    Specialties:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <motion.span
                        key={specialtyIndex}
                        className="px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: seasonalColors.primary }}
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        {specialty}
                      </motion.span>
                    ))}
                  </div>
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
