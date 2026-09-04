"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  X,
  Play,
  Pause,
  Maximize2,
  Volume2,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Download,
  Flame,
  Radio,
  Clock
} from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

interface CCTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint?: string;
    panel?: string;
    gridLine?: string;
  };
  accent?: string;
  isDark?: boolean;
}

interface CameraFeed {
  id: string;
  name: string;
  zone: string;
  resolution: string;
  fps: number;
  complianceScore: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  activeDetections: string[];
  description: string;
}

const CAMERAS: CameraFeed[] = [
  {
    id: "CAM-01",
    name: "Kitchen Assembly & Prep",
    zone: "Cold/Hot Prep Line",
    resolution: "1080p @ 30fps",
    fps: 30,
    complianceScore: 98.4,
    status: "NORMAL",
    activeDetections: ["Hairnets Detected: 4/4", "Nitrile Gloves: OK", "Prep Surface Temp: 4.1°C"],
    description: "HACCP Food Safety & Personal Protective Equipment (PPE) inspection."
  },
  {
    id: "CAM-02",
    name: "POS Counter & Billing Queue",
    zone: "Front of House Counter",
    resolution: "4K @ 24fps",
    fps: 24,
    complianceScore: 94.1,
    status: "NORMAL",
    activeDetections: ["Active Queue: 3 Persons", "Avg Dwell Time: 2.3 min", "Cashier Speed: 38 sec/order"],
    description: "Line queue monitoring, wait time alerts, and cashier productivity tracker."
  },
  {
    id: "CAM-03",
    name: "Main Dining & Table Turnover",
    zone: "Seating Floor A & B",
    resolution: "1080p @ 30fps",
    fps: 30,
    complianceScore: 91.5,
    status: "WARNING",
    activeDetections: ["Table 4: Clean Pending", "Occupancy: 78%", "Unattended Bag: 0"],
    description: "Table busser turn-around, customer dwell analytics, and floor cleanliness."
  },
  {
    id: "CAM-04",
    name: "Drive-Thru & Curbside Pickup",
    zone: "External Lane 1",
    resolution: "1080p @ 30fps",
    fps: 30,
    complianceScore: 96.8,
    status: "NORMAL",
    activeDetections: ["Cars in Lane: 2", "Window Service: 1.8 min", "Order Accuracy: 100%"],
    description: "Vehicle queue pacing, speaker kiosk lag, and bag handoff speed."
  }
];

interface IncidentLog {
  id: string;
  timestamp: string;
  camId: string;
  type: "PPE Compliance" | "Queue Spillover" | "Table Cleanliness" | "Audit Note";
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
}

const INITIAL_INCIDENTS: IncidentLog[] = [
  {
    id: "INC-801",
    timestamp: "15:42:10",
    camId: "CAM-03",
    type: "Table Cleanliness",
    severity: "MEDIUM",
    message: "Table #4 vacant for >4 mins without sanitization wipe. Busser dispatched."
  },
  {
    id: "INC-802",
    timestamp: "15:35:44",
    camId: "CAM-01",
    type: "PPE Compliance",
    severity: "LOW",
    message: "Chef #2 hairnet re-adjusted. Computer vision 100% compliance restored."
  },
  {
    id: "INC-803",
    timestamp: "15:20:19",
    camId: "CAM-02",
    type: "Queue Spillover",
    severity: "LOW",
    message: "Queue peaked at 5 patrons. Secondary POS terminal automatically recommended."
  }
];

function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  color: string,
  subLabel: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Corner reticles
  const cLen = 10;
  ctx.beginPath();
  // Top-left
  ctx.moveTo(x, y + cLen);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cLen, y);
  // Top-right
  ctx.moveTo(x + w - cLen, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + cLen);
  // Bottom-left
  ctx.moveTo(x, y + h - cLen);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + cLen, y + h);
  // Bottom-right
  ctx.moveTo(x + w - cLen, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - cLen);
  ctx.stroke();

  // Fill highlight
  ctx.fillStyle = color.replace(")", ", 0.08)").replace("rgb", "rgba").replace("#", "rgba(");
  ctx.fillRect(x, y, w, h);

  // Label tag
  ctx.fillStyle = color;
  ctx.fillRect(x, y - 18, Math.max(90, label.length * 6.5), 18);
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText(label, x + 4, y - 5);

  // Subtag pill
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(x, y + h + 3, Math.max(100, subLabel.length * 6.2), 16);
  ctx.fillStyle = color;
  ctx.font = "9px monospace";
  ctx.fillText(subLabel, x + 4, y + h + 14);
}

