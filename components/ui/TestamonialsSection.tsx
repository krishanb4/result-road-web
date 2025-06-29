// components/ui/TestimonialsSection.tsx
"use client";

import { Star } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Program Participant",
    content:
      "Result Road has transformed not just my physical strength, but my confidence and sense of belonging in the community.",
    rating: 5,
  },
  {
    name: "Mike Wilson",
    role: "Support Worker",
    content:
      "This gives us structure during support shifts. It's active, goal focused and my client loves coming here.",
    rating: 5,
  },
  {
    name: "Lisa Chen",
    role: "Fitness Partner",
    content:
      "Being part of Result Road has brought such meaningful purpose to our facility. The impact is incredible.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Real stories from our participants and partners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            // Create different opacity levels for variety
            const opacityLevels = ["10", "15", "20"];
            const borderOpacityLevels = ["30", "40", "50"];

            return (
              <div
                key={index}
                className="rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4"
                style={{
                  backgroundColor: `${seasonalColors.primary}${opacityLevels[index]}`,
                  borderLeftColor: seasonalColors.primary,
                  borderWidth: "4px 1px 1px 4px",
                  borderStyle: "solid",
                  borderColor: `transparent ${seasonalColors.primary}${borderOpacityLevels[index]} ${seasonalColors.primary}${borderOpacityLevels[index]} ${seasonalColors.primary}`,
                }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: seasonalColors.primary }}
                    />
                  ))}
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: seasonalColors.primary }}
                  >
                    {testimonial.role}
                  </div>
                </div>

                {/* Decorative quote mark */}
                <div
                  className="absolute top-6 right-6 text-6xl font-bold opacity-20"
                  style={{ color: seasonalColors.primary }}
                >
                  "
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Ready to share your own success story?
          </p>
          <button
            className="text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2 hover:scale-105"
            style={{
              backgroundColor: seasonalColors.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                seasonalColors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = seasonalColors.primary;
            }}
          >
            <span>Join Our Community</span>
          </button>
        </div>
      </div>
    </section>
  );
}
