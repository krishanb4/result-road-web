// components/ui/ServicesSection.tsx
"use client";

import Image from "next/image";
import { Users, Shield, Activity } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const services = [
  {
    title: "For Participants",
    description:
      "Join fitness programs, track your progress, and build confidence in a supportive environment.",
    features: [
      "Personal progress tracking",
      "Flexible scheduling",
      "Qualified support",
      "Community connection",
    ],
    icon: Users,
    imageUrl: "3.jpg", // ADD IMAGE URL HERE - Image 3 (man with prosthetic leg smiling)
    imageAlt: "Participant with prosthetic leg in gym setting with instructor",
  },
  {
    title: "For Service Providers",
    description:
      "Manage clients, coordinate care plans, and track outcomes with our comprehensive platform.",
    features: [
      "Client management",
      "Care plan coordination",
      "Progress reporting",
      "Staff assignment",
    ],
    icon: Shield,
    imageUrl: "2.jpg", // ADD IMAGE URL HERE - Image 2 (instructor with participant using battle ropes)
    imageAlt: "Instructor working with participant using battle ropes in gym",
  },
  {
    title: "For Fitness Partners",
    description:
      "Provide facilities and resources while being part of a meaningful community impact.",
    features: [
      "Facility management",
      "Instructor coordination",
      "Resource allocation",
      "Impact reporting",
    ],
    icon: Activity,
    imageUrl: "4.jpg", // ADD IMAGE URL HERE - Image 4 (group fitness class)
    imageAlt: "Inclusive group fitness class with diverse participants",
  },
];

export function ServicesSection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-white dark:bg-slate-800 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            What We Offer
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive services designed to support participants, service
            providers, and fitness partners in achieving their goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // Create different opacity levels for variety while keeping the same color
            const opacityLevels = ["15", "20", "25"];
            const borderOpacityLevels = ["30", "40", "50"];

            return (
              <div
                key={index}
                className="rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden group"
                style={{
                  backgroundColor: `${seasonalColors.primary}${opacityLevels[index]}`,
                  borderColor: `${seasonalColors.primary}${borderOpacityLevels[index]}`,
                }}
              >
                {/* Service Image */}
                {service.imageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Icon overlay */}
                    <div
                      className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                      style={{
                        backgroundColor: `${seasonalColors.primary}CC`,
                      }}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: seasonalColors.primary }}
                        />
                        <span className="text-slate-700 dark:text-slate-200 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
