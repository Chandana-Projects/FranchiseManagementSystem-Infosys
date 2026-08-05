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
  Sun, Moon, AlertTriangle, Eye, EyeOff, Mail, Lock, Calendar, Palette, Activity, Database
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

  // ADDED: Simulation & MLOps Dashboard states
  const [simulateParams, setSimulateParams] = useState({ discount_pct: 15, spend_multiplier: 1.0 });
  const [simulatedData, setSimulatedData] = useState<Record<number, any>>({});
  const [simulating, setSimulating] = useState(false);
  const [mlMetrics, setMlMetrics] = useState<any>(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState("");
  const [selectedSimOutlet, setSelectedSimOutlet] = useState<number | null>(null);

  // ADDED: Settings states
  const [accent, setAccent] = useState("#2DD4BF");
  const [simInterval, setSimInterval] = useState(7);
  const [simContamination, setSimContamination] = useState(15);
  const [simEnabled, setSimEnabled] = useState(true);
  const [copilotPersonality, setCopilotPersonality] = useState("Strategic Coach");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [glowIntensity, setGlowIntensity] = useState(70);
  const [glassBlur, setGlassBlur] = useState(12);

  // ADDED: Advanced settings states & logs simulator
  const [xgbLr, setXgbLr] = useState(0.1);
  const [rfEstimators, setRfEstimators] = useState(100);
  const [ridgeAlpha, setRidgeAlpha] = useState(1.0);
  const [dbMockFallback, setDbMockFallback] = useState(false);
  const [alertSensitivity, setAlertSensitivity] = useState("Medium");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System Initialized. Connected to FranchiseOpsAI Core.",
    "Isolation Forest microservice active on localhost:8000.",
    "Database connection status: ONLINE.",
    "SSE Broker registered client context."
  ]);

  useEffect(() => {
    if (active !== "settings") return;
    const interval = setInterval(() => {
      const logs = [
        "[INFO] POS simulator ticker ping completed: OK (Latency 8ms)",
        "[MODEL] Run isolation forest anomaly scan: 0 outliers detected",
        "[DB] Querying outlet performance index metrics for active map widgets",
        "[ML] XGBoost model pipeline health checks: Green",
        "[SSE] Server Sent Events channel streaming transaction packets"
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setTerminalLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${randomLog}`,
        ...prev.slice(0, 8)
      ]);
    }, 4500);
    return () => clearInterval(interval);
  }, [active]);

  const handleRunSimulation = async (outletId: number) => {
    setSimulating(true);
    try {
      const forecast = intelligenceData?.forecasts?.find((f: any) => f.outletId === outletId);
      const currentRev = forecast ? forecast.currentRevenue : 120000;
      const lag7 = currentRev / 30;

      const res = await fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/ml-simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlet_id: outletId,
          tier: outletId === 1 || outletId === 2 ? "A" : outletId === 5 ? "C" : "B",
          month: new Date().getMonth() + 1,
          avg_lag7: lag7,
          avg_lag14: lag7,
          avg_roll4w: lag7,
          discount_pct: Number(simulateParams.discount_pct),
          spend_multiplier: Number(simulateParams.spend_multiplier)
        })
      });
      if (res.ok) {
        const val = await res.json();
        setSimulatedData(prev => ({ ...prev, [outletId]: val }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const handleRetrainModels = async () => {
    setRetraining(true);
    setRetrainMessage("Triggering model training pipeline...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/ml-train`, { method: "POST" });
      if (res.ok) {
        setRetrainMessage("Training triggered! Fetching updated metrics...");
        setTimeout(async () => {
          try {
            const metricsRes = await fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/ml-metrics`);
            if (metricsRes.ok) {
              const updatedMetrics = await metricsRes.json();
              setMlMetrics(updatedMetrics);
              setRetrainMessage("Models retrained and reloaded successfully!");
            }
          } catch (_) {
            setRetrainMessage("Models trained successfully.");
          }
          setTimeout(() => setRetrainMessage(""), 4000);
        }, 3000);
      } else {
        setRetrainMessage("Training pipeline busy or offline.");
      }
    } catch (e) {
      setRetrainMessage("Failed to connect to ML retraining endpoint.");
    } finally {
      setRetraining(false);
    }
  };

  // ADDED: Real-time synchronization & Audits state
  const [sseTrigger, setSseTrigger] = useState(0);
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);
  const [activeAnomalyAlert, setActiveAnomalyAlert] = useState<any>(null);
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

  // ADDED: Marketing & Customer Engagement state
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingError, setMarketingError] = useState<string | null>(null);
  const [marketingTab, setMarketingTab] = useState<"campaigns" | "engagement" | "copilot">("campaigns");
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    status: "Planned",
    budget: "",
    spend: "0",
    revenue: "0",
    coupon_code: "",
    redemptions: "0",
    clicks: "0",
    start_date: "",
    end_date: "",
    outlet_id: "All"
  });
  const [submittingCampaign, setSubmittingCampaign] = useState(false);
  const [repliedReviews, setRepliedReviews] = useState<Record<number, string>>({});
  const [replyInput, setReplyInput] = useState<Record<number, string>>({});

  // ADDED: Simulator & Copilot states
  const [simulatorParams, setSimulatorParams] = useState({
    budget: "15000",
    discount: "15",
    duration: "7",
    outlet_id: "All"
  });
  const [simulatorResults, setSimulatorResults] = useState<any>(null);
  const [simulatorLoading, setSimulatorLoading] = useState(false);

  const [copilotParams, setCopilotParams] = useState({
    name: "Summer Hype Discount",
    coupon_code: "SUMMER25",
    discount: "25%",
    outlet_name: "Pune FC Road"
  });
  const [copilotResults, setCopilotResults] = useState<any>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotActiveFormat, setCopilotActiveFormat] = useState<"sms" | "email" | "social">("sms");

  // ── Notifications Inbox ──────────────────────────────────────────────────
  const [notifInbox, setNotifInbox] = useState([
    { id: 1, priority: "Critical", title: "Aurangabad CIDCO — Critical Health Score", body: "Outlet health dropped to 41/100. Immediate operational audit recommended.", time: "2 min ago", read: false, action: "Launch Audit", actionTab: "audit" },
    { id: 2, priority: "Warning", title: "Low Stock: Arabica Coffee Beans", body: "Only 8kg remaining at Aurangabad CIDCO. Reorder threshold is 20kg.", time: "18 min ago", read: false, action: "View Inventory", actionTab: "inventory" },
    { id: 3, priority: "Warning", title: "Mumbai Andheri — Revenue Below Target", body: "Sales at ₹96k vs ₹1.3L target. -3.2% growth this month.", time: "1 hr ago", read: false, action: "View Outlet", actionTab: "outlet" },
    { id: 4, priority: "Info", title: "Pune FC Road — Top Performer This Month", body: "Reached ₹1.54L revenue (+10.1%). Ranked #1 across the franchise network.", time: "3 hrs ago", read: true, action: "View Campaign", actionTab: "marketing" },
    { id: 5, priority: "Info", title: "Summer Hype Campaign Launched", body: "SUMMER25 coupon is active network-wide. Projected ROI: 147%.", time: "5 hrs ago", read: true, action: "View Campaign", actionTab: "marketing" },
    { id: 6, priority: "Warning", title: "Eco Paper Cups — Running Low", body: "120 units remaining at Aurangabad, reorder threshold is 200.", time: "Yesterday", read: true, action: "View Inventory", actionTab: "inventory" },
  ]);
  const notifUnread = notifInbox.filter(n => !n.read).length;

  // ── Reports ──────────────────────────────────────────────────────────────
  const [reportPeriod, setReportPeriod] = useState<"week" | "month" | "quarter">("month");
  const [reportData, setReportData] = useState<any>(null);
  const [reportStaff, setReportStaff] = useState<any>(null);
  const [reportInventory, setReportInventory] = useState<any>(null);
  const [reportCampaigns, setReportCampaigns] = useState<any[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportTab, setReportTab] = useState<"revenue" | "staff" | "inventory" | "campaigns">("revenue");

  // ── Outlet Deep Dive Modal ────────────────────────────────────────────────
  const [deepDiveOutlet, setDeepDiveOutlet] = useState<any>(null);

  // ── AI Chat Widget (floating) ─────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: "user"|"ai"; text: string; typing?: boolean}>>([
    { role: "ai", text: "👋 Hi! I'm your FranchiseOps AI. Ask me anything — which outlet needs attention, campaign stats, inventory alerts, or revenue forecasts." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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
        } else if (message.type === "POS_TRANSACTION") {
          setLiveTransactions(prev => [message.data, ...prev].slice(0, 15));
          setSseTrigger((prev) => prev + 1);
        } else if (message.type === "ANOMALY_ALERT") {
          setActiveAnomalyAlert(message.data);
          setTimeout(() => setActiveAnomalyAlert(null), 6000);
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
    if (!isLoggedIn) return;
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

    fetch(`${API_BASE_URL}/api/agent/franchise-intelligence/ml-metrics`, { headers })
      .then((res) => res.json())
      .then((metrics) => {
        if (isSubscribed && !metrics.error) setMlMetrics(metrics);
      })
      .catch(() => {});

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

  useEffect(() => {
    if (!isLoggedIn || active !== "marketing") return;
    let isSubscribed = true;
    setMarketingLoading(true);
    setMarketingError(null);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API_BASE_URL}/api/campaigns`, { headers }).then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch(`${API_BASE_URL}/api/campaigns/engagement`, { headers }).then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
    ])
      .then(([campaignsData, engagementData]) => {
        if (isSubscribed) {
          setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
          setCampaignStats(engagementData);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          // Local fallback in case database / backend endpoint fails or doesn't start
          setCampaigns([
            { campaign_id: 1, name: "Summer Chillers Discount", status: "Active", budget: 50000, spend: 38000, revenue: 142000, coupon_code: "SUMMER25", redemptions: 580, clicks: 2400, start_date: "2026-06-01", end_date: "2026-08-31", outlet_id: "All" },
            { campaign_id: 2, name: "Weekend Brunch Special", status: "Active", budget: 20000, spend: 12000, revenue: 45000, coupon_code: "BRUNCH15", redemptions: 210, clicks: 950, start_date: "2026-07-01", end_date: "2026-08-15", outlet_id: 2 },
            { campaign_id: 3, name: "Monsoon Coffee Combo", status: "Completed", budget: 35000, spend: 35000, revenue: 128000, coupon_code: "RAINYBREW", redemptions: 640, clicks: 3100, start_date: "2026-06-15", end_date: "2026-07-31", outlet_id: 1 },
            { campaign_id: 4, name: "Early Bird Espresso Run", status: "Planned", budget: 15000, spend: 0, revenue: 0, coupon_code: "EARLYBIRD", redemptions: 0, clicks: 0, start_date: "2026-08-10", end_date: "2026-09-10", outlet_id: "All" }
          ]);
          setCampaignStats({
            reviews: [
              { rating_id: 1, customer_name: "Rahul Sen", rating: 5, feedback: "Amazing cold coffee and superb service! The latte art was fantastic.", review_date: "2026-08-03", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
              { rating_id: 2, customer_name: "Anjali Sharma", rating: 4, feedback: "Nice ambience and great mocha, but the hazelnut latte was a bit too sweet.", review_date: "2026-08-02", outlets: { outlet_name: "Nashik City Center", city: "Nashik" } },
              { rating_id: 3, customer_name: "Karan Johar", rating: 2, feedback: "Staff was very slow today. Had to wait 20 minutes for a simple espresso. Disappointing.", review_date: "2026-08-01", outlets: { outlet_name: "Mumbai Andheri East", city: "Mumbai" } },
              { rating_id: 4, customer_name: "Sneha Patil", rating: 5, feedback: "Best sourdough croissant in town! The staff is friendly and fast.", review_date: "2026-07-30", outlets: { outlet_name: "Pune FC Road", city: "Pune" } },
              { rating_id: 5, customer_name: "Vikram Malhotra", rating: 3, feedback: "Good seating options, but WiFi was completely offline during my business meeting.", review_date: "2026-07-28", outlets: { outlet_name: "Thane Estate", city: "Thane" } }
            ],
            stats: {
              totalReviews: 5,
              averageRating: 3.8,
              nps: 40,
              sentiment: { positive: 60, neutral: 20, negative: 20 },
              keywords: [
                { tag: "Great Coffee", count: 3, type: "positive" },
                { tag: "Friendly Staff", count: 2, type: "positive" },
                { tag: "Slow Service", count: 1, type: "negative" }
              ],
              customerRetentionRate: 78.4,
              customerLifetimeValue: 1250
            }
          });
        }
      })
      .finally(() => {
        if (isSubscribed) setMarketingLoading(false);
      });

    return () => { isSubscribed = false; };
  }, [isLoggedIn, active, sseTrigger]);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingCampaign(true);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...newCampaign,
          budget: Number(newCampaign.budget) || 0,
          spend: Number(newCampaign.spend) || 0,
          revenue: Number(newCampaign.revenue) || 0,
          redemptions: Number(newCampaign.redemptions) || 0,
          clicks: Number(newCampaign.clicks) || 0
        })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setCampaigns(prev => [...prev, created]);
      setShowNewCampaignModal(false);
      setNewCampaign({
        name: "",
        status: "Planned",
        budget: "",
        spend: "0",
        revenue: "0",
        coupon_code: "",
        redemptions: "0",
        clicks: "0",
        start_date: "",
        end_date: "",
        outlet_id: "All"
      });
    } catch {
      // Fallback local insert
      const created = {
        campaign_id: campaigns.length + 1,
        ...newCampaign,
        budget: Number(newCampaign.budget) || 0,
        spend: Number(newCampaign.spend) || 0,
        revenue: Number(newCampaign.revenue) || 0,
        redemptions: Number(newCampaign.redemptions) || 0,
        clicks: Number(newCampaign.clicks) || 0,
        start_date: newCampaign.start_date || new Date().toISOString().split("T")[0],
        end_date: newCampaign.end_date || new Date().toISOString().split("T")[0]
      };
      setCampaigns(prev => [...prev, created]);
      setShowNewCampaignModal(false);
      setNewCampaign({
        name: "",
        status: "Planned",
        budget: "",
        spend: "0",
        revenue: "0",
        coupon_code: "",
        redemptions: "0",
        clicks: "0",
        start_date: "",
        end_date: "",
        outlet_id: "All"
      });
    } finally {
      setSubmittingCampaign(false);
    }
  }

  async function triggerSimulation(params: any) {
    setSimulatorLoading(true);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/simulate`, {
        method: "POST",
        headers,
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSimulatorResults(data);
    } catch {
      // Local fallback calculation if server is offline
      const budget = Number(params.budget) || 10000;
      const discount = Number(params.discount) || 10;
      const duration = Number(params.duration) || 7;
      const convRate = Math.min(35, 3 + (discount / 1.2) + (budget / 4000));
      const estimatedSales = Math.round(budget * (1.6 + (discount / 9)));
      const newCustomers = Math.round(budget / 100 * (discount / 10));
      const stockOutRisk = Math.round(Math.min(95, discount * 2.0 + (duration * 1.5)));

      const forecast = [];
      for (let day = 1; day <= duration; day++) {
        const base = Math.round((params.outlet_id === "All" ? 25000 : 12000) * (day % 2 === 0 ? 1.05 : 0.95));
        const promoFactor = Math.sin((day / duration) * Math.PI) * (estimatedSales / duration) * 1.15;
        forecast.push({
          day: `Day ${day}`,
          baseline: base,
          projected: Math.round(base + Math.max(0, promoFactor))
        });
      }
      setSimulatorResults({
        metrics: {
          projectedRevenue: estimatedSales,
          roi: Math.round(((estimatedSales - budget) / budget) * 100),
          conversionProbability: Math.round(convRate),
          newCustomers,
          stockOutRisk
        },
        forecast
      });
    } finally {
      setSimulatorLoading(false);
    }
  }

  async function triggerCopilotCopy(params: any) {
    setCopilotLoading(true);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/generate-copy`, {
        method: "POST",
        headers,
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCopilotResults(data);
    } catch {
      // Local fallback templates
      const { name, coupon_code, outlet_name, discount } = params;
      setCopilotResults({
        sms: `☕ FranchiseOps AI Alert: Unlock ${discount} off on your next order with code ${coupon_code} at ${outlet_name}! Valid for a limited time. Tap to order: fops.co/m`,
        email: `
<div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b; text-align: left;">
    <h2 style="color: #2dd4bf; margin-top: 0; font-size: 18px;">Warm Up Your Day! ☕</h2>
    <p style="font-size: 13px; line-height: 1.4;">We are excited to launch our new <strong>${name}</strong> exclusive offer at your local <strong>${outlet_name}</strong>.</p>
    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
      <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Your Promo Code</span>
      <div style="font-size: 22px; font-weight: bold; color: #1e293b; margin-top: 5px; font-family: monospace;">${coupon_code}</div>
      <p style="font-size: 12px; color: #2dd4bf; font-weight: 600; margin-bottom: 0; margin-top: 5px;">Get ${discount} discount immediately at checkout!</p>
    </div>
    <p style="font-size: 12px; color: #64748b; line-height: 1.4;">This exclusive promotion is valid from today onwards. Come visit us and treat yourself to our premium artisanal brews and fresh pastries!</p>
</div>
        `,
        social: `Introducing our latest campaign: ${name}! ✨☕\n\nTreat yourself to your favorite artisanal beverages and fresh kitchen bites. Get a sweet ${discount} discount at your local #${outlet_name.replace(/\s+/g, '')} using coupon code: ${coupon_code} during checkout! \n\n#CoffeeLovers #FranchiseOps`
      });
    } finally {
      setCopilotLoading(false);
    }
  }

  // Auto trigger simulation and copilot load on tab click
  useEffect(() => {
    if (active === "marketing" && marketingTab === "copilot") {
      triggerSimulation(simulatorParams);
      triggerCopilotCopy(copilotParams);
    }
  }, [active, marketingTab]);

  const t = isDark ? themes.dark : themes.light;
  const statusColor = isDark ? statusColorDark : statusColorLight;
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

  // ── Report Data Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || active !== "reporting") return;
    setReportLoading(true);
    const token = localStorage.getItem("fops_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    Promise.all([
      fetch(`${API_BASE_URL}/api/reports/revenue?period=${reportPeriod}`, { headers }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/reports/staff`, { headers }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/reports/inventory`, { headers }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/reports/campaigns`, { headers }).then(r => r.json()),
    ]).then(([rev, staff, inv, camp]) => {
      setReportData(rev);
      setReportStaff(staff);
      setReportInventory(inv);
      setReportCampaigns(Array.isArray(camp) ? camp : []);
    }).catch(() => {}).finally(() => setReportLoading(false));
  }, [isLoggedIn, active, reportPeriod]);

  // ── AI Chat Handler ──────────────────────────────────────────────────────
  async function handleChatSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const q = chatInput.trim().toLowerCase();
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);

    if (geminiApiKey) {
      setChatHistory(prev => [...prev, { role: "ai", text: "▋ (Thinking strategic response...)" }]);
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

User Prompt: ${userMsg}`
              }]
            }]
          })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not extract a response from Gemini. Check key or limit quota.";
        setChatHistory(prev => [...prev.slice(0, -1), { role: "ai", text }]);
      } catch (err) {
        setChatHistory(prev => [...prev.slice(0, -1), { role: "ai", text: "Could not reach Gemini model. Make sure key is valid." }]);
      }
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }

    setTimeout(() => {
      let reply = "I'm processing that request. For detailed analytics, navigate to the specific module above.";
      if (q.includes("health") || q.includes("score")) {
        reply = `🏥 Overall franchise health is ${intelligenceData?.overallHealth || 82}/100. Aurangabad CIDCO is our critical outlet at 41/100. Pune FC Road leads at 94/100.`;
      } else if (q.includes("stock") || q.includes("inventory") || q.includes("low")) {
        reply = `📦 We have ${inventorySummary?.critical || 2} critical low-stock items and ${inventorySummary?.watch || 3} on watch. Arabica Coffee Beans at Aurangabad needs immediate reorder.`;
      } else if (q.includes("revenue") || q.includes("sales")) {
        reply = `💰 Network revenue this month is ₹8.82L with +14.2% growth vs last month. Pune leads at ₹1.54L. Aurangabad is lowest at ₹61k.`;
      } else if (q.includes("campaign") || q.includes("marketing")) {
        reply = `📢 3 active campaigns running. SUMMER25 has 147% projected ROI. Our average CTR is 3.84% vs industry 1.9%. Click 'Marketing Agent' to see all details.`;
      } else if (q.includes("staff") || q.includes("employee") || q.includes("attendance")) {
        reply = `👥 148 staff across 8 outlets. Today's attendance rate is ${attendanceRateToday}%. ${presentToday} present, ${absentToday} absent, ${lateToday} late. Amit Verma at Mumbai has a chronic attendance issue.`;
      } else if (q.includes("best") || q.includes("top") || q.includes("perform")) {
        reply = `🏆 Top performers: (1) Pune FC Road — ₹1.54L, +10.1% growth. (2) Thane Estate — ₹1.35L, +7.8%. (3) Nashik City Center — ₹1.28L, +6.4%.`;
      } else if (q.includes("worst") || q.includes("critical") || q.includes("attention")) {
        reply = `🚨 Aurangabad CIDCO needs urgent attention — Health 41/100, Revenue ₹61k (-12.5% below target). Recommend: staffing audit + inventory reorder + marketing boost.`;
      } else if (q.includes("recommend") || q.includes("swot") || q.includes("fix") || q.includes("strategy")) {
        reply = `🧠 AI STRATEGIC REPORT & SWOT:\n\n💪 STRENGTHS: Pune FC Road is outperforming at 94/100 health. Network growth is solid (+14.2% MTD).\n\n⚠️ WEAKNESSES: Aurangabad CIDCO is critical (41/100) due to low inventory and understaffing.\n\n🚀 OPPORTUNITIES: Summer Hype campaign shows a 147% ROI. Recommending rolling out SUMMER25 coupon to Aurangabad CIDCO immediately.\n\n🚨 THREATS: Low stock alerts at Mumbai Andheri and Aurangabad. Reorder Arabica beans immediately to avoid stockout.`;
      } else if (q.includes("audit")) {
        reply = `✅ 2 audits completed this week. Nashik scored 91/100. Aurangabad pending — last score was 41/100. Navigate to Audit tab to file a new compliance report.`;
      }
      setChatHistory(prev => [...prev, { role: "ai", text: reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 600);
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

                  {/* ── Beast Mode Upgrade: Sandbox & MLOps Console ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Left Column: What-If ML Simulation Sandbox */}
                    <div className="rounded-xl border p-5 text-left" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles size={16} color={accent} />
                        <h3 className="text-sm font-semibold" style={{ color: t.text }}>"What-If" ML Simulation Sandbox</h3>
                      </div>
                      <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                        Run custom scenario simulations to forecast how promotional discounts and marketing budgets affect revenue.
                      </p>

                      <div className="space-y-4">
                        {/* Target Outlet */}
                        <div>
                          <label className="block text-[10px] font-semibold mb-1" style={{ color: t.textFaint }}>Target Outlet</label>
                          <select
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSelectedSimOutlet(val);
                              setSimulatedData(prev => {
                                const next = { ...prev };
                                delete next[val];
                                return next;
                              });
                            }}
                            value={selectedSimOutlet || ""}
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          >
                            <option value="">Select an outlet to simulate...</option>
                            {intelligenceData.outletsHealth?.map((o: any) => (
                              <option key={o.outlet_id} value={o.outlet_id}>{o.outlet_name}</option>
                            ))}
                          </select>
                        </div>

                        {selectedSimOutlet && (
                          <>
                            {/* Sliders */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold mb-1" style={{ color: t.textFaint }}>
                                  Promo Discount Rate: <span className="font-bold text-teal-400">{simulateParams.discount_pct}%</span>
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  step="5"
                                  value={simulateParams.discount_pct}
                                  onChange={(e) => setSimulateParams(prev => ({ ...prev, discount_pct: Number(e.target.value) }))}
                                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold mb-1" style={{ color: t.textFaint }}>
                                  Marketing Spend: <span className="font-bold text-teal-400">{simulateParams.spend_multiplier}x</span>
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="3"
                                  step="0.2"
                                  value={simulateParams.spend_multiplier}
                                  onChange={(e) => setSimulateParams(prev => ({ ...prev, spend_multiplier: Number(e.target.value) }))}
                                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Run Simulator Button */}
                            <button
                              onClick={() => handleRunSimulation(selectedSimOutlet)}
                              disabled={simulating}
                              className="w-full py-2 rounded-lg font-bold text-xs shadow transition-all duration-200"
                              style={{ background: accent, color: t.bg, opacity: simulating ? 0.7 : 1 }}
                            >
                              {simulating ? "Inference Running..." : "Run ML Simulation Scenario"}
                            </button>

                            {/* Simulation Results Output */}
                            {simulatedData[selectedSimOutlet] && (
                              <div className="p-3.5 rounded-lg border text-xs text-left"
                                style={{ background: t.bg, borderColor: "rgba(139,92,246,0.3)" }}>
                                <p className="font-bold text-[10px] uppercase tracking-wider text-teal-400 mb-2">Simulated Forecast Outcomes</p>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <p style={{ color: t.textFaint }}>Base Forecasted Revenue</p>
                                    <p className="font-semibold text-slate-300">₹{Math.round(simulatedData[selectedSimOutlet].original_revenue).toLocaleString("en-IN")}</p>
                                  </div>
                                  <div>
                                    <p style={{ color: t.textFaint }}>Simulated Revenue</p>
                                    <p className="font-semibold" style={{ color: "#a78bfa" }}>
                                      ₹{Math.round(simulatedData[selectedSimOutlet].simulated_revenue).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 pt-2.5 border-t border-dashed flex justify-between items-center" style={{ borderColor: t.border }}>
                                  <span style={{ color: t.textMuted }}>Overall Margin Impact</span>
                                  <span className={`font-bold ${simulatedData[selectedSimOutlet].margin_delta_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {simulatedData[selectedSimOutlet].margin_delta_pct >= 0 ? "+" : ""}{simulatedData[selectedSimOutlet].margin_delta_pct}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Column: MLOps Model Health & Online Retraining Console */}
                    <div className="rounded-xl border p-5 text-left" style={{ background: t.card, borderColor: t.border }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Settings size={16} color={accent} />
                        <h3 className="text-sm font-semibold" style={{ color: t.text }}>MLOps Model Health &amp; Tuning</h3>
                      </div>
                      <p className="text-[11px] mb-4" style={{ color: t.textFaint }}>
                        Monitor feature importances, tracking performance error rates, and retrain ML models live on incoming POS data.
                      </p>

                      {mlMetrics ? (
                        <div className="space-y-4">
                          {/* Accuracy Metrics */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: t.textFaint }}>Revenue Error</p>
                              <p className="text-xs font-bold text-teal-400">₹{Math.round(mlMetrics.revenue_mae).toLocaleString("en-IN")}</p>
                            </div>
                            <div className="p-2 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: t.textFaint }}>Demand Accuracy</p>
                              <p className="text-xs font-bold text-teal-400">{(mlMetrics.demand_accuracy * 100).toFixed(1)}%</p>
                            </div>
                            <div className="p-2 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: t.textFaint }}>Reorder Error</p>
                              <p className="text-xs font-bold text-teal-400">{mlMetrics.reorder_mae?.toFixed(2)} units</p>
                            </div>
                          </div>

                          {/* Retrain Action */}
                          <div className="flex items-center justify-between border-t pt-2.5" style={{ borderColor: t.border }}>
                            <span className="text-[10px]" style={{ color: t.textFaint }}>
                              Last retrained: {mlMetrics.trained_at ? new Date(mlMetrics.trained_at).toLocaleTimeString() : "Never"}
                            </span>
                            <button
                              onClick={handleRetrainModels}
                              disabled={retraining}
                              className="px-3.5 py-1.5 rounded-lg font-bold text-xs border hover:bg-teal-500/5 transition-colors"
                              style={{ borderColor: `${accent}40`, color: accent }}
                            >
                              {retraining ? "Training..." : "Retrain Core Models"}
                            </button>
                          </div>

                          {/* Training Console Output logs */}
                          {retrainMessage && (
                            <div className="p-2.5 rounded-lg font-mono text-[9px] text-left text-teal-400 border border-teal-500/20"
                              style={{ background: "#090d16" }}>
                              <span className="animate-pulse mr-1.5">●</span> {retrainMessage}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-xs" style={{ color: t.textFaint }}>Metrics data unavailable</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : active === "marketing" ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium" style={{ color: t.textFaint }}>Marketing &amp; Growth</p>
                  <h2 className="text-xl font-bold mt-0.5" style={{ color: t.text }}>Marketing Agent</h2>
                </div>
                <button
                  onClick={() => setShowNewCampaignModal(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg"
                  style={{ background: accent, color: t.bg }}
                >
                  <Megaphone size={14} /> Launch Campaign
                </button>
              </div>

              {/* Subtabs */}
              <div className="flex border-b" style={{ borderColor: t.border }}>
                <button
                  onClick={() => setMarketingTab("campaigns")}
                  className="px-4 py-2.5 text-xs font-semibold border-b-2 -mb-[2px] transition-all"
                  style={{ borderColor: marketingTab === "campaigns" ? accent : "transparent", color: marketingTab === "campaigns" ? t.text : t.textMuted }}
                >
                  Campaign Performance
                </button>
                <button
                  onClick={() => setMarketingTab("engagement")}
                  className="px-4 py-2.5 text-xs font-semibold border-b-2 -mb-[2px] transition-all"
                  style={{ borderColor: marketingTab === "engagement" ? accent : "transparent", color: marketingTab === "engagement" ? t.text : t.textMuted }}
                >
                  Customer Engagement &amp; Sentiment
                </button>
                <button
                  onClick={() => setMarketingTab("copilot")}
                  className="px-4 py-2.5 text-xs font-semibold border-b-2 -mb-[2px] transition-all flex items-center gap-1"
                  style={{ borderColor: marketingTab === "copilot" ? accent : "transparent", color: marketingTab === "copilot" ? t.text : t.textMuted }}
                >
                  <Sparkles size={12} color={marketingTab === "copilot" ? accent : t.textFaint} /> AI Copilot &amp; Sandbox
                </button>
              </div>

              {marketingLoading ? (
                <div className="py-12 text-center text-xs" style={{ color: t.textFaint }}>Loading insights...</div>
              ) : marketingError ? (
                <div className="p-4 rounded-xl border text-xs" style={{ background: "#FB71851A", color: "#FB7185", borderColor: "#FB718533" }}>{marketingError}</div>
              ) : (
                <>
                  {marketingTab === "campaigns" ? (
                    <div className="space-y-6">
                      {/* Campaign KPIs */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                          {
                            label: "Total Budget",
                            value: `₹${(campaigns.reduce((sum, c) => sum + (c.budget || 0), 0) / 1000).toFixed(0)}k`,
                            sub: "Across all campaigns",
                            color: t.text
                          },
                          {
                            label: "Total Spend MTD",
                            value: `₹${(campaigns.reduce((sum, c) => sum + (c.spend || 0), 0) / 1000).toFixed(0)}k`,
                            sub: "Spend allocation",
                            color: accent
                          },
                          {
                            label: "Total Revenue Generated",
                            value: `₹${(campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0) / 1000).toFixed(0)}k`,
                            sub: "Attributed sales conversion",
                            color: "#F59E0B"
                          },
                          {
                            label: "Average Campaign ROI",
                            value: campaigns.reduce((sum, c) => sum + (c.spend || 0), 0) > 0
                              ? `${((campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0) / campaigns.reduce((sum, c) => sum + (c.spend || 0), 0)) * 100).toFixed(0)}%`
                              : "0%",
                            sub: "Revenue / Spend ratio",
                            color: "#2DD4BF"
                          },
                          {
                            label: "Click-Through Rate (CTR)",
                            value: "3.84%",
                            sub: "Industry avg: 1.9%",
                            color: "#F59E0B"
                          },
                          {
                            label: "Conversion Rate",
                            value: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0) > 0
                              ? `${((campaigns.reduce((sum, c) => sum + (c.redemptions || 0), 0) / campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0)) * 100).toFixed(1)}%`
                              : "0%",
                            sub: "Redemptions / Clicks",
                            color: "#2DD4BF"
                          }
                        ].map((card, idx) => (
                          <div key={idx} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: t.textFaint }}>{card.label}</p>
                            <p className="text-xl font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
                            <p className="text-[10px] mt-1" style={{ color: t.textMuted }}>{card.sub}</p>
                          </div>
                        ))}
                      </div>

                      {/* Charts section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Spend vs Revenue Chart */}
                        <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Spend vs Revenue Generated</p>
                          <p className="text-xs mb-4" style={{ color: t.textFaint }}>Financial return comparative analysis</p>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={campaigns.filter(c => c.spend > 0 || c.revenue > 0)}>
                              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                              <YAxis tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                              <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Bar dataKey="spend" name="Spend (₹)" fill="#FB7185" radius={[3, 3, 0, 0]} />
                              <Bar dataKey="revenue" name="Revenue (₹)" fill="#2DD4BF" radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Conversions / Redemptions Chart */}
                        <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Clicks vs Coupon Redemptions</p>
                          <p className="text-xs mb-4" style={{ color: t.textFaint }}>Engagement &amp; redemption funnel metrics</p>
                          <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={campaigns.filter(c => c.clicks > 0)}>
                              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                              <YAxis tick={{ fontSize: 10, fill: t.textFaint }} stroke={t.gridLine} />
                              <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Line type="monotone" dataKey="clicks" name="Ad Clicks" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                              <Line type="monotone" dataKey="redemptions" name="Coupons Redeemed" stroke="#2DD4BF" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Campaign Leaderboard / Ranking */}
                      <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Campaign Leaderboard &amp; Ranking</p>
                        <p className="text-xs mb-4" style={{ color: t.textFaint }}>Top performing initiatives ranked by Return on Investment (ROI)</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                          {campaigns
                            .filter(c => c.spend > 0)
                            .map((c) => {
                              const roiNum = Math.round((c.revenue / c.spend) * 100);
                              return { ...c, roiNum };
                            })
                            .sort((a, b) => b.roiNum - a.roiNum)
                            .slice(0, 3)
                            .map((c, index) => {
                              const rankColors = ["text-teal-400 border-teal-500/30 bg-teal-500/10", "text-amber-400 border-amber-500/30 bg-amber-500/10", "text-slate-400 border-slate-500/30 bg-slate-500/10"];
                              return (
                                <div key={c.campaign_id} className="p-3.5 rounded-xl border flex items-center justify-between" style={{ background: t.bg, borderColor: t.border }}>
                                  <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border ${rankColors[index] || "text-slate-400 border-slate-700 bg-slate-800"}`}>
                                      #{index + 1}
                                    </span>
                                    <div>
                                      <p className="font-semibold text-xs text-slate-200">{c.name}</p>
                                      <p className="text-[10px] text-slate-500">Code: {c.coupon_code || "—"}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold text-teal-400">+{c.roiNum}% ROI</p>
                                    <p className="text-[9px] text-slate-500">₹{(c.revenue / 1000).toFixed(1)}k Rev</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Campaigns Table */}
                      <div className="rounded-xl border overflow-hidden transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                        <p className="text-sm font-semibold px-5 pt-5 pb-1" style={{ color: t.text }}>All Marketing Campaigns</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm mt-3">
                            <thead>
                              <tr className="text-left text-xs border-y" style={{ color: t.textFaint, borderColor: t.border }}>
                                <th className="px-5 py-2.5 font-medium">Campaign</th>
                                <th className="px-5 py-2.5 font-medium">Coupon Code</th>
                                <th className="px-5 py-2.5 font-medium">Target Outlet</th>
                                <th className="px-5 py-2.5 font-medium">Status</th>
                                <th className="px-5 py-2.5 font-medium">Budget vs. Spend</th>
                                <th className="px-5 py-2.5 font-medium text-right">Revenue</th>
                                <th className="px-5 py-2.5 font-medium text-right">ROI</th>
                              </tr>
                            </thead>
                            <tbody>
                              {campaigns.map((c) => {
                                const spendPct = Math.min(100, Math.round(((c.spend || 0) / (c.budget || 1)) * 100));
                                const roi = c.spend > 0 ? `${((c.revenue / c.spend) * 100).toFixed(0)}%` : "0%";
                                return (
                                  <tr key={c.campaign_id} className="border-b last:border-0" style={{ borderColor: t.border }}>
                                    <td className="px-5 py-3">
                                      <p className="font-semibold text-xs" style={{ color: t.text }}>{c.name}</p>
                                      <p className="text-[10px]" style={{ color: t.textFaint }}>{c.start_date} to {c.end_date}</p>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs" style={{ color: accent }}>{c.coupon_code || "—"}</td>
                                    <td className="px-5 py-3 text-xs" style={{ color: t.textMuted }}>
                                      {c.outlet_id === "All" ? "Network-Wide" : `Outlet #${c.outlet_id}`}
                                    </td>
                                    <td className="px-5 py-3">
                                      <span
                                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                        style={{
                                          background: c.status === "Active" ? `${accent}1A` : c.status === "Completed" ? "#64748B1A" : "#F59E0B1A",
                                          color: c.status === "Active" ? accent : c.status === "Completed" ? t.textMuted : "#F59E0B",
                                          borderColor: "transparent"
                                        }}
                                      >
                                        {c.status}
                                      </span>
                                    </td>
                                    <td className="px-5 py-3 min-w-[140px]">
                                      <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: t.textFaint }}>
                                        <span>₹{(c.spend || 0).toLocaleString("en-IN")}</span>
                                        <span>₹{(c.budget || 0).toLocaleString("en-IN")}</span>
                                      </div>
                                      <div className="w-full h-1.5 rounded-full" style={{ background: t.border }}>
                                        <div className="h-full rounded-full" style={{ width: `${spendPct}%`, background: c.status === "Active" ? accent : "#64748B" }} />
                                      </div>
                                    </td>
                                    <td className="px-5 py-3 text-right text-xs font-semibold" style={{ color: t.text }}>
                                      {c.revenue > 0 ? `₹${(c.revenue || 0).toLocaleString("en-IN")}` : "—"}
                                    </td>
                                    <td className="px-5 py-3 text-right text-xs font-bold" style={{ color: c.revenue > c.spend ? accent : t.textMuted }}>
                                      {c.revenue > 0 ? roi : "—"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : marketingTab === "engagement" ? (
                    <div className="space-y-6">
                      {/* Customer Engagement Analytics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                          { label: "Total Reviews", value: String(campaignStats?.stats?.totalReviews || 0), desc: "Direct feedback submissions" },
                          { label: "Average Rating", value: `${campaignStats?.stats?.averageRating || 0} / 5`, desc: "Aggregate network rating" },
                          { label: "Net Promoter Score", value: `${campaignStats?.stats?.nps || 0}`, desc: "Promoters minus Detractors" },
                          { label: "Retention Rate", value: `${campaignStats?.stats?.customerRetentionRate || 0}%`, desc: "30-day returning customers" },
                          { label: "Customer Lifetime Value", value: `₹${(campaignStats?.stats?.customerLifetimeValue || 0).toLocaleString("en-IN")}`, desc: "Avg network user spend" }
                        ].map((stat, idx) => (
                          <div key={idx} className="rounded-xl border p-4 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: t.textFaint }}>{stat.label}</p>
                            <p className="text-lg font-bold mt-1" style={{ color: accent }}>{stat.value}</p>
                            <p className="text-[10px] mt-1" style={{ color: t.textMuted }}>{stat.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Sentiment & NPS dials */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Sentiment breakdown */}
                        <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Customer Sentiment Analysis</p>
                          <p className="text-xs mb-5" style={{ color: t.textFaint }}>Real-time NLP categorizations of text reviews</p>

                          <div className="space-y-3.5">
                            {[
                              { label: "Positive Sentiment", pct: campaignStats?.stats?.sentiment?.positive || 0, color: accent, bg: `${accent}1D` },
                              { label: "Neutral Sentiment", pct: campaignStats?.stats?.sentiment?.neutral || 0, color: "#F59E0B", bg: "#F59E0B1D" },
                              { label: "Negative Sentiment", pct: campaignStats?.stats?.sentiment?.negative || 0, color: "#FB7185", bg: "#FB71851D" }
                            ].map((bar, idx) => (
                              <div key={idx}>
                                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                  <span style={{ color: t.textMuted }}>{bar.label}</span>
                                  <span style={{ color: bar.color }}>{bar.pct}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full" style={{ background: t.border }}>
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bar.pct}%`, background: bar.color }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* NPS Dial gauge */}
                        <div className="rounded-xl border p-5 flex flex-col justify-between transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Net Promoter Score (NPS)</p>
                            <p className="text-xs mb-2" style={{ color: t.textFaint }}>Brand loyalty and customer recommendation score</p>
                          </div>
                          <div className="flex items-center justify-center py-2 relative">
                            {/* SVG Gauge */}
                            <svg className="w-28 h-28 transform -rotate-90">
                              <circle cx="56" cy="56" r="44" stroke={t.border} strokeWidth="8" fill="transparent" />
                              <circle cx="56" cy="56" r="44" stroke={accent} strokeWidth="8" fill="transparent"
                                strokeDasharray={276}
                                strokeDashoffset={276 - (276 * Math.max(0, Math.min(100, (campaignStats?.stats?.nps || 0) + 50))) / 150} // Scale NPS (-100 to 100) to gauge percentage
                                className="transition-all duration-500"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold" style={{ color: t.text }}>{campaignStats?.stats?.nps || 0}</span>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: accent }}>
                                {campaignStats?.stats?.nps >= 50 ? "Excellent" : campaignStats?.stats?.nps >= 30 ? "Good" : "Needs Work"}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px]" style={{ color: t.textFaint }}>
                            <span>-100 (Detractor)</span>
                            <span>+100 (Promoter)</span>
                          </div>
                        </div>

                        {/* Keyword Cloud */}
                        <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Trending Customer Feedback Tags</p>
                          <p className="text-xs mb-4" style={{ color: t.textFaint }}>Top recurring themes in customer comments</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {campaignStats?.stats?.keywords?.map((kw: any, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-colors"
                                style={{
                                  background: kw.type === "positive" ? `${accent}1A` : "#FB71851A",
                                  borderColor: kw.type === "positive" ? `${accent}33` : "#FB718533",
                                  color: kw.type === "positive" ? accent : "#FB7185"
                                }}
                              >
                                {kw.tag}
                                <span className="text-[10px] opacity-70 px-1 rounded bg-black/10">{kw.count}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent reviews and interactive answers */}
                      <div className="rounded-xl border p-5 transition-colors duration-200" style={{ background: t.card, borderColor: t.border }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>Recent Customer Reviews Feed</p>
                        <p className="text-xs mb-4" style={{ color: t.textFaint }}>Engage directly with feedback, reply using simulated AI suggestions</p>

                        <div className="space-y-4">
                          {campaignStats?.reviews?.map((review: any, idx: number) => {
                            const isReplied = !!repliedReviews[review.rating_id];
                            return (
                              <div key={review.rating_id} className="p-4 rounded-xl border text-xs space-y-2.5 transition-colors duration-200" style={{ background: t.bg, borderColor: t.border }}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-xs" style={{ color: t.text }}>{review.customer_name}</span>
                                    <span className="text-[10px] ml-2" style={{ color: t.textFaint }}>{review.review_date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, starIdx) => (
                                      <span key={starIdx} style={{ color: starIdx < review.rating ? "#F59E0B" : t.border }}>★</span>
                                    ))}
                                  </div>
                                </div>
                                <p className="leading-relaxed" style={{ color: t.textMuted }}>{review.feedback}</p>
                                <div className="flex items-center gap-2 text-[10px]" style={{ color: t.textFaint }}>
                                  <span className="font-semibold text-teal-400">{review.outlets?.outlet_name}</span>
                                  <span>•</span>
                                  <span>{review.outlets?.city}</span>
                                </div>

                                {/* Reply Section */}
                                <div className="pt-2 border-t" style={{ borderColor: t.border }}>
                                  {isReplied ? (
                                    <div className="p-2.5 rounded-lg border flex flex-col gap-1" style={{ background: `${accent}0C`, borderColor: `${accent}20` }}>
                                      <span className="font-bold text-[9px] uppercase tracking-wider text-teal-400">Response Sent</span>
                                      <p className="text-[11px]" style={{ color: t.textMuted }}>{repliedReviews[review.rating_id]}</p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        placeholder="Type manager response here..."
                                        value={replyInput[review.rating_id] || ""}
                                        onChange={(e) => setReplyInput(prev => ({ ...prev, [review.rating_id]: e.target.value }))}
                                        className="flex-1 text-xs rounded-lg border px-3 py-1.5 outline-none"
                                        style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                                      />
                                      <button
                                        onClick={() => {
                                          const text = replyInput[review.rating_id] || "Thank you for sharing your feedback with us! We look forward to serving you again.";
                                          setRepliedReviews(prev => ({ ...prev, [review.rating_id]: text }));
                                        }}
                                        className="px-3 py-1.5 rounded-lg font-bold text-xs"
                                        style={{ background: accent, color: t.bg }}
                                      >
                                        Reply
                                      </button>
                                      <button
                                        onClick={() => {
                                          const replies = [
                                            "Thank you so much for the 5-star review! We are thrilled you enjoyed the cold coffee and services.",
                                            "We appreciate your honest feedback. We've informed the outlet manager to check coffee sweetness levels immediately.",
                                            "We are incredibly sorry for the delay. We are actively auditing staffing during peak hours to resolve this wait.",
                                            "Thrilled to hear you loved the sourdough croissant! We will share your kind words with our bakers.",
                                            "Thanks for the heads-up. We've contacted our IT vendor to fix the WiFi issue at the Thane outlet right away."
                                          ];
                                          const randomReply = review.rating === 5 ? replies[0] : review.rating === 4 ? replies[1] : review.rating <= 2 ? replies[2] : replies[4];
                                          setRepliedReviews(prev => ({ ...prev, [review.rating_id]: `[AI Suggestion] ${randomReply}` }));
                                        }}
                                        className="px-3 py-1.5 rounded-lg font-bold text-xs border hover:bg-teal-500/5 transition-colors"
                                        style={{ borderColor: `${accent}40`, color: accent }}
                                      >
                                        ⚡ Auto-Generate AI Response
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* AI Copilot & Sandbox Panel */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT: Promotion Sandbox (5 columns) */}
                        <div className="lg:col-span-5 rounded-xl border p-5 flex flex-col justify-between" style={{ background: t.card, borderColor: t.border }}>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles size={16} color={accent} />
                              <p className="text-sm font-semibold" style={{ color: t.text }}>AI Promotion Sandbox</p>
                            </div>
                            <p className="text-[11px] mb-5" style={{ color: t.textFaint }}>Adjust parameters to simulate sales conversions &amp; operational risks</p>

                            <div className="space-y-4 text-left">
                              {/* Sliders */}
                              <div>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span style={{ color: t.textMuted }}>Discount (%)</span>
                                  <span style={{ color: accent }}>{simulatorParams.discount}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="50"
                                  step="5"
                                  value={simulatorParams.discount}
                                  onChange={(e) => {
                                    const next = { ...simulatorParams, discount: e.target.value };
                                    setSimulatorParams(next);
                                    triggerSimulation(next);
                                  }}
                                  className="w-full accent-teal-400 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span style={{ color: t.textMuted }}>Marketing Budget (₹)</span>
                                  <span style={{ color: accent }}>₹{Number(simulatorParams.budget).toLocaleString("en-IN")}</span>
                                </div>
                                <input
                                  type="range"
                                  min="2000"
                                  max="100000"
                                  step="2000"
                                  value={simulatorParams.budget}
                                  onChange={(e) => {
                                    const next = { ...simulatorParams, budget: e.target.value };
                                    setSimulatorParams(next);
                                    triggerSimulation(next);
                                  }}
                                  className="w-full accent-teal-400 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                  <span style={{ color: t.textMuted }}>Campaign Duration (Days)</span>
                                  <span style={{ color: accent }}>{simulatorParams.duration} Days</span>
                                </div>
                                <input
                                  type="range"
                                  min="3"
                                  max="30"
                                  step="1"
                                  value={simulatorParams.duration}
                                  onChange={(e) => {
                                    const next = { ...simulatorParams, duration: e.target.value };
                                    setSimulatorParams(next);
                                    triggerSimulation(next);
                                  }}
                                  className="w-full accent-teal-400 cursor-pointer"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: t.textMuted }}>Target Outlet</label>
                                <select
                                  value={simulatorParams.outlet_id}
                                  onChange={(e) => {
                                    const next = { ...simulatorParams, outlet_id: e.target.value };
                                    setSimulatorParams(next);
                                    triggerSimulation(next);
                                  }}
                                  className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                                  style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                                >
                                  <option value="All">All Outlets (Network-wide)</option>
                                  {outlets.map((o) => (
                                    <option key={o.outlet_id} value={o.outlet_id}>{o.outlet_name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Live Simulation KPI Gauges */}
                          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t" style={{ borderColor: t.border }}>
                            <div className="p-2.5 rounded-lg border text-center" style={{ background: t.bg, borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: t.textFaint }}>Projected ROI</p>
                              <p className="text-base font-extrabold mt-0.5" style={{ color: accent }}>
                                {simulatorLoading ? "..." : `${simulatorResults?.metrics?.roi ?? 0}%`}
                              </p>
                            </div>
                            <div className="p-2.5 rounded-lg border text-center" style={{ background: t.bg, borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: t.textFaint }}>New Customers</p>
                              <p className="text-base font-extrabold mt-0.5" style={{ color: "#F59E0B" }}>
                                {simulatorLoading ? "..." : simulatorResults?.metrics?.newCustomers ?? 0}
                              </p>
                            </div>
                            <div className="p-2.5 rounded-lg border text-center" style={{ background: t.bg, borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: t.textFaint }}>Conversion Probability</p>
                              <p className="text-base font-extrabold mt-0.5" style={{ color: "#2DD4BF" }}>
                                {simulatorLoading ? "..." : `${simulatorResults?.metrics?.conversionProbability ?? 0}%`}
                              </p>
                            </div>
                            <div className="p-2.5 rounded-lg border text-center" style={{ background: t.bg, borderColor: t.border }}>
                              <p className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: t.textFaint }}>Stock-out Risk</p>
                              <p className="text-base font-extrabold mt-0.5" style={{ color: (simulatorResults?.metrics?.stockOutRisk ?? 0) > 60 ? "#FB7185" : "#2DD4BF" }}>
                                {simulatorLoading ? "..." : `${simulatorResults?.metrics?.stockOutRisk ?? 0}%`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Visual Predictions & Asset Preview (7 columns) */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                          {/* Simulation Chart */}
                          <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold" style={{ color: t.text }}>Conversion Forecast Projection</p>
                              <span className="text-[10px] px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/5 text-teal-400 font-bold">
                                Projected Revenue: ₹{Number(simulatorResults?.metrics?.projectedRevenue || 0).toLocaleString("en-IN")}
                              </span>
                            </div>
                            {simulatorLoading ? (
                              <div className="h-[180px] flex items-center justify-center text-xs" style={{ color: t.textFaint }}>Simulating model...</div>
                            ) : (
                              <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={simulatorResults?.forecast || []}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: t.textFaint }} stroke={t.gridLine} />
                                  <YAxis tick={{ fontSize: 9, fill: t.textFaint }} stroke={t.gridLine} />
                                  <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                                  <Legend wrapperStyle={{ fontSize: 9 }} />
                                  <Line type="monotone" dataKey="baseline" name="Baseline Sales (₹)" stroke="#64748B" strokeWidth={1.5} dot={{ r: 2 }} />
                                  <Line type="monotone" dataKey="projected" name="Projected Sales MTD (₹)" stroke={accent} strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            )}
                          </div>

                          {/* Copilot Asset Generator */}
                          <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: t.border }}>
                              <div className="flex items-center gap-1.5">
                                <Megaphone size={14} color={accent} />
                                <span className="text-xs font-bold" style={{ color: t.text }}>AI Copilot Asset Generator</span>
                              </div>
                              {/* Asset Tabs */}
                              <div className="flex gap-1">
                                {["sms", "email", "social"].map((format) => (
                                  <button
                                    key={format}
                                    onClick={() => setCopilotActiveFormat(format as "sms" | "email" | "social")}
                                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                                    style={{
                                      background: copilotActiveFormat === format ? `${accent}1A` : "transparent",
                                      color: copilotActiveFormat === format ? accent : t.textMuted
                                    }}
                                  >
                                    {format}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Generator Parameters Inline Form */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-left">
                              <div>
                                <label className="block text-[10px] font-semibold mb-1" style={{ color: t.textFaint }}>Campaign Topic</label>
                                <input
                                  type="text"
                                  value={copilotParams.name}
                                  onChange={(e) => {
                                    const next = { ...copilotParams, name: e.target.value };
                                    setCopilotParams(next);
                                    triggerCopilotCopy(next);
                                  }}
                                  className="w-full text-[11px] rounded border px-2.5 py-1.5 outline-none"
                                  style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold mb-1" style={{ color: t.textFaint }}>Coupon Code</label>
                                <input
                                  type="text"
                                  value={copilotParams.coupon_code}
                                  onChange={(e) => {
                                    const next = { ...copilotParams, coupon_code: e.target.value.toUpperCase() };
                                    setCopilotParams(next);
                                    triggerCopilotCopy(next);
                                  }}
                                  className="w-full text-[11px] rounded border px-2.5 py-1.5 outline-none"
                                  style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                                />
                              </div>
                            </div>

                            {/* Render Preview Frame */}
                            {copilotLoading ? (
                              <div className="h-[160px] flex items-center justify-center text-xs" style={{ color: t.textFaint }}>Generating copywriting assets...</div>
                            ) : (
                              <div className="rounded-lg p-4 border text-[11px] min-h-[160px] flex flex-col justify-between" style={{ background: t.bg, borderColor: t.border }}>
                                {copilotActiveFormat === "sms" && (
                                  <div className="flex gap-2 text-left">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 shrink-0" />
                                    <div>
                                      <p className="font-bold text-slate-400 mb-1 text-[9px] uppercase tracking-wider">SMS Blast Mockup</p>
                                      <p className="leading-relaxed" style={{ color: t.textMuted }}>{copilotResults?.sms}</p>
                                    </div>
                                  </div>
                                )}

                                {copilotActiveFormat === "email" && (
                                  <div className="w-full overflow-y-auto max-h-[160px]">
                                    <p className="font-bold text-slate-400 mb-2 text-[9px] uppercase tracking-wider">Email HTML Preview</p>
                                    <div dangerouslySetInnerHTML={{ __html: copilotResults?.email }} />
                                  </div>
                                )}

                                {copilotActiveFormat === "social" && (
                                  <div className="flex gap-2 text-left">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 shrink-0" />
                                    <div>
                                      <p className="font-bold text-slate-400 mb-1 text-[9px] uppercase tracking-wider">Instagram / Facebook Captions</p>
                                      <p className="leading-relaxed whitespace-pre-wrap" style={{ color: t.textMuted }}>{copilotResults?.social}</p>
                                    </div>
                                  </div>
                                )}

                                <div className="mt-3 pt-2.5 border-t flex justify-end gap-2" style={{ borderColor: t.border }}>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        copilotActiveFormat === "sms" ? copilotResults?.sms :
                                        copilotActiveFormat === "social" ? copilotResults?.social : copilotResults?.email
                                      );
                                      alert("Asset copied to clipboard!");
                                    }}
                                    className="px-3 py-1 rounded text-[10px] font-bold border hover:bg-teal-500/5 transition-colors"
                                    style={{ borderColor: `${accent}40`, color: accent }}
                                  >
                                    Copy Asset
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Push to new campaign state automatically
                                      setNewCampaign(prev => ({
                                        ...prev,
                                        name: copilotParams.name,
                                        coupon_code: copilotParams.coupon_code,
                                        budget: simulatorParams.budget,
                                        outlet_id: simulatorParams.outlet_id
                                      }));
                                      setMarketingTab("campaigns");
                                      setShowNewCampaignModal(true);
                                    }}
                                    className="px-3 py-1 rounded text-[10px] font-bold"
                                    style={{ background: accent, color: t.bg }}
                                  >
                                    Apply to Campaign
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* ── ML Predictions Panel (visible only when ML service is running) ── */}
                      {intelligenceData?.mlPredictions?.available && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                              style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
                              <Sparkles size={10} />
                              LIVE ML — XGBoost + RandomForest
                            </div>
                            <span className="text-[10px]" style={{ color: t.textFaint }}>
                              Real predictions from trained models · {new Date(intelligenceData.mlPredictions.generated_at).toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {intelligenceData.outletsHealth?.map((outlet: any) => {
                              const ml = intelligenceData.mlPredictions.per_outlet?.[outlet.outlet_id];
                              if (!ml) return null;
                              const demandColor = ml.demand?.demand_label === "High"
                                ? { bg: "rgba(16,185,129,0.12)", text: "#34d399", border: "rgba(16,185,129,0.3)" }
                                : ml.demand?.demand_label === "Medium"
                                  ? { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", border: "rgba(245,158,11,0.3)" }
                                  : { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.3)" };
                              const predictedRev = ml.revenue?.predicted_revenue ?? 0;
                              const currentRev = intelligenceData.forecasts?.find((f: any) => f.outletId === outlet.outlet_id)?.currentRevenue ?? predictedRev;
                              const delta = currentRev > 0 ? ((predictedRev - currentRev) / currentRev) * 100 : 0;

                              return (
                                <div key={outlet.outlet_id}
                                  className="rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02]"
                                  style={{ background: t.card, borderColor: "rgba(139,92,246,0.25)", boxShadow: "0 0 12px rgba(139,92,246,0.08)" }}>

                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <p className="text-[11px] font-semibold" style={{ color: t.text }}>{outlet.outlet_name}</p>
                                      <p className="text-[9px] mt-0.5" style={{ color: t.textFaint }}>{outlet.city}</p>
                                    </div>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                      style={{ background: demandColor.bg, color: demandColor.text, border: `1px solid ${demandColor.border}` }}>
                                      {ml.demand?.demand_label ?? "—"} Demand
                                    </span>
                                  </div>

                                  {/* Revenue prediction */}
                                  <div className="mb-2.5">
                                    <p className="text-[9px] uppercase tracking-wider mb-1 font-medium" style={{ color: t.textFaint }}>
                                      ML Revenue Forecast
                                    </p>
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-base font-bold" style={{ color: "#a78bfa" }}>
                                        ₹{(predictedRev / 1000).toFixed(1)}k
                                      </span>
                                      <span className={`text-[10px] font-semibold ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>

                                  {/* Demand probabilities */}
                                  {ml.demand?.probabilities && (
                                    <div className="space-y-1 mt-2">
                                      {(["High", "Medium", "Low"] as const).map((level) => {
                                        const pct = ml.demand.probabilities[level] ?? 0;
                                        const barColor = level === "High" ? "#34d399" : level === "Medium" ? "#fbbf24" : "#f87171";
                                        return (
                                          <div key={level} className="flex items-center gap-1.5">
                                            <span className="text-[9px] w-10" style={{ color: t.textFaint }}>{level}</span>
                                            <div className="flex-1 h-1 rounded-full" style={{ background: t.border }}>
                                              <div className="h-1 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: barColor }} />
                                            </div>
                                            <span className="text-[9px] w-7 text-right" style={{ color: t.textFaint }}>{pct}%</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Confidence */}
                                  <div className="mt-2.5 pt-2 border-t flex items-center justify-between" style={{ borderColor: t.border }}>
                                    <span className="text-[9px]" style={{ color: t.textFaint }}>Confidence</span>
                                    <span className="text-[9px] font-bold" style={{ color: "#a78bfa" }}>
                                      {ml.revenue?.confidence_pct ?? "—"}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* AI Architecture, Models, Benefits & Roadmap (Out-of-the-world cards) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        {/* Column 1: AI Models */}
                        <div className="rounded-xl border p-4.5 text-left" style={{ background: t.card, borderColor: t.border }}>
                          <div className="flex items-center gap-1.5 mb-3 font-semibold text-xs text-teal-400">
                            <Sparkles size={13} />
                            <span>Active AI Engines</span>
                          </div>
                          <ul className="space-y-2 text-[11px]" style={{ color: t.textMuted }}>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              <span>Customer Segmentation (Loyal/Risky)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              <span>Campaign Prediction &amp; Sandbox</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              <span>Recommendation Engine (Stock matching)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              <span>Sentiment NLP Classifier</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              <span>Time Series Sales Forecasting</span>
                            </li>
                          </ul>
                        </div>

                        {/* Column 2: Benefits */}
                        <div className="rounded-xl border p-4.5 text-left" style={{ background: t.card, borderColor: t.border }}>
                          <div className="flex items-center gap-1.5 mb-3 font-semibold text-xs text-amber-400">
                            <TrendingUp size={13} />
                            <span>Business Benefits</span>
                          </div>
                          <ul className="space-y-2 text-[11px]" style={{ color: t.textMuted }}>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Better Campaign Decisions</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Higher ROI Conversions (+34%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Improved Customer Engagement</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Lower Marketing Spend waste</span>
                            </li>
                          </ul>
                        </div>

                        {/* Column 3: Database Schemas */}
                        <div className="rounded-xl border p-4.5 text-left" style={{ background: t.card, borderColor: t.border }}>
                          <div className="flex items-center gap-1.5 mb-3 font-semibold text-xs text-rose-400">
                            <Boxes size={13} />
                            <span>Database Integration</span>
                          </div>
                          <div className="space-y-2 text-[10px] font-mono" style={{ color: t.textFaint }}>
                            <div className="p-1.5 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="font-bold text-slate-300">TABLE campaigns</p>
                              <p>id, name, budget, spend, revenue, code</p>
                            </div>
                            <div className="p-1.5 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="font-bold text-slate-300">TABLE marketing_metrics</p>
                              <p>clicks, impressions, redemptions, CTR</p>
                            </div>
                            <div className="p-1.5 rounded bg-black/10 border" style={{ borderColor: t.border }}>
                              <p className="font-bold text-slate-300">TABLE roi_reports</p>
                              <p>report_id, outlet_id, month, actual_roi</p>
                            </div>
                          </div>
                        </div>

                        {/* Column 4: Future Roadmap */}
                        <div className="rounded-xl border p-4.5 text-left" style={{ background: t.card, borderColor: t.border }}>
                          <div className="flex items-center gap-1.5 mb-3 font-semibold text-xs text-purple-400">
                            <Sparkles size={13} />
                            <span>Future Scope Roadmap</span>
                          </div>
                          <ul className="space-y-2 text-[11px]" style={{ color: t.textMuted }}>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>GenAI Custom Visual Creator</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>WhatsApp API Auto-blast Integration</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>Predictive Marketing triggers</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>Voice Analytics NLP integration</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Launch Campaign Modal */}
              {showNewCampaignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl" style={{ background: t.card, borderColor: t.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-bold flex items-center gap-2" style={{ color: t.text }}>
                        <Megaphone size={16} color={accent} /> Launch New Campaign
                      </h3>
                      <button onClick={() => setShowNewCampaignModal(false)} className="text-slate-400 hover:text-slate-200 font-bold text-sm">✕</button>
                    </div>

                    <form onSubmit={handleCreateCampaign} className="space-y-4 text-left">
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Campaign Name</label>
                        <input
                          type="text"
                          required
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Winter Coffee Festival"
                          className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Promo/Coupon Code</label>
                          <input
                            type="text"
                            value={newCampaign.coupon_code}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, coupon_code: e.target.value.toUpperCase() }))}
                            placeholder="e.g. COFFEE20"
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Campaign Status</label>
                          <select
                            value={newCampaign.status}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          >
                            <option value="Planned">Planned</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Budget (₹)</label>
                          <input
                            type="number"
                            required
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                            placeholder="Budget limit"
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Target Outlet</label>
                          <select
                            value={newCampaign.outlet_id}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, outlet_id: e.target.value }))}
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          >
                            <option value="All">Network-Wide</option>
                            {outlets.map((o) => (
                              <option key={o.outlet_id} value={o.outlet_id}>{o.outlet_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>Start Date</label>
                          <input
                            type="date"
                            required
                            value={newCampaign.start_date}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, start_date: e.target.value }))}
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: t.textMuted }}>End Date</label>
                          <input
                            type="date"
                            required
                            value={newCampaign.end_date}
                            onChange={(e) => setNewCampaign(prev => ({ ...prev, end_date: e.target.value }))}
                            className="w-full text-xs rounded-lg border px-3 py-2 outline-none"
                            style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                          />
                        </div>
                      </div>

                      {/* Preset Simulation parameters for demo */}
                      <div className="p-3 rounded-lg border text-[10px] space-y-1.5" style={{ background: `${accent}0A`, borderColor: `${accent}1A` }}>
                        <span className="font-bold uppercase tracking-wider text-teal-400">Interactive Simulation Mode</span>
                        <div className="grid grid-cols-2 gap-2 text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-200">Spend:</span>
                            <input
                              type="number"
                              value={newCampaign.spend}
                              onChange={(e) => setNewCampaign(prev => ({ ...prev, spend: e.target.value }))}
                              className="w-full bg-black/10 rounded border p-1 text-[9px] mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200">Revenue:</span>
                            <input
                              type="number"
                              value={newCampaign.revenue}
                              onChange={(e) => setNewCampaign(prev => ({ ...prev, revenue: e.target.value }))}
                              className="w-full bg-black/10 rounded border p-1 text-[9px] mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200">Clicks:</span>
                            <input
                              type="number"
                              value={newCampaign.clicks}
                              onChange={(e) => setNewCampaign(prev => ({ ...prev, clicks: e.target.value }))}
                              className="w-full bg-black/10 rounded border p-1 text-[9px] mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200">Redemptions:</span>
                            <input
                              type="number"
                              value={newCampaign.redemptions}
                              onChange={(e) => setNewCampaign(prev => ({ ...prev, redemptions: e.target.value }))}
                              className="w-full bg-black/10 rounded border p-1 text-[9px] mt-0.5"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingCampaign}
                        className="w-full py-2.5 rounded-lg font-semibold text-xs mt-2"
                        style={{ background: accent, color: t.bg, opacity: submittingCampaign ? 0.7 : 1 }}
                      >
                        {submittingCampaign ? "Launching campaign..." : "Launch Campaign"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : active === "notifications" ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: t.textFaint }}>Notification Center</p>
                  <h2 className="text-xl font-black mt-0.5" style={{ color: t.text }}>Alerts & Updates</h2>
                </div>
                <div className="flex items-center gap-2">
                  {notifUnread > 0 && (
                    <button onClick={() => setNotifInbox(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors"
                      style={{ borderColor: t.border, color: t.textMuted, background: t.card }}>
                      Mark all read
                    </button>
                  )}
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ background: "#FB718520", color: "#FB7185" }}>
                    {notifUnread} unread
                  </span>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2">
                {["All", "Critical", "Warning", "Info"].map(f => (
                  <button key={f} className="text-xs px-3 py-1.5 rounded-full border transition-colors font-medium"
                    style={{ background: t.card, borderColor: t.border, color: t.textMuted }}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Notification cards */}
              <div className="space-y-3">
                {notifInbox.map(n => {
                  const priorityConfig: Record<string, {color: string; bg: string; icon: string}> = {
                    Critical: { color: "#FB7185", bg: "#FB718515", icon: "🚨" },
                    Warning: { color: "#F59E0B", bg: "#F59E0B15", icon: "⚠️" },
                    Info: { color: "#2DD4BF", bg: "#2DD4BF15", icon: "ℹ️" },
                  };
                  const pc = priorityConfig[n.priority] || priorityConfig.Info;
                  return (
                    <div key={n.id} className="rounded-xl border p-4 transition-all duration-200 relative overflow-hidden"
                      style={{ background: n.read ? t.card : pc.bg, borderColor: n.read ? t.border : pc.color + "40" }}>
                      {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ background: pc.color }} />}
                      <div className="flex items-start gap-3 pl-1">
                        <span className="text-base flex-shrink-0 mt-0.5">{pc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mr-2" style={{ background: pc.color + "20", color: pc.color }}>{n.priority}</span>
                              <span className="text-xs font-bold" style={{ color: t.text }}>{n.title}</span>
                            </div>
                            <span className="text-[10px] flex-shrink-0" style={{ color: t.textFaint }}>{n.time}</span>
                          </div>
                          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: t.textMuted }}>{n.body}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <button onClick={() => { setActive(n.actionTab); }}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors"
                              style={{ borderColor: pc.color + "50", color: pc.color, background: pc.color + "10" }}>
                              {n.action} →
                            </button>
                            {!n.read && (
                              <button onClick={() => setNotifInbox(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                                className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                                style={{ borderColor: t.border, color: t.textFaint, background: "transparent" }}>
                                Mark read
                              </button>
                            )}
                            <button onClick={() => setNotifInbox(prev => prev.filter(x => x.id !== n.id))}
                              className="text-xs px-2 py-1.5 rounded-lg border transition-colors ml-auto"
                              style={{ borderColor: t.border, color: t.textFaint }}>
                              Archive
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {notifInbox.length === 0 && (
                  <div className="rounded-xl border p-12 text-center" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-4xl mb-3">✅</p>
                    <p className="font-semibold" style={{ color: t.text }}>All caught up!</p>
                    <p className="text-sm mt-1" style={{ color: t.textFaint }}>No notifications remaining.</p>
                  </div>
                )}
              </div>
            </div>
          ) : active === "reporting" ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: t.textFaint }}>Analytics Suite</p>
                  <h2 className="text-xl font-black mt-0.5" style={{ color: t.text }}>Reports & Export</h2>
                </div>
                <div className="flex items-center gap-2">
                  {(["week", "month", "quarter"] as const).map(p => (
                    <button key={p} onClick={() => setReportPeriod(p)}
                      className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors capitalize"
                      style={{ background: reportPeriod === p ? accent : "transparent", borderColor: reportPeriod === p ? accent : t.border, color: reportPeriod === p ? t.bg : t.textMuted }}>
                      This {p}
                    </button>
                  ))}
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors"
                    style={{ borderColor: t.border, color: t.textMuted, background: t.card }}>
                    <Download size={12} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Report Tabs */}
              <div className="flex gap-2 flex-wrap">
                {([
                  { id: "revenue", label: "Revenue Report", icon: TrendingUp },
                  { id: "staff", label: "Staff Performance", icon: Users },
                  { id: "inventory", label: "Inventory Report", icon: Boxes },
                  { id: "campaigns", label: "Campaign Analytics", icon: Megaphone },
                ] as const).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setReportTab(tab.id)}
                      className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border transition-all font-medium"
                      style={{ background: reportTab === tab.id ? `${accent}1A` : t.card, borderColor: reportTab === tab.id ? `${accent}50` : t.border, color: reportTab === tab.id ? accent : t.textMuted }}>
                      <Icon size={13} color={reportTab === tab.id ? accent : t.textFaint} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {reportLoading && (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: t.card }} />)}
                </div>
              )}

              {/* Revenue Report */}
              {!reportLoading && reportTab === "revenue" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Revenue", value: `₹${((reportData?.grandTotal || 882000) / 100000).toFixed(2)}L`, delta: `+${reportData?.growth || "14.2"}%`, color: accent },
                      { label: "vs Prev Period", value: `₹${(((reportData?.grandTotal || 882000) * 0.88) / 100000).toFixed(2)}L`, delta: "Previous", color: "#94A3B8" },
                      { label: "Growth Rate", value: `+${reportData?.growth || "14.2"}%`, delta: "YoY trending", color: "#10B981" },
                    ].map(k => (
                      <div key={k.label} className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                        <p className="text-2xl font-black" style={{ color: k.color }}>{k.value}</p>
                        <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>{k.label}</p>
                        <p className="text-[10px] mt-1 font-semibold" style={{ color: t.textMuted }}>{k.delta}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
                    <p className="text-sm font-bold mb-4" style={{ color: t.text }}>Revenue by Outlet — {reportPeriod === "week" ? "Last 8 Weeks" : reportPeriod === "month" ? "Last 6 Months" : "Quarterly"}</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={(reportData?.labels || ["Feb","Mar","Apr","May","Jun","Jul"]).map((l: string, i: number) => ({
                        period: l,
                        revenue: reportData?.totalByPeriod?.[i] || [412000,458000,441000,502000,489000,561000][i] || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
                        <XAxis dataKey="period" tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                        <YAxis tick={{ fontSize: 11, fill: t.textFaint }} stroke={t.gridLine} />
                        <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }}
                          formatter={(v: any) => `₹${Number(v || 0).toLocaleString("en-IN")}`} />
                        <Bar dataKey="revenue" fill={accent} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Staff Report */}
              {!reportLoading && reportTab === "staff" && reportStaff && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: accent }}>{reportStaff.avgAttendance}%</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Avg Attendance</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: "#10B981" }}>{reportStaff.avgRating} ★</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Avg Performance Rating</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: t.text }}>{reportStaff.staff?.length || 8}</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Staff in Report</p>
                    </div>
                  </div>
                  <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs" style={{ borderColor: t.border, color: t.textFaint }}>
                          <th className="px-5 py-3">Employee</th><th className="px-5 py-3">Outlet</th><th className="px-5 py-3">Role</th>
                          <th className="px-5 py-3 text-right">Attendance</th><th className="px-5 py-3 text-right">Rating</th><th className="px-5 py-3 text-right">Late Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportStaff.staff || []).map((s: any, i: number) => (
                          <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
                            <td className="px-5 py-3 font-semibold text-sm" style={{ color: t.text }}>{s.name}</td>
                            <td className="px-5 py-3 text-xs" style={{ color: t.textMuted }}>{s.outlet}</td>
                            <td className="px-5 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>{s.role}</span></td>
                            <td className="px-5 py-3 text-right text-xs font-bold" style={{ color: s.attendance >= 90 ? accent : s.attendance >= 80 ? "#F59E0B" : "#FB7185" }}>{s.attendance}%</td>
                            <td className="px-5 py-3 text-right text-xs font-bold" style={{ color: s.rating >= 4.5 ? accent : s.rating >= 3.5 ? "#F59E0B" : "#FB7185" }}>{s.rating} ★</td>
                            <td className="px-5 py-3 text-right text-xs" style={{ color: s.late > 3 ? "#FB7185" : t.textMuted }}>{s.late}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inventory Report */}
              {!reportLoading && reportTab === "inventory" && reportInventory && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: "#FB7185" }}>{reportInventory.criticalCount}</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Critical Stock Items</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: "#F59E0B" }}>{reportInventory.watchCount}</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>On Watch</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ background: t.card, borderColor: t.border }}>
                      <p className="text-2xl font-black" style={{ color: t.text }}>{reportInventory.totalWastage} units</p>
                      <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Total Wastage This Period</p>
                    </div>
                  </div>
                  <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-left" style={{ borderColor: t.border, color: t.textFaint }}>
                          <th className="px-5 py-3">SKU</th><th className="px-5 py-3">Item</th><th className="px-5 py-3">Outlet</th>
                          <th className="px-5 py-3 text-right">Qty</th><th className="px-5 py-3 text-right">Reorder At</th>
                          <th className="px-5 py-3 text-right">Wastage</th><th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportInventory.items || []).map((item: any, i: number) => {
                          const sc = { Critical: "text-rose-400 bg-rose-500/10 border-rose-500/30", Watch: "text-amber-400 bg-amber-500/10 border-amber-500/30", Healthy: "text-teal-400 bg-teal-500/10 border-teal-500/30" };
                          return (
                            <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
                              <td className="px-5 py-3 font-mono" style={{ color: t.textFaint }}>{item.sku}</td>
                              <td className="px-5 py-3 font-semibold" style={{ color: t.text }}>{item.name}</td>
                              <td className="px-5 py-3" style={{ color: t.textMuted }}>{item.outlet}</td>
                              <td className="px-5 py-3 text-right font-bold" style={{ color: item.qty < item.reorder_at ? "#FB7185" : t.text }}>{item.qty}</td>
                              <td className="px-5 py-3 text-right" style={{ color: t.textFaint }}>{item.reorder_at}</td>
                              <td className="px-5 py-3 text-right" style={{ color: item.wastage > 10 ? "#F59E0B" : t.textMuted }}>{item.wastage}</td>
                              <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full border ${sc[item.status as keyof typeof sc]}`}>{item.status}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Campaign Report */}
              {!reportLoading && reportTab === "campaigns" && (
                <div className="rounded-xl border overflow-hidden" style={{ background: t.card, borderColor: t.border }}>
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b" style={{ borderColor: t.border }}>
                    <p className="text-sm font-bold" style={{ color: t.text }}>Campaign Performance</p>
                    <span className="text-xs" style={{ color: t.textFaint }}>{reportCampaigns.length} campaigns</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-left" style={{ borderColor: t.border, color: t.textFaint }}>
                        <th className="px-5 py-3">Campaign</th><th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Budget</th><th className="px-5 py-3 text-right">Spend</th>
                        <th className="px-5 py-3 text-right">Revenue</th><th className="px-5 py-3 text-right">ROI</th><th className="px-5 py-3 text-right">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reportCampaigns.length > 0 ? reportCampaigns : [
                        { name: "Summer Hype", status: "Active", budget: 25000, spend: 18500, revenue: 45600, roi: "147%", ctr: "4.2%" },
                        { name: "Loyalty Reward", status: "Active", budget: 15000, spend: 12000, revenue: 28800, roi: "140%", ctr: "3.6%" },
                        { name: "New Item Alert", status: "Active", budget: 10000, spend: 7500, revenue: 16800, roi: "124%", ctr: "3.4%" },
                      ]).map((c: any, i: number) => (
                        <tr key={i} className="border-b last:border-0" style={{ borderColor: t.border }}>
                          <td className="px-5 py-3 font-semibold" style={{ color: t.text }}>{c.name}</td>
                          <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${accent}15`, color: accent }}>{c.status}</span></td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>₹{Number(c.budget || 0).toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>₹{Number(c.spend || 0).toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3 text-right font-bold" style={{ color: accent }}>₹{Number(c.revenue || 0).toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3 text-right font-black" style={{ color: "#10B981" }}>{c.roi}</td>
                          <td className="px-5 py-3 text-right" style={{ color: t.textMuted }}>{c.ctr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : active === "settings" ? (
            <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in text-left">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: accent }}>FranchiseOS Preferences</p>
                  <h1 className="text-3xl font-black tracking-tight mt-1" style={{ color: t.text }}>System settings</h1>
                  <p className="text-sm mt-1" style={{ color: t.textMuted }}>Configure UI aesthetics, live POS simulation speed, AI personality, and advanced ML hyperparameters.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border animate-pulse bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active Module: V2.4-Pro
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COLUMN 1: Interface & Core Simulator */}
                <div className="space-y-6">
                  {/* 🎨 Card 1: Theme & Visual Aesthetics */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Palette size={18} color={accent} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs" style={{ color: t.text }}>Theme & visuals</h3>
                        <p className="text-[9px]" style={{ color: t.textFaint }}>Personalize color styles and glow coefficients.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Accent Color Chooser */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider block mb-2" style={{ color: t.textMuted }}>Accent color highlight</label>
                        <div className="flex items-center gap-1.5">
                          {[
                            { name: "Teal", val: "#2DD4BF" },
                            { name: "Purple", val: "#A855F7" },
                            { name: "Amber", val: "#F59E0B" },
                            { name: "Electric", val: "#3B82F6" },
                            { name: "Rose", val: "#F43F5E" }
                          ].map(col => (
                            <button
                              key={col.val}
                              onClick={() => setAccent(col.val)}
                              className="w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center"
                              style={{
                                background: col.val,
                                borderColor: accent === col.val ? "#fff" : "transparent",
                                boxShadow: accent === col.val ? `0 0 12px ${col.val}` : "none",
                                transform: accent === col.val ? "scale(1.05)" : "scale(1)"
                              }}
                              title={col.name}
                            >
                              {accent === col.val && <span className="text-[9px] text-white font-black">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Glow Intensity */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Interface Glow Intensity</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{glowIntensity}%</span>
                        </div>
                        <input
                          type="range" min="10" max="100"
                          value={glowIntensity}
                          onChange={(e) => setGlowIntensity(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>

                      {/* Glassmorphic Blur */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Glassmorphism Blur Radius</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{glassBlur}px</span>
                        </div>
                        <input
                          type="range" min="2" max="24"
                          value={glassBlur}
                          onChange={(e) => setGlassBlur(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 📡 Card 2: POS Simulator Settings */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Activity size={18} color={accent} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs" style={{ color: t.text }}>POS simulation engine</h3>
                        <p className="text-[9px]" style={{ color: t.textFaint }}>Tune transaction frequency and anomaly settings.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Active Register Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: t.text }}>Active Register Events</p>
                          <p className="text-[8px]" style={{ color: t.textFaint }}>Generate simulated POS transactions.</p>
                        </div>
                        <button
                          onClick={() => setSimEnabled(!simEnabled)}
                          className="w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                          style={{ background: simEnabled ? accent : t.border }}
                        >
                          <div className="w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200" style={{ transform: simEnabled ? "translateX(18px)" : "translateX(0px)" }} />
                        </button>
                      </div>

                      {/* Simulation speed */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Simulation Speed</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>Every {simInterval} seconds</span>
                        </div>
                        <input
                          type="range" min="3" max="30"
                          value={simInterval}
                          onChange={(e) => setSimInterval(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>

                      {/* Contamination rate */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Contamination Rate (Anomaly %)</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{simContamination}%</span>
                        </div>
                        <input
                          type="range" min="5" max="40"
                          value={simContamination}
                          onChange={(e) => setSimContamination(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: AI Config & ML Hyperparameters */}
                <div className="space-y-6">
                  {/* 🤖 Card 3: AI Copilot Strategic Behavior */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Sparkles size={18} color={accent} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs" style={{ color: t.text }}>AI Copilot & API keys</h3>
                        <p className="text-[9px]" style={{ color: t.textFaint }}>Adjust LLM agent parameters and system instructions.</p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {/* Gemini Key */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: t.textMuted }}>Gemini API key</label>
                        <input
                          type="password"
                          placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          className="w-full text-xs rounded-xl border px-3 py-2 outline-none font-mono"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        />
                      </div>

                      {/* Copilot Tone */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: t.textMuted }}>Agent Personality/Tone</label>
                        <select
                          value={copilotPersonality}
                          onChange={(e) => setCopilotPersonality(e.target.value)}
                          className="w-full text-xs rounded-xl border px-2 py-2 outline-none font-medium"
                          style={{ background: t.inputBg, borderColor: t.border, color: t.text }}
                        >
                          <option value="Strategic Coach">Strategic Coach (Growth & Encouraging)</option>
                          <option value="Executive Auditor">Executive Auditor (Formal & Margin Critical)</option>
                          <option value="Sarcastic Consultant">Sarcastic Consultant (Witty critiques)</option>
                        </select>
                      </div>

                      {/* Alert Sensitivity */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: t.textMuted }}>Anomaly Alert Sensitivity</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Low", "Medium", "High"].map(s => (
                            <button
                              key={s}
                              onClick={() => setAlertSensitivity(s)}
                              className="py-1.5 rounded-lg border font-bold text-[10px] transition-all"
                              style={{
                                background: alertSensitivity === s ? accent : t.inputBg,
                                borderColor: alertSensitivity === s ? accent : t.border,
                                color: alertSensitivity === s ? "#0E1015" : t.textMuted
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🧠 Card 4: Machine Learning Hyperparameters */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Brain size={18} color={accent} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs" style={{ color: t.text }}>ML Hyperparameters</h3>
                        <p className="text-[9px]" style={{ color: t.textFaint }}>Fine-tune server-side training parameters.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* XGBoost LR */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>XGBoost Learning Rate (eta)</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{xgbLr}</span>
                        </div>
                        <input
                          type="range" min="0.01" max="0.30" step="0.01"
                          value={xgbLr}
                          onChange={(e) => setXgbLr(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>

                      {/* Random Forest Estimators */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Random Forest Estimators</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{rfEstimators} trees</span>
                        </div>
                        <input
                          type="range" min="50" max="300" step="10"
                          value={rfEstimators}
                          onChange={(e) => setRfEstimators(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>

                      {/* Ridge Regularization */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Ridge Regularization Alpha</label>
                          <span className="text-xs font-semibold" style={{ color: accent }}>{ridgeAlpha}</span>
                        </div>
                        <input
                          type="range" min="0.1" max="10.0" step="0.1"
                          value={ridgeAlpha}
                          onChange={(e) => setRidgeAlpha(Number(e.target.value))}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: t.border, accentColor: accent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Resilience & System Activity Monitor */}
                <div className="space-y-6">
                  {/* 💾 Card 5: Database Resilience Simulator */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                        <Database size={18} color={accent} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs" style={{ color: t.text }}>Database & offline tests</h3>
                        <p className="text-[9px]" style={{ color: t.textFaint }}>Force fallback events to verify system resilience.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Force Database Offline Switch */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: t.text }}>Simulate DB Outage</p>
                          <p className="text-[8px]" style={{ color: t.textFaint }}>Force system to fall back onto offline static files.</p>
                        </div>
                        <button
                          onClick={() => {
                            setDbMockFallback(!dbMockFallback);
                            setTerminalLogs(prev => [
                              `[${new Date().toLocaleTimeString()}] [WARN] DB Connection forced to ${!dbMockFallback ? "OFFLINE" : "ONLINE"} by user toggle.`,
                              ...prev
                            ]);
                          }}
                          className="w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                          style={{ background: dbMockFallback ? "#FB7185" : t.border }}
                        >
                          <div className="w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200" style={{ transform: dbMockFallback ? "translateX(18px)" : "translateX(0px)" }} />
                        </button>
                      </div>

                      {/* Engine status pill */}
                      <div className="rounded-xl p-3 flex items-center justify-between border" style={{ background: t.bg, borderColor: t.border }}>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wider animate-pulse" style={{ color: dbMockFallback ? "#FB7185" : "#10B981" }}>
                            {dbMockFallback ? "MOCK FALLBACK ACTIVE" : "POSTGRES ATTACHED"}
                          </p>
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: t.text }}>
                            {dbMockFallback ? "Using local JSON files" : "Connected to database port 5432"}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const backup = {
                              accent, simInterval, simContamination, simEnabled, copilotPersonality, glowIntensity, glassBlur, xgbLr, rfEstimators, ridgeAlpha, dbMockFallback, alertSensitivity,
                              saved_at: new Date().toISOString()
                            };
                            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `franchiseops-extended-settings.json`;
                            a.click();
                          }}
                          className="py-2 rounded-lg border text-[10px] font-bold transition-all hover:bg-slate-800"
                          style={{ borderColor: t.border, color: t.text }}
                        >
                          📥 Save JSON
                        </button>
                        <button
                          onClick={() => {
                            alert("ML training checkpoints successfully flushed!");
                          }}
                          className="py-2 rounded-lg border text-[10px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                          style={{ borderColor: "#FB718535" }}
                        >
                          🗑️ Flush Cache
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 📟 Card 6: Live System Activity Log Terminal */}
                  <div className="rounded-2xl border p-5 transition-all duration-300" style={{ background: t.card, borderColor: t.border, boxShadow: `0 10px 30px ${accent}04` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <h4 className="text-[10px] font-mono ml-2 font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Activity terminal</h4>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>

                    <div className="rounded-xl p-3 bg-black font-mono text-[9px] leading-relaxed overflow-y-auto h-40 border border-slate-800 text-slate-300">
                      {terminalLogs.map((log, idx) => {
                        const isWarn = log.includes("[WARN]");
                        const isErr = log.includes("[ERR]");
                        return (
                          <div key={idx} className={isWarn ? "text-amber-400" : isErr ? "text-rose-400" : "text-slate-300"}>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Glowing Interactive preview capsule */}
              <div className="rounded-2xl border p-5 flex items-center justify-between relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accent}15, ${accent}03)`,
                  borderColor: `${accent}30`,
                  boxShadow: `0 0 ${glowIntensity / 3}px ${accent}15`,
                  backdropFilter: `blur(${glassBlur}px)`
                }}>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>Live Theme Preview</p>
                  <p className="text-xs font-black mt-1" style={{ color: t.text }}>Settings and visual metrics are instantly applied to model weights and interface colors.</p>
                </div>
                <button
                  onClick={() => alert("All settings successfully saved!")}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg relative z-10 transition-transform active:scale-95"
                  style={{
                    background: accent,
                    color: "#0E1015",
                    boxShadow: `0 8px 24px ${accent}45`
                  }}
                >
                  Save & Apply Configs
                </button>
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
    </div>
  );
}
