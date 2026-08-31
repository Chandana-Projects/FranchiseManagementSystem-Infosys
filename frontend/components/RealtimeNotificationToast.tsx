"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, Flame, ShieldAlert, ShoppingBag, Radio, X } from "lucide-react";
import { playNotificationSFX } from "@/lib/WebAudioSFX";

export interface TelemetryEvent {
  type: string;
  title: string;
  outlet: string;
  message: string;
  severity: "info" | "warning" | "success" | "critical";
  timestamp?: string;
}

export default function RealtimeNotificationToast() {
  const [activeToast, setActiveToast] = useState<TelemetryEvent | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shared dismiss helper: fade out (700ms) then unmount (100ms) = 800ms total
  const triggerDismiss = () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setDismissing(true);
    dismissTimerRef.current = setTimeout(() => {
      setActiveToast(null);
      setDismissing(false);
    }, 100);
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    try {
      eventSource = new EventSource(`${backendUrl}/api/events`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.data) {
            setActiveToast(payload.data);
            playNotificationSFX(); // Play WebAudio chime
          }
        } catch (e) {
          // ignore heartbeat parse errors
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.warn("SSE connection error:", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Auto-dismiss: start fade at 700ms, fully unmount at 800ms
  useEffect(() => {
    if (activeToast) {
      setDismissing(false);
      const fadeTimer = setTimeout(() => setDismissing(true), 700);
      const removeTimer = setTimeout(() => {
        setActiveToast(null);
        setDismissing(false);
      }, 800);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [activeToast]);

  if (!activeToast) return null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-950/90 border-red-500/50 text-red-200",
          icon: <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />,
          badge: "bg-red-500/20 text-red-400 border-red-500/40"
        };
      case "warning":
        return {
          bg: "bg-amber-950/90 border-amber-500/50 text-amber-200",
          icon: <Flame className="w-5 h-5 text-amber-400" />,
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40"
        };
      case "success":
        return {
          bg: "bg-emerald-950/90 border-emerald-500/50 text-emerald-200",
          icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
        };
      default:
        return {
          bg: "bg-blue-950/90 border-blue-500/50 text-blue-200",
          icon: <Bell className="w-5 h-5 text-blue-400" />,
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40"
        };
    }
  };

  const style = getSeverityStyles(activeToast.severity);

  return (
    <div
      className="fixed top-20 right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300 transition-opacity"
      style={{ opacity: dismissing ? 0 : 1, transition: "opacity 100ms ease-out" }}
    >
      <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${style.bg} flex items-start gap-3.5 relative overflow-hidden`}>
        {/* Glow accent */}
        <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-current opacity-10 blur-xl"></div>
        
        <div className="p-2 rounded-xl bg-slate-900/60 border border-white/10 shrink-0">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
              {activeToast.outlet}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-ping" />
              Live SSE
            </span>
          </div>

          <h4 className="text-xs font-bold text-white truncate">{activeToast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
        </div>

        <button
          onClick={triggerDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
