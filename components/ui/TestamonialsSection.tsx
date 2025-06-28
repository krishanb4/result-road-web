import { Star } from "lucide-react";

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
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-slate-600">
            Real stories from our participants and partners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-slate-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
