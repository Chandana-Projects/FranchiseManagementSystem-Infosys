"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  AlertTriangle,
  Clock,
  TrendingDown,
  CheckCircle2,
  X,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Zap,
  PhoneCall,
  Activity,
  Cpu,
  Plus
} from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

interface EquipmentModalProps {
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

interface EquipmentAsset {
  id: string;
  name: string;
  serialNumber: string;
  outlet: string;
  category: "Espresso & Coffee" | "Kitchen Ovens" | "Refrigeration" | "POS & IT";
  status: "Operational" | "Maintenance Due" | "CRITICAL FAILURE";
  revenueLossPerHour: number;
  amcVendor: string;
  slaMaxHours: number;
  lastServiceDate: string;
  technicianEtaMin?: number;
}

const SAMPLE_ASSETS: EquipmentAsset[] = [
  {
    id: "EQ-101",
    name: "La Marzocco 2-Group Espresso Machine",
    serialNumber: "LM-STRADA-9921",
    outlet: "Pune FC Road",
    category: "Espresso & Coffee",
    status: "CRITICAL FAILURE",
    revenueLossPerHour: 6800,
    amcVendor: "BaristaTech National AMC",
    slaMaxHours: 3,
    lastServiceDate: "2026-07-15",
    technicianEtaMin: 42
  },
  {
    id: "EQ-102",
    name: "TurboChef High-Speed Panini Oven",
    serialNumber: "TC-BULLET-4402",
    outlet: "Mumbai Andheri East",
    category: "Kitchen Ovens",
    status: "Maintenance Due",
    revenueLossPerHour: 3200,
    amcVendor: "EquipPro Services Ltd",
    slaMaxHours: 6,
    lastServiceDate: "2026-06-20"
  },
  {
    id: "EQ-103",
    name: "Foster Commercial Walk-In Chiller",
    serialNumber: "FC-COLD-8810",
    outlet: "Nashik City Center",
    category: "Refrigeration",
    status: "Operational",
    revenueLossPerHour: 8500,
    amcVendor: "ColdChain Technologies",
    slaMaxHours: 2,
    lastServiceDate: "2026-08-10"
  },
  {
    id: "EQ-104",
    name: "Epson Thermal Receipt Printer Kiosk",
    serialNumber: "EP-TM-T88VI",
    outlet: "Aurangabad CIDCO",
    category: "POS & IT",
    status: "Operational",
    revenueLossPerHour: 1200,
    amcVendor: "RetailTech Solutions",
    slaMaxHours: 4,
    lastServiceDate: "2026-08-01"
  }
];

export default function EquipmentMaintenanceModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: EquipmentModalProps) {
  const [assets, setAssets] = useState<EquipmentAsset[]>(SAMPLE_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<EquipmentAsset>(SAMPLE_ASSETS[0]);
  const [ticketNotice, setTicketNotice] = useState<string | null>(null);

  const handleReportBreakdown = (assetId: string) => {
    playTechChime();
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "CRITICAL FAILURE", technicianEtaMin: 120 }
          : a
      )
    );
    setTicketNotice(`Emergency SOS Ticket dispatched to AMC Partner. Contractual SLA response clock started.`);
    setTimeout(() => setTicketNotice(null), 3500);
  };

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
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Store Equipment Asset Health & Downtime SLA Helpdesk
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  REVENUE BLEED & BREAK-FIX DESK
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Track machine asset health, estimate hourly revenue bleed during machine downtime, and monitor AMC contractor SLA response clocks
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

        {/* Ticket Notice Banner */}
        {ticketNotice && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {ticketNotice}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* 4 Summary Highlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Active Breakdown Loss */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-400" /> Active Downtime Bleed
              </div>
              <div className="text-2xl font-extrabold text-rose-400">
                ₹{assets.filter(a => a.status === "CRITICAL FAILURE").reduce((sum, a) => sum + a.revenueLossPerHour, 0).toLocaleString()} / hr
              </div>
              <div className="text-[10px] text-rose-300 font-bold">1 Machine Currently Down</div>
            </div>

            {/* KPI 2: Total Monitored Assets */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Monitored Assets
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">{assets.length} Units</div>
              <div className="text-[10px] text-slate-400">Across 4 Franchise Outlets</div>
            </div>

            {/* KPI 3: Mean SLA Response Time */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Contractual AMC SLA
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">&lt; 3.2 Hours</div>
              <div className="text-[10px] text-emerald-300 font-bold">100% On-Site Compliance</div>
            </div>

            {/* KPI 4: Preventative Health Score */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Equipment Health Score
              </div>
              <div className="text-2xl font-extrabold text-purple-400">92.8%</div>
              <div className="text-[10px] text-slate-400">3 Optimal • 1 Down</div>
            </div>
          </div>

          {/* Active Emergency Breakdown Spotlight */}
          {assets.some((a) => a.status === "CRITICAL FAILURE") && (
            <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-rose-300">ACTIVE CRITICAL FAILURE // STORE REVENUE IMPACT</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      LOSING ₹6,800 / HOUR
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/80">
                    Pune FC Road — La Marzocco Espresso boiler pressure failure. Technician from BaristaTech en route.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono text-xs">
                  <div className="text-rose-300 font-bold">ETA COUNTDOWN</div>
                  <div className="text-lg font-extrabold text-white">42 mins left</div>
                </div>
              </div>
            </div>
          )}

          {/* Asset Directory Ledger Table */}
          <div className="rounded-xl border overflow-hidden bg-slate-900/40" style={{ borderColor: t.border }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Equipment Registry & Service Ledger
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">AMC Response Contract Guarantees</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b text-slate-400 bg-slate-800/50" style={{ borderColor: t.border }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Asset Equipment</th>
                    <th className="px-4 py-3 font-semibold">Outlet Location</th>
                    <th className="px-4 py-3 font-semibold">Serial Number</th>
                    <th className="px-4 py-3 font-semibold text-right">Revenue Bleed / Hr</th>
                    <th className="px-4 py-3 font-semibold">AMC Contractor</th>
                    <th className="px-4 py-3 font-semibold">Operational Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-200">{asset.name}</td>
                      <td className="px-4 py-3 text-slate-300">{asset.outlet}</td>
                      <td className="px-4 py-3 font-mono text-cyan-400 text-[11px]">{asset.serialNumber}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-rose-400">
                        ₹{asset.revenueLossPerHour.toLocaleString("en-IN")}/hr
                      </td>
                      <td className="px-4 py-3 text-slate-300">{asset.amcVendor} (SLA: {asset.slaMaxHours}h)</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                            asset.status === "CRITICAL FAILURE"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : asset.status === "Maintenance Due"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {asset.status !== "CRITICAL FAILURE" ? (
                          <button
                            onClick={() => handleReportBreakdown(asset.id)}
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Report Breakdown
                          </button>
                        ) : (
                          <span className="text-[10px] text-cyan-400 font-mono font-bold">Tech Dispatched</span>
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
