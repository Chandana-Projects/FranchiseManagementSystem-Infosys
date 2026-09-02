"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  FileText,
  Building,
  Flame,
  Scale,
  Calendar,
  DollarSign,
  Send,
  AlertOctagon
} from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

interface StatutoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint?: string;
    panel?: string;
    gridLine?: string;
  };
  accent?: string;
  isDark?: boolean;
}

interface StatutoryLicense {
  id: string;
  outlet: string;
  category: "FSSAI Food Safety" | "Fire Safety NOC" | "Commercial Lease" | "Municipal Trade" | "Signage Permit";
  licenseNumber: string;
  issuingAuthority: string;
  expiryDate: string;
  daysRemaining: number;
  status: "Active (Valid)" | "Expiring Soon (<30d)" | "CRITICAL OVERDUE";
  penaltyRisk: number;
}

const SAMPLE_LICENSES: StatutoryLicense[] = [
  {
    id: "LIC-01",
    outlet: "Aurangabad CIDCO",
    category: "FSSAI Food Safety",
    licenseNumber: "FSSAI-21523098000142",
    issuingAuthority: "Food Safety and Standards Authority",
    expiryDate: "2026-08-28",
    daysRemaining: -5,
    status: "CRITICAL OVERDUE",
    penaltyRisk: 250000
  },
  {
    id: "LIC-02",
    outlet: "Mumbai Andheri East",
    category: "Fire Safety NOC",
    licenseNumber: "MCGM-FIRE-88129",
    issuingAuthority: "Mumbai Fire Brigade Dept",
    expiryDate: "2026-09-18",
    daysRemaining: 16,
    status: "Expiring Soon (<30d)",
    penaltyRisk: 100000
  },
  {
    id: "LIC-03",
    outlet: "Pune FC Road",
    category: "Commercial Lease",
    licenseNumber: "LEASE-PUNE-2023-99",
    issuingAuthority: "Sub-Registrar Office Haveli",
    expiryDate: "2026-11-30",
    daysRemaining: 89,
    status: "Active (Valid)",
    penaltyRisk: 0
  },
  {
    id: "LIC-04",
    outlet: "Nashik City Center",
    category: "Municipal Trade",
    licenseNumber: "NMC-TRADE-44019",
    issuingAuthority: "Nashik Municipal Corporation",
    expiryDate: "2027-03-31",
    daysRemaining: 210,
    status: "Active (Valid)",
    penaltyRisk: 0
  }
];

