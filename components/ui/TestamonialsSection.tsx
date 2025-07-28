"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Heart,
  Award,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Program Participant",
    program: "Strength Building",
    duration: "8 months",
    image: "/images/testimonial-sarah.jpg",
    rating: 5,
    quote:
      "Result Road has completely transformed my life. Not just physically, but mentally and emotionally too. The coaches understand my needs and the community here feels like family.",
    longQuote:
      "When I first joined Result Road, I was hesitant and unsure about my abilities. The strength building program not only helped me gain physical strength but also gave me confidence I never knew I had. The adaptive equipment and patient coaching made all the difference. Eight months later, I'm achieving goals I never thought possible.",
    achievement: "Gained 40% upper body strength",
    location: "Newcastle",
    joinedDate: "March 2023",
  },
  {
    id: 2,
    name: "Mike Wilson",
    role: "Support Worker & Participant",
    program: "Balance & Coordination",
    duration: "6 months",
    image: "/images/testimonial-mike.jpg",
    rating: 5,
    quote:
      "As both a support worker and participant, I see the incredible impact Result Road has on everyone who walks through the doors. The structure and positivity are unmatched.",
    longQuote:
      "Working in disability support, I've seen many programs, but Result Road stands out. The way they create an inclusive environment while maintaining high standards is remarkable. My client loves coming here, and I've personally benefited from the balance and coordination program. It's given structure to our support shifts and real goals to work toward.",
    achievement: "Improved balance confidence by 60%",
    location: "Lake Macquarie",
    joinedDate: "September 2023",
  },
  {
    id: 3,
    name: "Lisa Chen",
    role: "Fitness Partner & Facility Owner",
    program: "Partnership Program",
    duration: "2 years",
    image: "/images/testimonial-lisa.jpg",
    rating: 5,
    quote:
      "Partnering with Result Road has brought incredible purpose to our facility. Seeing the transformation in participants week after week is absolutely inspiring.",
    longQuote:
      "When Result Road approached us about partnership, I had no idea how much it would change our entire facility culture. The programs they run here have created such a positive, inclusive atmosphere. Our other members love seeing the progress and celebration that happens. It's reminded all of us why we're really in the fitness industry.",
    achievement: "200% increase in community engagement",
    location: "Nelson Bay",
    joinedDate: "January 2022",
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Program Graduate",
    program: "Confidence Building",
    duration: "12 months",
    image: "/images/testimonial-david.jpg",
    rating: 5,
    quote:
      "The confidence building program didn't just change how I exercise - it changed how I approach life. I'm more social, more confident, and genuinely happier.",
    longQuote:
      "I was quite isolated before joining Result Road. The confidence building program helped me connect with others facing similar challenges. Through group activities and personal achievements, I learned to believe in myself again. The friendships I've made here extend far beyond the gym, and I now volunteer to help new participants feel welcome.",
    achievement: "From isolation to community leadership",
    location: "Newcastle",
    joinedDate: "November 2022",
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "Parent & Participant",
    program: "Group Fitness",
    duration: "10 months",
    image: "/images/testimonial-emma.jpg",
    rating: 5,
    quote:
      "Result Road welcomed both me and my daughter with special needs. Finding a program that works for our whole family has been life-changing.",
    longQuote:
      "As a single parent caring for a daughter with special needs, finding time for my own health seemed impossible. Result Road's group fitness classes are designed to be inclusive and flexible. When childcare fell through, they welcomed my daughter to participate alongside me. We've both grown stronger together, and the community support has been incredible.",
    achievement: "Improved family fitness and wellbeing",
    location: "Lake Macquarie",
    joinedDate: "May 2023",
  },
  {
    id: 6,
    name: "James Robertson",
    role: "Adaptive Sports Athlete",
    program: "Strength Building",
    duration: "18 months",
    image: "/images/testimonial-james.jpg",
    rating: 5,
    quote:
      "The adaptive strength training here prepared me for competitive adaptive sports. The coaches understand the unique challenges and push me to excel.",
    longQuote:
      "After my injury, I thought competitive sports were behind me. Result Road's strength building program not only helped me regain physical capabilities but also reignited my competitive spirit. The coaches work with my specific needs and have helped me transition into adaptive sports. I'm now competing at a national level again.",
    achievement: "National adaptive sports competitor",
    location: "Newcastle",
    joinedDate: "August 2022",
  },
];

const stats = [
  {
    number: "500+",
    label: "Lives Changed",
    description: "Participants who've transformed their lives",
    icon: Heart,
  },
  {
    number: "4.9/5",
    label: "Average Rating",
    description: "Consistently high satisfaction scores",
    icon: Star,
  },
  {
    number: "94%",
    label: "Recommend Us",
    description: "Would recommend to friends & family",
    icon: Award,
  },
  {
    number: "2.5+",
    label: "Years Average",
    description: "Average participant retention",
    icon: Users,
  },
];

