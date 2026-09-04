"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  FileWarning,
  Eye,
  TrendingDown,
  Lock,
  Unlock,
  CreditCard,
  Ban,
  Search,
  Download,
  Flame,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { playTechChime } from "@/lib/WebAudioSFX";

interface RoyaltyModalProps {
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

interface OutletAuditProfile {
  id: string;
  name: string;
  city: string;
  evasionRisk: "HIGH SUSPICION" | "MODERATE" | "CLEAN / LOW";
  reportedSales: number;
  estimatedTrueSales: number;
  lostRoyalty5Pct: number;
  cashCancellationRate: number; // normal < 1.5%
  noSaleDrawerPops: number; // normal < 4/day
  cashRatioReported: number; // regional avg is 22%
  regionalBenchmarkCashRatio: number;
}

const OUTLET_AUDIT_PROFILES: OutletAuditProfile[] = [
  {
    id: "out-4",
    name: "Aurangabad CIDCO",
    city: "Aurangabad",
    evasionRisk: "HIGH SUSPICION",
    reportedSales: 780000,
    estimatedTrueSales: 1120000,
    lostRoyalty5Pct: 17000,
    cashCancellationRate: 8.4,
    noSaleDrawerPops: 38,
    cashRatioReported: 4.2,
    regionalBenchmarkCashRatio: 22.0
  },
  {
    id: "out-3",
    name: "Mumbai Andheri East",
    city: "Mumbai",
    evasionRisk: "MODERATE",
    reportedSales: 1420000,
    estimatedTrueSales: 1580000,
    lostRoyalty5Pct: 8000,
    cashCancellationRate: 3.8,
    noSaleDrawerPops: 14,
    cashRatioReported: 12.5,
    regionalBenchmarkCashRatio: 18.0
  },
  {
    id: "out-2",
    name: "Pune FC Road",
    city: "Pune",
    evasionRisk: "CLEAN / LOW",
    reportedSales: 1890000,
    estimatedTrueSales: 1910000,
    lostRoyalty5Pct: 1000,
    cashCancellationRate: 1.1,
    noSaleDrawerPops: 2,
    cashRatioReported: 24.1,
    regionalBenchmarkCashRatio: 22.5
  },
  {
    id: "out-1",
    name: "Nashik City Center",
    city: "Nashik",
    evasionRisk: "CLEAN / LOW",
    reportedSales: 1650000,
    estimatedTrueSales: 1660000,
    lostRoyalty5Pct: 500,
    cashCancellationRate: 0.8,
    noSaleDrawerPops: 1,
    cashRatioReported: 21.8,
    regionalBenchmarkCashRatio: 20.0
  }
];

interface SuspiciousTxn {
  id: string;
  time: string;
  terminal: string;
  cashier: string;
  action: string;
  amount: number;
  anomalyReason: string;
}

const SAMPLE_TXNS: SuspiciousTxn[] = [
  { id: "TX-9021", time: "14:22:18", terminal: "POS-01", cashier: "Staff #104", action: "Post-Print Void", amount: 840, anomalyReason: "Order voided 90s after customer receipt printed" },
  { id: "TX-9022", time: "15:04:30", terminal: "POS-01", cashier: "Staff #104", action: "No-Sale Drawer Pop", amount: 0, anomalyReason: "Cash drawer opened manually with zero transaction" },
  { id: "TX-9023", time: "15:48:12", terminal: "POS-02", cashier: "Staff #108", action: "100% Cash Override", amount: 1250, anomalyReason: "100% manual manager discount applied without coupon code" },
  { id: "TX-9024", time: "17:15:02", terminal: "POS-01", cashier: "Staff #104", action: "Post-Print Void", amount: 620, anomalyReason: "Cash ring cancelled after kitchen KDS completed prep" },
  { id: "TX-9025", time: "19:30:45", terminal: "POS-01", cashier: "Staff #104", action: "No-Sale Drawer Pop", amount: 0, anomalyReason: "Drawer pop during peak evening rush hour" }
];

export default function RoyaltyEvasionAuditorModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: RoyaltyModalProps) {
  const [selectedOutlet, setSelectedOutlet] = useState<OutletAuditProfile>(OUTLET_AUDIT_PROFILES[0]);
  const [auditNoticeSent, setAuditNoticeSent] = useState(false);

  const chartComparisonData = [
    { metric: "Reported vs True Sales (₹L)", Reported: +(selectedOutlet.reportedSales / 100000).toFixed(1), EstimatedTrue: +(selectedOutlet.estimatedTrueSales / 100000).toFixed(1) },
    { metric: "Cash Ratio vs Regional Peer (%)", Reported: selectedOutlet.cashRatioReported, EstimatedTrue: selectedOutlet.regionalBenchmarkCashRatio },
    { metric: "Cash Cancellation Anomaly (%)", Reported: selectedOutlet.cashCancellationRate, EstimatedTrue: 1.5 }
  ];

  const handleIssueForensicNotice = () => {
    playTechChime();
    setAuditNoticeSent(true);
    setTimeout(() => setAuditNoticeSent(false), 3500);
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
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Franchise Royalty & POS Sales Evasion Anti-Fraud Auditor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  REVENUE UNDER-REPORTING DETECTOR
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Detect cash drawer "No-Sale" pops, post-print order voids, and un-declared cash sales evading franchisor 5% royalty
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleIssueForensicNotice}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 cursor-pointer shadow-xs"
            >
              <FileWarning className="w-3.5 h-3.5" /> Issue Forensic Audit Notice
            </button>
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
        </div>

        {/* Notice Banner */}
        {auditNoticeSent && (
          <div className="px-6 py-2 bg-rose-500/15 border-b border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Formal Forensic Audit Notice & POS Lockout Warning dispatched to {selectedOutlet.name} Owner and Legal Team.
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Outlet Risk Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OUTLET_AUDIT_PROFILES.map((out) => {
              const isSel = out.id === selectedOutlet.id;
              const isHigh = out.evasionRisk === "HIGH SUSPICION";
              const isMod = out.evasionRisk === "MODERATE";
              return (
                <button
                  key={out.id}
                  onClick={() => {
                    playTechChime();
                    setSelectedOutlet(out);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? "bg-rose-500/15 border-rose-500/60 ring-1 ring-rose-400 shadow-md"
                      : "bg-slate-900/30 border-slate-800 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold truncate" style={{ color: t.text }}>
                      {out.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isHigh ? "bg-rose-500/20 text-rose-400" : isMod ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {out.evasionRisk}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Lost Royalty: <span className="font-bold text-rose-400 font-mono">~₹{out.lostRoyalty5Pct.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {out.noSaleDrawerPops} No-Sale Pops • {out.cashCancellationRate}% Voids
                  </div>
                </button>
              );
            })}
          </div>

          {/* Anomaly Metrics Highlight Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Estimated Un-Reported Sales */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-400" /> Estimated Hidden Sales
              </div>
              <div className="text-2xl font-extrabold text-rose-400">
                ₹{((selectedOutlet.estimatedTrueSales - selectedOutlet.reportedSales) / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-rose-300 font-bold">
                Un-reported cash revenue gap
              </div>
            </div>

            {/* KPI 2: Lost 5% Royalty */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Lost 5% Royalty to HQ
              </div>
              <div className="text-2xl font-extrabold text-amber-400">
                ₹{selectedOutlet.lostRoyalty5Pct.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-amber-300/80">Owed under Master Franchise Agreement</div>
            </div>

            {/* KPI 3: Cash Void Rate */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-cyan-400" /> Post-Print Void Rate
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">{selectedOutlet.cashCancellationRate}%</div>
              <div className="text-[10px] text-slate-400">Regional baseline tolerance: &lt;1.5%</div>
            </div>

            {/* KPI 4: No-Sale Drawer Pops */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-purple-400" /> "No-Sale" Drawer Pops
              </div>
              <div className="text-2xl font-extrabold text-purple-400">
                {selectedOutlet.noSaleDrawerPops} Openings
              </div>
              <div className="text-[10px] text-purple-300 font-bold">Drawer opened without order</div>
            </div>
          </div>

          {/* Recharts Comparison Chart & Forensic Log Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart: Benchmark Deviation */}
            <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Auditor Benchmark Disparity: Reported vs. Peer Norms
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="metric" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="Reported" fill="#F43F5E" name="Outlet Reported" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="EstimatedTrue" fill="#10B981" name="Regional Benchmark / True Norm" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forensic POS Incident Logs */}
            <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-400" /> POS Audit Trail & Forensic Log
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Live Sync</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {SAMPLE_TXNS.map((txn) => (
                  <div key={txn.id} className="p-2.5 rounded-lg border bg-slate-800/40 border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-rose-400 font-bold">{txn.id} {"//"} {txn.terminal}</span>
                      <span className="text-slate-400">{txn.time}</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span style={{ color: t.text }}>{txn.action} ({txn.cashier})</span>
                      {txn.amount > 0 && <span className="font-mono text-amber-400">₹{txn.amount}</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      ⚠ {txn.anomalyReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
