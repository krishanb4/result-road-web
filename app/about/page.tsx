// app/about/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Award,
  Users,
  Target,
  Heart,
  Activity,
} from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Nathan Smith",
    role: "Program Director",
    bio: "Passionate about creating inclusive fitness environments with over 10 years of experience.",
    image: "/3.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Lead Coach",
    bio: "Specialized in adaptive fitness training and community building.",
    image: "/2.jpg",
  },
  {
    name: "Mike Chen",
    role: "Wellness Coordinator",
    bio: "Focused on mental health support and holistic wellness approaches.",
    image: "/1.jpg",
  },
];

const values = [
  {
    icon: Heart,
    title: "Inclusivity",
    description:
      "We believe everyone deserves access to fitness and wellness opportunities regardless of ability.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building strong, supportive networks that extend beyond our programs.",
  },
  {
    icon: Target,
    title: "Growth",
    description:
      "Fostering personal development through achievable goals and celebrating progress.",
  },
  {
    icon: Activity,
    title: "Excellence",
    description:
      "Maintaining high standards in program delivery and participant support.",
  },
];

export default function AboutPage() {
  const seasonalColors = useSeasonalColors();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              About Result Road
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Empowering individuals and families through inclusive fitness
              programs, community support, and personal development
              opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                At Result Road, our mission is to empower individuals and
                families by creating an inclusive, supportive hub that connects
                participants, their families, service providers and fitness
                partners.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                We run and oversee specialised fitness programs throughout the
                year, ensuring that each session is designed to foster growth,
                well-being and a sense of community.
              </p>

              <div className="space-y-4">
                {[
                  "247+ participants transformed",
                  "15 specialized programs delivered",
                  "8 facilities across the region",
                  "94% participant satisfaction rate",
                ].map((item, index) => (
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
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/1.jpg"
                  alt="Result Road community in action"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The principles that guide everything we do at Result Road.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <value.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Passionate professionals dedicated to making a difference in our
              community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p
                  className="font-semibold mb-4"
                  style={{ color: seasonalColors.primary }}
                >
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
