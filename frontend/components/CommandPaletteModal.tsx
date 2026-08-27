"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  Store,
  Boxes,
  Users,
  Megaphone,
  ShieldCheck,
  Brain,
  FileBarChart,
  Settings,
  QrCode,
  Bot,
  Truck,
  Mic,
  Compass,
  Cpu,
  Database,
  Sparkles,
  ArrowRight,
  Command,
  X,
  Sliders,
  Volume2,
  VolumeX,
  Activity,
} from "lucide-react";
import { isAudioMuted, toggleAudioMute, playTechChime } from "@/lib/WebAudioSFX";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (moduleKey: string) => void;
  onOpenQRScanner?: () => void;
  onOpenSOPBot?: () => void;
  onOpenDispatch?: () => void;
  onOpenTour?: () => void;
  onOpenVoiceAssistant?: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "AI & Tools" | "Audio & Controls" | "Operations";
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenQRScanner,
  onOpenSOPBot,
  onOpenDispatch,
  onOpenTour,
  onOpenVoiceAssistant,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAudioMuted(isAudioMuted());
    const handleAudioChange = (e: any) => {
      setAudioMuted(e.detail?.muted ?? isAudioMuted());
    };
    window.addEventListener("fops-audio-state-changed", handleAudioChange);
    return () => window.removeEventListener("fops-audio-state-changed", handleAudioChange);
  }, []);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: "agentDashboards",
      title: "Agent Dashboards (Executive Multi-Pillar Suite)",
      subtitle: "Full deck intelligence: Outlet, Inventory, Workforce, Marketing, Audit & Radar",
      category: "Navigation",
      icon: <Bot className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate("agentDashboards");
        onClose();
      },
      shortcut: "G B",
    },
    {
      id: "dashboard",
      title: "Executive Overview",
      subtitle: "Global KPI revenue, health ratings, and live telemetry",
      category: "Navigation",
      icon: <LayoutGrid className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate("dashboard");
        onClose();
      },
      shortcut: "G D",
    },
    {
      id: "outlet",
      title: "Outlet Performance & Monitoring",
      subtitle: "Multi-branch telemetry, live orders, and footfall",
      category: "Navigation",
      icon: <Store className="w-4 h-4 text-sky-400" />,
      action: () => {
        onNavigate("outlet");
        onClose();
      },
      shortcut: "G O",
    },
    {
      id: "inventory",
      title: "Smart Inventory & Stock Matrix",
      subtitle: "Stock levels, reorder thresholds, and SKU catalogs",
      category: "Navigation",
      icon: <Boxes className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate("inventory");
        onClose();
      },
      shortcut: "G I",
    },
    {
      id: "staff",
      title: "Staff & Workforce Operations",
      subtitle: "Employee roster, attendance, and shift assignments",
      category: "Navigation",
      icon: <Users className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate("staff");
        onClose();
      },
      shortcut: "G S",
    },
    {
      id: "marketing",
      title: "Marketing & Growth Engine",
      subtitle: "Campaign ROAS, promo codes, and customer uplift",
      category: "Navigation",
      icon: <Megaphone className="w-4 h-4 text-pink-400" />,
      action: () => {
        onNavigate("marketing");
        onClose();
      },
      shortcut: "G M",
    },
    {
      id: "audit",
      title: "CCTV Vision & SOP Audit",
      subtitle: "AI cleanliness detection, food safety, and compliance scores",
      category: "Navigation",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate("audit");
        onClose();
      },
      shortcut: "G A",
    },
    {
      id: "intelligence",
      title: "AI Franchise Intelligence",
      subtitle: "Prophet revenue forecasting, demand curves, and yield optimization",
      category: "Navigation",
      icon: <Brain className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate("intelligence");
        onClose();
      },
      shortcut: "G F",
    },
    {
      id: "reports",
      title: "Reports & Financial Statements",
      subtitle: "Consolidated P&L, shrinkage reports, and PDF exports",
      category: "Navigation",
      icon: <FileBarChart className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate("reports");
        onClose();
      },
      shortcut: "G R",
    },
    {
      id: "settings",
      title: "System Settings & Configuration",
      subtitle: "API keys, currency formats, and regional tax nodes",
      category: "Navigation",
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      action: () => {
        onNavigate("settings");
        onClose();
      },
    },

    // Audio & Voice Controls
    {
      id: "audio-control-toggle",
      title: audioMuted ? "Audio Control: Unmute Sound Effects (SFX)" : "Audio Control: Mute Sound Effects (SFX)",
      subtitle: audioMuted ? "Currently muted. Click to enable synthesized WebAudio chimes" : "Currently active. Click to silence all UI sound effects",
      category: "Audio & Controls",
      icon: audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        toggleAudioMute();
        setAudioMuted(isAudioMuted());
      },
      shortcut: "⌥ M",
    },
    {
      id: "audio-voice-briefing",
      title: "AI Voice Assistant & Oral Briefing",
      subtitle: "Hands-free voice recognition, navigation commands & audio summary",
      category: "Audio & Controls",
      icon: <Mic className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onOpenVoiceAssistant) onOpenVoiceAssistant();
        onClose();
      },
      shortcut: "⌥ V",
    },

    // AI & Tools
    {
      id: "qr-scanner",
      title: "QR Stock Intake Scanner",
      subtitle: "Fast camera-assisted barcode & QR pallet check-in",
      category: "AI & Tools",
      icon: <QrCode className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onOpenQRScanner) onOpenQRScanner();
        onClose();
      },
      shortcut: "⌥ Q",
    },
    {
      id: "sop-bot",
      title: "SOP AI Copilot & Knowledge Bot",
      subtitle: "Query franchise standard operating procedures with RAG",
      category: "AI & Tools",
      icon: <Bot className="w-4 h-4 text-violet-400" />,
      action: () => {
        if (onOpenSOPBot) onOpenSOPBot();
        onClose();
      },
      shortcut: "⌥ S",
    },
    {
      id: "digital-twin",
      title: "Digital Twin Stress Simulator",
      subtitle: "Simulate demand shocks, supply chain delays, and holiday rushes",
      category: "AI & Tools",
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate("dashboard");
        onClose();
      },
    },
    {
      id: "demo-tour",
      title: "Interactive System Walkthrough Tour",
      subtitle: "Guided step-by-step feature showcase for executives",
      category: "AI & Tools",
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onOpenTour) onOpenTour();
        onClose();
      },
    },

    // Operations
    {
      id: "supplier-dispatch",
      title: "Supplier Emergency Restock Dispatch",
      subtitle: "Trigger urgent restock POs with pre-negotiated vendors",
      category: "Operations",
      icon: <Truck className="w-4 h-4 text-sky-400" />,
      action: () => {
        if (onOpenDispatch) onOpenDispatch();
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#0B0D12]/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl text-slate-100 ring-1 ring-amber-500/20"
        >
          {/* Glowing Top Ambient Header */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-sky-400" />

          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-[#060709]/80 gap-3">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, module name, or operational tool..."
              className="w-full bg-transparent border-0 outline-none text-[14px] text-white placeholder-slate-400 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 border border-slate-700 text-slate-300 rounded shadow-sm">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results List */}
          <div
            ref={listContainerRef}
            className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-800/40"
          >
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Sparkles className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">
                  No matching command or module found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for "Inventory", "Audit", "SOP", or "Reports"
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      onClick={item.action}
                      onMouseMove={() => {
                        if (selectedIndex !== idx) setSelectedIndex(idx);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500/15 via-sky-500/10 to-transparent border border-amber-500/30 text-white translate-x-1"
                          : "hover:bg-slate-800/40 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg border ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500/40 shadow-sm shadow-amber-500/20"
                              : "bg-slate-900 border-slate-800"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold tracking-wide">
                              {item.title}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {item.shortcut && (
                          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800/80 border border-slate-700 text-slate-400 rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar with Keyboard Cheatsheet */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#060709]/90 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 font-mono bg-slate-800 rounded border border-slate-700 text-slate-300">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 font-mono bg-slate-800 rounded border border-slate-700 text-slate-300">
                  ↓
                </kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 font-mono bg-slate-800 rounded border border-slate-700 text-slate-300">
                  ↵
                </kbd>
                <span>Execute</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <Command className="w-3.5 h-3.5" />
              <span>OmniFranchise Spotlight</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
