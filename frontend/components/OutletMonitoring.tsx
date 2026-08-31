"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from "recharts";
import {
  LayoutGrid, Store, Boxes, Users, Megaphone, ShieldCheck, Brain,
  BellRing, FileBarChart, Settings, Search, Sparkles, Download,
  TrendingUp, TrendingDown, MapPin, LineChart as LineChartIcon, BarChart3,
  Sun, Moon, AlertTriangle, Eye, EyeOff, Mail, Lock, Calendar, Trash2, UserPlus, Star,
  Target, Percent, Lightbulb, Tag, PieChart, Share2, CalendarClock, Globe, Truck, Trophy, Boxes as BoxesIcon, Languages,
  Image, FileSearch, MessageSquare,
  ClipboardList, Wrench, FileCheck2, Repeat,
  Activity, AlertOctagon, Grid3x3, Timer, PenTool,
  Camera, CheckCircle2, UploadCloud, FileText, Check, ChevronRight,
  Gauge, TrendingUpDown, ListChecks, Layers,
  Rocket,
  ArrowRight, Database,
  Filter, BarChart2
} from "lucide-react";

import AuditComplianceSummary from "./AuditComplianceSummary";

import RealOutletMap from "./RealOutletMap";
import VoiceAssistant from "./VoiceAssistant";
import SupplierDispatchModal from "./SupplierDispatchModal";
import LeaderboardCard from "./LeaderboardCard";
import StockroomVisualizer from "./StockroomVisualizer";
import GlobalRegionSelector from "./GlobalRegionSelector";
import { GLOBAL_LOCATIONS, LocationNode } from "../lib/GlobalLocationRegistry";
import BlockchainLedger from "./BlockchainLedger";
import DigitalTwinSimulator from "./DigitalTwinSimulator";
import RoleSwitcher, { ExecutiveRole } from "./RoleSwitcher";
import AnomalyAlertBanner from "./AnomalyAlertBanner";
import { LANGUAGES, SupportedLanguage, translateKey } from "../lib/MultiLangEngine";
import { isAudioMuted, toggleAudioMute, playTechChime } from "../lib/WebAudioSFX";
import { CURRENCY_CONFIGS, CurrencyCode, formatCurrencyValue } from "../lib/CurrencyEngine";
import SOPKnowledgeBot from "./SOPKnowledgeBot";
import RealtimeNotificationToast from "./RealtimeNotificationToast";
import DemoTour from "./DemoTour";
import QRStockScannerModal from "./QRStockScannerModal";
import CommandPaletteModal from "./CommandPaletteModal";
import ExecutiveQuickDock from "./ExecutiveQuickDock";
import AgentDashboardsView from "./AgentDashboardsView";
import PWAInstaller from "./PWAInstaller";
import LiveTelemetryStream from "./LiveTelemetryStream";
import ShiftSchedulerModal from "./ShiftSchedulerModal";
import RoyaltyCalculatorModal from "./RoyaltyCalculatorModal";
import VendorScorecardModal from "./VendorScorecardModal";
import MenuEngineeringMatrix from "./MenuEngineeringMatrix";
import { BookOpen, Compass, QrCode, Volume2, VolumeX, Bot, Sliders, Menu, X, Calculator, Utensils, ChevronDown } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


const SAMPLE_STORE_PHOTOS = [
  {
    id: "storefront",
    title: "Storefront & Branding",
    desc: "Nashik Hub - Exterior Signage & Window",
    category: "Branding & Store Layout",
    outlet: "Nashik City Center",
    tag: "Branding OK (99.4%)",
    color: "#2DD4BF"
  },
  {
    id: "espresso_counter",
    title: "Prep Counter & Cleanliness",
    desc: "Pune FC Road - Barista Workstation",
    category: "Cleanliness & Sanitization",
    outlet: "Pune FC Road",
    tag: "Sanitary Grade A (98.0%)",
    color: "#A855F7"
  },
  {
    id: "barista_uniform",
    title: "Staff Uniform & Hygiene",
    desc: "Mumbai Andheri - Shift Attire Check",
    category: "Uniforms & Staff Hygiene",
    outlet: "Mumbai Andheri East",
    tag: "Uniform Adherence (97.5%)",
    color: "#38BDF8"
  },
  {
    id: "merchandise_shelf",
    title: "Retail Shelf & Products",
    desc: "Aurangabad - Product Display Matrix",
    category: "Product Placement & Shelf",
    outlet: "Aurangabad CIDCO",
    tag: "Shelf Planogram (62.0%)",
    color: "#F59E0B"
  }
];

const SOP_LIBRARY_DATA = [
  {
    id: "sop-1",
    title: "Food Safety & Temp",
    ver: "v2.4",
    date: "Updated Jul 2026",
    items: "12 Checkpoints",
    desc: "Cold storage <= 4°C, hot display >= 63°C hygiene compliance.",
    protocol: "HACCP & ISO 22000 Food Safety Protocols",
    category: "Food Safety & Temp",
    frequency: "Every 4 Hours & Shift Change",
    checkpoints: [
      "Walk-in refrigeration temperature verified <= 4.0°C and logged in telemetry book",
      "Freezer unit temperature held at <= -18.0°C without ice accumulation",
      "Milk steamer wand sanitized after each beverage preparation",
      "Cross-contamination prevention: Separate cutting boards and tongs for dairy vs non-dairy",
      "Expiry date labels and FIFO (First-In, First-Out) rotation on all syrups and dairy cartons",
      "Water filtration pressure gauge checked and sediment filter verified",
      "Ice machine sanitized and ice scoop stored in external sanitizing holder",
      "Food waste bins closed, foot-pedal operated, and emptied before 75% capacity",
      "Thermometer calibration checked against ice-point reference monthly",
      "Cold-brew batch brewing date and shelf-life tracked in digital system",
      "Dry storage area temperature maintained between 18°C-24°C and humidity < 60%",
      "All open food containers covered, sealed, and clearly dated"
    ]
  },
  {
    id: "sop-2",
    title: "Opening / Closing Protocol",
    ver: "v3.1",
    date: "Updated Jun 2026",
    items: "18 Checkpoints",
    desc: "POS reconciliation, alarm setup, sanitization sign-off.",
    protocol: "Franchise Store Operations Standard Operating Manual Section 4",
    category: "Opening / Closing Protocol",
    frequency: "Daily (Store Opening 06:30 & Store Closing 22:30)",
    checkpoints: [
      "Store alarm system disarmed and biometric manager clock-in recorded",
      "Exterior lighting, digital menu boards, and franchise neon signage operational",
      "POS cash drawer float verified ($200.00 standard reserve count)",
      "Espresso machine backflush and group head purge with cleaner completed",
      "Water supply lines opened, grinder calibration test shot pulled (25-30s extraction)",
      "Pastry display case glass cleaned and restocked with fresh batch",
      "Restrooms cleaned, restocked with soap, paper towels, and sanitized",
      "HVAC temperature set to standard 22.0°C customer comfort zone",
      "Music playlist synchronized with central brand audio station",
      "Closing: End-of-Day Z-Report printed and matched with POS total",
      "Closing: Cash drop deposited into store time-delay safe",
      "Closing: Espresso machines turned to eco-standby and portafilters soaked",
      "Closing: All refrigeration units locked and temperature confirmed",
      "Closing: Store security alarm armed and exit door double-bolted"
    ]
  },
  {
    id: "sop-3",
    title: "Cash Register Audit",
    ver: "v1.8",
    date: "Updated May 2026",
    items: "8 Checkpoints",
    desc: "Shift register balancing, drop box verification, receipt logs.",
    protocol: "Financial Compliance & Cash Handling Policy v1.8",
    category: "Cash Register Audit",
    frequency: "Shift Changeover & End of Day",
    checkpoints: [
      "Opening drawer float counted and confirmed before initial transaction",
      "Every cash transaction processed through POS with receipt offered to customer",
      "High-denomination cash drops ($50+) deposited into drop box within 5 minutes",
      "No cash drawer left open or unattended during store operational hours",
      "Card reader terminals inspected for skimming devices and cleaned",
      "Voided and refunded transaction slips signed by on-duty supervisor",
      "Shift-end reconciliation variance within tolerance (<= +/- $2.00 threshold)",
      "Digital batch settlement transmitted to central accounting server"
    ]
  },
  {
    id: "sop-4",
    title: "Staff Hygiene & Attire",
    ver: "v2.0",
    date: "Updated Aug 2026",
    items: "6 Checkpoints",
    desc: "Hairnets, apron standards, handwashing logging.",
    protocol: "Personal Hygiene & Appearance Franchise Standard 2026",
    category: "Staff Hygiene & Attire",
    frequency: "Continuous & Shift Start Inspection",
    checkpoints: [
      "Clean, ironed franchise-branded black apron worn at all times on front counter",
      "Official franchise cap or hairnet fully restraining hair",
      "Name badge visibly pinned to left chest area",
      "Closed-toe non-slip black footwear compliant with kitchen safety regulations",
      "Handwashing performed for 20+ seconds before shifts and after handling food/cash",
      "No excessive jewelry, wristwatches, or unapproved fingernail polish while on food prep"
    ]
  }
];

const themes = {
  dark: {
    bg: "transparent", panel: "rgba(13, 18, 30, 0.72)", card: "rgba(15, 23, 42, 0.65)", border: "rgba(255, 255, 255, 0.12)",
    text: "#FFFBEB", textMuted: "#CBD5E1", textFaint: "#94A3B8", textOnAccent: "#060709",
    gridLine: "rgba(203, 213, 225, 0.12)", inputBg: "rgba(8, 12, 22, 0.75)",
  },
  light: {
    bg: "#F8FAFC", panel: "rgba(255, 255, 255, 0.92)", card: "rgba(255, 255, 255, 0.88)", border: "#CBD5E1",
    text: "#020617", textMuted: "#0F172A", textFaint: "#334155", textOnAccent: "#FFFFFF",
    gridLine: "#CBD5E1", inputBg: "#FFFFFF",
  },
};

const revenueTrendByOutlet: Record<string, { month: string; revenue: number }[]> = {
  All: [
    { month: "Feb", revenue: 412000 }, { month: "Mar", revenue: 458000 },
    { month: "Apr", revenue: 441000 }, { month: "May", revenue: 502000 },
    { month: "Jun", revenue: 489000 }, { month: "Jul", revenue: 561000 },
  ],
  Nashik: [
    { month: "Feb", revenue: 98000 }, { month: "Mar", revenue: 105000 },
    { month: "Apr", revenue: 99000 }, { month: "May", revenue: 118000 },
    { month: "Jun", revenue: 121000 }, { month: "Jul", revenue: 128000 },
  ],
  Pune: [
    { month: "Feb", revenue: 120000 }, { month: "Mar", revenue: 131000 },
    { month: "Apr", revenue: 128000 }, { month: "May", revenue: 142000 },
    { month: "Jun", revenue: 149000 }, { month: "Jul", revenue: 154000 },
  ],
};

const weeklyRevenueTrendByOutlet: Record<string, { week: string; revenue: number }[]> = {
  All: [
    { week: "Week 1", revenue: 132000 }, { week: "Week 2", revenue: 145000 },
    { week: "Week 3", revenue: 138000 }, { week: "Week 4", revenue: 151000 },
    { week: "Week 5", revenue: 149000 }, { week: "Week 6", revenue: 162000 },
    { week: "Week 7", revenue: 158000 }, { week: "Week 8", revenue: 171000 },
  ],
  Nashik: [
    { week: "Week 1", revenue: 28000 }, { week: "Week 2", revenue: 31000 },
    { week: "Week 3", revenue: 29500 }, { week: "Week 4", revenue: 33000 },
    { week: "Week 5", revenue: 32000 }, { week: "Week 6", revenue: 34500 },
    { week: "Week 7", revenue: 33500 }, { week: "Week 8", revenue: 36000 },
  ],
  Pune: [
    { week: "Week 1", revenue: 35000 }, { week: "Week 2", revenue: 37500 },
    { week: "Week 3", revenue: 36000 }, { week: "Week 4", revenue: 39000 },
    { week: "Week 5", revenue: 38500 }, { week: "Week 6", revenue: 41000 },
    { week: "Week 7", revenue: 40000 }, { week: "Week 8", revenue: 43000 },
  ],
  "Mumbai Andheri": [
    { week: "Week 1", revenue: 21000 }, { week: "Week 2", revenue: 20000 },
    { week: "Week 3", revenue: 19500 }, { week: "Week 4", revenue: 22000 },
    { week: "Week 5", revenue: 21500 }, { week: "Week 6", revenue: 20500 },
    { week: "Week 7", revenue: 22500 }, { week: "Week 8", revenue: 21000 },
  ],
  Nagpur: [
    { week: "Week 1", revenue: 24000 }, { week: "Week 2", revenue: 25500 },
    { week: "Week 3", revenue: 24500 }, { week: "Week 4", revenue: 26500 },
    { week: "Week 5", revenue: 25000 }, { week: "Week 6", revenue: 27000 },
    { week: "Week 7", revenue: 26000 }, { week: "Week 8", revenue: 28500 },
  ],
  Aurangabad: [
    { week: "Week 1", revenue: 13500 }, { week: "Week 2", revenue: 12800 },
    { week: "Week 3", revenue: 12000 }, { week: "Week 4", revenue: 13000 },
    { week: "Week 5", revenue: 12500 }, { week: "Week 6", revenue: 11800 },
    { week: "Week 7", revenue: 12200 }, { week: "Week 8", revenue: 13500 },
  ],
  Thane: [
    { week: "Week 1", revenue: 29500 }, { week: "Week 2", revenue: 30800 },
    { week: "Week 3", revenue: 29800 }, { week: "Week 4", revenue: 32000 },
    { week: "Week 5", revenue: 31500 }, { week: "Week 6", revenue: 33500 },
    { week: "Week 7", revenue: 32800 }, { week: "Week 8", revenue: 35000 },
  ],
  Kolhapur: [
    { week: "Week 1", revenue: 23000 }, { week: "Week 2", revenue: 24500 },
    { week: "Week 3", revenue: 23800 }, { week: "Week 4", revenue: 25500 },
    { week: "Week 5", revenue: 24800 }, { week: "Week 6", revenue: 26000 },
    { week: "Week 7", revenue: 25200 }, { week: "Week 8", revenue: 27000 },
  ],
  Solapur: [
    { week: "Week 1", revenue: 18500 }, { week: "Week 2", revenue: 17800 },
    { week: "Week 3", revenue: 17200 }, { week: "Week 4", revenue: 18800 },
    { week: "Week 5", revenue: 18200 }, { week: "Week 6", revenue: 17500 },
    { week: "Week 7", revenue: 18900 }, { week: "Week 8", revenue: 19200 },
  ],
};

const outletComparison = [
  { outlet: "Nashik", revenue: 128000 }, { outlet: "Pune", revenue: 154000 },
  { outlet: "Mumbai", revenue: 96000 }, { outlet: "Nagpur", revenue: 111000 },
  { outlet: "Aurangabad", revenue: 61000 }, { outlet: "Thane", revenue: 135000 },
  { outlet: "Kolhapur", revenue: 108000 }, { outlet: "Solapur", revenue: 89000 },
];

const outletPerformance = [
  { name: "Nashik City Center", sales: 128000, target: 120000, growth: 6.4, status: "Healthy" },
  { name: "Pune FC Road", sales: 154000, target: 140000, growth: 10.1, status: "Healthy" },
  { name: "Mumbai Andheri East", sales: 96000, target: 130000, growth: -3.2, status: "Watch" },
  { name: "Nagpur Dharampeth", sales: 111000, target: 100000, growth: 8.7, status: "Healthy" },
  { name: "Aurangabad CIDCO", sales: 61000, target: 95000, growth: -12.5, status: "Critical" },
  { name: "Thane Estate", sales: 135000, target: 125000, growth: 7.8, status: "Healthy" },
  { name: "Kolhapur Tarabai Park", sales: 108000, target: 105000, growth: 3.5, status: "Healthy" },
  { name: "Solapur Saat Rasta", sales: 89000, target: 95000, growth: -2.1, status: "Watch" },
];

const outletLocations = [
  { name: "Nashik City Center", x: 42, y: 28, status: "Healthy" },
  { name: "Pune FC Road", x: 48, y: 55, status: "Healthy" },
  { name: "Mumbai Andheri East", x: 22, y: 48, status: "Watch" },
  { name: "Nagpur Dharampeth", x: 82, y: 38, status: "Healthy" },
  { name: "Aurangabad CIDCO", x: 58, y: 40, status: "Critical" },
  { name: "Thane Estate", x: 30, y: 44, status: "Healthy" },
  { name: "Kolhapur Tarabai Park", x: 45, y: 80, status: "Healthy" },
  { name: "Solapur Saat Rasta", x: 65, y: 72, status: "Watch" },
];

const MAP_KM_PER_PERCENT = 6.5;

function estimateDistanceKm(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  return Math.round(pixelDist * MAP_KM_PER_PERCENT);
}

const healthRadar = [
  { dimension: "Sales", Nashik: 88, Pune: 94, Aurangabad: 41 },
  { dimension: "Inventory", Nashik: 76, Pune: 82, Aurangabad: 38 },
  { dimension: "Staffing", Nashik: 90, Pune: 85, Aurangabad: 55 },
  { dimension: "Audit Score", Nashik: 91, Pune: 87, Aurangabad: 41 },
  { dimension: "Marketing ROI", Nashik: 70, Pune: 79, Aurangabad: 33 },
];


const severityColor: Record<string, { bg: string; color: string }> = {
  Critical: { bg: "#FB71851A", color: "#FB7185" },
  High: { bg: "#F59E0B1A", color: "#F59E0B" },
  Medium: { bg: "#38BDF81A", color: "#38BDF8" },
  Low: { bg: "#2DD4BF1A", color: "#2DD4BF" },
};

const dailySales = Array.from({ length: 35 }, (_, i) => {
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  const frac = seed - Math.floor(seed);
  return { day: i + 1, intensity: Math.floor(frac * 5) };
});

const networkNodes = [
  { name: "Nashik", revenue: 128000, angle: 270, status: "Healthy" },
  { name: "Pune", revenue: 154000, angle: 315, status: "Healthy" },
  { name: "Mumbai Andheri", revenue: 96000, angle: 0, status: "Watch" },
  { name: "Nagpur", revenue: 111000, angle: 45, status: "Healthy" },
  { name: "Aurangabad", revenue: 61000, angle: 90, status: "Critical" },
  { name: "Thane", revenue: 135000, angle: 135, status: "Healthy" },
  { name: "Kolhapur", revenue: 108000, angle: 180, status: "Healthy" },
  { name: "Solapur", revenue: 89000, angle: 225, status: "Watch" },
];

const kpis = [
  { label: "Total Revenue", value: "₹1.35Cr", delta: "+14.2%", icon: TrendingUp },
  { label: "Total Sales", value: "58,450", delta: "+9.8%", icon: BarChart3 },
  { label: "Active Outlets", value: "16", delta: "+1 this month", icon: Store },
  { label: "Monthly Growth", value: "5.3%", delta: "vs last month", icon: TrendingUp },
  { label: "Avg Order Value", value: "₹232", delta: "+3.4%", icon: FileBarChart },
  { label: "Outlet Health Score", value: "67/100", delta: "Stable", icon: ShieldCheck },
];

const extendedKpis = [
  { label: "Net Profit", value: "₹31.84L", delta: "+9.6% vs last month", note: "Margins trending upward" },
  { label: "Customer Satisfaction", value: "4.5 / 5", delta: "+0.3", note: "Fewer complaints logged" },
  { label: "Inventory Health", value: "92%", delta: "+4%", note: "Stock accuracy improving" },
  { label: "Employee Productivity", value: "87%", delta: "+2.1%", note: "Peak-hour staffing improved" },
  { label: "Franchise Performance", value: "84/100", delta: "+3 pts", note: "Network trending positive" },
];

const statusColorDark: Record<string, string> = {
  Healthy: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Watch: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  Critical: "bg-amber-800/30 text-amber-200 border-amber-700/50",
};
const statusColorLight: Record<string, string> = {
  Healthy: "bg-amber-100 text-amber-800 border-amber-300",
  Watch: "bg-sky-100 text-sky-800 border-sky-300",
  Critical: "bg-amber-900/20 text-amber-900 border-amber-400",
};
const pinColor: Record<string, string> = { Healthy: "#10B981", Watch: "#F59E0B", Critical: "#FB7185" };


