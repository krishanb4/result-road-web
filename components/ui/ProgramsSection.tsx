// components/ui/ProgramsSection.tsx
"use client";

import Image from "next/image";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

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
