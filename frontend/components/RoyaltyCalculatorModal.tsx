"use client";

import React, { useState } from "react";
import { DollarSign, Percent, TrendingUp, Calculator, CheckCircle, ShieldAlert, X } from "lucide-react";

interface RoyaltyCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  accent: string;
}

interface RoyaltyRecord {
  outlet: string;
  grossSales: number;
  royaltyPct: number;
  marketingPct: number;
  royaltyAmount: number;
  marketingAmount: number;
  netProfit: number;
  status: "Paid" | "Pending" | "Overdue";
}

const SAMPLE_ROYALTIES: RoyaltyRecord[] = [
  { outlet: "Pune FC Road", grossSales: 1540000, royaltyPct: 5, marketingPct: 2, royaltyAmount: 77000, marketingAmount: 30800, netProfit: 385000, status: "Paid" },
  { outlet: "Nashik City Center", grossSales: 1280000, royaltyPct: 5, marketingPct: 2, royaltyAmount: 64000, marketingAmount: 25600, netProfit: 320000, status: "Paid" },
  { outlet: "Mumbai Andheri East", grossSales: 960000, royaltyPct: 5, marketingPct: 2, royaltyAmount: 48000, marketingAmount: 19200, netProfit: 210000, status: "Pending" },
  { outlet: "Aurangabad CIDCO", grossSales: 610000, royaltyPct: 5, marketingPct: 2, royaltyAmount: 30500, marketingAmount: 12200, netProfit: 98000, status: "Overdue" },
];

export default function RoyaltyCalculatorModal({ isOpen, onClose, t, accent }: RoyaltyCalculatorProps) {
  const [royaltyFeePct, setRoyaltyFeePct] = useState(5);
  const [marketingFeePct, setMarketingFeePct] = useState(2);
  const [customRevenue, setCustomRevenue] = useState(1000000);

  if (!isOpen) return null;

  const calculatedRoyalty = (customRevenue * royaltyFeePct) / 100;
  const calculatedMarketing = (customRevenue * marketingFeePct) / 100;
  const calculatedTotalFees = calculatedRoyalty + calculatedMarketing;
  const estimatedOwnerProfit = customRevenue * 0.25 - calculatedTotalFees;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-4xl rounded-2xl border p-6 shadow-2xl overflow-hidden glass-card max-h-[90vh] flex flex-col"
        style={{ background: t.card, borderColor: t.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: t.gridLine }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: t.text }}>Franchise Royalty & Financial ROI Calculator</h3>
              <p className="text-xs" style={{ color: t.textFaint }}>Automated royalty tracking & franchisee net profit margin analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border text-xs" style={{ borderColor: t.border, color: t.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 p-4 rounded-xl border" style={{ background: t.inputBg, borderColor: t.border }}>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: t.textFaint }}>Monthly Gross Sales (₹)</label>
            <input
              type="number"
              value={customRevenue}
              onChange={(e) => setCustomRevenue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none"
              style={{ background: t.card, borderColor: t.border, color: t.text }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: t.textFaint }}>Royalty Fee (%)</label>
            <input
              type="number"
              value={royaltyFeePct}
              onChange={(e) => setRoyaltyFeePct(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none"
              style={{ background: t.card, borderColor: t.border, color: t.text }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: t.textFaint }}>Marketing Fund (%)</label>
            <input
              type="number"
              value={marketingFeePct}
              onChange={(e) => setMarketingFeePct(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none"
              style={{ background: t.card, borderColor: t.border, color: t.text }}
            />
          </div>
        </div>

        {/* Calculation Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/20">
            <span className="text-[10px] uppercase font-bold text-amber-400">Royalty (5%)</span>
            <p className="text-sm font-bold font-mono text-amber-300">₹{calculatedRoyalty.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 rounded-xl border bg-sky-500/10 border-sky-500/20">
            <span className="text-[10px] uppercase font-bold text-sky-400">Marketing Fund (2%)</span>
            <p className="text-sm font-bold font-mono text-sky-300">₹{calculatedMarketing.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/20">
            <span className="text-[10px] uppercase font-bold text-rose-400">Total HQ Fees</span>
            <p className="text-sm font-bold font-mono text-rose-300">₹{calculatedTotalFees.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Est. Owner Net Profit</span>
            <p className="text-sm font-bold font-mono text-emerald-300">₹{estimatedOwnerProfit.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Multi-Outlet Royalty Ledger Table */}
        <div className="overflow-x-auto border rounded-xl" style={{ borderColor: t.gridLine }}>
          <table className="w-full text-left text-xs">
            <thead className="border-b" style={{ background: t.inputBg, color: t.textFaint, borderColor: t.gridLine }}>
              <tr>
                <th className="p-3">Outlet</th>
                <th className="p-3">Gross Sales</th>
                <th className="p-3">HQ Royalty (5%)</th>
                <th className="p-3">Marketing (2%)</th>
                <th className="p-3">Franchisee Net Profit</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.gridLine }}>
              {SAMPLE_ROYALTIES.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-white/5">
                  <td className="p-3 font-semibold" style={{ color: t.text }}>{r.outlet}</td>
                  <td className="p-3 font-mono" style={{ color: t.text }}>₹{r.grossSales.toLocaleString("en-IN")}</td>
                  <td className="p-3 font-mono text-amber-400">₹{r.royaltyAmount.toLocaleString("en-IN")}</td>
                  <td className="p-3 font-mono text-sky-400">₹{r.marketingAmount.toLocaleString("en-IN")}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">₹{r.netProfit.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.status === "Paid" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      r.status === "Pending" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                      "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
