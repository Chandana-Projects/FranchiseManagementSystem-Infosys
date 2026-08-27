"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Bot, Sliders, Volume1 } from "lucide-react";
import { isAudioMuted, setAudioMuted, toggleAudioMute, getAudioVolume, setAudioVolume } from "@/lib/WebAudioSFX";

interface VoiceAssistantProps {
  onNavigate?: (moduleKey: string) => void;
  accentColor?: string;
  theme?: any;
}

export default function VoiceAssistant({ onNavigate, accentColor = "#3B82F6", theme }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioMuted, setAudioMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1.0);

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
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          handleVoiceCommand(currentTranscript.toLowerCase());
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const handleVoiceCommand = (cmd: string) => {
    // Audio Commands
    if (cmd.includes("mute audio") || cmd.includes("mute sound") || cmd.includes("turn off sound") || cmd.includes("silence")) {
      setAudioMuted(true);
      speakText("Audio sound effects have been muted.");
      return;
    } else if (cmd.includes("unmute audio") || cmd.includes("unmute sound") || cmd.includes("turn on sound") || cmd.includes("enable sound")) {
      setAudioMuted(false);
      speakText("Audio sound effects are now active.");
      return;
    }

    if (!onNavigate) return;

    // Agent Dashboards & What-If Sandbox
    if (
      cmd.includes("agent") ||
      cmd.includes("agent dashboard") ||
      cmd.includes("agents") ||
      cmd.includes("what if") ||
      cmd.includes("scenario") ||
      cmd.includes("radar")
    ) {
      onNavigate("agentDashboards");
      speakText("Opening Agent Dashboards Executive Suite.");
    } else if (cmd.includes("map") || cmd.includes("outlet") || cmd.includes("location")) {
      onNavigate("outlet");
      speakText("Opening Outlet Location Map HUD.");
    } else if (cmd.includes("inventory") || cmd.includes("stock") || cmd.includes("reorder")) {
      onNavigate("inventory");
      speakText("Navigating to Inventory Control.");
    } else if (cmd.includes("audit") || cmd.includes("compliance") || cmd.includes("checklist")) {
      onNavigate("audit");
      speakText("Opening Audit Compliance Checklist.");
    } else if (cmd.includes("staff") || cmd.includes("employee") || cmd.includes("attendance") || cmd.includes("roster")) {
      onNavigate("staff");
      speakText("Opening Staff Operations Directory.");
    } else if (cmd.includes("marketing") || cmd.includes("campaign") || cmd.includes("roas")) {
      onNavigate("marketing");
      speakText("Opening Marketing Engine.");
    } else if (cmd.includes("enterprise") || cmd.includes("cctv") || cmd.includes("royalty")) {
      onNavigate("enterprise");
      speakText("Opening Enterprise AI Command Center.");
    } else if (cmd.includes("dashboard") || cmd.includes("home") || cmd.includes("overview")) {
      onNavigate("dashboard");
      speakText("Returning to Executive Dashboard.");
    } else if (cmd.includes("briefing") || cmd.includes("report") || cmd.includes("summary")) {
      playExecutiveBriefing();
    }
  };

  const toggleListen = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser engine.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("Listening for voice commands...");
      recognition.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
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

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-3">
      {/* Floating Voice & Audio Controls Drawer */}
      {isOpen && (
        <div
          className="w-88 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all space-y-3"
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

          {/* Transcript Box */}
          <div
            className="p-3 rounded-xl border text-xs min-h-[52px] flex items-center justify-center text-center"
            style={{ background: "#06070960", borderColor: borderCol, color: textColor }}
          >
            {transcript || 'Say "Open Agent Dashboard", "Mute Audio", or "Read Briefing"'}
          </div>

          {/* Quick Voice Triggers */}
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
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              {isListening ? "Listening..." : "Mic On"}
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
              {isSpeaking ? "Stop Briefing" : "AI Briefing"}
            </button>
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
                {audioMuted ? "MUTED (Click to Unmute)" : "ACTIVE (Click to Mute)"}
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
        className="relative w-14 h-14 rounded-full border shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: accentColor,
          borderColor: "#FFFFFF40",
          boxShadow: `0 8px 30px ${accentColor}80`,
        }}
      >
        <Sparkles size={24} color="#FFFFFF" className="animate-pulse" />
        {isListening && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-ping border-2 border-slate-950" />
        )}
      </button>
    </div>
  );
}
