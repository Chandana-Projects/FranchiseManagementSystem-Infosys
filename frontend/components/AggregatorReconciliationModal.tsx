"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Download,
  Percent,
  Receipt,
  HelpCircle,
  Clock
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { playTechChime } from "@/lib/WebAudioSFX";

interface AggregatorModalProps {
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

interface PlatformSettlement {
  platform: "Swiggy" | "Zomato" | "Direct POS Web";
  grossOrderValue: number;
  ordersCount: number;
  commissionPct: number;
  commissionAmount: number;
  merchantDiscountShare: number;
  disputedCancellations: number;
  packagingCharges: number;
  netBankPayout: number;
  effectiveTakeRatePct: number;
}

const SETTLEMENT_DATA: Record<string, PlatformSettlement> = {
  All: {
    platform: "Swiggy",
    grossOrderValue: 2480000,
    ordersCount: 4820,
    commissionPct: 21.5,
    commissionAmount: 533200,
    merchantDiscountShare: 198400,
    disputedCancellations: 42800,
    packagingCharges: 72300,
    netBankPayout: 1633300,
    effectiveTakeRatePct: 34.1
  },
  Swiggy: {
    platform: "Swiggy",
    grossOrderValue: 1340000,
    ordersCount: 2610,
    commissionPct: 22.0,
    commissionAmount: 294800,
    merchantDiscountShare: 112000,
    disputedCancellations: 24500,
    packagingCharges: 39150,
    netBankPayout: 869550,
    effectiveTakeRatePct: 35.1
  },
  Zomato: {
    platform: "Zomato",
    grossOrderValue: 1140000,
    ordersCount: 2210,
    commissionPct: 21.0,
    commissionAmount: 239400,
    merchantDiscountShare: 86400,
    disputedCancellations: 18300,
    packagingCharges: 33150,
    netBankPayout: 762750,
    effectiveTakeRatePct: 33.1
  }
};

interface DisputedOrder {
  id: string;
  platform: string;
  outlet: string;
  date: string;
  amount: number;
  reason: string;
  status: "Pending Claim" | "Under Review" | "Recovered";
}

const SAMPLE_DISPUTES: DisputedOrder[] = [
  { id: "SWG-8821", platform: "Swiggy", outlet: "Pune FC Road", date: "Today 13:20", amount: 640, reason: "Customer cancelled 18m after rider delay. Food was already dispatched.", status: "Pending Claim" },
  { id: "ZOM-4192", platform: "Zomato", outlet: "Mumbai Andheri East", date: "Today 14:05", amount: 820, reason: "Customer claimed item missing (CCTV confirms double-packed).", status: "Under Review" },
  { id: "SWG-8835", platform: "Swiggy", outlet: "Nashik City Center", date: "Yesterday", amount: 450, reason: "Rider spill incident charged to store instead of logistics partner.", status: "Recovered" },
  { id: "ZOM-4210", platform: "Zomato", outlet: "Aurangabad CIDCO", date: "Yesterday", amount: 1120, reason: "Delivery cancelled after 40 mins wait for partner driver assignment.", status: "Pending Claim" }
];

export default function AggregatorReconciliationModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: AggregatorModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [disputes, setDisputes] = useState<DisputedOrder[]>(SAMPLE_DISPUTES);
  const [claimSuccessNotice, setClaimSuccessNotice] = useState<string | null>(null);

  const currentData = SETTLEMENT_DATA[selectedPlatform] || SETTLEMENT_DATA.All;

  // Waterfall Chart Breakdown
  const waterfallData = [
    { name: "Gross Sales", amount: +(currentData.grossOrderValue / 1000).toFixed(0), fill: "#10B981" },
    { name: "Commission", amount: -+(currentData.commissionAmount / 1000).toFixed(0), fill: "#F43F5E" },
    { name: "Discounts", amount: -+(currentData.merchantDiscountShare / 1000).toFixed(0), fill: "#F59E0B" },
    { name: "Deductions", amount: -+(currentData.disputedCancellations / 1000).toFixed(0), fill: "#EC4899" },
    { name: "Packaging", amount: -+(currentData.packagingCharges / 1000).toFixed(0), fill: "#8B5CF6" },
    { name: "Net Payout", amount: +(currentData.netBankPayout / 1000).toFixed(0), fill: "#06B6D4" }
  ];

