"use client";

import React, { useState } from "react";
import { X, Trophy, Swords, Store, Sparkles, TrendingUp, Clock, AlertTriangle, ShieldCheck, Star } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

interface OutletComparisonModalProps {
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

interface OutletStats {
  id: string;
  name: string;
  city: string;
  revenue: number;
  target: number;
  margin: number;
  prepSpeed: number; // minutes
  csat: number;
  wastage: number; // %
  healthScore: number;
  activeStaff: number;
  color: string;
}

const OUTLETS_DATA: OutletStats[] = [
  { id: "pune", name: "Pune FC Road", city: "Pune", revenue: 840000, target: 800000, margin: 34.2, prepSpeed: 4.8, csat: 4.8, wastage: 1.8, healthScore: 96, activeStaff: 14, color: "#10B981" },
  { id: "mumbai", name: "Mumbai Bandra", city: "Mumbai", revenue: 920000, target: 880000, margin: 31.0, prepSpeed: 5.4, csat: 4.7, wastage: 2.4, healthScore: 92, activeStaff: 18, color: "#3B82F6" },
  { id: "bangalore", name: "Bangalore Indiranagar", city: "Bangalore", revenue: 780000, target: 750000, margin: 36.5, prepSpeed: 4.2, csat: 4.9, wastage: 1.4, healthScore: 98, activeStaff: 12, color: "#8B5CF6" },
  { id: "delhi", name: "Delhi Connaught Place", city: "Delhi", revenue: 710000, target: 720000, margin: 29.4, prepSpeed: 6.2, csat: 4.4, wastage: 3.1, healthScore: 86, activeStaff: 11, color: "#F59E0B" },
  { id: "hyderabad", name: "Hyderabad HITEC City", city: "Hyderabad", revenue: 660000, target: 650000, margin: 33.1, prepSpeed: 5.1, csat: 4.6, wastage: 2.1, healthScore: 90, activeStaff: 10, color: "#06B6D4" },
  { id: "aurangabad", name: "Aurangabad CIDCO", city: "Aurangabad", revenue: 340000, target: 450000, margin: 21.5, prepSpeed: 8.5, csat: 3.9, wastage: 5.8, healthScore: 68, activeStaff: 6, color: "#F43F5E" },
];

export default function OutletComparisonModal({
  isOpen,
  onClose,
  t,
  accent = "#0D9488",
  isDark = true,
}: OutletComparisonModalProps) {
  const [selectedA, setSelectedA] = useState<string>("pune");
  const [selectedB, setSelectedB] = useState<string>("mumbai");
  const [selectedC, setSelectedC] = useState<string>("bangalore");

  if (!isOpen) return null;

  const outletA = OUTLETS_DATA.find((o) => o.id === selectedA) || OUTLETS_DATA[0];
  const outletB = OUTLETS_DATA.find((o) => o.id === selectedB) || OUTLETS_DATA[1];
  const outletC = OUTLETS_DATA.find((o) => o.id === selectedC) || OUTLETS_DATA[2];

  const selectedOutlets = [outletA, outletB, outletC];

  // Helper to determine winner in each dimension
  const maxRevenue = Math.max(...selectedOutlets.map((o) => o.revenue));
  const maxMargin = Math.max(...selectedOutlets.map((o) => o.margin));
  const minPrep = Math.min(...selectedOutlets.map((o) => o.prepSpeed));
  const maxCsat = Math.max(...selectedOutlets.map((o) => o.csat));
  const minWaste = Math.min(...selectedOutlets.map((o) => o.wastage));
  const maxHealth = Math.max(...selectedOutlets.map((o) => o.healthScore));

  // Radar dataset
  const radarData = [
    { metric: "Sales Target %", [outletA.name]: (outletA.revenue / outletA.target) * 100, [outletB.name]: (outletB.revenue / outletB.target) * 100, [outletC.name]: (outletC.revenue / outletC.target) * 100 },
    { metric: "Gross Margin", [outletA.name]: outletA.margin * 2.5, [outletB.name]: outletB.margin * 2.5, [outletC.name]: outletC.margin * 2.5 },
    { metric: "Prep Speed", [outletA.name]: Math.max(20, 100 - outletA.prepSpeed * 8), [outletB.name]: Math.max(20, 100 - outletB.prepSpeed * 8), [outletC.name]: Math.max(20, 100 - outletC.prepSpeed * 8) },
    { metric: "Customer CSAT", [outletA.name]: (outletA.csat / 5) * 100, [outletB.name]: (outletB.csat / 5) * 100, [outletC.name]: (outletC.csat / 5) * 100 },
    { metric: "Zero-Waste", [outletA.name]: Math.max(20, 100 - outletA.wastage * 12), [outletB.name]: Math.max(20, 100 - outletB.wastage * 12), [outletC.name]: Math.max(20, 100 - outletC.wastage * 12) },
    { metric: "Health Score", [outletA.name]: outletA.healthScore, [outletB.name]: outletB.healthScore, [outletC.name]: outletC.healthScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-slate-100"
        style={{
          background: isDark ? "rgba(15, 23, 42, 0.95)" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "#E2E8F0",
          color: t.text,
        }}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
              <Swords size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight" style={{ color: t.text }}>
                  Multi-Store Head-to-Head Arena
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  3-Way Benchmark
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Compare operational velocity, margins, and service ratings across any 3 franchise branches.
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
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Outlets Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Slot 1 (Challenger A)", val: selectedA, setVal: setSelectedA, color: "#10B981" },
              { label: "Slot 2 (Challenger B)", val: selectedB, setVal: setSelectedB, color: "#3B82F6" },
              { label: "Slot 3 (Challenger C)", val: selectedC, setVal: setSelectedC, color: "#8B5CF6" },
            ].map((slot, i) => (
              <div key={i} className="p-3.5 rounded-2xl border" style={{ background: t.card, borderColor: t.border }}>
                <label className="block text-[11px] font-bold mb-1.5" style={{ color: slot.color }}>
                  {slot.label}
                </label>
                <select
                  value={slot.val}
                  onChange={(e) => slot.setVal(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-slate-900 text-white font-semibold text-xs outline-none focus:border-amber-400"
                >
                  {OUTLETS_DATA.map((out) => (
                    <option key={out.id} value={out.id}>
                      {out.name} ({out.city})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Side-by-Side Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedOutlets.map((out) => (
              <div
                key={out.id}
                className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden shadow-lg"
                style={{ background: t.card, borderColor: t.border }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: t.text }}>{out.name}</h4>
                      <p className="text-[11px]" style={{ color: t.textMuted }}>{out.city} • {out.activeStaff} Staff</p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-xs font-black font-mono border"
                      style={{ background: `${out.color}20`, color: out.color, borderColor: `${out.color}50` }}
                    >
                      {out.healthScore}/100
                    </div>
                  </div>

                  {/* Metrics List */}
                  <div className="space-y-2.5 pt-1">
                    {/* Revenue */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 border" style={{ borderColor: `${t.border}40` }}>
                      <span style={{ color: t.textMuted }}>MTD Revenue</span>
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span style={{ color: t.text }}>₹{out.revenue.toLocaleString("en-IN")}</span>
                        {out.revenue === maxRevenue && <span className="text-[10px] px-1.5 rounded bg-amber-500/20 text-amber-300 font-sans">👑 Best</span>}
                      </div>
                    </div>

                    {/* Gross Margin */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 border" style={{ borderColor: `${t.border}40` }}>
                      <span style={{ color: t.textMuted }}>Gross Margin</span>
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span style={{ color: t.text }}>{out.margin}%</span>
                        {out.margin === maxMargin && <span className="text-[10px] px-1.5 rounded bg-amber-500/20 text-amber-300 font-sans">👑 Best</span>}
                      </div>
                    </div>

                    {/* Prep Speed */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 border" style={{ borderColor: `${t.border}40` }}>
                      <span style={{ color: t.textMuted }}>Avg Prep Speed</span>
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span style={{ color: t.text }}>{out.prepSpeed} mins</span>
                        {out.prepSpeed === minPrep && <span className="text-[10px] px-1.5 rounded bg-emerald-500/20 text-emerald-300 font-sans">⚡ Fastest</span>}
                      </div>
                    </div>

                    {/* Customer CSAT */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 border" style={{ borderColor: `${t.border}40` }}>
                      <span style={{ color: t.textMuted }}>Customer CSAT</span>
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span style={{ color: t.text }}>{out.csat} / 5.0</span>
                        {out.csat === maxCsat && <span className="text-[10px] px-1.5 rounded bg-amber-500/20 text-amber-300 font-sans">⭐ Top</span>}
                      </div>
                    </div>

                    {/* Wastage */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 border" style={{ borderColor: `${t.border}40` }}>
                      <span style={{ color: t.textMuted }}>Wastage Rate</span>
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span style={{ color: t.text }}>{out.wastage}%</span>
                        {out.wastage === minWaste && <span className="text-[10px] px-1.5 rounded bg-emerald-500/20 text-emerald-300 font-sans">🌿 Lowest</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 360° Comparative Radar */}
          <div className="p-5 rounded-2xl border" style={{ background: t.card, borderColor: t.border }}>
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: t.text }}>
              <Trophy size={16} className="text-amber-400" />
              360° Multi-Vector Radar Overlay
            </h4>
            <p className="text-xs mb-4" style={{ color: t.textMuted }}>
              Direct dimensional superposition across Target Achievement, Margins, Turnaround Speed, CSAT, Wastage SLA, and Health.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={isDark ? "#334155" : "#E2E8F0"} />
                  <PolarAngleAxis dataKey="metric" stroke={t.textMuted} fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 120]} stroke={t.textMuted} fontSize={9} />
                  <Radar name={outletA.name} dataKey={outletA.name} stroke={outletA.color} fill={outletA.color} fillOpacity={0.25} />
                  <Radar name={outletB.name} dataKey={outletB.name} stroke={outletB.color} fill={outletB.color} fillOpacity={0.25} />
                  <Radar name={outletC.name} dataKey={outletC.name} stroke={outletC.color} fill={outletC.color} fillOpacity={0.25} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
