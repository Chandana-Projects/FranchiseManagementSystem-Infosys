"use client";

import React, { useState } from "react";
import { Sparkles, ChevronRight, ChevronLeft, Check, X, Compass, MapPin, Cpu, BookOpen, Activity, ShieldCheck } from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

export interface TourStep {
  targetId: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "location-selector",
    title: "1. Global 28 States & 169 Countries Navigation",
    category: "Geographic Expansion",
    description: "Cascading header selector mapping all 28 Indian States (Maharashtra, Delhi NCR, Karnataka, etc.) and major international hubs across 169 countries.",
    icon: <MapPin className="w-5 h-5 text-amber-400" />
  },
  {
    targetId: "leaflet-map-hud",
    title: "2. Interactive GIS Leaflet OpenStreetMap HUD",
    category: "Real-Time Mapping",
    description: "Live OpenStreetMap vector tile engine rendering exact GPS markers, Haversine distance calculations from Pune HQ, and dark holographic map layers.",
    icon: <Compass className="w-5 h-5 text-cyan-400" />
  },
  {
    targetId: "ai-pillars-card",
    title: "3. Enterprise Autonomous AI Pillars",
    category: "Predictive Engines",
    description: "Six core AI engines including Auto-PO Telemetry, Dynamic Yield Pricing, CCTV Hygiene Vision, Operator Churn Predictor, and POS Theft Anomaly Auditor.",
    icon: <Cpu className="w-5 h-5 text-purple-400" />
  },
  {
    targetId: "rag-sop-button",
    title: "4. Franchise SOP RAG AI Assistant",
    category: "GenAI Knowledge Base",
    description: "Vector similarity search engine for instant answers on store hygiene, cold storage temp breaches, cashier cash reconciliation, and HACCP compliance.",
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />
  },
  {
    targetId: "digital-twin-hud",
    title: "5. Operational Digital Twin & Blockchain Ledger",
    category: "IoT & Security",
    description: "Real-time IoT simulation of kitchen throughput, ambient temperatures, and SHA-256 cryptographic block explorer for unalterable audit trails.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
  },
  {
    targetId: "mlops-console",
    title: "6. MLOps Model Performance Console",
    category: "AI Governance",
    description: "Real-time telemetry tracking RMSE, inference latency (ms), concept drift alerts, and 1-click model retraining over FastAPI microservices.",
    icon: <Activity className="w-5 h-5 text-rose-400" />
  }
];

export default function DemoTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    playTechChime("nav");
    if (!isLast) {
      setCurrentStep(prev => prev + 1);
    } else {
      playTechChime("success");
      onClose();
    }
  };

  const handlePrev = () => {
    playTechChime("click");
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative max-w-lg w-full bg-[#0d121f] border border-amber-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden text-white">
        
        {/* Glowing Background Overlay */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl"></div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Executive Presentation Tour</span>
              <h3 className="text-sm font-bold text-slate-200">OmniFranchise God-Tier Architecture</h3>
            </div>
          </div>
          <button 
            onClick={() => { playTechChime("click"); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4 my-2">
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              {step.icon}
              {step.category}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <h4 className="text-lg font-extrabold text-white leading-snug">{step.title}</h4>
          
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            {step.description}
          </p>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { playTechChime("click"); setCurrentStep(idx); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-8 bg-amber-500 shadow-md shadow-amber-500/40" : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>

        </div>

        {/* Controls Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all"
          >
            {isLast ? (
              <>
                <span>Complete Tour</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
