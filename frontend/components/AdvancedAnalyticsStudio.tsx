"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ComposedChart,
  ScatterChart, Scatter, ZAxis, RadialBarChart, RadialBar, Treemap
} from "recharts";
import {
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, TrendingUp,
  Activity, Target, Layers, Zap, Filter, Download, Sparkles, Store,
  DollarSign, ShoppingBag, Users, Clock, ShieldCheck, Flame, Award, RefreshCw
} from "lucide-react";

interface AnalyticsProps {
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint?: string;
    panel: string;
    highlight?: string;
  };
  accent?: string;
  isDark?: boolean;
}

// 1. Financial & Multi-metric Revenue Data
const REVENUE_TIMELINE = [
  { month: "Jan", revenue: 420000, target: 400000, cogs: 168000, profit: 142000, opex: 110000 },
  { month: "Feb", revenue: 460000, target: 420000, cogs: 184000, profit: 161000, opex: 115000 },
  { month: "Mar", revenue: 510000, target: 450000, cogs: 204000, profit: 182000, opex: 124000 },
  { month: "Apr", revenue: 490000, target: 470000, cogs: 196000, profit: 168000, opex: 126000 },
  { month: "May", revenue: 580000, target: 500000, cogs: 232000, profit: 215000, opex: 133000 },
  { month: "Jun", revenue: 640000, target: 530000, cogs: 256000, profit: 243000, opex: 141000 },
  { month: "Jul", revenue: 690000, target: 560000, cogs: 276000, profit: 265000, opex: 149000 },
  { month: "Aug", revenue: 730000, target: 600000, cogs: 292000, profit: 284000, opex: 154000 },
  { month: "Sep", revenue: 790000, target: 630000, cogs: 316000, profit: 312000, opex: 162000 },
  { month: "Oct", revenue: 840000, target: 670000, cogs: 336000, profit: 335000, opex: 169000 },
  { month: "Nov", revenue: 910000, target: 720000, cogs: 364000, profit: 372000, opex: 174000 },
  { month: "Dec", revenue: 980000, target: 780000, cogs: 392000, profit: 410000, opex: 178000 },
];

// 2. Category Share Pie / Donut Data
const CATEGORY_SHARE = [
  { name: "Burgers & Sandwiches", value: 38, sales: "₹3.42L", color: "#3B82F6", items: "12 SKUs" },
  { name: "Beverages & Shakes", value: 24, sales: "₹2.16L", color: "#10B981", items: "18 SKUs" },
  { name: "Value Combos", value: 18, sales: "₹1.62L", color: "#F59E0B", items: "6 SKUs" },
  { name: "Sides & Crisps", value: 12, sales: "₹1.08L", color: "#EC4899", items: "8 SKUs" },
  { name: "Desserts & Pastries", value: 8, sales: "₹0.72L", color: "#8B5CF6", items: "5 SKUs" },
];

// 3. Payment Channels Pie
const PAYMENT_MODES = [
  { name: "UPI / QR Gateway", value: 52, color: "#06B6D4", count: "14,820 txns" },
  { name: "Credit/Debit Cards", value: 26, color: "#3B82F6", count: "7,410 txns" },
  { name: "Cash on POS", value: 12, color: "#F97316", count: "3,420 txns" },
  { name: "Swiggy/Zomato Pay", value: 7, color: "#EF4444", count: "1,990 txns" },
  { name: "Franchise Loyalty Card", value: 3, color: "#A855F7", count: "855 txns" },
];

