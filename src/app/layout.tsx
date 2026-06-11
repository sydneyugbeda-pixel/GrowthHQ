import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Growth HQ – Your AI-Powered Growth Headquarters",
  description:
    "The personal transformation platform for leaders, entrepreneurs, and high performers. AI coaching, assessments, learning, and growth tracking — all in one place.",
  keywords: ["growth", "AI coach", "leadership", "sales", "communication", "personal development"],
  openGraph: {
    title: "Growth HQ – Your AI-Powered Growth Headquarters",
    description: "Transform your communication, leadership, and business effectiveness with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
