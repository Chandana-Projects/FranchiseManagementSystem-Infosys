"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from "recharts";
import {
  LayoutGrid, Store, Boxes, Users, Megaphone, ShieldCheck, Brain,
  BellRing, FileBarChart, Settings, Search, Sparkles, Download,
  TrendingUp, TrendingDown, MapPin, LineChart as LineChartIcon, BarChart3,
  Sun, Moon, AlertTriangle, Eye, EyeOff, Mail, Lock, Calendar, Trash2, UserPlus, Star,
  Target, Percent, Lightbulb, Tag, PieChart, Share2, CalendarClock
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const themes = {
  dark: {
    bg: "#0E1015", panel: "#14161C", card: "#1A1D24", border: "#232630",
    text: "#E5E7EB", textMuted: "#94A3B8", textFaint: "#64748B",
    gridLine: "#232630", inputBg: "#0E1015",
  },
  light: {
    bg: "#F4F6F8", panel: "#FFFFFF", card: "#FFFFFF", border: "#E2E8F0",
    text: "#1E293B", textMuted: "#475569", textFaint: "#64748B",
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
  Healthy: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  Watch: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Critical: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};
const statusColorLight: Record<string, string> = {
  Healthy: "bg-teal-50 text-teal-700 border-teal-200",
  Watch: "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
};
const pinColor: Record<string, string> = { Healthy: "#2DD4BF", Watch: "#F59E0B", Critical: "#FB7185" };

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

function LoginPage({
  t,
  accent,
  onLogin,
}: {
  t: typeof themes.dark;
  accent: string;
  onLogin: (user: any) => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        return;
      }
      localStorage.setItem("fops_token", data.token);
      localStorage.setItem("fops_user", JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-[800px] flex items-center justify-center font-sans" style={{ background: t.bg, color: t.text }}>
      <CustomCursor isDark={true} />
      <div className="w-[380px]">
        <div className="flex items-center justify-center gap-2 mb-7">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-base" style={{ color: t.bg }}>F</div>
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: t.text }}>FranchiseOps AI</p>
            <p className="text-[11px]" style={{ color: t.textFaint }}>Analytics Network</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border p-7" style={{ background: t.card, borderColor: t.border }}>
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
            className="w-full py-2.5 rounded-lg font-semibold text-sm mt-4"
            style={{ background: accent, color: t.bg, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function CustomCursor({ isDark }: { isDark: boolean }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  const positionRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.closest("input");
      const isMapPin = target.closest(".cursor-pointer") && (target.closest("svg") || target.closest('[style*="left"]'));
      const isExit = target.closest('[aria-label="Sign out"]') || target.closest('[onclick*="signOut"]') || (target.textContent && target.textContent.toLowerCase().includes("sign out"));
      const isButton = target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a") || target.closest('[role="button"]') || target.classList.contains("interactive");

      if (isInput) {
        setHoverType("TYPE");
      } else if (isExit) {
        setHoverType("EXIT");
      } else if (isMapPin) {
        setHoverType("MAP");
      } else if (isButton) {
        setHoverType("CLICK");
      } else {
        setHoverType(null);
      }
    };

    const handleMouseOut = () => {
      setHoverType(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let animationFrameId: number;

    const updateTrail = () => {
      setTrail((prev) => {
        const dx = positionRef.current.x - prev.x;
        const dy = positionRef.current.y - prev.y;
        const ease = hoverType ? 0.28 : 0.16;
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, hoverType]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Context HUD Outer Capsule */}
      <div
        className="pointer-events-none fixed z-50 flex items-center justify-center rounded-full border transition-all duration-300 ease-out"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: hoverType ? "56px" : "28px",
          height: "28px",
          borderRadius: hoverType ? "14px" : "50%",
          borderColor: hoverType ? "#2DD4BF" : "#2DD4BF40",
          background: hoverType ? "rgba(45, 212, 191, 0.12)" : "transparent",
          boxShadow: hoverType ? "0 0 16px rgba(45,212,191,0.35)" : "0 0 8px rgba(45,212,191,0.08)",
          transform: `translate(-50%, -50%)`,
          opacity: 0.9,
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {hoverType && (
          <span className="text-[8px] font-extrabold tracking-widest text-[#2DD4BF] select-none">
            {hoverType}
          </span>
        )}
      </div>

      {/* Inner Dot Indicator */}
      <div
        className="pointer-events-none fixed z-50 h-1.5 w-1.5 rounded-full"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: "#2DD4BF",
          boxShadow: "0 0 6px #2DD4BF",
          transform: `translate(-50%, -50%) scale(${hoverType ? 0.5 : 1})`,
          transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
          opacity: hoverType ? 0.3 : 1,
        }}
      />
    </>
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
    <div
      style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
        background: t.card, borderLeft: `1px solid ${t.border}`,
        display: "flex", flexDirection: "column", zIndex: 50,
        boxShadow: "-8px 0 24px rgba(0,0,0,0.3)",
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

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className="text-sm px-3 py-2 rounded-lg"
            style={{
              maxWidth: "85%",
              marginLeft: m.role === "user" ? "auto" : 0,
              background: m.role === "user" ? accent : t.inputBg,
              color: m.role === "user" ? t.bg : t.text,
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
          className="px-3 py-2 rounded-lg text-sm font-semibold"
          style={{ background: accent, color: t.bg }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function FranchiseOSDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [outletTab, setOutletTab] = useState("trend");
  const [selectedOutlet, setSelectedOutlet] = useState("All");
  const [selectedWeeklyOutlet, setSelectedWeeklyOutlet] = useState("All");
  const [pinHover, setPinHover] = useState<string | null>(null);
  const [showAskAI, setShowAskAI] = useState(false);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
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
    fetch(`${API_BASE_URL}/api/employees`)
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

  const presentToday = attendanceLog.filter((a) => a.todayStatus === "Present").length;
  const absentToday = attendanceLog.filter((a) => a.todayStatus === "Absent").length;
  const lateToday = attendanceLog.filter((a) => a.todayStatus === "Late").length;
  const attendanceRateToday = Math.round((presentToday / attendanceLog.length) * 100);

  const underperformingOutlets = outletPerformance.filter((o) => o.status !== "Healthy");

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
    const token = localStorage.getItem("fops_token");
    setIsLoggedIn(!!token);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/api/outlets`, { headers })
      .then((res) => res.json())
      .then((data) => setOutlets(Array.isArray(data) ? data : []))
      .catch(() => setOutlets([]));
  }, [isLoggedIn, sseTrigger]);

  useEffect(() => {
    if (!isLoggedIn || active !== "inventory") return;

    setInventoryLoading(true);
    setInventoryError(null);

    const params = new URLSearchParams();
    if (inventoryOutletId !== "All") params.set("outlet_id", inventoryOutletId);
    if (inventoryQuery) params.set("search", inventoryQuery);

    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory?${params.toString()}`, { headers }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/summary`, { headers }).then((res) => res.json()),
    ])
      .then(([items, summary]) => {
        setInventoryItems(Array.isArray(items) ? items : []);
        setInventorySummary(summary);
      })
      .catch(() => setInventoryError("Could not load inventory from the server."))
      .finally(() => setInventoryLoading(false));
  }, [isLoggedIn, active, inventoryOutletId, inventoryQuery]);

  function handleSignOut() {
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

  if (checkingAuth) {
    return <div className="w-full min-h-[800px]" style={{ background: t.bg }} />;
  }

  if (!isLoggedIn) {
    return <LoginPage t={t} accent={accent} onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;
  }

  return (
    <div className="w-full min-h-[800px] flex font-sans transition-colors duration-200" style={{ background: t.bg, color: t.text }}>
      <CustomCursor isDark={isDark} />
      <aside className="w-64 flex flex-col shrink-0 border-r transition-colors duration-200 relative" style={{ background: isDark ? "rgba(14,16,21,0.97)" : t.panel, borderColor: t.border, backdropFilter: "blur(20px)" }}>
        {/* Top gradient shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.5 }} />
        <div className="px-5 py-5 flex items-center gap-2.5 border-b" style={{ borderColor: t.border }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-lg relative overflow-hidden" style={{ background: `linear-gradient(135deg, #2DD4BF, #0891B2)`, color: "#fff" }}>
            <span className="relative z-10">F</span>
            <span className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 60%, transparent 70%)" }} />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: t.text }}>FranchiseOps AI</p>
            <p className="text-[10px] font-medium" style={{ color: accent }}>● Live Network</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            const unreadCount = m.id === "notifications" ? notifUnread : 0;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-200 rounded-lg mx-1 relative group"
                style={{
                  width: "calc(100% - 8px)",
                  background: isActive ? `linear-gradient(135deg, ${accent}25, ${accent}10)` : "transparent",
                  color: isActive ? t.text : t.textMuted,
                  boxShadow: isActive ? `inset 0 0 0 1px ${accent}30, 0 2px 12px ${accent}15` : "none",
                }}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: accent }} />
                )}
                <Icon size={16} color={isActive ? accent : t.textFaint} style={{ transition: "all 0.2s" }} />
                <span className={`flex-1 font-${isActive ? "semibold" : "normal"} text-xs`}>{m.label}</span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center animate-pulse" style={{ background: "#FB7185", color: "#fff" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        {/* Live Pulse Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: t.border }}>
          <div className="flex items-center gap-2 text-[10px] mb-1.5" style={{ color: t.textFaint }}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> AI engines active — 7 models running
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: t.border }}>
            <div className="h-full rounded-full" style={{ width: "73%", background: `linear-gradient(90deg, ${accent}, #0891B2)` }} />
          </div>
          <p className="text-[9px] mt-0.5" style={{ color: t.textFaint }}>System load: 73% · Latency: 12ms</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="border-b px-8 py-4 flex items-center justify-between gap-4 transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm flex-1 max-w-md border" style={{ background: t.inputBg, borderColor: t.border, color: t.textFaint }}>
            <Search size={14} />
            <span>Search outlets, reports, insights...</span>
          </div>
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
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-xs font-semibold hover:opacity-85 transition-opacity"
              style={{ color: t.bg }}
              aria-label="Profile Menu"
            >
              {currentUser?.full_name?.charAt(0).toUpperCase() || "M"}
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2.5 w-64 rounded-xl border p-4 shadow-xl z-50 text-left" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center gap-2 pb-3 border-b mb-3" style={{ borderColor: t.border }}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center font-bold text-sm" style={{ color: t.bg }}>
                    {currentUser?.full_name?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs truncate" style={{ color: t.text }}>{currentUser?.full_name || "Abhishek Pattnaik"}</p>
                    <p className="text-[10px] truncate" style={{ color: t.textFaint }}>{currentUser?.email || "abhi@gmail.com"}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-[10px] mb-4" style={{ color: t.textMuted }}>
                  <p><span className="font-semibold" style={{ color: t.textFaint }}>Role:</span> <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold uppercase tracking-wider">{currentUser?.role || "Admin"}</span></p>
                  {currentUser?.outlet_id && (
                    <p><span className="font-semibold" style={{ color: t.textFaint }}>Assigned Outlet:</span> Outlet #{currentUser?.outlet_id}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    handleSignOut();
                  }}
                  className="w-full py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-colors"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {active === "dashboard" ? (
            <div className="space-y-6">
              {/* 🚨 Critical Alert Banner */}
              <div className="rounded-xl px-5 py-3.5 flex items-center gap-3 border" style={{ background: "linear-gradient(135deg, #FB718515, #FB718508)", borderColor: "#FB718540" }}>
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping flex-shrink-0" />
                <span className="w-2 h-2 rounded-full bg-rose-400 -ml-5 flex-shrink-0" />
                <p className="text-xs font-semibold flex-1" style={{ color: "#FB7185" }}>
                  🚨 <strong>Critical Alert:</strong> Aurangabad CIDCO outlet health is at 41/100 — immediate action required. 2 inventory items critically low.
                </p>
                <button onClick={() => setActive("audit")} className="text-xs px-3 py-1.5 rounded-lg font-semibold border flex-shrink-0" style={{ borderColor: "#FB718550", color: "#FB7185", background: "#FB718515" }}>Take Action →</button>
              </div>

              {/* ⚡ Live Pulse Ticker */}
              <div className="rounded-xl border px-5 py-3 flex items-center gap-4 overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#34d399" }}>LIVE POS</span>
                </div>
                <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar flex-1">
                  {liveTransactions.length > 0 ? (
                    liveTransactions.map((tx: any, idx: number) => {
                      const isAnom = tx.anomaly?.has_anomaly;
                      return (
                        <div key={idx} className="flex flex-col flex-shrink-0 border-l pl-4 first:border-0 first:pl-0" style={{ borderColor: t.border }}>
                          <span className="text-[9px] uppercase tracking-wide" style={{ color: t.textFaint }}>
                            {tx.outlet_name} · {new Date(tx.transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-xs font-bold ${isAnom ? "text-rose-400" : "text-emerald-400"}`}>
                              ₹{tx.transaction.revenue.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-medium" style={{ color: t.textMuted }}>
                              ({tx.transaction.orders} orders)
                            </span>
                            {isAnom && (
                              <span className="text-[8px] bg-rose-500/20 text-rose-400 font-bold px-1 rounded border border-rose-500/30 animate-pulse">
                                ANOMALY
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
                      <span className="text-xs" style={{ color: t.textFaint }}>Waiting for live register events... (Simulating POS activity)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 🧠 AI Briefing Panel */}
              <div className="rounded-xl p-5 border relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}05)`, borderColor: `${accent}30` }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: accent, filter: "blur(40px)", transform: "translate(30%, -30%)" }} />
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} color={accent} />
                  <p className="text-sm font-bold" style={{ color: t.text }}>AI Command Briefing</p>
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest" style={{ background: `${accent}20`, color: accent }}>Live AI</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  Revenue is growing at <strong style={{color: t.text}}>+14.2%</strong> network-wide, driven by Pune FC Road (+10.1%) and Thane Estate (+7.8%).
                  Aurangabad CIDCO remains the weakest link at 41/100 health — recommend an immediate staffing audit and inventory reorder.
                  Summer Hype campaign is outperforming with <strong style={{color: t.text}}>3.84% CTR</strong> vs industry average 1.9%.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ background: `${accent}1A`, color: accent, borderColor: `${accent}33` }}>🏆 Best: Pune FC Road</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ background: "#F59E0B1A", color: "#F59E0B", borderColor: "#F59E0B33" }}>⚠️ Watch: Mumbai Andheri</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>🚨 Critical: Aurangabad</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ background: "#A855F71A", color: "#A855F7", borderColor: "#A855F733" }}>📈 Forecast: +12% next month</span>
                </div>
              </div>

              {/* KPI Cards — Premium */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div
                      key={k.label}
                      className="rounded-xl border p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                      style={{ background: t.card, borderColor: t.border }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${accent}20`; (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = t.border; }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: accent, filter: "blur(20px)" }} />
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${accent}18` }}>
                        <Icon size={14} color={accent} />
                      </div>
                      <p className="text-xl font-black" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: t.textFaint }}>{k.label}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp size={10} style={{ color: accent }} />
                        <p className="text-[10px] font-semibold" style={{ color: accent }}>{k.delta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extended KPI cards */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: t.textFaint }}>Advanced Metrics</p>
                  <div className="flex-1 h-px" style={{ background: t.border }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {extendedKpis.map((k, i) => {
                    const gradients = ["#2DD4BF", "#F59E0B", "#A855F7", "#3B82F6", "#10B981"];
                    const g = gradients[i % gradients.length];
                    return (
                      <div key={k.label} className="rounded-xl border p-4 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                        style={{ background: t.card, borderColor: t.border }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${g}20`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b" style={{ background: `linear-gradient(90deg, ${g}, transparent)` }} />
                        <p className="text-xl font-black" style={{ color: t.text }}>{k.value}</p>
                        <p className="text-[10px] mt-0.5 font-medium" style={{ color: t.textFaint }}>{k.label}</p>
                        <p className="text-[11px] mt-1.5 font-semibold" style={{ color: g }}>{k.delta}</p>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: t.textFaint }}>{k.note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Sales Revenue Trend</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Last 6 months, network-wide</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={revenueTrendByOutlet.All}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <YAxis tick={{ fontSize: 12, fill: t.textFaint }} stroke={t.gridLine} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v: any) => `₹${Number(v || 0).toLocaleString("en-IN")}`} />
                      <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
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

              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1" style={{ color: t.text }}>Outlet Performance</p>
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
                    {outletPerformance.map((o) => (
                      <tr key={o.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.name}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>₹{Number(o.sales || 0).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3" style={{ color: t.textFaint }}>₹{Number(o.target || 0).toLocaleString("en-IN")}</td>
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
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}><MapPin size={15} color={accent} /> Outlet Locations</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Prototype map — distances are estimated from map position, not real GPS. Hover a pin to see distance from Pune HQ.</p>
                  <div className="relative w-full h-[300px] rounded-lg border overflow-hidden" style={{ background: t.bg, borderColor: t.border }}>
                    {outletLocations.map((loc) => (
                      <div key={loc.name} className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-300" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        onMouseEnter={() => setPinHover(loc.name)} onMouseLeave={() => setPinHover(null)}>
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full animate-ping opacity-25" style={{ background: pinColor[loc.status] }} />
                        <MapPin size={26} fill={pinColor[loc.status]} color={t.bg} stroke={pinColor[loc.status]} strokeWidth={2} className="relative z-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] group-hover:scale-110 transition-transform" />
                        {pinHover === loc.name && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-9 text-white text-xs px-2 py-1 rounded whitespace-nowrap" style={{ background: "#1E293B" }}>
                            {loc.name} — {loc.status}
                            {loc.name !== hubOutlet.name && ` · ${estimateDistanceKm(loc, hubOutlet)} km from Pune HQ`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg border overflow-hidden" style={{ borderColor: t.border }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs border-b" style={{ color: t.textFaint, borderColor: t.border }}>
                          <th className="px-4 py-2 font-medium">Outlet</th>
                          <th className="px-4 py-2 font-medium text-right">Distance from Pune HQ (approx)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outletLocations.map((loc) => (
                          <tr key={loc.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                            <td className="px-4 py-2" style={{ color: t.text }}>{loc.name}</td>
                            <td className="px-4 py-2 text-right" style={{ color: t.textMuted }}>
                              {loc.name === hubOutlet.name ? "— (HQ)" : `${estimateDistanceKm(loc, hubOutlet)} km`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-sm font-semibold px-5 pt-5 pb-1 flex items-center gap-2" style={{ color: t.text }}><Store size={15} color={accent} /> Outlet Sales &amp; Performance</p>
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
                    {outletPerformance.map((o) => (
                      <tr key={o.name} className="border-b last:border-0" style={{ borderColor: t.border }}>
                        <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{o.name}</td>
                        <td className="px-5 py-3" style={{ color: t.textMuted }}>₹{Number(o.sales || 0).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3" style={{ color: t.textFaint }}>₹{Number(o.target || 0).toLocaleString("en-IN")}</td>
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
                          className="w-full py-2.5 rounded-lg font-semibold text-sm"
                          style={{ background: accent, color: t.bg }}
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
          ) : (
            <div className="rounded-2xl border p-12 text-center transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: t.textFaint }}>Module page</p>
              <h2 className="text-xl font-semibold mt-1" style={{ color: t.text }}>{activeLabel}</h2>
              <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: t.textMuted }}>
                This module is active — navigate using the sidebar to explore all franchise data.
              </p>
            </div>
          )}
      {/* Sliding AI Chat Assistant Overlay */}
      {showAIOverlay && (
        <div className="fixed inset-y-0 right-0 w-[360px] shadow-2xl z-50 flex flex-col border-l transition-all duration-300" style={{ background: t.card, borderColor: t.border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} color={accent} />
              <p className="font-semibold text-sm" style={{ color: t.text }}>Franchise Intelligence AI</p>
            </div>
            <button onClick={() => setShowAIOverlay(false)} className="text-xs text-slate-400 hover:text-slate-200">Close</button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-teal-500 text-[#0E1015] rounded-tr-none font-medium"
                      : "bg-[#1A1D24] text-slate-200 border rounded-tl-none"
                  }`}
                  style={{ borderColor: msg.sender === "user" ? "transparent" : t.border }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!aiInput.trim()) return;

              const userText = aiInput;
              setAiMessages(prev => [...prev, { sender: "user", text: userText }]);
              setAiInput("");

              if (geminiApiKey) {
                setAiMessages(prev => [...prev, { sender: "ai", text: "▋ (Thinking strategic response...)" }]);
                try {
                  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      contents: [{
                        parts: [{
                          text: `You are the FranchiseOpsAI Business Analyst Agent.
Tone/Personality configured: ${copilotPersonality}.
Context:
- Overall Franchise Health Score: ${intelligenceData?.overallHealth || 82}%
- Low Stock Critical Count: ${inventorySummary?.critical || 2}
- Active Marketing Campaigns: ${campaigns.filter(c => c.status === "Active").map(c => c.name).join(", ")}
- Underperforming Outlet: Aurangabad CIDCO (Health 41/100, Revenue ₹61k, -12.5% target growth)
- Star Outlet: Pune FC Road (Health 94/100, Revenue ₹1.54L)

User Prompt: ${userText}`
                        }]
                      }]
                    })
                  });
                  const data = await response.json();
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not extract a response from Gemini. Check key or limit quota.";
                  setAiMessages(prev => [...prev.slice(0, -1), { sender: "ai", text }]);
                } catch (err) {
                  setAiMessages(prev => [...prev.slice(0, -1), { sender: "ai", text: "Could not reach Gemini model. Make sure key is valid." }]);
                }
                return;
              }

              setTimeout(() => {
                let reply = "I'm processing that. For detailed stats, please review the Franchise Intelligence AI tab or specify an outlet.";
                const q = userText.toLowerCase();

                if (q.includes("health")) {
                  reply = `The average franchise health score is currently ${intelligenceData?.overallHealth || 82}%. We have ${intelligenceData?.underperformingCount || 1} underperforming location.`;
                } else if (q.includes("reorder") || q.includes("stock") || q.includes("low")) {
                  const criticalCount = inventorySummary?.critical || 0;
                  reply = criticalCount > 0
                    ? `Warning: There are ${criticalCount} items critically low on stock. Check Aurangabad or Mumbai Andheri listings.`
                    : `Stock levels are healthy. Nashik Center and Pune FC Road are at 92% inventory health index.`;
                } else if (q.includes("revenue") || q.includes("sales") || q.includes("trend")) {
                  reply = `Franchise sales average ₹1.35Cr total revenue this quarter (+14.2% growth). Nashik is currently leading projections.`;
                } else if (q.includes("nashik")) {
                  reply = `Nashik City Center health score is 88/100 (Healthy). Target MTD sales is ₹1.28L against a budget of ₹1.20L.`;
                } else if (q.includes("pune")) {
                  reply = `Pune FC Road is leading network scores at 94/100. Growth is up +10.1% month-on-month.`;
                } else if (q.includes("mumbai") || q.includes("andheri")) {
                  reply = `Mumbai Andheri East is currently flagged as Watch (72/100). Sales MTD is ₹96k vs target of ₹1.30L (-3.2% growth).`;
                }

                setAiMessages(prev => [...prev, { sender: "ai", text: reply }]);
              }, 600);
            }}
            className="p-3 border-t flex gap-2"
            style={{ borderColor: t.border }}
          >
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask about inventory, health, outlets..."
              className="flex-1 text-xs rounded-lg border px-3 py-2 outline-none"
              style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
            />
            <button type="submit" className="px-3 py-2 rounded-lg font-bold text-xs" style={{ background: accent, color: t.bg }}>Send</button>
          </form>
        </div>
      )}

      {/* 🤖 Floating AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 rounded-2xl border shadow-2xl flex flex-col overflow-hidden" style={{ background: t.card, borderColor: `${accent}40`, boxShadow: `0 20px 60px ${accent}20` }}>
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: t.border, background: `linear-gradient(135deg, ${accent}20, ${accent}08)` }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: accent }}>
                  <Sparkles size={11} color="#fff" />
                </div>
                <p className="font-bold text-xs" style={{ color: t.text }}>FranchiseOps AI</p>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[10px] font-semibold" style={{ color: t.textFaint }}>✕</button>
            </div>

            {/* Smart quick questions */}
            {chatHistory.length === 1 && (
              <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5">
                {["Which outlet needs attention?", "Revenue this month?", "Low stock alerts?", "Best performing outlet?"].map(q => (
                  <button key={q} onClick={() => { setChatInput(q); handleChatSend({ preventDefault: () => {} } as any); }}
                    className="text-[10px] px-2.5 py-1 rounded-full border transition-colors font-medium"
                    style={{ background: `${accent}10`, borderColor: `${accent}30`, color: accent }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-64">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user" ? "rounded-tr-none font-medium" : "rounded-tl-none"
                  }`} style={{
                    background: msg.role === "user" ? accent : isDark ? "#1A1D24" : t.inputBg,
                    color: msg.role === "user" ? "#fff" : t.text,
                    border: msg.role === "ai" ? `1px solid ${t.border}` : "none"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSend} className="p-2.5 border-t flex gap-2" style={{ borderColor: t.border }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 text-xs rounded-lg border px-3 py-2 outline-none"
                style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
              />
              <button type="submit" className="px-3 py-2 rounded-lg font-bold text-xs flex-shrink-0" style={{ background: accent, color: "#fff" }}>→</button>
            </form>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 relative"
          style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${accent}, #0891B2)`, boxShadow: `0 8px 32px ${accent}50`, transform: chatOpen ? "rotate(0deg) scale(0.95)" : "rotate(0deg) scale(1)" }}
        >
          <Sparkles size={22} color="#fff" />
          {!chatOpen && notifUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center" style={{ background: "#FB7185", color: "#fff" }}>
              {notifUnread}
            </span>
          )}
        </button>
      </div>

      {/* Outlet Deep Dive Modal */}
      {deepDiveOutlet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setDeepDiveOutlet(null)}>
          <div className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden" style={{ background: t.card, borderColor: t.border }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: t.border, background: `linear-gradient(135deg, ${accent}12, transparent)` }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Outlet Deep Dive</p>
                <h2 className="text-xl font-black mt-0.5" style={{ color: t.text }}>{deepDiveOutlet.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-1 font-bold ${statusColor[deepDiveOutlet.status as keyof typeof statusColor]}`}>{deepDiveOutlet.status}</span>
              </div>
              <button onClick={() => setDeepDiveOutlet(null)} className="text-sm font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: t.border, color: t.textMuted }}>✕ Close</button>
            </div>
            {/* Modal Content */}
            <div className="p-6 grid grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto">
              {/* KPIs */}
              <div className="col-span-2 grid grid-cols-4 gap-3">
                {[
                  { label: "MTD Sales", value: `₹${Number(deepDiveOutlet.sales || 0).toLocaleString("en-IN")}`, color: accent },
                  { label: "Target", value: `₹${Number(deepDiveOutlet.target || 0).toLocaleString("en-IN")}`, color: "#94A3B8" },
                  { label: "Growth", value: `${deepDiveOutlet.growth >= 0 ? "+" : ""}${deepDiveOutlet.growth}%`, color: deepDiveOutlet.growth >= 0 ? "#10B981" : "#FB7185" },
                  { label: "Health Score", value: `${deepDiveOutlet.status === "Healthy" ? "88" : deepDiveOutlet.status === "Watch" ? "72" : "41"}/100`, color: deepDiveOutlet.status === "Healthy" ? accent : deepDiveOutlet.status === "Watch" ? "#F59E0B" : "#FB7185" },
                ].map(k => (
                  <div key={k.label} className="rounded-xl border p-4" style={{ background: t.bg, borderColor: t.border }}>
                    <p className="text-xl font-black" style={{ color: k.color }}>{k.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="col-span-2 rounded-xl border p-4" style={{ background: t.bg, borderColor: t.border }}>
                <p className="text-xs font-bold mb-3" style={{ color: t.text }}>8-Week Revenue Trend</p>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={weeklyRevenueTrendByOutlet[deepDiveOutlet.name.split(" ")[0]] || weeklyRevenueTrendByOutlet.All}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                    <YAxis tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11, color: t.text }} formatter={(v: any) => `₹${Number(v||0).toLocaleString("en-IN")}`} />
                    <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Quick actions */}
              <div className="col-span-2 flex gap-2 flex-wrap">
                <button onClick={() => { setDeepDiveOutlet(null); setActive("marketing"); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ background: `${accent}15`, borderColor: `${accent}40`, color: accent }}>
                  🚀 Launch Campaign
                </button>
                <button onClick={() => { setDeepDiveOutlet(null); setActive("audit"); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ background: "#F59E0B15", borderColor: "#F59E0B40", color: "#F59E0B" }}>
                  📋 File Audit
                </button>
                <button onClick={() => { setDeepDiveOutlet(null); setActive("inventory"); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ background: "#A855F715", borderColor: "#A855F740", color: "#A855F7" }}>
                  📦 Check Inventory
                </button>
                <button onClick={() => { setDeepDiveOutlet(null); setActive("staff"); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ background: "#3B82F615", borderColor: "#3B82F640", color: "#3B82F6" }}>
                  👥 View Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ Real-time Anomaly Alert Banner (Isolation Forest triggered) */}
      {activeAnomalyAlert && (
        <div className="fixed bottom-6 left-6 z-50 rounded-2xl border p-4.5 max-w-sm shadow-2xl flex gap-3 text-left transition-all duration-300"
          style={{
            background: "rgba(15,23,42,0.95)",
            borderColor: "#FB7185",
            boxShadow: "0 0 24px rgba(251,113,133,0.35)",
            backdropFilter: "blur(8px)"
          }}>
          <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/30 animate-pulse">
            <AlertTriangle size={15} color="#FB7185" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-rose-400 uppercase tracking-widest">ML Anomaly Flagged</span>
              <span className="text-[9px] text-slate-500">Score: {activeAnomalyAlert.score}%</span>
            </div>
            <p className="text-[11px] font-bold text-slate-200 mt-1">{activeAnomalyAlert.outlet_name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{activeAnomalyAlert.reason}</p>
            <p className="text-[8px] text-slate-500 mt-1.5">{new Date(activeAnomalyAlert.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      )}

        </div>
      </main>

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
    </div>
  );
}