function TestimonialCard({
  testimonial,
  isActive,
  onClick,
}: {
  testimonial: (typeof testimonials)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = useSeasonalColors();

  return (
    <motion.div
      className={`p-8 rounded-3xl border border-white/20 backdrop-blur-xl cursor-pointer transition-all duration-500 ${
        isActive ? "ring-2" : "hover:scale-[1.02]"
      }`}
      style={{
        background: isActive ? `${colors.primary}15` : `${colors.primary}08`,
        boxShadow: isActive ? `0 0 0 2px ${colors.primary}` : "none",
      }}
      whileHover={{ y: isActive ? 0 : -4 }}
      onClick={onClick}
    >
      {/* Quote Icon */}
      <motion.div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Quote className="w-6 h-6 text-white" />
      </motion.div>

      {/* Quote */}
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
        "{testimonial.quote}"
      </p>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star
              className="w-5 h-5 fill-current"
              style={{ color: colors.accent }}
            />
          </motion.div>
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ background: colors.primary }}
        >
          {testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.role}
          </div>
          <div className="text-xs" style={{ color: colors.primary }}>
            {testimonial.program} • {testimonial.duration}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialDetails({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  const colors = useSeasonalColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          {testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {testimonial.name}
        </h3>
        <p className="text-lg" style={{ color: colors.secondary }}>
          {testimonial.role}
        </p>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{testimonial.location}</span>
          <span>•</span>
          <span>Joined {testimonial.joinedDate}</span>
        </div>
      </div>

      {/* Long Quote */}
      <motion.div
        className="p-8 rounded-2xl border border-white/20 backdrop-blur-sm relative"
        style={{ background: `${colors.primary}08` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Quote
          className="absolute top-4 right-4 w-8 h-8 opacity-20"
          style={{ color: colors.primary }}
        />
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
          "{testimonial.longQuote}"
        </p>
      </motion.div>

      {/* Achievement & Program Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="p-6 rounded-2xl border border-white/20 backdrop-blur-sm"
          style={{ background: `${colors.accent}10` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Award className="w-6 h-6" style={{ color: colors.accent }} />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Key Achievement
            </h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {testimonial.achievement}
          </p>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl border border-white/20 backdrop-blur-sm"
          style={{ background: `${colors.secondary}10` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-6 h-6" style={{ color: colors.secondary }} />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Program Details
            </h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {testimonial.program} • {testimonial.duration}
          </p>
        </motion.div>
      </div>

      {/* Rating Display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            >
              <Star
                className="w-8 h-8 fill-current"
                style={{ color: colors.accent }}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {testimonial.rating}/5 Stars
        </p>
      </motion.div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setAutoPlay(false);
  };

  const seasonalContent = {
    spring: {
      title: "Spring Stories",
      subtitle: "Growth and renewal through community",
      description:
        "Like spring's fresh blooms, our participants flourish and share their transformation stories.",
    },
    summer: {
      title: "Summer Success Stories",
      subtitle: "Energizing transformations and achievements",
      description:
        "Bright and inspiring stories that capture the dynamic energy and success of our summer participants.",
    },
    autumn: {
      title: "Autumn Achievements",
      subtitle: "Harvesting success and celebrating growth",
      description:
        "Rich stories of dedication, perseverance, and the rewarding results of consistent effort.",
    },
    winter: {
      title: "Winter Warmth Stories",
      subtitle: "Heartwarming journeys of strength and community",
      description:
        "Cozy, inspiring stories that warm the heart and showcase the strength found in our community.",
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
            background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
          }}
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
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 15,
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
            <Heart className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Community Stories
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Testimonials List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Participant Stories
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300"
                  style={{ background: `${colors.primary}10` }}
                  whileHover={{
                    scale: 1.1,
                    background: `${colors.primary}20`,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </motion.button>
                <motion.button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300"
                  style={{ background: `${colors.primary}10` }}
                  whileHover={{
                    scale: 1.1,
                    background: `${colors.primary}20`,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                </motion.button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isActive={index === activeTestimonial}
                  onClick={() => {
                    setActiveTestimonial(index);
                    setAutoPlay(false);
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Active Testimonial Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <TestimonialDetails
                key={activeTestimonial}
                testimonial={testimonials[activeTestimonial]}
              />
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl backdrop-blur-xl border border-white/20"
                style={{ background: `${colors.primary}08` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.primary }}
                >
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Ready to write your own success story?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <span className="relative z-10">Join Our Community</span>
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

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
