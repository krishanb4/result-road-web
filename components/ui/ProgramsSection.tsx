// components/ui/ProgramsSection.tsx
"use client";

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
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Our Programs
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Structured 10-week programs designed to build strength,
            coordination, and confidence for participants of all ability levels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            // Create different opacity levels for variety
            const opacityLevels = ["15", "20", "25"];
            const borderOpacityLevels = ["30", "40", "50"];

            return (
              <div
                key={index}
                className="rounded-2xl p-8 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                  className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200"
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
    </section>
  );
}
