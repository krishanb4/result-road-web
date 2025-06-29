import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-500  via-orange-500 to-cyan-500 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of participants who have transformed their lives
            through movement, community, and confidence building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:scale-105">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2">
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
