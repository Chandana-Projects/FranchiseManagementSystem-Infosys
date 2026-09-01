"use client";

import React, { useState } from "react";
import { X, Sliders, TrendingUp, TrendingDown, DollarSign, Percent, Sparkles, ShieldAlert, ArrowRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface MarginSensitivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    panel: string;
  };
  accent?: string;
  isDark?: boolean;
}

export default function MarginSensitivityMatrixModal({
  isOpen,
  onClose,
  t,
  accent = "#0D9488",
  isDark = true,
}: MarginSensitivityModalProps) {
  // Interactive Simulator Sliders
  const [discountPct, setDiscountPct] = useState<number>(5); // 0% - 25%
  const [wageHikePct, setWageHikePct] = useState<number>(0); // 0% - 20%
  const [inflationPct, setInflationPct] = useState<number>(4); // 0% - 15%
  const [footfallMult, setFootfallMult] = useState<number>(1.0); // 0.7x - 1.5x

  if (!isOpen) return null;

  // Base Baseline Monthly Numbers (₹ Lakhs)
  const baseRevenue = 48.0; // 48 Lakhs
  const baseCogs = 15.0; // 15 Lakhs
  const baseLabor = 12.0; // 12 Lakhs
  const baseRentOpex = 9.0; // 9 Lakhs
  const baseRoyalty = 2.4; // 2.4 Lakhs (5%)

  // Simulated Calculations
  const simRevenue = baseRevenue * footfallMult * (1 - discountPct / 100);
  const simCogs = baseCogs * footfallMult * (1 + inflationPct / 100);
  const simLabor = baseLabor * (1 + wageHikePct / 100);
  const simRentOpex = baseRentOpex;
  const simRoyalty = simRevenue * 0.05;

  const simGrossProfit = simRevenue - simCogs;
  const simNetProfit = simGrossProfit - simLabor - simRentOpex - simRoyalty;

  const simNetMarginPct = (simNetProfit / simRevenue) * 100;
  const baselineNetProfit = baseRevenue - baseCogs - baseLabor - baseRentOpex - baseRoyalty; // 9.6 Lakhs (20%)
  const profitDelta = simNetProfit - baselineNetProfit;

  // Profit Waterfall Data
  const waterfallData = [
    { name: "Gross Revenue", value: Number(simRevenue.toFixed(2)), fill: "#10B981" },
    { name: "Raw Material (COGS)", value: -Number(simCogs.toFixed(2)), fill: "#EF4444" },
    { name: "Staff Labor", value: -Number(simLabor.toFixed(2)), fill: "#F59E0B" },
    { name: "Rent & OPEX", value: -Number(simRentOpex.toFixed(2)), fill: "#8B5CF6" },
    { name: "5% Franchise Royalty", value: -Number(simRoyalty.toFixed(2)), fill: "#EC4899" },
    { name: "Simulated Net Profit", value: Number(simNetProfit.toFixed(2)), fill: simNetProfit >= 0 ? "#06B6D4" : "#F43F5E" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-slate-100"
        style={{
          background: isDark ? "rgba(15, 23, 42, 0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1",
          color: isDark ? "#F8FAFC" : "#0F172A",
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
              <Sliders size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Profit Waterfall &amp; Margin Sensitivity Matrix
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stress-test network EBITDA and franchisee margins under inflation, wage adjustments, and discount campaigns.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-700 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slider 1: Promotional Discount */}
            <div className="p-4 rounded-2xl border bg-black/20 border-white/10 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300">Promotional Discount</span>
                <span className="font-mono text-amber-400">{discountPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Applied across POS menu orders</p>
            </div>

            {/* Slider 2: Raw Material Inflation */}
            <div className="p-4 rounded-2xl border bg-black/20 border-white/10 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300">Ingredient Inflation</span>
                <span className="font-mono text-rose-400">+{inflationPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={inflationPct}
                onChange={(e) => setInflationPct(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">COGS price escalation index</p>
            </div>

            {/* Slider 3: Staff Wage Adjustment */}
            <div className="p-4 rounded-2xl border bg-black/20 border-white/10 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300">Staff Wage Hike</span>
                <span className="font-mono text-purple-400">+{wageHikePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={wageHikePct}
                onChange={(e) => setWageHikePct(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Hourly payroll &amp; overtime hike</p>
            </div>

            {/* Slider 4: Footfall Demand Multiplier */}
            <div className="p-4 rounded-2xl border bg-black/20 border-white/10 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300">Footfall Multiplier</span>
                <span className="font-mono text-teal-400">{footfallMult.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.6"
                step="0.05"
                value={footfallMult}
                onChange={(e) => setFootfallMult(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Seasonal customer volume factor</p>
            </div>
          </div>

          {/* Real-Time Outcome Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border bg-slate-900 border-slate-800">
              <span className="text-[11px] text-slate-400">Simulated Net Revenue</span>
              <p className="text-2xl font-black text-white font-mono mt-1">₹{simRevenue.toFixed(2)} Lakhs</p>
              <p className="text-[10px] text-slate-400 mt-1">Baseline: ₹{baseRevenue.toFixed(1)}L</p>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-900 border-slate-800">
              <span className="text-[11px] text-slate-400">Simulated Net Profit (EBITDA)</span>
              <p className={`text-2xl font-black font-mono mt-1 ${simNetProfit >= 0 ? "text-teal-400" : "text-rose-400"}`}>
                ₹{simNetProfit.toFixed(2)} Lakhs
              </p>
              <div className="flex items-center gap-1 text-[10px] mt-1 font-semibold">
                {profitDelta >= 0 ? (
                  <span className="text-emerald-400 flex items-center gap-0.5"><TrendingUp size={12} /> +₹{profitDelta.toFixed(2)}L vs baseline</span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5"><TrendingDown size={12} /> -₹{Math.abs(profitDelta).toFixed(2)}L vs baseline</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-900 border-slate-800">
              <span className="text-[11px] text-slate-400">Net Operating Margin</span>
              <p className={`text-2xl font-black font-mono mt-1 ${simNetMarginPct >= 15 ? "text-emerald-400" : simNetMarginPct >= 8 ? "text-amber-400" : "text-rose-400"}`}>
                {simNetMarginPct.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Baseline Margin: 20.0%</p>
            </div>
          </div>

          {/* Interactive Profit Waterfall Chart */}
          <div className="p-5 rounded-2xl border bg-slate-900/60 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
                Dynamic Profit Waterfall Breakdown (₹ Lakhs)
              </h4>
              <span className="text-[10px] font-mono text-teal-400">Live Sensitivity Model</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip
                    contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 10, color: "#fff", fontSize: 11 }}
                    formatter={(v: any) => [`₹${v} Lakhs`, "Value"]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
