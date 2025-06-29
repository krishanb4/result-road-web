// components/ui/ContactSection.tsx
"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "0456 194 251",
  },
  {
    icon: Mail,
    label: "Email",
    value: "nath@boxcamp.page",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Newcastle, Lake Macquarie & Hunter Region",
  },
];

export function ContactSection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
              Get In Touch
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Ready to learn more about Result Road? We'd love to hear from you.
              Contact us to discuss how we can support your journey.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: seasonalColors.primary,
                    }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-700 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Send us a message
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": seasonalColors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                style={{
                  backgroundColor: seasonalColors.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primary;
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
