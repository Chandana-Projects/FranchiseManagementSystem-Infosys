"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ComposedChart, ReferenceLine
} from "recharts";
import {
  Store, Boxes, Users, Megaphone, ShieldCheck, Brain,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowRight,
  Sparkles, RefreshCw, Zap, Clock, Target, Layers, Play, Check, ChevronDown, ChevronUp,
  HelpCircle, Activity, Gauge, Sliders, FileText, Compass, BarChart3, Filter,
  DollarSign, PieChart as PieIcon, Cpu, AlertOctagon, ArrowUpRight, ArrowDownRight,
  Radio, Shuffle, ShieldAlert, CheckCircle, ExternalLink, Download, FileSpreadsheet
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

  // ==========================================
  // DATASETS FOR AGENT DASHBOARDS
  // ==========================================

  // --- 1. OUTLET PERFORMANCE DATA ---
  const outletTargetBars = [
    { outlet: "Pune FC Road", actual: 840000, target: 800000, margin: 34.2, tier: "Tier-1 Hub" },
    { outlet: "Mumbai Bandra", actual: 920000, target: 880000, margin: 31.0, tier: "Flagship" },
    { outlet: "Bangalore Indira", actual: 780000, target: 750000, margin: 36.5, tier: "Tech Park" },
    { outlet: "Delhi Connaught", actual: 710000, target: 720000, margin: 29.4, tier: "High Street" },
    { outlet: "Hyderabad HITEC", actual: 660000, target: 650000, margin: 33.1, tier: "IT Corridor" },
    { outlet: "Chennai Anna Ngr", actual: 590000, target: 600000, margin: 32.0, tier: "Metro Center" },
  ];

  const hourlyRushData = [
    { hour: "08 AM", orders: 24, prepTime: 3.8 },
    { hour: "10 AM", orders: 48, prepTime: 4.5 },
    { hour: "12 PM", orders: 92, prepTime: 7.2 },
    { hour: "01 PM", orders: 138, prepTime: 9.6 },
    { hour: "03 PM", orders: 46, prepTime: 4.9 },
    { hour: "05 PM", orders: 74, prepTime: 6.4 },
    { hour: "07 PM", orders: 146, prepTime: 10.4 },
    { hour: "09 PM", orders: 112, prepTime: 8.1 },
    { hour: "11 PM", orders: 32, prepTime: 4.0 },
  ];

  const outletDetailsTable = [
    { name: "Pune FC Road", region: "West India", revenue: "₹8,40,000", targetPct: "105%", margin: "34.2%", csat: "4.8 / 5.0", staff: 14, status: "Top Performer", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Mumbai Bandra", region: "West India", revenue: "₹9,20,000", targetPct: "104%", margin: "31.0%", csat: "4.7 / 5.0", staff: 18, status: "Top Performer", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Bangalore Indiranagar", region: "South India", revenue: "₹7,80,000", targetPct: "104%", margin: "36.5%", csat: "4.9 / 5.0", staff: 12, status: "Top Performer", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { name: "Delhi Connaught Place", region: "North India", revenue: "₹7,10,000", targetPct: "98%", margin: "29.4%", csat: "4.4 / 5.0", staff: 11, status: "On Track", badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { name: "Hyderabad HITEC City", region: "South India", revenue: "₹6,60,000", targetPct: "101%", margin: "33.1%", csat: "4.6 / 5.0", staff: 10, status: "On Track", badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { name: "Aurangabad CIDCO", region: "West India", revenue: "₹3,40,000", targetPct: "78%", margin: "21.5%", csat: "3.9 / 5.0", staff: 6, status: "Needs Attention", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  ];

  // --- 2. INVENTORY INTELLIGENCE DATA ---
  const stockValuationShare = [
    { name: "Raw Coffee & Tea", value: 38, valuation: "₹5.08L", color: "#0D9488" },
    { name: "Dairy & Cheese", value: 24, valuation: "₹3.21L", color: "#3B82F6" },
    { name: "Bakery & Dough", value: 18, valuation: "₹2.41L", color: "#F59E0B" },
    { name: "Syrups & Flavors", value: 12, valuation: "₹1.60L", color: "#8B5CF6" },
    { name: "Packaging & Cups", value: 8, valuation: "₹1.07L", color: "#EC4899" },
  ];

  const stockDepletionCurve = [
    { day: "Mon", stockLevel: 100, safetyBuffer: 30 },
    { day: "Tue", stockLevel: 88, safetyBuffer: 30 },
    { day: "Wed", stockLevel: 74, safetyBuffer: 30 },
    { day: "Thu", stockLevel: 61, safetyBuffer: 30 },
    { day: "Fri", stockLevel: 42, safetyBuffer: 30 },
    { day: "Sat (JIT Spike)", stockLevel: 96, safetyBuffer: 30 },
    { day: "Sun", stockLevel: 81, safetyBuffer: 30 },
  ];

  const inventorySKUTable = [
    { sku: "Arabica Roast Beans", category: "Raw Coffee", onHand: "48 kg", reorderLevel: "30 kg", burnRate: "6.2 kg/day", cover: "7.7 Days", supplier: "BeanMaster Co.", status: "Sufficient", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { sku: "Mozzarella Cheese Blocks", category: "Dairy", onHand: "18 kg", reorderLevel: "25 kg", burnRate: "4.1 kg/day", cover: "4.3 Days", supplier: "DairyGold Agro", status: "Reorder Due", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    { sku: "Artisan Burger Buns", category: "Bakery", onHand: "420 pcs", reorderLevel: "300 pcs", burnRate: "65 pcs/day", cover: "6.4 Days", supplier: "FreshBake India", status: "Sufficient", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { sku: "Whole Milk Pouches", category: "Dairy", onHand: "22 L", reorderLevel: "50 L", burnRate: "18 L/day", cover: "1.2 Days", supplier: "Amul Fresh Direct", status: "Critical Buffer", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    { sku: "Eco Hot Cups (500ml)", category: "Packaging", onHand: "850 pcs", reorderLevel: "400 pcs", burnRate: "80 pcs/day", cover: "10.6 Days", supplier: "GreenPack Ltd.", status: "Sufficient", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { sku: "Caramel Drizzle Syrup", category: "Syrups", onHand: "12 btls", reorderLevel: "10 btls", burnRate: "1.2 btls/day", cover: "10.0 Days", supplier: "Monin Supply", status: "Sufficient", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  ];

  // --- 3. WORKFORCE & ROSTER DATA ---
  const workforceShiftBars = [
    { outlet: "Pune FC Road", scheduled: 160, actual: 156, overtime: 14 },
    { outlet: "Mumbai Bandra", scheduled: 190, actual: 184, overtime: 26 },
    { outlet: "Bangalore Indira", scheduled: 150, actual: 148, overtime: 12 },
    { outlet: "Delhi Connaught", scheduled: 140, actual: 136, overtime: 8 },
    { outlet: "Hyderabad HITEC", scheduled: 130, actual: 128, overtime: 10 },
    { outlet: "Aurangabad CIDCO", scheduled: 110, actual: 92, overtime: 4 }, // understaffed
  ];

  const serviceSpeedCsatTrend = [
    { week: "Week 1", prepTime: 8.2, csat: 4.2 },
    { week: "Week 2", prepTime: 7.6, csat: 4.4 },
    { week: "Week 3", prepTime: 7.1, csat: 4.5 },
    { week: "Week 4", prepTime: 6.4, csat: 4.7 },
    { week: "Week 5", prepTime: 5.9, csat: 4.8 },
    { week: "Week 6", prepTime: 5.5, csat: 4.9 },
  ];

  const staffRosterDetailsTable = [
    { store: "Pune FC Road", supervisor: "Aditya Sharma", scheduledShifts: 28, activeHeadcount: 14, coveragePct: "98%", overtime: "14 hrs", attendance: "97.2%", status: "Full Coverage", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { store: "Mumbai Bandra", supervisor: "Priya Nair", scheduledShifts: 36, activeHeadcount: 18, coveragePct: "96%", overtime: "26 hrs", attendance: "95.5%", status: "Full Coverage", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { store: "Bangalore Indiranagar", supervisor: "Karthik Rao", scheduledShifts: 24, activeHeadcount: 12, coveragePct: "98%", overtime: "12 hrs", attendance: "98.0%", status: "Full Coverage", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { store: "Delhi Connaught Place", supervisor: "Rohan Verma", scheduledShifts: 22, activeHeadcount: 11, coveragePct: "95%", overtime: "8 hrs", attendance: "94.0%", status: "Balanced", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { store: "Hyderabad HITEC City", supervisor: "Sneha Reddy", scheduledShifts: 20, activeHeadcount: 10, coveragePct: "97%", overtime: "10 hrs", attendance: "96.5%", status: "Balanced", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { store: "Aurangabad CIDCO", supervisor: "Vikram Patil", scheduledShifts: 18, activeHeadcount: 6, coveragePct: "72%", overtime: "4 hrs", attendance: "81.0%", status: "Understaffed", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  ];

  // --- 4. MARKETING ENGINE DATA ---
  const campaignRoiBars = [
    { name: "Summer Refresher", spend: 45000, revenue: 189000, roas: 4.2 },
    { name: "Monsoon Hot Brew", spend: 32000, revenue: 124000, roas: 3.9 },
    { name: "Midnight Combos", spend: 28000, revenue: 132000, roas: 4.7 },
    { name: "Loyalty App Boost", spend: 22000, revenue: 118000, roas: 5.4 },
    { name: "Student Meal Deal", spend: 19000, revenue: 84000, roas: 4.4 },
  ];

  const cacLtvTimeline = [
    { month: "Jan", cac: 195, ltv: 1420 },
    { month: "Feb", cac: 182, ltv: 1510 },
    { month: "Mar", cac: 174, ltv: 1620 },
    { month: "Apr", cac: 162, ltv: 1740 },
    { month: "May", cac: 150, ltv: 1880 },
    { month: "Jun", cac: 138, ltv: 2040 },
  ];

  const marketingCampaignsTable = [
    { campaign: "Summer Refresher Fest", channel: "Instagram & Meta Ads", spend: "₹45,000", revenue: "₹1,89,000", orders: 1240, roas: "4.2×", cac: "₹142", status: "Scaling Active", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { campaign: "Midnight Snack Combos", channel: "Swiggy & Zomato Banner", spend: "₹28,000", revenue: "₹1,32,000", orders: 940, roas: "4.7×", cac: "₹118", status: "High ROI", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { campaign: "Franchise Loyalty Signup", channel: "WhatsApp & SMS Direct", spend: "₹22,000", revenue: "₹1,18,000", orders: 860, roas: "5.4×", cac: "₹95", status: "High ROI", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { campaign: "Monsoon Brew Discount", channel: "Google Search & Maps", spend: "₹32,000", revenue: "₹1,24,000", orders: 780, roas: "3.9×", cac: "₹164", status: "On Target", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { campaign: "Student Meal Combo", channel: "Campus Influencers", spend: "₹19,000", revenue: "₹84,000", orders: 620, roas: "4.4×", cac: "₹128", status: "On Target", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
  ];

  // --- 5. AUDIT & COMPLIANCE DATA ---
  const auditCategoryScores = [
    { category: "Food Temp & Cold Chain", score: 98, target: 95 },
    { category: "Opening/Closing SOPs", score: 94, target: 90 },
    { category: "Staff Grooming & Attire", score: 88, target: 90 },
    { category: "Cash & POS Reconciliation", score: 95, target: 95 },
    { category: "Kitchen Disinfection", score: 96, target: 90 },
    { category: "Waste Segregation", score: 91, target: 85 },
  ];

  const auditRadarVector = [
    { metric: "HACCP Safety", score: 98, target: 95 },
    { metric: "Cold Chain", score: 96, target: 95 },
    { metric: "Hygiene Standard", score: 92, target: 90 },
    { metric: "Cash Audit", score: 95, target: 95 },
    { metric: "SOP Execution", score: 94, target: 90 },
    { metric: "Pest Control", score: 99, target: 95 },
  ];

  const auditInspectionDetailsTable = [
    { auditId: "AUD-842", store: "Pune FC Road", inspector: "Vision-AI v4.2 + Rajesh M.", date: "2026-08-30", category: "Comprehensive HACCP", score: "98 / 100", criticalFlags: 0, status: "Grade AAA Certified", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { auditId: "AUD-839", store: "Mumbai Bandra", inspector: "Deepak Shinde (Area Lead)", date: "2026-08-28", category: "Cash & Inventory POS", score: "94 / 100", criticalFlags: 0, status: "Certified", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { auditId: "AUD-835", store: "Bangalore Indiranagar", inspector: "Vision-AI v4.2 + Meera S.", date: "2026-08-26", category: "Food Safety & Hygiene", score: "96 / 100", criticalFlags: 0, status: "Grade AAA Certified", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { auditId: "AUD-828", store: "Delhi Connaught Place", inspector: "Anil Kapoor (Auditor)", date: "2026-08-22", category: "SOP & Attire Check", score: "88 / 100", criticalFlags: 1, status: "Certified (Minor Flag)", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { auditId: "AUD-814", store: "Aurangabad CIDCO", inspector: "Vision-AI v4.2 Diagnostic", date: "2026-08-18", category: "Opening SOP & Temp", score: "68 / 100", criticalFlags: 3, status: "Corrective Notice", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  ];

  // --- 6. EXECUTIVE OVERVIEW DATA ---
  const executiveFinancialRunway = [
    { month: "Jan", revenue: 420000, profit: 142000, target: 400000 },
    { month: "Feb", revenue: 460000, profit: 161000, target: 420000 },
    { month: "Mar", revenue: 510000, profit: 182000, target: 450000 },
    { month: "Apr", revenue: 490000, profit: 168000, target: 470000 },
    { month: "May", revenue: 580000, profit: 215000, target: 500000 },
    { month: "Jun", revenue: 640000, profit: 243000, target: 530000 },
    { month: "Jul", revenue: 690000, profit: 265000, target: 560000 },
    { month: "Aug", revenue: 730000, profit: 284000, target: 600000 },
    { month: "Sep", revenue: 790000, profit: 312000, target: 630000 },
    { month: "Oct", revenue: 840000, profit: 335000, target: 670000 },
    { month: "Nov", revenue: 910000, profit: 372000, target: 720000 },
    { month: "Dec", revenue: 980000, profit: 410000, target: 780000 },
  ];

  const executiveRiskProbabilities = [
    { risk: "Aurangabad Staff Attrition", probability: 74, impact: "High", color: "#F43F5E" },
    { risk: "Cheese Stockout Risk (Mumbai)", probability: 68, impact: "High", color: "#FB923C" },
    { risk: "POS Void Discrepancy (Delhi)", probability: 52, impact: "Medium", color: "#FBBF24" },
    { risk: "Monsoon Rain Delivery Lags", probability: 44, impact: "Low", color: "#3B82F6" },
    { risk: "Dairy Wholesale Price Surge", probability: 36, impact: "Low", color: "#10B981" },
  ];

  const executiveTerritoryDetailsTable = [
    { territory: "Maharashtra Region (West)", stores: 8, gmv: "₹24,80,000", targetAchieved: "103.4%", profitMargin: "32.8%", qualityIndex: "97.4%", riskLevel: "Low", rec: "Maintain supply chain JIT frequency", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { territory: "Karnataka & South Hub", stores: 4, gmv: "₹14,40,000", targetAchieved: "102.1%", profitMargin: "34.5%", qualityIndex: "98.0%", riskLevel: "Low", rec: "Scale marketing spend by +15%", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { territory: "Delhi NCR (North Corridor)", stores: 3, gmv: "₹9,80,000", targetAchieved: "97.6%", profitMargin: "29.2%", qualityIndex: "92.5%", riskLevel: "Moderate", rec: "Standardize shift roster & reduce POS voids", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    { territory: "Marathwada Tier-2 Cluster", stores: 1, gmv: "₹3,40,000", targetAchieved: "78.0%", profitMargin: "21.5%", qualityIndex: "68.0%", riskLevel: "High Priority", rec: "Deploy supervisor intervention & reorder beans", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
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

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* What-If Simulator Toggle Button */}
          <button
            onClick={() => {
              try { playTechChime(); } catch (e) {}
              setSandboxOpen(!sandboxOpen);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            style={{
              background: sandboxOpen ? accent : `${accent}1A`,
              borderColor: accent,
              color: sandboxOpen ? t.textOnAccent || "#FFFFFF" : accent,
            }}
          >
            <Sliders size={14} />
            <span>{sandboxOpen ? "Close AI Simulator" : "Open What-If Simulator"}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20">v2.4</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Marquee Bar */}
      <div className="rounded-xl border p-2.5 px-4 overflow-hidden flex items-center gap-3 text-xs" style={{ background: t.card, borderColor: t.border, color: t.textMuted }}>
        <div className="flex items-center gap-1.5 font-bold shrink-0 text-emerald-400 font-mono">
          <Radio size={14} className="animate-pulse text-emerald-400" />
          <span>LIVE STREAM:</span>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-xs">
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
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Monthly Sales</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">+14.2% MoM</span>
              </div>
              <div className="text-3xl font-black tracking-tight" style={{ color: t.text }}>₹8.4L</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Avg ₹1.05L per branch · 16 Active Outlets</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Gross Margin</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Target: 22%</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">18.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Net Contribution: ₹1.51L after COGS</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Customer Rating</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">1.2K Reviews</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">4.6 / 5.0</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>94% positive sentiment on beverage quality</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Target Achievement</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Near Goal</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">92%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>14 of 16 outlets at or above monthly benchmark</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR OUTLET PERFORMANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Outlet Target vs Actual Sales & Margin Bar Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <BarChart3 size={16} className="text-teal-400" />
                  Outlet GMV vs Target Benchmark (Grouped Bar Chart)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  6 Core Hubs
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Revenue attainment compared against target monthly quota with operating margin indicators.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outletTargetBars} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="outlet" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }}
                      formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="actual" name="Actual GMV" fill="#0D9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target GMV" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Hourly Order Volume vs Kitchen Prep Time (Dual-Axis) */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <Clock size={16} className="text-amber-400" />
                  Hourly Order Volume vs Ticket Turnaround (Dual-Axis)
                </h4>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Peak: 1 PM & 7 PM
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Correlating customer surge hours with kitchen preparation duration in minutes.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={hourlyRushData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="hour" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis yAxisId="left" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}m`} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="orders" name="Order Volume" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={16} />
                    <Line yAxisId="right" type="monotone" dataKey="prepTime" name="Prep Time (Mins)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: Comprehensive Outlet Operations Matrix */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>Outlet Operations & Performance Details Table</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Live POS Feed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">Outlet Name</th>
                    <th className="p-3">Region / Cluster</th>
                    <th className="p-3">MTD Revenue</th>
                    <th className="p-3">Target %</th>
                    <th className="p-3">Gross Margin</th>
                    <th className="p-3">CSAT Rating</th>
                    <th className="p-3">Staff Headcount</th>
                    <th className="p-3 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {outletDetailsTable.map((row) => (
                    <tr key={row.name} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-semibold">{row.name}</td>
                      <td className="p-3 text-slate-400">{row.region}</td>
                      <td className="p-3 font-mono font-bold text-teal-400">{row.revenue}</td>
                      <td className="p-3 font-mono font-semibold">{row.targetPct}</td>
                      <td className="p-3 font-mono text-emerald-400">{row.margin}</td>
                      <td className="p-3 font-semibold text-amber-400">{row.csat}</td>
                      <td className="p-3 text-slate-300">{row.staff} staff</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badgeColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. INVENTORY INTELLIGENCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "inventory" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Units On Hand</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">11 SKUs</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">1,240</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Total active batch volume across 8 hubs</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Stock Cover</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Healthy Zone</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">7.2 days</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Automated JIT replenishment scheduled in 48h</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Stockout Rate</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Low Risk</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">3.8%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>2 items below safety threshold in Aurangabad</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Wastage Rate</span>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">Within Target</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-orange-400">6.1%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Primarily dairy and perishables FIFO rotated</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR INVENTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Stock Valuation Share Donut */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <Boxes size={16} className="text-teal-400" />
                  Stock Valuation by Category (Donut Chart)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Total: ₹13.37L
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Proportional capital invested across raw coffee, dairy, buns, syrups, and packaging.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockValuationShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {stockValuationShare.map((entry, index) => (
                          <Cell key={`inv-donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {stockValuationShare.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                        <span className="truncate font-medium text-[11px]" style={{ color: t.text }}>{cat.name}</span>
                      </div>
                      <span className="font-bold text-white font-mono text-[11px]">{cat.valuation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Graph 2: 7-Day Stock Depletion & Consumption Burn-Down Curve */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <TrendingDown size={16} className="text-blue-400" />
                  7-Day Stock Depletion Burn-Down Curve (Area Chart)
                </h4>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  Automated JIT Reorder
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Tracking weekly stock consumption against the 30% safety buffer threshold.
              </p>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockDepletionCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="day" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="stockLevel" name="Current Stock Level %" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                    <Area type="step" dataKey="safetyBuffer" name="Safety Threshold" stroke="#EF4444" strokeDasharray="4 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: SKU Stock Levels & JIT Replenishment Schedule */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>SKU Inventory Health & JIT Dispatch Matrix</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                11 Active SKUs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">SKU Item Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">On Hand</th>
                    <th className="p-3">Reorder Trigger</th>
                    <th className="p-3">Daily Burn Rate</th>
                    <th className="p-3">Stock Cover</th>
                    <th className="p-3">Supplier Partner</th>
                    <th className="p-3 text-right">Replenishment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {inventorySKUTable.map((row) => (
                    <tr key={row.sku} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-semibold">{row.sku}</td>
                      <td className="p-3 text-slate-400">{row.category}</td>
                      <td className="p-3 font-mono font-bold text-white">{row.onHand}</td>
                      <td className="p-3 font-mono text-amber-400">{row.reorderLevel}</td>
                      <td className="p-3 font-mono text-slate-300">{row.burnRate}</td>
                      <td className="p-3 font-mono font-semibold text-teal-400">{row.cover}</td>
                      <td className="p-3 text-slate-400">{row.supplier}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. WORKFORCE & ROSTER DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "staff" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Attendance</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Above Standard</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">86%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>37 Present · 3 Late · 2 On Leave</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Productivity Score</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Target: 75%</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">78%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>48 orders prepared per barista / hour</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Absenteeism</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Controlled</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">4.2%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Primarily unnotified absences in Aurangabad</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Turnover Rate</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Annualized</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">12%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Industry average is 18%; strong barista retention</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR WORKFORCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Shift Hours vs Actual vs Overtime Grouped Bars */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <Clock size={16} className="text-teal-400" />
                  Scheduled vs Actual vs Overtime Hours (Bar Chart)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Weekly Roster
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Shift coverage adherence and overtime stress index across franchise stores.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workforceShiftBars} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="outlet" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="overtime" name="Overtime" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Speed of Service vs Customer CSAT Rating Line Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <TrendingUp size={16} className="text-emerald-400" />
                  Speed of Service vs Customer CSAT Rating (Line Chart)
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  6-Week Trajectory
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Direct impact of reduced barista turnaround time (mins) on store satisfaction scores.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={serviceSpeedCsatTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="week" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis yAxisId="prep" stroke="#F59E0B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}m`} />
                    <YAxis yAxisId="csat" orientation="right" stroke="#10B981" domain={[3.5, 5.0]} fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="prep" type="monotone" dataKey="prepTime" name="Prep Speed (Mins)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line yAxisId="csat" type="monotone" dataKey="csat" name="CSAT (out of 5)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: Store Workforce Roster & Productivity Matrix */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>Store Workforce Roster & Productivity Details Table</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Shift Roster Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">Store Location</th>
                    <th className="p-3">Shift Supervisor</th>
                    <th className="p-3">Scheduled Shifts</th>
                    <th className="p-3">Active Headcount</th>
                    <th className="p-3">Coverage %</th>
                    <th className="p-3">Overtime Hours</th>
                    <th className="p-3">Attendance %</th>
                    <th className="p-3 text-right">Roster Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {staffRosterDetailsTable.map((row) => (
                    <tr key={row.store} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-semibold">{row.store}</td>
                      <td className="p-3 text-slate-300">{row.supervisor}</td>
                      <td className="p-3 font-mono text-slate-400">{row.scheduledShifts} shifts</td>
                      <td className="p-3 font-mono font-bold text-white">{row.activeHeadcount} staff</td>
                      <td className="p-3 font-mono font-semibold text-teal-400">{row.coveragePct}</td>
                      <td className="p-3 font-mono text-amber-400">{row.overtime}</td>
                      <td className="p-3 font-mono text-emerald-400">{row.attendance}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. MARKETING ENGINE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "marketing" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Campaign Revenue</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">₹12.0L</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Generated across 6 active promotional campaigns</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>ROAS</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Top Tier</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">4.1×</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>₹4.10 revenue earned per ₹1.00 ad spend</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Conversion Rate</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Above Avg</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-amber-400">8.6%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Digital ad clicks converting to POS transactions</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>CAC (Acquisition Cost)</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Efficient</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">₹240</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Lifetime customer value estimates at ₹3,800</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR MARKETING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Campaign Spend vs Generated Revenue Bar Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <Megaphone size={16} className="text-teal-400" />
                  Campaign Spend vs Generated Revenue (Bar Chart)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Avg ROI: 4.4x
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Direct revenue generated across top promotional seasonal campaigns.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignRoiBars} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="name" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }}
                      formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="spend" name="Ad Spend" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" name="Sales Generated" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Customer Acquisition Cost (CAC) vs Lifetime Value (Area) */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <TrendingUp size={16} className="text-blue-400" />
                  CAC vs Customer Lifetime Value (LTV) Timeline (Area)
                </h4>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  LTV:CAC Ratio 14.8x
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Unit economics improvement showing falling acquisition costs and growing repeat diner value.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cacLtvTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="month" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="ltv" name="Customer LTV" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="cac" name="Acquisition CAC" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: Marketing Campaign Attribution & ROAS Matrix */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>Marketing Campaign Attribution & Performance Table</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                5 Active Campaigns
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">Campaign Name</th>
                    <th className="p-3">Primary Channel</th>
                    <th className="p-3">Ad Spend</th>
                    <th className="p-3">Generated Revenue</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">ROAS</th>
                    <th className="p-3">Blended CAC</th>
                    <th className="p-3 text-right">Campaign Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {marketingCampaignsTable.map((row) => (
                    <tr key={row.campaign} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-semibold">{row.campaign}</td>
                      <td className="p-3 text-slate-400">{row.channel}</td>
                      <td className="p-3 font-mono text-rose-400 font-semibold">{row.spend}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{row.revenue}</td>
                      <td className="p-3 font-mono text-slate-200">{row.orders} orders</td>
                      <td className="p-3 font-mono font-bold text-teal-400">{row.roas}</td>
                      <td className="p-3 font-mono text-amber-400">{row.cac}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUDIT & COMPLIANCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Compliance Rate</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Network Passed</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">94.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>15 of 16 Outlets meeting HACCP standards</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Open Issues</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Action Required</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">7</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>2 Critical fire/safety · 5 Medium checklists</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Checklist Score</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">Excellent</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">96.0%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Opening, closing, and hygiene checklists logged</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Avg. Closure Time</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Rapid Fix</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">2.1 days</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Target resolution threshold is &lt;3.0 days</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR AUDIT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Category Compliance Score Bar Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <ShieldCheck size={16} className="text-teal-400" />
                  Category Compliance Attainment (Bar Chart)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Target &gt; 90%
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Scores achieved across cold storage temperature, cash reconciliation, and sanitization SOPs.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={auditCategoryScores} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="category" stroke={t.textFaint} fontSize={9} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} domain={[50, 100]} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="score" name="Attained Score" fill="#0D9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target Benchmark" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: 360° Safety & Compliance Radar Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <Target size={16} className="text-purple-400" />
                  360° Safety & Hygiene Compliance Radar
                </h4>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  6 Vector Audit
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Network adherence benchmarks across cold chain, HACCP sanitation, pest control, and SOP checklists.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={auditRadarVector}>
                    <PolarGrid stroke={t.gridLine} />
                    <PolarAngleAxis dataKey="metric" stroke={t.textFaint} fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={t.textFaint} fontSize={9} />
                    <Radar name="Attained Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} />
                    <Radar name="Standard SLA" dataKey="target" stroke="#0D9488" strokeDasharray="3 3" fill="none" />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: Detailed Audit Inspection Log & Verification Table */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>Audit Inspection Log & Verification Matrix</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Cryptographically Signed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">Audit ID</th>
                    <th className="p-3">Store Location</th>
                    <th className="p-3">Inspector / Vision Engine</th>
                    <th className="p-3">Inspection Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Critical Flags</th>
                    <th className="p-3 text-right">Certification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {auditInspectionDetailsTable.map((row) => (
                    <tr key={row.auditId} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-mono font-bold text-slate-400">{row.auditId}</td>
                      <td className="p-3 font-semibold">{row.store}</td>
                      <td className="p-3 text-slate-300">{row.inspector}</td>
                      <td className="p-3 font-mono text-slate-400">{row.date}</td>
                      <td className="p-3 text-teal-400 font-medium">{row.category}</td>
                      <td className="p-3 font-mono font-bold text-white">{row.score}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{row.criticalFlags} flags</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 6. EXECUTIVE OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "intelligence" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 4 Headline Deck KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Network Sales</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Total Scale</span>
              </div>
              <div className="text-3xl font-black tracking-tight" style={{ color: t.text }}>₹4.8Cr</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Consolidated gross network sales across all regions</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Growth</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">YoY Baseline</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400">+11%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Strong expansion pace across Tier-1 & Tier-2 hubs</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>Target Achievement</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">High Alignment</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-sky-400">91%</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Franchise benchmark goal: ₹5.2Cr annual run rate</p>
            </div>

            <div className="rounded-2xl border p-4 shadow-lg glass-card backdrop-blur-xl" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: t.textFaint }}>At-Risk Outlets</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">Exceptions</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-rose-400">8</div>
              <p className="text-[11px] mt-1" style={{ color: t.textMuted }}>Require operational intervention or stock rebalancing</p>
            </div>
          </div>

          {/* 2 NEW ADVANCED GRAPHS FOR EXECUTIVE OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: 12-Month Financial Performance & Target Composed Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <TrendingUp size={16} className="text-teal-400" />
                  12-Month Consolidated Financial Runway (Composed)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Annual Target
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Multi-month revenue trajectory with net operating profit bars and sales targets.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={executiveFinancialRunway} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis dataKey="month" stroke={t.textFaint} fontSize={10} tickLine={false} />
                    <YAxis stroke={t.textFaint} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }}
                      formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="revenue" name="Gross Revenue" fill="#0D9488" stroke="#0D9488" fillOpacity={0.25} />
                    <Bar dataKey="profit" name="Net Profit" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
                    <Line type="monotone" dataKey="target" name="Target Quota" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Predictive Risk & Anomaly Likelihood Bar Chart */}
            <div className="rounded-2xl border p-5 shadow-lg" style={{ background: t.card, borderColor: t.border }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                  <AlertTriangle size={16} className="text-rose-400" />
                  Predictive Anomaly & Risk Likelihood (Bar Chart)
                </h4>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  ML Sentinel
                </span>
              </div>
              <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                Calculated statistical probability of stockouts, staff attrition, and POS variances.
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={executiveRiskProbabilities} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} opacity={0.5} />
                    <XAxis type="number" stroke={t.textFaint} fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="risk" stroke={t.textFaint} fontSize={9} width={130} tickLine={false} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    <Bar dataKey="probability" name="Risk Likelihood %" fill="#F43F5E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DETAILS TABLE: Strategic Regional Territory Scorecard */}
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ background: t.card, borderColor: t.border }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} color={accent} />
                <h4 className="text-sm font-bold" style={{ color: t.text }}>Strategic Regional Franchise Scorecard Table</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                16 Total Outlets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead style={{ background: t.panel, color: t.textMuted }}>
                  <tr>
                    <th className="p-3">Regional Territory</th>
                    <th className="p-3">Stores</th>
                    <th className="p-3">Total GMV</th>
                    <th className="p-3">Target %</th>
                    <th className="p-3">Profit Margin</th>
                    <th className="p-3">Quality Index</th>
                    <th className="p-3">Executive Recommendation</th>
                    <th className="p-3 text-right">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: t.border }}>
                  {executiveTerritoryDetailsTable.map((row) => (
                    <tr key={row.territory} className="hover:bg-teal-500/5 transition-colors" style={{ color: t.text }}>
                      <td className="p-3 font-semibold">{row.territory}</td>
                      <td className="p-3 font-mono text-slate-300">{row.stores} outlets</td>
                      <td className="p-3 font-mono font-bold text-teal-400">{row.gmv}</td>
                      <td className="p-3 font-mono font-semibold text-emerald-400">{row.targetAchieved}</td>
                      <td className="p-3 font-mono text-emerald-400">{row.profitMargin}</td>
                      <td className="p-3 font-mono text-amber-400 font-semibold">{row.qualityIndex}</td>
                      <td className="p-3 text-slate-300 max-w-xs">{row.rec}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.badge}`}>
                          {row.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
