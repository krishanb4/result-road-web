// components/ui/AboutSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Award,
  ArrowRight,
  Users,
  Building,
  Target,
  ThumbsUp,
} from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const benefits = [
  "Qualified coaches with lived experience",
  "Evidence-based program design",
  "Flexible scheduling options",
  "Progress tracking and reporting",
];

const impactStats = [
  {
    value: "247+",
    label: "Participants",
    description: "Active community members",
    icon: Users,
  },
  {
    value: "15",
    label: "Programs",
    description: "Specialized fitness programs",
    icon: Target,
  },
  {
    value: "8",
    label: "Facilities",
    description: "Partner locations",
    icon: Building,
  },
  {
    value: "94%",
    label: "Satisfaction",
    description: "Participant satisfaction rate",
    icon: ThumbsUp,
  },
];

export function AboutSection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
              About Result Road
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              At Result Road, our mission is to empower individuals and families
              by creating an inclusive, supportive hub that connects
              participants, their families, service providers and fitness
              partners.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              We run and oversee specialised fitness programs throughout the
              year, ensuring that each session is designed to foster growth,
              well-being and a sense of community.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: seasonalColors.primary }}
                  />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2 hover:scale-105"
              style={{
                backgroundColor: seasonalColors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  seasonalColors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = seasonalColors.primary;
              }}
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Main Image */}
            <div className="relative mb-8 rounded-3xl overflow-hidden shadow-xl group">
              <div className="aspect-[4/3] relative">
                <Image
                  src="1.jpg" // ADD YOUR IMAGE URL HERE - Image 1 (kids playing with ball)
                  alt="Children and participants engaging in inclusive fitness activities"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Impact Stats Section - Completely Redesigned */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: seasonalColors.primary }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Our Impact
                </h3>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {impactStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${seasonalColors.primary}20`,
                          }}
                        >
                          <IconComponent
                            className="w-5 h-5"
                            style={{ color: seasonalColors.primary }}
                          />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {stat.description}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom accent bar */}
              <div
                className="h-2 rounded-full mt-6"
                style={{
                  background: `linear-gradient(90deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
