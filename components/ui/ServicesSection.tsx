import { Users, Shield, Activity } from "lucide-react";

const services = [
  {
    title: "For Participants",
    description:
      "Join fitness programs, track your progress, and build confidence in a supportive environment.",
    features: [
      "Personal progress tracking",
      "Flexible scheduling",
      "Qualified support",
      "Community connection",
    ],
    icon: Users,
    colorClasses:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700",
    iconClasses:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "For Service Providers",
    description:
      "Manage clients, coordinate care plans, and track outcomes with our comprehensive platform.",
    features: [
      "Client management",
      "Care plan coordination",
      "Progress reporting",
      "Staff assignment",
    ],
    icon: Shield,
    colorClasses:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700",
    iconClasses:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    title: "For Fitness Partners",
    description:
      "Provide facilities and resources while being part of a meaningful community impact.",
    features: [
      "Facility management",
      "Instructor coordination",
      "Resource allocation",
      "Impact reporting",
    ],
    icon: Activity,
    colorClasses:
      "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700",
    iconClasses:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-white dark:bg-slate-800 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            What We Offer
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive services designed to support participants, service
            providers, and fitness partners in achieving their goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.colorClasses} rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div
                className={`w-12 h-12 ${service.iconClasses} rounded-xl flex items-center justify-center mb-6`}
              >
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
