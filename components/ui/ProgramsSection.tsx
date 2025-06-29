import { CheckCircle, Clock, Calendar } from "lucide-react";

const programs = [
  {
    title: "Strength Building",
    level: "Easy",
    duration: "10 weeks",
    description:
      "Build foundational strength through progressive resistance training.",
    features: ["Upper body focus", "Core stability", "Functional movement"],
    colorClasses:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700",
    levelClasses:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600",
  },
  {
    title: "Balance & Coordination",
    level: "Moderate",
    duration: "8 weeks",
    description:
      "Improve balance, coordination, and proprioception through targeted exercises.",
    features: ["Balance control", "Coordination drills", "Fall prevention"],
    colorClasses:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700",
    levelClasses:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-600",
  },
  {
    title: "Confidence Building",
    level: "All Levels",
    duration: "12 weeks",
    description:
      "Build self-confidence and social skills through group activities.",
    features: ["Social interaction", "Leadership skills", "Self-esteem"],
    colorClasses:
      "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700",
    levelClasses:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-600",
  },
];

export function ProgramsSection() {
  return (
    <section
      id="programs"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Our Programs
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Structured 10-week programs designed to build strength,
            coordination, and confidence for participants of all ability levels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`${program.colorClasses} rounded-2xl p-8 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {program.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${program.levelClasses}`}
                >
                  {program.level}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6 text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{program.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">3x/week</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {program.description}
              </p>

              <ul className="space-y-3 mb-8">
                {program.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-200">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all duration-200">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
