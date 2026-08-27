"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Bot, Sliders, Volume1, ArrowRight, CheckCircle2 } from "lucide-react";
import { isAudioMuted, setAudioMuted, toggleAudioMute, getAudioVolume, setAudioVolume, playTechChime } from "@/lib/WebAudioSFX";

interface VoiceAssistantProps {
  onNavigate?: (moduleKey: string) => void;
  accentColor?: string;
  theme?: any;
}

export default function VoiceAssistant({ onNavigate, accentColor = "#3B82F6", theme }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioMuted, setAudioMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1.0);
  const isExecutingRef = useRef(false);

  useEffect(() => {
    setAudioMutedState(isAudioMuted());
    setVolumeState(getAudioVolume());

    const handleAudioChange = (e: any) => {
      if (e.detail) {
        setAudioMutedState(e.detail.muted);
        setVolumeState(e.detail.volume);
      }
    };
    window.addEventListener("fops-audio-state-changed", handleAudioChange);
    return () => window.removeEventListener("fops-audio-state-changed", handleAudioChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTranscript(currentTranscript);
            handleVoiceCommand(currentTranscript.toLowerCase());
          }
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const navigateTo = (moduleKey: string, label: string) => {
    try {
      playTechChime("nav");
    } catch (e) {}

    setLastAction(`Switched to: ${label}`);
    setTranscript(`✓ Command matched: "${label}"`);

    // 1. Direct callback
    if (onNavigate) {
      onNavigate(moduleKey);
    }

    // 2. Global custom event for decoupling
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fops-navigate", { detail: { moduleKey } }));
    }

    speakText(`Opening ${label}`);
  };

  const handleVoiceCommand = (rawCmd: string) => {
    if (isExecutingRef.current) return;
    const cmd = rawCmd.trim().toLowerCase();

    // 1. Audio Mute / Unmute
    if (cmd.includes("mute audio") || cmd.includes("mute sound") || cmd.includes("turn off sound") || cmd.includes("silence")) {
      isExecutingRef.current = true;
      setTimeout(() => { isExecutingRef.current = false; }, 1200);
      setAudioMuted(true);
      setLastAction("Sound effects muted");
      speakText("Audio sound effects have been muted.");
      return;
    }
    
    if (cmd.includes("unmute audio") || cmd.includes("unmute sound") || cmd.includes("turn on sound") || cmd.includes("enable sound") || cmd.includes("play sound")) {
      isExecutingRef.current = true;
      setTimeout(() => { isExecutingRef.current = false; }, 1200);
      setAudioMuted(false);
      setLastAction("Sound effects active");
      speakText("Audio sound effects enabled.");
      return;
    }

    // 2. Executive Briefing
    if (cmd.includes("briefing") || cmd.includes("read summary") || cmd.includes("oral report")) {
      isExecutingRef.current = true;
      setTimeout(() => { isExecutingRef.current = false; }, 1200);
      playExecutiveBriefing();
      return;
    }

    // 3. Tab & Page Navigation
    let targetModule: string | null = null;
    let targetLabel: string | null = null;

    if (
      cmd.includes("agent") ||
      cmd.includes("agents") ||
      cmd.includes("what if") ||
      cmd.includes("scenario") ||
      cmd.includes("radar")
    ) {
      targetModule = "agentDashboards";
      targetLabel = "Agent Dashboards";
    } else if (
      cmd.includes("outlet") ||
      cmd.includes("outlets") ||
      cmd.includes("store") ||
      cmd.includes("stores") ||
      cmd.includes("location") ||
      cmd.includes("map")
    ) {
      targetModule = "outlet";
      targetLabel = "Outlet Monitoring";
    } else if (
      cmd.includes("inventory") ||
      cmd.includes("stock") ||
      cmd.includes("reorder") ||
      cmd.includes("sku") ||
      cmd.includes("supplies")
    ) {
      targetModule = "inventory";
      targetLabel = "Inventory Matrix";
    } else if (
      cmd.includes("staff") ||
      cmd.includes("employee") ||
      cmd.includes("employees") ||
      cmd.includes("attendance") ||
      cmd.includes("roster") ||
      cmd.includes("workforce") ||
      cmd.includes("hr")
    ) {
      targetModule = "staff";
      targetLabel = "Workforce Operations";
    } else if (
      cmd.includes("marketing") ||
      cmd.includes("campaign") ||
      cmd.includes("campaigns") ||
      cmd.includes("roas") ||
      cmd.includes("promo") ||
      cmd.includes("growth")
    ) {
      targetModule = "marketing";
      targetLabel = "Marketing Engine";
    } else if (
      cmd.includes("audit") ||
      cmd.includes("compliance") ||
      cmd.includes("checklist") ||
      cmd.includes("cctv") ||
      cmd.includes("inspection") ||
      cmd.includes("sop")
    ) {
      targetModule = "audit";
      targetLabel = "SOP & CCTV Audit";
    } else if (
      cmd.includes("intelligence") ||
      cmd.includes("ai forecasting") ||
      cmd.includes("prophet") ||
      cmd.includes("forecast")
    ) {
      targetModule = "intelligence";
      targetLabel = "Franchise Intelligence";
    } else if (
      cmd.includes("report") ||
      cmd.includes("reports") ||
      cmd.includes("reporting") ||
      cmd.includes("financial") ||
      cmd.includes("statement") ||
      cmd.includes("p&l")
    ) {
      targetModule = "reporting";
      targetLabel = "Financial Reports";
    } else if (
      cmd.includes("notification") ||
      cmd.includes("notifications") ||
      cmd.includes("alert") ||
      cmd.includes("alerts")
    ) {
      targetModule = "notifications";
      targetLabel = "Live Alerts";
    } else if (
      cmd.includes("enterprise") ||
      cmd.includes("hub") ||
      cmd.includes("auto po")
    ) {
      targetModule = "enterprise";
      targetLabel = "Enterprise Hub";
    } else if (
      cmd.includes("setting") ||
      cmd.includes("settings") ||
      cmd.includes("config") ||
      cmd.includes("configuration") ||
      cmd.includes("theme")
    ) {
      targetModule = "settings";
      targetLabel = "System Settings";
    } else if (
      cmd.includes("dashboard") ||
      cmd.includes("home") ||
      cmd.includes("main") ||
      cmd.includes("executive overview")
    ) {
      targetModule = "dashboard";
      targetLabel = "Executive Dashboard";
    }

    if (targetModule && targetLabel) {
      isExecutingRef.current = true;
      setTimeout(() => { isExecutingRef.current = false; }, 1200);
      navigateTo(targetModule, targetLabel);
    }
  };

  const toggleListen = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser engine. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("Listening for voice commands...");
      setLastAction(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const playExecutiveBriefing = () => {
    const briefing =
      "Good evening, Executive Director. OmniFranchise network is operating at 96% health capacity. " +
      "Network daily revenue stands at 561,000 Rupees across connected outlets. " +
      "The Agent Dashboards suite and What-If AI Simulator are active. " +
      "All automated Isolation Forest POS anomaly detectors are online and clear.";
    speakText(briefing);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  const QUICK_COMMAND_CHIPS = [
    { label: "Agent Dashboards", key: "agentDashboards", icon: "🤖" },
    { label: "Executive Dashboard", key: "dashboard", icon: "📊" },
    { label: "Outlet Monitoring", key: "outlet", icon: "🏬" },
    { label: "Smart Inventory", key: "inventory", icon: "📦" },
    { label: "Workforce Roster", key: "staff", icon: "👥" },
    { label: "Marketing Engine", key: "marketing", icon: "📢" },
    { label: "SOP & Audit", key: "audit", icon: "📹" },
    { label: "AI Intelligence", key: "intelligence", icon: "🧠" },
    { label: "Financial Reports", key: "reporting", icon: "📄" },
    { label: "System Settings", key: "settings", icon: "⚙️" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-3 no-print">
      {/* Floating Voice & Audio Controls Drawer */}
      {isOpen && (
        <div
          className="w-96 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all space-y-3"
          style={{ background: `${bgCard}FA`, borderColor: borderCol }}
        >
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: borderCol }}>
            <div className="flex items-center gap-2">
              <Bot size={18} color={accentColor} />
              <h4 className="text-sm font-bold" style={{ color: textColor }}>
                Omni AI Voice & Audio Control
              </h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Transcript / Status Box */}
          <div
            className="p-3 rounded-xl border text-xs min-h-[56px] flex flex-col items-center justify-center text-center space-y-1"
            style={{ background: "#06070960", borderColor: borderCol, color: textColor }}
          >
            <div className="font-mono text-xs text-amber-300 font-semibold">
              {transcript || 'Say "Open Agent Dashboard", "Show Outlets", or "Mute Audio"'}
            </div>
            {lastAction && (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> {lastAction}
              </div>
            )}
          </div>

          {/* Quick Voice & Audio Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleListen}
              className="flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl font-bold border transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              style={{
                background: isListening ? "#FB718520" : `${accentColor}20`,
                borderColor: isListening ? "#FB7185" : accentColor,
                color: isListening ? "#FB7185" : accentColor,
              }}
            >
              {isListening ? <MicOff size={14} className="animate-pulse" /> : <Mic size={14} />}
              {isListening ? "Listening (Tap to Stop)" : "Start Voice Control"}
            </button>

            <button
              onClick={isSpeaking ? stopSpeaking : playExecutiveBriefing}
              className="flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl font-bold border transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              style={{
                background: isSpeaking ? "#F59E0B20" : "#10B98120",
                borderColor: isSpeaking ? "#F59E0B" : "#10B981",
                color: isSpeaking ? "#F59E0B" : "#10B981",
              }}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isSpeaking ? "Stop Briefing" : "Oral AI Briefing"}
            </button>
          </div>

          {/* Clickable Quick Navigation Chips */}
          <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: `${borderCol}60` }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Voice Navigation Shortcuts (Tap or Speak):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {QUICK_COMMAND_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => navigateTo(chip.key, chip.label)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderColor: borderCol,
                    color: textColor,
                  }}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio SFX Controls Section */}
          <div className="p-3 rounded-xl border space-y-2.5" style={{ background: "#06070940", borderColor: borderCol }}>
            <div className="flex items-center justify-between text-xs font-bold" style={{ color: textColor }}>
              <span className="flex items-center gap-1.5">
                {audioMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                UI Sound Effects (SFX)
              </span>
              <button
                onClick={() => toggleAudioMute()}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-transform cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: audioMuted ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  borderColor: audioMuted ? "#F43F5E" : "#10B981",
                  color: audioMuted ? "#F43F5E" : "#10B981",
                }}
              >
                {audioMuted ? "MUTED (Tap to Unmute)" : "ACTIVE (Tap to Mute)"}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>SFX Volume</span>
                <span className="font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                disabled={audioMuted}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer disabled:opacity-30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full border shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{
          background: accentColor,
          borderColor: "#FFFFFF40",
          boxShadow: `0 8px 30px ${accentColor}80`,
        }}
        title="Open Omni AI Voice & Audio Control"
      >
        <Sparkles size={24} color="#FFFFFF" className="animate-pulse" />
        {isListening && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-ping border-2 border-slate-950" />
        )}
      </button>
    </div>
  );
}
