"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSeasonalColors } from "@/contexts/ThemeContext";

export function CTASection() {
  const seasonalColors = useSeasonalColors();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="4.jpg" // ADD YOUR IMAGE URL HERE - Use Image 1 or 4 (group activities)
          alt="Inclusive fitness community in action"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${seasonalColors.primary}E6, ${seasonalColors.primaryHover}E6)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95 drop-shadow-md">
            Join hundreds of participants who have transformed their lives
            through movement, community, and confidence building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm">
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
    </section>
  );
}
