"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

// Import the complete homepage component
import {
  ModernHomePage,
  SeasonalThemeProvider,
  useSeasonalColors,
} from "../components/ui/ModernHomePage";

function getSeasonalTheme() {
  const theme = localStorage.getItem("seasonal-theme");

  if (!theme || theme !== "default") {
    localStorage.setItem("seasonal-theme", "default");
    return "default";
  }

  return theme;
}

// Loading component with seasonal theming
function SeasonalLoader() {
  const colors = useSeasonalColors();
  // You can invoke this function during component initialization or useEffect:
  useEffect(() => {
    const theme = getSeasonalTheme();
    console.log("Current seasonal theme:", theme);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}05)`,
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="text-center">
        <motion.div
          className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Loader2 className="w-12 h-12 text-white animate-spin" />

          {/* Sparkle effects */}
          <motion.div
            className="absolute top-2 right-2"
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-white opacity-80" />
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: colors.textPrimary }}
          >
            Result Road
          </h2>
          <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>
            Preparing your experience...
          </p>

          {/* Loading dots */}
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accent }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Error boundary component
function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  const colors = useSeasonalColors();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: colors.background }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: `${colors.accent}20` }}
        >
          <span className="text-2xl">⚠️</span>
        </div>

        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're sorry for the inconvenience. Please try refreshing the page.
        </p>

        <motion.button
          onClick={resetError}
          className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-500 bg-red-50 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Main page content wrapper
function PageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate loading time and handle initialization
    const initializePage = async () => {
      try {
        // Add any async initialization here
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  if (error) {
    return <ErrorFallback error={error} resetError={() => setError(null)} />;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <SeasonalLoader key="loading" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <ModernHomePage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main page component with error boundary
export default function HomePage() {
  return (
    <SeasonalThemeProvider>
      <PageContent />
    </SeasonalThemeProvider>
  );
}
