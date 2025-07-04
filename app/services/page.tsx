// app/services/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Clock,
  Users,
  Target,
  Heart,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Activity,
    title: "Personal Training",
    description:
      "One-on-one coaching tailored to individual needs and abilities.",
    features: [
      "Customized workout plans",
      "Progress tracking",
      "Adaptive equipment",
      "Flexible scheduling",
    ],
    price: "From $80/session",
    duration: "60 minutes",
    image: "/2.jpg",
  },
  {
    icon: Users,
    title: "Group Fitness Classes",
    description: "Inclusive group sessions fostering community and motivation.",
    features: [
      "Small group settings",
      "Peer support",
      "Qualified instructors",
      "Various ability levels",
    ],
    price: "From $25/class",
    duration: "45 minutes",
    image: "/4.jpg",
  },
  {
    icon: Heart,
    title: "Wellness Coaching",
    description: "Holistic approach to mental health and wellbeing support.",
    features: [
      "Mental health support",
      "Goal setting",
      "Lifestyle planning",
      "Stress management",
    ],
    price: "From $100/session",
    duration: "60 minutes",
    image: "/1.jpg",
  },
  {
    icon: Target,
    title: "Specialized Programs",
    description: "Targeted programs for specific conditions and goals.",
    features: [
      "Condition-specific training",
      "Rehabilitation support",
      "Medical partnerships",
      "Evidence-based methods",
    ],
    price: "From $150/program",
    duration: "8-12 weeks",
    image: "/3.jpg",
  },
];

const additionalServices = [
  {
    icon: Award,
    title: "Assessment & Planning",
    description:
      "Comprehensive fitness and wellness assessments to create personalized plans.",
  },
  {
    icon: Zap,
    title: "Equipment Training",
    description:
      "Learn to use adaptive fitness equipment safely and effectively.",
  },
  {
    icon: Users,
    title: "Family Support",
    description: "Programs and resources for family members and caregivers.",
  },
  {
    icon: Heart,
    title: "Community Events",
    description:
      "Regular social events and activities to build community connections.",
  },
];

export default function ServicesPage() {
  const seasonalColors = useSeasonalColors();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive fitness and wellness services designed to support
              your journey towards better health, increased confidence, and
              community connection.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Core Services
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Professional services tailored to meet diverse needs and
              abilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: seasonalColors.primary }}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {service.title}
                    </h3>
                    <div className="text-right">
                      <div
                        className="text-lg font-semibold"
                        style={{ color: seasonalColors.primary }}
                      >
                        {service.price}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {service.duration}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div
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
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Additional Support
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive support services to enhance your Result Road
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <service.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 relative"
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss which services are right for you and
            book your consultation.
          </p>
          <Link
            href="/contact"
            className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Contact Us Today</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
