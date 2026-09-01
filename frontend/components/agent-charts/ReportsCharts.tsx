"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FileBarChart, ShoppingBag } from "lucide-react";

interface ReportsChartsProps {
  t: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    panel: string;
  };
  accent?: string;
  isDark?: boolean;
}

const REVENUE_TIMELINE = [
  { month: "Jan", revenue: 420000, cogs: 168000, profit: 142000, opex: 110000 },
  { month: "Feb", revenue: 460000, cogs: 184000, profit: 161000, opex: 115000 },
  { month: "Mar", revenue: 510000, cogs: 204000, profit: 182000, opex: 124000 },
  { month: "Apr", revenue: 490000, cogs: 196000, profit: 168000, opex: 126000 },
  { month: "May", revenue: 580000, cogs: 232000, profit: 215000, opex: 133000 },
  { month: "Jun", revenue: 640000, cogs: 256000, profit: 243000, opex: 141000 },
  { month: "Jul", revenue: 690000, cogs: 276000, profit: 265000, opex: 149000 },
  { month: "Aug", revenue: 730000, cogs: 292000, profit: 284000, opex: 154000 },
  { month: "Sep", revenue: 790000, cogs: 316000, profit: 312000, opex: 162000 },
  { month: "Oct", revenue: 840000, cogs: 336000, profit: 335000, opex: 169000 },
  { month: "Nov", revenue: 910000, cogs: 364000, profit: 372000, opex: 174000 },
  { month: "Dec", revenue: 980000, cogs: 392000, profit: 410000, opex: 178000 },
];

const PAYMENT_MODES = [
  { name: "UPI / QR Gateway", value: 52, color: "#06B6D4", count: "14,820 txns" },
  { name: "Credit/Debit Cards", value: 26, color: "#3B82F6", count: "7,410 txns" },
  { name: "Cash on POS", value: 12, color: "#F97316", count: "3,420 txns" },
  { name: "Swiggy/Zomato Pay", value: 7, color: "#EF4444", count: "1,990 txns" },
  { name: "Franchise Loyalty Card", value: 3, color: "#A855F7", count: "855 txns" },
];

export default function ReportsCharts({ t, isDark = true }: ReportsChartsProps) {
  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Financial & Yield Performance Stacked Bar */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
            <FileBarChart size={16} className="text-teal-400" />
            12-Month Financial Performance &amp; OPEX Matrix (Bar)
          </h3>
          <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
            Annual Report
          </span>
        </div>
        <p className="text-[11px] mb-4" style={{ color: textMuted }}>
          Monthly Gross Revenue, Net Profit, and COGS breakdown for audit reporting.
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_TIMELINE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
              <XAxis dataKey="month" stroke={textMuted} fontSize={10} tickLine={false} />
              <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }}
                formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Gross Sales" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Payment Settlement Channels Pie */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
            <ShoppingBag size={16} className="text-emerald-400" />
            Payment Channel &amp; POS Settlement Share (Pie Chart)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            28,500+ Txns
          </span>
        </div>
        <p className="text-[11px] mb-4" style={{ color: textMuted }}>
          Channel settlement reconciliation for cash vs digital POS gateways.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_MODES}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {PAYMENT_MODES.map((entry, index) => (
                    <Cell key={`rep-pay-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {PAYMENT_MODES.map((mode) => (
              <div key={mode.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: mode.color }} />
                  <span className="truncate font-medium text-[11px]" style={{ color: textColor }}>{mode.name}</span>
                </div>
                <span className="font-bold text-white font-mono text-[11px]">{mode.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
