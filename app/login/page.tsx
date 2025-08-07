"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSeasonalColors } from "@/contexts/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const seasonalColors = useSeasonalColors();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton on server-side render
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        <div className="hidden lg:flex lg:w-1/2 bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-800">
          <div className="w-full max-w-md space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-all duration-300">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background with seasonal gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/20 rounded-full -translate-x-32 -translate-y-32 animate-bounce"></div>
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

        <div className="relative z-10">
          <div className="mb-16">
            <Logo size="lg" variant="white" />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Welcome back to your journey
            </h1>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow-sm">
              Continue building confidence, strength, and connections in our
              supportive community.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  247+
                </div>
                <div className="text-white/90 text-sm">Active Members</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  15+
                </div>
                <div className="text-white/90 text-sm">Programs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
            <blockquote className="text-white">
              <p className="text-lg mb-4 font-medium drop-shadow-sm">
                "Result Road has transformed not just my physical strength, but
                my confidence and sense of belonging in the community."
              </p>
              <footer className="text-white/90">
                <cite>— Sarah M., Program Participant</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-800">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Sign in to your Result Road account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors"
                  style={{
                    color: emailFocused ? seasonalColors.primary : "#94a3b8",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors"
                  style={{
                    color: passwordFocused ? seasonalColors.primary : "#94a3b8",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors hover:scale-110"
                  style={{
                    color: showPassword ? seasonalColors.primary : "#94a3b8",
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded transition-colors"
                  style={{
                    accentColor: seasonalColors.primary,
                  }}
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium transition-colors hover:underline"
                style={{
                  color: seasonalColors.primary,
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
              style={
                {
                  backgroundColor: loading
                    ? seasonalColors.primary
                    : seasonalColors.primary,
                  "--tw-ring-color": seasonalColors.primary,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primary;
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold transition-colors hover:underline"
                style={{
                  color: seasonalColors.primary,
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
