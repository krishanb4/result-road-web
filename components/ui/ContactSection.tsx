"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Calendar,
  User,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const contactInfo = [
  // {
  //   icon: Phone,
  //   label: "Phone",
  //   value: "0456 194 251",
  //   description: "Call us Monday to Friday, 9AM - 5PM",
  //   href: "tel:0456194251",
  // },
  {
    icon: Mail,
    label: "Email",
    value: "hello@resultroad.com.au",
    description: "We typically respond within 24 hours",
    href: "mailto:hello@resultroad.com.au",
  },
  {
    icon: MapPin,
    label: "Locations",
    value: "Newcastle, Lake Macquarie , Nelson Bay & Hunter Region",
    description: "Multiple convenient locations to serve you",
    href: "#",
  },
  // {
  //   icon: Clock,
  //   label: "Office Hours",
  //   value: "Mon - Fri: 9AM - 5PM",
  //   description: "Weekend programs available",
  //   href: "#",
  // },
];

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "John",
    required: true,
    icon: User,
    width: "half",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Smith",
    required: true,
    icon: User,
    width: "half",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
    required: true,
    icon: Mail,
    width: "full",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "0456 123 456",
    required: false,
    icon: Phone,
    width: "full",
  },
  {
    name: "interest",
    label: "Program Interest",
    type: "select",
    placeholder: "Select a program",
    required: false,
    icon: Calendar,
    width: "full",
    options: [
      "Strength Building Program",
      "Balance & Coordination",
      "Confidence Building",
      "Group Fitness Classes",
      "Personal Training",
      "General Inquiry",
    ],
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Tell us how we can help you...",
    required: true,
    icon: MessageCircle,
    width: "full",
  },
];

export function ContactSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitStatus("success");

    // Reset form after success
    setTimeout(() => {
      setFormData({});
      setSubmitStatus("idle");
    }, 3000);
  };

  const seasonalContent = {
    spring: {
      title: "Let's Grow Together",
      subtitle: "Start your spring transformation today",
      description:
        "Ready to bloom into your best self? Reach out and let's discuss how our spring programs can help you achieve your goals.",
    },
    summer: {
      title: "Dive Into Summer",
      subtitle: "Make a splash with our summer programs",
      description:
        "Ready for an energizing summer of fitness? Contact us to learn about our high-energy programs and outdoor activities.",
    },
    autumn: {
      title: "Harvest Your Potential",
      subtitle: "Reap the benefits of structured fitness",
      description:
        "Ready to gather strength and confidence this autumn? Get in touch to discover our fall programs and community support.",
    },
    winter: {
      title: "Warm Up to Wellness",
      subtitle: "Stay active through the winter months",
      description:
        "Don't let winter slow you down. Contact us to learn about our cozy indoor programs designed to keep you motivated.",
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
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [-20, 20, -20],
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
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-white/20"
            style={{ background: `${colors.primary}10` }}
          >
            <MessageCircle
              className="w-4 h-4"
              style={{ color: colors.primary }}
            />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Get In Touch
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

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Ready to start your journey? We're here to help and answer any
                questions you might have.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="group"
                  >
                    <motion.a
                      href={item.href}
                      className="flex items-start space-x-4 p-6 rounded-2xl backdrop-blur-xl border border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      style={{ background: `${colors.primary}08` }}
                      whileHover={{
                        background: `${colors.primary}15`,
                        borderColor: `${colors.primary}30`,
                      }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {item.label}
                          </h4>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.5,
                            }}
                          >
                            <Sparkles
                              className="w-4 h-4"
                              style={{ color: colors.accent }}
                            />
                          </motion.div>
                        </div>
                        <div
                          className="font-medium mb-1 text-lg"
                          style={{ color: colors.primary }}
                        >
                          {item.value}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">
                          {item.description}
                        </div>
                      </div>
                    </motion.a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden"
              style={{ background: `${colors.primary}05` }}
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />

              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formFields.map((field, index) => {
                    const Icon = field.icon;
                    const isFocused = focusedField === field.name;
                    const hasValue = formData[field.name];

                    return (
                      <motion.div
                        key={field.name}
                        className={
                          field.width === "half"
                            ? "lg:w-1/2 lg:inline-block lg:pr-3"
                            : "w-full"
                        }
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {field.label}
                          {field.required && (
                            <span style={{ color: colors.accent }}>*</span>
                          )}
                        </label>

                        <div className="relative">
                          <motion.div
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                            animate={{
                              scale: isFocused || hasValue ? 1.1 : 1,
                              color: isFocused ? colors.primary : "#9CA3AF",
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>

                          {field.type === "textarea" ? (
                            <motion.textarea
                              rows={4}
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
                              style={{
                                background: isFocused
                                  ? `${colors.primary}10`
                                  : "rgba(255, 255, 255, 0.5)",
                                borderColor: isFocused
                                  ? colors.primary
                                  : "rgba(255, 255, 255, 0.2)",
                                outline: "none",
                              }}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => setFocusedField(null)}
                              required={field.required}
                              whileFocus={{ scale: 1.02 }}
                            />
                          ) : field.type === "select" ? (
                            <motion.select
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200 appearance-none cursor-pointer"
                              style={{
                                background: isFocused
                                  ? `${colors.primary}10`
                                  : "rgba(255, 255, 255, 0.5)",
                                borderColor: isFocused
                                  ? colors.primary
                                  : "rgba(255, 255, 255, 0.2)",
                                outline: "none",
                              }}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => setFocusedField(null)}
                              required={field.required}
                              whileFocus={{ scale: 1.02 }}
                            >
                              <option value="">{field.placeholder}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </motion.select>
                          ) : (
                            <motion.input
                              type={field.type}
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                              style={{
                                background: isFocused
                                  ? `${colors.primary}10`
                                  : "rgba(255, 255, 255, 0.5)",
                                borderColor: isFocused
                                  ? colors.primary
                                  : "rgba(255, 255, 255, 0.2)",
                                outline: "none",
                              }}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => setFocusedField(null)}
                              required={field.required}
                              whileFocus={{ scale: 1.02 }}
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: 1.8, duration: 0.6 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || submitStatus === "success"}
                      className="w-full py-4 rounded-xl font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background:
                          submitStatus === "success"
                            ? "#10B981"
                            : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="flex items-center justify-center space-x-3"
                        animate={
                          isSubmitting ? { opacity: 0.7 } : { opacity: 1 }
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span>Sending...</span>
                          </>
                        ) : submitStatus === "success" ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Message Sent!</span>
                          </>
                        ) : submitStatus === "error" ? (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            <span>Try Again</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.div>

                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </motion.button>
                  </motion.div>
                </form>

                {/* Success/Error Messages */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: submitStatus !== "idle" ? 1 : 0,
                    height: submitStatus !== "idle" ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {submitStatus === "success" && (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        Thank you! We'll get back to you within 24 hours.
                      </span>
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <span>Something went wrong. Please try again.</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
