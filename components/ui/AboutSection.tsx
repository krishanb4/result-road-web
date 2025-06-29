import Link from "next/link";
import { CheckCircle, Award, ArrowRight } from "lucide-react";

const benefits = [
  {
    text: "Qualified coaches with lived experience",
    color: "text-emerald-500",
  },
  { text: "Evidence-based program design", color: "text-amber-500" },
  { text: "Flexible scheduling options", color: "text-orange-500" },
  { text: "Progress tracking and reporting", color: "text-cyan-500" },
];

const impactStats = [
  { value: "247+", label: "Participants" },
  { value: "15", label: "Programs" },
  { value: "8", label: "Facilities" },
  { value: "94%", label: "Satisfaction" },
];

export function AboutSection() {
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
                    className={`w-5 h-5 ${item.color} flex-shrink-0`}
                  />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-cyan-500 hover:from-emerald-600 hover:via-amber-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2 hover:scale-105"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-500 via-amber-500 via-orange-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl transition-all duration-300 hover:scale-105">
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-amber-500 via-orange-500 to-cyan-500 rounded-3xl blur-xl opacity-20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
