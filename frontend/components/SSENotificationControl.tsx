"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellOff, Clock, Settings2, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { getSSESettings, saveSSESettings, SSENotificationSettings } from "@/lib/sseNotificationSettings";

interface SSENotificationControlProps {
  t?: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    panel: string;
  };
  accent?: string;
  compact?: boolean; // For top navbar placement
}

export default function SSENotificationControl({
  t,
  accent = "#0D9488",
  compact = false,
}: SSENotificationControlProps) {
  const [settings, setSettings] = useState<SSENotificationSettings>(getSSESettings());
  const [isOpen, setIsOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getSSESettings());
    };

    window.addEventListener("omni_sse_settings_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("omni_sse_settings_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (!settings.enabled || !settings.lastNotifiedAt) {
        setTimeRemaining("Ready now");
        return;
      }
      const cooldownMs = settings.intervalMinutes * 60 * 1000;
      const nextTime = settings.lastNotifiedAt + cooldownMs;
      const diffMs = nextTime - Date.now();

      if (diffMs <= 0) {
        setTimeRemaining("Ready for next alert");
      } else {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        setTimeRemaining(`${mins}m ${secs}s until next alert`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const toggleEnabled = () => {
    saveSSESettings({ enabled: !settings.enabled });
  };

  const setIntervalMinutes = (mins: number) => {
    saveSSESettings({ intervalMinutes: mins });
  };

  const toggleSound = () => {
    saveSSESettings({ soundEnabled: !settings.soundEnabled });
  };

  // Compact navbar button view
  if (compact) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border font-bold transition-all hover:scale-105 cursor-pointer shadow-xs whitespace-nowrap"
          style={{
            background: settings.enabled ? "rgba(13, 148, 136, 0.12)" : "rgba(100, 116, 139, 0.12)",
            borderColor: settings.enabled ? "rgba(13, 148, 136, 0.4)" : "rgba(100, 116, 139, 0.3)",
            color: settings.enabled ? "#0D9488" : "#94A3B8",
          }}
          title={settings.enabled ? `SSE Alerts ON (${settings.intervalMinutes}m gap)` : "SSE Alerts OFF (Click to configure)"}
        >
          {settings.enabled ? (
            <Bell size={13} className="shrink-0 animate-pulse text-teal-400" />
          ) : (
            <BellOff size={13} className="shrink-0 text-slate-400" />
          )}
          <span className="hidden 2xl:inline">
            {settings.enabled ? `SSE Alerts: ON (${settings.intervalMinutes}m)` : "SSE Alerts: OFF"}
          </span>
          <span className="hidden lg:inline 2xl:hidden">
            {settings.enabled ? `SSE: ON` : `SSE: OFF`}
          </span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div
              className="absolute right-0 mt-2 w-72 p-4 rounded-xl shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl bg-slate-900/95 border-slate-700 text-slate-100 text-xs"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Settings2 size={16} className="text-teal-400" />
                  <span className="font-bold text-sm text-white">SSE Live Alerts</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    settings.enabled
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                      : "bg-slate-700/40 text-slate-400 border-slate-600"
                  }`}
                >
                  {settings.enabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>

              {/* Master Switch */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-semibold text-white">Notifications</div>
                  <div className="text-[11px] text-slate-400">Receive live telemetry popups</div>
                </div>
                <button
                  onClick={toggleEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.enabled ? "bg-teal-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Interval / Gap Selection */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-white mb-2">
                  <Clock size={13} className="text-teal-400" />
                  <span>Gap Between Alerts</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setIntervalMinutes(mins)}
                      className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-colors cursor-pointer ${
                        settings.intervalMinutes === mins
                          ? "bg-teal-500/20 border-teal-500 text-teal-300 font-bold"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Sound Toggle */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  {settings.soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-400" />}
                  <span className="text-slate-300">Alert Sound Chime</span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    settings.soundEnabled
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {settings.soundEnabled ? "Sound ON" : "Sound OFF"}
                </button>
              </div>

              {/* Status footer */}
              <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Status:</span>
                <span className="font-mono text-teal-400">{timeRemaining}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full detailed card view for the Notifications tab
  const themeCard = t?.card || "#1E293B";
  const themeBorder = t?.border || "#334155";
  const themeText = t?.text || "#F8FAFC";
  const themeTextMuted = t?.textMuted || "#94A3B8";

  return (
    <div
      className="rounded-xl border p-5 transition-all shadow-sm"
      style={{ background: themeCard, borderColor: themeBorder }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              background: settings.enabled ? "rgba(13, 148, 136, 0.15)" : "rgba(100, 116, 139, 0.15)",
              borderColor: settings.enabled ? "rgba(13, 148, 136, 0.3)" : "rgba(100, 116, 139, 0.3)",
            }}
          >
            {settings.enabled ? (
              <Bell className="w-5 h-5 text-teal-400 animate-pulse" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: themeText }}>
              Live Server-Sent Events (SSE) Alerts
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  settings.enabled
                    ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                    : "bg-slate-700/40 text-slate-400 border-slate-600"
                }`}
              >
                {settings.enabled ? "ACTIVE" : "OFF / MUTED"}
              </span>
            </h3>
            <p className="text-xs" style={{ color: themeTextMuted }}>
              Control real-time toast popups and adjust rate-limiting between notifications.
            </p>
          </div>
        </div>

        {/* Master ON/OFF Switch */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: settings.enabled ? "#0D9488" : themeTextMuted }}>
            {settings.enabled ? "SSE Popups: Enabled" : "SSE Popups: Disabled"}
          </span>
          <button
            onClick={toggleEnabled}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
              settings.enabled ? "bg-teal-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                settings.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
        {/* Gap selection */}
        <div className="p-3.5 rounded-xl border flex flex-col justify-between bg-slate-950/20 border-white/5">
          <div>
            <div className="flex items-center gap-2 font-bold mb-1" style={{ color: themeText }}>
              <Clock size={15} className="text-teal-400" />
              <span>Notification Gap / Cooldown</span>
            </div>
            <p className="text-[11px] mb-3" style={{ color: themeTextMuted }}>
              Minimum time required between two consecutive alert toasts.
            </p>
          </div>
          <div className="flex gap-2">
            {[15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => setIntervalMinutes(mins)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold border transition-all cursor-pointer ${
                  settings.intervalMinutes === mins
                    ? "bg-teal-500 text-white border-teal-400 shadow-sm"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Audio notification */}
        <div className="p-3.5 rounded-xl border flex flex-col justify-between bg-slate-950/20 border-white/5">
          <div>
            <div className="flex items-center gap-2 font-bold mb-1" style={{ color: themeText }}>
              {settings.soundEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} className="text-slate-400" />}
              <span>Alert Sound SFX</span>
            </div>
            <p className="text-[11px] mb-3" style={{ color: themeTextMuted }}>
              Play audio chime synthesized with WebAudio when a toast arrives.
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`py-1.5 px-3 rounded-lg font-bold border transition-colors cursor-pointer text-center ${
              settings.soundEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {settings.soundEnabled ? "Sound: Enabled (Click to Mute)" : "Sound: Muted (Click to Enable)"}
          </button>
        </div>

        {/* Live Status & Throttle indicator */}
        <div className="p-3.5 rounded-xl border flex flex-col justify-between bg-slate-950/20 border-white/5">
          <div>
            <div className="flex items-center gap-2 font-bold mb-1" style={{ color: themeText }}>
              <ShieldCheck size={15} className="text-blue-400" />
              <span>Rate Limit Status</span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: themeTextMuted }}>
              Current throttling state for incoming telemetry events.
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Next Allowed:</span>
            <span className="font-mono text-teal-400 font-bold text-[11px]">{timeRemaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
