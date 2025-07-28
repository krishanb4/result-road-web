// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SeasonalThemeProvider } from "../components/ui/SeasonalThemeContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Result Road - Adaptive Fitness Programs",
  description:
    "Empowering lives through movement and community. Join our inclusive fitness programs designed for all abilities in Newcastle, Lake Macquarie & Nelson Bay.",
  keywords:
    "adaptive fitness, inclusive programs, disability support, community fitness, Newcastle, Lake Macquarie, Nelson Bay",
  openGraph: {
    title: "Result Road - Adaptive Fitness Programs",
    description: "Empowering lives through movement and community.",
    type: "website",
    url: "https://resultroad.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Result Road - Adaptive Fitness Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Result Road - Adaptive Fitness Programs",
    description: "Empowering lives through movement and community.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <SeasonalThemeProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                {children}
              </div>
            </ThemeProvider>
          </SeasonalThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
