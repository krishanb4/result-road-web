import Link from "next/link";
import { CheckCircle, Award, ArrowRight } from "lucide-react";

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
  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              About Result Road
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              At Result Road, our mission is to empower individuals and families
              by creating an inclusive, supportive hub that connects
              participants, their families, service providers and fitness
              partners.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We run and oversee specialised fitness programs throughout the
              year, ensuring that each session is designed to foster growth,
              well-being and a sense of community.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-white">
              <Award className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-6">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                {impactStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-primary-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
