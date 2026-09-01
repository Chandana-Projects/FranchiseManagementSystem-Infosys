"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Pause, Maximize2, Minimize2, Radio, Activity, Cpu, ShieldCheck, Zap, TrendingUp, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface WarRoomProps {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
}

const LIVE_RUNWAY = [
  { time: "10:00", revenue: 42000, orders: 180, speed: 4.2 },
  { time: "11:00", revenue: 68000, orders: 260, speed: 4.8 },
  { time: "12:00", revenue: 124000, orders: 490, speed: 7.6 },
  { time: "13:00", revenue: 186000, orders: 740, speed: 9.4 },
  { time: "14:00", revenue: 142000, orders: 580, speed: 6.8 },
  { time: "15:00", revenue: 98000, orders: 390, speed: 5.1 },
  { time: "16:00", revenue: 114000, orders: 440, speed: 5.8 },
  { time: "17:00", revenue: 168000, orders: 660, speed: 8.2 },
  { time: "18:00", revenue: 232000, orders: 890, speed: 10.1 },
];

export default function WarRoomPresentationMode({
  isOpen,
  onClose,
  accent = "#0D9488",
}: WarRoomProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!isOpen || !autoRotate) return;
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen, autoRotate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06080F] text-slate-100 flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-lg shadow-teal-500/10">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Executive War Room & Boardroom Mode
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE KIOSK ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-contrast real-time telemetry display calibrated for ultra-wide projectors & executive briefings.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Carousel Slide Indicators */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono">
            {["1. Enterprise Health", "2. Peak Velocity", "3. Sentinel AI"].map((sName, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  slide === idx ? "bg-teal-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                {sName}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-all"
            title={autoRotate ? "Pause Auto-Rotate" : "Resume Auto-Rotate"}
          >
            {autoRotate ? <Pause size={14} className="text-teal-400" /> : <Play size={14} className="text-amber-400" />}
            <span>{autoRotate ? "Auto-Cycle: ON" : "Paused"}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer transition-all"
            title="Exit War Room Mode (ESC)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left 2 Columns: Dynamic Slide Visuals */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          {/* Slide 0: Executive Health & Financial Pulse */}
          {slide === 0 && (
            <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl flex-1 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold">Slide 1 • Financial Run Rate</span>
                    <h2 className="text-xl font-black text-white mt-0.5">Real-Time Gross Network Revenue & Intraday Velocity</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-teal-300 font-mono">₹11.74L</span>
                    <p className="text-[11px] text-emerald-400 font-semibold">+18.4% above benchmark</p>
                  </div>
                </div>

                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LIVE_RUNWAY}>
                      <defs>
                        <linearGradient id="warRoomGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 12, color: "#fff" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#2DD4BF" strokeWidth={3} fill="url(#warRoomGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4 Bottom Strip KPIs */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Total Active Outlets</p>
                  <p className="text-2xl font-black text-white font-mono mt-1">16 / 16</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Network CSAT</p>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-1">4.82 ⭐</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">HACCP Compliance</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">98.4%</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Zero-Waste Score</p>
                  <p className="text-2xl font-black text-sky-400 font-mono mt-1">95.1%</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 1: Hourly Order Peak Volume */}
          {slide === 1 && (
            <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl flex-1 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">Slide 2 • Kitchen & Logistics</span>
                    <h2 className="text-xl font-black text-white mt-0.5">Order Fulfillment Flow & Ticket Preparation SLA</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-purple-300 font-mono">4,640 Orders</span>
                    <p className="text-[11px] text-purple-400 font-semibold">Avg SLA: 6.2 mins</p>
                  </div>
                </div>

                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LIVE_RUNWAY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 12, color: "#fff" }} />
                      <Bar dataKey="orders" name="Hourly Orders" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4 Bottom Strip KPIs */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Peak Hour Spike</p>
                  <p className="text-2xl font-black text-purple-400 font-mono mt-1">6:00 PM</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Active Baristas</p>
                  <p className="text-2xl font-black text-white font-mono mt-1">42 Staff</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Overtime Index</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">Controlled</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">POS Void Rate</p>
                  <p className="text-2xl font-black text-teal-400 font-mono mt-1">0.4%</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: AI Predictive Sentinel */}
          {slide === 2 && (
            <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl flex-1 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Slide 3 • AI Sentinel & ML</span>
                    <h2 className="text-xl font-black text-white mt-0.5">XGBoost Anomaly Sentinel & JIT Inventory Dispatch</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-300 font-mono">94.2% Acc.</span>
                    <p className="text-[11px] text-amber-400 font-semibold">R² = 0.942 Active Stream</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Sparkles size={16} /> Autonomous Intelligence Directives:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. <strong>Automated PO Triggered:</strong> +45 kg Arabica Coffee Beans dispatched to Aurangabad to avert weekend stockout.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    2. <strong>Dynamic Margin Surge:</strong> Weekend pricing multiplier adjusted to 1.1x yielding an estimated +8.4% net margin gain.
                  </p>
                </div>
              </div>

              {/* 4 Bottom Strip KPIs */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">ML Confidence</p>
                  <p className="text-2xl font-black text-teal-400 font-mono mt-1">98.2%</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">JIT Safety Buffer</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">7.4 Days</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Cold Chain Status</p>
                  <p className="text-2xl font-black text-cyan-400 font-mono mt-1">-18.2°C</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-slate-400">Circuit Breakers</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">ARMED</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Hub Status Sentinel */}
        <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Radio size={16} className="text-teal-400 animate-pulse" />
                Live Hub Network Matrix
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                16 Nodes
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Pune FC Road", rev: "₹8.40L", csat: "4.8", status: "Healthy", color: "#10B981" },
                { name: "Mumbai Bandra", rev: "₹9.20L", csat: "4.7", status: "Healthy", color: "#10B981" },
                { name: "Bangalore Indiranagar", rev: "₹7.80L", csat: "4.9", status: "Healthy", color: "#10B981" },
                { name: "Delhi Connaught", rev: "₹7.10L", csat: "4.4", status: "Healthy", color: "#10B981" },
                { name: "Hyderabad HITEC", rev: "₹6.60L", csat: "4.6", status: "Healthy", color: "#10B981" },
                { name: "Aurangabad CIDCO", rev: "₹3.40L", csat: "3.9", status: "Watch", color: "#F59E0B" },
              ].map((hub) => (
                <div key={hub.name} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-white">{hub.name}</p>
                    <p className="text-[10px] text-slate-400">{hub.csat} ⭐ • Intraday POS</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-teal-400 text-xs block">{hub.rev}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-sans font-bold" style={{ background: `${hub.color}20`, color: hub.color }}>
                      {hub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">ESC</kbd> to exit</span>
            <span className="text-teal-400 font-mono font-bold">Boardroom Active</span>
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400 relative z-10 font-mono">
        <span className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-teal-400" />
          OmniFranchise Enterprise Intelligence System • Verified SHA-256 Ledger
        </span>
        <span>Kiosk View Engine v3.0</span>
      </div>
    </div>
  );
}
