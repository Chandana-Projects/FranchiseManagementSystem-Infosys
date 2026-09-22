"use client";

import React from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Brain, TrendingUp, AlertTriangle, Zap } from "lucide-react";

interface IntelligenceChartsProps {
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

const FORECAST_90D = [
  { day: "D+10", actual: 48000, forecast: 48000, upper: 51000, lower: 45000 },
  { day: "D+20", actual: 52000, forecast: 51000, upper: 55000, lower: 47000 },
  { day: "D+30", actual: 56000, forecast: 54000, upper: 59000, lower: 50000 },
  { day: "D+40", actual: null, forecast: 58000, upper: 64000, lower: 53000 },
  { day: "D+50", actual: null, forecast: 62000, upper: 69000, lower: 56000 },
  { day: "D+60", actual: null, forecast: 66000, upper: 74000, lower: 59000 },
  { day: "D+70", actual: null, forecast: 71000, upper: 80000, lower: 63000 },
  { day: "D+80", actual: null, forecast: 75000, upper: 85000, lower: 66000 },
  { day: "D+90", actual: null, forecast: 81000, upper: 92000, lower: 71000 },
];

const PREDICTIVE_RISKS = [
  { risk: "Aurangabad Staff Churn", probability: 74, impact: "High", color: "#F43F5E" },
  { risk: "Cheese Stockout (Mumbai)", probability: 68, impact: "High", color: "#FB923C" },
  { risk: "POS Void Spike (Delhi)", probability: 54, impact: "Medium", color: "#FBBF24" },
  { risk: "Rainy Footfall Lag", probability: 42, impact: "Low", color: "#3B82F6" },
  { risk: "Dairy Inflation Surge", probability: 38, impact: "Low", color: "#10B981" },
];

const SURGE_ELASTICITY = [
  { surge: "1.0x (Base)", volumeChange: 0, marginYield: 68.0 },
  { surge: "1.05x (+5%)", volumeChange: -1.2, marginYield: 69.8 },
  { surge: "1.10x (+10%)", volumeChange: -3.4, marginYield: 71.4 },
  { surge: "1.15x (+15%)", volumeChange: -6.8, marginYield: 72.8 },
  { surge: "1.20x (+20%)", volumeChange: -11.5, marginYield: 73.6 },
];

export default function IntelligenceAgentCharts({ t, isDark = true }: IntelligenceChartsProps) {
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
      {/* Top Chart: AI 90-Day Predictive Runway with Confidence Bounds */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
            <Brain size={16} className="text-teal-400" />
            AI 90-Day Revenue Forecasting &amp; Confidence Bands (Area Chart)
          </h3>
          <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
            R² = 0.942 (XGBoost)
          </span>
        </div>
        <p className="text-[11px] mb-4" style={{ color: textMuted }}>
          Machine learning projected revenue trajectory with 95% upper and lower statistical confidence intervals.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST_90D}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
              <XAxis dataKey="day" stroke={textMuted} fontSize={10} tickLine={false} />
              <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="upper" name="Upper 95% Bound" stroke="#10B981" strokeDasharray="4 4" fill="#10B981" fillOpacity={0.1} />
              <Area type="monotone" dataKey="forecast" name="ML Projected Runway" stroke="#0D9488" strokeWidth={2.5} fill="#0D9488" fillOpacity={0.2} />
              <Area type="monotone" dataKey="lower" name="Lower 95% Bound" stroke="#F59E0B" strokeDasharray="4 4" fill="none" />
              <Line type="monotone" dataKey="actual" name="Historical Actuals" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: "#3B82F6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom 2 Graphs: Risk Probability Bars & Dynamic Yield Surge Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2: Predictive Risk Probability Bars */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <AlertTriangle size={16} className="text-rose-400" />
              Predictive Risk Probability Matrix (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              Anomaly Sentinel
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Calculated likelihood of operational anomalies, stockouts, and staff attrition.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={PREDICTIVE_RISKS} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis type="number" stroke={textMuted} fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="risk" stroke={textMuted} fontSize={9} width={130} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="probability" name="Risk Likelihood %" fill="#F43F5E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Dynamic Price Elasticity & Surge Yield */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Zap size={16} className="text-amber-400" />
              Dynamic Yield Surge &amp; Margin Elasticity (Line)
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Optimal: +4% Yield
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Trade-off between price surge multiplier and net margin yield gain during peak hours.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SURGE_ELASTICITY}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="surge" stroke={textMuted} fontSize={9} tickLine={false} />
                <YAxis yAxisId="margin" stroke="#10B981" domain={[65, 75]} fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="vol" orientation="right" stroke="#F43F5E" domain={[-15, 5]} fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="margin" type="monotone" dataKey="marginYield" name="Gross Margin Yield %" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="vol" type="monotone" dataKey="volumeChange" name="Order Volume Shift %" stroke="#F43F5E" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