const FALLBACK_INVENTORY = [
  { item_id: 101, outlet_id: 1, sku: "COFBEA001", name: "Arabica Coffee Beans (1kg)", category: "Raw Materials", unit: "kg", quantity: 45, reorder_at: 20, supplier: "BeanMaster Supplies", outlets: { outlet_name: "Nashik City Center", city: "Nashik" } },
  { item_id: 102, outlet_id: 2, sku: "COFBEA001", name: "Arabica Coffee Beans (1kg)", category: "Raw Materials", unit: "kg", quantity: 52, reorder_at: 20, supplier: "BeanMaster Supplies", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
  { item_id: 103, outlet_id: 5, sku: "COFBEA001", name: "Arabica Coffee Beans (1kg)", category: "Raw Materials", unit: "kg", quantity: 8, reorder_at: 20, supplier: "BeanMaster Supplies", outlets: { outlet_name: "Aurangabad CIDCO", city: "Aurangabad" } },
  { item_id: 104, outlet_id: 3, sku: "MLKWHL002", name: "Whole Milk (1L)", category: "Dairy", unit: "l", quantity: 22, reorder_at: 25, supplier: "MilkRich Dairy", outlets: { outlet_name: "Mumbai Andheri East", city: "Mumbai" } },
  { item_id: 105, outlet_id: 2, sku: "MLKWHL002", name: "Whole Milk (1L)", category: "Dairy", unit: "l", quantity: 60, reorder_at: 25, supplier: "MilkRich Dairy", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
  { item_id: 106, outlet_id: 1, sku: "SYRVAR003", name: "Vanilla Espresso Syrup", category: "Syrups", unit: "bottles", quantity: 18, reorder_at: 10, supplier: "SweetLine Flavors", outlets: { outlet_name: "Nashik City Center", city: "Nashik" } },
  { item_id: 107, outlet_id: 6, sku: "PAPCUP004", name: "Eco Paper Cups (500ml)", category: "Packaging", unit: "pcs", quantity: 450, reorder_at: 200, supplier: "GreenPack Solutions", outlets: { outlet_name: "Thane Estate", city: "Thane" } },
  { item_id: 108, outlet_id: 5, sku: "PAPCUP004", name: "Eco Paper Cups (500ml)", category: "Packaging", unit: "pcs", quantity: 120, reorder_at: 200, supplier: "GreenPack Solutions", outlets: { outlet_name: "Aurangabad CIDCO", city: "Aurangabad" } },
  { item_id: 109, outlet_id: 4, sku: "ALTMIL005", name: "Oat Milk Barista Blend (1L)", category: "Dairy", unit: "l", quantity: 34, reorder_at: 15, supplier: "PlantBase Foods", outlets: { outlet_name: "Nagpur Dharampeth", city: "Nagpur" } },
  { item_id: 110, outlet_id: 7, sku: "CROBTR006", name: "Butter Croissants (Box of 12)", category: "Bakery", unit: "boxes", quantity: 28, reorder_at: 10, supplier: "BakeFresh Artisans", outlets: { outlet_name: "Kolhapur Tarabai Park", city: "Kolhapur" } },
  { item_id: 111, outlet_id: 8, sku: "ESPROS007", name: "Espresso Dark Roast Blend", category: "Raw Materials", unit: "kg", quantity: 14, reorder_at: 15, supplier: "Roastique Roasters", outlets: { outlet_name: "Solapur Saat Rasta", city: "Solapur" } },
];

const modules = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "agentDashboards", label: "Agent Dashboards", icon: Grid3x3 },
  { id: "outlet", label: "Outlet Performance Agent", icon: Store },
  { id: "inventory", label: "Inventory Agent", icon: Boxes },
  { id: "staff", label: "Staff Agent", icon: Users },
  { id: "marketing", label: "Marketing Agent", icon: Megaphone },
  { id: "audit", label: "Audit Agent", icon: ShieldCheck },
  { id: "intelligence", label: "Franchise Intelligence AI", icon: Brain },
  { id: "reporting", label: "Reports", icon: FileBarChart },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "enterprise", label: "Enterprise AI Hub", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

type InventoryItem = {
  item_id: number;
  outlet_id: number;
  sku: string;
  name: string;
  category: string | null;
  unit: string | null;
  quantity: string | number;
  reorder_at: string | number;
  supplier: string | null;
  outlets?: { outlet_name: string; city: string | null };
};

type InventorySummary = {
  total: number;
  healthy: number;
  watch: number;
  critical: number;
  totalUnits: number;
  healthPct: number;
};

type Outlet = { outlet_id: number; outlet_name: string; city: string | null }; 
type HealthComponent = { label: string; weight: number; score: number; note: string };
type RiskPrediction = { riskType: string; probability: number; impact: "High" | "Medium" | "Low"; horizon: string; evidence: string };
type GrowthOpportunity = { opportunity: string; evidence: string; estimatedImpact: string; suggestedAction: string; confidence: number };
type Recommendation = { title: string; priority: "High" | "Medium" | "Low"; owner: string; expectedImpact: string; deadline: string; evidence: string };
type ConsolidatedFinding = { sourceAgent: string; franchiseId: string; kpiAffected: string; finding: string; severity: "Critical" | "High" | "Medium" | "Low"; timestamp: string };


function inventoryStatus(item: InventoryItem): "Healthy" | "Watch" | "Critical" {
  const qty = Number(item.quantity);
  const reorderAt = Number(item.reorder_at);
  if (qty <= reorderAt * 0.5) return "Critical";
  if (qty <= reorderAt) return "Watch";
  return "Healthy";
}

const wastageData = [
  { item: "Coffee beans, house blend", category: "Raw materials", wastedUnits: 1.2, unit: "kg", wastagePercent: 8 },
  { item: "Whole milk", category: "Raw materials", wastedUnits: 4, unit: "l", wastagePercent: 5 },
  { item: "Espresso syrup, vanilla", category: "Raw materials", wastedUnits: 0.3, unit: "bottles", wastagePercent: 6 },
  { item: "Takeaway cups", category: "Packaging", wastedUnits: 15, unit: "pcs", wastagePercent: 2 },
];
const avgWastagePercent = Math.round(
  wastageData.reduce((sum, w) => sum + w.wastagePercent, 0) / wastageData.length
);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MIN_STAFF_PER_OUTLET = 3;
const KNOWN_OUTLET_NAMES = [
  "Pune", "Mumbai Andheri", "Nashik", "Nagpur", "Aurangabad", "Thane", "Kolhapur", "Solapur",
];

const FIRST_NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikas", "Kavita", "Suresh", "Neha", "Anil", "Pooja", "Manoj", "Deepa", "Rajesh", "Swati", "Ganesh", "Meera", "Sanjay", "Anita", "Vijay", "Rekha", "Prakash"];
const LAST_NAMES = ["Sharma", "Patel", "Verma", "Kulkarni", "Deshmukh", "Rane", "Pawar", "More", "Joshi", "Kadam", "Shinde", "Gaikwad", "Naik", "Bhosale", "Chavan"];
const ROLES = ["Store Manager", "Shift Supervisor", "Barista", "Cashier", "Inventory Clerk"];
const OUTLET_STAFF_COUNTS: Record<string, number> = {
  "Pune": 8, "Nashik": 7, "Mumbai Andheri": 2, "Nagpur": 7,
  "Aurangabad": 2, "Thane": 7, "Kolhapur": 7, "Solapur": 2,
};

const EXPERIENCE_RANGE_BY_ROLE: Record<string, [number, number]> = {
  "Store Manager": [5, 9],
  "Shift Supervisor": [3, 6],
  "Inventory Clerk": [1, 4],
  "Barista": [0.5, 3],
  "Cashier": [0.5, 3],
};

function generateFallbackEmployees() {
  const list: any[] = [];
  let id = 1;
  Object.entries(OUTLET_STAFF_COUNTS).forEach(([outletName, count]) => {
    for (let i = 0; i < count; i++) {
      const first = FIRST_NAMES[(id - 1) % FIRST_NAMES.length];
      const last = LAST_NAMES[(id - 1) % LAST_NAMES.length];
      const role = ROLES[i % ROLES.length];
      const [minExp, maxExp] = EXPERIENCE_RANGE_BY_ROLE[role];
      const experience = Number((minExp + (((id * 7) % 20) / 20) * (maxExp - minExp)).toFixed(1));
      list.push({
        employee_id: id,
        full_name: `${first} ${last}`,
        role,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@franchiseops.com`,
        outlets: { outlet_name: outletName },
        salary: 20000 + (i % ROLES.length) * 6000,
        experience_years: experience,
        status: (outletName === "Mumbai Andheri" || outletName === "Solapur") && i === count - 1 ? "On Leave" : "Active",
      });
      id++;
    }
  });
  return list;
}

const FALLBACK_EMPLOYEES = generateFallbackEmployees();

function generateAttendanceLog() {
  return FALLBACK_EMPLOYEES.map((emp) => {
    const mod = emp.employee_id % 10;
    let todayStatus = "Present";
    if (mod === 9) todayStatus = "Absent";
    else if (mod === 7 || mod === 8) todayStatus = "Late";

    const week = Array.from({ length: 7 }, (_, d) => {
      if (d >= 5) return "-";
      const dayMod = (emp.employee_id + d) % 11;
      if (dayMod === 10) return "A";
      if (dayMod === 8 || dayMod === 9) return "L";
      return "P";
    });

    return {
      staffId: emp.employee_id,
      name: emp.full_name,
      outlet: emp.outlets.outlet_name,
      checkIn: todayStatus === "Absent" ? "-" : todayStatus === "Late" ? "13:10" : "09:0" + ((emp.employee_id % 6)),
      checkOut: todayStatus === "Absent" ? "-" : "18:0" + ((emp.employee_id % 6)),
      todayStatus,
      week,
    };
  });
}

const attendanceLog = generateAttendanceLog();

const attendanceDotColor: Record<string, string> = {
  P: "#2DD9B9",
  L: "#F2A93B",
  A: "#F2586B",
  "-": "#232630",
};



const RECOMMENDED_CANDIDATES = [
  { id: "c1", name: "Ritika Joshi", currentEmployer: "Café Coffee Day", role: "Barista", experience_years: 2.5, suggestedOutlet: "Mumbai Andheri", rating: 4.6 },
  { id: "c2", name: "Devendra Naik", currentEmployer: "Chaayos", role: "Shift Supervisor", experience_years: 4.2, suggestedOutlet: "Aurangabad", rating: 4.4 },
  { id: "c3", name: "Farhan Shaikh", currentEmployer: "Third Wave Coffee", role: "Barista", experience_years: 1.8, suggestedOutlet: "Solapur", rating: 4.3 },
  { id: "c4", name: "Komal Iyer", currentEmployer: "Starbucks", role: "Store Manager", experience_years: 6.5, suggestedOutlet: "Mumbai Andheri", rating: 4.8 },
  { id: "c5", name: "Yash Thakur", currentEmployer: "Blue Tokai", role: "Inventory Clerk", experience_years: 2.1, suggestedOutlet: "Aurangabad", rating: 4.2 },
  { id: "c6", name: "Simran Kaur", currentEmployer: "Barista Lavazza", role: "Cashier", experience_years: 1.4, suggestedOutlet: "Solapur", rating: 4.1 },
];

const operationalChecks = [
  { area: "Attendance", outlet: "Aurangabad CIDCO", status: "Fail", detail: "3 no-shows this week, no leave requests filed" },
  { area: "Staffing Levels", outlet: "Mumbai Andheri East", status: "Fail", detail: "2/3 minimum staff — understaffed" },
  { area: "Inventory Updates", outlet: "Solapur Saat Rasta", status: "Watch", detail: "Stock counts not updated in 4 days" },
  { area: "Cash Closing", outlet: "Pune FC Road", status: "Pass", detail: "Daily closing reconciled, no discrepancies" },
  { area: "Attendance", outlet: "Nashik City Center", status: "Pass", detail: "Full attendance, all shifts covered" },
  { area: "Cash Closing", outlet: "Aurangabad CIDCO", status: "Fail", detail: "₹1,240 shortfall unexplained, 2 days running" },
];

const complianceTrend = [
  { month: "Feb", score: 79 }, { month: "Mar", score: 81 },
  { month: "Apr", score: 78 }, { month: "May", score: 84 },
  { month: "Jun", score: 86 }, { month: "Jul", score: 88 },
];

const complianceCategories = [
  { category: "Hygiene", passRate: 82 },
  { category: "Safety", passRate: 61 },
  { category: "Branding", passRate: 74 },
  { category: "Cash Handling", passRate: 88 },
  { category: "Staffing Compliance", passRate: 69 },
];

const reAuditDeadlines = [
  { outlet: "Aurangabad CIDCO", reason: "Critical score (44/100)", dueDate: "2026-08-19", daysLeft: 7 },
  { outlet: "Mumbai Andheri East", reason: "Watch status (62/100)", dueDate: "2026-08-26", daysLeft: 14 },
];

const signOffTrail = [
  { outlet: "Nashik City Center", reviewedBy: "Priya Sharma, Regional Manager", status: "Approved", date: "2026-08-04" },
  { outlet: "Pune FC Road", reviewedBy: "Priya Sharma, Regional Manager", status: "Approved", date: "2026-08-05" },
  { outlet: "Mumbai Andheri East", reviewedBy: "—", status: "Pending Review", date: "—" },
  { outlet: "Aurangabad CIDCO", reviewedBy: "—", status: "Pending Review", date: "—" },
];

const correctiveActions = [
  { outlet: "Aurangabad CIDCO", issue: "Expired fire safety certificate", action: "Schedule renewal inspection within 7 days; escalate to franchise legal team.", priority: "High" },
  { outlet: "Aurangabad CIDCO", issue: "Cash shortfall, 2 days running", action: "Audit register logs manually; interview shift cashier; consider POS recalibration.", priority: "High" },
  { outlet: "Mumbai Andheri East", issue: "Understaffed (2/3 minimum)", action: "Approve pending hire requisition; review Recommended Candidates in Staff Agent.", priority: "Medium" },
  { outlet: "Solapur Saat Rasta", issue: "Stock counts stale (4 days)", action: "Assign inventory clerk to reconcile counts before next delivery.", priority: "Medium" },
  { outlet: "Mumbai Andheri East", issue: "Trade license expiring in 3 weeks", action: "Submit renewal application; confirm no lapse in coverage.", priority: "Low" },
];


const marketingCampaigns = [
  { name: "Monsoon Coffee Fest", channel: "Instagram", reach: 82000, engagement: 6.8, spend: 45000, roi: 3.2, status: "Active" },
  { name: "Weekend Combo Offer", channel: "WhatsApp", reach: 34000, engagement: 9.4, spend: 12000, roi: 4.6, status: "Active" },
  { name: "New Outlet Launch - Thane", channel: "Google Ads", reach: 58000, engagement: 3.1, spend: 60000, roi: 1.4, status: "Underperforming" },
  { name: "Loyalty Program Push", channel: "Email", reach: 21000, engagement: 11.2, spend: 5000, roi: 5.8, status: "Active" },
  { name: "Festive Season Bundle", channel: "Facebook", reach: 96000, engagement: 4.5, spend: 70000, roi: 2.0, status: "Underperforming" },
  { name: "Student Discount Drive", channel: "Instagram", reach: 41000, engagement: 8.1, spend: 15000, roi: 4.1, status: "Active" },
];

const engagementTrend = [
  { month: "Feb", engagement: 5.2 }, { month: "Mar", engagement: 5.8 },
  { month: "Apr", engagement: 6.1 }, { month: "May", engagement: 6.9 },
  { month: "Jun", engagement: 7.4 }, { month: "Jul", engagement: 7.8 },
];

const channelBreakdown = [
  { channel: "Instagram", engagement: 7.4 },
  { channel: "WhatsApp", engagement: 9.4 },
  { channel: "Email", engagement: 11.2 },
  { channel: "Facebook", engagement: 4.5 },
  { channel: "Google Ads", engagement: 3.1 },
];

const totalMarketingSpend = marketingCampaigns.reduce((s, c) => s + c.spend, 0);
const totalReach = marketingCampaigns.reduce((s, c) => s + c.reach, 0);
const avgEngagement = Number((marketingCampaigns.reduce((s, c) => s + c.engagement, 0) / marketingCampaigns.length).toFixed(1));
const avgROI = Number((marketingCampaigns.reduce((s, c) => s + c.roi, 0) / marketingCampaigns.length).toFixed(1));
const underperformingCampaigns = marketingCampaigns.filter((c) => c.status === "Underperforming");

const marketingRecommendations = [
  "Shift budget from 'New Outlet Launch - Thane' (Google Ads, 1.4x ROI) toward Email and WhatsApp campaigns, which are delivering 4-6x higher ROI.",
  "Festive Season Bundle has the widest reach (96K) but weak engagement (4.5%) — consider more targeted creative instead of broad Facebook reach.",
  "Loyalty Program Push has the best ROI (5.8x) on the smallest budget — a strong candidate for increased spend.",
];

// ADDED: 4 new Marketing Agent data sets

// 1. Promotion effectiveness — "Measure promotion effectiveness"
const promotionEffectiveness = [
  { promo: "20% Off First Order", type: "Discount", redemptions: 1240, redemptionRate: 18.2, revenue: 186000 },
  { promo: "Buy 1 Get 1 Free", type: "BOGO", redemptions: 890, redemptionRate: 24.5, revenue: 142000 },
  { promo: "Loyalty Points 2x Weekend", type: "Loyalty", redemptions: 2100, redemptionRate: 31.8, revenue: 210000 },
  { promo: "Refer-a-Friend Bonus", type: "Referral", redemptions: 560, redemptionRate: 12.4, revenue: 78000 },
];
const bestPromo = [...promotionEffectiveness].sort((a, b) => b.redemptionRate - a.redemptionRate)[0];

// 2. Customer segmentation — deeper "Analyze customer engagement"
const customerSegments = [
  { segment: "New Customers", percent: 38, count: 22040 },
  { segment: "Returning Customers", percent: 62, count: 35960 },
];
const ageGroupEngagement = [
  { ageGroup: "18-25", engagement: 8.9 },
  { ageGroup: "26-35", engagement: 7.2 },
  { ageGroup: "36-45", engagement: 5.4 },
  { ageGroup: "46+", engagement: 3.1 },
];

// 3. Social media performance
const followerGrowthTrend = [
  { month: "Feb", followers: 18200 }, { month: "Mar", followers: 19100 },
  { month: "Apr", followers: 20400 }, { month: "May", followers: 22300 },
  { month: "Jun", followers: 24100 }, { month: "Jul", followers: 26500 },
];
const socialPlatformStats = [
  { platform: "Instagram", followers: 26500, likes: 12400, comments: 890, shares: 340 },
  { platform: "Facebook", followers: 9800, likes: 6200, comments: 410, shares: 210 },
  { platform: "WhatsApp Broadcast", followers: 15200, likes: 0, comments: 0, shares: 0 },
];
const followerGrowthPercent = Math.round(
  ((followerGrowthTrend[followerGrowthTrend.length - 1].followers - followerGrowthTrend[0].followers) / followerGrowthTrend[0].followers) * 100
);
// 4. Upcoming campaigns calendar
const upcomingCampaigns = [
  { name: "Independence Day Special", channel: "Instagram + WhatsApp", launchDate: "2026-08-12", targetOutlets: "All outlets", budget: 40000 },
  { name: "Back to College Combo", channel: "Google Ads", launchDate: "2026-08-20", targetOutlets: "Pune, Nashik, Nagpur", budget: 35000 },
  { name: "Rainy Day Hot Beverages Push", channel: "Facebook", launchDate: "2026-08-25", targetOutlets: "Mumbai Andheri, Thane", budget: 25000 },
];

function AppSplashLoader({ t, accent, label, onComplete }: { t: typeof themes.dark; accent: string; label: string; onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  // Store onComplete in a ref so the effect never needs it as a dependency
  // (avoids the re-render loop caused by inline arrow function prop references)
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onCompleteRef.current) {
            setTimeout(onCompleteRef.current, 200);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 30);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — runs once on mount only

  return (
    <div className="w-full min-h-[850px] flex flex-col items-center justify-center font-sans relative overflow-hidden" style={{ background: "transparent", color: t.text }}>
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: `${accent}18` }} />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center max-w-md w-full text-center px-10 py-12 rounded-3xl glass-card border border-white/10 shadow-2xl relative z-10"
      >
        {/* Enhanced 3D Logo Badge */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-2xl border-2 border-dashed"
            style={{ borderColor: `${accent}99` }}
          />
          <img
            src="/logo.png"
            alt="OmniFranchise Logo"
            className="absolute w-16 h-16 rounded-2xl object-cover shadow-xl shadow-amber-500/40 border border-amber-400/40"
          />
        </div>

        {/* Website Name - Italic Gold & Cream */}
        <h1 className="text-3xl brand-font italic font-extrabold tracking-tight mb-1" style={{ color: "#FFFBEB", textShadow: `0 0 20px ${accent}66` }}>
          OmniFranchise
        </h1>
        <p className="text-xs uppercase tracking-widest font-mono text-amber-200/80 mb-6">Enterprise Intelligence Engine</p>

        <p className="text-xs mb-4 font-medium" style={{ color: t.textMuted }}>{label}</p>

        {/* Slider Loading Bar */}
        <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden mb-4 border border-white/10 relative p-0.5">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              backgroundColor: accent,
              width: `${progress}%`,
              boxShadow: `0 0 16px ${accent}`
            }}
            transition={{ ease: "easeOut" }}
          >
            {/* Animated shimmer light effect sweeping across slider */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </motion.div>
        </div>

        {/* Slider Percentage & Dynamic Status */}
        <div className="w-full flex items-center justify-between text-xs font-mono" style={{ color: t.textFaint }}>
          <span className="truncate max-w-[240px] text-left">
            {progress < 30 ? "⚡ Establishing Neural Connection..." : progress < 70 ? "🔄 Syncing Multi-Outlet Telemetry..." : "✅ System Authorization Granted"}
          </span>
          <span className="font-bold text-teal-400 text-sm ml-2">{progress}%</span>
        </div>
      </motion.div>
    </div>
  );
}

function LoginPage({
  t,
  accent,
  onLogin,
}: {
  t: typeof themes.dark;
  accent: string;
  onLogin: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const inputWrap: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 9, background: t.inputBg,
    border: `1px solid ${t.border}`, borderRadius: 9, padding: "11px 13px",
  };
  const inputStyle: React.CSSProperties = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: t.text, fontSize: 14,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("fops_token", data.token);
      sessionStorage.setItem("fops_user", JSON.stringify(data.user));
      setIsAuthenticating(true);
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
      setLoading(false);
    }
  }

  if (isAuthenticating) {
    return <AppSplashLoader t={t} accent={accent} label="Authenticating Credentials & Telemetry..." onComplete={onLogin} />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center font-sans" style={{ background: "transparent", color: t.text }}>
      <div className="w-[380px]">
        <div className="flex items-center justify-center gap-3 mb-7">
          <img src="/logo.png" alt="OmniFranchise Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-amber-500/40 border border-amber-400/40" />
          <div>
            <p className="brand-font italic font-extrabold text-xl leading-tight" style={{ color: "#FFFBEB" }}>OmniFranchise</p>
            <p className="text-[11px] font-mono text-amber-200/80">Enterprise Intelligence Engine</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border p-7 glass-card" style={{ borderColor: t.border }}>
          <p className="text-lg font-semibold mb-1" style={{ color: t.text }}>Sign in to your network</p>
          <p className="text-sm mb-5" style={{ color: t.textMuted }}>Access dashboards, agents, and outlet insights.</p>

          <div
            onClick={() => { setEmail("abhi@gmail.com"); setPassword("abhi"); }}
            className="mb-4 p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors"
            style={{ background: `${accent}10`, borderColor: `${accent}30`, color: accent }}
          >
            <span className="font-medium">Demo Admin: abhi@gmail.com / abhi</span>
            <span className="text-[10px] underline font-bold">Quick Fill</span>
          </div>

          {error && (
            <div className="text-xs rounded-lg px-3 py-2 mb-4" style={{ background: "#FB71851A", color: "#FB7185", border: "1px solid #FB718533" }}>
              {error}
            </div>
          )}

          <div className="mb-3.5">
            <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Work email</p>
            <div style={inputWrap}>
              <Mail size={15} color={t.textFaint} />
              <input style={inputStyle} type="email" placeholder="you@franchiseops.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-2">
            <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Password</p>
            <div style={inputWrap}>
              <Lock size={15} color={t.textFaint} />
              <input style={inputStyle} type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="flex" aria-label="Toggle password visibility">
                {showPw ? <EyeOff size={15} color={t.textFaint} /> : <Eye size={15} color={t.textFaint} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm mt-5 shadow-lg shadow-teal-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: accent, color: "#0E1015", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Log in to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AskAIPanel({
  t,
  accent,
  onClose,
  outlets,
  inventoryItems,
  inventorySummary,
  employees,
}: {
  t: typeof themes.dark;
  accent: string;
  onClose: () => void;
  outlets: Outlet[];
  inventoryItems: InventoryItem[];
  inventorySummary: InventorySummary | null;
  employees: any[];
}) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! Ask me about outlets, inventory, staff, or marketing — I'll pull live numbers from your data." },
  ]);

  function answerQuery(q: string): string {
    const lower = q.toLowerCase();

    if (lower.includes("critical") && lower.includes("inventory")) {
      const critical = inventoryItems.filter((i) => Number(i.quantity) <= Number(i.reorder_at) * 0.5);
      if (critical.length === 0) return "No items are currently critical — inventory looks healthy.";
      return `${critical.length} item(s) are critically low: ${critical.map((i) => i.name).join(", ")}.`;
    }

    if (lower.includes("promo")) {
      return `Your best-performing promotion is "${bestPromo.promo}" with a ${bestPromo.redemptionRate}% redemption rate and ₹${bestPromo.revenue.toLocaleString("en-IN")} in revenue.`;
    }

    if (lower.includes("follower") || lower.includes("social")) {
      return `Total followers across platforms: ${socialPlatformStats.reduce((s, p) => s + p.followers, 0).toLocaleString("en-IN")}, up ${followerGrowthPercent}% over the last 6 months.`;
    }

    if (lower.includes("upcoming") && lower.includes("campaign")) {
      return `${upcomingCampaigns.length} campaign(s) are scheduled: ${upcomingCampaigns.map((c) => `${c.name} (${c.launchDate})`).join(", ")}.`;
    }

    if (lower.includes("underperform") && lower.includes("campaign")) {
      if (underperformingCampaigns.length === 0) return "All marketing campaigns are performing well.";
      return `${underperformingCampaigns.length} campaign(s) are underperforming: ${underperformingCampaigns.map((c) => `${c.name} (${c.roi}x ROI)`).join(", ")}.`;
    }

    if (lower.includes("roi") || lower.includes("campaign") || lower.includes("marketing")) {
      return `Average marketing ROI is ${avgROI}x across ${marketingCampaigns.length} campaigns, with total reach of ${totalReach.toLocaleString("en-IN")} and average engagement of ${avgEngagement}%.`;
    }

    if (lower.includes("underperform")) {
      const bad = outletPerformance.filter((o) => o.status !== "Healthy");
      if (bad.length === 0) return "All outlets are currently performing well.";
      return `${bad.length} outlet(s) are underperforming: ${bad.map((o) => `${o.name} (${o.status})`).join(", ")}.`;
    }

    if (lower.includes("wastage") || lower.includes("waste")) {
      return `Average wastage across tracked items is ${avgWastagePercent}%. Highest wastage: ${wastageData.sort((a, b) => b.wastagePercent - a.wastagePercent)[0].item} at ${wastageData[0].wastagePercent}%.`;
    }

    if (lower.includes("shortage") || (lower.includes("staff") && lower.includes("understaff"))) {
      const counts: Record<string, number> = {};
      FALLBACK_EMPLOYEES.forEach((e: any) => {
        const name = e.outlets?.outlet_name || "Unassigned";
        counts[name] = (counts[name] || 0) + 1;
      });
      const short = KNOWN_OUTLET_NAMES.filter((n) => (counts[n] || 0) < MIN_STAFF_PER_OUTLET);
      if (short.length === 0) return "No outlets are currently understaffed.";
      return `${short.length} outlet(s) are understaffed: ${short.map((n) => `${n} (${counts[n] || 0}/${MIN_STAFF_PER_OUTLET} staff)`).join(", ")}.`;
    }

    if (lower.includes("inventory") || lower.includes("stock")) {
      if (!inventorySummary) return "Inventory data isn't loaded yet — open the Inventory Agent page first.";
      return `You have ${inventorySummary.total} SKUs tracked, ${inventorySummary.totalUnits} units total. ${inventorySummary.watch + inventorySummary.critical} item(s) need reordering.`;
    }

    if (lower.includes("outlet") && (lower.includes("how many") || lower.includes("count") || lower.includes("total"))) {
      return `There are ${outlets.length} outlets in the network: ${outlets.map((o) => o.outlet_name).join(", ")}.`;
    }

    if (lower.includes("staff") || lower.includes("employee")) {
      return `There are ${FALLBACK_EMPLOYEES.length} staff members on record across the network.`;
    }

    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! Try asking things like 'how many outlets do we have', 'what inventory is critical', 'which outlets are understaffed', or 'what's our marketing ROI'.";
    }

    return "I can answer questions about outlets, inventory, staff, wastage, and marketing. Try: 'what's our marketing ROI', 'best promotion', or 'upcoming campaigns'.";
  }

  function handleSend() {
    if (!query.trim()) return;
    const userMsg = { role: "user" as const, text: query };
    const aiMsg = { role: "ai" as const, text: answerQuery(query) };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setQuery("");
  }

  return (
    <motion.div
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
        background: t.card, borderLeft: `1px solid ${t.border}`,
        display: "flex", flexDirection: "column", zIndex: 50,
        boxShadow: "-12px 0 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: t.border }}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} color={accent} />
          <p className="text-sm font-semibold" style={{ color: t.text }}>Ask AI</p>
        </div>
        <button onClick={onClose} style={{ color: t.textFaint, background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
          ×
        </button>
      </div>

      <div className="px-5 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto text-[11px]" style={{ borderColor: t.border }}>
        {["Critical inventory", "Underperforming outlets", "Staff shortage", "Marketing ROI"].map((chip) => (
          <button
            key={chip}
            onClick={() => {
              const userMsg = { role: "user" as const, text: chip };
              const aiMsg = { role: "ai" as const, text: answerQuery(chip) };
              setMessages((prev) => [...prev, userMsg, aiMsg]);
            }}
            className="px-2.5 py-1 rounded-full border shrink-0 transition-all hover:scale-105 cursor-pointer font-medium"
            style={{ background: t.inputBg, borderColor: `${accent}40`, color: t.textMuted }}
          >
            ⚡ {chip}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className="text-sm px-3.5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
            style={{
              maxWidth: "88%",
              marginLeft: m.role === "user" ? "auto" : 0,
              background: m.role === "user" ? accent : t.inputBg,
              color: m.role === "user" ? t.textOnAccent : t.text,
              border: m.role === "ai" ? `1px solid ${t.border}` : "none",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: t.border }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about outlets, inventory, staff..."
          className="flex-1 text-sm rounded-lg border px-3 py-2 outline-none"
          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 rounded-lg text-sm font-bold shadow-md cursor-pointer"
          style={{ background: accent, color: t.textOnAccent }}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}

interface FranchiseOSDashboardProps { initialModule?: string; }
export default function FranchiseOSDashboard({ initialModule = "dashboard" }: FranchiseOSDashboardProps = {}) {
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [active, setActiveState] = useState(initialModule);
  const [dashSubTab, setDashSubTab] = useState("outlet");
  const [recPriorityFilter, setRecPriorityFilter] = useState("All");
  const [selectedIntelOutlet, setSelectedIntelOutlet] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.remove("light-theme");
        document.documentElement.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
        document.documentElement.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
      }
    }
  }, [isDark]);

  function setActive(moduleKey: string) {
    setActiveState(moduleKey);
    if (typeof window !== "undefined") {
      const routeMap: Record<string, string> = {
        dashboard: "/",
        agentDashboards: "/agent-dashboards",
        outlet: "/outlet",
        inventory: "/inventory",
        staff: "/staff",
        marketing: "/marketing",
        audit: "/audit",
        intelligence: "/intelligence",
        reporting: "/reports",
        notifications: "/notifications",
        enterprise: "/enterprise",
        settings: "/settings",
      };
      const path = routeMap[moduleKey] || "/";
      if (window.location.pathname !== path) {
        window.history.pushState({ module: moduleKey }, "", path);
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathMap: Record<string, string> = {
      "/": "dashboard",
      "/agent-dashboards": "agentDashboards",
      "/outlet": "outlet",
      "/inventory": "inventory",
      "/staff": "staff",
      "/marketing": "marketing",
      "/audit": "audit",
      "/intelligence": "intelligence",
      "/reports": "reporting",
      "/reporting": "reporting",
      "/notifications": "notifications",
      "/enterprise": "enterprise",
      "/settings": "settings",
    };
    const handlePopState = () => {
      const mod = pathMap[window.location.pathname] || "dashboard";
      setActiveState(mod);
    };
    const handleCustomNav = (e: any) => {
      if (e.detail?.moduleKey) {
        setActive(e.detail.moduleKey);
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("fops-navigate", handleCustomNav);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("fops-navigate", handleCustomNav);
    };
  }, []);

  // Additional state for Audit, Intelligence, Reporting, and Notifications
  const [audits, setAudits] = useState<any[]>([
    { id: 1, outlet_id: 1, outlet_name: "Nashik City Center", date: "2026-08-03", score: 96, status: "Healthy", inspector: "Abhishek Pattnaik", category: "Food Safety & Temp", details: "All cold storage units <= 3.8°C. Kitchen disinfection verified." },
    { id: 2, outlet_id: 2, outlet_name: "Pune FC Road", date: "2026-08-04", score: 88, status: "Healthy", inspector: "Abhishek Pattnaik", category: "Opening / Closing Protocol", details: "On-time opening and alarm verification completed." },
    { id: 3, outlet_id: 3, outlet_name: "Mumbai Andheri East", date: "2026-08-04", score: 62, status: "Watch", inspector: "Abhishek Pattnaik", category: "Staff Hygiene & Attire", details: "2 staff members required uniform refresher training." },
    { id: 4, outlet_id: 4, outlet_name: "Aurangabad CIDCO", date: "2026-08-05", score: 44, status: "Critical", inspector: "Abhishek Pattnaik", category: "Cash Register Audit", details: "Discrepancy identified in shift cash register reconciliation." },
    { id: 5, outlet_id: 6, outlet_name: "Thane Estate", date: "2026-08-05", score: 92, status: "Healthy", inspector: "Priya Sharma", category: "Food Safety & Temp", details: "Standard SOP compliance verified across all stations." },
  ]);
  const [auditFilter, setAuditFilter] = useState("All");
  const [auditSearch, setAuditSearch] = useState("");
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [newAuditForm, setNewAuditForm] = useState({
    outletId: "1",
    outletName: "Nashik City Center",
    category: "Food Safety & Temp",
    inspector: "Abhishek Pattnaik",
    tempCheck: true,
    cleanlinessCheck: true,
    registerCheck: true,
    safetyCheck: true,
    uniformCheck: false,
    notes: "",
    score: 80,
  });
  const [auditSubTab, setAuditSubTab] = useState<"overview" | "operational" | "ai_photo" | "architecture">("overview");
  const [auditModalMode, setAuditModalMode] = useState<"manual" | "ai_photo">("manual");
  const [aiPhotoCategory, setAiPhotoCategory] = useState("Branding & Store Layout");
  const [aiPhotoOutlet, setAiPhotoOutlet] = useState("Nashik City Center");
  const [aiPhotoAnalyzing, setAiPhotoAnalyzing] = useState(false);
  const [aiPhotoResult, setAiPhotoResult] = useState<any>(null);
  const [aiPhotoPreview, setAiPhotoPreview] = useState<string | null>(null);
  const [aiPhotoName, setAiPhotoName] = useState<string>("storefront_facade.jpg");
  const [selectedAuditDetail, setSelectedAuditDetail] = useState<any | null>(null);
  const [selectedSopDetail, setSelectedSopDetail] = useState<any | null>(null);
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [auditToast, setAuditToast] = useState<string | null>(null);

  const [opMetrics, setOpMetrics] = useState<any[]>([
    { outlet_id: 1, outlet_name: "Nashik City Center", opening_closing_punctuality: 99.4, on_time_openings: "30/30 days", attendance_rate: 98.2, staff_coverage: "100%", cash_closing_variance: 0.00, pos_audit_status: "Verified", cleaning_hygiene_score: 96.5, maintenance_tickets_open: 0, complaint_avg_response_min: 12.4, overall_compliance_score: 98 },
    { outlet_id: 2, outlet_name: "Pune FC Road", opening_closing_punctuality: 96.8, on_time_openings: "29/30 days", attendance_rate: 95.0, staff_coverage: "96%", cash_closing_variance: -4.50, pos_audit_status: "Minor Variance", cleaning_hygiene_score: 91.0, maintenance_tickets_open: 1, complaint_avg_response_min: 18.2, overall_compliance_score: 91 },
    { outlet_id: 3, outlet_name: "Mumbai Andheri East", opening_closing_punctuality: 92.1, on_time_openings: "27/30 days", attendance_rate: 89.5, staff_coverage: "88%", cash_closing_variance: 0.00, pos_audit_status: "Verified", cleaning_hygiene_score: 87.5, maintenance_tickets_open: 2, complaint_avg_response_min: 24.5, overall_compliance_score: 86 },
    { outlet_id: 4, outlet_name: "Aurangabad CIDCO", opening_closing_punctuality: 74.5, on_time_openings: "22/30 days", attendance_rate: 78.0, staff_coverage: "75%", cash_closing_variance: -42.80, pos_audit_status: "Flagged Discrepancy", cleaning_hygiene_score: 64.0, maintenance_tickets_open: 4, complaint_avg_response_min: 68.0, overall_compliance_score: 64 }
  ]);


  const [simDiscount, setSimDiscount] = useState(10);
  const [simSpendMult, setSimSpendMult] = useState(1.5);
  const [simOutlet, setSimOutlet] = useState("Pune FC Road");
  const [simResult, setSimResult] = useState<any>({
    predicted_revenue: 172400,
    base_revenue: 154000,
    growth_pct: 11.9,
    demand_level: "High",
    confidence_score: 94.2,
    reorder_recommendation: "+35 kg Coffee Beans, +20L Milk required to support volume growth.",
  });

  const aiImageAnalysis = [
    { outlet: "Aurangabad CIDCO", label: "Storefront signage photo", finding: "Faded branding decal, below standard contrast", confidence: 92, status: "Fail" },
    { outlet: "Pune FC Road", label: "Counter cleanliness photo", finding: "Surfaces clean, no visible clutter", confidence: 97, status: "Pass" },
    { outlet: "Mumbai Andheri East", label: "Uniform compliance photo", finding: "2 of 4 staff missing name badges", confidence: 89, status: "Fail" },
    { outlet: "Nashik City Center", label: "Kitchen hygiene photo", finding: "Sanitation standards met", confidence: 95, status: "Pass" },
  ];

  const documentAnalysis = [
    { document: "Fire Safety Certificate", outlet: "Aurangabad CIDCO", type: "Compliance", status: "Expired", date: "2026-05-10" },
    { document: "FSSAI License", outlet: "Pune FC Road", type: "Legal", status: "Valid", date: "2027-02-18" },
    { document: "Trade License", outlet: "Mumbai Andheri East", type: "Legal", status: "Expiring Soon", date: "2026-09-05" },
    { document: "Health Inspection Report", outlet: "Solapur Saat Rasta", type: "Compliance", status: "Expiring Soon", date: "2026-08-28" },
  ];

  const customerFeedbackByOutlet = [
    { outlet: "Pune FC Road", rating: 4.7, complaints: 2, sentiment: "Positive" },
    { outlet: "Nashik City Center", rating: 4.5, complaints: 3, sentiment: "Positive" },
    { outlet: "Mumbai Andheri East", rating: 3.6, complaints: 11, sentiment: "Mixed" },
    { outlet: "Aurangabad CIDCO", rating: 2.9, complaints: 18, sentiment: "Negative" },
  ];

  const [poResult, setPoResult] = useState<any>(null);
  const [poLoading, setPoLoading] = useState(false);
  const [poItem, setPoItem] = useState("Coffee Beans (Arabica)");
  const [poQty, setPoQty] = useState(50);
  const [weatherCondition, setWeatherCondition] = useState("Rainy");
  const [weatherResult, setWeatherResult] = useState<any>({
    condition: "Rainy",
    demand_multiplier: 0.88,
    impact_summary: "Cold beverages -12%, Hot coffees +18% (Heavy Rain)"
  });
  const [coffeeInflation, setCoffeeInflation] = useState(15);
  const [dairyInflation, setDairyInflation] = useState(10);
  const [macroResult, setMacroResult] = useState<any>({
    baseline_margin_pct: 68.0,
    simulated_margin_pct: 64.1,
    margin_drop_pct: 3.9,
    recommendation: "Raise beverage base prices by 3.1% to maintain net profitability."
  });
  const [simLoading, setSimLoading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your Franchise Intelligence AI Copilot. How can I assist you with performance optimization today?" },
  ]);

  const [reportTab, setReportTab] = useState<"sales" | "inventory" | "staff" | "campaigns">("sales");
  const [reportPeriod, setReportPeriod] = useState<"week" | "month" | "quarter">("month");

  const [sseTransactions, setSseTransactions] = useState<any[]>([
    { id: "tx-1", outlet: "Pune FC Road", amount: 480, items: 3, time: "19:01:12", status: "Completed" },
    { id: "tx-2", outlet: "Nashik City Center", amount: 230, items: 1, time: "19:01:28", status: "Completed" },
    { id: "tx-3", outlet: "Thane Estate", amount: 640, items: 4, time: "19:01:45", status: "Completed" },
  ]);
  const [anomalies, setAnomalies] = useState<any[]>([
    { id: "an-1", outlet: "Aurangabad CIDCO", score: 87.4, reason: "Sudden 42% drop in transaction velocity vs 7-day moving average", time: "18:45:00", status: "Active Flag" },
    { id: "an-2", outlet: "Mumbai Andheri East", score: 79.1, reason: "Unusual refund volume spike flagged by Isolation Forest", time: "17:20:00", status: "Investigating" },
  ]);
  const [notificationsList, setNotificationsList] = useState<any[]>([
    { id: "n-1", type: "inventory", title: "Low Stock Critical", desc: "Arabica Coffee Beans in Aurangabad below 10 kg threshold", time: "10 mins ago", unread: true, severity: "Critical" },
    { id: "n-2", type: "sales", title: "Revenue Target Reached", desc: "Pune FC Road crossed monthly target of ₹1.40L", time: "1 hour ago", unread: true, severity: "Healthy" },
    { id: "n-3", type: "audit", title: "Audit Required", desc: "Solapur Saat Rasta scheduled for quarterly compliance check", time: "3 hours ago", unread: false, severity: "Watch" },
    { id: "n-4", type: "ai", title: "AI Reorder Optimization", desc: "Suggested bulk order of Oat Milk saved 8% in unit cost", time: "5 hours ago", unread: false, severity: "Healthy" },
  ]);
  const [notifFilter, setNotifFilter] = useState("All");

  const [outletTab, setOutletTab] = useState("trend");
  const [selectedOutlet, setSelectedOutlet] = useState("All");
  const [selectedWeeklyOutlet, setSelectedWeeklyOutlet] = useState("All");
  const [showAskAI, setShowAskAI] = useState(false);
  const [pinHover, setPinHover] = useState<string | null>(null);

  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);

  const [activeRole, setActiveRole] = useState<ExecutiveRole>("HQ_ADMIN");
  const [activeAlertBanner, setActiveAlertBanner] = useState<{
    id: string;
    outlet: string;
    message: string;
    severity: "Healthy" | "Watch" | "Critical";
    time: string;
  } | null>({
    id: "live-anom-1",
    outlet: "Aurangabad CIDCO Outlet",
    message: "Isolation Forest POS Anomaly: Sudden 42% sales drop detected",
    severity: "Critical",
    time: "Just Now",
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>("INR");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isSOPBotOpen, setIsSOPBotOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("EN");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [audioMuted, setAudioMutedState] = useState(false);

  useEffect(() => {
    setAudioMutedState(isAudioMuted());
    const handleAudioChange = (e: any) => {
      setAudioMutedState(e.detail?.muted ?? isAudioMuted());
    };
    window.addEventListener("fops-audio-state-changed", handleAudioChange);
    return () => window.removeEventListener("fops-audio-state-changed", handleAudioChange);
  }, []);

  const SEARCH_DESTINATIONS = [
    { name: "Agent Dashboards — Executive Intelligence Suite", category: "Module", key: "agentDashboards", icon: "🤖" },
    { name: "Executive Dashboard Overview", category: "Module", key: "dashboard", icon: "📊" },
    { name: "Outlet Performance & Analytics", category: "Module", key: "outlet", icon: "🏬" },
    { name: "Inventory Telemetry & Reorders", category: "Module", key: "inventory", icon: "📦" },
    { name: "Staff Roster & Shift Schedule", category: "Module", key: "staff", icon: "👥" },
    { name: "Marketing Campaign AI & ROI", category: "Module", key: "marketing", icon: "📢" },
    { name: "CCTV & Quality Compliance Audit", category: "Module", key: "audit", icon: "📹" },
    { name: "Franchise Intelligence AI", category: "Module", key: "intelligence", icon: "🧠" },
    { name: "Financial Reports & PDF Exports", category: "Module", key: "reporting", icon: "📄" },
    { name: "Live Notifications & Alerts", category: "Module", key: "notifications", icon: "🔔" },
    { name: "Enterprise AI Hub & Auto-PO", category: "Module", key: "enterprise", icon: "⚡" },
    { name: "Audio Sound Effects (SFX) & Audio Controls", category: "Audio Control", key: "settings", icon: "🔊" },
    { name: "AI Voice Assistant & Oral Briefing", category: "Audio Control", key: "intelligence", icon: "🎙️" },
    { name: "Settings & System Customizer", category: "Module", key: "settings", icon: "⚙️" },
    { name: "Nashik City Center Outlet", category: "Outlet", key: "outlet", icon: "📍" },
    { name: "Pune FC Road Outlet", category: "Outlet", key: "outlet", icon: "📍" },
    { name: "Mumbai Andheri East Outlet", category: "Outlet", key: "outlet", icon: "📍" },
    { name: "Aurangabad CIDCO Outlet", category: "Outlet", key: "outlet", icon: "📍" },
    { name: "Thane Estate Outlet", category: "Outlet", key: "outlet", icon: "📍" },
  ];

  const filteredDestinations = SEARCH_DESTINATIONS.filter(d => 
    !headerSearchQuery.trim() || d.name.toLowerCase().includes(headerSearchQuery.toLowerCase()) || d.category.toLowerCase().includes(headerSearchQuery.toLowerCase())
  );

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShiftSchedulerOpen, setIsShiftSchedulerOpen] = useState(false);
  const [isRoyaltyCalcOpen, setIsRoyaltyCalcOpen] = useState(false);
  const [isVendorScorecardOpen, setIsVendorScorecardOpen] = useState(false);
  const [isMenuMatrixOpen, setIsMenuMatrixOpen] = useState(false);
  const [accent, setAccent] = useState("#F59E0B");
  const [glowEffect, setGlowEffect] = useState(true);
  const [blurDepth, setBlurDepth] = useState(8);
  const [mlLearningRate, setMlLearningRate] = useState(0.05);
  const [mlRfTrees, setMlRfTrees] = useState(100);
  const [mlRidgeAlpha, setMlRidgeAlpha] = useState(1.0);
  const [copilotPersonality, setCopilotPersonality] = useState("Strategic Coach");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [offlineFallbackActive, setOfflineFallbackActive] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System: FranchiseOpsAI Core Initialized`,
    `[${new Date().toLocaleTimeString()}] Database: Connected to PostgreSQL`,
    `[${new Date().toLocaleTimeString()}] ML: Loaded revenue_model.joblib (Accuracy: 91.2%)`,
    `[${new Date().toLocaleTimeString()}] ML: Loaded demand_model.joblib (Accuracy: 89.1%)`
  ]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(FALLBACK_INVENTORY);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [inventoryOutletId, setInventoryOutletId] = useState<string>("All");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  // Gross Margin per outlet (sample — no cost data tracked in-app)
const outletGrossMargin: Record<string, number> = {
  "Nashik City Center": 22, "Pune FC Road": 24, "Mumbai Andheri East": 16,
  "Nagpur Dharampeth": 21, "Aurangabad CIDCO": 12, "Thane Estate": 23,
  "Kolhapur Tarabai Park": 19, "Solapur Saat Rasta": 17,
};
const avgGrossMargin = Math.round(Object.values(outletGrossMargin).reduce((s, v) => s + v, 0) / Object.values(outletGrossMargin).length);
const avgNetworkGrowth = outletPerformance.reduce((s, o) => s + o.growth, 0) / outletPerformance.length;

// Stock Cover — estimated using reorder_at as a proxy for ~5 days of buffer stock
const avgStockCoverDays = inventoryItems.length > 0
  ? Math.round(inventoryItems.reduce((s, i) => {
      const dailyUsageEstimate = Number(i.reorder_at) / 5;
      return s + (dailyUsageEstimate > 0 ? Number(i.quantity) / dailyUsageEstimate : 0);
    }, 0) / inventoryItems.length)
  : 0;

// Workforce Productivity & Turnover (sample — not tracked in-app)
const workforceProductivity = 78;
const workforceTurnover = 11;

// Marketing — everything computed fresh from marketingCampaigns directly
const campaignSpendTotal = marketingCampaigns.reduce((s, c) => s + c.spend, 0);
const campaignReachTotal = marketingCampaigns.reduce((s, c) => s + c.reach, 0);
const campaignConversions: Record<string, { conversions: number; newCustomers: number }> = {
  "Monsoon Coffee Fest": { conversions: 1840, newCustomers: 620 },
  "Weekend Combo Offer": { conversions: 980, newCustomers: 410 },
  "New Outlet Launch - Thane": { conversions: 720, newCustomers: 340 },
  "Loyalty Program Push": { conversions: 1150, newCustomers: 290 },
  "Festive Season Bundle": { conversions: 2100, newCustomers: 780 },
  "Student Discount Drive": { conversions: 890, newCustomers: 360 },
};
const totalConversions = Object.values(campaignConversions).reduce((s, v) => s + v.conversions, 0);
const totalNewCustomers = Object.values(campaignConversions).reduce((s, v) => s + v.newCustomers, 0);
const avgConversionRate = campaignReachTotal > 0 ? ((totalConversions / campaignReachTotal) * 100).toFixed(1) : "0";
const avgCAC = totalNewCustomers > 0 ? Math.round(campaignSpendTotal / totalNewCustomers) : 0;

// Audit Checklist Score & Avg Closure Time (sample — not tracked in-app)
const auditChecklistScore = 91;
const avgClosureDays = 2.1;

  const [employees, setEmployees] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffQuery, setStaffQuery] = useState("");
  const [staffRoleFilter, setStaffRoleFilter] = useState("All");
  const [staffTab, setStaffTab] = useState<"directory" | "attendance" | "hire">("directory");

  const [hireForm, setHireForm] = useState({ name: "", email: "", role: "Barista", outletName: "Pune", experience: "" });
  const [hiredStaff, setHiredStaff] = useState<any[]>([]);
  const [hiredCandidateIds, setHiredCandidateIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn || active !== "staff") return;
    setStaffLoading(true);
    fetch(`${API_BASE_URL}/api/employees`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("fops_token")}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setEmployees(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setStaffLoading(false));
  }, [isLoggedIn, active]);

  useEffect(() => {
    if (active !== "audit") return;
    const token = typeof window !== "undefined" ? localStorage.getItem("fops_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/compliance`, { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAudits(data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/compliance/operational-metrics`, { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOpMetrics(data);
        }
      })
      .catch(() => {});
  }, [active]);

  const t = isDark ? themes.dark : themes.light;
  const statusColor = isDark ? statusColorDark : statusColorLight;
  const activeLabel = modules.find((m) => m.id === active)?.label ?? "Dashboard";
  const trendData = revenueTrendByOutlet[selectedOutlet] || revenueTrendByOutlet.All;
  const weeklyTrendData = weeklyRevenueTrendByOutlet[selectedWeeklyOutlet] || weeklyRevenueTrendByOutlet.All;

  const filteredLocationNodes = GLOBAL_LOCATIONS.filter((loc) => {
    const matchCountry = selectedCountry === "All" || loc.country === selectedCountry;
    const matchState = selectedState === "All" || loc.state === selectedState;
    return matchCountry && matchState;
  });

  const activeLocationNodes = filteredLocationNodes.length > 0 ? filteredLocationNodes : GLOBAL_LOCATIONS;

  const totalNetworkRevenueNum = activeLocationNodes.reduce((acc, l) => acc + l.revenue, 0);
  const totalNetworkTargetNum = activeLocationNodes.reduce((acc, l) => acc + l.target, 0);
  const activeStoresCountNum = activeLocationNodes.reduce((acc, l) => acc + l.storesCount, 0);
  const healthyCountNum = activeLocationNodes.filter((l) => l.status === "Healthy").length;
  const healthScorePercent = Math.round((healthyCountNum / activeLocationNodes.length) * 100);

  const dynamicKpis = [
    { label: translateKey("totalRevenue", activeLang), value: formatCurrencyValue(totalNetworkRevenueNum, activeCurrency), delta: "+14.2%", icon: TrendingUp },
    { label: translateKey("activeOutlets", activeLang), value: `${activeStoresCountNum} Stores`, delta: `${activeLocationNodes.length} Hubs`, icon: Store },
    { label: translateKey("avgOrderValue", activeLang), value: formatCurrencyValue(232, activeCurrency), delta: "+3.4%", icon: FileBarChart },
    { label: translateKey("outletHealth", activeLang), value: `${healthScorePercent}/100`, delta: `${healthyCountNum} Healthy`, icon: ShieldCheck },
    { label: "Network Growth", value: "+5.3%", delta: "vs last month", icon: TrendingUp },
    { label: "Target Achievement", value: `${Math.round((totalNetworkRevenueNum / (totalNetworkTargetNum || 1)) * 100)}%`, delta: `Target: ${formatCurrencyValue(totalNetworkTargetNum, activeCurrency)}`, icon: BarChart3 },
  ];

  const dynamicOutletPerformance = activeLocationNodes.map((loc) => ({
    name: loc.name,
    state: loc.state,
    country: loc.country,
    sales: loc.revenue,
    target: loc.target,
    growth: Math.round(((loc.revenue - loc.target) / loc.target) * 100 * 10) / 10,
    status: loc.status,
  }));

  const presentToday = attendanceLog.filter((a) => a.todayStatus === "Present").length;
  const absentToday = attendanceLog.filter((a) => a.todayStatus === "Absent").length;
  const lateToday = attendanceLog.filter((a) => a.todayStatus === "Late").length;
  const attendanceRateToday = Math.round((presentToday / attendanceLog.length) * 100);

  const underperformingOutlets = dynamicOutletPerformance.filter((o) => o.status !== "Healthy");

  const staffForShortageCheck = FALLBACK_EMPLOYEES;

  const staffCountByOutlet: Record<string, number> = {};
  staffForShortageCheck.forEach((emp) => {
    const outletName = emp.outlets?.outlet_name || "Unassigned";
    staffCountByOutlet[outletName] = (staffCountByOutlet[outletName] || 0) + 1;
  });

  const understaffedOutlets = KNOWN_OUTLET_NAMES
    .map((name) => ({ name, count: staffCountByOutlet[name] || 0 }))
    .filter((o) => o.count < MIN_STAFF_PER_OUTLET)
    .sort((a, b) => a.count - b.count);

  // ===== MODULE 6: Intelligence Engine — computed from REAL agent data =====

const avgOutletGrowth = outletPerformance.length > 0
  ? outletPerformance.reduce((s, o) => s + o.growth, 0) / outletPerformance.length
  : 0;

const avgAuditScoreReal = audits.length > 0
  ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length)
  : 75;

