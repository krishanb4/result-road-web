import { Activity, Heart } from "lucide-react";

const quickLinks = [
  { label: "About Us", href: "#about", color: "hover:text-emerald-500" },
  { label: "Services", href: "#services", color: "hover:text-amber-500" },
  { label: "Programs", href: "#programs", color: "hover:text-orange-500" },
  { label: "Get Started", href: "/signup", color: "hover:text-cyan-500" },
];

const supportLinks = [
  { label: "Contact Us", href: "#contact", color: "hover:text-emerald-500" },
  { label: "Help Center", href: "#", color: "hover:text-amber-500" },
  { label: "Privacy Policy", href: "#", color: "hover:text-orange-500" },
  { label: "Terms of Service", href: "#", color: "hover:text-cyan-500" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Result Road</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Empowering lives through movement and community. Building
              confidence, structure and purpose for individuals with disability
              and mental health challenges.
            </p>
            <div className="flex space-x-4">
              {[
                { color: "from-emerald-400 to-emerald-500" },
                { color: "from-amber-400 to-amber-500" },
                { color: "from-cyan-400 to-cyan-500" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-200`}
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
                    className={`text-slate-400 ${link.color} transition-colors`}
                  >
                    {link.label}
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
                    className={`text-slate-400 ${link.color} transition-colors`}
                  >
                    {link.label}
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
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span className="text-slate-400 text-sm">for our community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
