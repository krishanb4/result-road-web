// components/ui/Footer.tsx
"use client";

import { Heart } from "lucide-react";
import { Logo } from "./Logo";
import { useSeasonalColors } from "@/contexts/ThemeContext";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Programs", href: "/programs" },
  { label: "Get Started", href: "/signup" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Help Center", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  const seasonalColors = useSeasonalColors();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo size="md" variant="white" />
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Empowering lives through movement and community. Building
              confidence, structure and purpose for individuals with disability
              and mental health challenges.
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-200"
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
                  <div className="w-5 h-5 bg-white rounded opacity-70"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-white relative group"
                  >
                    {link.label}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: seasonalColors.primary }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-white relative group"
                  >
                    {link.label}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: seasonalColors.primary }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Result Road. All rights reserved. Empowering lives through
              movement and community.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-slate-400 text-sm">Built with</span>
              <Heart
                className="w-4 h-4 fill-current animate-pulse"
                style={{ color: seasonalColors.primary }}
              />
              <span className="text-slate-400 text-sm">for our community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
