// app/contact/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  HeadphonesIcon,
} from "lucide-react";
import Image from "next/image";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    value: "0456 194 251",
    description: "Call us during business hours for immediate assistance",
    available: "Mon-Fri 9AM-5PM",
  },
  {
    icon: Mail,
    title: "Email",
    value: "nath@boxcamp.page",
    description: "Send us an email and we'll respond within 24 hours",
    available: "24/7 Response",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Newcastle, Lake Macquarie & Hunter Region",
    description: "We serve multiple locations across the region",
    available: "8 Facilities",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    value: "Online Support",
    description: "Chat with our team during business hours",
    available: "Mon-Fri 9AM-5PM",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
  { day: "Sunday", hours: "Closed" },
  { day: "Public Holidays", hours: "Closed" },
];

const teamMembers = [
  {
    name: "Nathan Smith",
    role: "Program Director",
    email: "nath@boxcamp.page",
    phone: "0456 194 251",
    specialties: ["Program Development", "Community Outreach", "Partnerships"],
    image: "/3.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Lead Coach",
    email: "sarah@resultroad.com.au",
    phone: "0456 194 252",
    specialties: ["Adaptive Training", "Group Programs", "Assessment"],
    image: "/2.jpg",
  },
  {
    name: "Mike Chen",
    role: "Wellness Coordinator",
    email: "mike@resultroad.com.au",
    phone: "0456 194 253",
    specialties: [
      "Mental Health Support",
      "Wellness Planning",
      "Family Services",
    ],
    image: "/1.jpg",
  },
];

const inquiryTypes = [
  {
    icon: Users,
    title: "Program Enrollment",
    description: "Questions about joining our programs and getting started",
  },
  {
    icon: Calendar,
    title: "Schedule Information",
    description: "Program schedules, session times, and availability",
  },
  {
    icon: HeadphonesIcon,
    title: "General Support",
    description: "General questions about Result Road and our services",
  },
  {
    icon: Phone,
    title: "Partnership Inquiries",
    description: "Collaboration opportunities and community partnerships",
  },
];

export default function ContactPage() {
  const seasonalColors = useSeasonalColors();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ready to start your Result Road journey? We're here to answer your
              questions, provide information, and help you take the next step
              towards better health and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              How to Reach Us
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose the contact method that works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: seasonalColors.primary }}
                >
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p
                  className="text-lg font-semibold mb-3"
                  style={{ color: seasonalColors.primary }}
                >
                  {method.value}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {method.description}
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {method.available}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Send us a Message
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": seasonalColors.primary,
                        } as React.CSSProperties
                      }
                      placeholder="0400 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                  >
                    <option value="">Select an inquiry type</option>
                    <option value="enrollment">Program Enrollment</option>
                    <option value="schedule">Schedule Information</option>
                    <option value="support">General Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${seasonalColors.primary}20` }}
                  >
                    <Clock
                      className="w-6 h-6"
                      style={{ color: seasonalColors.primary }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                    >
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {schedule.day}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: seasonalColors.primary }}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Types */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  What can we help you with?
                </h3>
                <div className="space-y-4">
                  {inquiryTypes.map((type, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                        style={{
                          backgroundColor: `${seasonalColors.primary}20`,
                        }}
                      >
                        <type.icon
                          className="w-5 h-5"
                          style={{ color: seasonalColors.primary }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {type.title}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div
                className="rounded-3xl p-8 text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
                }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="mb-4 opacity-90">
                  For urgent matters or emergencies related to our programs,
                  please call our emergency line.
                </p>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg font-semibold">0456 194 251</span>
                </div>
              </div>
            </div>
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
              Get to know the passionate professionals behind Result Road.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
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

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                    Specialties:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: seasonalColors.primary }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
