import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Program Participant",
    content:
      "Result Road has transformed not just my physical strength, but my confidence and sense of belonging in the community.",
    rating: 5,
    colorClasses: "bg-emerald-50 dark:bg-emerald-900/20 border-l-emerald-500",
  },
  {
    name: "Mike Wilson",
    role: "Support Worker",
    content:
      "This gives us structure during support shifts. It's active, goal focused and my client loves coming here.",
    rating: 5,
    colorClasses: "bg-amber-50 dark:bg-amber-900/20 border-l-amber-500",
  },
  {
    name: "Lisa Chen",
    role: "Fitness Partner",
    content:
      "Being part of Result Road has brought such meaningful purpose to our facility. The impact is incredible.",
    rating: 5,
    colorClasses: "bg-cyan-50 dark:bg-cyan-900/20 border-l-cyan-500",
  },
];

export function TestimonialsSection() {
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.colorClasses} rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4`}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-current text-amber-400"
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
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
