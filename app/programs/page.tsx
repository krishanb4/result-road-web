// app/programs/page.tsx
"use client";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Heart,
  Activity,
  Award,
  Star,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const programFormats = [
  {
    icon: User,
    title: "Solo Format",
    description:
      "Personalised 10-week program at your own pace with individualised plans tailored to your goals and fitness level.",
    features: [
      "Self-paced progression",
      "Individualised plans",
      "Personal focus",
      "Flexible scheduling",
    ],
  },
  {
    icon: Users,
    title: "Team Format",
    description:
      "Structured 10-week program in a class setting led by an instructor with group motivation and camaraderie.",
    features: [
      "Group motivation",
      "Instructor guidance",
      "Collaborative environment",
      "Shared progress",
    ],
  },
];
const programLevels = [
  {
    level: "Entry Level",
    description:
      "Ideal for beginners or those returning to fitness, focusing on building foundational skills, improving basic fitness and gaining confidence.",
    color: "#10b981",
  },
  {
    level: "Moderate Level",
    description:
      "Designed for those with some experience, introducing more challenging workouts and techniques while building on the basics.",
    color: "#f59e0b",
  },
  {
    level: "Advanced Level",
    description:
      "Tailored for those ready for intensive and complex workouts, pushing participants to refine skills and achieve peak fitness.",
    color: "#ef4444",
  },
];
const soloPrograms = [
  {
    title: "Balance and Flow",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Progressive program designed to enhance stability, flexibility and balance. Builds core strength and body awareness.",
    outcomes: [
      "Improved core strength",
      "Enhanced flexibility",
      "Better balance",
      "Increased confidence",
    ],
    image: "/1.jpg",
    featured: true,
  },
  {
    title: "Strength and Stability",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Focus on building foundational muscle strength while maintaining and improving stability through progressive exercises.",
    outcomes: [
      "Increased muscle tone",
      "Better posture",
      "Stronger core",
      "Enhanced coordination",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Power and Endurance",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Combines strength training with cardiovascular conditioning to build explosive power and enhance endurance.",
    outcomes: [
      "Increased stamina",
      "Improved cardiovascular health",
      "Greater athletic performance",
      "Enhanced power",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Agility and Speed",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Enhances quickness, coordination and overall athleticism through drills focusing on reaction time, footwork and speed.",
    outcomes: [
      "Enhanced agility",
      "Faster movement",
      "Improved coordination",
      "Greater athletic confidence",
    ],
    image: "/4.jpg",
    featured: false,
  },
  {
    title: "Core and Upper Body Sculpt",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Focused on building a strong, stable core and enhancing upper body strength through progressive sculpting exercises.",
    outcomes: [
      "Improved posture",
      "Enhanced upper body strength",
      "Stable powerful core",
      "Defined muscle tone",
    ],
    image: "/2.jpg",
    featured: false,
  },
  {
    title: "Total Body Master",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Advanced program bringing together all elements of fitness - strength, endurance, agility and flexibility.",
    outcomes: [
      "Complete fitness mastery",
      "Enhanced strength",
      "Improved agility",
      "Better balance",
    ],
    image: "/1.jpg",
    featured: true,
  },
  {
    title: "Bodyweight Beast",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo",
    description:
      "Dynamic calisthenics program using only bodyweight to build impressive strength, flexibility and endurance.",
    outcomes: [
      "Enhanced control",
      "Increased power",
      "Master bodyweight movements",
      "Improved flexibility",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Zen Stretch",
    levels: ["Entry", "Moderate", "Advanced"],
    duration: "10 weeks",
    format: "Solo & Team",
    description:
      "Calming program enhancing flexibility and reducing stress through gentle yoga flows and mindful stretching.",
    outcomes: [
      "Improved flexibility",
      "Reduced stress",
      "Enhanced mobility",
      "Inner peace",
    ],
    image: "/4.jpg",
    featured: false,
  },
];
const teamPrograms = [
  {
    title: "Rhythm and Motion",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Exciting dance and movement program combining different dance styles and creative movement exercises.",
    outcomes: [
      "Improved coordination",
      "Enhanced cardiovascular health",
      "Better rhythm",
      "Renewed love for movement",
    ],
    image: "/1.jpg",
    featured: false,
  },
  {
    title: "BoxCamp",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Fun and energetic team boxing class with punching bags, basic techniques and engaging fitness games.",
    outcomes: [
      "Increased confidence",
      "Great workout",
      "Basic boxing skills",
      "Team camaraderie",
    ],
    image: "/2.jpg",
    featured: true,
  },
  {
    title: "Kick Blast",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Exhilarating class combining kickboxing fundamentals with fun, engaging workouts and basic techniques.",
    outcomes: [
      "Enhanced fitness",
      "Kickboxing skills",
      "Increased confidence",
      "Great workout experience",
    ],
    image: "/3.jpg",
    featured: false,
  },
  {
    title: "Wrestle Time",
    levels: ["Entry"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Engaging class introducing wrestling fundamentals in a fun, supportive, no-contact team environment.",
    outcomes: [
      "Improved strength",
      "Enhanced agility",
      "Wrestling basics",
      "Increased confidence",
    ],
    image: "/4.jpg",
    featured: false,
  },
  {
    title: "Kick Punch and Wrestle",
    levels: ["Moderate"],
    duration: "10 weeks",
    format: "Team",
    description:
      "Intensive program with dynamic rotation of boxing, kickboxing, and wrestling. Designed for those who thrive with structure.",
    outcomes: [
      "Enhanced discipline",
      "Physical fitness",
      "Self-confidence",
      "Personal growth",
    ],
    image: "/2.jpg",
    featured: true,
  },
  {
    title: "Fun and Fit",
    levels: ["Entry", "Moderate"],
    duration: "10 weeks",
    format: "Team",
    description:
      "High-energy, game-based program with fun activities making fitness feel like a party for all ages and abilities.",
    outcomes: [
      "Active lifestyle",
      "Improved coordination",
      "Fitness enjoyment",
      "Social connection",
    ],
    image: "/1.jpg",
    featured: false,
  },
];
export default function ProgramsPage() {
  const seasonalColors = useSeasonalColors();
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "#10b981";
      case "Moderate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return seasonalColors.primary;
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      {/* Hero Section with Background Image */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/1.jpg" // Replace with your desired background image path
            alt="Result Road programs background"
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
              Our Programs
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Structured, evidence-based 10-week programs designed to build
              strength, coordination, and confidence for participants of all
              ability levels. Choose between Solo and Team formats.
            </p>
          </div>
        </div>
      </section>
      {/* Program Formats */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Program Formats
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose the format that best suits your learning style and
              preferences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {programFormats.map((format, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <format.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {format.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {format.description}
                </p>
                <div className="space-y-3">
                  {format.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: seasonalColors.primary }}
                      />
                      <span className="text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Program Levels */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Program Levels
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We assess each participant to guide them to the level that best
              suits their current abilities and goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programLevels.map((level, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${level.color}20` }}
                >
                  <Target className="w-8 h-8" style={{ color: level.color }} />
                </div>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: level.color }}
                >
                  {level.level}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Solo Programs */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Solo Programs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Personalised programs that allow you to progress at your own pace
              with individualised plans.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {soloPrograms.map((program, index) => (
              <div
                key={index}
                className={`bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  program.featured ? "ring-2 ring-opacity-50" : ""
                }`}
                style={{}}
                // To customize the ring color, use Tailwind's ring-* utilities or add a custom className if needed.
              >
                {program.featured && (
                  <div
                    className="px-6 py-2 text-white text-sm font-semibold flex items-center justify-center space-x-2"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Popular Program</span>
                  </div>
                )}
                <div className="relative h-48">
                  <Image
                    src={program.image}
                    alt={program.title}
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
                        {program.format}
                      </span>
                      <span className="text-white font-semibold">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {program.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.levels.map((level, levelIndex) => (
                      <span
                        key={levelIndex}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getLevelColor(level) }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        Expected Outcomes:
                      </h4>
                      <div className="space-y-2">
                        {program.outcomes.map((outcome, outIndex) => (
                          <div
                            key={outIndex}
                            className="flex items-start space-x-3"
                          >
                            <Target
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: seasonalColors.primary }}
                            />
                            <span className="text-slate-600 dark:text-slate-300 text-sm">
                              {outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href="/signup"
                      className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                      style={{ backgroundColor: seasonalColors.primary }}
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Programs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Team Programs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Structured group programs led by instructors, emphasizing
              collaboration, encouragement and shared progress.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {teamPrograms.map((program, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  program.featured ? "ring-2 ring-opacity-50" : ""
                }`}
                // To customize the ring color, use Tailwind's ring-* utilities or add a custom className if needed.
                style={{}}
              >
                {program.featured && (
                  <div
                    className="px-6 py-2 text-white text-sm font-semibold flex items-center justify-center space-x-2"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    <Star className="w-4 h-4" />
                    <span>Popular Program</span>
                  </div>
                )}
                <div className="relative h-48">
                  <Image
                    src={program.image}
                    alt={program.title}
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
                        {program.format}
                      </span>
                      <span className="text-white font-semibold">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {program.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.levels.map((level, levelIndex) => (
                      <span
                        key={levelIndex}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: getLevelColor(level) }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        Expected Outcomes:
                      </h4>
                      <div className="space-y-2">
                        {program.outcomes.map((outcome, outIndex) => (
                          <div
                            key={outIndex}
                            className="flex items-start space-x-3"
                          >
                            <Target
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: seasonalColors.primary }}
                            />
                            <span className="text-slate-600 dark:text-slate-300 text-sm">
                              {outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href="/contact"
                      className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                      style={{ backgroundColor: seasonalColors.primary }}
                    >
                      Enroll Now
                    </Link>
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
            Ready to Join a Program?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We assess each participant to help guide them to the program and
            level that best suits their current abilities and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Contact Us</span>
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
