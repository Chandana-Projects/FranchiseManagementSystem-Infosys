"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Sparkles, X, ChevronRight } from "lucide-react";

interface AnomalyAlertBannerProps {
  alert: {
    id: string;
    outlet: string;
    message: string;
    severity: "Healthy" | "Watch" | "Critical";
    time: string;
    amount?: number;
  } | null;
  onClose: () => void;
  onInspect: () => void;
  accentColor?: string;
  theme?: any;
}

export default function AnomalyAlertBanner({
  alert,
  onClose,
  onInspect,
  accentColor = "#F59E0B",
  theme,
}: AnomalyAlertBannerProps) {
  if (!alert) return null;

  const bgBorder =
    alert.severity === "Critical"
      ? { bg: "rgba(251, 113, 133, 0.15)", border: "#FB7185", text: "#FDA4AF" }
      : alert.severity === "Watch"
      ? { bg: "rgba(245, 158, 11, 0.15)", border: "#F59E0B", text: "#FDE68A" }
      : { bg: "rgba(16, 185, 129, 0.15)", border: "#10B981", text: "#6EE7B7" };

  return (
    <div
      className="w-full px-3 sm:px-5 py-2 sm:py-2.5 border-b flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 animate-pulse-subtle z-40 overflow-hidden"
      style={{
        background: bgBorder.bg,
        borderColor: `${bgBorder.border}60`,
      }}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border"
          style={{ background: `${bgBorder.border}30`, borderColor: bgBorder.border }}
        >
          {alert.severity === "Critical" ? (
            <ShieldAlert size={16} color="#FB7185" />
          ) : (
            <AlertTriangle size={16} color="#F59E0B" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span
              className="text-[9px] sm:text-[10px] font-mono uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full border shrink-0"
              style={{ background: `${bgBorder.border}25`, color: bgBorder.text, borderColor: `${bgBorder.border}50` }}
            >
              LIVE TELEMETRY ALERT — {alert.severity}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">{alert.time}</span>
          </div>

          <p className="text-xs font-semibold mt-0.5 text-slate-100 truncate" title={`[${alert.outlet}] ${alert.message}`}>
            <strong className="text-amber-300">[{alert.outlet}]</strong> {alert.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onInspect}
          className="flex items-center gap-1 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border font-semibold transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          style={{ background: bgBorder.border, color: "#060709" }}
        >
          <span>Inspect Anomaly</span> <ChevronRight size={13} className="hidden sm:inline" />
        </button>

        <button
          onClick={onClose}
          className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 cursor-pointer shrink-0"
          title="Dismiss Alert"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
