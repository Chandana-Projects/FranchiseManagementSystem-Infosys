"use client";

import dynamic from "next/dynamic";

const FranchiseOSDashboard = dynamic(() => import("../../components/OutletMonitoring"), {
  ssr: false,
});

export default function AnalyticsPage() {
  return <FranchiseOSDashboard initialModule="analytics" />;
}