  const handleFileDispute = (id: string) => {
    playTechChime();
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Under Review" } : d))
    );
    setClaimSuccessNotice(`Dispute ticket filed with ${id} settlement team. Reversal requested.`);
    setTimeout(() => setClaimSuccessNotice(null), 3500);
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
            <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Third-Party Aggregator Commission & Payout Reconciler
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  SWIGGY / ZOMATO SETTLEMENT AUDIT
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Reconcile POS gross delivery volume against net bank payouts, audit commissions, and recover disputed customer refunds
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

        {/* Claim Notice Banner */}
        {claimSuccessNotice && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {claimSuccessNotice}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Select Channel:
            </span>
            {["All", "Swiggy", "Zomato"].map((platform) => {
              const isSel = selectedPlatform === platform;
              return (
                <button
                  key={platform}
                  onClick={() => {
                    playTechChime();
                    setSelectedPlatform(platform);
                  }}
                  className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? "bg-orange-500/15 border-orange-500 text-orange-300 ring-1 ring-orange-400/50 shadow-md"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {platform === "All" ? "Consolidated All Aggregators" : platform}
                </button>
              );
            })}
          </div>

          {/* 4 Financial Highlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Gross Orders */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Gross Order Value (GOV)
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">
                ₹{(currentData.grossOrderValue / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-slate-400">{currentData.ordersCount.toLocaleString()} Orders Delivered</div>
            </div>

            {/* Card 2: Net Bank Payout */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-cyan-400" /> Net Bank Remittance
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">
                ₹{(currentData.netBankPayout / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-slate-400">Actual Realized Bank Settlement</div>
            </div>

            {/* Card 3: Effective Take Rate */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-rose-400" /> Effective Total Take Rate
              </div>
              <div className="text-2xl font-extrabold text-rose-400">
                {currentData.effectiveTakeRatePct}%
              </div>
              <div className="text-[10px] text-rose-300 font-bold">Base: {currentData.commissionPct}% + Fees</div>
            </div>

            {/* Card 4: Disputed Cancellations */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Recoverable Chargebacks
              </div>
              <div className="text-2xl font-extrabold text-amber-400">
                ₹{currentData.disputedCancellations.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-amber-300 font-bold">Pending automated dispute claim</div>
            </div>
          </div>

          {/* Recharts Waterfall Chart & Disputed Orders Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Waterfall Payout Chart */}
            <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aggregator Settlement Waterfall (₹ in Thousands)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Gross to Net Bank Flow</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `₹${v}k`} />
                    <Tooltip
                      contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(val: any) => [`₹${Math.abs(Number(val))}k`, "Amount"]}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {waterfallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disputed Orders & Claims List */}
            <div className="p-4 rounded-xl border bg-slate-900/40 space-y-3" style={{ borderColor: t.border }}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-400" /> Disputed Cancellations Ledger
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">{disputes.length} Cases</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {disputes.map((d) => (
                  <div key={d.id} className="p-2.5 rounded-lg border bg-slate-800/40 border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-orange-400 font-bold">{d.id} // {d.platform}</span>
                      <span className="text-slate-400">{d.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{d.outlet}</span>
                      <span className="font-mono font-bold text-amber-400">₹{d.amount}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      ⚠ {d.reason}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          d.status === "Recovered"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : d.status === "Under Review"
                            ? "bg-cyan-500/15 text-cyan-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {d.status}
                      </span>
                      {d.status === "Pending Claim" && (
                        <button
                          onClick={() => handleFileDispute(d.id)}
                          className="px-2.5 py-0.5 rounded bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Auto-File Dispute Claim
                        </button>
                      )}
                    </div>
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
