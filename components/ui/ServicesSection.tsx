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
    color: "bg-blue-50 border-blue-200",
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
    color: "bg-green-50 border-green-200",
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
    color: "bg-purple-50 border-purple-200",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What We Offer
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive services designed to support participants, service
            providers, and fitness partners in achieving their goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} rounded-2xl p-8 border`}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-700 font-medium">
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
