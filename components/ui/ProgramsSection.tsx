"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Heart,
  Users,
  Target,
  Clock,
  Calendar,
  CheckCircle,
  Play,
  ArrowRight,
  Star,
  Award,
  Sparkles,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSeasonalTheme, useSeasonalColors } from "./SeasonalThemeContext";

const videos = [
  {
    id: "program-intro",
    title: "Program Introduction",
    description:
      "See how our programs transform lives through inclusive fitness and community support.",
    duration: "5:30",
    thumbnail: "/images/11.jpg",
    videoUrl: "/videos/3.mp4",
    category: "Overview",
  },
  {
    id: "success-stories",
    title: "Success Stories",
    description:
      "Hear from participants about their journey and achievements in our programs.",
    duration: "3:45",
    thumbnail: "/images/22.jpg",
    videoUrl: "/videos/4.mp4",
    category: "Testimonials",
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
  },
};

function VideoCard({
  video,
  index,
}: {
  video: (typeof videos)[0];
  index: number;
}) {
  const colors = useSeasonalColors();
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        }}
        className="group relative"
      >
        <div className="h-full rounded-3xl border border-white/20 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:shadow-2xl relative">
          {/* Video Thumbnail Background */}
          <div className="aspect-video relative overflow-hidden">
            {/* Placeholder background with gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `url(${video.thumbnail}) no-repeat center center / cover`,
              }}
            />

            {/* Gym/fitness themed background pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/40" />

              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full  transform -skew-x-12" />
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
              {video.duration}
            </div>

            {/* Category badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-lg text-white text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              {video.category}
            </div>

            {/* Play button */}
            <motion.button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center group/play"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                whileHover={{
                  scale: 1.1,
                  background: "rgba(255, 255, 255, 1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Play
                  className="w-8 h-8 ml-1"
                  style={{ color: colors.primary }}
                  fill="currentColor"
                />
              </motion.div>

              {/* Ripple effect */}
              <motion.div
                className="absolute w-20 h-20 rounded-full border-2 border-white/50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />
            </motion.button>

            {/* Floating sparkle */}
            <motion.div
              className="absolute bottom-6 left-6"
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
          </div>

          {/* Content */}
          <div className="p-6 relative z-10">
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            />

            <div className="relative z-10">
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {video.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {video.description}
              </p>

              {/* Action Button */}
              <motion.button
                onClick={() => setShowVideo(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 w-full"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                <span>Watch Video</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setShowVideo(false);
              setIsPlaying(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            >
              {/* Video Player */}
              {isPlaying ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted={isMuted}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Video Placeholder */
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  style={{
                    background: `url(${video.thumbnail}) no-repeat center center / cover`,
                  }}
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="text-center text-white">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
                    >
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
                    <p className="text-gray-300 mb-2">{video.description}</p>
                    <p className="text-gray-400">Duration: {video.duration}</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {isPlaying && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowVideo(false);
                    setIsPlaying(false);
                  }}
                  className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProgramsSection() {
  const { currentSeason, currentTheme } = useSeasonalTheme();
  const colors = useSeasonalColors();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const seasonalContent = {
    spring: {
      title: "Spring Into Action",
      subtitle: "New season, new programs, new you",
      description:
        "Our spring programs focus on growth, renewal, and building healthy habits that will flourish throughout the year.",
    },
    summer: {
      title: "Summer Strength Programs",
      subtitle: "High-energy programs for active lifestyles",
      description:
        "Embrace the summer energy with our dynamic programs designed to keep you motivated and moving toward your goals.",
    },
    autumn: {
      title: "Autumn Achievement Programs",
      subtitle: "Harvest your strength and confidence",
      description:
        "Our autumn programs help you build lasting habits and celebrate every milestone on your fitness journey.",
    },
    winter: {
      title: "Winter Wellness Programs",
      subtitle: "Stay strong through the winter months",
      description:
        "Don't let winter slow you down. Our cozy indoor programs provide warmth, community, and continued growth.",
    },
  };

  const content =
    seasonalContent[currentSeason as keyof typeof seasonalContent] ||
    seasonalContent.spring;

  return (
    <section
      id="programs-section"
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
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 12,
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
            <Dumbbell className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Our Programs
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

        {/* Videos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
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
            href="/programs"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <span className="relative z-10">View All Programs</span>
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
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
