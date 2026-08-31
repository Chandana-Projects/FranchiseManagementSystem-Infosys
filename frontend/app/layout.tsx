import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CookieConsentBanner from "../components/CookieConsentBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
  title: "OmniFranchise — Enterprise Franchise Intelligence Network",
  description: "Enterprise multi-outlet operations, dynamic yield pricing, CCTV vision audits, and automated stock telemetry platform.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Looping muted background video */}
        <video
          id="bg-video"
          src="/dashboard_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Gradient colour overlay */}
        <div id="bg-overlay" />
        {children}
        <CookieConsentBanner />
      </body>

    </html>
  );
}
