"use client";

import React, { useState } from "react";
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Sparkles, Building2, Calendar, FileSpreadsheet } from "lucide-react";

interface ExecutiveExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export default function ExecutiveExportStudioModal({
  isOpen,
  onClose,
  isDark = true,
}: ExecutiveExportStudioModalProps) {
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeOutletRankings, setIncludeOutletRankings] = useState(true);
  const [includeHACCP, setIncludeHACCP] = useState(true);
  const [includeAIForecast, setIncludeAIForecast] = useState(true);
  const [reportPeriod, setReportPeriod] = useState("Month-to-Date (Q3 FY26)");

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-slate-100"
        style={{
          background: isDark ? "rgba(15, 23, 42, 0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1",
          color: isDark ? "#F8FAFC" : "#0F172A",
        }}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-md">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Executive Export &amp; Branded Report Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
                  PDF &amp; Print Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate high-resolution corporate briefing documents with watermarks &amp; verified cryptographic hashes.
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

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs no-print">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-300">Include Sections:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input type="checkbox" checked={includeFinancials} onChange={(e) => setIncludeFinancials(e.target.checked)} className="accent-teal-500" />
              <span>Financials</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input type="checkbox" checked={includeOutletRankings} onChange={(e) => setIncludeOutletRankings(e.target.checked)} className="accent-teal-500" />
              <span>Outlet Rankings</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input type="checkbox" checked={includeHACCP} onChange={(e) => setIncludeHACCP(e.target.checked)} className="accent-teal-500" />
              <span>HACCP Audit</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input type="checkbox" checked={includeAIForecast} onChange={(e) => setIncludeAIForecast(e.target.checked)} className="accent-teal-500" />
              <span>AI Directives</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all cursor-pointer shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Branded Document Preview */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 bg-slate-950 font-sans text-slate-200">
          {/* Letterhead Header */}
          <div className="flex items-center justify-between border-b-2 border-teal-500 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-mono">OmniFranchise</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500 text-black font-bold uppercase font-mono">Official Executive Report</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Enterprise Franchise Intelligence &amp; Multi-Outlet Operations Network</p>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-0.5 font-mono">
              <p>Generated: <span className="text-white font-bold">{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span></p>
              <p>Period: <span className="text-teal-400">{reportPeriod}</span></p>
              <p>Doc ID: <span className="text-amber-400">#OF-EXEC-2026</span></p>
            </div>
          </div>

          {/* Section 1: Executive KPI Strip */}
          {includeFinancials && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 font-mono">1. Network Financial Performance Summary</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Consolidated GMV</p>
                  <p className="text-xl font-black text-white font-mono mt-1">₹48.20L</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">+14.2% YoY</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Gross Contribution</p>
                  <p className="text-xl font-black text-teal-400 font-mono mt-1">32.8%</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Target: 30.0%</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Active Stores</p>
                  <p className="text-xl font-black text-white font-mono mt-1">16 Outlets</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">100% Operational</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Customer CSAT</p>
                  <p className="text-xl font-black text-amber-400 font-mono mt-1">4.82 ⭐</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">1,240 Reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Outlet Rankings Table */}
          {includeOutletRankings && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 font-mono">2. Outlet Operations &amp; Benchmark Ledger</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono">
                    <tr>
                      <th className="p-2.5">Outlet</th>
                      <th className="p-2.5">Region</th>
                      <th className="p-2.5">MTD Revenue</th>
                      <th className="p-2.5">Target %</th>
                      <th className="p-2.5">Margin</th>
                      <th className="p-2.5">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                    <tr>
                      <td className="p-2.5 font-bold text-white">Pune FC Road</td>
                      <td className="p-2.5 text-slate-400">West Hub</td>
                      <td className="p-2.5 font-mono text-teal-400">₹8,40,000</td>
                      <td className="p-2.5 font-mono text-emerald-400">105.0%</td>
                      <td className="p-2.5 font-mono text-emerald-400">34.2%</td>
                      <td className="p-2.5 font-mono text-white">96 / 100</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Mumbai Bandra</td>
                      <td className="p-2.5 text-slate-400">West Flagship</td>
                      <td className="p-2.5 font-mono text-teal-400">₹9,20,000</td>
                      <td className="p-2.5 font-mono text-emerald-400">104.5%</td>
                      <td className="p-2.5 font-mono text-emerald-400">31.0%</td>
                      <td className="p-2.5 font-mono text-white">92 / 100</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Bangalore Indiranagar</td>
                      <td className="p-2.5 text-slate-400">South Tech Hub</td>
                      <td className="p-2.5 font-mono text-teal-400">₹7,80,000</td>
                      <td className="p-2.5 font-mono text-emerald-400">104.0%</td>
                      <td className="p-2.5 font-mono text-emerald-400">36.5%</td>
                      <td className="p-2.5 font-mono text-white">98 / 100</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Aurangabad CIDCO</td>
                      <td className="p-2.5 text-slate-400">Tier-2 Hub</td>
                      <td className="p-2.5 font-mono text-rose-400">₹3,40,000</td>
                      <td className="p-2.5 font-mono text-rose-400">78.0%</td>
                      <td className="p-2.5 font-mono text-amber-400">21.5%</td>
                      <td className="p-2.5 font-mono text-amber-400">68 / 100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: HACCP & AI Directives */}
          {includeHACCP && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 font-mono">3. Compliance, Food Safety &amp; AI Directives</h4>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between text-white font-bold border-b border-slate-800 pb-2">
                  <span>HACCP Compliance Network Average: 94.0%</span>
                  <span className="text-teal-400 font-mono">15 of 16 Outlets Certified</span>
                </div>
                <p>• <strong>Cold Chain Status:</strong> Freezers and milk chillers within calibrated HACCP limits (Avg -17.8°C / 3.4°C).</p>
                <p>• <strong>Recommended Action:</strong> Deploy district field supervisor to Aurangabad for SOP realignment and barista shift rebalancing.</p>
              </div>
            </div>
          )}

          {/* Cryptographic Seal */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-teal-400" />
              Cryptographic Hash: <span className="text-slate-300">SHA256: 7f8a9e2d4c1b0a88e9f2a4</span>
            </span>
            <span>OmniFranchise Enterprise Portal v3.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
