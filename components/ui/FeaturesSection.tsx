import { Activity, Users, Target, Heart } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Structured Programs",
    description:
      "Evidence-based fitness programs tailored for all ability levels with progressive difficulty options.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Supportive group settings with qualified coaches and peer support networks.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description:
      "Track progress in strength, coordination, and confidence with measurable outcomes.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Heart,
    title: "Inclusive Environment",
    description:
      "Non-judgmental, empowering space designed for personal growth and development.",
    color: "bg-pink-50 text-pink-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose Result Road?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full">
                <div
                  className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
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
