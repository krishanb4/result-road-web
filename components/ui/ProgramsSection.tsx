// components/ui/ProgramsSection.tsx
"use client";

import Image from "next/image";
import { CheckCircle, Clock, Calendar, Play, Pause, X } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";

// Video configuration - UPDATE THESE PATHS WITH YOUR VIDEO URLS
const VIDEO_CONFIG = {
  video1: {
    path: "/videos/3.mp4", // ADD YOUR FIRST VIDEO URL/PATH HERE
    title: "Program Introduction",
    description:
      "See how our programs transform lives through inclusive fitness and community support.",
    poster: "/images/11.jpg", // ADD POSTER IMAGE PATH
  },
  video2: {
    path: "/videos/4.mp4", // ADD YOUR SECOND VIDEO URL/PATH HERE
    title: "Success Stories",
    description:
      "Hear from participants about their journey and achievements in our programs.",
    poster: "/images/22.jpg", // ADD POSTER IMAGE PATH
  },
};

const programs = [
  {
    title: "Strength Building",
    level: "Easy",
    duration: "10 weeks",
    description:
      "Build foundational strength through progressive resistance training.",
    features: ["Upper body focus", "Core stability", "Functional movement"],
  },
  {
    title: "Balance & Coordination",
    level: "Moderate",
    duration: "8 weeks",
    description:
      "Improve balance, coordination, and proprioception through targeted exercises.",
    features: ["Balance control", "Coordination drills", "Fall prevention"],
  },
  {
    title: "Confidence Building",
    level: "All Levels",
    duration: "12 weeks",
    description:
      "Build self-confidence and social skills through group activities.",
    features: ["Social interaction", "Leadership skills", "Self-esteem"],
  },
];

export function ProgramsSection() {
  const seasonalColors = useSeasonalColors();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when navigating from hero section
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#programs-videos") {
        const element = document.getElementById("programs-videos");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange(); // Check on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeVideo) {
        closeVideoModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activeVideo]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeVideoModal();
      }
    };

    if (activeVideo) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

  const openVideoModal = (videoId: string) => {
    setActiveVideo(videoId);
    setIsVideoPlaying(false);
  };

  const closeVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setActiveVideo(null);
    setIsVideoPlaying(false);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const getCurrentVideoConfig = () => {
    return activeVideo === "video1" ? VIDEO_CONFIG.video1 : VIDEO_CONFIG.video2;
  };

  return (
    <section
      id="programs"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0 opacity-10">
        {/* Left side background image */}
        <div className="absolute left-0 top-20 w-1/3 h-96 rounded-r-3xl overflow-hidden">
          <Image
            src="2.jpg" // ADD IMAGE URL HERE - Image 2 (instructor with battle ropes)
            alt="Strength training background"
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>

        {/* Right side background image */}
        <div className="absolute right-0 bottom-20 w-1/3 h-96 rounded-l-3xl overflow-hidden">
          <Image
            src="4.jpg" // ADD IMAGE URL HERE - Image 4 (group fitness class)
            alt="Group fitness background"
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>

        {/* Floating decorative image */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full overflow-hidden opacity-50">
          <Image
            src="3.jpg" // ADD IMAGE URL HERE - Image 3 (man with prosthetic leg)
            alt="Inclusive fitness"
            fill
            className="object-cover"
            sizes="256px"
          />
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Our Programs
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Structured programs designed to build strength, coordination, and
            confidence for participants of all ability levels.
          </p>
        </div>

        {/* Featured Program Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group max-w-4xl mx-auto">
          <div className="aspect-[16/9] relative">
            <Image
              src="1.jpg" // ADD IMAGE URL HERE - Image 1 (kids playing with ball)
              alt="Participants engaging in inclusive fitness programs"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Overlay content */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                Empowering Through Movement
              </h3>
              <p className="text-lg opacity-90 drop-shadow-md max-w-2xl">
                Our evidence-based programs create lasting positive change
                through inclusive fitness, community support, and personal
                development.
              </p>
            </div>

            {/* Decorative elements */}
            <div
              className="absolute top-8 right-8 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                backgroundColor: `${seasonalColors.primary}CC`,
              }}
            >
              <span className="text-white font-bold text-lg">10</span>
              <span className="text-white/80 text-xs ml-1">weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div
        id="programs-videos"
        className="max-w-6xl mx-auto px-6 mb-16 relative z-10"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            See Our Programs in Action
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Watch these videos to get an inside look at our programs and hear
            from our participants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Video 1 Thumbnail */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => openVideoModal("video1")}
          >
            <div className="aspect-square relative">
              <Image
                src={VIDEO_CONFIG.video1.poster}
                alt={VIDEO_CONFIG.video1.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all duration-300">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl transform group-hover:bg-white/20"
                  style={{
                    backgroundColor: `${seasonalColors.primary}E6`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-xl font-bold text-white mb-2">
                  {VIDEO_CONFIG.video1.title}
                </h4>
                <p className="text-white/90 text-sm">
                  {VIDEO_CONFIG.video1.description}
                </p>
              </div>

              {/* Duration badge */}
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                5:30
              </div>
            </div>
          </div>

          {/* Video 2 Thumbnail */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => openVideoModal("video2")}
          >
            <div className="aspect-square relative">
              <Image
                src={VIDEO_CONFIG.video2.poster}
                alt={VIDEO_CONFIG.video2.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all duration-300">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl transform group-hover:bg-white/20"
                  style={{
                    backgroundColor: `${seasonalColors.primary}E6`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-xl font-bold text-white mb-2">
                  {VIDEO_CONFIG.video2.title}
                </h4>
                <p className="text-white/90 text-sm">
                  {VIDEO_CONFIG.video2.description}
                </p>
              </div>

              {/* Duration badge */}
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                3:45
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div
            className="relative w-full max-w-3xl mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl"
            ref={modalRef}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Video Player - Square aspect ratio for 480x480 videos */}
            <div className="relative aspect-square max-h-[80vh]">
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                poster={getCurrentVideoConfig().poster}
                onEnded={handleVideoEnd}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                controls
                autoPlay
                style={{
                  maxHeight: "80vh",
                }}
              >
                <source src={getCurrentVideoConfig().path} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Play/Pause Overlay (only shown when video is paused) */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={toggleVideoPlayback}
                    className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
                    style={{
                      backgroundColor: `${seasonalColors.primary}E6`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {getCurrentVideoConfig().title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {getCurrentVideoConfig().description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Program Cards */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            // Create different opacity levels for variety
            const opacityLevels = ["15", "20", "25"];
            const borderOpacityLevels = ["30", "40", "50"];

            return (
              <div
                key={index}
                className="rounded-2xl p-8 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                style={{
                  backgroundColor: `${seasonalColors.primary}${opacityLevels[index]}`,
                  borderColor: `${seasonalColors.primary}${borderOpacityLevels[index]}`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {program.title}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium border text-white"
                    style={{
                      backgroundColor: seasonalColors.primary,
                      borderColor: seasonalColors.primaryHover,
                    }}
                  >
                    {program.level}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Clock
                      className="w-4 h-4"
                      style={{ color: seasonalColors.primary }}
                    />
                    <span className="text-sm">{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: seasonalColors.primary }}
                    />
                    <span className="text-sm">3x/week</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {program.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {program.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span className="text-slate-700 dark:text-slate-200">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-slate-200/20 to-transparent rounded-tr-full"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-slate-200/20 to-transparent rounded-bl-full"></div>
    </section>
  );
}
