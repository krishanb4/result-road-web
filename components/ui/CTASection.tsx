import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of participants who have transformed their lives
            through movement, community, and confidence building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-100 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-md"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