export default function StatutoryComplianceModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: StatutoryModalProps) {
  const [licenses, setLicenses] = useState<StatutoryLicense[]>(SAMPLE_LICENSES);
  const [renewalNotice, setRenewalNotice] = useState<string | null>(null);

  const handleInitiateRenewal = (licId: string) => {
    playTechChime();
    setLicenses((prev) =>
      prev.map((l) =>
        l.id === licId ? { ...l, status: "Expiring Soon (<30d)", daysRemaining: 30 } : l
      )
    );
    setRenewalNotice(`Fast-Track Renewal Package initiated with Municipal Authorities for ${licId}. Escalation ticket closed.`);
    setTimeout(() => setRenewalNotice(null), 3500);
  };

  const overdueCount = licenses.filter((l) => l.status === "CRITICAL OVERDUE").length;
  const expiringCount = licenses.filter((l) => l.status === "Expiring Soon (<30d)").length;
  const totalRiskAmount = licenses.reduce((sum, l) => sum + l.penaltyRisk, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-6xl rounded-2xl border shadow-2xl overflow-hidden glass-card max-h-[94vh] flex flex-col transition-all"
        style={{ background: t.card, borderColor: t.border }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3"
          style={{ borderColor: t.gridLine || t.border }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Statutory Regulatory License & Legal Expiry Shield
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  LEGAL & PERMITS SHIELD
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Monitor mandatory FSSAI, Fire NOC, commercial lease, and municipal health permits with 3-tier corporate legal escalation
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTechChime();
              onClose();
            }}
            className="p-2 rounded-xl border transition-colors hover:bg-white/10"
            style={{ borderColor: t.border, color: t.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Banner */}
        {renewalNotice && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {renewalNotice}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* 4 Summary Highlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Overdue Licenses */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" /> Critical Overdue Licenses
              </div>
              <div className="text-2xl font-extrabold text-rose-400">{overdueCount} Overdue</div>
              <div className="text-[10px] text-rose-300 font-bold">Action Required Immediately</div>
            </div>

            {/* KPI 2: Expiring Soon */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Expiring &lt; 30 Days
              </div>
              <div className="text-2xl font-extrabold text-amber-400">{expiringCount} Permits</div>
              <div className="text-[10px] text-amber-300 font-bold">Renewal Applications Open</div>
            </div>

            {/* KPI 3: Legal Penalty Exposure */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-400" /> Statutory Penalty Risk
              </div>
              <div className="text-2xl font-extrabold text-purple-400">
                ₹{(totalRiskAmount / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-slate-400">Potential regulatory fine exposure</div>
            </div>

            {/* KPI 4: Total Monitored Permits */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Total Active Permits
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">{licenses.length} Documents</div>
              <div className="text-[10px] text-emerald-300 font-bold">Across 4 Operating Branches</div>
            </div>
          </div>

          {/* 3-Tier Automated Escalation Ladder */}
          <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tier Corporate Legal Escalation Protocol
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-slate-800/40 border-slate-700/60 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">LEVEL 1: 90 DAYS PRIOR</span>
                <h5 className="text-xs font-bold text-white">Store Manager Alert</h5>
                <p className="text-[11px] text-slate-400">Local franchise owner and outlet manager prompted with document checklist.</p>
              </div>

              <div className="p-3 rounded-lg border bg-slate-800/40 border-slate-700/60 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold">LEVEL 2: 60 DAYS PRIOR</span>
                <h5 className="text-xs font-bold text-white">Regional Operations Lead</h5>
                <p className="text-[11px] text-slate-400">Regional operations manager CC'd to verify renewal filing fee submission.</p>
              </div>

              <div className="p-3 rounded-lg border bg-slate-800/40 border-slate-700/60 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 font-bold">LEVEL 3: 30 DAYS PRIOR</span>
                <h5 className="text-xs font-bold text-white">Corporate Legal Counsel & VP</h5>
                <p className="text-[11px] text-slate-400">Automatic escalation to legal counsel to prevent store sealing or municipal closure.</p>
              </div>
            </div>
          </div>

          {/* Statutory Permits Matrix Table */}
          <div className="rounded-xl border overflow-hidden bg-slate-900/40" style={{ borderColor: t.border }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" /> Mandatory Franchise Statutory Ledger
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Government & Lease Compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b text-slate-400 bg-slate-800/50" style={{ borderColor: t.border }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">License Category</th>
                    <th className="px-4 py-3 font-semibold">Outlet Location</th>
                    <th className="px-4 py-3 font-semibold">Registration Number</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold text-right">Penalty Exposure</th>
                    <th className="px-4 py-3 font-semibold">Compliance Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-200">{lic.category}</td>
                      <td className="px-4 py-3 text-slate-300">{lic.outlet}</td>
                      <td className="px-4 py-3 font-mono text-cyan-400 text-[11px]">{lic.licenseNumber}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        {lic.expiryDate} ({lic.daysRemaining >= 0 ? `${lic.daysRemaining}d left` : `${Math.abs(lic.daysRemaining)}d OVERDUE`})
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-rose-400">
                        {lic.penaltyRisk > 0 ? `₹${lic.penaltyRisk.toLocaleString("en-IN")}` : "None"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                            lic.status === "CRITICAL OVERDUE"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse"
                              : lic.status === "Expiring Soon (<30d)"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {lic.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {lic.status !== "Active (Valid)" ? (
                          <button
                            onClick={() => handleInitiateRenewal(lic.id)}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Fast-Track Renewal
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">Compliant</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
