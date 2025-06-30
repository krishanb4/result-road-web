// components/ui/AboutSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Award, ArrowRight } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const benefits = [
  "Qualified coaches with lived experience",
  "Evidence-based program design",
  "Flexible scheduling options",
  "Progress tracking and reporting",
];

const impactStats = [
  { value: "247+", label: "Participants" },
  { value: "15", label: "Programs" },
  { value: "8", label: "Facilities" },
  { value: "94%", label: "Satisfaction" },
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

            {/* Impact Stats Card */}
            <div
              className="rounded-3xl p-8 text-white shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
              }}
            >
              <Award className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-6">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                {impactStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative glow effect */}
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-20 -z-10"
              style={{
                background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
