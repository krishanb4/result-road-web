import { CheckCircle, Clock, Calendar } from "lucide-react";

const programs = [
  {
    title: "Strength Building",
    level: "Easy",
    duration: "10 weeks",
    description:
      "Build foundational strength through progressive resistance training.",
    features: ["Upper body focus", "Core stability", "Functional movement"],
    levelColor: "bg-green-100 text-green-700 border-green-200",
  },
  {
    title: "Balance & Coordination",
    level: "Moderate",
    duration: "8 weeks",
    description:
      "Improve balance, coordination, and proprioception through targeted exercises.",
    features: ["Balance control", "Coordination drills", "Fall prevention"],
    levelColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    title: "Confidence Building",
    level: "All Levels",
    duration: "12 weeks",
    description:
      "Build self-confidence and social skills through group activities.",
    features: ["Social interaction", "Leadership skills", "Self-esteem"],
    levelColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
];

export function ProgramsSection() {
  return (
    <section id="programs" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Our Programs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Structured 10-week programs designed to build strength,
            coordination, and confidence for participants of all ability levels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {program.title}
                </h3>
                <span
                  className={`px-3 py-1 w-auto rounded-full text-sm font-medium border ${program.levelColor}`}
                >
                  {program.level}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{program.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">3x/week</span>
                </div>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {program.description}
              </p>

              <ul className="space-y-3 mb-8">
                {program.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
