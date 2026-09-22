"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Legend
} from "recharts";
import { ShieldCheck, Target, TrendingUp, AlertTriangle } from "lucide-react";

interface AuditChartsProps {
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

const CATEGORY_SCORES = [
  { category: "Food Safety & Temp", score: 96, target: 95 },
  { category: "Opening/Closing SOP", score: 92, target: 90 },
  { category: "Staff Hygiene & Attire", score: 86, target: 90 },
  { category: "Cash & POS Ledger", score: 82, target: 95 },
  { category: "Kitchen Disinfection", score: 95, target: 90 },
  { category: "Waste Segregation", score: 89, target: 85 },
];

const HISTORICAL_TRENDS = [
  { month: "Jan", Pune: 92, Mumbai: 84, Nashik: 95, Aurangabad: 68 },
  { month: "Feb", Pune: 94, Mumbai: 88, Nashik: 96, Aurangabad: 72 },
  { month: "Mar", Pune: 95, Mumbai: 86, Nashik: 94, Aurangabad: 64 },
  { month: "Apr", Pune: 98, Mumbai: 90, Nashik: 98, Aurangabad: 78 },
  { month: "May", Pune: 97, Mumbai: 92, Nashik: 96, Aurangabad: 82 },
  { month: "Jun", Pune: 99, Mumbai: 94, Nashik: 97, Aurangabad: 85 },
];

const SEVERITY_SHARE = [
  { name: "Healthy (Grade AAA)", value: 65, count: "26 audits", color: "#10B981" },
  { name: "Watchlist (Minor Flags)", value: 25, count: "10 audits", color: "#F59E0B" },
  { name: "Critical Violations", value: 10, count: "4 audits", color: "#F43F5E" },
];

const COMPLIANCE_RADAR = [
  { metric: "Cold Chain Temp", score: 98, target: 95 },
  { metric: "HACCP Sanitation", score: 94, target: 90 },
  { metric: "Cash Audit", score: 84, target: 95 },
  { metric: "Uniform & Grooming", score: 88, target: 90 },
  { metric: "Pest Control", score: 96, target: 90 },
  { metric: "Waste Disposal", score: 92, target: 85 },
];

export default function AuditAgentCharts({ t, isDark = true }: AuditChartsProps) {
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
      {/* Top 2 Graphs: Category Compliance & Historical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Audit Compliance by Category Bar Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <ShieldCheck size={16} className="text-teal-400" />
              Inspection Scores by Audit Category (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              SLA Standard &gt; 90%
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Current audit attainment score compared to minimum franchise safety thresholds.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SCORES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="category" stroke={textMuted} fontSize={9} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="score" name="Attained Score" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Benchmark" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Historical Multi-Outlet Audit Score Line Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <TrendingUp size={16} className="text-blue-400" />
              Historical Audit Scores by Outlet (Line Chart)
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              6-Month Trend
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Tracking safety and SOP adherence trajectory across regional franchise stores.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="month" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Pune" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Mumbai" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Nashik" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Aurangabad" stroke="#F43F5E" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Graphs: Findings Severity Donut & Compliance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Findings Severity Donut */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <AlertTriangle size={16} className="text-amber-400" />
              Audit Findings Severity Breakdown (Donut)
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              40 Audits
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Proportion of healthy audits vs minor warnings vs critical flagged violations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SEVERITY_SHARE}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SEVERITY_SHARE.map((entry, index) => (
                      <Cell key={`sev-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {SEVERITY_SHARE.map((item) => (
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

        {/* Chart 4: Multi-Vector Compliance Radar */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Target size={16} className="text-purple-400" />
              Safety, Hygiene & SOP Radar Matrix
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              6 Vectors
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Holistic compliance rating across cold-chain, pest control, hygiene, and cash.
          </p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={COMPLIANCE_RADAR}>
                <PolarGrid stroke={isDark ? "#334155" : "#E2E8F0"} />
                <PolarAngleAxis dataKey="metric" stroke={textMuted} fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={textMuted} fontSize={9} />
                <Radar name="Network Average" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} />
                <Radar name="Standard SLA" dataKey="target" stroke="#0D9488" strokeDasharray="3 3" fill="none" />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
