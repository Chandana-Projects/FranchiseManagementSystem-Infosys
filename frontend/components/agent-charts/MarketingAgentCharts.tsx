"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Line, ComposedChart, Legend
} from "recharts";
import { Megaphone, Target, TrendingUp, Users } from "lucide-react";

interface MarketingChartsProps {
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

const CAMPAIGN_PERFORMANCE = [
  { name: "Summer Refresher", spend: 45000, revenue: 168000, roi: 3.7 },
  { name: "Monsoon Hot Brew", spend: 30000, revenue: 112000, roi: 3.7 },
  { name: "Midnight Combos", spend: 25000, revenue: 105000, roi: 4.2 },
  { name: "Loyalty Boost", spend: 20000, revenue: 98000, roi: 4.9 },
  { name: "Student Meal Deal", spend: 18000, revenue: 76000, roi: 4.2 },
];

const CAC_LTV_TIMELINE = [
  { month: "Jan", cac: 180, ltv: 1420 },
  { month: "Feb", cac: 172, ltv: 1480 },
  { month: "Mar", cac: 165, ltv: 1540 },
  { month: "Apr", cac: 158, ltv: 1620 },
  { month: "May", cac: 146, ltv: 1710 },
  { month: "Jun", cac: 138, ltv: 1820 },
];

const AUDIENCE_DEMO = [
  { name: "Working Professionals (24-38)", value: 42, color: "#3B82F6" },
  { name: "Students & Gen-Z (18-24)", value: 34, color: "#10B981" },
  { name: "Families & Groups", value: 18, color: "#F59E0B" },
  { name: "Senior Diners", value: 6, color: "#8B5CF6" },
];

const FUNNEL_DATA = [
  { stage: "1. Ad Impressions", volume: 215000, rate: "100%" },
  { stage: "2. Clicks & Leads", volume: 68000, rate: "31.6%" },
  { stage: "3. Store Footfall", volume: 24000, rate: "11.1%" },
  { stage: "4. Placed Orders", volume: 18500, rate: "8.6%" },
  { stage: "5. Loyalty Joins", volume: 9200, rate: "4.3%" },
];

export default function MarketingAgentCharts({ t, isDark = true }: MarketingChartsProps) {
  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;
  const tooltipStyle = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    border: `1px solid ${isDark ? "#334155" : "#CBD5E1"}`,
    borderRadius: 8,
    color: isDark ? "#fff" : "#0F172A",
    fontSize: 11,
  };

  return (
    <div className="space-y-6">
      {/* Top 2 Graphs: Campaign ROI & CAC/LTV Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Campaign Spend vs Revenue Bar Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Megaphone size={16} className="text-teal-400" />
              Campaign Spend vs Generated Revenue (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              Avg ROI: 4.1x
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Ad expenditure compared directly against attributable franchise sales revenue.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAMPAIGN_PERFORMANCE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="name" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="spend" name="Ad Spend" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Sales Generated" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: CAC vs LTV Ratio Area Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <TrendingUp size={16} className="text-blue-400" />
              Customer Acquisition Cost (CAC) vs Lifetime Value (Area)
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              LTV:CAC Ratio: 13.2x
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Improving customer unit economics over the last 6 operating months.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CAC_LTV_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="month" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="ltv" name="Customer Lifetime Value (LTV)" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Area type="monotone" dataKey="cac" name="Acquisition Cost (CAC)" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Graphs: Audience Demographics & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Customer Demographic Share Pie */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Users size={16} className="text-purple-400" />
              Customer Demographics & Target Audience (Pie)
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              4 Customer Clusters
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Footfall distribution by age group and customer persona profiles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AUDIENCE_DEMO}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {AUDIENCE_DEMO.map((entry, index) => (
                      <Cell key={`demo-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {AUDIENCE_DEMO.map((item) => (
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

        {/* Chart 4: Conversion & Retention Funnel */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Target size={16} className="text-amber-400" />
              Marketing Funnel & Retention Velocity (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              8.6% Order Conversion
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Customer journey progression from campaign views to repeat loyalty orders.
          </p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={FUNNEL_DATA} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis type="number" stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="stage" stroke={textMuted} fontSize={10} tickLine={false} width={110} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="volume" name="Users" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
