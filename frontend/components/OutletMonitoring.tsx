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
  Sun, Moon, AlertTriangle, Eye, EyeOff, Mail, Lock, Calendar
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

type Employee = {
  employee_id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  salary?: number | string;
  status?: string;
  outlets?: { outlet_name: string; city: string };
  [key: string]: unknown;
};

function inventoryStatus(item: InventoryItem): "Healthy" | "Watch" | "Critical" {
  const qty = Number(item.quantity);
  const reorderAt = Number(item.reorder_at);
  if (qty <= reorderAt * 0.5) return "Critical";
  if (qty <= reorderAt) return "Watch";
  return "Healthy";
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const attendanceLog = [
  { staffId: 1, name: "Rahul Sharma", outlet: "Pune", checkIn: "09:02", checkOut: "18:10", todayStatus: "Present", week: ["P", "P", "P", "P", "P", "-", "-"] },
  { staffId: 2, name: "Priya Patel", outlet: "Nashik", checkIn: "08:58", checkOut: "17:45", todayStatus: "Present", week: ["P", "P", "L", "P", "P", "-", "-"] },
  { staffId: 3, name: "Amit Verma", outlet: "Mumbai Andheri", checkIn: "-", checkOut: "-", todayStatus: "Absent", week: ["P", "P", "A", "A", "A", "-", "-"] },
  { staffId: 4, name: "Sneha Kulkarni", outlet: "Nagpur", checkIn: "09:00", checkOut: "18:00", todayStatus: "Present", week: ["P", "P", "P", "P", "P", "-", "-"] },
  { staffId: 5, name: "Vikas Deshmukh", outlet: "Aurangabad", checkIn: "13:05", checkOut: "21:00", todayStatus: "Late", week: ["P", "L", "P", "P", "L", "-", "-"] },
];

const attendanceDotColor: Record<string, string> = {
  P: "#2DD9B9",
  L: "#F2A93B",
  A: "#F2586B",
  "-": "#232630",
};

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
      onLogin(data.user);
    } catch {
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

export default function FranchiseOSDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIOverlay, setShowAIOverlay] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to Franchise Intelligence AI. Ask me about outlet health scores, recommendations, low stock warnings, or revenue predictions." }
  ]);
  const [aiInput, setAiInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("fops_token"));
      const stored = localStorage.getItem("fops_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (_) {}
      }
    }
    setCheckingAuth(false);
  }, []);
  const [active, setActive] = useState("dashboard");
  const [outletTab, setOutletTab] = useState("trend");
  const [selectedOutlet, setSelectedOutlet] = useState("All");
  const [selectedWeeklyOutlet, setSelectedWeeklyOutlet] = useState("All");
  const [pinHover, setPinHover] = useState<string | null>(null);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [inventoryOutletId, setInventoryOutletId] = useState<string>("All");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  // ADDED: real staff/employee state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffQuery, setStaffQuery] = useState("");
  const [staffRoleFilter, setStaffRoleFilter] = useState("All");
  const [staffTab, setStaffTab] = useState<"directory" | "attendance">("directory");

  // ADDED: Franchise Intelligence state
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);

  // ADDED: Real-time synchronization & Audits state
  const [sseTrigger, setSseTrigger] = useState(0);
  const [audits, setAudits] = useState<any[]>([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [selectedAuditOutlet, setSelectedAuditOutlet] = useState("");
  const [auditChecklist, setAuditChecklist] = useState<Record<string, boolean>>({
    temp: false,
    machine: false,
    cleaning: false,
    uniform: false,
    cash: false
  });
  const [submittingAudit, setSubmittingAudit] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    const eventSource = new EventSource(`${API_BASE_URL}/api/events`);

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (
          message.type === "INVENTORY_UPDATE" ||
          message.type === "EMPLOYEE_UPDATE" ||
          message.type === "COMPLIANCE_UPDATE"
        ) {
          setSseTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("SSE parsing error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || active !== "audit") return;
    let isSubscribed = true;
    setAuditsLoading(true);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/api/compliance`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed) setAudits(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isSubscribed) setAudits([]);
      })
      .finally(() => {
        if (isSubscribed) setAuditsLoading(false);
      });
    return () => { isSubscribed = false; };
  }, [isLoggedIn, active, sseTrigger]);

  useEffect(() => {
    if (!isLoggedIn || active !== "intelligence") return;
    let isSubscribed = true;
    Promise.resolve().then(() => setIntelligenceLoading(true));
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/api/agent/franchise-intelligence`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (isSubscribed) setIntelligenceData(data);
      })
      .catch(() => {
        if (isSubscribed) {
          setIntelligenceData({
            overallHealth: 82,
            underperformingCount: 1,
            recommendations: [
              {
                outletId: 5,
                outletName: "Aurangabad CIDCO",
                type: "performance",
                priority: "High",
                message: "Operational Risk: Aurangabad CIDCO health score is critical (41/100).",
                suggestion: "Initiate operational audit and adjust staffing schedule to meet local demand."
              },
              {
                outletId: 3,
                outletName: "Mumbai Andheri East",
                type: "inventory",
                priority: "Medium",
                message: "Low Stock Alert: 'Espresso Beans' (SKU-ESP-001) at Mumbai Andheri East is low.",
                suggestion: "Reorder at least 150 units of Espresso Beans from supplier Coffee Farms Corp."
              }
            ],
            forecasts: [
              { outletId: 1, outletName: "Nashik City Center", currentRevenue: 128000, predictedRevenue: 136200, confidence: "High", trend: "Upward" },
              { outletId: 2, outletName: "Pune FC Road", currentRevenue: 154000, predictedRevenue: 169500, confidence: "High", trend: "Upward" },
              { outletId: 3, outletName: "Mumbai Andheri East", currentRevenue: 96000, predictedRevenue: 93000, confidence: "Medium", trend: "Downward" },
              { outletId: 5, outletName: "Aurangabad CIDCO", currentRevenue: 61000, predictedRevenue: 53500, confidence: "Low", trend: "Downward" }
            ],
            outletsHealth: [
              { outlet_id: 1, outlet_name: "Nashik City Center", city: "Nashik", calculatedHealth: 88, perfScore: 88, customScore: 88, status: "Healthy" },
              { outlet_id: 2, outlet_name: "Pune FC Road", city: "Pune", calculatedHealth: 94, perfScore: 94, customScore: 94, status: "Healthy" },
              { outlet_id: 3, outlet_name: "Mumbai Andheri East", city: "Mumbai", calculatedHealth: 72, perfScore: 72, customScore: 72, status: "Watch" },
              { outlet_id: 4, outlet_name: "Nagpur Dharampeth", city: "Nagpur", calculatedHealth: 87, perfScore: 87, customScore: 87, status: "Healthy" },
              { outlet_id: 5, outlet_name: "Aurangabad CIDCO", city: "Aurangabad", calculatedHealth: 41, perfScore: 41, customScore: 41, status: "Critical" }
            ]
          });
        }
      })
      .finally(() => {
        if (isSubscribed) setIntelligenceLoading(false);
      });
    return () => { isSubscribed = false; };
  }, [isLoggedIn, active, sseTrigger]);

  useEffect(() => {
    if (!isLoggedIn || active !== "staff") return;
    let isSubscribed = true;
    Promise.resolve().then(() => setStaffLoading(true));
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/api/employees`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed) setEmployees(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isSubscribed) setEmployees([]);
      })
      .finally(() => {
        if (isSubscribed) setStaffLoading(false);
      });
    return () => { isSubscribed = false; };
  }, [isLoggedIn, active, sseTrigger]);

  const t = isDark ? themes.dark : themes.light;
  const statusColor = isDark ? statusColorDark : statusColorLight;
  const accent = "#2DD4BF";
  const activeLabel = modules.find((m) => m.id === active)?.label ?? "Dashboard";
  const trendData = revenueTrendByOutlet[selectedOutlet] || revenueTrendByOutlet.All;
  const weeklyTrendData = weeklyRevenueTrendByOutlet[selectedWeeklyOutlet] || weeklyRevenueTrendByOutlet.All;

  const presentToday = attendanceLog.filter((a) => a.todayStatus === "Present").length;
  const absentToday = attendanceLog.filter((a) => a.todayStatus === "Absent").length;
  const lateToday = attendanceLog.filter((a) => a.todayStatus === "Late").length;
  const attendanceRateToday = Math.round((presentToday / attendanceLog.length) * 100);

  // ADDED: fetch outlets once, for the inventory filter dropdown
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

    let isSubscribed = true;
    Promise.resolve().then(() => {
      setInventoryLoading(true);
      setInventoryError(null);
    });

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
        if (isSubscribed) {
          setInventoryItems(Array.isArray(items) ? items : []);
          setInventorySummary(summary);
        }
      })
      .catch(() => {
        if (isSubscribed) setInventoryError("Could not load inventory from the server.");
      })
      .finally(() => {
        if (isSubscribed) setInventoryLoading(false);
      });

    return () => { isSubscribed = false; };
  }, [isLoggedIn, active, inventoryOutletId, inventoryQuery, sseTrigger]);

  function handleSignOut() {
    localStorage.removeItem("fops_token");
    localStorage.removeItem("fops_user");
    setIsLoggedIn(false);
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
          <div className="relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm flex-1 max-w-md border" style={{ background: t.inputBg, borderColor: t.border, color: t.text }}>
            <Search size={14} className="text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search outlets, employees, SKUs..."
              className="flex-1 bg-transparent border-0 outline-none text-xs"
              style={{ color: t.text }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[10px] text-slate-400 hover:text-slate-200">Clear</button>
            )}

            {/* Dropdown Floating Search Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border p-4 shadow-xl z-50 text-left" style={{ background: t.card, borderColor: t.border }}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-2">Search Results</p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {/* Outlets Match */}
                  {outlets.filter(o => o.outlet_name.toLowerCase().includes(searchQuery.toLowerCase()) || (o.city && o.city.toLowerCase().includes(searchQuery.toLowerCase()))).map(o => (
                    <div key={`s-o-${o.outlet_id}`} onClick={() => { setActive("outlet"); setSelectedOutlet(String(o.outlet_id)); setSearchQuery(""); }} className="p-2 rounded hover:bg-teal-500/10 cursor-pointer transition-colors">
                      <p className="font-semibold text-xs text-slate-200">{o.outlet_name}</p>
                      <p className="text-[10px] text-slate-400">Outlet Location • {o.city}</p>
                    </div>
                  ))}
                  {/* Employees Match */}
                  {employees.filter(e => e.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || e.role?.toLowerCase().includes(searchQuery.toLowerCase())).map(e => (
                    <div key={`s-e-${e.employee_id}`} onClick={() => { setActive("staff"); setStaffTab("directory"); setSearchQuery(""); }} className="p-2 rounded hover:bg-teal-500/10 cursor-pointer transition-colors">
                      <p className="font-semibold text-xs text-slate-200">{e.full_name}</p>
                      <p className="text-[10px] text-slate-400">Employee • {e.role} • {e.outlets?.outlet_name}</p>
                    </div>
                  ))}
                  {/* Inventory SKU Match */}
                  {inventoryItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase())).map(i => (
                    <div key={`s-i-${i.item_id}`} onClick={() => { setActive("inventory"); setInventoryQuery(i.sku); setSearchQuery(""); }} className="p-2 rounded hover:bg-teal-500/10 cursor-pointer transition-colors">
                      <p className="font-semibold text-xs text-slate-200">{i.name}</p>
                      <p className="text-[10px] text-slate-400">Inventory SKU • {i.sku} • Stock: {Number(i.quantity)}</p>
                    </div>
                  ))}
                  {/* Empty State */}
                  {outlets.filter(o => o.outlet_name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                   employees.filter(e => e.full_name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                   inventoryItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No matching records found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowAIOverlay(true)} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors" style={{ borderColor: `${accent}4D`, color: accent }}>
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
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v) => `₹${Number((v as number) || 0).toLocaleString("en-IN")}`} />
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
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v) => `₹${Number((v as number) || 0).toLocaleString("en-IN")}`} />
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
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v) => `₹${Number((v as number) || 0).toLocaleString("en-IN")}`} />
                      <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {outletTab === "map" && (
                <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: t.text }}><MapPin size={15} color={accent} /> Outlet Locations</p>
                  <p className="text-xs mb-4" style={{ color: t.textFaint }}>Prototype map — swap for a real Google Maps component using lat/lng later</p>
                  <div className="relative w-full h-[300px] rounded-lg border overflow-hidden flex items-center justify-center" style={{ background: t.bg, borderColor: t.border }}>
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 22 48 L 48 55 L 42 28 L 30 44 L 22 48 Z" fill="none" stroke={t.border} strokeWidth="0.5" strokeDasharray="2 2" />
                      <path d="M 48 55 L 45 80 L 65 72 L 58 40 L 48 55 Z" fill="none" stroke={t.border} strokeWidth="0.5" strokeDasharray="2 2" />
                      <path d="M 58 40 L 82 38 L 65 72 Z" fill="none" stroke={t.border} strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>

                    {outletLocations.map((loc) => (
                      <div key={loc.name} className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-300" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        onMouseEnter={() => setPinHover(loc.name)} onMouseLeave={() => setPinHover(null)}>
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full animate-ping opacity-25" style={{ background: pinColor[loc.status] }} />
                        <MapPin size={26} fill={pinColor[loc.status]} color={t.bg} stroke={pinColor[loc.status]} strokeWidth={2} className="relative z-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] group-hover:scale-110 transition-transform" />
                        {pinHover === loc.name && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-11 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl border z-20 whitespace-nowrap" style={{ background: t.card, borderColor: t.border }}>
                            <p className="font-semibold">{loc.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Status: <span style={{ color: pinColor[loc.status] }}>{loc.status}</span></p>
                          </div>
                        )}
                      </div>
                    ))}
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

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "directory", label: "Staff Directory", icon: Users },
                  { id: "attendance", label: "Attendance", icon: ShieldCheck },
                ].map((tb) => {
                  const Icon = tb.icon;
                  const isActive = staffTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setStaffTab(tb.id as "directory" | "attendance")}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Staff", value: String(employees.length > 0 ? employees.length : 148), icon: Users },
                      { label: "Active Shifts", value: "94.2%", icon: TrendingUp },
                      { label: "Monthly Payroll", value: "₹18.4L", icon: FileBarChart },
                      { label: "Attendance Score", value: "96%", icon: ShieldCheck },
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
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                          <th className="px-5 py-2 font-medium">Employee Name</th>
                          <th className="px-5 py-2 font-medium">Role</th>
                          <th className="px-5 py-2 font-medium">Contact Email</th>
                          <th className="px-5 py-2 font-medium">Outlet</th>
                          <th className="px-5 py-2 font-medium text-right">Salary</th>
                          <th className="px-5 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffLoading && (
                          <tr><td colSpan={6} className="px-5 py-6 text-center" style={{ color: t.textFaint }}>Loading staff roster...</td></tr>
                        )}
                        {!staffLoading &&
                          (employees.length > 0
                            ? employees
                            : [
                                { employee_id: 1, full_name: "Rahul Sharma", role: "Store Manager", email: "rahul.s@franchiseops.com", outlets: { outlet_name: "Pune" }, salary: 45000, status: "Active" },
                                { employee_id: 2, full_name: "Priya Patel", role: "Shift Supervisor", email: "priya.p@franchiseops.com", outlets: { outlet_name: "Nashik" }, salary: 32000, status: "Active" },
                                { employee_id: 3, full_name: "Amit Verma", role: "Barista", email: "amit.v@franchiseops.com", outlets: { outlet_name: "Mumbai Andheri" }, salary: 22000, status: "On Leave" },
                                { employee_id: 4, full_name: "Sneha Kulkarni", role: "Cashier", email: "sneha.k@franchiseops.com", outlets: { outlet_name: "Nagpur" }, salary: 20000, status: "Active" },
                                { employee_id: 5, full_name: "Vikas Deshmukh", role: "Executive", email: "vikas.d@franchiseops.com", outlets: { outlet_name: "Aurangabad" }, salary: 26000, status: "Active" },
                              ]
                          )
                            .filter((emp) => staffRoleFilter === "All" || (emp.role || "").toLowerCase().includes(staffRoleFilter.toLowerCase()))
                            .filter((emp) => !staffQuery || (emp.full_name || "").toLowerCase().includes(staffQuery.toLowerCase()) || (emp.role || "").toLowerCase().includes(staffQuery.toLowerCase()))
                            .map((emp) => (
                              <tr key={emp.employee_id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                                <td className="px-5 py-3 font-medium" style={{ color: t.text }}>{emp.full_name}</td>
                                <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.role}</td>
                                <td className="px-5 py-3 font-mono text-xs" style={{ color: t.textFaint }}>{emp.email}</td>
                                <td className="px-5 py-3" style={{ color: t.textMuted }}>{emp.outlets?.outlet_name || "Network"}</td>
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
              )}
            </div>
          ) : active === "intelligence" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium" style={{ color: t.textFaint }}>Franchise Intelligence AI</p>
                  <h2 className="text-xl font-bold mt-0.5" style={{ color: t.text }}>Strategic Agent Predictions</h2>
                </div>
                <div className="text-xs px-3 py-1.5 rounded-full border bg-teal-500/10 text-teal-400 border-teal-500/30">
                  AI Model Active
                </div>
              </div>

              {intelligenceLoading && (
                <div className="py-12 text-center" style={{ color: t.textFaint }}>Calculating predictive metrics...</div>
              )}

              {!intelligenceLoading && intelligenceData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-lg font-semibold" style={{ color: t.text }}>{intelligenceData.overallHealth}%</p>
                      <p className="text-xs text-slate-400 mt-1">Network Average Health</p>
                    </div>
                    <div className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-lg font-semibold" style={{ color: intelligenceData.underperformingCount > 0 ? "#FB7185" : accent }}>
                        {intelligenceData.underperformingCount}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Underperforming Outlets</p>
                    </div>
                    <div className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-lg font-semibold" style={{ color: accent }}>
                        {intelligenceData.recommendations?.length || 0}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">AI Action Recommendations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: t.text }}>Active Recommendations &amp; Interventions</p>
                      <div className="space-y-3">
                        {intelligenceData.recommendations?.map((rec: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-lg border text-sm" style={{ background: t.bg, borderColor: rec.priority === "High" ? "#FB718533" : t.border }}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${rec.priority === "High" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                {rec.priority} Priority
                              </span>
                              <span className="text-xs font-semibold" style={{ color: t.textMuted }}>{rec.outletName}</span>
                            </div>
                            <p className="text-xs mb-2" style={{ color: t.text }}>{rec.message}</p>
                            <div className="text-xs p-2 rounded bg-teal-500/5 text-teal-400 border border-teal-500/10">
                              <span className="font-bold">AI Suggestion:</span> {rec.suggestion}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: t.text }}>Revenue Trends &amp; Next Month Predictions</p>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-left border-y py-2" style={{ color: t.textFaint, borderColor: t.border }}>
                            <th className="py-2">Outlet</th>
                            <th className="py-2 text-right">Current MTD</th>
                            <th className="py-2 text-right">AI Predicted</th>
                            <th className="py-2 text-right">Growth / Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {intelligenceData.forecasts?.map((f: any, idx: number) => (
                            <tr key={idx} className="border-b last:border-0" style={{ borderColor: t.border }}>
                              <td className="py-2.5 font-medium" style={{ color: t.text }}>{f.outletName}</td>
                              <td className="py-2.5 text-right" style={{ color: t.textMuted }}>₹{f.currentRevenue.toLocaleString("en-IN")}</td>
                              <td className="py-2.5 text-right font-semibold" style={{ color: accent }}>₹{f.predictedRevenue.toLocaleString("en-IN")}</td>
                              <td className="py-2.5 text-right">
                                <span className={`font-medium ${f.trend === "Upward" || f.trend === "Stable" ? "text-teal-400" : "text-rose-400"}`}>
                                  {f.trend} ({f.confidence} Confidence)
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
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
            onSubmit={(e) => {
              e.preventDefault();
              if (!aiInput.trim()) return;

              const userText = aiInput;
              setAiMessages(prev => [...prev, { sender: "user", text: userText }]);
              setAiInput("");

              setTimeout(() => {
                let reply = "I'm processing that. For detailed stats, please review the Franchise Intelligence AI tab or specify an outlet.";
                const q = userText.toLowerCase();

                if (q.includes("health")) {
                  reply = `The average franchise health score is currently ${intelligenceData?.overallHealth || 82}%. We have ${intelligenceData?.underperformingCount || 1} underperforming location.`;
                } else if (q.includes("reorder") || q.includes("stock") || q.includes("low")) {
                  const criticalCount = inventorySummary?.critical || 0;
                  reply = criticalCount > 0 
                    ? `Warning: There are ${criticalCount} items critically low on stock. Check Andheri East or Nashik Center listings.` 
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
        </div>
      </main>
    </div>
  );
}