// 4. Hourly Rush & Speed of Service Composed Data
const HOURLY_HEAT = [
  { hour: "10 AM", orders: 18, ticketTime: 4.2, revenue: 14400 },
  { hour: "11 AM", orders: 34, ticketTime: 5.1, revenue: 27200 },
  { hour: "12 PM", orders: 82, ticketTime: 7.8, revenue: 73800 },
  { hour: "01 PM", orders: 124, ticketTime: 9.4, revenue: 111600 },
  { hour: "02 PM", orders: 96, ticketTime: 8.2, revenue: 86400 },
  { hour: "03 PM", orders: 42, ticketTime: 5.4, revenue: 37800 },
  { hour: "04 PM", orders: 38, ticketTime: 4.8, revenue: 34200 },
  { hour: "05 PM", orders: 62, ticketTime: 6.2, revenue: 55800 },
  { hour: "06 PM", orders: 88, ticketTime: 7.5, revenue: 79200 },
  { hour: "07 PM", orders: 135, ticketTime: 10.1, revenue: 128250 },
  { hour: "08 PM", orders: 158, ticketTime: 11.4, revenue: 157900 },
  { hour: "09 PM", orders: 142, ticketTime: 9.8, revenue: 142000 },
  { hour: "10 PM", orders: 64, ticketTime: 6.0, revenue: 64000 },
];

// 5. 360° Outlet Radar Benchmarking
const RADAR_BENCHMARK = [
  { metric: "Food Quality", Pune: 96, Mumbai: 92, Bangalore: 88, target: 90 },
  { metric: "Hygiene & SOPs", Pune: 98, Mumbai: 86, Bangalore: 94, target: 90 },
  { metric: "Kitchen Speed", Pune: 89, Mumbai: 94, Bangalore: 82, target: 85 },
  { metric: "Customer CSAT", Pune: 95, Mumbai: 90, Bangalore: 92, target: 90 },
  { metric: "Sales Target %", Pune: 108, Mumbai: 104, Bangalore: 96, target: 100 },
  { metric: "Staff Retention", Pune: 91, Mumbai: 84, Bangalore: 89, target: 85 },
];

// 6. Outlet Top Performers Bar Chart
const OUTLET_BARS = [
  { outlet: "Pune Central", gmv: 840000, margin: 34, rating: 4.8, waste: 2.1 },
  { outlet: "Mumbai Bandra", gmv: 920000, margin: 31, rating: 4.6, waste: 3.4 },
  { outlet: "Bangalore Indiranagar", gmv: 780000, margin: 36, rating: 4.7, waste: 1.8 },
  { outlet: "Delhi Connaught", gmv: 710000, margin: 29, rating: 4.5, waste: 4.2 },
  { outlet: "Hyderabad HITEC", gmv: 660000, margin: 33, rating: 4.6, waste: 2.5 },
  { outlet: "Chennai Anna Nagar", gmv: 590000, margin: 32, rating: 4.4, waste: 3.1 },
];

// 7. Kitchen Efficiency Scatter Plot (Order Value vs Prep Time)
const KITCHEN_SCATTER = [
  { orderVal: 220, prepMins: 4.2, items: 2, type: "Solo Quick" },
  { orderVal: 350, prepMins: 5.5, items: 3, type: "Meal Combo" },
  { orderVal: 480, prepMins: 6.8, items: 4, type: "Meal Combo" },
  { orderVal: 620, prepMins: 8.1, items: 5, type: "Family Feast" },
  { orderVal: 850, prepMins: 11.2, items: 7, type: "Party Platter" },
  { orderVal: 990, prepMins: 13.4, items: 9, type: "Party Platter" },
  { orderVal: 1250, prepMins: 16.0, items: 12, type: "Catering" },
  { orderVal: 410, prepMins: 9.8, items: 3, type: "Custom Grill (Delayed)" },
  { orderVal: 780, prepMins: 14.2, items: 6, type: "Custom Fry (Delayed)" },
];

// 8. Radial Gauges for Strategic KPIs
const RADIAL_METRICS = [
  { name: "Sales Target", value: 112, fill: "#10B981" },
  { name: "SOP Audit", value: 95, fill: "#3B82F6" },
  { name: "Customer CSAT", value: 92, fill: "#8B5CF6" },
  { name: "Zero-Waste SLA", value: 78, fill: "#F59E0B" },
];

// 9. Stockroom & Wastage Cause Pie
const WASTE_CAUSES = [
  { name: "Over-Prep Peak Buffer", value: 42, color: "#F43F5E" },
  { name: "Expired Shelf-Life", value: 26, color: "#FB923C" },
  { name: "Cold Storage Glitch", value: 18, color: "#FBBF24" },
  { name: "Damaged / Dropped", value: 14, color: "#94A3B8" },
];

