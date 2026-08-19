import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "OmniFranchise — Enterprise Franchise Intelligence Network",
  description: "Enterprise multi-outlet operations, dynamic yield pricing, CCTV vision audits, and automated stock telemetry platform.",
  manifest: "/manifest.json",
  themeColor: "#090d16",
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
      </body>

    </html>
  );
}
