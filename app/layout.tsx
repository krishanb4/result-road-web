import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Result Road - Empowering Through Movement",
  description:
    "Inclusive fitness and personal development program for individuals with disability and mental health challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
