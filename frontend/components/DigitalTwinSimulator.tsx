"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Activity, Thermometer, Users, Zap, ShieldAlert, Sparkles } from "lucide-react";

export default function DigitalTwinSimulator({ accentColor = "#3B82F6", theme }: { accentColor?: string; theme?: any }) {
  const [queueTime, setQueueTime] = useState(2.4);
  const [kitchenOrdersHr, setKitchenOrdersHr] = useState(48);
  const [hvacTemp, setHvacTemp] = useState(21.5);
  const [fridgeTemp, setFridgeTemp] = useState(3.8);

  // Live simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueTime((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setKitchenOrdersHr((prev) => Math.max(20, Math.min(80, prev + Math.floor(Math.random() * 5 - 2))));
      setHvacTemp((prev) => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      setFridgeTemp((prev) => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div
      className="rounded-xl border p-5 transition-all shadow-xl space-y-4"
      style={{ background: bgCard, borderColor: borderCol }}
    >
      <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2" style={{ borderColor: borderCol }}>
        <div className="flex items-center gap-2">
          <Cpu size={22} color={accentColor} />
          <div>
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              AI Operational Digital Twin Telemetry Engine
            </h3>
            <p className="text-xs" style={{ color: textMuted }}>
              Real-time cyber-physical store simulation & bottleneck prediction
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 font-bold flex items-center gap-1 animate-pulse">
          <Activity size={12} /> LIVE DIGITAL TWIN STREAM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border bg-slate-900/40" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users size={14} color="#F59E0B" /> Customer Queue Wait
          </div>
          <div className="text-xl font-bold text-amber-400">{queueTime} mins</div>
          <div className="text-[10px] text-slate-400 mt-1">Optimal target: &lt;3.0 mins</div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-900/40" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Zap size={14} color="#10B981" /> Kitchen Throughput
          </div>
          <div className="text-xl font-bold text-emerald-400">{kitchenOrdersHr} orders/hr</div>
          <div className="text-[10px] text-slate-400 mt-1">Kitchen Efficiency: 96%</div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-900/40" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Thermometer size={14} color="#3B82F6" /> HVAC Ambient Temp
          </div>
          <div className="text-xl font-bold" style={{ color: accentColor }}>
            {hvacTemp}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Energy Saving Mode</div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-900/40" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Thermometer size={14} color="#EC4899" /> Cold Storage Temp
          </div>
          <div className="text-xl font-bold text-pink-400">{fridgeTemp}°C</div>
          <div className="text-[10px] text-slate-400 mt-1">Food Safety Zone (2-5°C)</div>
        </div>
      </div>
    </div>
  );
}
