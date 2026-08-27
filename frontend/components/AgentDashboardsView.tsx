"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import {
  Store, Boxes, Users, Megaphone, ShieldCheck, Brain,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowRight,
  Sparkles, RefreshCw, Zap, Clock, Target, Layers, Play, Check, ChevronDown, ChevronUp,
  HelpCircle, Activity, Gauge, Sliders, FileText, Compass, BarChart3, Filter,
  DollarSign, PieChart as PieIcon, Cpu, AlertOctagon, ArrowUpRight, ArrowDownRight,
  Radio, Shuffle, ShieldAlert, CheckCircle, ExternalLink, Download
} from "lucide-react";
import { playTechChime } from "../lib/WebAudioSFX";

interface AgentDashboardsViewProps {
  t: any;
  accent: string;
  isDark?: boolean;
  inventorySummary?: any;
  inventoryItems?: any[];
  outletPerformance?: any[];
  audits?: any[];
  attendanceLog?: any[];
  marketingCampaigns?: any[];
  revenueTrendByOutlet?: any;
  healthComponents?: any[];
  predictedRisks?: any[];
  onNavigateTab?: (tabId: string) => void;
}

export default function AgentDashboardsView({
  t,
  accent,
  isDark = true,
  inventorySummary,
  inventoryItems = [],
  outletPerformance = [],
  audits = [],
  attendanceLog = [],
  marketingCampaigns = [],
  revenueTrendByOutlet,
  healthComponents = [],
  predictedRisks = [],
  onNavigateTab,
}: AgentDashboardsViewProps) {
  // Navigation & Control States
  const [activeTab, setActiveTab] = useState<string>("outlet");
  const [timeRange, setTimeRange] = useState<string>("30D");

  // What-If Sandbox States
  const [sandboxOpen, setSandboxOpen] = useState<boolean>(false);
  const [simDiscount, setSimDiscount] = useState<number>(20);
  const [simStaffCoverage, setSimStaffCoverage] = useState<number>(100);
  const [simReorderDays, setSimReorderDays] = useState<number>(7);

  // Live Telemetry Event Ticker
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, text: "Pune FC Road: Cold brew batch #419 completed · Quality 99.4%", tag: "QUALITY_OK", time: "Just now" },
    { id: 2, text: "Mumbai Andheri: Peak hour footfall +34% above forecast", tag: "DEMAND_SURGE", time: "1m ago" },
    { id: 3, text: "Outlet 17: Automatic reorder PO #881 dispatched to BeanMaster", tag: "AUTO_REORDER", time: "2m ago" },
    { id: 4, text: "Thane Hub: HACCP Food Safety inspection verified (Score 98/100)", tag: "AUDIT_PASS", time: "4m ago" },
  ]);

  // Tab Configs with Subtitles & Alert Badges
  const TABS = [
    { id: "outlet", label: "1. Outlet Performance", subtitle: "Sales, Margins & Ranking", icon: Store, alertCount: 2 },
    { id: "inventory", label: "2. Inventory Intelligence", subtitle: "Stock Cover & Wastage", icon: Boxes, alertCount: 3 },
    { id: "staff", label: "3. Workforce & Roster", subtitle: "Attendance & Peak Demand", icon: Users, alertCount: 1 },
    { id: "marketing", label: "4. Marketing Engine", subtitle: "Campaign ROAS & CAC", icon: Megaphone, alertCount: 0 },
    { id: "audit", label: "5. Audit & Compliance", subtitle: "SOPs & Safety Checks", icon: ShieldCheck, alertCount: 1 },
    { id: "intelligence", label: "6. Executive Overview", subtitle: "Consolidated Health Radar", icon: Brain, alertCount: 4 },
  ];

  // Dynamic calculations for What-If Simulator
  const simulatedGrossMargin = Math.max(8, Math.min(28, +(22 - (simDiscount - 10) * 0.45).toFixed(1)));
  const simulatedRevenueGrowth = +(5.2 + (simDiscount - 10) * 0.6 + (simStaffCoverage - 100) * 0.08).toFixed(1);
  const simulatedStockoutRisk = +(Math.max(1.2, (simReorderDays - 4) * 1.4)).toFixed(1);
  const simulatedQueueTime = Math.max(1.5, +(4.2 - (simStaffCoverage - 80) * 0.04).toFixed(1));

  // Radar Data for Executive Overview
  const executiveRadarData = [
    { subject: "Sales Growth", score: 88, target: 90 },
    { subject: "Gross Margin", score: 78, target: 85 },
    { subject: "Inventory Cover", score: 84, target: 80 },
    { subject: "Workforce Roster", score: 86, target: 85 },
    { subject: "Audit SOPs", score: 94, target: 95 },
    { subject: "Marketing ROAS", score: 82, target: 80 },
  ];

  // Marketing Funnel Data
  const marketingFunnelData = [
    { stage: "Ad Reach", count: "332,000", drop: "100%", fill: "#38BDF8" },
    { stage: "Impressions", count: "215,000", drop: "64.8%", fill: "#818CF8" },
    { stage: "Clicks / Leads", count: "68,000", drop: "20.5%", fill: "#A855F7" },
    { stage: "Conversions (8.6%)", count: "18,500", drop: "5.6%", fill: "#2DD4BF" },
  ];

  // Workforce Demand vs Staffing Data
  const staffingDemandData = [
    { time: "08:00", requiredStaff: 3, actualStaff: 3, footfall: 45, queue: 1.8 },
    { time: "11:00", requiredStaff: 5, actualStaff: 4, footfall: 110, queue: 2.4 },
    { time: "13:00 (Peak)", requiredStaff: 8, actualStaff: 6, footfall: 240, queue: 4.8 },
    { time: "16:00", requiredStaff: 4, actualStaff: 5, footfall: 85, queue: 1.9 },
    { time: "19:00 (Peak)", requiredStaff: 9, actualStaff: 6, footfall: 290, queue: 5.2 },
    { time: "21:30", requiredStaff: 4, actualStaff: 4, footfall: 60, queue: 2.1 },
  ];

  // ABC Inventory Analysis
  const abcInventoryData = [
    { category: "Class A (70% Value)", items: "Arabica Roast, Whole Milk, Oat Milk", share: "70%", stockCover: "5.4 days", status: "Critical JIT" },
    { category: "Class B (20% Value)", items: "Vanilla Syrup, Hazelnut, Pastries", share: "20%", stockCover: "12.0 days", status: "Stable" },
    { category: "Class C (10% Value)", items: "Paper Cups (500ml), Napkins, Stirrers", share: "10%", stockCover: "24.5 days", status: "Surplus" },
  ];

  // Compliance Heatmap Matrix
  const complianceMatrix = [
    { outlet: "Nashik Hub", hygiene: 98, safety: 95, cash: 99, branding: 96, overall: "97%" },
    { outlet: "Pune FC Road", hygiene: 96, safety: 92, cash: 98, branding: 94, overall: "95%" },
    { outlet: "Mumbai Andheri", hygiene: 84, safety: 78, cash: 92, branding: 88, overall: "85%" },
    { outlet: "Nagpur Central", hygiene: 94, safety: 90, cash: 96, branding: 92, overall: "93%" },
    { outlet: "Aurangabad Hub", hygiene: 68, safety: 62, cash: 74, branding: 70, overall: "68%" },
    { outlet: "Solapur Branch", hygiene: 88, safety: 85, cash: 90, branding: 89, overall: "88%" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Live Telemetry Stream, Pulse Badge & Controls */}
      <div
        className="rounded-2xl border p-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-2xl relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))"
            : "linear-gradient(135deg, #FFFFFF, #F8FAFC)",
          borderColor: t.border,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 relative"
            style={{ background: `${accent}22`, borderColor: `${accent}55` }}
          >
            <Cpu size={24} color={accent} className="animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold tracking-tight" style={{ color: t.text }}>
                Executive Agent Intelligence Command Center
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                NEURAL STREAM ACTIVE
              </span>
            </div>
            <p className="text-xs" style={{ color: t.textMuted }}>
              Cross-agent telemetry connecting POS, JIT Inventory, Biometric Roster, ROAS Funnels & SOP Audits.
            </p>
          </div>
        </div>

        {/* Global Controls: Time Window, What-If Sandbox & Case Study Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/30 rounded-xl p-1 border" style={{ borderColor: t.border }}>
            {["24H", "7D", "30D", "Quarter", "YTD"].map((rng) => (
              <button
                key={rng}
                onClick={() => {
                  try { playTechChime(); } catch (e) {}
                  setTimeRange(rng);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                style={{
                  background: timeRange === rng ? `${accent}33` : "transparent",
                  color: timeRange === rng ? accent : t.textFaint,
                  border: timeRange === rng ? `1px solid ${accent}66` : "1px solid transparent",
                }}
              >
                {rng}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              try { playTechChime(); } catch (e) {}
              setSandboxOpen(!sandboxOpen);
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
            style={{
              background: sandboxOpen ? `${accent}33` : `${accent}15`,
              borderColor: `${accent}66`,
              color: accent,
            }}
          >
            <Sliders size={14} />
            {sandboxOpen ? "Close What-If Sandbox" : "What-If AI Sandbox"}
          </button>
        </div>
      </div>

      {/* LIVE NEURAL TICKER */}
      <div
        className="rounded-xl border px-4 py-2 flex items-center justify-between gap-3 text-xs overflow-hidden shadow-md backdrop-blur-md"
        style={{ background: isDark ? "rgba(13, 17, 26, 0.94)" : "#F1F5F9", borderColor: t.border }}
      >
        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] font-bold text-sky-400">
          <Radio size={13} className="animate-pulse" /> LIVE TELEMETRY LOGS:
        </div>
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-slate-300 font-sans text-xs scrollbar-none">
          {liveEvents.map((evt) => (
            <span key={evt.id} className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300">
                {evt.tag}
              </span>
              <span>{evt.text}</span>
              <span className="text-[10px] text-slate-400 font-mono">({evt.time})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WHAT-IF AI SCENARIO SANDBOX (SIMULATION ENGINE) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {sandboxOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border p-6 shadow-2xl relative overflow-hidden space-y-4"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(24, 32, 54, 0.95))"
                : "linear-gradient(135deg, #FFFFFF, #F8FAFC)",
              borderColor: isDark ? `${accent}88` : `${accent}66`,
              color: t.text,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center gap-2">
                <Sliders size={20} color={accent} />
                <div>
                  <h3 className="text-base font-extrabold" style={{ color: t.text }}>
                    What-If AI Operational Scenario Simulator
                  </h3>
                  <p className="text-xs" style={{ color: t.textFaint }}>
                    Adjust operational levers to model live impact on margins, revenue growth, stockouts & queue times.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                DYNAMIC ML PREDICTIVE MODEL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Discount Rate */}
              <div className="space-y-2 p-3.5 rounded-xl border" style={{ background: isDark ? "rgba(15, 23, 42, 0.6)" : "#F1F5F9", borderColor: t.border }}>
                <div className="flex justify-between text-xs font-bold" style={{ color: t.text }}>
                  <span>Promotional Discount Rate</span>
                  <span className="text-amber-500 dark:text-amber-400 font-mono text-sm">{simDiscount}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={simDiscount}
                  onChange={(e) => setSimDiscount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px]" style={{ color: t.textFaint }}>
                  <span>0% (Full Price)</span>
                  <span>20% (Standard)</span>
                  <span>40% (Aggressive)</span>
                </div>
              </div>

              {/* Slider 2: Staff Coverage */}
              <div className="space-y-2 p-3.5 rounded-xl border" style={{ background: isDark ? "rgba(15, 23, 42, 0.6)" : "#F1F5F9", borderColor: t.border }}>
                <div className="flex justify-between text-xs font-bold" style={{ color: t.text }}>
                  <span>Peak Shift Staff Coverage</span>
                  <span className="text-sky-500 dark:text-sky-400 font-mono text-sm">{simStaffCoverage}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={140}
                  value={simStaffCoverage}
                  onChange={(e) => setSimStaffCoverage(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px]" style={{ color: t.textFaint }}>
                  <span>60% (Understaffed)</span>
                  <span>100% (Balanced)</span>
                  <span>140% (Full Support)</span>
                </div>
              </div>

              {/* Slider 3: Reorder Frequency */}
              <div className="space-y-2 p-3.5 rounded-xl border" style={{ background: isDark ? "rgba(15, 23, 42, 0.6)" : "#F1F5F9", borderColor: t.border }}>
                <div className="flex justify-between text-xs font-bold" style={{ color: t.text }}>
                  <span>JIT Reorder Cycle</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-mono text-sm">{simReorderDays} days</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={14}
                  value={simReorderDays}
                  onChange={(e) => setSimReorderDays(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px]" style={{ color: t.textFaint }}>
                  <span>2 days (Hyper JIT)</span>
                  <span>7 days (Weekly)</span>
                  <span>14 days (Bi-weekly)</span>
                </div>
              </div>
            </div>

            {/* Projected Impact Output Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl border text-center" style={{ background: isDark ? "rgba(0,0,0,0.4)" : "#F8FAFC", borderColor: t.border }}>
                <div className="text-xs font-semibold mb-1" style={{ color: t.textFaint }}>Simulated Margin</div>
                <div className={`text-2xl font-black ${simulatedGrossMargin >= 18 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                  {simulatedGrossMargin}%
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: t.textFaint }}>
                  {simulatedGrossMargin >= 18 ? "✓ Healthy Profitability" : "⚠️ Margin Compression"}
                </div>
              </div>

              <div className="p-3 rounded-xl border text-center" style={{ background: isDark ? "rgba(0,0,0,0.4)" : "#F8FAFC", borderColor: t.border }}>
                <div className="text-xs font-semibold mb-1" style={{ color: t.textFaint }}>Projected Sales Lift</div>
                <div className="text-2xl font-black text-sky-500 dark:text-sky-400">+{simulatedRevenueGrowth}%</div>
                <div className="text-[10px] mt-0.5" style={{ color: t.textFaint }}>Estimated Footfall Uplift</div>
              </div>

              <div className="p-3 rounded-xl border text-center" style={{ background: isDark ? "rgba(0,0,0,0.4)" : "#F8FAFC", borderColor: t.border }}>
                <div className="text-xs font-semibold mb-1" style={{ color: t.textFaint }}>Stockout Probability</div>
                <div className={`text-2xl font-black ${simulatedStockoutRisk <= 4 ? "text-emerald-500 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}`}>
                  {simulatedStockoutRisk}%
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: t.textFaint }}>Risk of item depletion</div>
              </div>

              <div className="p-3 rounded-xl border text-center" style={{ background: isDark ? "rgba(0,0,0,0.4)" : "#F8FAFC", borderColor: t.border }}>
                <div className="text-xs font-semibold mb-1" style={{ color: t.textFaint }}>Avg Customer Wait</div>
                <div className={`text-2xl font-black ${simulatedQueueTime <= 3.0 ? "text-emerald-500 dark:text-emerald-400" : "text-orange-500 dark:text-orange-400"}`}>
                  {simulatedQueueTime} mins
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: t.textFaint }}>Service speed benchmark</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ========================================================================= */}
      {/* 6 SUB-TABS SELECTOR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const isActive = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => {
                try { playTechChime(); } catch (e) {}
                setActiveTab(tb.id);
              }}
              className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group shadow-md flex flex-col justify-between"
              style={{
                background: isActive ? `${accent}1E` : t.card,
                borderColor: isActive ? `${accent}99` : t.border,
                color: isActive ? t.text : t.textMuted,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: accent }}
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner"
                  style={{ background: isActive ? `${accent}33` : t.inputBg }}
                >
                  <Icon size={18} color={isActive ? accent : t.textFaint} />
                </div>
                {tb.alertCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {tb.alertCount} alerts
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold truncate" style={{ color: isActive ? accent : t.text }}>
                  {tb.label}
                </p>
                <p className="text-[10px] truncate" style={{ color: t.textFaint }}>
                  {tb.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OUTLET PERFORMANCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "outlet" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Monthly Sales</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">+14.2% MoM</span>
              </div>
              <div className="text-3xl font-black tracking-tight" style={{ color: t.text }}>₹8.4L</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Avg ₹1.05L per branch · 16 Active Outlets</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Gross Margin</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Target: 22%</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">18.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Net Contribution: ₹1.51L after COGS</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Customer Rating</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">1.2K Reviews</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">4.6 / 5.0</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>94% positive sentiment on beverage quality</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Target Achievement</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Near Goal</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">92%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>14 of 16 outlets at or above monthly benchmark</p>
            </div>
          </div>

          {/* Visuals: Sales Trend & Target vs Actual Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border p-5 shadow-md" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold" style={{ color: t.text }}>Sales Trend vs. Revenue Benchmark</h4>
                  <p className="text-xs" style={{ color: t.textFaint }}>Multi-month network progression with forecast line</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/20 border" style={{ borderColor: t.border, color: accent }}>
                  ₹1.35Cr Total FY26
                </span>
              </div>

              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={revenueTrendByOutlet?.All || [
                  { month: "Feb", revenue: 412000 },
                  { month: "Mar", revenue: 458000 },
                  { month: "Apr", revenue: 441000 },
                  { month: "May", revenue: 502000 },
                  { month: "Jun", revenue: 489000 },
                  { month: "Jul", revenue: 561000 },
                ]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accent} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={accent} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                  <YAxis tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                  <Tooltip
                    contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text }}
                    formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={accent} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Outlet Ranking Leaderboard */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Outlet Ranking & Status</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Sorted by revenue, margin and growth</p>

                <div className="space-y-2.5">
                  {outletPerformance.slice(0, 4).map((out, idx) => (
                    <div key={out.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/10 border" style={{ borderColor: t.border }}>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-[10px]" style={{ color: t.text }}>
                          #{idx + 1}
                        </span>
                        <span className="font-semibold truncate max-w-[120px]" style={{ color: t.text }}>{out.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block" style={{ color: accent }}>₹{(out.sales / 1000).toFixed(0)}k</span>
                        <span className={`text-[10px] font-bold ${out.growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {out.growth >= 0 ? "+" : ""}{out.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Advisor Box */}
              <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                  <Sparkles size={13} /> Decision Advisor Example:
                </div>
                <p className="text-[11px] text-amber-100/90 leading-snug">
                  "Outlet A has high sales but falling margin — investigate discounting or product mix."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. INVENTORY DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "inventory" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Units On Hand</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">11 SKUs</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">1,240</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Total active batch volume across 8 hubs</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Stock Cover</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Healthy Zone</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">7.2 days</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Automated JIT replenishment scheduled in 48h</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Stockout Rate</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Low Risk</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">3.8%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>2 items below safety threshold in Aurangabad</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Wastage Rate</span>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">Within Target</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-orange-400">6.1%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Primarily dairy and perishables FIFO rotated</p>
            </div>
          </div>

          {/* Visuals: ABC Classification Matrix & Wastage by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border p-5 shadow-md" style={{ background: t.card, borderColor: t.border }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>ABC Stock Inventory Classification</h4>
              <p className="text-xs mb-4" style={{ color: t.textFaint }}>Value concentration vs stock cover duration</p>

              <div className="space-y-3">
                {abcInventoryData.map((abc) => (
                  <div key={abc.category} className="p-3 rounded-xl border bg-black/10" style={{ borderColor: t.border }}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-200">{abc.category}</span>
                      <span className="font-mono text-cyan-400 font-bold">{abc.stockCover}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{abc.items}</p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">Share: {abc.share}</span>
                      <span className="font-bold text-amber-300">{abc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reorder Alerts & Decisions */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Automated JIT Reorder & Transfers</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Critical replenishment recommendations</p>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs">
                    <div className="flex items-center justify-between text-rose-300 font-bold mb-1">
                      <span>⚠️ Alert: Top-selling product has only 1 day of stock cover</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20">URGENT</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Arabica Coffee Beans at Aurangabad (8kg left vs 20kg reorder threshold).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-slate-300">
                    <span className="font-bold text-cyan-300">Decision:</span> Reorder from BeanMaster Supplies or dispatch 15kg from Pune FC Road surplus.
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onNavigateTab?.("inventory")}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer transition-colors shadow-md"
                  style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
                >
                  Open Full Inventory Agent &rarr;
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. WORKFORCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "staff" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Attendance</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Above Standard</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">86%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>37 Present · 3 Late · 2 On Leave</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Productivity Score</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Target: 75%</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">78%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>48 orders prepared per barista / hour</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Absenteeism</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Controlled</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">4.2%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Primarily unnotified absences in Aurangabad</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Turnover Rate</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Annualized</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">12%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Industry average is 18%; strong barista retention</p>
            </div>
          </div>

          {/* Visuals: Staffing vs Demand & Understaffed Outlets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border p-5 shadow-md" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold" style={{ color: t.text }}>Staffing Level vs Customer Peak Demand</h4>
                  <p className="text-xs" style={{ color: t.textFaint }}>Hour-by-hour required vs actual staff coverage</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PEAK DEFICIT: 13:00 & 19:00
                </span>
              </div>

              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={staffingDemandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                  <YAxis tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                  <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                  <Bar dataKey="requiredStaff" name="Required Staff" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actualStaff" name="Actual on Duty" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Decision & RBAC Box */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Roster Intelligence</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Automated schedule recommendations</p>

                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs mb-3">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                    <Sparkles size={13} /> Decision Example:
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    "Weekend demand is high but staffing is low — adjust the roster with part-time barista shifts."
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border text-[11px] space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                  <div className="font-semibold text-sky-400">🛡️ Role-Based Access Enforced:</div>
                  <p className="text-slate-400">Employee salaries, timesheets, and disciplinary notes restricted to HR & Regional Manager roles.</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab?.("staff")}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer transition-colors shadow-md"
                style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
              >
                Manage Staffing & Roster &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. MARKETING DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "marketing" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Campaign Revenue</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">₹12.0L</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Generated across 6 active promotional campaigns</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>ROAS</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Top Tier</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">4.1×</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>₹4.10 revenue earned per ₹1.00 ad spend</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Conversion Rate</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Above Avg</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">8.6%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Digital ad clicks converting to POS transactions</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>CAC (Acquisition Cost)</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Efficient</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">₹240</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Lifetime customer value estimates at ₹3,800</p>
            </div>
          </div>

          {/* Visuals: Marketing Funnel & Channel ROAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border p-5 shadow-md" style={{ background: t.card, borderColor: t.border }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Customer Acquisition Funnel</h4>
              <p className="text-xs mb-4" style={{ color: t.textFaint }}>Reach &rarr; Impressions &rarr; Leads &rarr; Conversions</p>

              <div className="space-y-3">
                {marketingFunnelData.map((stage, i) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span style={{ color: t.text }}>{stage.stage} ({stage.drop})</span>
                      <span className="font-bold font-mono" style={{ color: stage.fill }}>{stage.count}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${100 - i * 22}%`,
                          background: stage.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Optimization Advisor */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Campaign Advisor</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Outcome-driven budget allocations</p>

                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs mb-3">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                    <Sparkles size={13} /> Decision Example:
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    "Campaign B has lower reach but much higher conversion — shift budget toward it."
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border text-[11px] space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                  <div className="font-semibold text-emerald-400">💡 Strategic Rule:</div>
                  <p className="text-slate-400">Always compare campaign performance against cost and business outcomes, not vanity reach alone.</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab?.("marketing")}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer transition-colors shadow-md"
                style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
              >
                View Campaign Center &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUDIT DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Compliance Rate</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Network Passed</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">94.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>15 of 16 Outlets meeting HACCP standards</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Open Issues</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Action Required</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">7</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>2 Critical fire/safety · 5 Medium checklists</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Checklist Score</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Excellent</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">96.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Opening, closing, and hygiene checklists logged</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Avg. Closure Time</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Rapid Fix</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">2.1 days</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Target resolution threshold is &lt;3.0 days</p>
            </div>
          </div>

          {/* Visuals: Compliance Heatmap Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border p-5 shadow-md" style={{ background: t.card, borderColor: t.border }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Outlet Compliance & SOP Heatmap</h4>
              <p className="text-xs mb-4" style={{ color: t.textFaint }}>Category pass rates across Hygiene, Safety, Cash & Branding</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b" style={{ borderColor: t.border, color: t.textFaint }}>
                      <th className="py-2">Outlet</th>
                      <th className="py-2">Hygiene</th>
                      <th className="py-2">Safety</th>
                      <th className="py-2">Cash</th>
                      <th className="py-2">Branding</th>
                      <th className="py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: t.border }}>
                    {complianceMatrix.map((row) => (
                      <tr key={row.outlet} style={{ color: t.text }}>
                        <td className="py-2.5 font-semibold">{row.outlet}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.hygiene >= 90 ? "bg-emerald-500/20 text-emerald-300" : row.hygiene >= 75 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.hygiene}%
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.safety >= 90 ? "bg-emerald-500/20 text-emerald-300" : row.safety >= 75 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.safety}%
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.cash >= 90 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                            {row.cash}%
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.branding >= 90 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                            {row.branding}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-amber-400">{row.overall}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Decision & Tamper Proof Box */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Audit Advisor</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Immediate corrective triggers</p>

                <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs mb-3">
                  <div className="font-bold text-rose-300 mb-1 flex items-center gap-1">
                    <Sparkles size={13} /> Decision Example:
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    "Outlet C repeatedly fails hygiene checks — assign corrective action and follow-up audit within 7 days."
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border text-[11px] space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                  <div className="font-semibold text-emerald-400">🔒 Cryptographic Audit Chain:</div>
                  <p className="text-slate-400">All audit checklists cryptographically signed with SHA-256 tamper-evident verification.</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab?.("audit")}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer transition-colors shadow-md"
                style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
              >
                Open Audit Center &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 6. EXECUTIVE FRANCHISE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "intelligence" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Network Sales</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Total Scale</span>
              </div>
              <div className="text-3xl font-black tracking-tight" style={{ color: t.text }}>₹4.8Cr</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Consolidated gross network sales across all regions</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Growth</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">YoY Baseline</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">+11%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Strong expansion pace across Tier-1 & Tier-2 hubs</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Target Achievement</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">High Alignment</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">91%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Franchise benchmark goal: ₹5.2Cr annual run rate</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>At-Risk Outlets</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Exceptions</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">8</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Require operational intervention or stock rebalancing</p>
            </div>
          </div>

          {/* Visuals: 5-Pillar Health Score & Executive Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Executive Radar Chart */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Executive Multi-Dimension Radar</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Operational performance vs ideal benchmark</p>
              </div>

              <div className="w-full h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={executiveRadarData}>
                    <PolarGrid stroke={t.gridLine} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: t.textFaint }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={t.gridLine} />
                    <Radar name="Current Score" dataKey="score" stroke={accent} fill={accent} fillOpacity={0.35} />
                    <Radar name="Target Goal" dataKey="target" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.1} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic Executive Inquiries */}
            <div className="rounded-2xl border p-5 shadow-md flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
              <div>
                <h4 className="text-sm font-bold mb-1" style={{ color: t.text }}>Executive Synthesis</h4>
                <p className="text-xs mb-3" style={{ color: t.textFaint }}>Headline KPIs + Trends + Exceptions + Actions</p>

                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-xs space-y-2.5 mb-3 shadow-inner">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles size={15} /> Example Executive Strategic Question:
                  </div>
                  <p className="text-slate-100 text-xs leading-relaxed font-semibold">
                    "Sales are growing (+11%), but margin (-9%) and audit compliance are declining — why?"
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>AI Root Cause:</strong> Outlets are driving customer volume via heavy unauthorized discounts and cutting corners on mandatory SOP hygiene procedures to rush beverage preparation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab?.("intelligence")}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer transition-colors shadow-md"
                style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
              >
                Open Full Franchise Intelligence AI &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
