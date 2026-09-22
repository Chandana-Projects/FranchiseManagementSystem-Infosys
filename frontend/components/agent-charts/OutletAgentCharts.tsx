"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ComposedChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import { Store, Target, Clock, Zap, TrendingUp } from "lucide-react";

interface OutletChartsProps {
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

const OUTLET_BARS = [
  { outlet: "Pune Central", gmv: 840000, target: 800000, margin: 34 },
  { outlet: "Mumbai Bandra", gmv: 920000, target: 880000, margin: 31 },
  { outlet: "Bangalore Indiranagar", gmv: 780000, target: 750000, margin: 36 },
  { outlet: "Delhi Connaught", gmv: 710000, target: 720000, margin: 29 },
  { outlet: "Hyderabad HITEC", gmv: 660000, target: 650000, margin: 33 },
  { outlet: "Chennai Anna Nagar", gmv: 590000, target: 600000, margin: 32 },
];

const RADAR_BENCHMARK = [
  { metric: "Food Quality", Pune: 96, Mumbai: 92, Bangalore: 88 },
  { metric: "Hygiene & SOPs", Pune: 98, Mumbai: 86, Bangalore: 94 },
  { metric: "Kitchen Speed", Pune: 89, Mumbai: 94, Bangalore: 82 },
  { metric: "Customer CSAT", Pune: 95, Mumbai: 90, Bangalore: 92 },
  { metric: "Sales Target %", Pune: 108, Mumbai: 104, Bangalore: 96 },
  { metric: "Staff Retention", Pune: 91, Mumbai: 84, Bangalore: 89 },
];

const HOURLY_HEAT = [
  { hour: "10 AM", orders: 18, ticketTime: 4.2 },
  { hour: "11 AM", orders: 34, ticketTime: 5.1 },
  { hour: "12 PM", orders: 82, ticketTime: 7.8 },
  { hour: "01 PM", orders: 124, ticketTime: 9.4 },
  { hour: "02 PM", orders: 96, ticketTime: 8.2 },
  { hour: "03 PM", orders: 42, ticketTime: 5.4 },
  { hour: "04 PM", orders: 38, ticketTime: 4.8 },
  { hour: "05 PM", orders: 62, ticketTime: 6.2 },
  { hour: "06 PM", orders: 88, ticketTime: 7.5 },
  { hour: "07 PM", orders: 135, ticketTime: 10.1 },
  { hour: "08 PM", orders: 158, ticketTime: 11.4 },
  { hour: "09 PM", orders: 142, ticketTime: 9.8 },
  { hour: "10 PM", orders: 64, ticketTime: 6.0 },
];

const KITCHEN_SCATTER = [
  { orderVal: 220, prepMins: 4.2, items: 2 },
  { orderVal: 350, prepMins: 5.5, items: 3 },
  { orderVal: 480, prepMins: 6.8, items: 4 },
  { orderVal: 620, prepMins: 8.1, items: 5 },
  { orderVal: 850, prepMins: 11.2, items: 7 },
  { orderVal: 990, prepMins: 13.4, items: 9 },
  { orderVal: 1250, prepMins: 16.0, items: 12 },
  { orderVal: 410, prepMins: 9.8, items: 3 },
  { orderVal: 780, prepMins: 14.2, items: 6 },
];

export default function OutletAgentCharts({ t, isDark = true }: OutletChartsProps) {
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
      {/* Top 2 Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Outlet GMV & Target Bar Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Store size={16} className="text-purple-400" />
              Outlet GMV vs Sales Target (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              6 Outlets
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Monthly Gross Merchandise Value vs target with operating margin indicators.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OUTLET_BARS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="outlet" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="gmv" name="Actual GMV" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target GMV" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 360° Multi-Outlet Benchmark Radar Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Target size={16} className="text-teal-400" />
              360° Multi-Outlet Operational Benchmark (Radar)
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              6 Core Dimensions
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Cross-outlet operational performance across quality, hygiene, speed, CSAT, target, and retention.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_BENCHMARK}>
                <PolarGrid stroke={isDark ? "#334155" : "#E2E8F0"} />
                <PolarAngleAxis dataKey="metric" stroke={textMuted} fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 115]} stroke={textMuted} fontSize={9} />
                <Radar name="Pune Central" dataKey="Pune" stroke="#10B981" fill="#10B981" fillOpacity={0.35} />
                <Radar name="Mumbai Bandra" dataKey="Mumbai" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                <Radar name="Bangalore" dataKey="Bangalore" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Hourly Order Rush vs Kitchen Prep Time */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Clock size={16} className="text-amber-400" />
              Hourly Order Volume vs Ticket Prep Time (Dual-Axis)
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Peak: 1 PM & 8 PM
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Blue bars show hourly orders; Amber line tracks kitchen ticket duration in minutes.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={HOURLY_HEAT}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="hour" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="orders" name="Order Volume" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                <Line yAxisId="right" type="monotone" dataKey="ticketTime" name="Prep Time (Mins)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Kitchen Delay & Complexity Scatter Plot */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Zap size={16} className="text-rose-400" />
              Ticket Value vs Preparation Time (Scatter Plot)
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              SLA &lt; 10 Mins
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Correlation between cart order value (₹) and preparation time with outlier delay alerts.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis type="number" dataKey="orderVal" name="Order Value" unit="₹" stroke={textMuted} fontSize={10} />
                <YAxis type="number" dataKey="prepMins" name="Prep Time" unit="m" stroke={textMuted} fontSize={10} />
                <ZAxis range={[60, 180]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
                <Scatter name="Kitchen Orders" data={KITCHEN_SCATTER} fill="#EC4899" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
