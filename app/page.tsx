"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Import all section components
import { Navigation } from "@/components/ui/Navigation";
import { HeroSection } from "@/components/ui/HeroSection";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { AboutSection } from "@/components/ui/AboutSection";
import { ServicesSection } from "@/components/ui/ServicesSection";
import { ProgramsSection } from "@/components/ui/ProgramsSection";
import { TestimonialsSection } from "@/components/ui/TestamonialsSection";
import { CTASection } from "@/components/ui/CTASection";
import { ContactSection } from "@/components/ui/ContactSection";
import { Footer } from "@/components/ui/Footer";
import { DebugAuth } from "@/components/DebugAuth";

export default function HomePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("HomePage useEffect:", {
      user: !!user,
      userProfile: !!userProfile,
      loading,
    });

    if (!loading && user) {
      // If user is authenticated, redirect to dashboard
      // We don't require userProfile to exist for redirection
      console.log("Redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-slate-600 text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirect happens
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-slate-600 text-lg font-medium">
            Redirecting...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
