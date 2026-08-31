"use client";

import React, { useEffect, useState } from "react";
import { Radio, Zap, ShieldCheck, AlertTriangle, RefreshCw, Pause, Play } from "lucide-react";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  outlet: string;
  category: "Sale" | "IoT Alert" | "Inventory" | "Audit";
  severity: "info" | "warning" | "critical" | "success";
  message: string;
}

const SAMPLE_OUTLETS = [
  "Nashik City Center",
  "Pune FC Road",
  "Mumbai Andheri East",
  "Nagpur Dharampeth",
  "Aurangabad CIDCO",
  "Thane Estate",
];

const INITIAL_EVENTS: TelemetryEvent[] = [
  {
    id: "evt-101",
    timestamp: "12:31:04 PM",
    outlet: "Pune FC Road",
    category: "Sale",
    severity: "success",
    message: "Order #8492 placed (₹1,450) via Dynamic Pricing Queue",
  },
  {
    id: "evt-102",
    timestamp: "12:30:18 PM",
    outlet: "Nashik City Center",
    category: "IoT Alert",
    severity: "info",
    message: "Espresso Machine Pressure stabilized at 9.2 Bar",
  },
  {
    id: "evt-103",
    timestamp: "12:28:44 PM",
    outlet: "Aurangabad CIDCO",
    category: "Inventory",
    severity: "warning",
    message: "Arabica Coffee Beans stock below reorder threshold (8kg remaining)",
  },
];

export default function LiveTelemetryStream({ t }: { t: any }) {
  const [events, setEvents] = useState<TelemetryEvent[]>(INITIAL_EVENTS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastPing, setLastPing] = useState<string>("Just now");

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const randomOutlet = SAMPLE_OUTLETS[Math.floor(Math.random() * SAMPLE_OUTLETS.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      const templates: { category: TelemetryEvent["category"]; severity: TelemetryEvent["severity"]; message: string }[] = [
        { category: "Sale", severity: "success", message: `New order completed (₹${Math.floor(Math.random() * 800 + 200)})` },
        { category: "IoT Alert", severity: "info", message: "Walk-in Cooler temp at 3.4°C (Optimal)" },
        { category: "Inventory", severity: "warning", message: "Whole Milk stock auto-reorder trigger activated" },
        { category: "Audit", severity: "info", message: "CCTV Hygiene Score: 96% (Staff apron compliant)" },
        { category: "Sale", severity: "success", message: `Peak hour yield surge: +14% velocity in ${randomOutlet.split(" ")[0]}` },
      ];

      const chosen = templates[Math.floor(Math.random() * templates.length)];

      const newEvent: TelemetryEvent = {
        id: `evt-${Date.now()}`,
        timestamp: timeStr,
        outlet: randomOutlet,
        category: chosen.category,
        severity: chosen.severity,
        message: chosen.message,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      setLastPing(timeStr);
    }, 6000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div
      className="rounded-xl border p-4 transition-colors duration-200 glass-card"
      style={{ background: t.card, borderColor: t.border }}
    >
      {/* Header Ticker Bar */}
      <div className="flex items-center justify-between mb-3 border-b pb-3" style={{ borderColor: t.gridLine }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isStreaming ? "bg-emerald-400 opacity-75" : "bg-amber-400 opacity-50"}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isStreaming ? "bg-emerald-500" : "bg-amber-500"}`} />
          </span>
          <p className="text-sm font-semibold tracking-wide" style={{ color: t.text }}>
            Real-Time WebSocket Stream
          </p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            {isStreaming ? "LIVE 60FPS TELEMETRY" : "PAUSED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: t.textFaint }}>
            Ping: <span className="font-mono" style={{ color: t.textMuted }}>{lastPing}</span>
          </span>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors"
            style={{ background: t.inputBg, borderColor: t.border, color: t.textMuted }}
            title={isStreaming ? "Pause Live Stream" : "Resume Live Stream"}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Stream Event List */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {events.map((evt) => {
          const badgeClass =
            evt.severity === "success"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : evt.severity === "warning"
              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
              : evt.severity === "critical"
              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
              : "bg-sky-500/15 text-sky-400 border-sky-500/30";

          return (
            <div
              key={evt.id}
              className="flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all duration-300 hover:translate-x-0.5"
              style={{ background: t.inputBg, borderColor: t.border }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${badgeClass}`}>
                  {evt.category}
                </span>
                <span className="font-medium truncate" style={{ color: t.text }}>
                  {evt.outlet}: <span style={{ color: t.textMuted }}>{evt.message}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono shrink-0 ml-2" style={{ color: t.textFaint }}>
                {evt.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
