export interface ExecutiveReportData {
  title: string;
  generatedAt: string;
  userRole: string;
  totalNetworkRevenue: string;
  activeOutletsCount: number;
  healthScore: string;
  outletsSummary: { name: string; state: string; sales: string; target: string; status: string }[];
}

export function triggerExecutivePdfExport(data: ExecutiveReportData) {
  if (typeof window === "undefined") return;

  // Set window title temporarily for PDF print file name
  const originalTitle = document.title;
  document.title = `OmniFranchise_Executive_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

  // Trigger standard browser print with printable PDF CSS rules
  window.print();

  // Restore original document title
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
