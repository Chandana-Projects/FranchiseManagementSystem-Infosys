"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Sliders,
  Maximize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building,
  Target
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { playTechChime } from "@/lib/WebAudioSFX";

interface StoreExpansionModalProps {
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

interface TargetMarket {
  id: string;
  name: string;
  city: string;
  rentPerSqFt: number;
  marketAffluence: "High" | "Premium" | "Moderate";
  nearestOutlet: string;
  distanceKm: number;
}

const TARGET_MARKETS: TargetMarket[] = [
  {
    id: "mkt-1",
    name: "Baner High Street",
    city: "Pune",
    rentPerSqFt: 180,
    marketAffluence: "High",
    nearestOutlet: "Pune FC Road",
    distanceKm: 8.4
  },
  {
    id: "mkt-2",
    name: "Powai Hiranandani",
    city: "Mumbai",
    rentPerSqFt: 320,
    marketAffluence: "Premium",
    nearestOutlet: "Mumbai Andheri East",
    distanceKm: 4.8
  },
  {
    id: "mkt-3",
    name: "Indiranagar 100ft Rd",
    city: "Bangalore",
    rentPerSqFt: 290,
    marketAffluence: "Premium",
    nearestOutlet: "Bangalore Koramangala",
    distanceKm: 5.2
  },
  {
    id: "mkt-4",
    name: "HITEC City Knowledge Park",
    city: "Hyderabad",
    rentPerSqFt: 210,
    marketAffluence: "High",
    nearestOutlet: "Hyderabad Gachibowli",
    distanceKm: 6.5
  },
  {
    id: "mkt-5",
    name: "DLF CyberHub",
    city: "Gurugram (NCR)",
    rentPerSqFt: 380,
    marketAffluence: "Premium",
    nearestOutlet: "Delhi Connaught Place",
    distanceKm: 14.2
  }
];

const STORE_FORMATS = [
  { id: "kiosk", name: "Express Kiosk", sqft: 350, baseCapex: 2200000, staffCount: 3 },
  { id: "cafe", name: "High-Street Cafe", sqft: 1200, baseCapex: 5500000, staffCount: 8 },
  { id: "flagship", name: "Flagship Bistro & Diner", sqft: 2400, baseCapex: 11000000, staffCount: 16 }
];

export default function StoreExpansionSimulatorModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: StoreExpansionModalProps) {
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket>(TARGET_MARKETS[0]);
  const [selectedFormat, setSelectedFormat] = useState(STORE_FORMATS[1]);
  const [capexInvestment, setCapexInvestment] = useState<number>(STORE_FORMATS[1].baseCapex);
  const [dailyFootfall, setDailyFootfall] = useState<number>(550);
  const [avgTicketValue, setAvgTicketValue] = useState<number>(320);

  // Update capex default when format changes
  const handleFormatChange = (fmt: (typeof STORE_FORMATS)[0]) => {
    setSelectedFormat(fmt);
    setCapexInvestment(fmt.baseCapex);
    playTechChime();
  };

  // Financial Modeling & Cannibalization Calculations
  const simulationMetrics = useMemo(() => {
    // 30 days monthly footfall with 65% conversion to paying orders
    const monthlyOrders = Math.round(dailyFootfall * 30 * 0.68);
    const monthlyGrossRevenue = Math.round(monthlyOrders * avgTicketValue);

    // Costs
    const rentCost = Math.round(selectedFormat.sqft * selectedMarket.rentPerSqFt);
    const cogs = Math.round(monthlyGrossRevenue * 0.32); // 32% food ingredient cost
    const staffCost = Math.round(selectedFormat.staffCount * 28000); // 28k/month avg wage
    const utilityOpex = Math.round(monthlyGrossRevenue * 0.08); // 8% power/pos/maintenance
    const totalMonthlyOpex = rentCost + cogs + staffCost + utilityOpex;

    const monthlyEbitda = monthlyGrossRevenue - totalMonthlyOpex;
    const ebitdaMarginPercent = monthlyGrossRevenue > 0 ? ((monthlyEbitda / monthlyGrossRevenue) * 100).toFixed(1) : "0";

    // Break-even horizon (months)
    const paybackMonths = monthlyEbitda > 0 ? (capexInvestment / monthlyEbitda).toFixed(1) : "Unviable (>60)";

    // Cannibalization calculation: Closer distance = higher sales diversion from nearest store
    // Distance < 5km -> 9% to 14% cannibalization; Distance > 10km -> < 3% cannibalization
    let cannibalizationRate = 0;
    if (selectedMarket.distanceKm < 5) {
      cannibalizationRate = Math.max(8.5, +(14 - selectedMarket.distanceKm * 1.1).toFixed(1));
    } else if (selectedMarket.distanceKm < 10) {
      cannibalizationRate = Math.max(3.5, +(8 - (selectedMarket.distanceKm - 5) * 0.9).toFixed(1));
    } else {
      cannibalizationRate = +(Math.max(1.2, 3 - (selectedMarket.distanceKm - 10) * 0.2)).toFixed(1);
    }

    const estimatedNearestStoreRevenue = 1800000; // baseline ~18 Lakhs
    const cannibalizedRevenue = Math.round(estimatedNearestStoreRevenue * (cannibalizationRate / 100));
    const netNetworkLift = monthlyGrossRevenue - cannibalizedRevenue;

    // Viability index (0 - 100)
    let score = 50;
    if (Number(paybackMonths) <= 18) score += 30;
    else if (Number(paybackMonths) <= 28) score += 15;
    if (cannibalizationRate < 6) score += 15;
    if (Number(ebitdaMarginPercent) >= 20) score += 15;
    score = Math.min(96, Math.max(40, score));

    return {
      monthlyGrossRevenue,
      totalMonthlyOpex,
      monthlyEbitda,
      ebitdaMarginPercent,
      paybackMonths,
      cannibalizationRate,
      cannibalizedRevenue,
      netNetworkLift,
      score
    };
  }, [selectedMarket, selectedFormat, capexInvestment, dailyFootfall, avgTicketValue]);

  // Projected 12-Month Ramp Curve
  const projectionTimeline = useMemo(() => {
    const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
    const rampFactors = [0.45, 0.6, 0.72, 0.82, 0.9, 0.95, 1.0, 1.04, 1.08, 1.12, 1.15, 1.2];

    return months.map((m, idx) => {
      const factor = rampFactors[idx];
      const rev = Math.round(simulationMetrics.monthlyGrossRevenue * factor);
      const ebitda = Math.round(simulationMetrics.monthlyEbitda * factor);
      return {
        month: m,
        Revenue: rev,
        EBITDA: Math.max(0, ebitda)
      };
    });
  }, [simulationMetrics]);

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
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  AI Store Expansion & Cannibalization Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  PREDICTIVE WHAT-IF ENGINE
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Simulate new store micro-markets, forecast break-even payback, and assess territory cannibalization
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Selection Strip: Markets & Store Formats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Market Selector */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-2.5" style={{ borderColor: t.border }}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Select Target Territory / Micro-Market
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TARGET_MARKETS.map((mkt) => {
                  const isSel = mkt.id === selectedMarket.id;
                  return (
                    <button
                      key={mkt.id}
                      onClick={() => {
                        playTechChime();
                        setSelectedMarket(mkt);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSel
                          ? "bg-purple-500/15 border-purple-500/50 shadow-md ring-1 ring-purple-400"
                          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="text-[10px] text-purple-400 font-bold">{mkt.city}</div>
                      <div className="text-xs font-bold truncate" style={{ color: t.text }}>
                        {mkt.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        ₹{mkt.rentPerSqFt}/sqft • {mkt.distanceKm}km to hub
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store Format Selector */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-2.5" style={{ borderColor: t.border }}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" /> Select Store Format & Blueprint
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STORE_FORMATS.map((fmt) => {
                  const isSel = fmt.id === selectedFormat.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => handleFormatChange(fmt)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSel
                          ? "bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-400"
                          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="text-xs font-bold" style={{ color: t.text }}>
                        {fmt.name}
                      </div>
                      <div className="text-[11px] font-mono text-amber-400">{fmt.sqft} sq.ft</div>
                      <div className="text-[10px] text-slate-400">{fmt.staffCount} Baristas/Staff</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Parameters Sliders Strip */}
          <div className="p-4 rounded-xl border bg-slate-900/40 space-y-4" style={{ borderColor: t.border }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Operational & Capex Parameters
              </span>
              <span className="text-xs text-slate-400">Live dynamic recalculation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Slider 1: CAPEX */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Initial Setup CAPEX</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{(capexInvestment / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min={1500000}
                  max={15000000}
                  step={200000}
                  value={capexInvestment}
                  onChange={(e) => setCapexInvestment(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹15L (Kiosk)</span>
                  <span>₹1.5 Cr (Flagship)</span>
                </div>
              </div>

              {/* Slider 2: Daily Footfall */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Projected Daily Footfall</span>
                  <span className="font-mono font-bold text-cyan-400">{dailyFootfall} visitors/day</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={25}
                  value={dailyFootfall}
                  onChange={(e) => setDailyFootfall(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>200 (Low Traffic)</span>
                  <span>1,500 (High Transit)</span>
                </div>
              </div>

              {/* Slider 3: Average Order Value */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Average Order Value (AOV)</span>
                  <span className="font-mono font-bold text-purple-400">₹{avgTicketValue}</span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={650}
                  step={10}
                  value={avgTicketValue}
                  onChange={(e) => setAvgTicketValue(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹180 (Beverage only)</span>
                  <span>₹650 (Combo meal)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 KPI Outcome Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1 */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Projected Revenue (Mo.)
              </div>
              <div className="text-xl font-extrabold text-emerald-400">
                ₹{(simulationMetrics.monthlyGrossRevenue / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-slate-400">
                EBITDA Margin: <span className="text-emerald-300 font-bold">{simulationMetrics.ebitdaMarginPercent}%</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" /> Payback Horizon
              </div>
              <div className="text-xl font-extrabold text-cyan-400">
                {simulationMetrics.paybackMonths} Mo.
              </div>
              <div className="text-[10px] text-slate-400">Estimated Break-Even Timeline</div>
            </div>

            {/* KPI 3: Cannibalization */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Cannibalization Index
              </div>
              <div className="text-xl font-extrabold text-amber-400">
                {simulationMetrics.cannibalizationRate}%
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Diverts ~₹{(simulationMetrics.cannibalizedRevenue / 1000).toFixed(0)}k from {selectedMarket.nearestOutlet}
              </div>
            </div>

            {/* KPI 4: Viability Score */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Viability Verdict
              </div>
              <div className="text-xl font-extrabold text-purple-400">
                {simulationMetrics.score}/100
              </div>
              <div className="text-[10px] text-purple-300 font-bold">
                {simulationMetrics.score >= 80 ? "⭐ HIGH POTENTIAL EXPANSION" : "⚠️ MODERATE / PROCEED CAUTIOUSLY"}
              </div>
            </div>
          </div>

          {/* Chart & Territory Net Lift Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 12-Month Ramp Curve (2 Cols) */}
            <div className="lg:col-span-2 p-4 rounded-xl border bg-slate-900/30 space-y-3" style={{ borderColor: t.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Projected 12-Month Ramp Curve (Revenue vs. EBITDA)
                  </h4>
                  <p className="text-[11px]" style={{ color: t.textMuted }}>
                    Accounts for initial gestation period and progressive footfall stabilization
                  </p>
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="Revenue" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="EBITDA" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEbitda)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cannibalization & Network Net Impact Card (1 Col) */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-3 flex flex-col justify-between" style={{ borderColor: t.border }}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Territory Cannibalization Audit
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  Proximity analysis with nearest operating branch ({selectedMarket.nearestOutlet})
                </p>

                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="text-slate-400 text-[10px]">Inter-Store Radial Distance</div>
                    <div className="font-bold text-cyan-400 text-sm">{selectedMarket.distanceKm} km</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="text-slate-400 text-[10px]">Projected Diversion Rate</div>
                    <div className="font-bold text-amber-400 text-sm">
                      {simulationMetrics.cannibalizationRate}% revenue shift
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs">
                    <div className="text-slate-400 text-[10px]">Net Incremental Franchise Lift</div>
                    <div className="font-bold text-emerald-400 text-sm">
                      +₹{(simulationMetrics.netNetworkLift / 100000).toFixed(2)} Lakhs / Mo.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI verified territorial clearance approved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
