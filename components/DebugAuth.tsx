// components/DebugAuth.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function DebugAuth() {
  const { user, userProfile, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  const handleTestSignUp = async () => {
    try {
      setError(null);
      await signUp(email, password, "participant", "Test User");
      console.log("Test signup successful");
    } catch (error: any) {
      const errorMessage = error?.message || "Test signup failed";
      setError(errorMessage);
      console.error("Test signup failed:", error);
    }
  };

  const handleTestSignIn = async () => {
    try {
      setError(null);
      await signIn(email, password);
      console.log("Test signin successful");
    } catch (error: any) {
      const errorMessage = error?.message || "Test signin failed";
      setError(errorMessage);
      console.error("Test signin failed:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-4 shadow-lg max-w-sm transition-colors duration-300 z-50">
      <h3 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">
        Auth Debug Panel
      </h3>
      <div className="text-xs space-y-1 mb-3 text-slate-700 dark:text-slate-300">
        <div>Loading: {loading ? "✅" : "❌"}</div>
        <div>User: {user ? "✅" : "❌"}</div>
        <div>Profile: {userProfile ? "✅" : "❌"}</div>
        <div>Error: {error ? "❌" : "✅"}</div>
        <div>
          URL: {typeof window !== "undefined" ? window.location.href : "N/A"}
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 mb-2 p-1 bg-red-50 dark:bg-red-900/20 rounded transition-colors duration-300">
          {error}
        </div>
      )}

      {user && (
        <div className="text-xs mb-2 p-1 bg-emerald-50 dark:bg-emerald-900/20 rounded transition-colors duration-300">
          <div className="text-emerald-700 dark:text-emerald-300">
            Email: {user.email}
          </div>
          <div className="text-emerald-700 dark:text-emerald-300">
            Role: {userProfile?.role || "No role"}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full text-xs p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full text-xs p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-300"
        />
        <div className="flex space-x-1">
          <button
            onClick={handleTestSignUp}
            disabled={loading}
            className="text-xs bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors duration-300 disabled:opacity-50"
          >
            Sign Up
          </button>
          <button
            onClick={handleTestSignIn}
            disabled={loading}
            className="text-xs bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-2 py-1 rounded transition-colors duration-300 disabled:opacity-50"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