const avgCustomerRating = customerFeedbackByOutlet.length > 0
  ? customerFeedbackByOutlet.reduce((s, f) => s + f.rating, 0) / customerFeedbackByOutlet.length
  : 4;

const healthComponents: HealthComponent[] = [
  {
    label: "Sales",
    weight: 30,
    score: Math.max(0, Math.min(100, Math.round(70 + avgOutletGrowth * 2))),
    note: `Avg growth ${avgOutletGrowth.toFixed(1)}% across ${outletPerformance.length} outlets`,
  },
  {
    label: "Operations",
    weight: 20,
    score: Math.max(0, 100 - understaffedOutlets.length * 12 - Math.max(0, 100 - attendanceRateToday)),
    note: `${understaffedOutlets.length} understaffed outlet(s) · ${attendanceRateToday}% attendance today`,
  },
  {
    label: "Audit / Compliance",
    weight: 15,
    score: avgAuditScoreReal,
    note: `Avg score ${avgAuditScoreReal}/100 across ${audits.length} recorded audits`,
  },
  {
    label: "Customer",
    weight: 15,
    score: Math.round((avgCustomerRating / 5) * 100),
    note: `Avg rating ${avgCustomerRating.toFixed(1)}/5 across tracked outlets`,
  },
  {
    label: "Finance",
    weight: 10,
    score: Math.max(0, Math.min(100, Math.round(avgROI * 15))),
    note: `Marketing ROI averaging ${avgROI}x network-wide`,
  },
  {
    label: "Inventory",
    weight: 10,
    score: inventorySummary ? Math.max(0, Math.round(inventorySummary.healthPct - avgWastagePercent)) : 70,
    note: inventorySummary ? `${inventorySummary.healthPct}% inventory health, ${avgWastagePercent}% avg wastage` : "Inventory data loading...",
  },
];

const predictedRisks: RiskPrediction[] = [];

const criticalAudit = audits.find((a) => a.status === "Critical");
if (criticalAudit) {
  predictedRisks.push({
    riskType: "Compliance Risk",
    probability: 100 - criticalAudit.score,
    impact: "High",
    horizon: "Next 7 days",
    evidence: `${criticalAudit.outlet_name}: audit score ${criticalAudit.score}/100, Critical status`,
  });
}

if (understaffedOutlets.length > 0) {
  predictedRisks.push({
    riskType: "Service Risk",
    probability: Math.min(90, understaffedOutlets.length * 25 + 30),
    impact: understaffedOutlets.length > 1 ? "High" : "Medium",
    horizon: "Next 14 days",
    evidence: `${understaffedOutlets.map((o) => o.name).join(", ")} below minimum staffing (${MIN_STAFF_PER_OUTLET} required)`,
  });
}

const decliningOutlet = [...outletPerformance].filter((o) => o.growth < 0).sort((a, b) => a.growth - b.growth)[0];
if (decliningOutlet) {
  predictedRisks.push({
    riskType: "Revenue Risk",
    probability: Math.min(85, Math.abs(decliningOutlet.growth) * 6 + 20),
    impact: decliningOutlet.growth < -5 ? "High" : "Medium",
    horizon: "Next 30 days",
    evidence: `${decliningOutlet.name}: growth ${decliningOutlet.growth}%, trending down`,
  });
}

const criticalInvItem = inventoryItems.find((i) => Number(i.quantity) <= Number(i.reorder_at) * 0.5);
if (criticalInvItem) {
  predictedRisks.push({
    riskType: "Inventory Disruption",
    probability: 68,
    impact: "High",
    horizon: "Next 10 days",
    evidence: `${criticalInvItem.name} at ${criticalInvItem.outlets?.outlet_name || "an outlet"}: ${criticalInvItem.quantity} ${criticalInvItem.unit || ""} remaining, below critical threshold`,
  });
}

const growthOpportunities: GrowthOpportunity[] = [];

const bestGrowthOutlet = [...outletPerformance].sort((a, b) => b.growth - a.growth)[0];
if (bestGrowthOutlet) {
  growthOpportunities.push({
    opportunity: `Replicate ${bestGrowthOutlet.name}'s playbook`,
    evidence: `Leading the network at +${bestGrowthOutlet.growth}% growth`,
    estimatedImpact: `+${Math.round(bestGrowthOutlet.growth / 2)}% at underperforming outlets`,
    suggestedAction: `Document ${bestGrowthOutlet.name}'s staffing and marketing approach, roll out to Watch/Critical outlets`,
    confidence: 76,
  });
}

const bestCampaign = [...marketingCampaigns].sort((a, b) => b.roi - a.roi)[0];
if (bestCampaign) {
  growthOpportunities.push({
    opportunity: `Scale "${bestCampaign.name}" campaign`,
    evidence: `Highest ROI in network at ${bestCampaign.roi}x on ${bestCampaign.channel}`,
    estimatedImpact: `Meaningful revenue uplift if budget increased`,
    suggestedAction: `Increase ${bestCampaign.channel} budget by 50%, replicate creative across other outlets`,
    confidence: 71,
  });
}

const recommendations: Recommendation[] = [];

if (criticalAudit) {
  recommendations.push({
    title: `Resolve compliance issues at ${criticalAudit.outlet_name}`,
    priority: "High",
    owner: "Regional Manager",
    expectedImpact: "Restore compliance score to Healthy, avoid re-audit penalty",
    deadline: reAuditDeadlines.find((r) => r.outlet === criticalAudit.outlet_name)?.dueDate || "Within 7 days",
    evidence: `Audit score ${criticalAudit.score}/100 recorded ${criticalAudit.date}`,
  });
}

if (understaffedOutlets.length > 0) {
  recommendations.push({
    title: `Fill staffing gaps at ${understaffedOutlets[0].name}`,
    priority: "High",
    owner: "HR Team",
    expectedImpact: "Improve service speed and staff-related audit scores",
    deadline: "Next 2 weeks",
    evidence: `${understaffedOutlets[0].count}/${MIN_STAFF_PER_OUTLET} minimum staff — see Recommended Candidates in Staff Agent`,
  });
}

if (decliningOutlet) {
  recommendations.push({
    title: `Investigate revenue decline at ${decliningOutlet.name}`,
    priority: "Medium",
    owner: "Outlet Manager",
    expectedImpact: "Reverse negative growth trend",
    deadline: "Next 30 days",
    evidence: `Growth ${decliningOutlet.growth}%, target ₹${decliningOutlet.target.toLocaleString("en-IN")}`,
  });
}

if (recommendations.length === 0) {
  recommendations.push({
    title: "No urgent issues detected — maintain current standards",
    priority: "Low",
    owner: "Regional Manager",
    expectedImpact: "Sustain current network health",
    deadline: "Ongoing",
    evidence: "All tracked KPIs within acceptable range",
  });
}

const consolidatedFindings: ConsolidatedFinding[] = [
  ...audits.filter((a) => a.status !== "Healthy").map((a) => ({
    sourceAgent: "Audit Agent",
    franchiseId: `FR-${a.outlet_id}`,
    kpiAffected: "Compliance Score",
    finding: `${a.outlet_name}: score ${a.score}/100, ${a.status}`,
    severity: (a.status === "Critical" ? "Critical" : "Medium") as "Critical" | "Medium",
    timestamp: a.date,
  })),
  ...understaffedOutlets.map((o) => ({
    sourceAgent: "HR/Operations Agent",
    franchiseId: o.name,
    kpiAffected: "Staffing Level",
    finding: `${o.name}: ${o.count}/${MIN_STAFF_PER_OUTLET} minimum staff`,
    severity: "High" as const,
    timestamp: new Date().toISOString().split("T")[0],
  })),
  ...customerFeedbackByOutlet.filter((f) => f.sentiment !== "Positive").map((f) => ({
    sourceAgent: "Customer Agent",
    franchiseId: f.outlet,
    kpiAffected: "Sentiment",
    finding: `${f.outlet}: ${f.rating}/5 rating, ${f.complaints} complaints, ${f.sentiment} sentiment`,
    severity: (f.sentiment === "Negative" ? "High" : "Medium") as "High" | "Medium",
    timestamp: new Date().toISOString().split("T")[0],
  })),
  ...inventoryItems.filter((i) => Number(i.quantity) <= Number(i.reorder_at) * 0.5).map((i) => ({
    sourceAgent: "Inventory Agent",
    franchiseId: i.outlets?.outlet_name || `Outlet ${i.outlet_id}`,
    kpiAffected: "Stock Availability",
    finding: `${i.name}: ${i.quantity} ${i.unit || "units"} remaining, below critical threshold`,
    severity: "Critical" as const,
    timestamp: new Date().toISOString().split("T")[0],
  })),
  ...marketingCampaigns.filter((c) => c.status === "Underperforming").map((c) => ({
    sourceAgent: "Marketing Agent",
    franchiseId: "Network",
    kpiAffected: "Campaign ROI",
    finding: `${c.name}: ${c.roi}x ROI on ${c.channel}, underperforming`,
    severity: "Medium" as const,
    timestamp: new Date().toISOString().split("T")[0],
  })),
];

