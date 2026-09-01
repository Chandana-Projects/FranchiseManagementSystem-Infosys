"use client";

import React from "react";
import {
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Award } from "lucide-react";

interface DashboardChartsProps {
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

const REVENUE_TIMELINE = [
  { month: "Jan", revenue: 420000, target: 400000, profit: 142000 },
  { month: "Feb", revenue: 460000, target: 420000, profit: 161000 },
  { month: "Mar", revenue: 510000, target: 450000, profit: 182000 },
  { month: "Apr", revenue: 490000, target: 470000, profit: 168000 },
  { month: "May", revenue: 580000, target: 500000, profit: 215000 },
  { month: "Jun", revenue: 640000, target: 530000, profit: 243000 },
  { month: "Jul", revenue: 690000, target: 560000, profit: 265000 },
  { month: "Aug", revenue: 730000, target: 600000, profit: 284000 },
  { month: "Sep", revenue: 790000, target: 630000, profit: 312000 },
  { month: "Oct", revenue: 840000, target: 670000, profit: 335000 },
  { month: "Nov", revenue: 910000, target: 720000, profit: 372000 },
  { month: "Dec", revenue: 980000, target: 780000, profit: 410000 },
];

const CATEGORY_SHARE = [
  { name: "Burgers & Sandwiches", value: 38, sales: "₹3.42L", color: "#3B82F6" },
  { name: "Beverages & Shakes", value: 24, sales: "₹2.16L", color: "#10B981" },
  { name: "Value Combos", value: 18, sales: "₹1.62L", color: "#F59E0B" },
  { name: "Sides & Crisps", value: 12, sales: "₹1.08L", color: "#EC4899" },
  { name: "Desserts & Pastries", value: 8, sales: "₹0.72L", color: "#8B5CF6" },
];

const RADIAL_METRICS = [
  { name: "Sales Target", value: 112, fill: "#10B981" },
  { name: "SOP Audit", value: 95, fill: "#3B82F6" },
  { name: "Customer CSAT", value: 92, fill: "#8B5CF6" },
  { name: "Zero-Waste SLA", value: 78, fill: "#F59E0B" },
];

export default function DashboardCharts({ t, isDark = true }: DashboardChartsProps) {
  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;

  return (
    <div className="space-y-6">
      {/* 1. Composed Financial Runway & Yield Matrix */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <TrendingUp size={16} className="text-teal-400" />
              Annual Revenue Trajectory, Net Profit &amp; Target Forecast (Composed Chart)
            </h3>
            <p className="text-[11px]" style={{ color: textMuted }}>
              Consolidated 12-month performance comparing actual revenue area, profit bars, and sales targets.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={REVENUE_TIMELINE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
              <XAxis dataKey="month" stroke={textMuted} fontSize={10} tickLine={false} />
              <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }}
                formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" name="Gross Revenue" fill="#0D9488" stroke="#0D9488" fillOpacity={0.25} strokeWidth={2} />
              <Bar dataKey="profit" name="Net Profit" fill="#10B981" radius={[4, 4, 0, 0]} barSize={18} />
              <Line type="monotone" dataKey="target" name="Sales Target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut & Radial Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution Donut */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <PieIcon size={16} className="text-blue-400" />
              Menu Category Sales Distribution (Donut Chart)
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              5 Core Segments
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Proportional revenue contribution across food, beverage, and combo categories.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SHARE}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_SHARE.map((entry, index) => (
                      <Cell key={`dash-cat-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {CATEGORY_SHARE.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="truncate font-medium text-[11px]" style={{ color: textColor }}>{item.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono text-[11px]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radial Gauges: Enterprise OKRs */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Award size={16} className="text-emerald-400" />
              Strategic OKR Milestone Gauges (Radial Bars)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Network Target
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Concentric milestone rings for Sales Targets, SOP Audits, CSAT, and Waste SLA.
          </p>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={10}
                data={RADIAL_METRICS}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={6}
                />
                <Legend iconSize={9} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
