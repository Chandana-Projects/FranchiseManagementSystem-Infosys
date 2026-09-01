"use client";

import React from "react";
import { X, Command, Keyboard, Zap, Sparkles } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

interface ShortcutCategory {
  title: string;
  items: { key: string; label: string; desc: string }[];
}

const SHORTCUT_GROUPS: ShortcutCategory[] = [
  {
    title: "⚡ Global Command & Navigation",
    items: [
      { key: "⌘K / Ctrl+K", label: "Command Palette", desc: "Open universal search and quick actions" },
      { key: "? / Shift+/", label: "Shortcuts HUD", desc: "Toggle this keyboard cheat sheet" },
      { key: "D", label: "Toggle Dark/Light", desc: "Switch visual contrast theme" },
      { key: "W", label: "War Room Mode", desc: "Open boardroom presentation kiosk" },
      { key: "C", label: "Compare Outlets", desc: "Open Multi-Store Head-to-Head arena" },
      { key: "ESC", label: "Close Active Modal", desc: "Dismiss open dialogs and overlays" },
    ],
  },
  {
    title: "🏢 Agent Navigation (Press Number)",
    items: [
      { key: "1", label: "Dashboard", desc: "Executive Consolidated Overview" },
      { key: "2", label: "Outlet Performance", desc: "Sales, GMV & Store Benchmark" },
      { key: "3", label: "Inventory Intelligence", desc: "Stock Cover, Depletion & Wastage" },
      { key: "4", label: "Staff & Workforce", desc: "Roster, Shifts & Turnaround Speed" },
      { key: "5", label: "Marketing Engine", desc: "Campaign ROAS, CAC & Funnels" },
      { key: "6", label: "Audit & Compliance", desc: "HACCP, Cold Chain & CCTV Vision" },
    ],
  },
  {
    title: "💼 Enterprise Tools Launchers",
    items: [
      { key: "T", label: "Executive Tools", desc: "Toggle quick modules launcher" },
      { key: "S", label: "Shift Scheduler", desc: "Open AI Staff Roster Generator" },
      { key: "R", label: "Royalty ROI", desc: "Open 5% Royalty & Profit Calculator" },
      { key: "M", label: "Menu Yield Matrix", desc: "Open BCG 4-Quadrant Menu Matrix" },
    ],
  },
];

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
  isDark = true,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]"
        style={{
          background: isDark ? "rgba(15, 23, 42, 0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "#E2E8F0",
          color: isDark ? "#F8FAFC" : "#0F172A",
        }}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-md">
              <Keyboard size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Keyboard Shortcuts Cheat Sheet
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
                  Power User HUD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Speed up your enterprise franchise monitoring with instant hotkeys.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-700 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                {group.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="p-3 rounded-2xl border bg-black/20 border-white/10 flex items-center justify-between hover:border-teal-500/40 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    <kbd className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-teal-300 font-mono font-bold text-xs shadow-inner shrink-0">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 bg-black/20">
          <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
            <Sparkles size={13} />
            Hotkeys active across all dashboard tabs
          </span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