// 10. Treemap Catalog Data
const CATALOG_TREEMAP = [
  {
    name: "Burgers",
    children: [
      { name: "Crispy Maharaja Paneer", size: 145000 },
      { name: "Double Cheese Truffle", size: 118000 },
      { name: "Spicy Peri Peri Fillet", size: 98000 },
    ],
  },
  {
    name: "Beverages",
    children: [
      { name: "Cold Brew Boba", size: 84000 },
      { name: "Belgian Chocolate Shake", size: 76000 },
      { name: "Berry Mojito Sparkler", size: 56000 },
    ],
  },
  {
    name: "Sides",
    children: [
      { name: "Loaded Truffle Fries", size: 68000 },
      { name: "Cheesy Herb Bites", size: 45000 },
    ],
  },
];

function CustomTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl shadow-2xl border backdrop-blur-md bg-slate-950/90 border-slate-700 text-white text-xs">
        <p className="font-bold border-b border-slate-800 pb-1 mb-1.5 text-slate-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 my-1">
            <span className="flex items-center gap-1.5" style={{ color: entry.color || entry.stroke || entry.fill }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color || entry.stroke || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {typeof entry.value === "number" && entry.value > 1000
                ? `₹${entry.value.toLocaleString()}`
                : typeof entry.value === "number" && entry.name?.includes("%")
                ? `${entry.value}%`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdvancedAnalyticsStudio({ t, accent = "#0D9488", isDark = true }: AnalyticsProps) {
  const [activeChartTab, setActiveChartTab] = useState<"overview" | "revenue" | "operations" | "radar" | "waste">("overview");
  const [selectedRange, setSelectedRange] = useState<"7D" | "30D" | "90D" | "YTD">("30D");
  const [selectedOutlet, setSelectedOutlet] = useState<string>("all");

  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;
  const panelBg = t.panel;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: textColor }}>
              Enterprise Visual Analytics Studio
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 uppercase">
                High-Density BI
              </span>
            </h2>
            <p className="text-xs" style={{ color: textMuted }}>
              Cross-franchise multidimensional charts: Bar, Line, Area, Donut, Multi-Radar, Scatter & Radial gauges.
            </p>
          </div>
        </div>

        {/* Filters & Control buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Filter */}
          <div className="flex rounded-lg border p-0.5" style={{ borderColor, background: panelBg }}>
            {(["7D", "30D", "90D", "YTD"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedRange === range
                    ? "bg-teal-500 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Outlet Filter */}
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-transparent cursor-pointer"
            style={{ borderColor, color: textColor }}
          >
            <option value="all" className="bg-slate-900 text-white">All Outlets (Consolidated)</option>
            <option value="pune" className="bg-slate-900 text-white">Pune Central Hub</option>
            <option value="mumbai" className="bg-slate-900 text-white">Mumbai Bandra</option>
            <option value="bangalore" className="bg-slate-900 text-white">Bangalore Indiranagar</option>
            <option value="delhi" className="bg-slate-900 text-white">Delhi Connaught</option>
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b" style={{ borderColor }}>
        {[
          { id: "overview", label: "Executive Overview (All Graphs)", icon: BarChart3 },
          { id: "revenue", label: "Financial & Category Donut/Bar", icon: PieIcon },
          { id: "operations", label: "Hourly Rush & Kitchen Scatter", icon: Activity },
          { id: "radar", label: "360° Benchmark Radar", icon: Target },
          { id: "waste", label: "Waste & Catalog Treemap", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeChartTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChartTab(tab.id as any)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-teal-500/15 border-teal-500 text-teal-400 shadow-sm"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between text-slate-400">
            <span>Annual Run-Rate</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-emerald-400 font-mono">₹1.17 Cr</span>
            <span className="text-[10px] text-emerald-400 ml-2 font-bold flex items-center gap-0.5 inline-flex">
              <TrendingUp size={11} /> +18.4% YoY
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between text-slate-400">
            <span>Gross Profit Margin</span>
            <Target className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-teal-400 font-mono">68.4%</span>
            <span className="text-[10px] text-teal-400 ml-2 font-bold">+3.2% vs target</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between text-slate-400">
            <span>Average Speed of Service</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-blue-400 font-mono">6m 42s</span>
            <span className="text-[10px] text-emerald-400 ml-2 font-bold">-48s faster</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between text-slate-400">
            <span>SOP Compliance Score</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-purple-400 font-mono">96.8%</span>
            <span className="text-[10px] text-purple-400 ml-2 font-bold">Grade AAA</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW (Comprehensive Grid with all major graph types) */}
      {(activeChartTab === "overview" || activeChartTab === "revenue") && (
        <div className="space-y-6">
          {/* SECTION A: Composed Revenue & Profit Timeline (Line + Area + Bar) */}
          <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <TrendingUp size={16} className="text-teal-400" />
                  Monthly Financial Trajectory & Profit Yield (Line, Bar & Target Curve)
                </h3>
                <p className="text-[11px]" style={{ color: textMuted }}>
                  Composed comparison of Gross Revenue, Target Trajectory, Net Profit, and COGS over 12 months.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-teal-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> Revenue
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Net Profit
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Target
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REVENUE_TIMELINE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                  <XAxis dataKey="month" stroke={textMuted} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={textMuted}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Revenue"
                    fill="url(#revGradient)"
                    stroke="#0D9488"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="profit"
                    name="Net Profit"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Sales Target"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ fill: "#F59E0B", r: 3 }}
                  />
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECTION B: 2-Column Pie & Donut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Category Sales Contribution Donut */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <PieIcon size={16} className="text-blue-400" />
                  Product Category Sales Share (Donut Chart)
                </h3>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  5 Major Segments
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Proportional contribution of core menu categories to total franchise sales volume.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_SHARE}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {CATEGORY_SHARE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {CATEGORY_SHARE.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                        <span className="truncate font-medium" style={{ color: textColor }}>{item.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-white font-mono">{item.value}%</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({item.sales})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Payment Gateway & Settlement Share Pie */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <ShoppingBag size={16} className="text-emerald-400" />
                  Payment Methods & POS Settlement (Pie Chart)
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  28,500+ Transactions
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Channel breakdown of customer checkout payments across physical and delivery counters.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PAYMENT_MODES}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        dataKey="value"
                        label={({ percent }) => typeof percent === "number" ? `${(percent * 100).toFixed(0)}%` : ""}
                        labelLine={false}
                      >
                        {PAYMENT_MODES.map((entry, index) => (
                          <Cell key={`pay-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {PAYMENT_MODES.map((mode) => (
                    <div key={mode.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: mode.color }} />
                        <span className="truncate font-medium" style={{ color: textColor }}>{mode.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-white font-mono">{mode.value}%</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({mode.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: Outlet GMV & Margin Stacked / Grouped Bar Charts */}
          <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <Store size={16} className="text-purple-400" />
                  Outlet Gross Merchandise Value & Margin Efficiency (Bar Chart)
                </h3>
                <p className="text-[11px]" style={{ color: textMuted }}>
                  Total monthly GMV and operating margin contribution by regional franchise store.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> GMV Sales
                </span>
                <span className="flex items-center gap-1 text-teal-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" /> Margin %
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OUTLET_BARS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                  <XAxis dataKey="outlet" stroke={textMuted} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={textMuted}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Bar dataKey="gmv" name="Monthly GMV" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OPERATIONS & SCATTER (Hourly Speed, Anomaly Scatter, Peak Load) */}
      {(activeChartTab === "overview" || activeChartTab === "operations") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Hourly Peak Load vs Kitchen Ticket Speed */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <Clock size={16} className="text-amber-400" />
                  Hourly Order Load vs Ticket Prep Time (Dual-Axis Chart)
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Rush Hours: 1PM & 8PM
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Blue bars indicate order volume; Orange curve tracks kitchen preparation duration in minutes.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={HOURLY_HEAT}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                    <XAxis dataKey="hour" stroke={textMuted} fontSize={10} tickLine={false} />
                    <YAxis yAxisId="left" stroke={textMuted} fontSize={10} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}m`} />
                    <Tooltip content={<CustomTooltipContent />} />
                    <Bar yAxisId="left" dataKey="orders" name="Order Volume" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                    <Line yAxisId="right" type="monotone" dataKey="ticketTime" name="Prep Time (Mins)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Kitchen Ticket Scatter Plot (Order Value vs Prep Time) */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <Zap size={16} className="text-rose-400" />
                  Ticket Complexity & Prep Delay Scatter Plot
                </h3>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  SLA Target &lt; 10 Mins
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Correlation between cart ticket price (₹) and preparation time. Red outliers denote SLA breaches.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                    <XAxis type="number" dataKey="orderVal" name="Order Value" unit="₹" stroke={textMuted} fontSize={10} />
                    <YAxis type="number" dataKey="prepMins" name="Prep Time" unit="m" stroke={textMuted} fontSize={10} />
                    <ZAxis range={[60, 200]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Kitchen Orders" data={KITCHEN_SCATTER} fill="#EC4899" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: RADAR & STRATEGIC BENCHMARKING */}
      {(activeChartTab === "overview" || activeChartTab === "radar") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Outlet Radar Comparison */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <Target size={16} className="text-teal-400" />
                  360° Multi-Outlet Operational Benchmark (Radar Chart)
                </h3>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  6 Core Vector Dimensions
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Multi-polygon spider chart benchmarking Pune, Mumbai, and Bangalore against enterprise standard targets.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_BENCHMARK}>
                    <PolarGrid stroke={isDark ? "#334155" : "#E2E8F0"} />
                    <PolarAngleAxis dataKey="metric" stroke={textMuted} fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 115]} stroke={textMuted} fontSize={9} />
                    <Radar name="Pune Central" dataKey="Pune" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                    <Radar name="Mumbai Bandra" dataKey="Mumbai" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Radar name="Bangalore" dataKey="Bangalore" stroke="#EC4899" fill="#EC4899" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Tooltip content={<CustomTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic KPI Radial Bar Gauges */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                  <Award size={16} className="text-emerald-400" />
                  Strategic Target Fulfillment (Radial Bar Gauges)
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Enterprise OKRs
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: textMuted }}>
                Concentric circular gauge rings representing enterprise milestone completion percentages.
              </p>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    barSize={12}
                    data={RADIAL_METRICS}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={6}
                      label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
                    />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: "11px" }} />
                    <Tooltip content={<CustomTooltipContent />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WASTAGE & CATALOG TREEMAP */}
      {(activeChartTab === "overview" || activeChartTab === "waste") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Food Waste Root Causes Donut */}
          <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                <Flame size={16} className="text-rose-400" />
                Food & Ingredient Waste Breakdown (Pie Chart)
              </h3>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                Wastage: 2.3% of GMV
              </span>
            </div>
            <p className="text-[11px] mb-4" style={{ color: textMuted }}>
              Root cause analysis of discarded kitchen stock to optimize reorder frequency and buffer sizes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={WASTE_CAUSES}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {WASTE_CAUSES.map((entry, index) => (
                        <Cell key={`waste-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {WASTE_CAUSES.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/20 border border-white/5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="truncate font-medium" style={{ color: textColor }}>{item.name}</span>
                    </div>
                    <span className="font-bold text-white font-mono shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 2: Catalog SKU Hierarchy Treemap */}
          <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
                <Layers size={16} className="text-teal-400" />
                Menu SKU Volume Density (Treemap Chart)
              </h3>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Hierarchical Revenue Map
              </span>
            </div>
            <p className="text-[11px] mb-4" style={{ color: textMuted }}>
              Proportional block areas scaled by gross revenue contribution across individual recipes and drinks.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={CATALOG_TREEMAP}
                  dataKey="size"
                  stroke="#1E293B"
                  fill="#0D9488"
                >
                  <Tooltip content={<CustomTooltipContent />} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
