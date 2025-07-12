// app/events/page.tsx
"use client";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Award,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const upcomingEvents = [
  {
    title: "Inclusive Sports Day",
    date: "July 15, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Newcastle Community Center",
    participants: "50+ expected",
    description:
      "A fun-filled day of adaptive sports activities, competitions, and community building.",
    highlights: [
      "Wheelchair basketball",
      "Adaptive swimming",
      "Team challenges",
      "Awards ceremony",
    ],
    image: "/4.jpg",
    featured: true,
    category: "Competition",
  },
  {
    title: "Wellness Workshop Series",
    date: "July 22, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Result Road Training Center",
    participants: "20 spots available",
    description:
      "Monthly workshop focusing on mental health, nutrition, and holistic wellness approaches.",
    highlights: [
      "Expert speakers",
      "Interactive sessions",
      "Resource sharing",
      "Q&A discussions",
    ],
    image: "/1.jpg",
    featured: false,
    category: "Workshop",
  },
  {
    title: "Family Fun Day",
    date: "August 5, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "Lakeside Park",
    participants: "Families welcome",
    description:
      "Bring the whole family for a day of inclusive activities, games, and community connection.",
    highlights: [
      "Family activities",
      "BBQ lunch",
      "Kids zone",
      "Information stalls",
    ],
    image: "/3.jpg",
    featured: false,
    category: "Community",
  },
  {
    title: "Strength Challenge",
    date: "August 18, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Result Road Gym",
    participants: "Program participants",
    description:
      "Showcase your progress with friendly strength and fitness challenges.",
    highlights: [
      "Personal records",
      "Team competitions",
      "Achievement certificates",
      "Celebration lunch",
    ],
    image: "/2.jpg",
    featured: true,
    category: "Challenge",
  },
];
const pastEvents = [
  {
    title: "Annual Gala Dinner",
    date: "May 20, 2025",
    participants: "120 attendees",
    description:
      "Celebration of achievements and community impact with awards and recognition.",
    image: "/1.jpg",
  },
  {
    title: "Adaptive Fitness Expo",
    date: "April 15, 2025",
    participants: "200+ visitors",
    description:
      "Equipment demonstrations, workshops, and community networking event.",
    image: "/4.jpg",
  },
  {
    title: "Mental Health Awareness Week",
    date: "March 10-16, 2025",
    participants: "Week-long series",
    description:
      "Daily workshops and activities focused on mental health and wellbeing.",
    image: "/2.jpg",
  },
];
const eventTypes = [
  {
    icon: Award,
    title: "Competitions",
    description:
      "Friendly competitions and challenges to showcase progress and achievements.",
  },
  {
    icon: Heart,
    title: "Community Events",
    description:
      "Social gatherings that bring our community together for fun and connection.",
  },
  {
    icon: Zap,
    title: "Workshops",
    description:
      "Educational sessions covering fitness, wellness, and personal development topics.",
  },
  {
    icon: Users,
    title: "Family Days",
    description:
      "Inclusive events designed for participants and their families to enjoy together.",
  },
];
export default function EventsPage() {
  const seasonalColors = useSeasonalColors();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      {/* Hero Section with Background Image */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/1.jpg" // Replace with your desired background image path
            alt="Result Road events background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Events & Activities
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Join us for exciting events, competitions, workshops, and
              community gatherings that celebrate progress and build lasting
              connections.
            </p>
          </div>
        </div>
      </section>
      {/* Event Types */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Types of Events
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We host a variety of events throughout the year to engage our
              community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventTypes.map((type, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <type.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {type.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Upcoming Events
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Mark your calendar for these exciting upcoming events and
              activities.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  event.featured ? "ring-2 ring-opacity-50" : ""
                } ${event.featured ? "" : ""}`}
                style={
                  event.featured
                    ? { boxShadow: `0 0 0 2px ${seasonalColors.primary}80` }
                    : {}
                }
              >
                {event.featured && (
                  <div
                    className="px-6 py-2 text-white text-sm font-semibold flex items-center justify-center space-x-2"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Featured Event</span>
                  </div>
                )}
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{
                          backgroundColor: `${seasonalColors.primary}CC`,
                        }}
                      >
                        {event.category}
                      </span>
                      <span className="text-white font-semibold">
                        {event.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {event.title}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                      <Clock
                        className="w-4 h-4"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                      <Users
                        className="w-4 h-4"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mb-8">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Event Highlights:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {event.highlights.map((highlight, highlightIndex) => (
                        <div
                          key={highlightIndex}
                          className="flex items-center space-x-2"
                        >
                          <Star
                            className="w-3 h-3 flex-shrink-0"
                            style={{ color: seasonalColors.primary }}
                          />
                          <span className="text-slate-600 dark:text-slate-300 text-sm">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Past Events */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Recent Events
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Take a look at some of our recent successful events and community
              gatherings.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-40">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-4 text-slate-600 dark:text-slate-300">
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: seasonalColors.primary }}
                    />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Users
                      className="w-4 h-4"
                      style={{ color: seasonalColors.primary }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: seasonalColors.primary }}
                    >
                      {event.participants}
                    </span>
                  </div>
                </div>
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
            Don't Miss Out on Future Events
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Stay connected with Result Road to be the first to know about
            upcoming events and activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Get Event Updates</span>
            </Link>
            <Link
              href="/programs"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>View Programs</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
