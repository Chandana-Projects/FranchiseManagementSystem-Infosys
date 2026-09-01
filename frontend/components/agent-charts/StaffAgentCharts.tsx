"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Legend
} from "recharts";
import { Users, Clock, Award, ShieldCheck } from "lucide-react";

interface StaffChartsProps {
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

const SHIFT_HOURS = [
  { outlet: "Pune FC Rd", scheduled: 160, actual: 154, overtime: 12 },
  { outlet: "Mumbai Andheri", scheduled: 180, actual: 172, overtime: 24 },
  { outlet: "Nashik City", scheduled: 120, actual: 118, overtime: 6 },
  { outlet: "Bangalore", scheduled: 150, actual: 148, overtime: 16 },
  { outlet: "Aurangabad", scheduled: 110, actual: 98, overtime: 4 }, // absenteeism
  { outlet: "Thane Hub", scheduled: 140, actual: 138, overtime: 10 },
];

const ROLES_SHARE = [
  { name: "Kitchen & Chefs", value: 38, count: "42 staff", color: "#3B82F6" },
  { name: "Cashiers & POS", value: 24, count: "26 staff", color: "#10B981" },
  { name: "Shift Supervisors", value: 16, count: "18 staff", color: "#F59E0B" },
  { name: "Prep & Packing", value: 14, count: "15 staff", color: "#8B5CF6" },
  { name: "Sanitation Staff", value: 8, count: "9 staff", color: "#EC4899" },
];

const SPEED_CSAT_TREND = [
  { week: "W1", prepSpeed: 7.8, csat: 4.3 },
  { week: "W2", prepSpeed: 7.4, csat: 4.4 },
  { week: "W3", prepSpeed: 6.9, csat: 4.6 },
  { week: "W4", prepSpeed: 6.5, csat: 4.7 },
  { week: "W5", prepSpeed: 6.2, csat: 4.8 },
  { week: "W6", prepSpeed: 5.9, csat: 4.9 },
];

const WORKFORCE_RADAR = [
  { metric: "Punctuality", Score: 94, Target: 90 },
  { metric: "SOP Hygiene", Score: 96, Target: 95 },
  { metric: "Order Speed", Score: 88, Target: 85 },
  { metric: "Retention Rate", Score: 91, Target: 85 },
  { metric: "Cross-Training", Score: 82, Target: 80 },
  { metric: "Safety Audit", Score: 98, Target: 95 },
];

export default function StaffAgentCharts({ t, isDark = true }: StaffChartsProps) {
  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;

  return (
    <div className="space-y-6">
      {/* Top 2 Graphs: Shift Hours & Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Shift Hours vs Actual vs Overtime */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Clock size={16} className="text-teal-400" />
              Scheduled vs Actual vs Overtime Hours (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              Weekly Shift Log
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Roster coverage and overtime stress index across franchise outlets.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHIFT_HOURS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="outlet" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="scheduled" name="Scheduled" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overtime" name="Overtime" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Staff Role Distribution Donut Chart */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Users size={16} className="text-blue-400" />
              Workforce Role & Designation Distribution (Donut)
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              110 Total Personnel
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Proportion of staff assigned to kitchen stations, counters, and supervisors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ROLES_SHARE}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ROLES_SHARE.map((entry, index) => (
                      <Cell key={`role-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {ROLES_SHARE.map((role) => (
                <div key={role.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: role.color }} />
                    <span className="truncate font-medium text-[11px]" style={{ color: textColor }}>{role.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono text-[11px]">{role.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Graphs: Speed vs CSAT Line & Workforce Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Weekly Dispatch Speed vs CSAT Trend */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Award size={16} className="text-emerald-400" />
              Speed of Service vs Customer CSAT Rating (Line Chart)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Last 6 Weeks
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Direct relationship between kitchen turnaround time (mins) and store satisfaction score.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPEED_CSAT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="week" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis yAxisId="speed" stroke="#F59E0B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <YAxis yAxisId="csat" orientation="right" stroke="#10B981" domain={[3.5, 5]} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="speed" type="monotone" dataKey="prepSpeed" name="Avg Prep Time (Mins)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="csat" type="monotone" dataKey="csat" name="CSAT Rating (out of 5)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Workforce Radar Competency Index */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <ShieldCheck size={16} className="text-purple-400" />
              Workforce Competency & Morale Index (Radar)
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              6 Assessment Vectors
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Consolidated staff proficiency and operational reliability benchmarks.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={WORKFORCE_RADAR}>
                <PolarGrid stroke={isDark ? "#334155" : "#E2E8F0"} />
                <PolarAngleAxis dataKey="metric" stroke={textMuted} fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={textMuted} fontSize={9} />
                <Radar name="Current Score" dataKey="Score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} />
                <Radar name="Target SLA" dataKey="Target" stroke="#0D9488" strokeDasharray="3 3" fill="none" />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