export default function CCTVVisionSentinelModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: CCTVModalProps) {
  const [selectedCam, setSelectedCam] = useState<CameraFeed>(CAMERAS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [incidents, setIncidents] = useState<IncidentLog[]>(INITIAL_INCIDENTS);
  const [liveTimestamp, setLiveTimestamp] = useState("");
  const [exportNotice, setExportNotice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animated Canvas Simulation (Drawing live HUD, scanlines, and animated bounding boxes)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tCount = 0;

    const render = () => {
      tCount += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark surveillance background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (selectedCam.id === "CAM-01") {
        bgGrad.addColorStop(0, "#091e2b");
        bgGrad.addColorStop(1, "#030c14");
      } else if (selectedCam.id === "CAM-02") {
        bgGrad.addColorStop(0, "#1c142b");
        bgGrad.addColorStop(1, "#0a0614");
      } else if (selectedCam.id === "CAM-03") {
        bgGrad.addColorStop(0, "#1e220e");
        bgGrad.addColorStop(1, "#0a0d05");
      } else {
        bgGrad.addColorStop(0, "#1e1414");
        bgGrad.addColorStop(1, "#0d0606");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle perspective room grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated Scanline sweep
      const scanY = (Math.sin(tCount * 0.8) * 0.5 + 0.5) * height;
      ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
      ctx.fillRect(0, scanY - 3, width, 6);

      // Camera specific simulated bounding boxes
      if (selectedCam.id === "CAM-01") {
        // Kitchen Prep Targets
        drawBox(ctx, 80 + Math.sin(tCount) * 8, 70, 110, 160, "PERSON #1 [CHEF HEAD]", "#10B981", "HAIRNET: 99.2% OK");
        drawBox(ctx, 230 + Math.cos(tCount) * 6, 85, 110, 155, "PERSON #2 [LINE COOK]", "#10B981", "GLOVES: 98.6% OK");
        drawBox(ctx, 400 + Math.sin(tCount * 0.5) * 5, 120, 150, 110, "PREP WORKSTATION #A", "#38BDF8", "SURFACE SANITIZED");
      } else if (selectedCam.id === "CAM-02") {
        // POS Queue Targets
        drawBox(ctx, 90, 80, 100, 160, "CASHIER #1", "#38BDF8", "RING SPEED: 42s");
        drawBox(ctx, 230 + Math.sin(tCount * 0.7) * 6, 90, 95, 155, "PATRON #1", "#10B981", "WAIT: 1.2 min");
        drawBox(ctx, 350 + Math.cos(tCount * 0.7) * 7, 95, 95, 150, "PATRON #2", "#F59E0B", "WAIT: 2.4 min");
        drawBox(ctx, 470 + Math.sin(tCount * 0.5) * 5, 100, 95, 145, "PATRON #3", "#F59E0B", "WAIT: 3.1 min");
      } else if (selectedCam.id === "CAM-03") {
        // Dining Table Targets
        drawBox(ctx, 110, 90, 140, 120, "TABLE #01", "#10B981", "OCCUPIED (2 GUESTS)");
        drawBox(ctx, 300, 100, 140, 120, "TABLE #04 [ALERT]", "#FB7185", "CLEAN PENDING (4m)");
        drawBox(ctx, 480, 85, 130, 125, "TABLE #08", "#10B981", "OCCUPIED (4 GUESTS)");
      } else {
        // Drive-Thru Targets
        drawBox(ctx, 130 + Math.sin(tCount * 0.5) * 12, 110, 170, 100, "VEHICLE #1 (SEDAN)", "#10B981", "WINDOW DWELL: 1.8m");
        drawBox(ctx, 350 + Math.cos(tCount * 0.5) * 10, 120, 180, 105, "VEHICLE #2 (SUV)", "#38BDF8", "QUEUE WAIT: 0.9m");
      }

      // HUD Overlay: Camera Timestamp, Reticle, and REC status
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "11px monospace";
      ctx.fillText(`${selectedCam.id} // ${selectedCam.name.toUpperCase()} // ${selectedCam.resolution}`, 16, 26);
      ctx.fillText(liveTimestamp || "LIVE STREAM ACTIVE", 16, 42);

      // Blinking REC dot
      if (Math.floor(tCount * 2) % 2 === 0 && isPlaying) {
        ctx.fillStyle = "#EF4444";
        ctx.beginPath();
        ctx.arc(width - 30, 24, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#EF4444";
        ctx.font = "bold 11px monospace";
        ctx.fillText("LIVE REC", width - 95, 28);
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, selectedCam, isPlaying, liveTimestamp]);



  const handleExportIncidentAudit = () => {
    playTechChime();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-6xl rounded-2xl border shadow-2xl overflow-hidden glass-card max-h-[94vh] flex flex-col transition-all"
        style={{ background: t.card, borderColor: t.border }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3"
          style={{ borderColor: t.gridLine || t.border }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  CCTV AI Vision Sentinel Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                  <Radio className="w-3 h-3" /> LIVE MULTI-CAM FEED
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Real-time computer vision inference, PPE hygiene scoring, and queue bottleneck detection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportIncidentAudit}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/30"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit Log
            </button>
            <button
              onClick={() => {
                playTechChime();
                onClose();
              }}
              className="p-2 rounded-xl border transition-colors hover:bg-white/10"
              style={{ borderColor: t.border, color: t.textMuted }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {exportNotice && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Timestamped CCTV Audit Pack exported with SHA-256 evidence certificate.
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* Camera Switcher Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CAMERAS.map((cam) => {
              const isSelected = cam.id === selectedCam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => {
                    playTechChime();
                    setSelectedCam(cam);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "ring-2 ring-cyan-400 bg-cyan-500/10 border-cyan-400/50 shadow-lg"
                      : "hover:bg-slate-800/40 bg-slate-900/30 border-slate-800"
                  }`}
                  style={{ borderColor: isSelected ? accent : t.border }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-cyan-400">{cam.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        cam.status === "NORMAL"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {cam.complianceScore}% SCORE
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: t.text }}>
                    {cam.name}
                  </div>
                  <div className="text-[10px] truncate" style={{ color: t.textMuted }}>
                    {cam.zone}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Video Stream Simulation & Right Info Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Canvas Surveillance Stream (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-black shadow-inner aspect-[16/9]">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover block"
                />

                {/* Canvas Controls Bar Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-300">
                      {isPlaying ? "STREAMING (LIVE)" : "PAUSED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
                    <span className="text-cyan-400">FPS: {selectedCam.fps}</span>
                    <span>RES: {selectedCam.resolution}</span>
                  </div>
                </div>
              </div>

              {/* Active Computer Vision Detections Tag Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold" style={{ color: t.textMuted }}>
                  Active CV Inference:
                </span>
                {selectedCam.activeDetections.map((det, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" /> {det}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Telemetry & Real-Time Incident Panel (1 Col) */}
            <div className="space-y-4">
              {/* Compliance Card */}
              <div
                className="p-4 rounded-xl border bg-slate-900/40 space-y-3"
                style={{ borderColor: t.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Zone Safety Rating
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {selectedCam.complianceScore}%
                  </span>
                  <span className="text-xs text-slate-400">Overall Standard Grade A</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedCam.complianceScore}%` }}
                  />
                </div>
                <p className="text-[11px]" style={{ color: t.textMuted }}>
                  {selectedCam.description}
                </p>
              </div>

              {/* Real-Time Incidents Ticker */}
              <div
                className="p-4 rounded-xl border bg-slate-900/40 space-y-3"
                style={{ borderColor: t.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Incident Feed
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Auto-Refreshed</span>
                </div>

                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-2.5 rounded-lg border bg-slate-800/40 border-slate-700/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-cyan-400 font-bold">{inc.camId}</span>
                        <span className="text-slate-400">{inc.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-medium" style={{ color: t.text }}>
                        {inc.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
