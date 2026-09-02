"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  Mic,
  QrCode,
  Truck,
  Bot,
  Compass,
  Sparkles,
  Printer,
  ChevronUp,
  ChevronDown,
  Layers,
  Volume2,
  VolumeX,
  Eye,
  Store,
  MessageSquare,
} from "lucide-react";
import { isAudioMuted, toggleAudioMute } from "@/lib/WebAudioSFX";

interface ExecutiveQuickDockProps {
  onOpenCommandPalette: () => void;
  onOpenQRScanner: () => void;
  onOpenSOPBot: () => void;
  onOpenDispatch: () => void;
  onOpenTour: () => void;
  onOpenAskAI: () => void;
  onOpenCCTV?: () => void;
  onOpenExpansion?: () => void;
  onOpenSentiment?: () => void;
}

export default function ExecutiveQuickDock({
  onOpenCommandPalette,
  onOpenQRScanner,
  onOpenSOPBot,
  onOpenDispatch,
  onOpenTour,
  onOpenAskAI,
  onOpenCCTV,
  onOpenExpansion,
  onOpenSentiment,
}: ExecutiveQuickDockProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    setAudioMuted(isAudioMuted());
    const handleAudioChange = (e: any) => {
      setAudioMuted(e.detail?.muted ?? isAudioMuted());
    };
    window.addEventListener("fops-audio-state-changed", handleAudioChange);
    return () => window.removeEventListener("fops-audio-state-changed", handleAudioChange);
  }, []);

  const dockActions = [
    {
      id: "spotlight",
      label: "Spotlight (⌘K)",
      icon: <Command className="w-4 h-4 text-amber-400" />,
      color: "#F59E0B",
      action: onOpenCommandPalette,
    },
    {
      id: "ask-ai",
      label: "AI Strategic Briefing",
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      color: "#38BDF8",
      action: onOpenAskAI,
    },
    {
      id: "qr",
      label: "QR Pallet Scanner",
      icon: <QrCode className="w-4 h-4 text-cyan-400" />,
      color: "#06B6D4",
      action: onOpenQRScanner,
    },
    {
      id: "sop",
      label: "SOP Copilot Bot",
      icon: <Bot className="w-4 h-4 text-violet-400" />,
      color: "#8B5CF6",
      action: onOpenSOPBot,
    },
    {
      id: "dispatch",
      label: "Supplier Emergency PO",
      icon: <Truck className="w-4 h-4 text-emerald-400" />,
      color: "#10B981",
      action: onOpenDispatch,
    },
    {
      id: "cctv",
      label: "CCTV AI Sentinel",
      icon: <Eye className="w-4 h-4 text-cyan-400" />,
      color: "#06B6D4",
      action: () => onOpenCCTV && onOpenCCTV(),
    },
    {
      id: "expansion",
      label: "AI Store Expansion",
      icon: <Store className="w-4 h-4 text-purple-400" />,
      color: "#A855F7",
      action: () => onOpenExpansion && onOpenExpansion(),
    },
    {
      id: "sentiment",
      label: "Customer Sentiment Studio",
      icon: <MessageSquare className="w-4 h-4 text-pink-400" />,
      color: "#EC4899",
      action: () => onOpenSentiment && onOpenSentiment(),
    },
    {
      id: "audio-toggle",
      label: audioMuted ? "Unmute Sound Effects (SFX)" : "Mute Sound Effects (SFX)",
      icon: audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />,
      color: audioMuted ? "#FB7185" : "#10B981",
      action: () => {
        toggleAudioMute();
        setAudioMuted(isAudioMuted());
      },
    },
    {
      id: "tour",
      label: "System Tour",
      icon: <Compass className="w-4 h-4 text-amber-300" />,
      color: "#FCD34D",
      action: onOpenTour,
    },
    {
      id: "print",
      label: "Executive PDF Export",
      icon: <Printer className="w-4 h-4 text-rose-400" />,
      color: "#FB7185",
      action: () => window.print(),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 no-print flex flex-col items-center pointer-events-none">
      {/* Tooltip Hover Overlay */}
      <AnimatePresence>
        {hoveredTool && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="mb-2 px-3 py-1 rounded-full bg-[#060709]/90 border border-amber-500/40 text-[11px] font-semibold text-amber-300 shadow-xl backdrop-blur-md"
          >
            {hoveredTool}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-1.5 p-1.5 px-2 rounded-2xl bg-[#0B0D12]/85 border border-white/10 shadow-2xl backdrop-blur-xl ring-1 ring-amber-500/20"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isExpanded ? "Collapse Dock" : "Expand Dock"}
        >
          <Layers className="w-4 h-4 text-amber-400" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800" />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-1 overflow-hidden"
            >
              {dockActions.map((tool) => (
                <motion.button
                  key={tool.id}
                  onClick={tool.action}
                  onMouseEnter={() => setHoveredTool(tool.label)}
                  onMouseLeave={() => setHoveredTool(null)}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm relative group"
                >
                  {tool.icon}
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: tool.color }}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </motion.div>
    </div>
  );
}
