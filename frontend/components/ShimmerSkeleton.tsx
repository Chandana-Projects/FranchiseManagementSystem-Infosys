"use client";

import React from "react";

interface ShimmerSkeletonProps {
  className?: string;
  isDark?: boolean;
}

export default function ShimmerSkeleton({ className = "h-6 w-full", isDark = true }: ShimmerSkeletonProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden relative animate-pulse ${className}`}
      style={{
        background: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(226, 232, 240, 0.8)",
      }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

export function KPICardSkeleton({ isDark = true }: { isDark?: boolean }) {
  return (
    <div
      className="p-5 rounded-2xl border space-y-3"
      style={{
        background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
      }}
    >
      <div className="flex items-center justify-between">
        <ShimmerSkeleton className="h-4 w-28" isDark={isDark} />
        <ShimmerSkeleton className="h-7 w-7 rounded-xl" isDark={isDark} />
      </div>
      <ShimmerSkeleton className="h-8 w-36" isDark={isDark} />
      <div className="flex items-center justify-between pt-1">
        <ShimmerSkeleton className="h-3 w-20" isDark={isDark} />
        <ShimmerSkeleton className="h-3 w-16" isDark={isDark} />
      </div>
    </div>
  );
}
