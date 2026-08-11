"use client";

import React, { useState, useEffect } from "react";
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
  Target, Percent, Lightbulb, Tag, PieChart, Share2, CalendarClock, Globe, Truck, Trophy, Boxes as BoxesIcon, Languages
} from "lucide-react";
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
import { playTechChime } from "../lib/WebAudioSFX";
import { CURRENCY_CONFIGS, CurrencyCode, formatCurrencyValue } from "../lib/CurrencyEngine";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const themes = {
  dark: {
    bg: "transparent", panel: "rgba(11, 13, 18, 0.82)", card: "rgba(17, 19, 26, 0.76)", border: "rgba(245, 158, 11, 0.16)",
    text: "#FFFBEB", textMuted: "#CBD5E1", textFaint: "#94A3B8", textOnAccent: "#060709",
    gridLine: "rgba(203, 213, 225, 0.14)", inputBg: "rgba(6, 7, 9, 0.85)",
  },
  light: {
    bg: "#F4F6F8", panel: "#FFFFFF", card: "#FFFFFF", border: "#E2E8F0",
    text: "#1E293B", textMuted: "#475569", textFaint: "#64748B", textOnAccent: "#FFFFFF",
    gridLine: "#E2E8F0", inputBg: "#F1F5F9",
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
const pinColor: Record<string, string> = { Healthy: "#F59E0B", Watch: "#38BDF8", Critical: "#B45309" };


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

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 200);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

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
    <div className="w-full min-h-[800px] flex items-center justify-center font-sans" style={{ background: "transparent", color: t.text }}>
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

  function setActive(moduleKey: string) {
    setActiveState(moduleKey);
    if (typeof window !== "undefined") {
      const routeMap: Record<string, string> = {
        dashboard: "/",
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
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Additional state for Audit, Intelligence, Reporting, and Notifications
  const [audits, setAudits] = useState([
    { id: 1, outlet_id: 1, outlet_name: "Nashik City Center", date: "2026-08-03", score: 96, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 2, outlet_id: 2, outlet_name: "Pune FC Road", date: "2026-08-04", score: 88, status: "Healthy", inspector: "Abhishek Pattnaik" },
    { id: 3, outlet_id: 3, outlet_name: "Mumbai Andheri East", date: "2026-08-04", score: 62, status: "Watch", inspector: "Abhishek Pattnaik" },
    { id: 4, outlet_id: 5, outlet_name: "Aurangabad CIDCO", date: "2026-08-05", score: 44, status: "Critical", inspector: "Abhishek Pattnaik" },
    { id: 5, outlet_id: 6, outlet_name: "Thane Estate", date: "2026-08-05", score: 92, status: "Healthy", inspector: "Priya Sharma" },
  ]);
  const [auditFilter, setAuditFilter] = useState("All");
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [newAuditForm, setNewAuditForm] = useState({
    outletId: "1",
    outletName: "Nashik City Center",
    inspector: "Manager",
    tempCheck: true,
    cleanlinessCheck: true,
    registerCheck: true,
    safetyCheck: false,
    score: 75,
  });
  const [auditSubTab, setAuditSubTab] = useState<"overview" | "operational" | "ai_photo" | "architecture">("overview");
  const [auditModalMode, setAuditModalMode] = useState<"manual" | "ai_photo">("manual");
  const [aiPhotoCategory, setAiPhotoCategory] = useState("Branding & Store Layout");
  const [aiPhotoOutlet, setAiPhotoOutlet] = useState("Nashik City Center");
  const [aiPhotoAnalyzing, setAiPhotoAnalyzing] = useState(false);
  const [aiPhotoResult, setAiPhotoResult] = useState<any>(null);
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
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("EN");

  const SEARCH_DESTINATIONS = [
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
      .then((res) => res.json())
      .then((data) => setEmployees(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setStaffLoading(false));
  }, [isLoggedIn, active]);

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
      .then((res) => res.json())
      .then((data) => setOutlets(Array.isArray(data) ? data : []))
      .catch(() => setOutlets([]));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || active !== "inventory") return;

    setInventoryLoading(true);
    setInventoryError(null);

    const params = new URLSearchParams();
    if (inventoryOutletId !== "All") params.set("outlet_id", inventoryOutletId);
    if (inventoryQuery) params.set("search", inventoryQuery);

    const authHeaders = { Authorization: `Bearer ${sessionStorage.getItem("fops_token")}` };

    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory?${params.toString()}`, { headers: authHeaders }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/summary`, { headers: authHeaders }).then((res) => res.json()),
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

  if (checkingAuth) {
    return <AppSplashLoader t={t} accent={accent} label="Initializing OmniFranchise AI Network..." onComplete={() => setCheckingAuth(false)} />;
  }

  if (!isLoggedIn) {
    return <LoginPage t={t} accent={accent} onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="w-full min-h-[800px] flex font-sans transition-colors duration-200" style={{ background: t.bg, color: t.text }}>
      <aside className="w-64 flex flex-col shrink-0 border-r transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
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

      <main className="flex-1 overflow-y-auto">
        <AnomalyAlertBanner
          alert={activeAlertBanner}
          onClose={() => setActiveAlertBanner(null)}
          onInspect={() => setActive("notifications")}
          accentColor={accent}
          theme={t}
        />
        <div className="border-b px-6 py-3 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
          <div className="relative flex-1 min-w-[240px] max-w-xl">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm border focus-within:border-amber-400 transition-colors" style={{ background: t.inputBg, borderColor: t.border }}>
              <Search size={14} color={t.textFaint} />
              <input
                type="text"
                placeholder="Search modules, outlets, pages..."
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
                className="w-full bg-transparent outline-none text-xs"
                style={{ color: t.text }}
              />
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

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap shrink-0">
            {/* Multi-Tier Role Switcher */}
            <RoleSwitcher
              activeRole={activeRole}
              onChangeRole={setActiveRole}
              accentColor={accent}
              theme={t}
            />
            {/* WhatsApp Supplier Dispatch Trigger */}
            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-semibold transition-all hover:scale-105"
              style={{ background: "#25D36620", borderColor: "#25D36640", color: "#25D366" }}
            >
              <Truck size={14} /> Supplier PO Dispatch
            </button>

            <button
              onClick={() => setShowAskAI(true)}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors"
              style={{ borderColor: `${accent}4D`, color: accent }}
            >
              <Sparkles size={14} /> Ask AI
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border transition-colors"
              style={{ borderColor: t.border, color: t.textMuted }}
              aria-label="Toggle dark/light mode"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? "Light" : "Dark"}
            </button>
            <button
              onClick={handleSignOut}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-xs font-bold"
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
                    <div key={k.label} className="rounded-xl border p-4 transition-all duration-300 stat-card-glow border-t-2" style={{ background: t.card, borderColor: t.border, borderTopColor: accent }}>
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

              <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Franchise Network Map</p>
                <p className="text-xs mb-4" style={{ color: t.textFaint }}>Every outlet connected to the franchise hub — bubble size shows revenue share</p>
                <div className="w-full flex justify-center">
                  <svg viewBox="0 0 400 340" className="w-full max-w-md">
                    {networkNodes.map((n) => {
                      const rad = (n.angle * Math.PI) / 180;
                      const cx = 200 + 130 * Math.cos(rad);
                      const cy = 170 + 130 * Math.sin(rad);
                      return <line key={`line-${n.name}`} x1={200} y1={170} x2={cx} y2={cy} stroke={t.gridLine} strokeWidth={1.5} />;
                    })}
                    <circle cx={200} cy={170} r={30} fill={accent} opacity={0.9} />
                    <text x={200} y={174} textAnchor="middle" fontSize={10} fontWeight={600} fill={t.bg}>Hub</text>
                    {networkNodes.map((n) => {
                      const rad = (n.angle * Math.PI) / 180;
                      const cx = 200 + 130 * Math.cos(rad);
                      const cy = 170 + 130 * Math.sin(rad);
                      const r = 14 + (n.revenue / 154000) * 22;
                      return (
                        <g key={n.name}>
                          <circle cx={cx} cy={cy} r={r} fill={pinColor[n.status]} opacity={0.85} />
                          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={600} fill={t.bg}>{n.name.split(" ")[0]}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex items-center gap-4 mt-2 justify-center text-[11px]" style={{ color: t.textFaint }}>
                  {["Healthy", "Watch", "Critical"].map((s) => (
                    <span key={s} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: pinColor[s] }} />
                      {s}
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
                                  <Star size={12} color="#F59E0B" fill="#F59E0B" /> {c.rating}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <button
                                  onClick={() => handleQuickHire(c)}
                                  disabled={alreadyHired}
                                  className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                                  style={{
                                    background: alreadyHired ? t.inputBg : accent,
                                    color: alreadyHired ? t.textFaint : t.bg,
                                    cursor: alreadyHired ? "default" : "pointer",
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
                  { label: "Active Campaigns", value: String(marketingCampaigns.length), icon: Megaphone },
                  { label: "Total Reach", value: totalReach.toLocaleString("en-IN"), icon: Users },
                  { label: "Avg Engagement", value: `${avgEngagement}%`, icon: Percent },
                  { label: "Avg ROI", value: `${avgROI}x`, icon: Target },
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
              {/* Header & Sub-Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: t.text }}>
                    <ShieldCheck size={22} color={accent} /> Audit Agent & Quality Inspector
                  </h2>
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    AI & rule-based automatic franchise compliance checker, CCTV telemetry, SOP library, and store photo vision inspection.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAuditModalMode("manual");
                      setShowAuditModal(true);
                    }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md"
                    style={{ background: accent, color: t.textOnAccent }}
                  >
                    <ShieldCheck size={15} /> Submit New Audit
                  </button>
                  <button
                    onClick={() => {
                      setAuditModalMode("ai_photo");
                      setShowAuditModal(true);
                    }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    📷 Run AI Photo Inspection
                  </button>
                </div>
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto" style={{ borderColor: t.border }}>
                {[
                  { id: "overview", label: "Audit Overview & History", icon: "🛡️" },
                  { id: "operational", label: "Operational Compliance (Slide 4)", icon: "⚡" },
                  { id: "ai_photo", label: "AI Store Photo Vision Audit (Slide 5)", icon: "📷" },
                  { id: "architecture", label: "Audit Agent Architecture (Slide 3)", icon: "🏗️" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAuditSubTab(tab.id as any)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all cursor-pointer whitespace-nowrap"
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

              {/* Sub-Tab 1: Overview & History */}
              {auditSubTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-xs" style={{ color: t.textFaint }}>Network Audit Score</p>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-bold" style={{ color: t.text }}>88<span className="text-sm font-normal" style={{ color: t.textFaint }}>/100</span></span>
                        <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">Healthy</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>+4 pts vs last quarter</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-xs" style={{ color: t.textFaint }}>SOP Compliance Rate</p>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-bold" style={{ color: t.text }}>94.2%</span>
                        <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">High</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>24/25 checks passed</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-xs" style={{ color: t.textFaint }}>Audits This Month</p>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-bold" style={{ color: t.text }}>{audits.length}</span>
                        <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">On Schedule</span>
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: t.textMuted }}>Next audit: Solapur</p>
                    </div>

                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-xs" style={{ color: t.textFaint }}>Flagged Outlets</p>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-bold text-rose-400">1</span>
                        <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">Re-Audit Req</span>
                      </div>
                      <p className="text-[11px] mt-2 text-rose-400 font-medium">Aurangabad CIDCO (Score: 44)</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: t.text }}>Standard Operating Procedures (SOP Library)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "Food Safety & Temp", ver: "v2.4", date: "Updated Jul 2026", items: "12 Checkpoints", desc: "Cold storage <= 4°C, hot display >= 63°C hygiene compliance." },
                        { title: "Opening / Closing Protocol", ver: "v3.1", date: "Updated Jun 2026", items: "18 Checkpoints", desc: "POS reconciliation, alarm setup, sanitization sign-off." },
                        { title: "Cash Register Audit", ver: "v1.8", date: "Updated May 2026", items: "8 Checkpoints", desc: "Shift register balancing, drop box verification, receipt logs." },
                        { title: "Staff Hygiene & Attire", ver: "v2.0", date: "Updated Aug 2026", items: "6 Checkpoints", desc: "Hairnets, apron standards, handwashing logging." }
                      ].map((sop, idx) => (
                        <div key={idx} className="rounded-xl border p-4 flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-semibold text-teal-400">{sop.ver}</span>
                              <span className="text-[10px]" style={{ color: t.textFaint }}>{sop.date}</span>
                            </div>
                            <h4 className="text-sm font-semibold mb-1" style={{ color: t.text }}>{sop.title}</h4>
                            <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{sop.desc}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: t.border }}>
                            <span className="text-[11px] font-medium" style={{ color: t.textFaint }}>{sop.items}</span>
                            <button className="text-xs font-semibold cursor-pointer" style={{ color: accent }}>View Standard →</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
                      <h3 className="text-sm font-semibold" style={{ color: t.text }}>Recent Outlet Audit History</h3>
                      <div className="flex items-center gap-2">
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
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: t.border }}>
                          {audits
                            .filter(a => auditFilter === "All" || a.status === auditFilter)
                            .map(audit => (
                              <tr key={audit.id} className="hover:bg-teal-500/5 transition-colors">
                                <td className="p-3 font-mono font-medium" style={{ color: t.textFaint }}>#AUD-{audit.id}</td>
                                <td className="p-3 font-medium" style={{ color: t.text }}>{audit.outlet_name}</td>
                                <td className="p-3" style={{ color: t.textMuted }}>{audit.date}</td>
                                <td className="p-3 font-medium text-teal-400">{(audit as any).category || "SOP Inspection"}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-700/30 rounded-full h-2 overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${audit.score}%`,
                                          backgroundColor: audit.score >= 80 ? "#2DD4BF" : audit.score >= 50 ? "#F59E0B" : "#FB7185"
                                        }}
                                      />
                                    </div>
                                    <span className="font-semibold" style={{ color: t.text }}>{audit.score}/100</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
                                    audit.status === "Healthy" ? "bg-teal-500/10 text-teal-400 border-teal-500/30" :
                                    audit.status === "Watch" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                    "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  }`}>
                                    {audit.status}
                                  </span>
                                </td>
                                <td className="p-3" style={{ color: t.textMuted }}>{audit.inspector}</td>
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
                    <span className="text-xs px-3 py-1 rounded-full font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">Real-Time Data Feed Active</span>
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
                        📷 Validate Franchise Standards with AI Store Photo Analysis (Slide 5)
                      </h3>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Upload store photos or trigger instant AI vision analysis to verify branding, logo placement, uniform adherence, cleanliness, and front-row product alignment.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Input Form & Upload Trigger */}
                    <div className="rounded-xl border p-5 space-y-4" style={{ background: t.card, borderColor: t.border }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">AI Vision Audit Controls</h4>
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

                      <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2 cursor-pointer hover:border-teal-400 transition-colors" style={{ borderColor: t.border }}>
                        <div className="w-10 h-10 mx-auto rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-lg">
                          📷
                        </div>
                        <p className="text-xs font-medium" style={{ color: t.text }}>Drop uploaded store photo here or click to select</p>
                        <p className="text-[10px]" style={{ color: t.textFaint }}>Supports JPG, PNG, WEBP (Max 15MB)</p>
                      </div>

                      <button
                        disabled={aiPhotoAnalyzing}
                        onClick={() => {
                          setAiPhotoAnalyzing(true);
                          fetch(`${API_BASE_URL}/api/compliance/analyze-photo`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              outlet_id: aiPhotoOutlet.includes("Aurangabad") ? 4 : 1,
                              outlet_name: aiPhotoOutlet,
                              photo_category: aiPhotoCategory,
                              inspector: "Computer Vision AI v4.2"
                            })
                          })
                          .then(res => res.json())
                          .then(data => {
                            setAiPhotoResult(data);
                            setAiPhotoAnalyzing(false);
                            if (data.id) setAudits(prev => [data, ...prev]);
                          })
                          .catch(() => {
                            setAiPhotoAnalyzing(false);
                          });
                        }}
                        className="w-full py-2.5 rounded-lg font-bold text-xs cursor-pointer shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                        style={{ background: accent, color: t.textOnAccent }}
                      >
                        {aiPhotoAnalyzing ? "Running AI Vision Model..." : "Run AI Photo Vision Inspection"}
                      </button>
                    </div>

                    {/* Right: Vision Model Results Card */}
                    <div className="lg:col-span-2 rounded-xl border p-5 space-y-4" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">AI Vision Inspection Diagnostic Output</h4>
                        {aiPhotoResult && (
                          <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                            AI Score: {aiPhotoResult.score} / 100 ({aiPhotoResult.status})
                          </span>
                        )}
                      </div>

                      {aiPhotoAnalyzing ? (
                        <div className="py-16 text-center space-y-3">
                          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-xs font-semibold" style={{ color: t.text }}>Scanning Store Photo & Detecting Objects...</p>
                          <p className="text-[11px]" style={{ color: t.textMuted }}>Evaluating logo visibility, staff uniforms, counter cleanliness, and shelf positioning.</p>
                        </div>
                      ) : aiPhotoResult ? (
                        <div className="space-y-4 text-xs">
                          {/* Simulated Vision Overlay Visual */}
                          <div className="relative rounded-xl overflow-hidden border h-48 bg-slate-900 flex items-center justify-center p-4" style={{ borderColor: t.border }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
                            <div className="z-10 text-center space-y-2">
                              <span className="text-3xl">🏬</span>
                              <p className="font-mono text-teal-300 font-bold">{aiPhotoResult.category}</p>
                              <div className="flex flex-wrap gap-2 justify-center">
                                {aiPhotoResult.ai_metrics?.detected_objects?.map((obj: string, i: number) => (
                                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    [✓] {obj}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-lg border text-center" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[10px] text-slate-400 block">Branding & Logo</span>
                              <span className="text-base font-bold text-teal-400">{aiPhotoResult.ai_metrics?.branding_logo_score}%</span>
                            </div>
                            <div className="p-3 rounded-lg border text-center" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[10px] text-slate-400 block">Uniforms & Attire</span>
                              <span className="text-base font-bold text-blue-400">{aiPhotoResult.ai_metrics?.uniform_attire_score}%</span>
                            </div>
                            <div className="p-3 rounded-lg border text-center" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[10px] text-slate-400 block">Store Cleanliness</span>
                              <span className="text-base font-bold text-purple-400">{aiPhotoResult.ai_metrics?.cleanliness_score}%</span>
                            </div>
                            <div className="p-3 rounded-lg border text-center" style={{ background: t.panel, borderColor: t.border }}>
                              <span className="text-[10px] text-slate-400 block">Product Placement</span>
                              <span className="text-base font-bold text-amber-400">{aiPhotoResult.ai_metrics?.product_placement_score}%</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg border space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                            <p className="font-bold text-xs text-teal-400">AI Diagnostic Summary:</p>
                            <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{aiPhotoResult.details}</p>
                          </div>

                          {aiPhotoResult.ai_metrics?.corrective_actions?.length > 0 && (
                            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 space-y-2">
                              <p className="font-bold text-xs text-rose-400">⚠️ Automated Corrective Action Plan Generated:</p>
                              <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-1">
                                {aiPhotoResult.ai_metrics.corrective_actions.map((act: string, idx: number) => (
                                  <li key={idx}>{act}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-16 text-center space-y-2" style={{ color: t.textMuted }}>
                          <span className="text-3xl block">📸</span>
                          <p className="text-xs">Click "Run AI Photo Vision Inspection" to analyze store photos.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Audit Agent System Architecture (Slide 3 & Slide 1) */}
              {auditSubTab === "architecture" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: t.card, borderColor: t.border }}>
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: t.text }}>
                        🏗️ System Architecture & Engine Workflow (Slide 3)
                      </h3>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        Overview of data ingestion pipelines, automated rule validation engine, AI vision models, and real-time output delivery.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Data Sources */}
                    <div className="rounded-xl border p-4 space-y-3" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-400 border-b pb-2" style={{ borderColor: t.border }}>
                        <span>1. INGESTION DATA SOURCES</span>
                      </div>
                      {[
                        { title: "POS Transactions", desc: "Real-time register balancing & anomaly detection", status: "Active" },
                        { title: "Attendance Logs", desc: "Biometric clock-in & shift coverage indexing", status: "Active" },
                        { title: "Inventory Telemetry", desc: "Stock updates, shelf levels & reorder checkpoints", status: "Active" },
                        { title: "CCTV & Vision Streams", desc: "Kitchen cleanliness & staff hairnet/glove detection", status: "Active" },
                        { title: "Customer Feedback & NPS", desc: "Direct reviews & complaint turnaround time", status: "Active" },
                        { title: "SOP Document Checklist", desc: "Standard Operating Procedure version compliance", status: "Active" },
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg border text-xs flex items-center justify-between" style={{ background: t.panel, borderColor: t.border }}>
                          <div>
                            <p className="font-semibold" style={{ color: t.text }}>{item.title}</p>
                            <p className="text-[10px]" style={{ color: t.textFaint }}>{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-teal-400 font-mono">LIVE</span>
                        </div>
                      ))}
                    </div>

                    {/* Column 2: Audit Engine */}
                    <div className="rounded-xl border p-4 space-y-3" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-400 border-b pb-2" style={{ borderColor: t.border }}>
                        <span>2. AUDIT ENGINE PROCESSORS</span>
                      </div>
                      {[
                        { title: "Rule Validation Engine", desc: "Checks threshold breaches & SOP adherence" },
                        { title: "AI Image & Vision Inspector", desc: "Computer vision photo analysis for branding & attire" },
                        { title: "Policy Checker", desc: "Automated franchise policy rule verification" },
                        { title: "Report & Digest Generator", desc: "Aggregates compliance scores into audit summaries" },
                        { title: "Fraud & Isolation Forest Model", desc: "Detects cash closing & POS receipt discrepancies" }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-lg border text-xs space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                          <p className="font-bold text-purple-300">{item.title}</p>
                          <p className="text-[11px]" style={{ color: t.textMuted }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Column 3: Outputs */}
                    <div className="rounded-xl border p-4 space-y-3" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b pb-2" style={{ borderColor: t.border }}>
                        <span>3. DELIVERED OUTPUTS</span>
                      </div>
                      {[
                        { title: "Executive Dashboard", desc: "Network-wide compliance scores & outlet health cards" },
                        { title: "Real-Time SSE Alerts", desc: "Instant push notifications for critical compliance drops" },
                        { title: "Compliance Scores (0-100)", desc: "Healthy / Watch / Critical automated grading" },
                        { title: "Corrective Action Tasks", desc: "Auto-generated action items for outlet managers" },
                        { title: "Blockchain Immutable Ledger", desc: "Cryptographic SHA-256 audit log of all inspector reports" }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-lg border text-xs space-y-1" style={{ background: t.panel, borderColor: t.border }}>
                          <p className="font-bold text-amber-300">{item.title}</p>
                          <p className="text-[11px]" style={{ color: t.textMuted }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Audit Modal with Dual Mode (Manual vs AI Photo) */}
              {showAuditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                      <h3 className="text-base font-bold flex items-center gap-2" style={{ color: t.text }}>
                        <ShieldCheck size={18} color={accent} /> Submit Outlet Compliance Audit
                      </h3>
                      <button onClick={() => setShowAuditModal(false)} className="text-sm cursor-pointer" style={{ color: t.textFaint }}>✕</button>
                    </div>

                    {/* Modal Mode Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-lg border text-xs" style={{ background: t.panel, borderColor: t.border }}>
                      <button
                        onClick={() => setAuditModalMode("manual")}
                        className="py-1.5 rounded font-semibold cursor-pointer transition-colors"
                        style={{
                          background: auditModalMode === "manual" ? accent : "transparent",
                          color: auditModalMode === "manual" ? t.textOnAccent : t.textMuted
                        }}
                      >
                        Manual SOP Checklist
                      </button>
                      <button
                        onClick={() => setAuditModalMode("ai_photo")}
                        className="py-1.5 rounded font-semibold cursor-pointer transition-colors"
                        style={{
                          background: auditModalMode === "ai_photo" ? "#9333EA" : "transparent",
                          color: auditModalMode === "ai_photo" ? "#FFFFFF" : t.textMuted
                        }}
                      >
                        📷 AI Store Photo Upload
                      </button>
                    </div>

                    {auditModalMode === "manual" ? (
                      <div className="space-y-3 text-xs">
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
                          <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Inspector Name</label>
                          <input
                            type="text"
                            value={newAuditForm.inspector}
                            onChange={(e) => setNewAuditForm(prev => ({ ...prev, inspector: e.target.value }))}
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                            style={{ background: t.bg, borderColor: t.border, color: t.text }}
                          />
                        </div>

                        <div className="space-y-2 border-t pt-3" style={{ borderColor: t.border }}>
                          <p className="font-semibold text-xs mb-2" style={{ color: t.text }}>SOP Checklist Items</p>
                          {[
                            { key: "tempCheck", label: "Cold Storage & Food Temp Compliance (<= 4°C)" },
                            { key: "cleanlinessCheck", label: "Kitchen & Counter Surface Disinfection" },
                            { key: "registerCheck", label: "Cash Register & Billing Reconciliation" },
                            { key: "safetyCheck", label: "Fire Safety & First-Aid Equipment Check" },
                          ].map(item => (
                            <label key={item.key} className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer" style={{ background: t.panel, borderColor: t.border }}>
                              <span style={{ color: t.textMuted }}>{item.label}</span>
                              <input
                                type="checkbox"
                                checked={(newAuditForm as any)[item.key]}
                                onChange={(e) => {
                                  const updated = { ...newAuditForm, [item.key]: e.target.checked };
                                  const count = [updated.tempCheck, updated.cleanlinessCheck, updated.registerCheck, updated.safetyCheck].filter(Boolean).length;
                                  const calculatedScore = count * 25;
                                  setNewAuditForm({ ...updated, score: calculatedScore });
                                }}
                                className="w-4 h-4 accent-teal-500 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>

                        <div className="p-3 rounded-lg border flex items-center justify-between font-medium" style={{ background: `${accent}10`, borderColor: `${accent}30` }}>
                          <span style={{ color: t.text }}>Calculated Score:</span>
                          <span className="text-base font-bold" style={{ color: accent }}>{newAuditForm.score} / 100</span>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setShowAuditModal(false)}
                            className="flex-1 py-2 rounded-lg border font-medium text-xs cursor-pointer"
                            style={{ borderColor: t.border, color: t.textMuted }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const status = newAuditForm.score >= 80 ? "Healthy" : newAuditForm.score >= 50 ? "Watch" : "Critical";
                              const newRecord = {
                                id: audits.length + 1,
                                outlet_id: Number(newAuditForm.outletId),
                                outlet_name: newAuditForm.outletName,
                                date: new Date().toISOString().split("T")[0],
                                score: newAuditForm.score,
                                status,
                                inspector: newAuditForm.inspector || "Manager",
                                category: "Manual SOP Checklist"
                              };
                              setAudits(prev => [newRecord, ...prev]);
                              setShowAuditModal(false);
                              fetch(`${API_BASE_URL}/api/compliance`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(newRecord)
                              }).catch(() => {});
                            }}
                            className="flex-1 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-md"
                            style={{ background: accent, color: t.textOnAccent }}
                          >
                            Submit Audit Report
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Select Outlet</label>
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

                        <div className="border-2 border-dashed rounded-xl p-4 text-center space-y-1" style={{ borderColor: t.border }}>
                          <span className="text-2xl block">📷</span>
                          <p className="font-semibold text-xs" style={{ color: t.text }}>Upload Store Photo for AI Analysis</p>
                          <p className="text-[10px]" style={{ color: t.textFaint }}>AI Vision will verify branding, logo, uniforms & cleanliness</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setShowAuditModal(false)}
                            className="flex-1 py-2 rounded-lg border font-medium text-xs cursor-pointer"
                            style={{ borderColor: t.border, color: t.textMuted }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setShowAuditModal(false);
                              setAuditSubTab("ai_photo");
                              setAiPhotoAnalyzing(true);
                              fetch(`${API_BASE_URL}/api/compliance/analyze-photo`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  outlet_id: aiPhotoOutlet.includes("Aurangabad") ? 4 : 1,
                                  outlet_name: aiPhotoOutlet,
                                  photo_category: aiPhotoCategory,
                                  inspector: "Computer Vision AI v4.2"
                                })
                              })
                              .then(res => res.json())
                              .then(data => {
                                setAiPhotoResult(data);
                                setAiPhotoAnalyzing(false);
                                if (data.id) setAudits(prev => [data, ...prev]);
                              })
                              .catch(() => {
                                setAiPhotoAnalyzing(false);
                              });
                            }}
                            className="flex-1 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-md bg-purple-600 hover:bg-purple-500 text-white"
                          >
                            Run AI Photo Audit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                          <option key={name} value={name}>{name}</option>
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
                          .then(res => res.json())
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
            </div>
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
                          const data = await res.json();
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
                          .then(res => res.json())
                          .then(data => {
                            setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ML: ${data.message || "Model retraining triggered"}`, ...prev]);
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
    </div>
  );
}
