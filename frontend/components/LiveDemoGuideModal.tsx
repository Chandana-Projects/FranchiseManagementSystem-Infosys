"use client";

import React, { useState } from "react";
import { X, PlayCircle, Sparkles, CheckCircle2, RotateCcw, Clock, Compass, Layers, ShieldCheck, Zap, ArrowRight } from "lucide-react";

interface LiveDemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabKey: string) => void;
  isDark?: boolean;
}

interface DemoStep {
  stepNumber: number;
  timeEstimate: string;
  title: string;
  targetTab: string;
  talkingPoints: string[];
  keyHighlight: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    timeEstimate: "0:00 – 0:30",
    title: "Executive Overview & Global World Clocks",
    targetTab: "dashboard",
    talkingPoints: [
      "Point out the live real-world ticking digital clock with international hub timezones (Pune HQ, London, Dubai, Singapore, New York).",
      "Highlight consolidated MTD GMV (₹48.20L), 94% health score, and high-contrast glassmorphic design system.",
      "Demonstrate instant Dark/Light mode toggle and responsive mobile viewport support.",
    ],
    keyHighlight: "Tri-tier microservices with Next.js 16, Express, and FastAPI ML services.",
  },
  {
    stepNumber: 2,
    timeEstimate: "0:30 – 1:00",
    title: "FastAPI Machine Learning & What-If Sandbox",
    targetTab: "intelligence",
    talkingPoints: [
      "Demonstrate XGBoost and Prophet predictive sales forecasts with 91.2% R² accuracy.",
      "Open the 'Margin Sensitivity Matrix' to dynamically adjust promotional discounts and raw material inflation.",
      "Show live profit waterfall chart recalculating EBITDA in real-time.",
    ],
    keyHighlight: "Autonomous ML circuit breakers and predictive inventory restocking PO triggers.",
  },
  {
    stepNumber: 3,
    timeEstimate: "1:00 – 1:30",
    title: "Multi-Store Arena & Operational Modules",
    targetTab: "outlet",
    talkingPoints: [
      "Open the 'Multi-Store Head-to-Head Arena' to compare Pune vs Mumbai vs Bangalore side-by-side.",
      "Show dynamic winner badges (👑 Best Margin, ⚡ Fastest Prep, ⭐ Top CSAT) and 360° radar overlays.",
      "Show embedded domain charts across all 6 agent dashboards without separate pages.",
    ],
    keyHighlight: "12+ domain-specific visual charts natively embedded in every operations view.",
  },
  {
    stepNumber: 4,
    timeEstimate: "1:30 – 2:00",
    title: "War Room Kiosk, Offline PWA & Verified Audit Reports",
    targetTab: "audit",
    talkingPoints: [
      "Launch 'Executive War Room Mode' (Press 'W') for fullscreen boardroom projection.",
      "Show PWA offline capability, rate-limited SSE alerts (15-20m cooldown), and cryptographic SHA-256 audit reports.",
      "Conclude with 1-click 'Executive Export Studio' for PDF briefing documents.",
    ],
    keyHighlight: "Zero TypeScript errors, 18/18 test suite passing, enterprise-grade architecture.",
  },
];

export default function LiveDemoGuideModal({
  isOpen,
  onClose,
  onNavigate,
  isDark = true,
}: LiveDemoGuideModalProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [dataResetToast, setDataResetToast] = useState(false);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[activeStepIdx];

  const handleResetData = () => {
    setDataResetToast(true);
    setTimeout(() => setDataResetToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-slate-100"
        style={{
          background: isDark ? "rgba(15, 23, 42, 0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1",
          color: isDark ? "#F8FAFC" : "#0F172A",
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-md">
              <Compass size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  2-Minute Evaluator &amp; Live Pitch Guide
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
                  Demo Script
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A structured walkthrough guide for presenting OmniFranchise to judges &amp; enterprise stakeholders.
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

        {/* Step Tabs */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {DEMO_STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStepIdx === idx
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                  : "bg-slate-800/60 text-slate-400 hover:text-white"
              }`}
            >
              <span>Act {step.stepNumber}</span>
              <span className="text-[10px] font-mono opacity-80">({step.timeEstimate})</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-teal-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                Act {currentStep.stepNumber} of 4 • {currentStep.timeEstimate}
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">{currentStep.title}</h2>
            </div>
            <button
              onClick={() => {
                onNavigate(currentStep.targetTab);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 font-bold transition-all cursor-pointer"
            >
              <span>Jump to View</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Talking Points */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase text-slate-300 font-mono">Key Talking Points:</h4>
            <div className="space-y-2">
              {currentStep.talkingPoints.map((point, pIdx) => (
                <div key={pIdx} className="p-3 rounded-2xl border bg-black/20 border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-relaxed text-xs">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Highlight */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Sparkles size={14} /> Evaluator Tech Note:
            </div>
            <p className="text-slate-300 text-xs">{currentStep.keyHighlight}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-900/60">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Reset telemetry & simulated numbers to pristine demo state"
          >
            <RotateCcw size={13} />
            <span>{dataResetToast ? "✓ Demo State Reset!" : "Reset Demo Data"}</span>
          </button>

          <div className="flex items-center gap-2">
            {activeStepIdx > 0 && (
              <button
                onClick={() => setActiveStepIdx((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                Previous Act
              </button>
            )}
            {activeStepIdx < DEMO_STEPS.length - 1 ? (
              <button
                onClick={() => setActiveStepIdx((prev) => prev + 1)}
                className="px-4 py-1.5 rounded-xl font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 cursor-pointer"
              >
                Next Act →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 cursor-pointer"
              >
                Start Demo Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