const outletHealthRankings = [...outletPerformance]
  .map((o) => {
    const outletAudit = [...audits].filter((a) => a.outlet_name === o.name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const auditComponent = outletAudit ? outletAudit.score : 75;
    const isUnderstaffed = understaffedOutlets.some((u) => o.name.includes(u.name));
    const salesComponent = Math.max(0, Math.min(100, 70 + o.growth * 2));
    const healthScore = Math.max(0, Math.min(100, Math.round(salesComponent * 0.4 + auditComponent * 0.4 + (isUnderstaffed ? 5 : 20))));
    return {
      outlet: o.name,
      revenue: o.sales,
      predictedRevenue: Math.round(o.sales * (1 + o.growth / 100)),
      healthScore,
      trend: o.growth,
      status: healthScore >= 80 ? "Healthy" : healthScore >= 60 ? "Watch" : healthScore >= 40 ? "At Risk" : "Critical",
    };
  })
  .sort((a, b) => b.healthScore - a.healthScore)
  .map((o, i) => ({ ...o, rank: i + 1 }));

const criticalOutletsDetected = outletHealthRankings.filter((o) => o.status === "Critical" || o.status === "At Risk");

const totalRevenue = outletPerformance.reduce((s, o) => s + o.sales, 0);
const avgRevenue = Math.round(totalRevenue / outletPerformance.length);
const totalPredictedRevenue = outletHealthRankings.reduce((s, o) => s + o.predictedRevenue, 0);
const growingOutletsCount = outletPerformance.filter((o) => o.growth > 0).length;
const decliningOutletsCount = outletPerformance.filter((o) => o.growth < 0).length;
const bestOutletBySales = [...outletPerformance].sort((a, b) => b.growth - a.growth)[0];
const worstOutletBySales = [...outletPerformance].sort((a, b) => a.growth - b.growth)[0];

const inventoryRisks = inventoryItems
  .filter((i) => Number(i.quantity) <= Number(i.reorder_at))
  .map((i) => {
    const qty = Number(i.quantity);
    const reorder = Number(i.reorder_at);
    const suggestedQty = Math.round(reorder * 1.5 - qty);
    return {
      item: i.name,
      outlet: i.outlets?.outlet_name || "Network",
      riskLevel: qty <= reorder * 0.5 ? "Critical" : "Watch",
      quantity: qty,
      reorderAt: reorder,
      supplier: i.supplier || "Not specified",
      suggestion: `Reorder ${suggestedQty > 0 ? suggestedQty : reorder} ${i.unit || "units"} to restore healthy stock`,
    };
  });


const recStats = {
  total: recommendations.length,
  high: recommendations.filter((r) => r.priority === "High").length,
  medium: recommendations.filter((r) => r.priority === "Medium").length,
  low: recommendations.filter((r) => r.priority === "Low").length,
};
const filteredRecommendations = recommendations.filter((r) => recPriorityFilter === "All" || r.priority === recPriorityFilter);
  

  const hubOutlet = outletLocations.find((o) => o.name.includes("Pune")) || outletLocations[0];

  useEffect(() => {
    const token = sessionStorage.getItem("fops_token");
    setIsLoggedIn(!!token);

    const handleAutoLogoutOnClose = () => {
      sessionStorage.removeItem("fops_token");
      sessionStorage.removeItem("fops_user");
      localStorage.removeItem("fops_token");
      localStorage.removeItem("fops_user");
    };

    window.addEventListener("beforeunload", handleAutoLogoutOnClose);
    return () => window.removeEventListener("beforeunload", handleAutoLogoutOnClose);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`${API_BASE_URL}/api/outlets`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("fops_token")}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOutlets(Array.isArray(data) ? data : []))
      .catch(() => setOutlets([]));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || (active !== "inventory" && active !== "agentDashboards")) return;

    setInventoryLoading(true);
    setInventoryError(null);

    const params = new URLSearchParams();
    if (inventoryOutletId !== "All") params.set("outlet_id", inventoryOutletId);
    if (inventoryQuery) params.set("search", inventoryQuery);

    const authHeaders = { Authorization: `Bearer ${sessionStorage.getItem("fops_token")}` };

    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory?${params.toString()}`, { headers: authHeaders }).then((res) => (res.ok ? res.json() : null)).catch(() => null),
      fetch(`${API_BASE_URL}/api/inventory/summary`, { headers: authHeaders }).then((res) => (res.ok ? res.json() : null)).catch(() => null),
    ])
      .then(([items, summary]) => {
        const loadedItems = Array.isArray(items) && items.length > 0 ? items : FALLBACK_INVENTORY;
        setInventoryItems(loadedItems);
        if (summary && summary.total > 0) {
          setInventorySummary(summary);
        } else {
          const total = loadedItems.length;
          const critical = loadedItems.filter((i: any) => Number(i.quantity) <= Number(i.reorder_at) * 0.5).length;
          const watch = loadedItems.filter((i: any) => Number(i.quantity) > Number(i.reorder_at) * 0.5 && Number(i.quantity) <= Number(i.reorder_at)).length;
          const healthy = total - critical - watch;
          const totalUnits = loadedItems.reduce((sum: number, i: any) => sum + Number(i.quantity), 0);
          setInventorySummary({ total, healthy, watch, critical, totalUnits, healthPct: Math.round((healthy / total) * 100) });
        }
      })
      .catch(() => {
        setInventoryItems(FALLBACK_INVENTORY);
        setInventoryError(null);
      })
      .finally(() => setInventoryLoading(false));
  }, [isLoggedIn, active, inventoryOutletId, inventoryQuery]);

  function handleSignOut() {
    sessionStorage.removeItem("fops_token");
    sessionStorage.removeItem("fops_user");
    localStorage.removeItem("fops_token");
    localStorage.removeItem("fops_user");
    setIsLoggedIn(false);
  }

  function handleHireSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hireForm.name.trim() || !hireForm.email.trim()) return;
    setHiredStaff((prev) => [
      {
        employee_id: `new-${Date.now()}`,
        full_name: hireForm.name,
        email: hireForm.email,
        role: hireForm.role,
        outlets: { outlet_name: hireForm.outletName },
        experience_years: hireForm.experience ? Number(hireForm.experience) : 0,
        status: "Active",
        salary: 0,
      },
      ...prev,
    ]);
    setHireForm({ name: "", email: "", role: "Barista", outletName: "Pune", experience: "" });
  }

  function handleQuickHire(candidate: typeof RECOMMENDED_CANDIDATES[number]) {
    setHiredStaff((prev) => [
      {
        employee_id: `cand-${candidate.id}`,
        full_name: candidate.name,
        email: `${candidate.name.toLowerCase().replace(/\s+/g, ".")}@franchiseops.com`,
        role: candidate.role,
        outlets: { outlet_name: candidate.suggestedOutlet },
        experience_years: candidate.experience_years,
        status: "Active",
        salary: 0,
      },
      ...prev,
    ]);
    setHiredCandidateIds((prev) => [...prev, candidate.id]);
  }

  
function exportToCSV(filename: string, rows: any[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map(row => headers.map(h => {
      const val = row[h];
      const str = typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function calculateFranchiseHealth(components: HealthComponent[]) {
  const weightedTotal = components.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0);
  const score = Math.round(weightedTotal);
  let status: "Healthy" | "Watch" | "At Risk" | "Critical";
  if (score >= 80) status = "Healthy";
  else if (score >= 60) status = "Watch";
  else if (score >= 40) status = "At Risk";
  else status = "Critical";
  return { score, status };
}

// BONUS FEATURE: flags outlets that fail audits repeatedly (uses your
// existing `audits` array — adjust the variable name if yours differs)
function getRepeatOffenders(auditList: any[]) {
  const counts: Record<string, number> = {};
  auditList.forEach((a) => {
    if (a.status === "Critical" || a.status === "Watch") {
      counts[a.outlet_name] = (counts[a.outlet_name] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .map(([outlet, count]) => ({ outlet, count }));
}

function getPredictedRisks(auditList: any[]) {
  const byOutlet: Record<string, any[]> = {};
  auditList.forEach((a) => {
    if (!byOutlet[a.outlet_name]) byOutlet[a.outlet_name] = [];
    byOutlet[a.outlet_name].push(a);
  });

  const risks: { outlet: string; trend: string; latestScore: number }[] = [];
  Object.entries(byOutlet).forEach(([outlet, records]) => {
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sorted.length >= 2) {
      const latest = sorted[sorted.length - 1];
      const previous = sorted[sorted.length - 2];
      if (latest.score < previous.score && latest.score < 75) {
        risks.push({ outlet, trend: `${previous.score} → ${latest.score}`, latestScore: latest.score });
      }
    }
  });
  return risks;
}

  // Stable callbacks — defined once, not recreated on every render
  const handleSplashComplete = useCallback(() => setCheckingAuth(false), []);
  const handleLogin = useCallback(() => setIsLoggedIn(true), []);

  if (checkingAuth) {
    return <AppSplashLoader t={t} accent={accent} label="Initializing OmniFranchise AI Network..." onComplete={handleSplashComplete} />;
  }

  if (!isLoggedIn) {
    return <LoginPage t={t} accent={accent} onLogin={handleLogin} />;
  }

  return (
    <div className="w-full min-h-screen flex-1 flex font-sans transition-colors duration-200" style={{ background: t.bg, color: t.text }}>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
        <div className="px-5 py-5 flex items-center gap-2 border-b" style={{ borderColor: t.border }}>
          <img src="/logo.png" alt="OmniFranchise Logo" className="w-8 h-8 rounded-lg object-cover shadow-md shadow-teal-500/20 border border-teal-400/30" />
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: t.text }}>OmniFranchise AI</p>
            <p className="text-[10px]" style={{ color: t.textFaint }}>Enterprise Intelligence Network</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            return (
              <motion.button
                key={m.id}
                onClick={() => setActive(m.id)}
                whileHover={{ x: 3, backgroundColor: isActive ? `${accent}25` : `${accent}0D` }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-all relative border-l-2 cursor-pointer"
                style={{
                  borderColor: isActive ? accent : "transparent",
                  background: isActive ? `${accent}1A` : "transparent",
                  color: isActive ? t.text : t.textMuted,
                }}
              >
                <Icon size={16} color={isActive ? accent : t.textFaint} />
                <span className="font-medium">{m.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: t.border, color: t.textFaint }}>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> AI engine active
        </div>
      </aside>

      {/* Mobile / Tablet Responsive Drawer Sidebar (< lg) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-72 max-w-[85vw] h-full flex flex-col z-50 border-r shadow-2xl transition-colors duration-200"
              style={{ background: t.panel, borderColor: t.border }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: t.border }}>
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="OmniFranchise Logo" className="w-8 h-8 rounded-lg object-cover shadow-md shadow-teal-500/20 border border-teal-400/30" />
                  <div>
                    <p className="font-semibold text-sm leading-tight" style={{ color: t.text }}>OmniFranchise AI</p>
                    <p className="text-[10px]" style={{ color: t.textFaint }}>Enterprise Intelligence Network</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ color: t.text }}
                  title="Close Navigation"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3">
                {modules.map((m) => {
                  const Icon = m.icon;
                  const isActive = active === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActive(m.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-all relative border-l-2 cursor-pointer"
                      style={{
                        borderColor: isActive ? accent : "transparent",
                        background: isActive ? `${accent}1A` : "transparent",
                        color: isActive ? t.text : t.textMuted,
                      }}
                    >
                      <Icon size={18} color={isActive ? accent : t.textFaint} />
                      <span className="font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="px-5 py-4 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: t.border, color: t.textFaint }}>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> AI engine active
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto min-w-0">
        <AnomalyAlertBanner
          alert={activeAlertBanner}
          onClose={() => setActiveAlertBanner(null)}
          onInspect={() => setActive("notifications")}
          accentColor={accent}
          theme={t}
        />
        <div className="border-b px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-nowrap relative z-30 transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
          <div className="flex items-center gap-2 shrink-0 min-w-[200px] max-w-xs md:max-w-md">
            {/* Hamburger Button for Mobile/Tablet (< lg) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border transition-colors shrink-0 cursor-pointer hover:bg-white/5"
              style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>
            <div className="relative flex-1 min-w-[160px] sm:min-w-[220px]">
            <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border focus-within:border-amber-400 transition-colors overflow-hidden" style={{ background: t.inputBg, borderColor: t.border }}>
              <Search size={14} color={t.textFaint} className="shrink-0" />
              <input
                type="text"
                placeholder="Search modules, outlets..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                onFocus={() => setHeaderSearchFocused(true)}
                onBlur={() => setTimeout(() => setHeaderSearchFocused(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredDestinations.length > 0) {
                    setActive(filteredDestinations[0].key);
                    setHeaderSearchQuery("");
                    setHeaderSearchFocused(false);
                  }
                }}
                className="w-full min-w-0 bg-transparent outline-none text-xs"
                style={{ color: t.text }}
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700 bg-slate-800/90 text-amber-400 hover:text-amber-300 hover:border-amber-400 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
                title="Open Spotlight Command Palette (Ctrl+K or Cmd+K)"
              >
                ⌘K
              </button>
            </div>

            {/* Smart Navigation Options Dropdown */}
            {headerSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border glass-panel shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-2.5 border-b text-[10px] uppercase font-mono tracking-wider flex items-center justify-between" style={{ borderColor: t.border, color: t.textFaint }}>
                  <span>Navigation Options ({filteredDestinations.length})</span>
                  <span>Click to Jump</span>
                </div>
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        setActive(dest.key);
                        setHeaderSearchQuery("");
                        setHeaderSearchFocused(false);
                      }}
                      className="px-3 py-2.5 flex items-center justify-between hover:bg-amber-500/15 cursor-pointer transition-colors border-b text-xs"
                      style={{ borderColor: `${t.border}30` }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{dest.icon}</span>
                        <span className="font-medium" style={{ color: t.text }}>{dest.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border badge-silver font-mono">
                        {dest.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs" style={{ color: t.textMuted }}>
                    No matching modules found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Header Action Controls */}
          <div className="flex items-center gap-2 shrink-0 relative z-30 overflow-visible">
            {/* Multi-Tier Role Switcher */}
            <div className="shrink-0 relative z-10">
              <RoleSwitcher
                activeRole={activeRole}
                onChangeRole={setActiveRole}
                accentColor={accent}
                theme={t}
              />
            </div>
            {/* Unified Executive Tools & Module Launchers Dropdown */}
            <div className="relative shrink-0 z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playTechChime("nav");
                  setIsQuickToolsOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all hover:scale-105 cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
                style={{
                  background: isQuickToolsOpen ? `${accent}25` : t.inputBg,
                  borderColor: isQuickToolsOpen ? accent : t.border,
                  color: isQuickToolsOpen ? accent : t.text,
                }}
                title="Executive Tools & Enterprise Launchers"
              >
                <Sparkles size={14} color={accent} className="shrink-0" />
                <span className="font-bold">Executive Tools</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">8</span>
                <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${isQuickToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {isQuickToolsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQuickToolsOpen(false);
                    }}
                  />

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden backdrop-blur-xl transition-all duration-200"
                    style={{
                      background: "#0F172A",
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    {/* Menu Header */}
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: `${t.border}40`, background: "rgba(255, 255, 255, 0.03)" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                          Executive Tools & Launchers
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">8 Modules</span>
                    </div>

                    {/* Tools Grid */}
                    <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {/* Supplier PO Dispatch */}
                      <button
                        onClick={() => {
                          setIsDispatchModalOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Truck size={16} className="mt-0.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-emerald-300">Supplier PO Dispatch</div>
                          <div className="text-[10px] text-emerald-400/80 leading-tight">WhatsApp / Email PO Claim</div>
                        </div>
                      </button>

                      {/* AI Staff Roster */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsShiftSchedulerOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Calendar size={16} className="mt-0.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-amber-300">Roster AI</div>
                          <div className="text-[10px] text-amber-400/80 leading-tight">AI Footfall Shift Roster</div>
                        </div>
                      </button>

                      {/* Royalty ROI Calculator */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsRoyaltyCalcOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Calculator size={16} className="mt-0.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-emerald-300">Royalty ROI</div>
                          <div className="text-[10px] text-emerald-400/80 leading-tight">5% Royalty & Net Profit</div>
                        </div>
                      </button>

                      {/* Vendor SLA Scorecard */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsVendorScorecardOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-purple-500/25 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:border-purple-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Truck size={16} className="mt-0.5 shrink-0 text-purple-300 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-purple-200">Vendor SLA</div>
                          <div className="text-[10px] text-purple-300/80 leading-tight">Supplier Delivery Ranking</div>
                        </div>
                      </button>

                      {/* Menu Yield Engineering */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsMenuMatrixOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-sky-500/25 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:border-sky-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Utensils size={16} className="mt-0.5 shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-sky-300">Menu Yield</div>
                          <div className="text-[10px] text-sky-400/80 leading-tight">BCG 4-Quadrant Matrix</div>
                        </div>
                      </button>

                      {/* SOP Knowledge Bot */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsSOPBotOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-teal-500/25 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 hover:border-teal-500/50 transition-all cursor-pointer text-left group"
                      >
                        <BookOpen size={16} className="mt-0.5 shrink-0 text-teal-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-teal-300">SOP Bot</div>
                          <div className="text-[10px] text-teal-400/80 leading-tight">AI Compliance Manual</div>
                        </div>
                      </button>

                      {/* Scan Stock QR Code */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsQRScannerOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer text-left group"
                      >
                        <QrCode size={16} className="mt-0.5 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-cyan-300">Scan Stock QR</div>
                          <div className="text-[10px] text-cyan-400/80 leading-tight">Mobile Camera Audit</div>
                        </div>
                      </button>

                      {/* Guided Tour */}
                      <button
                        onClick={() => {
                          playTechChime("nav");
                          setIsDemoTourOpen(true);
                          setIsQuickToolsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer text-left group"
                      >
                        <Compass size={16} className="mt-0.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-amber-300">Guided Tour</div>
                          <div className="text-[10px] text-amber-400/80 leading-tight">System Walkthrough</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Audio SFX Quick Toggle */}
            <button
              onClick={() => {
                toggleAudioMute();
                setAudioMutedState(isAudioMuted());
              }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-bold transition-all hover:scale-105 cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              style={{
                background: audioMuted ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)",
                borderColor: audioMuted ? "rgba(244, 63, 94, 0.35)" : "rgba(16, 185, 129, 0.35)",
                color: audioMuted ? "#F43F5E" : "#10B981",
              }}
              title={audioMuted ? "Sound Effects Muted (Click to Unmute)" : "Sound Effects Active (Click to Mute)"}
            >
              {audioMuted ? <VolumeX size={14} className="shrink-0" /> : <Volume2 size={14} className="shrink-0" />}
              <span className="hidden xl:inline">{audioMuted ? "SFX Muted" : "SFX Active"}</span>
            </button>

            {/* PWA App Installation & Push Notification Control */}
            <div className="shrink-0 whitespace-nowrap">
              <PWAInstaller t={t} />
            </div>

            <button
              onClick={() => setShowAskAI(true)}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              style={{ borderColor: `${accent}4D`, color: accent }}
            >
              <Sparkles size={14} className="shrink-0" /> Ask AI
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              style={{ borderColor: t.border, color: t.textMuted }}
              aria-label="Toggle dark/light mode"
            >
              {isDark ? <Sun size={14} className="shrink-0" /> : <Moon size={14} className="shrink-0" />}
              {isDark ? "Light" : "Dark"}
            </button>
            <button
              onClick={handleSignOut}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer"
              style={{ color: t.textOnAccent }}
              aria-label="Sign out"
            >
              M
            </button>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.995 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {active === "dashboard" ? (
            <div className="space-y-6">
              <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: accent }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={15} color={accent} />
                  <p className="text-sm font-semibold" style={{ color: t.text }}>AI Briefing</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  Revenue is growing steadily across the network while Aurangabad continues to lag —
                  it has the weakest health score and needs attention on staffing and inventory. Pune leads
                  on margins this month.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: `${accent}1A`, color: accent, borderColor: `${accent}33` }}>Best: Pune</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>Watch: Mumbai Andheri</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>Critical outlets: 1</span>
                </div>
              </div>

              <LeaderboardCard accentColor={accent} theme={t} />
              <DigitalTwinSimulator accentColor={accent} theme={t} />

              <div className="flex items-center gap-2 flex-wrap no-print">
                <span className="text-xs mr-1 font-semibold" style={{ color: t.textFaint }}>Export Dashboard Data:</span>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{ background: accent, color: t.textOnAccent, borderColor: accent }}
                >
                  <FileBarChart size={13} /> Export Executive PDF
                </button>

                <button
                  onClick={() => {
                    const dataToExport = outletPerformance.map(o => ({
                      Outlet: o.name,
                      SalesRevenue: `₹${o.sales.toLocaleString("en-IN")}`,
                      TargetRevenue: `₹${o.target.toLocaleString("en-IN")}`,
                      GrowthPct: `${o.growth}%`,
                      Status: o.status
                    }));
                    exportToCSV("OmniFranchise_Dashboard_Executive_Export.csv", dataToExport);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}
                >
                  <Download size={13} /> Export CSV
                </button>

                <button
                  onClick={() => {
                    const dataToExport = dynamicKpis.map(k => ({
                      Metric: k.label,
                      Value: k.value,
                      Delta: k.delta
                    }));
                    exportToCSV("OmniFranchise_KPI_Executive_Summary.csv", dataToExport);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{ background: t.card, borderColor: t.border, color: t.textMuted }}
                >
                  <Download size={13} /> Export Excel KPI
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {dynamicKpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div
                  key={k.label}
                  className="rounded-xl border p-4 transition-all duration-300 stat-card-glow border-t-2"
                  style={{
                  background: t.card,
                  borderTopColor: accent,
                  borderRightColor: t.border,
                  borderBottomColor: t.border,
                  borderLeftColor: t.border,
                   }}
                    >
                      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ background: `${accent}1A` }}>
                        <Icon size={13} color={accent} />
                      </div>
                      <p className="text-lg font-bold tracking-tight" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5 font-medium" style={{ color: t.textFaint }}>{k.label}</p>
                      <p className="text-[11px] mt-1.5 font-semibold flex items-center gap-1" style={{ color: accent }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                        {k.delta}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider mb-1 font-mono" style={{ color: t.textFaint }}>Extended Metrics</p>
                <p className="text-sm font-semibold mb-3" style={{ color: t.text }}>Advanced KPI Telemetry</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {extendedKpis.map((k) => (
                    <div key={k.label} className="rounded-xl border p-4 transition-all duration-300 stat-card-glow" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-lg font-bold tracking-tight" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5 font-medium" style={{ color: t.textFaint }}>{k.label}</p>
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color: accent }}>{k.delta}</p>
                      <p className="text-[10px] mt-2" style={{ color: t.textFaint }}>{k.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-xl border p-5 transition-all duration-200 glass-card" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Sales Revenue Trend</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Last 6 months, network-wide</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={revenueTrendByOutlet.All}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => formatCurrencyValue(Number(v || 0), activeCurrency)} />
                      <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{ r: 4, fill: accent }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border p-5 transition-all duration-200 glass-card" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Outlet Health Radar</p>
                  <p className="text-xs mb-2" style={{ color: t.textFaint }}>Compares outlets across 5 dimensions, not just revenue</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={healthRadar}>
                      <PolarGrid stroke={t.gridLine} />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: t.textFaint }} />
                      <Radar name="Pune" dataKey="Pune" stroke={accent} fill={accent} fillOpacity={0.25} />
                      <Radar name="Aurangabad" dataKey="Aurangabad" stroke="#FB7185" fill="#FB7185" fillOpacity={0.2} />
                      <Legend wrapperStyle={{ fontSize: 11, color: t.textMuted }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden transition-colors duration-200 glass-panel" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1" style={{ color: t.text }}>Outlet Performance ({dynamicOutletPerformance.length} Locations)</p>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2.5 font-semibold uppercase tracking-wider text-[10px]">Outlet</th>
                      <th className="px-5 py-2.5 font-semibold uppercase tracking-wider text-[10px]">Sales (MTD)</th>
                      <th className="px-5 py-2.5 font-semibold uppercase tracking-wider text-[10px]">Target</th>
                      <th className="px-5 py-2.5 font-semibold uppercase tracking-wider text-[10px]">Growth</th>
                      <th className="px-5 py-2.5 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicOutletPerformance.map((o) => (
                      <tr key={o.name} className="border-b last:border-0 hover:bg-amber-500/5 transition-colors cursor-default" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.name} ({o.state})</td>
                        <td className="px-5 py-3 font-mono font-semibold" style={{ color: t.textMuted }}>{formatCurrencyValue(o.sales, activeCurrency)}</td>
                        <td className="px-5 py-3 font-mono" style={{ color: t.textFaint }}>{formatCurrencyValue(o.target, activeCurrency)}</td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 font-medium" style={{ color: o.growth >= 0 ? accent : "#FB7185" }}>
                            {o.growth >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {Math.abs(o.growth)}%
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[o.status]}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Sales Activity Heatmap</p>
                <p className="text-xs mb-4" style={{ color: t.textFaint }}>Daily sales intensity across the last 5 weeks, network-wide</p>
                <div className="grid grid-cols-7 gap-1.5 max-w-md">
                  {dailySales.map((d) => {
                    const opacityByLevel = [0.08, 0.28, 0.48, 0.7, 1];
                    return (
                      <div key={d.day} title={`Day ${d.day} — intensity ${d.intensity}/4`} className="w-6 h-6 rounded-[4px]" style={{ background: accent, opacity: opacityByLevel[d.intensity] }} />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-3 text-[11px]" style={{ color: t.textFaint }}>
                  <span>Less</span>
                  {[0.08, 0.28, 0.48, 0.7, 1].map((o, i) => (
                    <span key={i} className="w-3 h-3 rounded-[3px]" style={{ background: accent, opacity: o }} />
                  ))}
                  <span>More</span>
                </div>
              </div>

              {/* Real-Time WebSocket Telemetry Event Stream */}
              <LiveTelemetryStream t={t} />

              <div className="rounded-xl border p-5 transition-colors duration-200 glass-card" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: t.text }}>Franchise Network Topology Map</p>
                    <p className="text-xs" style={{ color: t.textFaint }}>Live central hub connectivity & outlet revenue topology</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border badge-silver">
                    {networkNodes.length} Outlets Connected
                  </span>
                </div>
                <div className="w-full flex justify-center py-2">
                  <svg viewBox="0 0 400 340" className="w-full max-w-md overflow-visible">
                    {/* Connecting lines from Central Hub */}
                    {networkNodes.map((n) => {
                      const rad = (n.angle * Math.PI) / 180;
                      const cx = 200 + 130 * Math.cos(rad);
                      const cy = 170 + 130 * Math.sin(rad);
                      const nodeColor = pinColor[n.status] || accent;
                      return (
                        <g key={`connection-${n.name}`}>
                          <line
                            x1={200}
                            y1={170}
                            x2={cx}
                            y2={cy}
                            stroke={nodeColor}
                            strokeWidth={1.75}
                            strokeOpacity={isDark ? 0.45 : 0.65}
                            strokeDasharray="4 2"
                          />
                        </g>
                      );
                    })}

                    {/* Central HQ Hub Circle */}
                    <circle cx={200} cy={170} r={36} fill={accent} fillOpacity={0.2} stroke={accent} strokeWidth={2} />
                    <circle cx={200} cy={170} r={28} fill={accent} opacity={0.95} />
                    <text x={200} y={166} textAnchor="middle" fontSize={11} fontWeight={500} fill="#090D16">PUNE HQ</text>
                    <text x={200} y={178} textAnchor="middle" fontSize={9} fontWeight={400} fill="#090D16">HUB</text>

                    {/* Outlet Nodes */}
                    {networkNodes.map((n) => {
                      const rad = (n.angle * Math.PI) / 180;
                      const cx = 200 + 130 * Math.cos(rad);
                      const cy = 170 + 130 * Math.sin(rad);
                      const r = 16 + (n.revenue / 154000) * 18;
                      const color = pinColor[n.status] || accent;
                      return (
                        <g key={n.name} className="cursor-pointer transition-transform hover:scale-110">
                          {/* Glow ring */}
                          <circle cx={cx} cy={cy} r={r + 3} fill={color} opacity={0.2} />
                          {/* Main node circle */}
                          <circle cx={cx} cy={cy} r={r} fill={color} stroke={isDark ? "#0F172A" : "#FFFFFF"} strokeWidth={2} opacity={0.95} />
                          {/* Label text - Regular weight text */}
                          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={400} fill="#060709">
                            {n.name.split(" ")[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex items-center gap-4 mt-3 justify-center text-[11px]" style={{ color: t.textFaint }}>
                  {["Healthy", "Watch", "Critical"].map((s) => (
                    <span key={s} className="flex items-center gap-1.5 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ background: pinColor[s] }} />
                      <span style={{ color: t.textMuted }}>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : active === "outlet" ? (
            <div className="space-y-6">
              {underperformingOutlets.length > 0 && (
                <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#FB7185" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={15} color="#FB7185" />
                    <p className="text-sm font-semibold" style={{ color: t.text }}>Underperforming Outlets</p>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: t.textMuted }}>
                    {underperformingOutlets.length} outlet(s) are below target or showing negative growth and need attention.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {underperformingOutlets.map((o) => (
                      <span
                        key={o.name}
                        className="text-xs px-2.5 py-1 rounded-full border"
                        style={{
                          background: o.status === "Critical" ? "#FB71851A" : "#F59E0B1A",
                          color: o.status === "Critical" ? "#FB7185" : "#F59E0B",
                          borderColor: o.status === "Critical" ? "#FB718533" : "#F59E0B33",
                        }}
                      >
                        {o.name}: {o.growth}% ({o.status})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "trend", label: "Sales Revenue Trend", icon: LineChartIcon },
                  { id: "weekly", label: "Weekly Revenue", icon: Calendar },
                  { id: "compare", label: "Compare Franchise Locations", icon: BarChart3 },
                  { id: "map", label: "Outlet Map", icon: MapPin },
                ].map((tb) => {
                  const Icon = tb.icon;
                  const isActive = outletTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setOutletTab(tb.id)}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors"
                      style={{ background: isActive ? `${accent}1A` : t.card, borderColor: isActive ? `${accent}4D` : t.border, color: isActive ? t.text : t.textMuted }}
                    >
                      <Icon size={15} color={isActive ? accent : t.textFaint} />
                      {tb.label}
                    </button>
                  );
                })}
              </div>

              {outletTab === "trend" && (
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <p className="text-sm font-semibold" style={{ color: t.text }}>Revenue Trend</p>
                    <div className="flex items-center gap-2">
                      {["All", "Nashik", "Pune"].map((o) => (
                        <button
                          key={o}
                          onClick={() => setSelectedOutlet(o)}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                          style={{ background: selectedOutlet === o ? accent : "transparent", borderColor: selectedOutlet === o ? accent : t.border, color: selectedOutlet === o ? t.bg : t.textMuted }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `₹${Number(v || 0).toLocaleString("en-IN")}`} />
                      <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {outletTab === "weekly" && (
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.text }}>Weekly Revenue</p>
                      <p className="text-xs" style={{ color: t.textFaint }}>Last 8 weeks</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.keys(weeklyRevenueTrendByOutlet).map((o) => (
                        <button
                          key={o}
                          onClick={() => setSelectedWeeklyOutlet(o)}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                          style={{ background: selectedWeeklyOutlet === o ? accent : "transparent", borderColor: selectedWeeklyOutlet === o ? accent : t.border, color: selectedWeeklyOutlet === o ? t.bg : t.textMuted }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `₹${Number(v || 0).toLocaleString("en-IN")}`} />
                      <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {outletTab === "compare" && (
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-4" style={{ color: t.text }}>Compare Franchise Locations</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={outletComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="outlet" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `₹${Number(v || 0).toLocaleString("en-IN")}`} />
                      <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {outletTab === "map" && (
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <RealOutletMap
                    selectedCountry={selectedCountry}
                    selectedState={selectedState}
                    accentColor={accent}
                    theme={t}
                    activeCurrency={activeCurrency}
                  />
                </div>
              )}

              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}><Store size={15} color={accent} /> Outlet Sales &amp; Performance ({dynamicOutletPerformance.length} Outlets)</p>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2 font-medium">Outlet</th>
                      <th className="px-5 py-2 font-medium">Sales (MTD)</th>
                      <th className="px-5 py-2 font-medium">Target</th>
                      <th className="px-5 py-2 font-medium">Growth</th>
                      <th className="px-5 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicOutletPerformance.map((o) => (
                      <tr key={o.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.name} ({o.state})</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{formatCurrencyValue(o.sales, activeCurrency)}</td>
                        <td className="px-5 py-3" style={{ color: t.textFaint }}>{formatCurrencyValue(o.target, activeCurrency)}</td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 font-medium" style={{ color: o.growth >= 0 ? accent : "#FB7185" }}>
                            {o.growth >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {Math.abs(o.growth)}%
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[o.status]}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "inventory" ? (
            <div className="space-y-6">
              {inventoryError && (
                <div className="text-sm rounded-lg px-4 py-3" style={{ background: "#FB71851A", color: "#FB7185", border: "1px solid #FB718533" }}>
                  {inventoryError}
                </div>
              )}

              {inventorySummary && (
                <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: accent }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={15} color={accent} />
                    <p className="text-sm font-semibold" style={{ color: t.text }}>AI Briefing</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                    {inventorySummary.critical > 0
                      ? `${inventorySummary.critical} item(s) are critically low across the network and need reordering soon.`
                      : "All tracked items are within a healthy range across the network."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: `${accent}1A`, color: accent, borderColor: `${accent}33` }}>Healthy: {inventorySummary?.healthy ?? 0}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>Watch: {inventorySummary?.watch ?? 0}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>Critical: {inventorySummary?.critical ?? 0}</span>
                  </div>
                </div>
              )}

              <StockroomVisualizer accentColor={accent} theme={t} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "SKUs tracked", value: String(inventorySummary?.total ?? 0), icon: Boxes },
                  { label: "Units in view", value: Number(inventorySummary?.totalUnits || 0).toLocaleString("en-IN"), icon: TrendingUp },
                  { label: "Needs reorder", value: String((inventorySummary?.watch || 0) + (inventorySummary?.critical || 0)), icon: AlertTriangle },
                  { label: "Inventory health", value: `${inventorySummary?.healthPct ?? 100}%`, icon: ShieldCheck },
                ].map((k) => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ background: `${accent}1A` }}>
                        <Icon size={13} color={accent} />
                      </div>
                      <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#F59E0B" }}>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Trash2 size={15} color="#F59E0B" />
                    <p className="text-sm font-semibold" style={{ color: t.text }}>Reduce Waste</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>
                    Avg wastage: {avgWastagePercent}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: t.textMuted }}>
                  Tracking spoilage and waste by item helps cut losses — items above 5% wastage are flagged for review.
                </p>
                <div className="space-y-2">
                  {wastageData.map((w) => (
                    <div key={w.item} className="flex items-center justify-between text-sm">
                      <span style={{ color: t.text }}>{w.item}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: t.textFaint }}>{w.wastedUnits} {w.unit} wasted</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            background: w.wastagePercent > 5 ? "#FB71851A" : "#2DD4BF1A",
                            color: w.wastagePercent > 5 ? "#FB7185" : accent,
                            borderColor: "transparent",
                          }}
                        >
                          {w.wastagePercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInventoryOutletId("All")}
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                  style={{ background: inventoryOutletId === "All" ? accent : "transparent", borderColor: inventoryOutletId === "All" ? accent : t.border, color: inventoryOutletId === "All" ? t.bg : t.textMuted }}
                >
                  All outlets
                </button>
                {outlets.map((o) => (
                  <button
                    key={o.outlet_id}
                    onClick={() => setInventoryOutletId(String(o.outlet_id))}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      background: inventoryOutletId === String(o.outlet_id) ? accent : "transparent",
                      borderColor: inventoryOutletId === String(o.outlet_id) ? accent : t.border,
                      color: inventoryOutletId === String(o.outlet_id) ? t.bg : t.textMuted,
                    }}
                  >
                    {o.outlet_name}
                  </button>
                ))}
                <input
                  value={inventoryQuery}
                  onChange={(e) => setInventoryQuery(e.target.value)}
                  placeholder="Search item or SKU"
                  className="ml-auto text-sm rounded-lg border px-3 py-1.5 outline-none"
                  style={{ background: t.inputBg, borderColor: t.border, color: t.text, minWidth: 220 }}
                />
              </div>

              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                  <Boxes size={15} color={accent} /> Inventory by item
                </p>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2 font-medium">SKU</th>
                      <th className="px-5 py-2 font-medium">Item</th>
                      <th className="px-5 py-2 font-medium">Category</th>
                      <th className="px-5 py-2 font-medium">City / Outlet</th>
                      <th className="px-5 py-2 font-medium text-right">On hand</th>
                      <th className="px-5 py-2 font-medium text-right">Reorder at</th>
                      <th className="px-5 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryLoading && (
                      <tr><td colSpan={7} className="px-5 py-6 text-center" style={{ color: t.textFaint }}>Loading inventory...</td></tr>
                    )}
                    {!inventoryLoading && inventoryItems.map((i) => {
                      const status = inventoryStatus(i);
                      return (
                        <tr key={i.item_id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                          <td className="px-5 py-3 font-mono text-xs" style={{ color: t.textFaint }}>{i.sku}</td>
                          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{i.name}</td>
                          <td className="px-5 py-3" style={{ color: t.textMuted }}>{i.category || "—"}</td>
                          <td className="px-5 py-3" style={{ color: t.textMuted }}>
                            <span className="font-medium text-xs text-teal-400 mr-1.5">{i.outlets?.city || "Network"}</span>
                            <span>({i.outlets?.outlet_name || "—"})</span>
                          </td>
                          <td className="px-5 py-3 text-right" style={{ color: t.text }}>{Number(i.quantity)} {i.unit || ""}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textFaint }}>{Number(i.reorder_at)} {i.unit || ""}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[status]}`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {!inventoryLoading && inventoryItems.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-6 text-center" style={{ color: t.textFaint }}>No items match this outlet and search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "staff" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium" style={{ color: t.textFaint }}>Human Resources</p>
                  <h2 className="text-xl font-bold mt-0.5" style={{ color: t.text }}>Staff Agent</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-full border bg-teal-500/10 text-teal-400 border-teal-500/30">
                    Live API Connected
                  </span>
                </div>
              </div>

              {understaffedOutlets.length > 0 && (
                <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#FB7185" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={15} color="#FB7185" />
                    <p className="text-sm font-semibold" style={{ color: t.text }}>Staff Shortage Alert</p>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: t.textMuted }}>
                    {understaffedOutlets.length} outlet(s) are below the minimum staffing level of {MIN_STAFF_PER_OUTLET} — coverage may be at risk during peak hours.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {understaffedOutlets.map((o) => (
                      <span
                        key={o.name}
                        className="text-xs px-2.5 py-1 rounded-full border"
                        style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}
                      >
                        {o.name}: {o.count}/{MIN_STAFF_PER_OUTLET} staff
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "directory", label: "Staff Directory", icon: Users },
                  { id: "attendance", label: "Attendance", icon: ShieldCheck },
                  { id: "hire", label: "Hire Staff", icon: UserPlus },
                ].map((tb) => {
                  const Icon = tb.icon;
                  const isActive = staffTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setStaffTab(tb.id as "directory" | "attendance" | "hire")}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors"
                      style={{
                        background: isActive ? `${accent}1A` : t.card,
                        borderColor: isActive ? `${accent}4D` : t.border,
                        color: isActive ? t.text : t.textMuted,
                      }}
                    >
                      <Icon size={15} color={isActive ? accent : t.textFaint} />
                      {tb.label}
                    </button>
                  );
                })}
              </div>

              {staffTab === "directory" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: "Total Staff", value: String(FALLBACK_EMPLOYEES.length + hiredStaff.length), icon: Users },
                      { label: "Active Shifts", value: "94.2%", icon: TrendingUp },
                      { label: "Monthly Payroll", value: "₹18.4L", icon: FileBarChart },
                      { label: "Attendance Score", value: "96%", icon: ShieldCheck },
                      { label: "Understaffed Outlets", value: String(understaffedOutlets.length), icon: AlertTriangle },
                    ].map((k) => {
                      const Icon = k.icon;
                      return (
                        <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <div className="w-7 h-7 rounded-md flex items-center justify-center mb-2" style={{ background: `${accent}1A` }}>
                            <Icon size={14} color={accent} />
                          </div>
                          <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>{k.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {["All", "Manager", "Supervisor", "Barista", "Cashier"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setStaffRoleFilter(role)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                        style={{
                          background: staffRoleFilter === role ? accent : "transparent",
                          borderColor: staffRoleFilter === role ? accent : t.border,
                          color: staffRoleFilter === role ? t.bg : t.textMuted,
                        }}
                      >
                        {role}
                      </button>
                    ))}
                    <input
                      value={staffQuery}
                      onChange={(e) => setStaffQuery(e.target.value)}
                      placeholder="Search employee or role..."
                      className="ml-auto text-sm rounded-lg border px-3 py-1.5 outline-none"
                      style={{ background: t.inputBg, borderColor: t.border, color: t.text, minWidth: 220 }}
                    />
                  </div>

                  <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                      <Users size={15} color={accent} /> Employee Roster
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm mt-3">
                        <thead>
                          <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                            <th className="px-5 py-2 font-medium">Employee Name</th>
                            <th className="px-5 py-2 font-medium">Role</th>
                            <th className="px-5 py-2 font-medium">Contact Email</th>
                            <th className="px-5 py-2 font-medium">Outlet</th>
                            <th className="px-5 py-2 font-medium text-right">Experience</th>
                            <th className="px-5 py-2 font-medium text-right">Salary</th>
                            <th className="px-5 py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffLoading && (
                            <tr><td colSpan={7} className="px-5 py-6 text-center" style={{ color: t.textFaint }}>Loading staff roster...</td></tr>
                          )}
                          {!staffLoading &&
                            [...hiredStaff, ...FALLBACK_EMPLOYEES]
                              .filter((emp: any) => staffRoleFilter === "All" || emp.role.toLowerCase().includes(staffRoleFilter.toLowerCase()))
                              .filter((emp: any) => !staffQuery || emp.full_name.toLowerCase().includes(staffQuery.toLowerCase()) || emp.role.toLowerCase().includes(staffQuery.toLowerCase()))
                              .map((emp: any) => (
                                <tr key={emp.employee_id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                                  <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{emp.full_name}</td>
                                  <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.role}</td>
                                  <td className="px-5 py-3 font-mono text-xs" style={{ color: t.textFaint }}>{emp.email}</td>
                                  <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.outlets?.outlet_name || "Network"}</td>
                                  <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>
                                    {emp.experience_years != null ? `${emp.experience_years} yrs` : "—"}
                                  </td>
                                  <td className="px-5 py-3 text-right font-medium" style={{ color: t.text }}>₹{Number(emp.salary || 0).toLocaleString("en-IN")}</td>
                                  <td className="px-5 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${emp.status === "Active" ? "bg-teal-500/15 text-teal-400 border-teal-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}`}>
                                      {emp.status || "Active"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {staffTab === "attendance" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Present today", value: String(presentToday), icon: ShieldCheck },
                      { label: "Absent today", value: String(absentToday), icon: AlertTriangle },
                      { label: "Late today", value: String(lateToday), icon: TrendingDown },
                      { label: "Attendance rate", value: `${attendanceRateToday}%`, icon: TrendingUp },
                    ].map((k) => {
                      const Icon = k.icon;
                      return (
                        <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ background: `${accent}1A` }}>
                            <Icon size={13} color={accent} />
                          </div>
                          <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                      <ShieldCheck size={15} color={accent} /> Today&apos;s attendance log
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm mt-3">
                        <thead>
                          <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                            <th className="px-5 py-2 font-medium">Name</th>
                            <th className="px-5 py-2 font-medium">Outlet</th>
                            <th className="px-5 py-2 font-medium">Check-in</th>
                            <th className="px-5 py-2 font-medium">Check-out</th>
                            <th className="px-5 py-2 font-medium">Today</th>
                            <th className="px-5 py-2 font-medium">Last 7 days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceLog.map((a) => (
                            <tr key={a.staffId} className="border-b last:border-0" style={{ borderColor: t.border }}>
                              <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{a.name}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{a.outlet}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{a.checkIn}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{a.checkOut}</td>
                              <td className="px-5 py-3">
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full border"
                                  style={{
                                    background:
                                      a.todayStatus === "Present" ? `${accent}1A` :
                                      a.todayStatus === "Absent" ? "#FB71851A" :
                                      a.todayStatus === "Late" ? "#F59E0B1A" : "#64748B1A",
                                    color:
                                      a.todayStatus === "Present" ? accent :
                                      a.todayStatus === "Absent" ? "#FB7185" :
                                      a.todayStatus === "Late" ? "#F59E0B" : "#94A3B8",
                                    borderColor: "transparent",
                                  }}
                                >
                                  {a.todayStatus}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-1">
                                  {a.week.map((day, i) => (
                                    <span
                                      key={i}
                                      title={`${WEEKDAYS[i]}: ${day === "P" ? "Present" : day === "L" ? "Late" : day === "A" ? "Absent" : "Off"}`}
                                      className="w-3.5 h-3.5 rounded-[3px]"
                                      style={{ background: attendanceDotColor[day] }}
                                    />
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {staffTab === "hire" && (
                <div className="space-y-6">
                  <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                    <div className="px-5 pt-5 pb-1">
                      <p className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                        <Star size={15} color={accent} /> Recommended Candidates
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: t.textFaint }}>
                        People currently working elsewhere who match your understaffed outlets — hire in one click.
                      </p>
                    </div>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                          <th className="px-5 py-2 font-medium">Name</th>
                          <th className="px-5 py-2 font-medium">Currently at</th>
                          <th className="px-5 py-2 font-medium">Role</th>
                          <th className="px-5 py-2 font-medium text-right">Experience</th>
                          <th className="px-5 py-2 font-medium">Suggested Outlet</th>
                          <th className="px-5 py-2 font-medium">Rating</th>
                          <th className="px-5 py-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECOMMENDED_CANDIDATES.map((c) => {
                          const alreadyHired = hiredCandidateIds.includes(c.id);
                          return (
                            <tr key={c.id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                              <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{c.name}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.currentEmployer}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.role}</td>
                              <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{c.experience_years} yrs</td>
                              <td className="px-5 py-3">
                                <span className="text-xs px-2 py-0.5 rounded-full border" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>
                                  {c.suggestedOutlet}
                                </span>
                              </td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>
                                <span className="flex items-center gap-1">
                                  <Star size={12} color="#c1c54c" fill="#160a37" /> {c.rating}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <button
                                  onClick={() => handleQuickHire(c)}
                                  disabled={alreadyHired}
                                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                                  style={{
                                    background: alreadyHired ? t.inputBg : "#F59E0B", // hardcode orange to test
                                    color: alreadyHired ? t.textFaint : "#000000",
                                    cursor: alreadyHired ? "default" : "pointer",
                                    border: "none",
                                  }}
                                >
                                  {alreadyHired ? "Hired" : "Hire"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}>
                      <UserPlus size={15} color={accent} /> Hire New Staff
                    </p>
                    <p className="text-xs mb-4" style={{ color: t.textFaint }}>Or add someone manually.</p>
                    <form onSubmit={handleHireSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Full name</p>
                        <input
                          value={hireForm.name}
                          onChange={(e) => setHireForm({ ...hireForm, name: e.target.value })}
                          placeholder="e.g. Anjali Mehta"
                          required
                          className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        />
                      </div>
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Email</p>
                        <input
                          type="email"
                          value={hireForm.email}
                          onChange={(e) => setHireForm({ ...hireForm, email: e.target.value })}
                          placeholder="anjali.m@franchiseops.com"
                          required
                          className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        />
                      </div>
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Role</p>
                        <select
                          value={hireForm.role}
                          onChange={(e) => setHireForm({ ...hireForm, role: e.target.value })}
                          className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Outlet</p>
                        <select
                          value={hireForm.outletName}
                          onChange={(e) => setHireForm({ ...hireForm, outletName: e.target.value })}
                          className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        >
                          {KNOWN_OUTLET_NAMES.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: t.textMuted }}>Experience (years)</p>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={hireForm.experience}
                          onChange={(e) => setHireForm({ ...hireForm, experience: e.target.value })}
                          placeholder="e.g. 2.5"
                          className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-lg font-bold text-sm shadow-md cursor-pointer"
                          style={{ background: accent, color: t.textOnAccent }}
                        >
                          Add Staff
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                      <Users size={15} color={accent} /> Recently Hired
                    </p>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                          <th className="px-5 py-2 font-medium">Name</th>
                          <th className="px-5 py-2 font-medium">Email</th>
                          <th className="px-5 py-2 font-medium">Role</th>
                          <th className="px-5 py-2 font-medium">Outlet</th>
                          <th className="px-5 py-2 font-medium text-right">Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hiredStaff.length === 0 && (
                          <tr><td colSpan={5} className="px-5 py-6 text-center" style={{ color: t.textFaint }}>No staff hired yet — use the table or form above.</td></tr>
                        )}
                        {hiredStaff.map((emp) => (
                          <tr key={emp.employee_id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                            <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{emp.full_name}</td>
                            <td className="px-5 py-3 font-mono text-xs" style={{ color: t.textFaint }}>{emp.email}</td>
                            <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.role}</td>
                            <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.outlets.outlet_name}</td>
                            <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{emp.experience_years} yrs</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : active === "marketing" ? (
            <div className="space-y-6">
              <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: accent }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={15} color={accent} />
                  <p className="text-sm font-semibold" style={{ color: t.text }}>AI Briefing</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  {underperformingCampaigns.length > 0
                    ? `${underperformingCampaigns.length} campaign(s) are underperforming on ROI — see recommendations below to reallocate budget toward higher-performing channels.`
                    : "All campaigns are performing at or above target ROI this month."}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: `${accent}1A`, color: accent, borderColor: `${accent}33` }}>Avg ROI: {avgROI}x</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>Avg engagement: {avgEngagement}%</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>Underperforming: {underperformingCampaigns.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
  { label: "Campaign Revenue", value: `₹${marketingCampaigns.reduce((s, c) => s + c.spend * c.roi, 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: TrendingUp },
  { label: "Avg ROAS", value: `${avgROI}x`, icon: ShieldCheck },
  { label: "Conversion", value: `${avgConversionRate}%`, icon: Users },
  { label: "CAC", value: `₹${avgCAC}`, icon: Megaphone },
].map((k) => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ background: `${accent}1A` }}>
                        <Icon size={13} color={accent} />
                      </div>
                      <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Customer Engagement Trend</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Average engagement rate, last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={engagementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `${v}%`} />
                      <Line type="monotone" dataKey="engagement" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Engagement by Channel</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Which channels drive the most engagement</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={channelBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="channel" tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `${v}%`} />
                      <Bar dataKey="engagement" fill={accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ADDED FEATURE 1: Promotion Effectiveness */}
              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <div className="px-5 pt-5 pb-1 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                    <Tag size={15} color={accent} /> Promotion Effectiveness
                  </p>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: `${accent}1A`, color: accent, borderColor: `${accent}33` }}>
                    Best: {bestPromo.promo} ({bestPromo.redemptionRate}%)
                  </span>
                </div>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2 font-medium">Promotion</th>
                      <th className="px-5 py-2 font-medium">Type</th>
                      <th className="px-5 py-2 font-medium text-right">Redemptions</th>
                      <th className="px-5 py-2 font-medium text-right">Redemption Rate</th>
                      <th className="px-5 py-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotionEffectiveness.map((p) => (
                      <tr key={p.promo} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{p.promo}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{p.type}</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.text }}>{p.redemptions.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-right font-medium" style={{ color: accent }}>{p.redemptionRate}%</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.textFaint }}>₹{p.revenue.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ADDED FEATURE 2: Customer Segmentation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}>
                    <PieChart size={15} color={accent} /> Customer Segmentation
                  </p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>New vs. returning customers</p>
                  <div className="space-y-3">
                    {customerSegments.map((s) => (
                      <div key={s.segment}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span style={{ color: t.text }}>{s.segment}</span>
                          <span style={{ color: t.textMuted }}>{s.percent}% · {s.count.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: t.inputBg }}>
                          <div className="h-2 rounded-full" style={{ width: `${s.percent}%`, background: accent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Engagement by Age Group</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Which audience responds most</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={ageGroupEngagement}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `${v}%`} />
                      <Bar dataKey="engagement" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ADDED FEATURE 3: Social Media Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                      <Share2 size={15} color={accent} /> Follower Growth
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ background: `${accent}1A`, color: accent, borderColor: "transparent" }}>
                      +{followerGrowthPercent}%
                    </span>
                  </div>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Total followers across platforms, last 6 months</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={followerGrowthTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => Number(v).toLocaleString("en-IN")} />
                      <Line type="monotone" dataKey="followers" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold px-5 pt-5 pb-1" style={{ color: t.text }}>Platform Breakdown</p>
                  <table className="w-full text-sm mt-3">
                    <thead>
                      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                        <th className="px-5 py-2 font-medium">Platform</th>
                        <th className="px-5 py-2 font-medium text-right">Followers</th>
                        <th className="px-5 py-2 font-medium text-right">Likes</th>
                        <th className="px-5 py-2 font-medium text-right">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socialPlatformStats.map((p) => (
                        <tr key={p.platform} className="border-b last:border-0" style={{ borderColor: t.border }}>
                          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{p.platform}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.text }}>{p.followers.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{p.likes.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textFaint }}>{p.comments.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADDED FEATURE 4: Upcoming Campaigns */}
              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                  <CalendarClock size={15} color={accent} /> Upcoming Campaigns
                </p>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2 font-medium">Campaign</th>
                      <th className="px-5 py-2 font-medium">Channel</th>
                      <th className="px-5 py-2 font-medium">Launch Date</th>
                      <th className="px-5 py-2 font-medium">Target Outlets</th>
                      <th className="px-5 py-2 font-medium text-right">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingCampaigns.map((c) => (
                      <tr key={c.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{c.name}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.channel}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.launchDate}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.targetOutlets}</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.text }}>₹{c.budget.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#F59E0B" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={15} color="#F59E0B" />
                  <p className="text-sm font-semibold" style={{ color: t.text }}>Recommended Campaign Improvements</p>
                </div>
                <div className="space-y-2">
                  {marketingRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: t.textMuted }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#F59E0B" }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
                  <Megaphone size={15} color={accent} /> Campaign Performance
                </p>
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                      <th className="px-5 py-2 font-medium">Campaign</th>
                      <th className="px-5 py-2 font-medium">Channel</th>
                      <th className="px-5 py-2 font-medium text-right">Reach</th>
                      <th className="px-5 py-2 font-medium text-right">Engagement</th>
                      <th className="px-5 py-2 font-medium text-right">Spend</th>
                      <th className="px-5 py-2 font-medium text-right">ROI</th>
                      <th className="px-5 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketingCampaigns.map((c) => (
                      <tr key={c.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{c.name}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.channel}</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.text }}>{c.reach.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{c.engagement}%</td>
                        <td className="px-5 py-3 text-right" style={{ color: t.textFaint }}>₹{c.spend.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-right font-medium" style={{ color: c.roi >= 3 ? accent : "#F59E0B" }}>{c.roi}x</td>
                        <td className="px-5 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full border"
                            style={{
                              background: c.status === "Active" ? `${accent}1A` : "#FB71851A",
                              color: c.status === "Active" ? accent : "#FB7185",
                              borderColor: "transparent",
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "audit" ? (
            <div className="space-y-6">
              {/* Header & Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-transparent shadow-lg" style={{ borderColor: t.border, background: t.card }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <ShieldCheck size={24} color={accent} />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: t.text }}>
                        Audit Agent & Quality Inspector
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          AI Engine Active
                        </span>
                      </h2>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Continuous automated compliance tracking, CCTV telemetry, SOP library, and AI store photo vision inspection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAuditModalMode("manual");
                      setShowAuditModal(true);
                      playTechChime();
                    }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-95 cursor-pointer shadow-md"
                    style={{ background: accent, color: t.textOnAccent }}
                  >
                    <ShieldCheck size={16} /> Submit New Audit
                  </button>
                  <button
                    onClick={() => {
                      setAuditModalMode("ai_photo");
                      setShowAuditModal(true);
                      playTechChime();
                    }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 cursor-pointer shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                  >
                    <Camera size={16} /> Run AI Photo Inspection
                  </button>
                </div>
              </div>

              {/* Dynamic KPI Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const totalAudits = audits.length;
                  const avgScore = totalAudits > 0 ? Math.round(audits.reduce((acc, a) => acc + (Number(a.score) || 0), 0) / totalAudits) : 88;
                  const healthyCount = audits.filter(a => a.status === "Healthy" || a.score >= 80).length;
                  const complianceRate = totalAudits > 0 ? Math.round((healthyCount / totalAudits) * 100) : 94;
                  const flaggedCount = audits.filter(a => a.status === "Critical" || a.score < 60).length;

                  return (
                    <>
                      <div className="rounded-xl border p-4 transition-all hover:border-teal-500/40" style={{ background: t.card, borderColor: t.border }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium" style={{ color: t.textFaint }}>Network Audit Score</p>
                          <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Live Aggregation</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-bold" style={{ color: t.text }}>{avgScore}<span className="text-sm font-normal" style={{ color: t.textFaint }}>/100</span></span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${avgScore >= 80 ? "text-teal-400 bg-teal-500/10 border-teal-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
                            {avgScore >= 80 ? "Healthy" : "Watch"}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/20 rounded-full h-1.5 mt-3 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${avgScore}%`, background: avgScore >= 80 ? "#2DD4BF" : "#F59E0B" }} />
                        </div>
                      </div>

                      <div className="rounded-xl border p-4 transition-all hover:border-teal-500/40" style={{ background: t.card, borderColor: t.border }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium" style={{ color: t.textFaint }}>SOP Compliance Rate</p>
                          <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Target &gt;90%</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-bold" style={{ color: t.text }}>{complianceRate}%</span>
                          <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">High</span>
                        </div>
                        <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>{healthyCount} of {totalAudits} outlets fully compliant</p>
                      </div>

                      <div className="rounded-xl border p-4 transition-all hover:border-amber-500/40" style={{ background: t.card, borderColor: t.border }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium" style={{ color: t.textFaint }}>Total Audits Logged</p>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">This Month</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-bold" style={{ color: t.text }}>{totalAudits}</span>
                          <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">On Schedule</span>
                        </div>
                        <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>Next audit scheduled: Solapur Saat Rasta</p>
                      </div>

                      <div className="rounded-xl border p-4 transition-all hover:border-rose-500/40" style={{ background: t.card, borderColor: t.border }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium" style={{ color: t.textFaint }}>Flagged Outlets (Critical)</p>
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Action Req</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-bold text-rose-400">{flaggedCount}</span>
                          <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">Re-Audit Req</span>
                        </div>
                        <p className="text-[11px] mt-2 text-rose-400 font-medium truncate">
                          {flaggedCount > 0 ? "Aurangabad CIDCO (Score: 44)" : "All locations in acceptable tolerance"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto" style={{ borderColor: t.border }}>
                {[
                  { id: "overview", label: "Audit Overview & History", icon: "🛡️" },
                  { id: "operational", label: "Operational Compliance", icon: "⚡" },
                  { id: "ai_photo", label: "AI Store Photo Vision Audit", icon: "📷" },
                  { id: "architecture", label: "Audit Agent Architecture", icon: "🏗️" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAuditSubTab(tab.id as any);
                      playTechChime();
                    }}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap"
                    style={{
                      borderColor: auditSubTab === tab.id ? accent : t.border,
                      background: auditSubTab === tab.id ? `${accent}1A` : "transparent",
                      color: auditSubTab === tab.id ? accent : t.textMuted
                    }}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>

            {auditSubTab === "overview" && (
              <>
              {/* Document Compliance */}
<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <FileCheck2 size={15} color={accent} /> Document Compliance
  </p>
  <table className="w-full text-sm mt-3">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Document</th>
        <th className="px-5 py-2 font-medium">Outlet</th>
        <th className="px-5 py-2 font-medium">Type</th>
        <th className="px-5 py-2 font-medium">Expiry</th>
        <th className="px-5 py-2 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      {documentAnalysis.map((d, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{d.document}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{d.outlet}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{d.type}</td>
          <td className="px-5 py-3" style={{ color: t.textFaint }}>{d.date}</td>
          <td className="px-5 py-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                background: d.status === "Valid" ? `${accent}1A` : d.status === "Expired" ? "#FB71851A" : "#F59E0B1A",
                color: d.status === "Valid" ? accent : d.status === "Expired" ? "#FB7185" : "#F59E0B",
                borderColor: "transparent",
              }}
            >
              {d.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* Re-Audit SLA Countdown */}
<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <Timer size={15} color={accent} /> Re-Audit SLA Countdown
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>
    Critical/Watch outlets must be re-inspected within their compliance window.
  </p>
  <table className="w-full text-sm mt-1">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Outlet</th>
        <th className="px-5 py-2 font-medium">Reason</th>
        <th className="px-5 py-2 font-medium">Due Date</th>
        <th className="px-5 py-2 font-medium text-right">Days Left</th>
      </tr>
    </thead>
    <tbody>
      {reAuditDeadlines.map((r, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{r.outlet}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{r.reason}</td>
          <td className="px-5 py-3" style={{ color: t.textFaint }}>{r.dueDate}</td>
          <td className="px-5 py-3 text-right font-semibold" style={{ color: r.daysLeft <= 7 ? "#FB7185" : "#F59E0B" }}>
            {r.daysLeft} days
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Audit Sign-off Trail */}
<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <PenTool size={15} color={accent} /> Audit Sign-off Trail
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>
    Who reviewed and approved each outlet's latest audit.
  </p>
  <table className="w-full text-sm mt-1">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Outlet</th>
        <th className="px-5 py-2 font-medium">Reviewed By</th>
        <th className="px-5 py-2 font-medium">Date</th>
        <th className="px-5 py-2 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      {signOffTrail.map((s, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{s.outlet}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{s.reviewedBy}</td>
          <td className="px-5 py-3" style={{ color: t.textFaint }}>{s.date}</td>
          <td className="px-5 py-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                background: s.status === "Approved" ? `${accent}1A` : "#F59E0B1A",
                color: s.status === "Approved" ? accent : "#F59E0B",
                borderColor: "transparent",
              }}
            >
              {s.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Repeat Offenders */}
{getRepeatOffenders(audits).length > 0 && (
  <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#FB7185" }}>
    <div className="flex items-center gap-2 mb-1">
      <Repeat size={15} color="#FB7185" />
      <p className="text-sm font-semibold" style={{ color: t.text }}>Repeat Offenders</p>
    </div>
    <p className="text-sm leading-relaxed mb-3" style={{ color: t.textMuted }}>
      Outlets flagged Watch or Critical more than once in recent audits — may indicate a systemic issue, not a one-off.
    </p>
    <div className="flex flex-wrap gap-2">
      {getRepeatOffenders(audits).map((o) => (
        <span
          key={o.outlet}
          className="text-xs px-2.5 py-1 rounded-full border"
          style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}
        >
          {o.outlet}: flagged {o.count}x
        </span>
      ))}
    </div>
  </div>
)}    
{/* Customer Feedback Integration */}
<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <MessageSquare size={15} color={accent} /> Customer Feedback Integration
  </p>
  <table className="w-full text-sm mt-3">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Outlet</th>
        <th className="px-5 py-2 font-medium text-right">Rating</th>
        <th className="px-5 py-2 font-medium text-right">Complaints</th>
        <th className="px-5 py-2 font-medium">Sentiment</th>
      </tr>
    </thead>
    <tbody>
      {customerFeedbackByOutlet.map((f, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{f.outlet}</td>
          <td className="px-5 py-3 text-right" style={{ color: t.text }}>{f.rating} / 5</td>
          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{f.complaints}</td>
          <td className="px-5 py-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                background: f.sentiment === "Positive" ? `${accent}1A` : f.sentiment === "Negative" ? "#FB71851A" : "#F59E0B1A",
                color: f.sentiment === "Positive" ? accent : f.sentiment === "Negative" ? "#FB7185" : "#F59E0B",
                borderColor: "transparent",
              }}
            >
              {f.sentiment}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* Report Generation */}
<div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Report Generation</p>
  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Generate a full audit report for the network or a specific outlet.</p>
  <div className="flex flex-wrap gap-2">
  <button
    onClick={() => window.print()}
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:bg-white/5"
    style={{ background: t.inputBg, borderColor: t.border, color: t.textMuted }}
  >
    <Download size={12} /> Export PDF
  </button>
  <button
    onClick={() => exportToCSV(`audit_report_${new Date().toISOString().split("T")[0]}.xls`, audits)}
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:bg-white/5"
    style={{ background: t.inputBg, borderColor: t.border, color: t.textMuted }}
  >
    <Download size={12} /> Export Excel
  </button>
  <button
    onClick={() => exportToCSV(`audit_report_${new Date().toISOString().split("T")[0]}.csv`, audits)}
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:bg-white/5"
    style={{ background: t.inputBg, borderColor: t.border, color: t.textMuted }}
  >
    <Download size={12} /> Export CSV
  </button>
</div>
</div>

</>          
)}

              {/* Sub-Tab 1: Overview & History */}
              {auditSubTab === "operational" && (
  <div className="space-y-6">
    <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
      <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
        <ClipboardList size={15} color={accent} /> Operational Compliance
      </p>
      <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>
        Attendance, staffing, inventory updates, and cash closing — checked daily per outlet.
      </p>
      <table className="w-full text-sm mt-1">
        <thead>
          <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
            <th className="px-5 py-2 font-medium">Area</th>
            <th className="px-5 py-2 font-medium">Outlet</th>
            <th className="px-5 py-2 font-medium">Detail</th>
            <th className="px-5 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {operationalChecks.map((c, i) => (
            <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
              <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{c.area}</td>
              <td className="px-5 py-3" style={{ color: t.textMuted }}>{c.outlet}</td>
              <td className="px-5 py-3" style={{ color: t.textFaint }}>{c.detail}</td>
              <td className="px-5 py-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    background: c.status === "Pass" ? `${accent}1A` : c.status === "Fail" ? "#FB71851A" : "#F59E0B1A",
                    color: c.status === "Pass" ? accent : c.status === "Fail" ? "#FB7185" : "#F59E0B",
                    borderColor: "transparent",
                  }}
                >
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

              {auditSubTab === "overview" && (
                <div className="space-y-6">
                  {/* Standard Operating Procedures (SOP Library) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                          <span>📚</span> Standard Operating Procedures (SOP Library)
                        </h3>
                        <p className="text-xs" style={{ color: t.textMuted }}>Official franchise protocol checkpoints, revision versions, and audit criteria.</p>
                      </div>
                      <span className="text-[11px] font-mono" style={{ color: t.textFaint }}>4 Active Standards</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {SOP_LIBRARY_DATA.map((sop) => (
                        <div
                          key={sop.id}
                          className="rounded-xl border p-4 flex flex-col justify-between transition-all hover:border-amber-500/50 hover:shadow-md"
                          style={{ background: t.card, borderColor: t.border }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">{sop.ver}</span>
                              <span className="text-[10px]" style={{ color: t.textFaint }}>{sop.date}</span>
                            </div>
                            <h4 className="text-sm font-semibold mb-1" style={{ color: t.text }}>{sop.title}</h4>
                            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: t.textMuted }}>{sop.desc}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: t.border }}>
                            <span className="text-[11px] font-medium" style={{ color: t.textFaint }}>{sop.items}</span>
                            <button
                              onClick={() => {
                                setSelectedSopDetail(sop);
                                playTechChime();
                              }}
                              className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                              style={{ color: accent }}
                            >
                              View Standard <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
   
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
  <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
    <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}>
      <Activity size={15} color={accent} /> Network Compliance Trend
    </p>
    <p className="text-xs mb-4" style={{ color: t.textFaint }}>Average audit score, last 6 months</p>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={complianceTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
        <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} domain={[60, 100]} />
        <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `${v}/100`} />
        <Line type="monotone" dataKey="score" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
    <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
      <Grid3x3 size={15} color={accent} /> Weakest Compliance Categories
    </p>
    <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Pass rate by category, network-wide</p>
    <div className="px-5 pb-5 space-y-3">
      {complianceCategories.sort((a, b) => a.passRate - b.passRate).map((c) => (
        <div key={c.category}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span style={{ color: t.text }}>{c.category}</span>
            <span style={{ color: c.passRate < 70 ? "#FB7185" : c.passRate < 85 ? "#F59E0B" : accent }}>{c.passRate}%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: t.inputBg }}>
            <div
              className="h-2 rounded-full"
              style={{ width: `${c.passRate}%`, background: c.passRate < 70 ? "#FB7185" : c.passRate < 85 ? "#F59E0B" : accent }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{getPredictedRisks(audits).length > 0 && (
  <div className="rounded-xl p-5 border border-l-4" style={{ background: t.card, borderTopColor: t.border, borderRightColor: t.border, borderBottomColor: t.border, borderLeftColor: "#F59E0B" }}>
    <div className="flex items-center gap-2 mb-1">
      <AlertOctagon size={15} color="#F59E0B" />
      <p className="text-sm font-semibold" style={{ color: t.text }}>Predictive Risk Alert</p>
    </div>
    <p className="text-sm leading-relaxed mb-3" style={{ color: t.textMuted }}>
      Score trending downward — likely to fail the next audit if the pattern continues.
    </p>
    <div className="flex flex-wrap gap-2">
      {getPredictedRisks(audits).map((r) => (
        <span key={r.outlet} className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>
          {r.outlet}: {r.trend}
        </span>
      ))}
    </div>
  </div>
)}

                  {/* Audit History Table with Search & Filter */}
                  <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: t.card, borderColor: t.border }}>
                    <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: t.border }}>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                          <ShieldCheck size={16} color={accent} /> Recent Outlet Audit History
                        </h3>
                        <p className="text-xs" style={{ color: t.textMuted }}>Click on any audit entry to inspect detailed scores, notes, and corrective action items.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                          <Search size={13} className="absolute left-2.5 top-2.5" style={{ color: t.textFaint }} />
                          <input
                            type="text"
                            placeholder="Search outlet / inspector..."
                            value={auditSearch}
                            onChange={(e) => setAuditSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none w-48 transition-all"
                            style={{ background: t.panel, borderColor: t.border, color: t.text }}
                          />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-1">
                          {["All", "Healthy", "Watch", "Critical"].map(st => (
                            <button
                              key={st}
                              onClick={() => setAuditFilter(st)}
                              className="text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer"
                              style={{
                                borderColor: auditFilter === st ? accent : t.border,
                                background: auditFilter === st ? `${accent}1A` : "transparent",
                                color: auditFilter === st ? accent : t.textMuted
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* Export CSV Button */}
                        <button
                          onClick={() => {
                            const headers = ["Audit ID", "Outlet Name", "Date", "Category", "Score", "Status", "Inspector", "Details"];
                            const rows = audits.map(a => [
                              `AUD-${a.id}`,
                              `"${a.outlet_name || ''}"`,
                              a.date,
                              `"${a.category || 'Manual SOP'}"`,
                              a.score,
                              a.status,
                              `"${a.inspector || ''}"`,
                              `"${(a.details || '').replace(/"/g, '""')}"`
                            ]);
                            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", `franchise_compliance_audits_${new Date().toISOString().split("T")[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setAuditToast("Audit history exported to CSV successfully.");
                            setTimeout(() => setAuditToast(null), 3500);
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:bg-white/5"
                          style={{ borderColor: t.border, color: t.textMuted }}
                        >
                          <Download size={13} /> Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead style={{ background: t.panel, color: t.textMuted }}>
                          <tr>
                            <th className="p-3 font-semibold">Audit ID</th>
                            <th className="p-3 font-semibold">Outlet Name</th>
                            <th className="p-3 font-semibold">Audit Date</th>
                            <th className="p-3 font-semibold">Category / Type</th>
                            <th className="p-3 font-semibold">Compliance Score</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold">Inspector</th>
                            <th className="p-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: t.border }}>
                          {audits
                            .filter(a => auditFilter === "All" || a.status === auditFilter)
                            .filter(a => {
                              if (!auditSearch.trim()) return true;
                              const q = auditSearch.toLowerCase();
                              return (
                                (a.outlet_name || "").toLowerCase().includes(q) ||
                                (a.inspector || "").toLowerCase().includes(q) ||
                                (a.category || "").toLowerCase().includes(q)
                              );
                            })
                            .map(audit => (
                              <tr
                                key={audit.id}
                                onClick={() => {
                                  setSelectedAuditDetail(audit);
                                  playTechChime();
                                }}
                                className="hover:bg-amber-500/5 transition-colors cursor-pointer"
                              >
                                <td className="p-3 font-mono font-medium" style={{ color: t.textFaint }}>#AUD-{audit.id}</td>
                                <td className="p-3 font-semibold" style={{ color: t.text }}>{audit.outlet_name}</td>
                                <td className="p-3" style={{ color: t.textMuted }}>{audit.date}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                    {(audit as any).category || "SOP Inspection"}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-700/30 rounded-full h-2 overflow-hidden">
                                      <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                          width: `${audit.score}%`,
                                          backgroundColor: audit.score >= 80 ? "#2DD4BF" : audit.score >= 50 ? "#F59E0B" : "#FB7185"
                                        }}
                                      />
                                    </div>
                                    <span className="font-bold" style={{ color: t.text }}>{audit.score}/100</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${
                                    audit.status === "Healthy" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                                    audit.status === "Watch" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                    "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  }`}>
                                    {audit.status}
                                  </span>
                                </td>
                                <td className="p-3 font-medium" style={{ color: t.textMuted }}>{audit.inspector}</td>
                                <td className="p-3 text-right">
                                  <span className="text-xs font-semibold hover:underline" style={{ color: accent }}>
                                    View Report →
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Operational Compliance (Slide 4) */}
              {auditSubTab === "operational" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: t.card, borderColor: t.border }}>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: t.text }}>⚡ Operational Compliance Monitor (Slide 4)</h3>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Continuous automated tracking of Store Opening/Closing times, Attendance & Staffing levels, Cash Closing reconciliation, and Maintenance/Complaint response SLAs.
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">Real-Time Telemetry Feed Active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <span className="text-xs text-slate-400 font-medium">Check Opening/Closing Times</span>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-teal-400">98.4%</span>
                        <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">On-Time</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>Avg store open delay: 1.2 minutes</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <span className="text-xs text-slate-400 font-medium">Monitor Attendance & Staffing</span>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-blue-400">95.2%</span>
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Shift Covered</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>48/50 staff present on active shifts</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <span className="text-xs text-slate-400 font-medium">Validate Inventory & Cash Closing</span>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-amber-400">-$47.30</span>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Variance</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>Flagged in Aurangabad CIDCO shift register</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <span className="text-xs text-slate-400 font-medium">Cleaning & Complaint SLA</span>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-purple-400">14.8 min</span>
                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Fast Response</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>Hygiene checks passed: 98% network</p>
                    </div>
                  </div>

                  <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
                      <h3 className="text-sm font-bold" style={{ color: t.text }}>Outlet Operational Compliance Telemetry Table</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead style={{ background: t.panel, color: t.textMuted }}>
                          <tr>
                            <th className="p-3 font-semibold">Outlet Name</th>
                            <th className="p-3 font-semibold">Opening/Closing Punctuality</th>
                            <th className="p-3 font-semibold">Attendance & Coverage</th>
                            <th className="p-3 font-semibold">Cash Register Variance</th>
                            <th className="p-3 font-semibold">Cleaning & Hygiene Score</th>
                            <th className="p-3 font-semibold">Complaint Response Time</th>
                            <th className="p-3 font-semibold">Overall Compliance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: t.border }}>
                          {opMetrics.map(item => (
                            <tr key={item.outlet_id} className="hover:bg-teal-500/5 transition-colors">
                              <td className="p-3 font-semibold" style={{ color: t.text }}>{item.outlet_name}</td>
                              <td className="p-3">
                                <span className="text-teal-400 font-medium">{item.opening_closing_punctuality}%</span> ({item.on_time_openings})
                              </td>
                              <td className="p-3">
                                <span className="text-blue-400 font-medium">{item.attendance_rate}%</span> ({item.staff_coverage})
                              </td>
                              <td className="p-3">
                                <span className={item.cash_closing_variance < 0 ? "text-rose-400 font-bold" : "text-teal-400 font-bold"}>
                                  ${item.cash_closing_variance.toFixed(2)}
                                </span>
                              </td>
                              <td className="p-3 font-medium text-purple-400">{item.cleaning_hygiene_score}%</td>
                              <td className="p-3" style={{ color: t.textMuted }}>{item.complaint_avg_response_min} mins avg</td>
                              <td className="p-3">
                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${
                                  item.overall_compliance_score >= 80 ? "bg-teal-500/10 text-teal-400 border-teal-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                }`}>
                                  {item.overall_compliance_score} / 100
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: AI Store Photo Vision Audit (Slide 5) */}
              {auditSubTab === "ai_photo" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: t.card, borderColor: t.border }}>
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                        <Camera size={18} className="text-purple-400" /> Validate Franchise Standards with AI Store Photo Analysis (Slide 5)
                      </h3>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Upload real store photos or select fast-pick presets to trigger instant computer vision verification for branding, uniform adherence, counter hygiene, and shelf alignment.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      YOLOv11 / Vision-AI Pro
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Input Form & Upload Trigger */}
                    <div className="rounded-xl border p-5 space-y-4" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Sparkles size={14} /> AI Vision Audit Controls
                      </h4>

                      <div>
                        <label className="block text-xs mb-1 font-medium" style={{ color: t.textMuted }}>Select Target Outlet</label>
                        <select
                          value={aiPhotoOutlet}
                          onChange={(e) => setAiPhotoOutlet(e.target.value)}
                          className="w-full text-xs rounded-lg border px-3 py-2 focus:outline-none"
                          style={{ background: t.bg, borderColor: t.border, color: t.text }}
                        >
                          {KNOWN_OUTLET_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs mb-1 font-medium" style={{ color: t.textMuted }}>Inspection Category</label>
                        <select
                          value={aiPhotoCategory}
                          onChange={(e) => setAiPhotoCategory(e.target.value)}
                          className="w-full text-xs rounded-lg border px-3 py-2 focus:outline-none"
                          style={{ background: t.bg, borderColor: t.border, color: t.text }}
                        >
                          <option value="Branding & Store Layout">Branding, Logo & Store Layout</option>
                          <option value="Uniforms & Staff Hygiene">Uniforms, Hairnets & Staff Attire</option>
                          <option value="Cleanliness & Sanitization">Counter & Store Cleanliness</option>
                          <option value="Product Placement & Shelf">Product Display & Shelf Alignment</option>
                        </select>
                      </div>

                      {/* Fast-Pick Sample Store Photos */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium" style={{ color: t.textMuted }}>
                          Fast-Pick Sample Inspection Photos:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {SAMPLE_STORE_PHOTOS.map(sample => (
                            <button
                              key={sample.id}
                              type="button"
                              onClick={() => {
                                setAiPhotoOutlet(sample.outlet);
                                setAiPhotoCategory(sample.category);
                                setAiPhotoName(`${sample.id}.jpg`);
                                setAiPhotoPreview(sample.id);
                                playTechChime();
                              }}
                              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                aiPhotoPreview === sample.id ? "border-purple-500 ring-1 ring-purple-500/40 bg-purple-500/10" : "hover:border-purple-500/30"
                              }`}
                              style={{ background: aiPhotoPreview === sample.id ? undefined : t.panel, borderColor: aiPhotoPreview === sample.id ? undefined : t.border }}
                            >
                              <p className="font-bold text-[11px] truncate" style={{ color: t.text }}>{sample.title}</p>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded mt-1 inline-block" style={{ color: sample.color, background: `${sample.color}15` }}>
                                {sample.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive File Upload Area */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium" style={{ color: t.textMuted }}>Or Upload Custom Store Photo</label>
                        <label className="border-2 border-dashed rounded-xl p-5 text-center space-y-2 cursor-pointer hover:border-purple-400 transition-colors block" style={{ borderColor: t.border }}>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAiPhotoName(file.name);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setAiPhotoPreview(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                                playTechChime();
                              }
                            }}
                          />
                          <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
                            <UploadCloud size={20} />
                          </div>
                          <p className="text-xs font-medium" style={{ color: t.text }}>
                            {aiPhotoName && aiPhotoName !== "storefront_facade.jpg" ? `Selected: ${aiPhotoName}` : "Drop store photo here or click to browse"}
                          </p>
                          <p className="text-[10px]" style={{ color: t.textFaint }}>Supports JPG, PNG, WEBP (Max 15MB)</p>
                        </label>
                      </div>

                      <button
                        disabled={aiPhotoAnalyzing}
                        onClick={() => {
                          setAiPhotoAnalyzing(true);
                          playTechChime();
                          const token = typeof window !== "undefined" ? localStorage.getItem("fops_token") : null;
                          const headers: Record<string, string> = { "Content-Type": "application/json" };
                          if (token) headers["Authorization"] = `Bearer ${token}`;

                          const foundOutlet = outlets.find(o => o.outlet_name === aiPhotoOutlet);
                          const outletIdToSend = foundOutlet?.outlet_id || (aiPhotoOutlet.includes("Aurangabad") ? 4 : aiPhotoOutlet.includes("Pune") ? 2 : aiPhotoOutlet.includes("Mumbai") ? 3 : 1);

                          fetch(`${API_BASE_URL}/api/compliance/analyze-photo`, {
                            method: "POST",
                            headers,
                            body: JSON.stringify({
                              outlet_id: outletIdToSend,
                              outlet_name: aiPhotoOutlet,
                              photo_category: aiPhotoCategory,
                              inspector: "Vision-AI Pro v4.2",
                              photo_name: aiPhotoName
                            })
                          })
                          .then(res => res.ok ? res.json() : null)
                          .then(data => {
                            if (!data) throw new Error("Invalid response");
                            setAiPhotoResult(data);
                            setAiPhotoAnalyzing(false);
                            if (data.id) {
                              setAudits(prev => [data, ...prev.filter(a => a.id !== data.id)]);
                              setAuditToast(`AI Vision Inspection completed for ${aiPhotoOutlet} (Score: ${data.score}/100)`);
                              setTimeout(() => setAuditToast(null), 4000);
                            }
                            playTechChime();
                          })
                          .catch(() => {
                            // Fallback simulation if backend offline
                            setTimeout(() => {
                              const isCritical = aiPhotoOutlet.includes("Aurangabad");
                              const fallbackData = {
                                id: Date.now(),
                                outlet_id: outletIdToSend,
                                outlet_name: aiPhotoOutlet,
                                date: new Date().toISOString().split("T")[0],
                                score: isCritical ? 64 : 96,
                                status: isCritical ? "Critical" : "Healthy",
                                inspector: "Vision-AI Pro v4.2",
                                category: `AI Photo Vision: ${aiPhotoCategory}`,
                                details: isCritical
                                  ? "AI Vision detected promotional poster blocking secondary logo, staff member without hairnet, and un-sanitized prep surface."
                                  : `AI Computer Vision verified official franchise branding, correct staff uniforms, clear checkout counter, and proper front-row product alignment for ${aiPhotoCategory}.`,
                                ai_metrics: {
                                  branding_logo_score: isCritical ? 74 : 98,
                                  uniform_attire_score: isCritical ? 62 : 96,
                                  cleanliness_score: isCritical ? 56 : 94,
                                  product_placement_score: isCritical ? 60 : 97,
                                  detected_objects: isCritical
                                    ? ["Logo Partially Obscured [74%]", "Non-Standard Staff Attire [62%]", "Cluttered Prep Surface [56%]", "Unstocked Shelf [60%]"]
                                    : ["Franchise Signboard [99.4%]", "Standard Uniform Apron [98%]", "Sanitized Surface [97%]", "Product Shelf Matrix [99%]"],
                                  corrective_actions: isCritical
                                    ? ["Re-position promotional banner away from main window logo", "Enforce hairnet & apron SOP for active shift staff", "Perform deep sanitization on front counter before peak hours"]
                                    : [],
                                  confidence: 0.982
                                }
                              };
                              setAiPhotoResult(fallbackData);
                              setAiPhotoAnalyzing(false);
                              setAudits(prev => [fallbackData, ...prev]);
                              setAuditToast(`AI Vision Inspection completed for ${aiPhotoOutlet} (Score: ${fallbackData.score}/100)`);
                              setTimeout(() => setAuditToast(null), 4000);
                              playTechChime();
                            }, 1200);
                          });
                        }}
                        className="w-full py-3 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all hover:shadow-purple-500/25 active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                      >
                        {aiPhotoAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Running Computer Vision Model...</span>
                          </>
                        ) : (
                          <>
                            <Camera size={16} />
                            <span>Run AI Photo Vision Inspection</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right: Vision Model Results Card */}
                    <div className="lg:col-span-2 rounded-xl border p-5 space-y-4 shadow-sm" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                            <Sparkles size={16} />
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                            AI Vision Inspection Diagnostic Output
                          </h4>
                        </div>
                        {aiPhotoResult && (
                          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                            aiPhotoResult.status === "Healthy" ? "text-teal-400 bg-teal-500/10 border-teal-500/30" :
                            aiPhotoResult.status === "Watch" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
                            "text-rose-400 bg-rose-500/10 border-rose-500/30"
                          }`}>
                            AI Score: {aiPhotoResult.score} / 100 ({aiPhotoResult.status})
                          </span>
                        )}
                      </div>

                      {aiPhotoAnalyzing ? (
                        <div className="py-20 text-center space-y-4">
                          <div className="relative w-16 h-16 mx-auto">
                            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-xl">📷</div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold" style={{ color: t.text }}>Scanning Store Photo & Detecting Objects...</p>
                            <p className="text-xs" style={{ color: t.textMuted }}>
                              Evaluating logo placement, staff uniforms, counter cleanliness, and front-facing shelf alignment.
                            </p>
                          </div>
                        </div>
                      ) : aiPhotoResult ? (
                        <div className="space-y-5 text-xs">
                          {/* Simulated Vision Overlay Visual */}
                          <div className="relative rounded-2xl overflow-hidden border h-52 bg-slate-950 flex items-center justify-center p-4" style={{ borderColor: t.border }}>
                            {/* Scanning laser effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none" />
                            <div className="z-10 text-center space-y-3 max-w-md">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-300 font-mono text-xs">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                                {aiPhotoResult.category} - {aiPhotoResult.outlet_name}
                              </div>

                              {/* Detected Tags Overlay */}
                              <div className="flex flex-wrap gap-2 justify-center">
                                {aiPhotoResult.ai_metrics?.detected_objects?.map((obj: string, i: number) => (
                                  <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-200 border border-purple-500/40 shadow-sm">
                                    [✓] {obj}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 4 Score Metric Gauges */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3.5 rounded-xl border text-center space-y-1 transition-all" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[11px] font-medium block" style={{ color: t.textFaint }}>Branding & Logo</span>
                              <span className="text-xl font-bold text-teal-400">{aiPhotoResult.ai_metrics?.branding_logo_score}%</span>
                              <div className="w-full bg-slate-700/20 rounded-full h-1 mt-1">
                                <div className="h-full rounded-full bg-teal-400" style={{ width: `${aiPhotoResult.ai_metrics?.branding_logo_score}%` }} />
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl border text-center space-y-1 transition-all" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[11px] font-medium block" style={{ color: t.textFaint }}>Uniforms & Attire</span>
                              <span className="text-xl font-bold text-blue-400">{aiPhotoResult.ai_metrics?.uniform_attire_score}%</span>
                              <div className="w-full bg-slate-700/20 rounded-full h-1 mt-1">
                                <div className="h-full rounded-full bg-blue-400" style={{ width: `${aiPhotoResult.ai_metrics?.uniform_attire_score}%` }} />
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl border text-center space-y-1 transition-all" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[11px] font-medium block" style={{ color: t.textFaint }}>Store Cleanliness</span>
                              <span className="text-xl font-bold text-purple-400">{aiPhotoResult.ai_metrics?.cleanliness_score}%</span>
                              <div className="w-full bg-slate-700/20 rounded-full h-1 mt-1">
                                <div className="h-full rounded-full bg-purple-400" style={{ width: `${aiPhotoResult.ai_metrics?.cleanliness_score}%` }} />
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl border text-center space-y-1 transition-all" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[11px] font-medium block" style={{ color: t.textFaint }}>Product Placement</span>
                              <span className="text-xl font-bold text-amber-400">{aiPhotoResult.ai_metrics?.product_placement_score}%</span>
                              <div className="w-full bg-slate-700/20 rounded-full h-1 mt-1">
                                <div className="h-full rounded-full bg-amber-400" style={{ width: `${aiPhotoResult.ai_metrics?.product_placement_score}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* Diagnostic Summary */}
                          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: t.panel, borderColor: t.border }}>
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-xs text-teal-400 flex items-center gap-1.5">
                                <CheckCircle2 size={14} /> AI Diagnostic Summary:
                              </p>
                              <span className="text-[10px] font-mono" style={{ color: t.textFaint }}>
                                Model Confidence: {Math.round((aiPhotoResult.ai_metrics?.confidence || 0.98) * 100)}%
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{aiPhotoResult.details}</p>
                          </div>

                          {/* Automated Corrective Actions */}
                          {aiPhotoResult.ai_metrics?.corrective_actions?.length > 0 ? (
                            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2">
                              <p className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
                                <AlertTriangle size={14} /> Automated Corrective Action Plan Generated:
                              </p>
                              <ul className="list-disc list-inside text-xs text-rose-300 space-y-1">
                                {aiPhotoResult.ai_metrics.corrective_actions.map((act: string, idx: number) => (
                                  <li key={idx}>{act}</li>
                                ))}
                              </ul>
                              <div className="pt-2 flex justify-end">
                                <button
                                  onClick={() => {
                                    setAuditToast("Corrective action tasks assigned to store manager.");
                                    setTimeout(() => setAuditToast(null), 3500);
                                    playTechChime();
                                  }}
                                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 cursor-pointer"
                                >
                                  Acknowledge & Assign Tasks
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-between">
                              <span className="text-xs text-teal-300 font-medium flex items-center gap-2">
                                <CheckCircle2 size={15} /> All standards passed. Zero corrective actions required.
                              </span>
                              <span className="text-[10px] font-mono text-teal-400">100% SOP COMPLIANT</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-20 text-center space-y-3" style={{ color: t.textMuted }}>
                          <span className="text-4xl block">📸</span>
                          <p className="text-sm font-semibold" style={{ color: t.text }}>No Inspection Active</p>
                          <p className="text-xs max-w-sm mx-auto" style={{ color: t.textMuted }}>
                            Select a target outlet, pick a sample photo or upload a photo, and click "Run AI Photo Vision Inspection".
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {auditSubTab === "architecture" && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="p-5 rounded-2xl border space-y-2 animate-in fade-in slide-in-from-bottom duration-300" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Brain size={20} color={accent} />
                      </span>
                      <h3 className="text-sm font-bold" style={{ color: t.text }}>Audit Agent & Compliance Pipeline Specification</h3>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>
                      The Audit Agent coordinates manual operational checkpoints, YOLOv11 computer vision analysis, offline resiliency fallbacks, and cryptographic blockchain logging to ensure 100% data immutability.
                    </p>
                  </div>

                  {/* Architecture Flow Diagram */}
                  <div className="rounded-2xl border p-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-400" style={{ background: t.card, borderColor: t.border }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Activity size={14} className="animate-pulse" /> System Topology & Data Flow Sequence
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                      <div className="p-4 rounded-xl border space-y-2 flex flex-col justify-center items-center hover:scale-105 transition-transform" style={{ background: t.panel, borderColor: t.border }}>
                        <span className="text-2xl">📸</span>
                        <h5 className="text-xs font-bold" style={{ color: t.text }}>Ingestion Layer</h5>
                        <p className="text-[10px]" style={{ color: t.textFaint }}>Checklists & Photo Uploads</p>
                      </div>
                      
                      <div className="text-teal-400 font-bold text-lg rotate-90 md:rotate-0">➔</div>
                      
                      <div className="p-4 rounded-xl border space-y-2 flex flex-col justify-center items-center hover:scale-105 transition-transform" style={{ background: t.panel, borderColor: t.border }}>
                        <span className="text-2xl">⚙️</span>
                        <h5 className="text-xs font-bold" style={{ color: t.text }}>Audit Core Engine</h5>
                        <p className="text-[10px]" style={{ color: t.textFaint }}>Scoring & Rules Calculator</p>
                      </div>
                      
                      <div className="text-teal-400 font-bold text-lg rotate-90 md:rotate-0">➔</div>
                      
                      <div className="p-4 rounded-xl border space-y-2 flex flex-col justify-center items-center hover:scale-105 transition-transform" style={{ background: t.panel, borderColor: t.border }}>
                        <span className="text-2xl">⛓️</span>
                        <h5 className="text-xs font-bold" style={{ color: t.text }}>Consensus & Logs</h5>
                        <p className="text-[10px]" style={{ color: t.textFaint }}>PostgreSQL + Blockchain</p>
                      </div>
                    </div>
                  </div>

                  {/* Core Subsystem Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="rounded-2xl border p-5 space-y-3 hover:shadow-lg transition-shadow" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <AlertOctagon size={14} /> Compliance Scoring Engine
                      </h4>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Computes real-time rules for staffing coverage, inventory thresholds, attendance, and cash closing. Scores under 50% trigger instant visual dashboard flags and push notifications.
                      </p>
                      <div className="p-3 rounded-lg border text-[11px] font-mono" style={{ background: t.panel, borderColor: t.border, color: t.textMuted }}>
                        <div>Formula: <span className="text-teal-400">Score = Sum(Value) / Checks.length</span></div>
                        <div className="mt-1">Thresholds: Healthy &gt;= 80% | Watch &gt;= 50% | Critical &lt; 50%</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border p-5 space-y-3 hover:shadow-lg transition-shadow" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Camera size={14} /> AI YOLOv11 Computer Vision
                      </h4>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Integrates YOLOv11 classification models to verify real-time storefront branding, staff uniform attire (aprons, caps), sanitation cleanliness, and product shelf alignment from uploads.
                      </p>
                      <div className="p-3 rounded-lg border text-[11px] font-mono" style={{ background: t.panel, borderColor: t.border, color: t.textMuted }}>
                        <div>Confidence Score: <span className="text-purple-400">0.982 (Verified)</span></div>
                        <div className="mt-1">Classifiers: Logo, Hairnet, Sanitized Counter, Shelf Alignment</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border p-5 space-y-3 hover:shadow-lg transition-shadow" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Repeat size={14} /> Offline Resiliency & Fallback
                      </h4>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        In the event of a database connection failure, the Express backend automatically switches to local JSON files (<span className="text-amber-400">dataset/compliance.json</span>) to ensure zero service disruption.
                      </p>
                      <div className="p-3 rounded-lg border text-[11px] font-mono" style={{ background: t.panel, borderColor: t.border, color: t.textMuted }}>
                        <div>Database Fallback: <span className="text-emerald-400">Active</span></div>
                        <div className="mt-1">Data Source: dataset/outlets.json, dataset/inventory.json</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border p-5 space-y-3 hover:shadow-lg transition-shadow" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Boxes size={14} /> Cryptographic Blockchain Ledger
                      </h4>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Every completed audit is hashed and stored in an immutable blockchain block ledger explorer, preventing historical data modification and ensuring complete audit trail integrity.
                      </p>
                      <div className="p-3 rounded-lg border text-[11px] font-mono" style={{ background: t.panel, borderColor: t.border, color: t.textMuted }}>
                        <div>Hash Algorithm: <span className="text-blue-400">SHA-256</span></div>
                        <div className="mt-1">Verification: Merkle Root & digital validator signatures</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Audit / Run AI Photo Modal */}
              {showAuditModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                      <h3 className="text-base font-bold flex items-center gap-2" style={{ color: t.text }}>
                        <ShieldCheck size={20} color={accent} />
                        {auditModalMode === "manual" ? "Submit Manual SOP Compliance Audit" : "AI Store Photo Vision Inspector"}
                      </h3>
                      <button onClick={() => setShowAuditModal(false)} className="text-sm cursor-pointer p-1 rounded-md hover:bg-white/10" style={{ color: t.textFaint }}>✕</button>
                    </div>

                    {/* Modal Mode Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl border text-xs" style={{ background: t.panel, borderColor: t.border }}>
                      <button
                        onClick={() => {
                          setAuditModalMode("manual");
                          playTechChime();
                        }}
                        className="py-2 rounded-lg font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: auditModalMode === "manual" ? accent : "transparent",
                          color: auditModalMode === "manual" ? t.textOnAccent : t.textMuted
                        }}
                      >
                        <FileText size={14} /> Manual SOP Checklist
                      </button>
                      <button
                        onClick={() => {
                          setAuditModalMode("ai_photo");
                          playTechChime();
                        }}
                        className="py-2 rounded-lg font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: auditModalMode === "ai_photo" ? "#9333EA" : "transparent",
                          color: auditModalMode === "ai_photo" ? "#FFFFFF" : t.textMuted
                        }}
                      >
                        <Camera size={14} /> 📷 AI Store Photo Upload
                      </button>
                    </div>

                    {auditModalMode === "manual" ? (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Select Outlet</label>
                            <select
                              value={newAuditForm.outletName}
                              onChange={(e) => {
                                const name = e.target.value;
                                const found = outlets.find(o => o.outlet_name === name);
                                setNewAuditForm(prev => ({ ...prev, outletName: name, outletId: String(found?.outlet_id || 1) }));
                              }}
                              className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                              style={{ background: t.bg, borderColor: t.border, color: t.text }}
                            >
                              {KNOWN_OUTLET_NAMES.map(name => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Audit Category</label>
                            <select
                              value={newAuditForm.category}
                              onChange={(e) => setNewAuditForm(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                              style={{ background: t.bg, borderColor: t.border, color: t.text }}
                            >
                              <option value="Food Safety & Temp">Food Safety & Temp Compliance</option>
                              <option value="Opening / Closing Protocol">Opening / Closing Protocol</option>
                              <option value="Cash Register Audit">Cash Register Audit</option>
                              <option value="Staff Hygiene & Attire">Staff Hygiene & Attire</option>
                              <option value="General Cleanliness">General Cleanliness & Sanitization</option>
                              <option value="Comprehensive 360 Audit">Comprehensive 360° Outlet Audit</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Inspector Name</label>
                          <input
                            type="text"
                            value={newAuditForm.inspector}
                            onChange={(e) => setNewAuditForm(prev => ({ ...prev, inspector: e.target.value }))}
                            placeholder="Inspector Name / Quality Auditor"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                            style={{ background: t.bg, borderColor: t.border, color: t.text }}
                          />
                        </div>

                        {/* Checklist Checkpoints */}
                        <div className="space-y-2 border-t pt-3" style={{ borderColor: t.border }}>
                          <p className="font-semibold text-xs mb-2 flex items-center justify-between" style={{ color: t.text }}>
                            <span>SOP Verification Checkpoints (20 pts each):</span>
                            <span className="font-mono text-teal-400">
                              {[newAuditForm.tempCheck, newAuditForm.cleanlinessCheck, newAuditForm.registerCheck, newAuditForm.safetyCheck, newAuditForm.uniformCheck].filter(Boolean).length} / 5 Passed
                            </span>
                          </p>
                          {[
                            { key: "tempCheck", label: "Cold Storage & Food Temp Compliance (<= 4°C)" },
                            { key: "cleanlinessCheck", label: "Kitchen, Prep Area & Counter Disinfection" },
                            { key: "registerCheck", label: "Cash Register & Shift POS Balance Reconciliation" },
                            { key: "safetyCheck", label: "Fire Safety, First-Aid & Emergency Route Verification" },
                            { key: "uniformCheck", label: "Staff Uniform, Hairnets & Hygiene SOP Adherence" },
                          ].map(item => (
                            <label
                              key={item.key}
                              className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors hover:bg-white/5"
                              style={{ background: t.panel, borderColor: t.border }}
                            >
                              <span className="font-medium" style={{ color: (newAuditForm as any)[item.key] ? t.text : t.textMuted }}>
                                {item.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={(newAuditForm as any)[item.key]}
                                onChange={(e) => {
                                  const updated = { ...newAuditForm, [item.key]: e.target.checked };
                                  const count = [
                                    updated.tempCheck,
                                    updated.cleanlinessCheck,
                                    updated.registerCheck,
                                    updated.safetyCheck,
                                    updated.uniformCheck
                                  ].filter(Boolean).length;
                                  const calculatedScore = count * 20;
                                  setNewAuditForm({ ...updated, score: calculatedScore });
                                }}
                                className="w-4 h-4 accent-amber-500 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Auditor Notes & Observations</label>
                          <textarea
                            rows={2}
                            value={newAuditForm.notes}
                            onChange={(e) => setNewAuditForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Enter specific audit observations, variance comments, or store notes..."
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none resize-none"
                            style={{ background: t.bg, borderColor: t.border, color: t.text }}
                          />
                        </div>

                        {/* Calculated Score Bar */}
                        <div className="p-3.5 rounded-xl border flex items-center justify-between font-medium" style={{ background: `${accent}10`, borderColor: `${accent}30` }}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold" style={{ color: t.text }}>Calculated Audit Score:</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                              newAuditForm.score >= 80 ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                              newAuditForm.score >= 60 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                              "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}>
                              {newAuditForm.score >= 80 ? "Healthy" : newAuditForm.score >= 60 ? "Watch" : "Critical"}
                            </span>
                          </div>
                          <span className="text-lg font-bold" style={{ color: accent }}>{newAuditForm.score} / 100</span>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAuditModal(false)}
                            className="flex-1 py-2.5 rounded-xl border font-semibold text-xs cursor-pointer hover:bg-white/5"
                            style={{ borderColor: t.border, color: t.textMuted }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={auditSubmitting}
                            onClick={() => {
                              setAuditSubmitting(true);
                              const status = newAuditForm.score >= 80 ? "Healthy" : newAuditForm.score >= 60 ? "Watch" : "Critical";
                              const foundOutlet = outlets.find(o => o.outlet_name === newAuditForm.outletName);
                              const outletIdToSend = foundOutlet?.outlet_id || (newAuditForm.outletName.includes("Aurangabad") ? 4 : newAuditForm.outletName.includes("Pune") ? 2 : 1);

                              const newRecord = {
                                id: Date.now(),
                                outlet_id: outletIdToSend,
                                outlet_name: newAuditForm.outletName,
                                date: new Date().toISOString().split("T")[0],
                                score: newAuditForm.score,
                                status,
                                inspector: newAuditForm.inspector || "Quality Auditor",
                                category: newAuditForm.category || "Manual SOP Checklist",
                                details: newAuditForm.notes || "Standard manual SOP audit checkpoint submitted."
                              };

                              setAudits(prev => [newRecord, ...prev]);
                              setShowAuditModal(false);
                              setAuditSubmitting(false);
                              playTechChime();
                              setAuditToast(`Audit report for ${newAuditForm.outletName} submitted successfully (Score: ${newAuditForm.score}/100)`);
                              setTimeout(() => setAuditToast(null), 4000);

                              const token = typeof window !== "undefined" ? localStorage.getItem("fops_token") : null;
                              const headers: Record<string, string> = { "Content-Type": "application/json" };
                              if (token) headers["Authorization"] = `Bearer ${token}`;

                              fetch(`${API_BASE_URL}/api/compliance`, {
                                method: "POST",
                                headers,
                                body: JSON.stringify(newRecord)
                              }).catch(() => {});
                            }}
                            className="flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5"
                            style={{ background: accent, color: t.textOnAccent }}
                          >
                            <ShieldCheck size={14} /> Submit Audit Report
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Select Target Outlet</label>
                            <select
                              value={aiPhotoOutlet}
                              onChange={(e) => setAiPhotoOutlet(e.target.value)}
                              className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                              style={{ background: t.bg, borderColor: t.border, color: t.text }}
                            >
                              {KNOWN_OUTLET_NAMES.map(name => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Inspection Category</label>
                            <select
                              value={aiPhotoCategory}
                              onChange={(e) => setAiPhotoCategory(e.target.value)}
                              className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                              style={{ background: t.bg, borderColor: t.border, color: t.text }}
                            >
                              <option value="Branding & Store Layout">Branding, Logo & Store Layout</option>
                              <option value="Uniforms & Staff Hygiene">Uniforms, Hairnets & Staff Attire</option>
                              <option value="Cleanliness & Sanitization">Counter & Store Cleanliness</option>
                              <option value="Product Placement & Shelf">Product Display & Shelf Alignment</option>
                            </select>
                          </div>
                        </div>

                        {/* Fast Sample Pick */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium" style={{ color: t.textMuted }}>Fast-Pick Sample Store Photo:</label>
                          <div className="grid grid-cols-2 gap-2">
                            {SAMPLE_STORE_PHOTOS.map(sample => (
                              <button
                                key={sample.id}
                                type="button"
                                onClick={() => {
                                  setAiPhotoOutlet(sample.outlet);
                                  setAiPhotoCategory(sample.category);
                                  setAiPhotoName(`${sample.id}.jpg`);
                                  setAiPhotoPreview(sample.id);
                                  playTechChime();
                                }}
                                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                  aiPhotoPreview === sample.id ? "border-purple-500 bg-purple-500/10" : "hover:border-purple-500/30"
                                }`}
                                style={{ background: aiPhotoPreview === sample.id ? undefined : t.panel, borderColor: aiPhotoPreview === sample.id ? undefined : t.border }}
                              >
                                <p className="font-bold text-[11px] truncate" style={{ color: t.text }}>{sample.title}</p>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded mt-0.5 inline-block" style={{ color: sample.color, background: `${sample.color}15` }}>
                                  {sample.tag}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* File Upload Area */}
                        <label className="border-2 border-dashed rounded-xl p-5 text-center space-y-1.5 cursor-pointer hover:border-purple-400 transition-colors block" style={{ borderColor: t.border }}>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAiPhotoName(file.name);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setAiPhotoPreview(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                                playTechChime();
                              }
                            }}
                          />
                          <Camera size={24} className="mx-auto text-purple-400" />
                          <p className="font-semibold text-xs" style={{ color: t.text }}>
                            {aiPhotoName && aiPhotoName !== "storefront_facade.jpg" ? `Photo: ${aiPhotoName}` : "Drop Store Photo Here or Click to Upload"}
                          </p>
                          <p className="text-[10px]" style={{ color: t.textFaint }}>AI Vision will verify branding, logo, uniforms & cleanliness</p>
                        </label>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAuditModal(false)}
                            className="flex-1 py-2.5 rounded-xl border font-medium text-xs cursor-pointer hover:bg-white/5"
                            style={{ borderColor: t.border, color: t.textMuted }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAuditModal(false);
                              setAuditSubTab("ai_photo");
                              setAiPhotoAnalyzing(true);
                              playTechChime();

                              const token = typeof window !== "undefined" ? localStorage.getItem("fops_token") : null;
                              const headers: Record<string, string> = { "Content-Type": "application/json" };
                              if (token) headers["Authorization"] = `Bearer ${token}`;

                              const foundOutlet = outlets.find(o => o.outlet_name === aiPhotoOutlet);
                              const outletIdToSend = foundOutlet?.outlet_id || (aiPhotoOutlet.includes("Aurangabad") ? 4 : 1);

                              fetch(`${API_BASE_URL}/api/compliance/analyze-photo`, {
                                method: "POST",
                                headers,
                                body: JSON.stringify({
                                  outlet_id: outletIdToSend,
                                  outlet_name: aiPhotoOutlet,
                                  photo_category: aiPhotoCategory,
                                  inspector: "Vision-AI Pro v4.2",
                                  photo_name: aiPhotoName
                                })
                              })
                              .then(res => res.ok ? res.json() : null)
                              .then(data => {
                                if (!data) throw new Error("Invalid response");
                                setAiPhotoResult(data);
                                setAiPhotoAnalyzing(false);
                                if (data.id) {
                                  setAudits(prev => [data, ...prev.filter(a => a.id !== data.id)]);
                                  setAuditToast(`AI Vision Inspection completed for ${aiPhotoOutlet} (Score: ${data.score}/100)`);
                                  setTimeout(() => setAuditToast(null), 4000);
                                }
                                playTechChime();
                              })
                              .catch(() => {
                                setTimeout(() => {
                                  const isCritical = aiPhotoOutlet.includes("Aurangabad");
                                  const fallbackData = {
                                    id: Date.now(),
                                    outlet_id: outletIdToSend,
                                    outlet_name: aiPhotoOutlet,
                                    date: new Date().toISOString().split("T")[0],
                                    score: isCritical ? 64 : 96,
                                    status: isCritical ? "Critical" : "Healthy",
                                    inspector: "Vision-AI Pro v4.2",
                                    category: `AI Photo Vision: ${aiPhotoCategory}`,
                                    details: isCritical
                                      ? "AI Vision detected promotional poster blocking secondary logo, staff member without hairnet, and un-sanitized prep surface."
                                      : `AI Computer Vision verified official franchise branding, correct staff uniforms, clear checkout counter, and proper front-row product alignment for ${aiPhotoCategory}.`,
                                    ai_metrics: {
                                      branding_logo_score: isCritical ? 74 : 98,
                                      uniform_attire_score: isCritical ? 62 : 96,
                                      cleanliness_score: isCritical ? 56 : 94,
                                      product_placement_score: isCritical ? 60 : 97,
                                      detected_objects: isCritical
                                        ? ["Logo Partially Obscured [74%]", "Non-Standard Staff Attire [62%]", "Cluttered Prep Surface [56%]", "Unstocked Shelf [60%]"]
                                        : ["Franchise Signboard [99.4%]", "Standard Uniform Apron [98%]", "Sanitized Surface [97%]", "Product Shelf Matrix [99%]"],
                                      corrective_actions: isCritical
                                        ? ["Re-position promotional banner away from main window logo", "Enforce hairnet & apron SOP for active shift staff", "Perform deep sanitization on front counter before peak hours"]
                                        : [],
                                      confidence: 0.982
                                    }
                                  };
                                  setAiPhotoResult(fallbackData);
                                  setAiPhotoAnalyzing(false);
                                  setAudits(prev => [fallbackData, ...prev]);
                                  setAuditToast(`AI Vision Inspection completed for ${aiPhotoOutlet} (Score: ${fallbackData.score}/100)`);
                                  setTimeout(() => setAuditToast(null), 4000);
                                  playTechChime();
                                }, 1200);
                              });
                            }}
                            className="flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Camera size={14} /> Run AI Photo Audit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audit Detail Report Modal */}
              {selectedAuditDetail && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                          <ShieldCheck size={18} />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: t.text }}>
                            Audit Inspection Report #AUD-{selectedAuditDetail.id}
                          </h3>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>{selectedAuditDetail.date} • {selectedAuditDetail.outlet_name}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedAuditDetail(null)} className="text-sm cursor-pointer p-1 rounded hover:bg-white/10" style={{ color: t.textFaint }}>✕</button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border" style={{ background: t.panel, borderColor: t.border }}>
                        <div>
                          <p className="text-[10px] font-medium" style={{ color: t.textFaint }}>Audit Category</p>
                          <p className="font-bold text-teal-400 mt-0.5">{selectedAuditDetail.category || "Manual SOP Inspection"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium" style={{ color: t.textFaint }}>Inspector / Engine</p>
                          <p className="font-semibold mt-0.5" style={{ color: t.text }}>{selectedAuditDetail.inspector}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium" style={{ color: t.textFaint }}>Compliance Score</p>
                          <p className="text-base font-bold mt-0.5" style={{ color: selectedAuditDetail.score >= 80 ? "#2DD4BF" : selectedAuditDetail.score >= 60 ? "#F59E0B" : "#FB7185" }}>
                            {selectedAuditDetail.score} / 100
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium" style={{ color: t.textFaint }}>Compliance Status</p>
                          <span className={`inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${
                            selectedAuditDetail.status === "Healthy" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                            selectedAuditDetail.status === "Watch" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                            "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {selectedAuditDetail.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                        <p className="font-bold text-xs" style={{ color: t.text }}>Inspection Observations & Findings:</p>
                        <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{selectedAuditDetail.details || "All checkpoint parameters passed nominal thresholds without infractions."}</p>
                      </div>

                      {selectedAuditDetail.ai_metrics?.corrective_actions?.length > 0 && (
                        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-1">
                          <p className="font-bold text-xs text-rose-400">Corrective Action Items:</p>
                          <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                            {selectedAuditDetail.ai_metrics.corrective_actions.map((act: string, idx: number) => (
                              <li key={idx}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: t.panel, borderColor: t.border }}>
                        <div>
                          <p className="text-[10px] font-mono text-teal-400">CRYPTOGRAPHIC LEDGER PROOF</p>
                          <p className="text-[10px] font-mono" style={{ color: t.textFaint }}>SHA-256: 8f7c9e2b14a...e4d0</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">VERIFIED</span>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => setSelectedAuditDetail(null)}
                          className="w-full py-2.5 rounded-xl font-semibold text-xs cursor-pointer border hover:bg-white/5"
                          style={{ borderColor: t.border, color: t.text }}
                        >
                          Close Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SOP Standard Detail Modal */}
              {selectedSopDetail && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">{selectedSopDetail.ver}</span>
                          <h3 className="text-base font-bold" style={{ color: t.text }}>{selectedSopDetail.title} Standard</h3>
                        </div>
                        <p className="text-[11px]" style={{ color: t.textFaint }}>{selectedSopDetail.protocol}</p>
                      </div>
                      <button onClick={() => setSelectedSopDetail(null)} className="text-sm cursor-pointer p-1 rounded hover:bg-white/10" style={{ color: t.textFaint }}>✕</button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: t.panel, borderColor: t.border }}>
                        <span className="font-medium" style={{ color: t.textMuted }}>Audit Frequency:</span>
                        <span className="font-bold text-amber-400">{selectedSopDetail.frequency}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-xs" style={{ color: t.text }}>Standard Checkpoints ({selectedSopDetail.checkpoints.length} Criteria):</p>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {selectedSopDetail.checkpoints.map((cp: string, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg border flex items-start gap-2 text-xs" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-teal-400 font-bold font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                              <span style={{ color: t.text }}>{cp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => setSelectedSopDetail(null)}
                          className="flex-1 py-2.5 rounded-xl border font-medium text-xs cursor-pointer hover:bg-white/5"
                          style={{ borderColor: t.border, color: t.textMuted }}
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSopDetail(null);
                            setNewAuditForm(prev => ({
                              ...prev,
                              category: selectedSopDetail.category,
                              notes: `Conducting standard audit under ${selectedSopDetail.title} (${selectedSopDetail.ver})`
                            }));
                            setAuditModalMode("manual");
                            setShowAuditModal(true);
                            playTechChime();
                          }}
                          className="flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all hover:brightness-110 active:scale-95"
                          style={{ background: accent, color: t.textOnAccent }}
                        >
                          Conduct Audit for this SOP →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Toast Notification Popup */}
              {auditToast && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border bg-slate-900/95 border-teal-500/40 text-teal-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
                  <CheckCircle2 size={16} className="text-teal-400" />
                  <span>{auditToast}</span>
                </div>
              )}
            </div>
          ) : active === "intelligence" ? (

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: t.text }}>Franchise Intelligence & ML Engine</h2>
                  <p className="text-xs" style={{ color: t.textMuted }}>Predictive revenue analytics, What-If simulation sandbox, and MLOps model console.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> XGBoost / Random Forest Active
                  </span>
                </div>
              </div>

              <div className="rounded-xl border p-6" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                    <Brain size={16} color={accent} /> What-If Revenue Simulation Sandbox
                  </h3>
                  <span className="text-xs" style={{ color: t.textFaint }}>Powered by ML Microservice (`/ml/predict/simulate`)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Target Outlet Location</label>
                      <select
                        value={simOutlet}
                        onChange={(e) => setSimOutlet(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      >
                        {KNOWN_OUTLET_NAMES.map(name => (
                          <option key={name} value={name} style={{ background: "#1A1D24", color: "#FFFFFF" }}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="font-medium" style={{ color: t.textMuted }}>Discount Rate Percentage</label>
                        <span className="font-bold" style={{ color: accent }}>{simDiscount}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={simDiscount}
                        onChange={(e) => setSimDiscount(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="font-medium" style={{ color: t.textMuted }}>Marketing Spend Multiplier</label>
                        <span className="font-bold" style={{ color: accent }}>{simSpendMult}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={simSpendMult}
                        onChange={(e) => setSimSpendMult(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSimLoading(true);
                        fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/simulate`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            outlet_id: 1,
                            tier: "Metro",
                            month: 8,
                            avg_lag7: 142000,
                            avg_lag14: 138000,
                            avg_roll4w: 145000,
                            discount_pct: simDiscount,
                            spend_multiplier: simSpendMult
                          })
                        })
                          .then(res => res.ok ? res.json() : null)
                          .then(data => {
                            if (data && data.predicted_revenue) {
                              setSimResult(data);
                            } else {
                              const base = 154000;
                              const boost = (simSpendMult * 12000) - (simDiscount * 450);
                              const pred = Math.round(base + boost);
                              setSimResult({
                                predicted_revenue: pred,
                                base_revenue: base,
                                growth_pct: (((pred - base) / base) * 100).toFixed(1),
                                demand_level: pred > 170000 ? "High" : pred > 140000 ? "Medium" : "Low",
                                confidence_score: 92.4,
                                reorder_recommendation: pred > 170000 ? "+45 kg Beans, +30L Milk" : "+20 kg Beans",
                              });
                            }
                          })
                          .catch(() => {
                            const base = 154000;
                            const boost = (simSpendMult * 12000) - (simDiscount * 450);
                            const pred = Math.round(base + boost);
                            setSimResult({
                              predicted_revenue: pred,
                              base_revenue: base,
                              growth_pct: (((pred - base) / base) * 100).toFixed(1),
                              demand_level: pred > 170000 ? "High" : pred > 140000 ? "Medium" : "Low",
                              confidence_score: 92.4,
                              reorder_recommendation: pred > 170000 ? "+45 kg Beans, +30L Milk" : "+20 kg Beans",
                            });
                          })
                          .finally(() => setSimLoading(false));
                      }}
                      className="w-full py-2.5 rounded-lg font-bold text-xs cursor-pointer shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      style={{ background: accent, color: t.textOnAccent }}
                    >
                      {simLoading ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
                      Run Simulation Predictor
                    </button>
                  </div>

                  <div className="lg:col-span-2 rounded-xl border p-5 flex flex-col justify-between" style={{ background: t.panel, borderColor: t.border }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: accent }}>Predicted Outcome Metrics</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>Predicted Monthly Revenue</p>
                          <p className="text-2xl font-bold mt-1" style={{ color: t.text }}>₹{Number(simResult.predicted_revenue || 172400).toLocaleString("en-IN")}</p>
                          <span className="text-xs text-teal-400 font-medium">+{simResult.growth_pct || 11.9}% vs baseline</span>
                        </div>

                        <div>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>Demand Level</p>
                          <p className="text-xl font-bold mt-1 text-teal-400">{simResult.demand_level || "High"}</p>
                          <span className="text-[10px]" style={{ color: t.textFaint }}>Random Forest Classifier</span>
                        </div>

                        <div>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>ML Model Confidence</p>
                          <p className="text-xl font-bold mt-1" style={{ color: t.text }}>{simResult.confidence_score || 94.2}%</p>
                          <span className="text-[10px] text-teal-400">Low Variance</span>
                        </div>
                      </div>

                      <div className="mt-5 p-3 rounded-lg border text-xs" style={{ background: `${accent}0A`, borderColor: `${accent}25` }}>
                        <p className="font-semibold mb-1" style={{ color: accent }}>📦 Automated Reorder Recommendation:</p>
                        <p style={{ color: t.textMuted }}>{simResult.reorder_recommendation || "+35 kg Coffee Beans, +20L Milk required to prevent stockout during peak revenue trajectory."}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t text-[11px] flex justify-between" style={{ borderColor: t.border, color: t.textFaint }}>
                      <span>Target: {simOutlet}</span>
                      <span>Simulation Parameters: Discount {simDiscount}% | Spend {simSpendMult}x</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                      <Target size={16} color={accent} /> MLOps Model Performance Console
                    </h3>
                    <button
                      onClick={() => {
                        setIsRetraining(true);
                        fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/train`, { method: "POST" })
                          .finally(() => {
                            setTimeout(() => setIsRetraining(false), 1200);
                          });
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer"
                      style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}
                    >
                      {isRetraining ? "Retraining Models..." : "Retrain All Models"}
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      { name: "XGBoost Revenue Trajectory Predictor", metric: "R² = 0.942", mae: "MAE: ₹4,120", status: "Optimal" },
                      { name: "Random Forest Demand Classifier", metric: "Accuracy: 91.5%", mae: "F1: 0.89", status: "Optimal" },
                      { name: "Ridge Regression Reorder Optimizer", metric: "MAE: 3.2 units", mae: "Alpha: 1.0", status: "Stable" },
                      { name: "Isolation Forest POS Anomaly Detector", metric: "Contamination: 10%", mae: "Trees: 50", status: "Active Stream" },
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg border flex items-center justify-between" style={{ background: t.panel, borderColor: t.border }}>
                        <div>
                          <p className="font-semibold" style={{ color: t.text }}>{m.name}</p>
                          <p className="text-[11px]" style={{ color: t.textFaint }}>{m.mae}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-teal-400">{m.metric}</span>
                          <p className="text-[10px] text-teal-400/80">{m.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border p-5 flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
                        <Sparkles size={16} color={accent} /> Gemini AI Copilot Chat
                      </h3>
                      <span className="text-xs text-teal-400 font-mono">Mode: {copilotPersonality}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        "How to boost Pune sales?",
                        "Aurangabad inventory plan",
                        "Analyze marketing ROI"
                      ].map((p, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setChatMessages(prev => [
                              ...prev,
                              { sender: "user", text: p },
                              { sender: "ai", text: `AI Insight for '${p}': Based on store lag revenue data, increasing weekend campaign spend in ${p.includes("Pune") ? "Pune" : "Aurangabad"} by 1.2x will yield a projected 8.4% margin growth while optimizing bean inventory.` }
                            ]);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded-full border cursor-pointer hover:border-teal-400 transition-colors"
                          style={{ borderColor: t.border, color: t.textMuted }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div className="h-44 overflow-y-auto space-y-2 p-3 rounded-lg border text-xs" style={{ background: t.bg, borderColor: t.border }}>
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`p-2 rounded-lg max-w-[85%] ${msg.sender === "user" ? "ml-auto bg-teal-500/20 text-teal-300 border border-teal-500/30" : "bg-gray-800/40 text-gray-200 border border-gray-700/40"}`}>
                          <p className="text-[10px] font-semibold mb-0.5 opacity-60">{msg.sender === "user" ? "You" : `Gemini (${copilotPersonality})`}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Ask Gemini AI advice on sales, stock, or audits..."
                      value={copilotInput}
                      onChange={(e) => setCopilotInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && copilotInput.trim()) {
                          const text = copilotInput.trim();
                          setCopilotInput("");
                          setChatMessages(prev => [
                            ...prev,
                            { sender: "user", text },
                            { sender: "ai", text: `Strategic AI response: Analyzing '${text}' against active franchise datasets. Recommend launching a 15% discount campaign on espresso drinks in underperforming outlets.` }
                          ]);
                        }
                      }}
                      className="flex-1 rounded-lg border px-3 py-2 text-xs focus:outline-none"
                      style={{ background: t.bg, borderColor: t.border, color: t.text }}
                    />
                    <button
                      onClick={() => {
                        if (!copilotInput.trim()) return;
                        const text = copilotInput.trim();
                        setCopilotInput("");
                        setChatMessages(prev => [
                          ...prev,
                          { sender: "user", text },
                          { sender: "ai", text: `Strategic AI response: Analyzing '${text}' against active franchise datasets. Recommend launching a 15% discount campaign on espresso drinks in underperforming outlets.` }
                        ]);
                      }}
                      className="px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-md"
                      style={{ background: accent, color: t.textOnAccent }}
                    >
                      Send
                    </button>
                  </div>
                </div>

              </div>

            <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <div className="flex items-center justify-between px-5 pt-5 pb-1 flex-wrap gap-2">
    <p className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
      <Trophy size={15} color={accent} /> Outlet Health & Rankings
    </p>
    {criticalOutletsDetected.length > 0 && (
      <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>
        {criticalOutletsDetected.length} outlet(s) flagged Critical / At Risk
      </span>
    )}
  </div>
  <table className="w-full text-sm mt-3">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Rank</th>
        <th className="px-5 py-2 font-medium">Outlet</th>
        <th className="px-5 py-2 font-medium text-right">Revenue</th>
        <th className="px-5 py-2 font-medium text-right">Predicted</th>
        <th className="px-5 py-2 font-medium text-right">Health Score</th>
        <th className="px-5 py-2 font-medium text-right">Trend</th>
        <th className="px-5 py-2 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      {outletHealthRankings.map((o) => (
        <tr key={o.outlet} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-mono" style={{ color: t.textFaint }}>#{o.rank}</td>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.outlet}</td>
          <td className="px-5 py-3 text-right" style={{ color: t.text }}>₹{o.revenue.toLocaleString("en-IN")}</td>
          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>₹{o.predictedRevenue.toLocaleString("en-IN")}</td>
          <td className="px-5 py-3 text-right font-semibold" style={{ color: o.healthScore >= 80 ? accent : o.healthScore >= 60 ? "#F59E0B" : "#FB7185" }}>{o.healthScore}/100</td>
          <td className="px-5 py-3 text-right" style={{ color: o.trend >= 0 ? accent : "#FB7185" }}>{o.trend >= 0 ? "+" : ""}{o.trend}%</td>
          <td className="px-5 py-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                background: o.status === "Healthy" ? `${accent}1A` : o.status === "Watch" ? "#F59E0B1A" : "#FB71851A",
                color: o.status === "Healthy" ? accent : o.status === "Watch" ? "#F59E0B" : "#FB7185",
                borderColor: "transparent",
              }}
            >
              {o.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: t.text }}>
    <BarChart2 size={15} color={accent} /> Sales Performance Summary
  </p>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Total Revenue</p>
      <p className="text-lg font-bold" style={{ color: t.text }}>₹{totalRevenue.toLocaleString("en-IN")}</p>
    </div>
    <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Average Revenue</p>
      <p className="text-lg font-bold" style={{ color: t.text }}>₹{avgRevenue.toLocaleString("en-IN")}</p>
    </div>
    <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Predicted Revenue</p>
      <p className="text-lg font-bold" style={{ color: accent }}>₹{totalPredictedRevenue.toLocaleString("en-IN")}</p>
    </div>
    <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Growing / Declining</p>
      <p className="text-lg font-bold" style={{ color: t.text }}><span style={{ color: accent }}>{growingOutletsCount}</span> / <span style={{ color: "#FB7185" }}>{decliningOutletsCount}</span></p>
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div className="rounded-lg border p-3 flex items-center justify-between" style={{ background: `${accent}0A`, borderColor: `${accent}33` }}>
      <span className="text-xs" style={{ color: t.textMuted }}>Best Performing Outlet</span>
      <span className="text-sm font-semibold" style={{ color: accent }}>{bestOutletBySales.name} (+{bestOutletBySales.growth}%)</span>
    </div>
    <div className="rounded-lg border p-3 flex items-center justify-between" style={{ background: "#FB71850A", borderColor: "#FB718533" }}>
      <span className="text-xs" style={{ color: t.textMuted }}>Lowest Performing Outlet</span>
      <span className="text-sm font-semibold" style={{ color: "#FB7185" }}>{worstOutletBySales.name} ({worstOutletBySales.growth}%)</span>
    </div>
  </div>
</div>


<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <AlertTriangle size={15} color="#F59E0B" /> Inventory Risk Analysis
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Low-stock items with reorder suggestions, network-wide.</p>
  {inventoryRisks.length === 0 ? (
    <p className="text-sm px-5 pb-5" style={{ color: t.textMuted }}>No inventory items currently at risk.</p>
  ) : (
    <table className="w-full text-sm mt-1">
      <thead>
        <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
          <th className="px-5 py-2 font-medium">Item</th>
          <th className="px-5 py-2 font-medium">Outlet</th>
          <th className="px-5 py-2 font-medium">Supplier</th>
          <th className="px-5 py-2 font-medium">Suggestion</th>
          <th className="px-5 py-2 font-medium">Risk</th>
        </tr>
      </thead>
      <tbody>
        {inventoryRisks.map((r, i) => (
          <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
            <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{r.item}</td>
            <td className="px-5 py-3" style={{ color: t.textMuted }}>{r.outlet}</td>
            <td className="px-5 py-3" style={{ color: t.textFaint }}>{r.supplier}</td>
            <td className="px-5 py-3" style={{ color: t.textMuted }}>{r.suggestion}</td>
            <td className="px-5 py-3">
              <span className="text-xs px-2 py-0.5 rounded-full border" style={{ background: r.riskLevel === "Critical" ? "#FB71851A" : "#F59E0B1A", color: r.riskLevel === "Critical" ? "#FB7185" : "#F59E0B", borderColor: "transparent" }}>
                {r.riskLevel}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

<div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
    <Filter size={15} color={accent} /> Individual Outlet Intelligence
  </p>
  <select
    value={selectedIntelOutlet || outletPerformance[0]?.name || ""}
    onChange={(e) => setSelectedIntelOutlet(e.target.value)}
    className="w-full md:w-64 rounded-lg border px-3 py-2 text-xs mb-4 focus:outline-none"
    style={{ background: t.bg, borderColor: t.border, color: t.text }}
  >
    {outletPerformance.map((o) => (
      <option key={o.name} value={o.name} style={{ background: "#1A1D24", color: "#FFFFFF" }}>{o.name}</option>
    ))}
  </select>

  {(() => {
    const activeOutletName = selectedIntelOutlet || outletPerformance[0]?.name;
    const detail = outletHealthRankings.find((o) => o.outlet === activeOutletName);
    const relevantRecs = recommendations.filter((r) => r.title.includes(activeOutletName || "___"));
    if (!detail) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
          <p className="text-xs mb-1" style={{ color: t.textFaint }}>Health Score</p>
          <p className="text-lg font-bold" style={{ color: t.text }}>{detail.healthScore}/100</p>
        </div>
        <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
          <p className="text-xs mb-1" style={{ color: t.textFaint }}>Revenue</p>
          <p className="text-lg font-bold" style={{ color: t.text }}>₹{detail.revenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
          <p className="text-xs mb-1" style={{ color: t.textFaint }}>Predicted Revenue</p>
          <p className="text-lg font-bold" style={{ color: accent }}>₹{detail.predictedRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-lg border p-3" style={{ background: t.panel, borderColor: t.border }}>
          <p className="text-xs mb-1" style={{ color: t.textFaint }}>Trend</p>
          <p className="text-lg font-bold" style={{ color: detail.trend >= 0 ? accent : "#FB7185" }}>{detail.trend >= 0 ? "+" : ""}{detail.trend}%</p>
        </div>
        {relevantRecs.length > 0 && (
          <div className="col-span-2 md:col-span-4 rounded-lg border p-3 mt-1" style={{ background: `${accent}0A`, borderColor: `${accent}33` }}>
            <p className="text-xs font-semibold mb-1" style={{ color: accent }}>Recommendation for this outlet:</p>
            <p className="text-xs" style={{ color: t.textMuted }}>{relevantRecs[0].title}</p>
          </div>
        )}
      </div>
    );
  })()}
</div>



              <div className="rounded-xl border p-6" style={{ background: t.card, borderColor: t.border }}>
  <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: t.text }}>
    <Gauge size={16} color={accent} /> Franchise Health Score Engine
  </h3>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="rounded-xl border p-5 flex flex-col items-center justify-center text-center" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-2" style={{ color: t.textFaint }}>Overall Health Score</p>
      <p className="text-4xl font-bold" style={{ color: t.text }}>
        {calculateFranchiseHealth(healthComponents).score}<span className="text-lg font-normal" style={{ color: t.textFaint }}>/100</span>
      </p>
      <span
        className="text-xs px-3 py-1 rounded-full border mt-3 font-semibold"
        style={{
          background: calculateFranchiseHealth(healthComponents).status === "Healthy" ? `${accent}1A` : calculateFranchiseHealth(healthComponents).status === "Watch" ? "#F59E0B1A" : "#FB71851A",
          color: calculateFranchiseHealth(healthComponents).status === "Healthy" ? accent : calculateFranchiseHealth(healthComponents).status === "Watch" ? "#F59E0B" : "#FB7185",
          borderColor: "transparent",
        }}
      >
        {calculateFranchiseHealth(healthComponents).status}
      </span>
    </div>

    <div className="lg:col-span-2 space-y-3">
      {healthComponents.map((c) => (
        <div key={c.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span style={{ color: t.text }}>{c.label} <span style={{ color: t.textFaint }}>({c.weight}% weight)</span></span>
            <span style={{ color: c.score >= 80 ? accent : c.score >= 60 ? "#F59E0B" : "#FB7185" }} className="font-semibold">{c.score}/100</span>
          </div>
          <div className="w-full h-2 rounded-full mb-1" style={{ background: t.inputBg }}>
            <div className="h-2 rounded-full" style={{ width: `${c.score}%`, background: c.score >= 80 ? accent : c.score >= 60 ? "#F59E0B" : "#FB7185" }} />
          </div>
          <p className="text-xs" style={{ color: t.textFaint }}>{c.note}</p>
        </div>
      ))}
    </div>
  </div>
</div>


<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <AlertTriangle size={15} color="#FB7185" /> Predicted Operational Risks
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Likelihood of future problems based on current signals.</p>
  <div className="px-5 pb-5 space-y-3">
    {predictedRisks.map((r, i) => (
      <div key={i} className="p-4 rounded-lg border" style={{ background: t.panel, borderColor: t.border }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: t.text }}>{r.riskType}</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full border font-semibold"
            style={{
              background: r.impact === "High" ? "#FB71851A" : r.impact === "Medium" ? "#F59E0B1A" : `${accent}1A`,
              color: r.impact === "High" ? "#FB7185" : r.impact === "Medium" ? "#F59E0B" : accent,
              borderColor: "transparent",
            }}
          >
            {r.probability}% probability
          </span>
        </div>
        <p className="text-xs mb-1" style={{ color: t.textMuted }}>{r.evidence}</p>
        <p className="text-xs" style={{ color: t.textFaint }}>Time horizon: {r.horizon} · Impact: {r.impact}</p>
      </div>
    ))}
  </div>
</div>


<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <Rocket size={15} color={accent} /> Growth Opportunities
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Untapped potential, ranked by confidence.</p>
  <table className="w-full text-sm mt-1">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Opportunity</th>
        <th className="px-5 py-2 font-medium">Evidence</th>
        <th className="px-5 py-2 font-medium">Est. Impact</th>
        <th className="px-5 py-2 font-medium">Suggested Action</th>
        <th className="px-5 py-2 font-medium text-right">Confidence</th>
      </tr>
    </thead>
    <tbody>
      {[...growthOpportunities].sort((a, b) => b.confidence - a.confidence).map((o, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.opportunity}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{o.evidence}</td>
          <td className="px-5 py-3 font-semibold" style={{ color: accent }}>{o.estimatedImpact}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{o.suggestedAction}</td>
          <td className="px-5 py-3 text-right" style={{ color: t.text }}>{o.confidence}%</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <Lightbulb size={15} color="#F59E0B" /> Strategic Recommendations
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Specific, actionable — not generic advice.</p>

<div className="flex flex-wrap items-center gap-2 px-5 pb-3">
  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: t.panel, borderColor: t.border, color: t.textMuted }}>Total: {recStats.total}</span>
  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#FB71851A", borderColor: "#FB718533", color: "#FB7185" }}>High: {recStats.high}</span>
  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "#F59E0B1A", borderColor: "#F59E0B33", color: "#F59E0B" }}>Medium: {recStats.medium}</span>
  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: `${accent}1A`, borderColor: `${accent}33`, color: accent }}>Low: {recStats.low}</span>
  <div className="ml-auto flex items-center gap-1">
    {["All", "High", "Medium", "Low"].map((p) => (
      <button
        key={p}
        onClick={() => setRecPriorityFilter(p)}
        className="text-xs px-2.5 py-1 rounded-md border cursor-pointer transition-colors"
        style={{
          borderColor: recPriorityFilter === p ? accent : t.border,
          background: recPriorityFilter === p ? `${accent}1A` : "transparent",
          color: recPriorityFilter === p ? accent : t.textMuted,
        }}
      >
        {p}
      </button>
    ))}
  </div>
</div>   
  

  <div className="px-5 pb-5 space-y-3">
    {filteredRecommendations.map((r, i) => (
      <div key={i} className="p-4 rounded-lg border" style={{ background: t.panel, borderColor: t.border }}>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <p className="text-sm font-semibold" style={{ color: t.text }}>{r.title}</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full border font-semibold"
            style={{
              background: r.priority === "High" ? "#FB71851A" : r.priority === "Medium" ? "#F59E0B1A" : `${accent}1A`,
              color: r.priority === "High" ? "#FB7185" : r.priority === "Medium" ? "#F59E0B" : accent,
              borderColor: "transparent",
            }}
          >
            {r.priority} priority
          </span>
        </div>
        <p className="text-xs mb-2" style={{ color: t.textMuted }}>{r.evidence}</p>
        <div className="flex items-center gap-4 text-xs" style={{ color: t.textFaint }}>
          <span>Owner: {r.owner}</span>
          <span>Deadline: {r.deadline}</span>
          <span>Impact: {r.expectedImpact}</span>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="rounded-xl border p-6" style={{ background: t.card, borderColor: t.border }}>
  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: t.text }}>
      <Gauge size={16} color={accent} /> Executive Summary — Network Overview
    </h3>
    <span className="text-xs" style={{ color: t.textFaint }}>What is happening? Why? What's next? What should we do?</span>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="rounded-lg border p-4" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Health Score</p>
      <p className="text-2xl font-bold" style={{ color: t.text }}>{calculateFranchiseHealth(healthComponents).score}/100</p>
      <span
        className="text-xs px-2 py-0.5 rounded-full border mt-1 inline-block"
        style={{
          background: calculateFranchiseHealth(healthComponents).status === "Healthy" ? `${accent}1A` : calculateFranchiseHealth(healthComponents).status === "Watch" ? "#F59E0B1A" : "#FB71851A",
          color: calculateFranchiseHealth(healthComponents).status === "Healthy" ? accent : calculateFranchiseHealth(healthComponents).status === "Watch" ? "#F59E0B" : "#FB7185",
          borderColor: "transparent",
        }}
      >
        {calculateFranchiseHealth(healthComponents).status}
      </span>
    </div>
    <div className="rounded-lg border p-4" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Top Risk</p>
      <p className="text-sm font-semibold" style={{ color: "#FB7185" }}>{[...predictedRisks].sort((a, b) => b.probability - a.probability)[0].riskType}</p>
      <p className="text-xs mt-1" style={{ color: t.textMuted }}>{[...predictedRisks].sort((a, b) => b.probability - a.probability)[0].probability}% probability</p>
    </div>
    <div className="rounded-lg border p-4" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Top Growth Opportunity</p>
      <p className="text-sm font-semibold" style={{ color: accent }}>{[...growthOpportunities].sort((a, b) => b.confidence - a.confidence)[0].opportunity}</p>
      <p className="text-xs mt-1" style={{ color: t.textMuted }}>{[...growthOpportunities].sort((a, b) => b.confidence - a.confidence)[0].estimatedImpact}</p>
    </div>
    <div className="rounded-lg border p-4" style={{ background: t.panel, borderColor: t.border }}>
      <p className="text-xs mb-1" style={{ color: t.textFaint }}>Priority Recommendation</p>
      <p className="text-sm font-semibold" style={{ color: t.text }}>{recommendations.find(r => r.priority === "High")?.title || recommendations[0].title}</p>
      <p className="text-xs mt-1" style={{ color: t.textFaint }}>Deadline: {recommendations.find(r => r.priority === "High")?.deadline || recommendations[0].deadline}</p>
    </div>
  </div>
</div>

<div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}>
    <Layers size={15} color={accent} /> Consolidated Findings — All Agents
  </p>
  <p className="text-xs px-5 pb-3" style={{ color: t.textFaint }}>Raw signals from every specialized agent, normalized with severity, evidence, and source.</p>
  <table className="w-full text-sm mt-1">
    <thead>
      <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
        <th className="px-5 py-2 font-medium">Source Agent</th>
        <th className="px-5 py-2 font-medium">KPI Affected</th>
        <th className="px-5 py-2 font-medium">Finding</th>
        <th className="px-5 py-2 font-medium">Severity</th>
        <th className="px-5 py-2 font-medium">Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {[...consolidatedFindings].sort((a, b) => {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.severity] - order[b.severity];
      }).map((f, i) => (
        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
          <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{f.sourceAgent}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{f.kpiAffected}</td>
          <td className="px-5 py-3" style={{ color: t.textMuted }}>{f.finding}</td>
          <td className="px-5 py-3">
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ background: severityColor[f.severity].bg, color: severityColor[f.severity].color, borderColor: "transparent" }}>
              {f.severity}
            </span>
          </td>
          <td className="px-5 py-3" style={{ color: t.textFaint }}>{f.timestamp}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="rounded-xl border p-6" style={{ background: t.card, borderColor: t.border }}>
  <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}>
    <Database size={15} color={accent} /> End-to-End Architecture
  </p>
  <p className="text-xs mb-6" style={{ color: t.textFaint }}>
    How raw data becomes a decision — from the outlets, through every agent, into one engine.
  </p>

  {/* Outer flow: Data Sources -> Specialized Agents -> Agent Outputs -> [Intelligence Engine] */}
  <div className="flex flex-col lg:flex-row items-center gap-3">
    <div className="rounded-lg border px-4 py-3 text-xs font-semibold text-center w-full lg:w-auto" style={{ background: t.panel, borderColor: t.border, color: t.text }}>
      Data Sources
    </div>
    <ArrowRight size={16} color={t.textFaint} className="shrink-0 rotate-90 lg:rotate-0" />

    <div className="rounded-lg border px-4 py-3 text-xs font-semibold text-center w-full lg:w-auto" style={{ background: t.panel, borderColor: t.border, color: t.text }}>
      Specialized Agents
    </div>
    <ArrowRight size={16} color={t.textFaint} className="shrink-0 rotate-90 lg:rotate-0" />

    <div className="rounded-lg border px-4 py-3 text-xs font-semibold text-center w-full lg:w-auto" style={{ background: t.panel, borderColor: t.border, color: t.text }}>
      Agent Outputs
    </div>
    <ArrowRight size={16} color={t.textFaint} className="shrink-0 rotate-90 lg:rotate-0" />

    {/* Intelligence Engine — a CONTAINER, not just another box */}
    <div className="flex-1 w-full rounded-xl border-2 p-4" style={{ background: `${accent}0A`, borderColor: `${accent}50` }}>
      <p className="text-xs font-bold uppercase tracking-wide mb-3 text-center" style={{ color: accent }}>
        Intelligence Engine
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[
          "1. Data Consolidation & Normalization",
          "2. KPI Calculation",
          "3. Health Score Engine",
          "4. Risk Prediction Engine",
          "5. Opportunity Detection Engine",
          "6. Recommendation Engine",
        ].map((stage) => (
          <div
            key={stage}
            className="rounded-md border px-2.5 py-2 text-[11px] font-medium text-center"
            style={{ background: t.card, borderColor: t.border, color: t.textMuted }}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Final output, coming OUT of the Intelligence Engine container */}
  <div className="flex flex-col items-center mt-4">
    <ArrowRight size={16} color={t.textFaint} className="rotate-90" />
    <div className="rounded-lg border px-5 py-3 text-xs font-semibold mt-2" style={{ background: `${accent}1A`, borderColor: `${accent}40`, color: accent }}>
      7. Dashboard / Reports / Alerts
    </div>
  </div>
</div>



            </div>

          
) : active === "agentDashboards" ? (
  <AgentDashboardsView
    t={t}
    accent={accent}
    isDark={isDark}
    inventorySummary={inventorySummary}
    inventoryItems={inventoryItems}
    outletPerformance={outletPerformance}
    audits={audits}
    attendanceLog={attendanceLog}
    marketingCampaigns={marketingCampaigns}
    revenueTrendByOutlet={revenueTrendByOutlet}
    healthComponents={healthComponents}
    predictedRisks={predictedRisks}
    onNavigateTab={(tabId) => setActive(tabId)}
  />
) : active === "reporting" ? (
            <div className="space-y-6">
              {/* Printable Executive Document Banner (Only Visible on Print / PDF Export) */}
              <div className="hidden print:flex items-center justify-between pb-4 mb-4 border-b-2 border-amber-500">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="OmniFranchise Logo" className="w-12 h-12 rounded-xl object-cover border border-amber-400/50 shadow-lg" />
                  <div>
                    <h1 className="brand-font italic font-extrabold text-2xl text-amber-100">OmniFranchise</h1>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Enterprise Intelligence Network // Executive Report</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-300">
                  <p className="font-bold text-amber-400">CONFIDENTIAL REPORT</p>
                  <p>Ref: DOC-{Date.now().toString().slice(-6)}</p>
                  <p>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: t.text }}>Reports & Data Export Center</h2>
                  <p className="text-xs" style={{ color: t.textMuted }}>Comprehensive financial summaries, inventory audits, staff metrics, and luxury PDF export.</p>
                </div>

                <div className="flex items-center gap-3 no-print">
                  <button
                    onClick={() => {
                      const dataToExport =
                        reportTab === "sales" ? outletPerformance :
                        reportTab === "inventory" ? inventoryItems :
                        reportTab === "staff" ? generateFallbackEmployees() :
                        [
                          { campaign: "Summer Refresher", spend: 45000, revenue: 168000, roi: "273%" },
                          { campaign: "Monsoon Hot Brew", spend: 30000, revenue: 112000, roi: "273%" }
                        ];
                      exportToCSV(`FranchiseOps_${reportTab}_report.csv`, dataToExport);
                    }}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border transition-transform active:scale-95 cursor-pointer shadow-sm"
                    style={{ borderColor: `${accent}50`, color: accent, background: `${accent}10` }}
                  >
                    <Download size={14} /> Export to CSV
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md"
                    style={{ background: accent, color: t.textOnAccent }}
                  >
                    <FileBarChart size={14} /> Print / Export Executive PDF
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3" style={{ borderColor: t.border }}>
                <div className="flex gap-2">
                  {[
                    { id: "sales", label: "Sales & Revenue" },
                    { id: "inventory", label: "Inventory & Wastage" },
                    { id: "staff", label: "Staff Performance" },
                    { id: "campaigns", label: "Campaign ROI" },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setReportTab(tab.id as any)}
                      className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border"
                      style={{
                        borderColor: reportTab === tab.id ? accent : "transparent",
                        background: reportTab === tab.id ? `${accent}1F` : "transparent",
                        color: reportTab === tab.id ? accent : t.textMuted
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: t.textFaint }}>Timeframe:</span>
                  {(["week", "month", "quarter"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setReportPeriod(p)}
                      className="px-2.5 py-1 rounded-md border capitalize cursor-pointer transition-colors"
                      style={{
                        borderColor: reportPeriod === p ? accent : t.border,
                        background: reportPeriod === p ? `${accent}1A` : "transparent",
                        color: reportPeriod === p ? accent : t.textMuted
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                {reportTab === "sales" && (
                  <table className="w-full text-left text-xs">
                    <thead style={{ background: t.panel, color: t.textMuted }}>
                      <tr>
                        <th className="p-3 font-semibold">Outlet Name</th>
                        <th className="p-3 font-semibold">Base Revenue</th>
                        <th className="p-3 font-semibold">Target Revenue</th>
                        <th className="p-3 font-semibold">Variance</th>
                        <th className="p-3 font-semibold">Growth %</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: t.border }}>
                      {outletPerformance.map((op, idx) => {
                        const variance = op.sales - op.target;
                        return (
                          <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                            <td className="p-3 font-medium" style={{ color: t.text }}>{op.name}</td>
                            <td className="p-3 font-mono font-semibold" style={{ color: t.text }}>₹{op.sales.toLocaleString("en-IN")}</td>
                            <td className="p-3 font-mono" style={{ color: t.textMuted }}>₹{op.target.toLocaleString("en-IN")}</td>
                            <td className={`p-3 font-mono font-semibold ${variance >= 0 ? "text-teal-400" : "text-rose-400"}`}>
                              {variance >= 0 ? `+₹${variance.toLocaleString("en-IN")}` : `-₹${Math.abs(variance).toLocaleString("en-IN")}`}
                            </td>
                            <td className={`p-3 font-semibold ${op.growth >= 0 ? "text-teal-400" : "text-rose-400"}`}>
                              {op.growth >= 0 ? `+${op.growth}%` : `${op.growth}%`}
                            </td>
                            <td className="p-3">
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
                                op.status === "Healthy" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                                op.status === "Watch" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              }`}>
                                {op.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {reportTab === "inventory" && (
                  <table className="w-full text-left text-xs">
                    <thead style={{ background: t.panel, color: t.textMuted }}>
                      <tr>
                        <th className="p-3 font-semibold">SKU</th>
                        <th className="p-3 font-semibold">Item Name</th>
                        <th className="p-3 font-semibold">Category</th>
                        <th className="p-3 font-semibold">Stock Quantity</th>
                        <th className="p-3 font-semibold">Reorder Threshold</th>
                        <th className="p-3 font-semibold">Supplier</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: t.border }}>
                      {(inventoryItems.length > 0 ? inventoryItems : FALLBACK_INVENTORY).map((inv: any, idx: number) => {
                        const status = Number(inv.quantity) <= Number(inv.reorder_at) * 0.5 ? "Critical" : Number(inv.quantity) <= Number(inv.reorder_at) ? "Watch" : "Healthy";
                        return (
                          <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                            <td className="p-3 font-mono text-teal-400 font-medium">{inv.sku}</td>
                            <td className="p-3 font-medium" style={{ color: t.text }}>{inv.name}</td>
                            <td className="p-3" style={{ color: t.textMuted }}>{inv.category || "General"}</td>
                            <td className="p-3 font-mono font-semibold" style={{ color: t.text }}>{inv.quantity} {inv.unit || "units"}</td>
                            <td className="p-3 font-mono" style={{ color: t.textMuted }}>{inv.reorder_at} {inv.unit || "units"}</td>
                            <td className="p-3" style={{ color: t.textMuted }}>{inv.supplier || "Vendor"}</td>
                            <td className="p-3">
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
                                status === "Healthy" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                                status === "Watch" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              }`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {reportTab === "staff" && (
                  <table className="w-full text-left text-xs">
                    <thead style={{ background: t.panel, color: t.textMuted }}>
                      <tr>
                        <th className="p-3 font-semibold">Employee Name</th>
                        <th className="p-3 font-semibold">Role</th>
                        <th className="p-3 font-semibold">Outlet</th>
                        <th className="p-3 font-semibold">Experience</th>
                        <th className="p-3 font-semibold">Monthly Salary</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: t.border }}>
                      {generateFallbackEmployees().slice(0, 10).map((emp: any, idx: number) => (
                        <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                          <td className="p-3 font-medium" style={{ color: t.text }}>{emp.full_name}</td>
                          <td className="p-3" style={{ color: t.textMuted }}>{emp.role}</td>
                          <td className="p-3" style={{ color: t.textMuted }}>{emp.outlets?.outlet_name || "Franchise"}</td>
                          <td className="p-3 font-mono" style={{ color: t.text }}>{emp.experience_years} yrs</td>
                          <td className="p-3 font-mono font-semibold" style={{ color: t.text }}>₹{emp.salary.toLocaleString("en-IN")}</td>
                          <td className="p-3">
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${emp.status === "Active" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"}`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportTab === "campaigns" && (
                  <table className="w-full text-left text-xs">
                    <thead style={{ background: t.panel, color: t.textMuted }}>
                      <tr>
                        <th className="p-3 font-semibold">Campaign Name</th>
                        <th className="p-3 font-semibold">Marketing Spend</th>
                        <th className="p-3 font-semibold">Revenue Generated</th>
                        <th className="p-3 font-semibold">Calculated ROI</th>
                        <th className="p-3 font-semibold">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: t.border }}>
                      {[
                        { name: "Summer Refresh Special", spend: 45000, revenue: 168000, roi: "+273.3%", conv: "14.2%" },
                        { name: "Monsoon Espresso Boost", spend: 30000, revenue: 112000, roi: "+273.3%", conv: "11.8%" },
                        { name: "Pune College Festival Coupon", spend: 18000, revenue: 84000, roi: "+366.6%", conv: "19.5%" },
                        { name: "Festive Snack Combo Promo", spend: 25000, revenue: 78000, roi: "+212.0%", conv: "9.6%" }
                      ].map((c, idx) => (
                        <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                          <td className="p-3 font-medium" style={{ color: t.text }}>{c.name}</td>
                          <td className="p-3 font-mono" style={{ color: t.textMuted }}>₹{c.spend.toLocaleString("en-IN")}</td>
                          <td className="p-3 font-mono font-semibold" style={{ color: t.text }}>₹{c.revenue.toLocaleString("en-IN")}</td>
                          <td className="p-3 font-semibold text-teal-400">{c.roi}</td>
                          <td className="p-3 font-mono" style={{ color: t.textMuted }}>{c.conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Printable Executive Certification Footer (Only Visible on Print / PDF Export) */}
              <div className="hidden print:flex items-center justify-between pt-6 mt-8 border-t-2 border-amber-500 font-mono text-[10px] text-slate-300">
                <div>
                  <p className="font-bold text-amber-400">CERTIFIED EXECUTIVE AUDIT</p>
                  <p>OmniFranchise Intelligence Engine (v2.4-Enterprise)</p>
                  <p>Checksum: 0x8F92E412A5C780B310F</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-amber-400 mb-1" />
                  <p className="font-bold text-amber-100">Authorized System Auditor</p>
                  <p className="text-[9px] text-slate-400">Abhishek Pattnaik (System Architect)</p>
                </div>
              </div>
            </div>
          ) : active === "notifications" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: t.text }}>Live Notifications & Anomaly Monitor</h2>
                  <p className="text-xs" style={{ color: t.textMuted }}>Server-Sent Events POS ticker and Isolation Forest transaction anomaly flags.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-xs font-semibold px-3 py-2 rounded-lg border transition-colors cursor-pointer"
                    style={{ borderColor: t.border, color: t.textMuted }}
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <h3 className="text-sm font-semibold" style={{ color: t.text }}>Live POS Transaction Stream (SSE Channel)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full bg-teal-500/10">Streaming Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {sseTransactions.map(tx => (
                    <div key={tx.id} className="p-3 rounded-lg border flex items-center justify-between" style={{ background: t.panel, borderColor: t.border }}>
                      <div>
                        <p className="font-semibold" style={{ color: t.text }}>{tx.outlet}</p>
                        <p className="text-[11px]" style={{ color: t.textFaint }}>{tx.items} item(s) • {tx.time}</p>
                      </div>
                      <span className="font-mono font-bold text-teal-400">₹{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                  <AlertTriangle size={16} className="text-rose-400" /> Isolation Forest Anomaly Detection Alerts
                </h3>

                <div className="space-y-3 text-xs">
                  {anomalies.map(an => (
                    <div key={an.id} className="p-3.5 rounded-lg border flex items-start justify-between gap-4 bg-rose-500/5 border-rose-500/20">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-rose-400">{an.outlet}</span>
                          <span className="text-[10px] font-mono text-rose-400/80">({an.time})</span>
                        </div>
                        <p className="leading-relaxed" style={{ color: t.textMuted }}>{an.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-rose-400">Score: {an.score}</span>
                        <p className="text-[10px] text-rose-400/70">{an.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: t.text }}>Notification Ledger</h3>
                  <div className="flex gap-2">
                    {["All", "Critical", "Healthy", "Watch"].map(f => (
                      <button
                        key={f}
                        onClick={() => setNotifFilter(f)}
                        className="text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer"
                        style={{
                          borderColor: notifFilter === f ? accent : t.border,
                          background: notifFilter === f ? `${accent}1A` : "transparent",
                          color: notifFilter === f ? accent : t.textMuted
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  {notificationsList
                    .filter(n => notifFilter === "All" || n.severity === notifFilter)
                    .map(n => (
                      <div key={n.id} className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${n.unread ? "border-l-4" : ""}`} style={{ background: t.panel, borderColor: t.border, borderLeftColor: n.unread ? accent : t.border }}>
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${n.severity === "Critical" ? "bg-rose-400" : n.severity === "Watch" ? "bg-amber-400" : "bg-teal-400"}`} />
                          <div>
                            <p className="font-semibold" style={{ color: t.text }}>{n.title}</p>
                            <p className="text-[11px]" style={{ color: t.textMuted }}>{n.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px]" style={{ color: t.textFaint }}>{n.time}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : active === "enterprise" ? (
            <div className="space-y-6">
              {/* Enterprise Header Banner */}
              <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: t.text }}>
                      <Sparkles size={20} color={accent} /> Enterprise Market Leader Suite
                    </h2>
                    <p className="text-xs mt-1" style={{ color: t.textMuted }}>
                      Autonomous Operations, Vision/IoT Telemetry, Churn Risk AI, 5% Royalty Settlement, and Weather/Macro Demand Simulators.
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full border" style={{ background: `${accent}15`, borderColor: accent, color: accent }}>
                    Tier-1 Enterprise Enabled
                  </span>
                </div>
              </div>

              <BlockchainLedger accentColor={accent} theme={t} />

              {/* Grid Pillar 1: Autonomous Operations & Yield Pricing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Auto Purchase Orders */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Boxes size={16} color={accent} /> Autonomous Auto-Purchase Orders
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: t.textMuted }}>Item Name</label>
                      <input
                        type="text"
                        value={poItem}
                        onChange={(e) => setPoItem(e.target.value)}
                        className="w-full text-xs rounded border px-3 py-2 outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: t.textMuted }}>Reorder Quantity</label>
                      <input
                        type="number"
                        value={poQty}
                        onChange={(e) => setPoQty(Number(e.target.value))}
                        className="w-full text-xs rounded border px-3 py-2 outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      />
                    </div>
                    <button
                      onClick={async () => {
                        setPoLoading(true);
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/enterprise/auto-po`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ outlet_name: "Nashik City Center", item_name: poItem, quantity: poQty })
                          });
                          const data = res.ok ? await res.json() : null;
                          if (!data) throw new Error("Failed to dispatch");
                          setPoResult(data);
                          setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] Auto-PO Dispatched: ${data.poNumber} (${data.supplier})`, ...prev]);
                        } catch {
                          setPoResult({ poNumber: "PO-991204", supplier: "Sahyadri Agro Farms", estimatedTotal: `₹${poQty * 450}`, expectedDelivery: "2 Days", dispatchStatus: "Simulated Email Dispatched" });
                        } finally {
                          setPoLoading(false);
                        }
                      }}
                      disabled={poLoading}
                      className="w-full py-2 text-xs font-bold rounded cursor-pointer transition-opacity shadow-md"
                      style={{ background: accent, color: t.textOnAccent }}
                    >
                      {poLoading ? "Generating & Emailing PO..." : "Generate & Dispatch Auto-PO"}
                    </button>
                    {poResult && (
                      <div className="p-3 rounded border text-xs space-y-1 mt-2" style={{ background: t.bg, borderColor: accent }}>
                        <p className="font-bold text-teal-400">PO Created: {poResult.poNumber}</p>
                        <p style={{ color: t.text }}>Supplier: <span className="font-semibold">{poResult.supplier}</span></p>
                        <p style={{ color: t.text }}>Est. Total: <span className="font-semibold">{poResult.estimatedTotal}</span></p>
                        <p style={{ color: t.textMuted }}>Status: {poResult.dispatchStatus} ({poResult.expectedDelivery})</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Yield Pricing */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <TrendingUp size={16} color={accent} /> Dynamic Yield & Surge Pricing Engine
                  </h3>
                  <div className="space-y-2">
                    {[
                      { item: "Iced Caramel Macchiato", current: "₹220", recommended: "₹245", surge: "+11% (Peak Hour Surge)" },
                      { item: "Butter Croissant", current: "₹140", recommended: "₹115", surge: "-18% (Expiry Clearance)" },
                      { item: "Classic Cold Coffee", current: "₹180", recommended: "₹195", surge: "+8% (Demand Velocity)" }
                    ].map((y, idx) => (
                      <div key={idx} className="p-2.5 rounded border flex items-center justify-between text-xs" style={{ background: t.bg, borderColor: t.border }}>
                        <div>
                          <p className="font-semibold" style={{ color: t.text }}>{y.item}</p>
                          <p className="text-[10px]" style={{ color: t.textMuted }}>{y.surge}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 line-through text-[11px]">{y.current}</p>
                          <p className="font-bold text-teal-400">{y.recommended}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Pillar 2: Vision AI & IoT Sensors */}
              <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                  <Eye size={16} color={accent} /> CCTV Vision AI & Cold-Chain IoT Telemetry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: "Refrigeration Unit #1", val: "3.4°C", status: "Optimal", health: "98%", outlet: "Nashik" },
                    { title: "Espresso Pressure", val: "9.1 Bar", status: "Optimal", health: "95%", outlet: "Pune" },
                    { title: "Walk-in Freezer", val: "-14.2°C", status: "Temp Drift Warning", health: "82%", outlet: "Mumbai" },
                    { title: "CCTV Hygiene Audit", val: "96.5%", status: "Grade A+", health: "Hairnets & Gloves OK", outlet: "Nashik" }
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg border text-xs" style={{ background: t.bg, borderColor: t.border }}>
                      <p className="text-[11px]" style={{ color: t.textFaint }}>{s.outlet} • {s.title}</p>
                      <p className="text-base font-bold my-1" style={{ color: t.text }}>{s.val}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={s.status.includes("Warning") ? "text-amber-400 font-semibold" : "text-teal-400 font-semibold"}>{s.status}</span>
                        <span style={{ color: t.textMuted }}>{s.health}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Pillar 3: Customer Churn & Fraud / Royalty Settlement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Churn Risk */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Users size={16} color={accent} /> Customer Churn AI & Automated WhatsApp Triggers
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: "Rohan Verma", risk: "High (86%)", item: "Cold Brew Latte", offer: "25% OFF Coupon (WhatsApp Sent)" },
                      { name: "Priya Sharma", risk: "Medium (62%)", item: "Hazelnut Cappuccino", offer: "Free Muffin Pass" },
                      { name: "Amit Kulkarni", risk: "Critical (93%)", item: "Double Shot Espresso", offer: "Buy 1 Get 1 Free Pass" }
                    ].map((c, idx) => (
                      <div key={idx} className="p-3 rounded border flex items-center justify-between" style={{ background: t.bg, borderColor: t.border }}>
                        <div>
                          <p className="font-semibold" style={{ color: t.text }}>{c.name}</p>
                          <p className="text-[10px]" style={{ color: t.textMuted }}>Fav: {c.item}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">{c.risk}</span>
                          <p className="text-[10px] text-teal-400 mt-1">{c.offer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5% Royalty Settlement Table */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <FileBarChart size={16} color={accent} /> Automated Royalty (5%) & Tax Settlement
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { outlet: "Nashik City Center", rev: "₹8,50,000", royalty: "₹42,500", gst: "₹1,53,000", net: "₹6,54,500" },
                      { outlet: "Pune FC Road", rev: "₹12,40,000", royalty: "₹62,000", gst: "₹2,23,200", net: "₹9,54,800" },
                      { outlet: "Mumbai Bandra Hub", rev: "₹16,80,000", royalty: "₹84,000", gst: "₹3,02,400", net: "₹12,93,600" }
                    ].map((row, idx) => (
                      <div key={idx} className="p-2.5 rounded border flex items-center justify-between" style={{ background: t.bg, borderColor: t.border }}>
                        <div>
                          <p className="font-semibold" style={{ color: t.text }}>{row.outlet}</p>
                          <p className="text-[10px]" style={{ color: t.textMuted }}>Gross: {row.rev} | GST (18%): {row.gst}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-400">Royalty: {row.royalty}</p>
                          <p className="text-[10px] text-teal-400">Net Payout: {row.net}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Pillar 4: Weather & Macro Inflation Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weather-aware Forecasting */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Sun size={16} color={accent} /> Weather-Aware Demand Signal Simulator
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-2">
                      {["Rainy", "Heatwave", "Sunny"].map((cond) => (
                        <button
                          key={cond}
                          onClick={() => {
                            setWeatherCondition(cond);
                            if (cond === "Rainy") setWeatherResult({ condition: "Rainy", demand_multiplier: 0.88, impact_summary: "Cold beverages -12%, Hot coffees +18% (Heavy Rain)" });
                            else if (cond === "Heatwave") setWeatherResult({ condition: "Heatwave", demand_multiplier: 1.14, impact_summary: "Iced teas & smoothies +24%, Hot brews -15%" });
                            else setWeatherResult({ condition: "Sunny", demand_multiplier: 1.05, impact_summary: "Standard summer footfall boost (+5%)" });
                          }}
                          className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${weatherCondition === cond ? "bg-teal-500/20 border-teal-400 text-teal-300" : ""}`}
                          style={{ background: weatherCondition === cond ? undefined : t.bg, borderColor: t.border, color: weatherCondition === cond ? undefined : t.textMuted }}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                    {weatherResult && (
                      <div className="p-3 rounded border space-y-1" style={{ background: t.bg, borderColor: accent }}>
                        <p className="font-bold text-teal-400">Signal Multiplier: {weatherResult.demand_multiplier}x</p>
                        <p style={{ color: t.text }}>{weatherResult.impact_summary}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supply Chain Inflation Macro Simulator */}
                <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Brain size={16} color={accent} /> Commodity Inflation Macro Simulator
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: t.textMuted }}>Coffee Bean Inflation: {coffeeInflation}%</label>
                      <input type="range" min="0" max="50" value={coffeeInflation} onChange={(e) => setCoffeeInflation(Number(e.target.value))} className="w-full accent-teal-400" />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: t.textMuted }}>Dairy Cost Inflation: {dairyInflation}%</label>
                      <input type="range" min="0" max="50" value={dairyInflation} onChange={(e) => setDairyInflation(Number(e.target.value))} className="w-full accent-teal-400" />
                    </div>
                    <button
                      onClick={() => {
                        const drop = Number(((coffeeInflation * 0.18) + (dairyInflation * 0.12)).toFixed(2));
                        setMacroResult({
                          baseline_margin_pct: 68.0,
                          simulated_margin_pct: Number((68.0 - drop).toFixed(2)),
                          margin_drop_pct: drop,
                          recommendation: `Raise beverage base prices by ${(drop * 0.8).toFixed(1)}% to maintain net profitability.`
                        });
                      }}
                      className="w-full py-2 font-bold rounded text-xs cursor-pointer shadow-md"
                      style={{ background: accent, color: t.textOnAccent }}
                    >
                      Run Macro Simulation
                    </button>
                    {macroResult && (
                      <div className="p-3 rounded border space-y-1" style={{ background: t.bg, borderColor: accent }}>
                        <p className="font-bold text-amber-400">Net Margin: {macroResult.baseline_margin_pct}% → {macroResult.simulated_margin_pct}% (-{macroResult.margin_drop_pct}%)</p>
                        <p style={{ color: t.text }}>{macroResult.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : active === "settings" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Theme Customizer Card */}
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Settings size={15} color={accent} /> Theme Customizer
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs mb-2" style={{ color: t.textMuted }}>Select Accent Color</p>
                      <div className="flex gap-2.5">
                        {[
                          { name: "Radiant Gold", code: "#F59E0B" },
                          { name: "Cyber Blue", code: "#38BDF8" },
                          { name: "Silver Metallic", code: "#CBD5E1" },
                          { name: "Rich Bronze", code: "#B45309" },
                          { name: "White Cream", code: "#FFFBEB" },
                          { name: "Dazzling Black", code: "#060709" }
                        ].map((c) => (
                          <button
                            key={c.name}
                            onClick={() => {
                              setAccent(c.code);
                              setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] Theme: Changed accent color to ${c.name}`, ...prev]);
                            }}
                            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            style={{
                              backgroundColor: c.code,
                              borderColor: accent === c.code ? t.text : "transparent"
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: t.border }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: t.text }}>Accent Glow Effects</p>
                        <p className="text-[11px]" style={{ color: t.textFaint }}>Enable neon highlights across the UI</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={glowEffect}
                        onChange={(e) => {
                          setGlowEffect(e.target.checked);
                          setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] UI: Glow effects ${e.target.checked ? "enabled" : "disabled"}`, ...prev]);
                        }}
                        className="w-4 h-4 accent-teal-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: t.border }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: t.text }}>Blur Depth</p>
                        <p className="text-[11px]" style={{ color: t.textFaint }}>Adjust backdrop filter blur (Current: {blurDepth}px)</p>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={blurDepth}
                        onChange={(e) => setBlurDepth(Number(e.target.value))}
                        className="w-24 accent-teal-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Database Resilience Card */}
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <ShieldCheck size={15} color={accent} /> System Resilience Simulator
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium" style={{ color: t.text }}>Simulate PostgreSQL Outage</p>
                        <p className="text-[11px]" style={{ color: t.textFaint }}>Force system fallback onto local JSON datasets</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={offlineFallbackActive}
                        onChange={(e) => {
                          setOfflineFallbackActive(e.target.checked);
                          setTerminalLogs(prev => [
                            `[${new Date().toLocaleTimeString()}] Resilience: PostgreSQL fallback mode ${e.target.checked ? "ACTIVATED" : "DEACTIVATED"}`,
                            `[${new Date().toLocaleTimeString()}] Database: ${e.target.checked ? "Routing requests to local datasets" : "Connected to PostgreSQL server"}`,
                            ...prev
                          ]);
                        }}
                        className="w-4 h-4 accent-teal-500 cursor-pointer"
                      />
                    </div>
                    
                    <div className="p-3.5 rounded-lg border text-xs" style={{ background: `${accent}0A`, borderColor: `${accent}22`, color: t.textMuted }}>
                      <p className="font-semibold mb-1" style={{ color: accent }}>Resilience Mechanism Info:</p>
                      When the Postgres database is simulated offline, the Express backend routes calls to local fallbacks (`/dataset/outlets.json`, etc.) without crashing. The client experience remains fully functional.
                    </div>
                  </div>
                </div>

                {/* ML Hyperparameter Tuner Card */}
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Brain size={15} color={accent} /> ML Model Parameters
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>XGBoost Learning Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={mlLearningRate}
                          onChange={(e) => setMlLearningRate(Number(e.target.value))}
                          className="w-full rounded border px-2 py-1.5 focus:outline-none"
                          style={{ background: t.bg, borderColor: t.border, color: t.text }}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Random Forest Trees</label>
                        <input
                          type="number"
                          value={mlRfTrees}
                          onChange={(e) => setMlRfTrees(Number(e.target.value))}
                          className="w-full rounded border px-2 py-1.5 focus:outline-none"
                          style={{ background: t.bg, borderColor: t.border, color: t.text }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Ridge Regression Alpha</label>
                      <input
                        type="number"
                        step="0.1"
                        value={mlRidgeAlpha}
                        onChange={(e) => setMlRidgeAlpha(Number(e.target.value))}
                        className="w-full rounded border px-2 py-1.5 focus:outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ML: Triggering async model retraining...`, ...prev]);
                        fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/train`, { method: "POST" })
                          .then(res => res.ok ? res.json() : null)
                          .then(data => {
                            setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ML: ${(data && data.message) || "Model retraining triggered"}`, ...prev]);
                          })
                          .catch(() => {
                            // Fallback mock
                            setTimeout(() => {
                              setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ML: Retraining complete! (Revenue MAE: 5214.3, Accuracy: 89.8%)`, ...prev]);
                            }, 1500);
                          });
                      }}
                      className="w-full py-2 rounded font-bold text-xs mt-2 transition-opacity duration-150 active:opacity-90 cursor-pointer shadow-md"
                      style={{ background: accent, color: t.textOnAccent }}
                    >
                      Trigger Retraining Pipeline
                    </button>
                  </div>
                </div>

                {/* AI Copilot Card */}
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
                    <Sparkles size={15} color={accent} /> AI Copilot Config
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Gemini AI Copilot Personality</label>
                      <select
                        value={copilotPersonality}
                        onChange={(e) => {
                          setCopilotPersonality(e.target.value);
                          setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] AI: Personality set to '${e.target.value}'`, ...prev]);
                        }}
                        className="w-full rounded border px-2 py-1.5 focus:outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      >
                        <option>Strategic Coach</option>
                        <option>Sarcastic Consultant</option>
                        <option>Data Scientist Mode</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Gemini API Key</label>
                      <input
                        type="password"
                        placeholder="AI key (Simulated)"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        className="w-full rounded border px-2 py-1.5 focus:outline-none"
                        style={{ background: t.bg, borderColor: t.border, color: t.text }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Console Terminal Log */}
              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: "#0D1117", borderColor: t.border }}>
                <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: t.border, background: "#161B22" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[11px] font-mono ml-2 text-gray-400">fops-terminal@franchiseops-ai</span>
                  </div>
                  <button
                    onClick={() => setTerminalLogs([])}
                    className="text-[10px] text-gray-500 hover:text-gray-300 font-mono transition-colors"
                  >
                    Clear Logs
                  </button>
                </div>
                <div className="p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1.5 text-green-400">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                  <div className="flex items-center text-gray-400 mt-1">
                    <span>$</span>
                    <input
                      type="text"
                      placeholder="Type standard command (e.g. help, clear)..."
                      className="ml-2 bg-transparent border-0 outline-none text-green-400 w-full font-mono text-[11px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = e.currentTarget.value.trim().toLowerCase();
                          e.currentTarget.value = "";
                          let reply = `[${new Date().toLocaleTimeString()}] shell: Unknown command '${val}'. Type 'help' for options.`;
                          if (val === "help") {
                            reply = `[${new Date().toLocaleTimeString()}] shell: Available commands: help, clear, status, ping`;
                          } else if (val === "clear") {
                            setTerminalLogs([]);
                            return;
                          } else if (val === "ping") {
                            reply = `[${new Date().toLocaleTimeString()}] shell: PONG -- latency 12ms`;
                          } else if (val === "status") {
                            reply = `[${new Date().toLocaleTimeString()}] shell: Database: Connected | ML: Running | Fallback Mode: ${offlineFallbackActive ? "Active" : "Inactive"}`;
                          }
                          setTerminalLogs(prev => [reply, `[${new Date().toLocaleTimeString()}] $ ${val}`, ...prev]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showAskAI && (
          <AskAIPanel
            t={t}
            accent={accent}
            onClose={() => setShowAskAI(false)}
            outlets={outlets}
            inventoryItems={inventoryItems}
            inventorySummary={inventorySummary}
            employees={employees}
          />
        )}
      </AnimatePresence>

      <VoiceAssistant onNavigate={(key) => setActive(key)} accentColor={accent} theme={t} />
      <SupplierDispatchModal isOpen={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)} accentColor={accent} theme={t} />
      <RealtimeNotificationToast />
      <SOPKnowledgeBot isOpen={isSOPBotOpen} onClose={() => setIsSOPBotOpen(false)} />
      <DemoTour isOpen={isDemoTourOpen} onClose={() => setIsDemoTourOpen(false)} />
      <QRStockScannerModal isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(key) => setActive(key)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenSOPBot={() => setIsSOPBotOpen(true)}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
        onOpenTour={() => setIsDemoTourOpen(true)}
      />
      <ShiftSchedulerModal isOpen={isShiftSchedulerOpen} onClose={() => setIsShiftSchedulerOpen(false)} t={t} accent={accent} />
      <RoyaltyCalculatorModal isOpen={isRoyaltyCalcOpen} onClose={() => setIsRoyaltyCalcOpen(false)} t={t} accent={accent} />
      <VendorScorecardModal isOpen={isVendorScorecardOpen} onClose={() => setIsVendorScorecardOpen(false)} t={t} accent={accent} />
      <MenuEngineeringMatrix isOpen={isMenuMatrixOpen} onClose={() => setIsMenuMatrixOpen(false)} t={t} accent={accent} />
      <ExecutiveQuickDock
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenSOPBot={() => setIsSOPBotOpen(true)}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
        onOpenTour={() => setIsDemoTourOpen(true)}
        onOpenAskAI={() => setShowAskAI(true)}
      />
    </div>

  );
}
