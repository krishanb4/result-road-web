// components/ui/FeaturesSection.tsx - Refactored
"use client";

import { Activity, Users, Target, Heart } from "lucide-react";
import { SeasonalCard, SeasonalIcon } from "./SeasonalCard";

const features = [
  {
    icon: Activity,
    title: "Structured Programs",
    description:
      "Evidence-based fitness programs tailored for all ability levels with progressive difficulty options.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Supportive group settings with qualified coaches and peer support networks.",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description:
      "Track progress in strength, coordination, and confidence with measurable outcomes.",
  },
  {
    icon: Heart,
    title: "Inclusive Environment",
    description:
      "Non-judgmental, empowering space designed for personal growth and development.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Why Choose Result Road?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our comprehensive approach combines fitness, community support, and
            personal development to create lasting positive change in
            participants' lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <SeasonalCard className="h-full">
                <SeasonalIcon icon={feature.icon} size="lg" className="mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </SeasonalCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
