// signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import { Logo } from "@/components/ui/Logo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserCheck,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "participant",
    label: "Participant",
    description: "Join fitness programs and track your progress",
    icon: "🏃‍♂️",
  },
  {
    value: "instructor",
    label: "Instructor",
    description: "Lead sessions and support participants",
    icon: "👨‍🏫",
  },
  {
    value: "support_worker",
    label: "Support Worker",
    description: "Provide guidance and assistance to participants",
    icon: "🤝",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    description: "Manage care plans and staff coordination",
    icon: "🏢",
  },
  {
    value: "fitness_partner",
    label: "Fitness Partner",
    description: "Provide facilities and resources",
    icon: "🏋️‍♀️",
  },
];

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "participant" as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();
  const seasonalColors = useSeasonalColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.role,
        formData.displayName
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

        <div className="relative z-10">
          <div className="mb-16">
            <Logo size="lg" variant="white" />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Start your empowerment journey
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8 drop-shadow-sm">
              Join our inclusive community and discover your potential through
              movement, connection, and confidence building.
            </p>

            <div className="space-y-4">
              {[
                { text: "Access to qualified coaches", icon: CheckCircle },
                { text: "Personalized fitness programs", icon: Sparkles },
                { text: "Supportive community network", icon: CheckCircle },
                { text: "Progress tracking tools", icon: Sparkles },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <benefit.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform drop-shadow-sm" />
                  <span className="text-white/90 group-hover:text-white transition-colors drop-shadow-sm">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: seasonalColors.primary }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: seasonalColors.primaryHover }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
                  }}
                ></div>
              </div>
              <div>
                <p className="text-white font-semibold drop-shadow-sm">
                  Join 247+ participants
                </p>
                <p className="text-white/90 text-sm">
                  Building stronger, more confident lives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-white dark:bg-slate-800">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Join Result Road
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Create your account and start your journey
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
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                I am a...
              </label>
              <div className="relative group">
                <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors z-10" />
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent appearance-none transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                >
                  {roles.map((role) => (
                    <option
                      key={role.value}
                      value={role.value}
                      className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <p
                className="mt-2 text-sm p-3 rounded-lg border"
                style={{
                  backgroundColor: `${seasonalColors.primary}10`,
                  borderColor: `${seasonalColors.primary}30`,
                  color: seasonalColors.primary,
                }}
              >
                <span className="font-medium">
                  {roles.find((r) => r.value === formData.role)?.description}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 transition-colors"
                  style={{
                    color: showPassword ? seasonalColors.primary : undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    if (!showPassword) {
                      e.currentTarget.style.color = "";
                    }
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": seasonalColors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 transition-colors"
                  style={{
                    color: showConfirmPassword
                      ? seasonalColors.primary
                      : undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    if (!showConfirmPassword) {
                      e.currentTarget.style.color = "";
                    }
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded transition-colors mt-1"
                style={{
                  accentColor: seasonalColors.primary,
                }}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium transition-colors"
                  style={{
                    color: seasonalColors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = seasonalColors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = seasonalColors.primary;
                  }}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
              style={
                {
                  backgroundColor: seasonalColors.primary,
                  "--tw-ring-color": seasonalColors.primary,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.backgroundColor =
                    seasonalColors.primary;
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{
                  color: seasonalColors.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = seasonalColors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = seasonalColors.primary;
                }}
              >
                Sign in here
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
