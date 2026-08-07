"use client";

import dynamic from "next/dynamic";

const FranchiseOSDashboard = dynamic(() => import("../../components/OutletMonitoring"), {
  ssr: false,
});

export default function AuditPage() {
  return <FranchiseOSDashboard initialModule="audit" />;
}
