import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import CookieConsentBanner from "../components/CookieConsentBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: {
    default: "OmniFranchise — Enterprise Franchise Intelligence Network",
    template: "%s | OmniFranchise AI",
  },
  description: "Enterprise multi-outlet operations, predictive XGBoost sales forecasting, CCTV vision audits, and automated stock telemetry platform.",
  keywords: ["Franchise Management", "Multi-Outlet Operations", "FastAPI ML", "Next.js 16", "Enterprise Retail", "Supply Chain Intelligence", "HACCP Food Safety"],
  authors: [{ name: "Abhishek Pattnaik", url: "https://github.com/AbhishekPattnaik124" }],
  creator: "Abhishek Pattnaik",
  publisher: "OmniFranchise Systems",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "OmniFranchise — Enterprise Franchise Intelligence Network",
    description: "Multi-tenant AI operations and franchise intelligence network platform built with Next.js 16, Express, and FastAPI.",
    url: "https://github.com/Chandana-Projects/FranchiseManagementSystem",
    siteName: "OmniFranchise AI",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "OmniFranchise Enterprise Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniFranchise — Enterprise Franchise Intelligence Network",
    description: "Production-grade AI operations and franchise intelligence network for multi-outlet retail & F&B.",
    images: ["/logo.png"],
    creator: "@AbhishekPattnaik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Looping muted background video */}
        <video
          id="bg-video"
          src="/dashboard_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        {/* Gradient colour overlay */}
        <div id="bg-overlay" />
        <div className="relative z-10 flex-1 flex flex-col w-full min-h-screen">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
        <CookieConsentBanner />
      </body>

    </html>
  );
}
