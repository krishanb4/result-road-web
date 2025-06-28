import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-[fade-in_0.6s_ease-out]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Empowering Through
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Movement & Connection
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              An inclusive fitness and personal development program designed to
              support individuals living with disability and mental health
              challenges through movement, community, and confidence building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
              >
                <span>Join Result Road</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
