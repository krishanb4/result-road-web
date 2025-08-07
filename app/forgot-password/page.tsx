"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const seasonalColors = useSeasonalColors();
  const { resetPassword } = useAuth();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);

      // Handle specific Firebase error codes
      let errorMessage = "Failed to send reset email";

      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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
              Reset your password securely
            </h1>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow-sm">
              Don't worry, it happens to the best of us. We'll help you get back
              to your fitness journey in no time.
            </p>

            {/* Security highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  🔐
                </div>
                <div className="text-white/90 text-sm">Secure Process</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  ⚡
                </div>
                <div className="text-white/90 text-sm">Quick Recovery</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
            <blockquote className="text-white">
              <p className="text-lg mb-4 font-medium drop-shadow-sm">
                "The support team at Result Road is amazing - they helped me get
                back into my account within minutes!"
              </p>
              <footer className="text-white/90">
                <cite>— Marcus L., Program Participant</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-800">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                  Forgot Password?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Enter your email and we'll send you a reset link
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
                        color: emailFocused
                          ? seasonalColors.primary
                          : "#94a3b8",
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
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
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
                      <span>Sending Reset Link...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold transition-colors hover:underline"
                    style={{
                      color: seasonalColors.primary,
                    }}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${seasonalColors.primary}20`,
                    }}
                  >
                    <CheckCircle
                      className="w-8 h-8"
                      style={{
                        color: seasonalColors.primary,
                      }}
                    />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Email
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  We've sent a password reset link to
                </p>
                <p className="text-slate-900 dark:text-white font-semibold mt-1">
                  {email}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  What's next?
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <span>Check your inbox for our email</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <span>Click the reset link in the email</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <span>Create your new password</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="font-semibold transition-colors hover:underline"
                    style={{
                      color: seasonalColors.primary,
                    }}
                  >
                    try again
                  </button>
                </p>
              </div>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
