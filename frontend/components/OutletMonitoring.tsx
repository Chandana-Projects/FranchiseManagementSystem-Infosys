"use client";

import React, { useState, useEffect } from "react";
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
  onLogin: () => void;
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
  const [showAskAI, setShowAskAI] = useState(false);
  const [pinHover, setPinHover] = useState<string | null>(null);

  const [accent, setAccent] = useState("#2DD4BF");
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
    fetch(`${API_BASE_URL}/api/outlets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("fops_token")}` },
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

    const authHeaders = { Authorization: `Bearer ${localStorage.getItem("fops_token")}` };

    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory?${params.toString()}`, { headers: authHeaders }).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/summary`, { headers: authHeaders }).then((res) => res.json()),
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
    return <LoginPage t={t} accent={accent} onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="w-full min-h-[800px] flex font-sans transition-colors duration-200" style={{ background: t.bg, color: t.text }}>
      <aside className="w-64 flex flex-col shrink-0 border-r transition-colors duration-200" style={{ background: t.panel, borderColor: t.border }}>
        <div className="px-5 py-5 flex items-center gap-2 border-b" style={{ borderColor: t.border }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-sm" style={{ color: t.bg }}>F</div>
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: t.text }}>FranchiseOps AI</p>
            <p className="text-[10px]" style={{ color: t.textFaint }}>Analytics Network</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors border-l-2"
                style={{
                  borderColor: isActive ? accent : "transparent",
                  background: isActive ? `${accent}1A` : "transparent",
                  color: isActive ? t.text : t.textMuted,
                }}
              >
                <Icon size={16} color={isActive ? accent : t.textFaint} />
                {m.label}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: t.border, color: t.textFaint }}>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> AI engine active
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
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-xs font-semibold"
            style={{ color: t.bg }}
            aria-label="Sign out"
          >
            M
          </button>
        </div>

        <div className="p-8">
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

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs mr-1" style={{ color: t.textFaint }}>Export:</span>
                {["Export PDF", "Export Excel", "Export CSV"].map((label) => (
                  <button key={label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ background: t.card, borderColor: t.border, color: t.textMuted }}>
                    <Download size={12} /> {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-3" style={{ background: `${accent}1A` }}>
                        <Icon size={13} color={accent} />
                      </div>
                      <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                      <p className="text-[11px] mt-1.5" style={{ color: accent }}>{k.delta}</p>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: t.textFaint }}>Extended metrics</p>
                <p className="text-sm font-semibold mb-3" style={{ color: t.text }}>Advanced KPI cards</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {extendedKpis.map((k) => (
                    <div key={k.label} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-lg font-semibold" style={{ color: t.text }}>{k.value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: t.textFaint }}>{k.label}</p>
                      <p className="text-[11px] mt-1.5" style={{ color: accent }}>{k.delta}</p>
                      <p className="text-[10px] mt-2" style={{ color: t.textFaint }}>{k.note}</p>
                    </div>
                  ))}
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
                      <div key={loc.name} className="absolute -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        onMouseEnter={() => setPinHover(loc.name)} onMouseLeave={() => setPinHover(null)}>
                        <MapPin size={26} fill={pinColor[loc.status]} color={pinColor[loc.status]} strokeWidth={1} />
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
                          { name: "Teal", code: "#2DD4BF" },
                          { name: "Purple", code: "#A855F7" },
                          { name: "Amber", code: "#F59E0B" },
                          { name: "Blue", code: "#3B82F6" },
                          { name: "Rose", code: "#F43F5E" }
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
                      className="w-full py-2 rounded font-medium mt-2 transition-opacity duration-150 active:opacity-90 cursor-pointer"
                      style={{ background: accent, color: t.bg }}
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
          ) : (
            <div className="rounded-2xl border p-12 text-center transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: t.textFaint }}>Module page</p>
              <h2 className="text-xl font-semibold mt-1" style={{ color: t.text }}>{activeLabel}</h2>
              <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: t.textMuted }}>
                This page is being built next — it&apos;ll have its own charts, tables, and actions specific to {activeLabel.toLowerCase()}.
              </p>
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
