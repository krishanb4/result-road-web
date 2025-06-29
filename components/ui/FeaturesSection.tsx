import { Activity, Users, Target, Heart } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Structured Programs",
    description:
      "Evidence-based fitness programs tailored for all ability levels with progressive difficulty options.",
    colorClasses:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Supportive group settings with qualified coaches and peer support networks.",
    colorClasses:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description:
      "Track progress in strength, coordination, and confidence with measurable outcomes.",
    colorClasses:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: Heart,
    title: "Inclusive Environment",
    description:
      "Non-judgmental, empowering space designed for personal growth and development.",
    colorClasses:
      "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Why Choose Result Road?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our comprehensive approach combines fitness, community support, and
            personal development to create lasting positive change in
            participants' lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`${feature.colorClasses} rounded-2xl p-8 border h-full transition-all duration-300 hover:shadow-xl`}
              >
                <div
                  className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
