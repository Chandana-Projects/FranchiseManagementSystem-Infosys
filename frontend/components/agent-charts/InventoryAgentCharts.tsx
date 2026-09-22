"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { Boxes, Flame, TrendingDown, Layers } from "lucide-react";

interface InventoryChartsProps {
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

const STOCK_CATEGORIES = [
  { name: "Raw Ingredients", value: 36, color: "#0D9488", valuation: "₹4.82L" },
  { name: "Dairy & Cheese", value: 26, color: "#3B82F6", valuation: "₹3.48L" },
  { name: "Bakery & Buns", value: 16, color: "#F59E0B", valuation: "₹2.14L" },
  { name: "Beverages & Syrups", value: 12, color: "#8B5CF6", valuation: "₹1.60L" },
  { name: "Packaging & Boxes", value: 10, color: "#EC4899", valuation: "₹1.34L" },
];

const WASTE_CAUSES = [
  { name: "Over-Prep Peak Buffer", value: 42, color: "#F43F5E" },
  { name: "Expired Shelf-Life", value: 26, color: "#FB923C" },
  { name: "Cold Storage Temp Glitch", value: 18, color: "#FBBF24" },
  { name: "Handling / Dropped", value: 14, color: "#94A3B8" },
];

const DEPLETION_CURVE = [
  { day: "Mon", stock: 100, safetyStock: 25 },
  { day: "Tue", stock: 86, safetyStock: 25 },
  { day: "Wed", stock: 72, safetyStock: 25 },
  { day: "Thu", stock: 58, safetyStock: 25 },
  { day: "Fri", stock: 38, safetyStock: 25 },
  { day: "Sat (Reorder)", stock: 95, safetyStock: 25 },
  { day: "Sun", stock: 78, safetyStock: 25 },
];

const SKU_LEVELS = [
  { sku: "Coffee Beans", current: 48, reorder: 30, unit: "kg" },
  { sku: "Mozzarella", current: 18, reorder: 25, unit: "kg" }, // low
  { sku: "Burger Buns", current: 420, reorder: 300, unit: "pcs" },
  { sku: "Paneer Patties", current: 65, reorder: 80, unit: "pcs" }, // low
  { sku: "Beverage Cups", current: 850, reorder: 500, unit: "pcs" },
  { sku: "Dairy Milk", current: 90, reorder: 60, unit: "L" },
];

export default function InventoryAgentCharts({ t, isDark = true }: InventoryChartsProps) {
  const cardBg = t.card;
  const borderColor = t.border;
  const textColor = t.text;
  const textMuted = t.textMuted;
  const tooltipStyle = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    border: `1px solid ${isDark ? "#334155" : "#CBD5E1"}`,
    borderRadius: 8,
    color: isDark ? "#fff" : "#0F172A",
    fontSize: 11,
  };

  return (
    <div className="space-y-6">
      {/* Top 2 Graphs: Category Allocation & Waste Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Inventory Category Allocation */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Boxes size={16} className="text-teal-400" />
              Stock Valuation by Category (Donut Chart)
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              Total: ₹13.38L
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Proportional valuation of ingredients and packaging across network hubs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STOCK_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {STOCK_CATEGORIES.map((entry, index) => (
                      <Cell key={`cat-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {STOCK_CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="truncate font-medium text-[11px]" style={{ color: textColor }}>{cat.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono text-[11px]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart: Wastage Root-Causes */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Flame size={16} className="text-rose-400" />
              Ingredient Wastage Root Causes (Pie Chart)
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              Wastage: 2.1%
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Operational loss breakdown to calibrate prep buffers and prevent spoilage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WASTE_CAUSES}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {WASTE_CAUSES.map((entry, index) => (
                      <Cell key={`waste-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {WASTE_CAUSES.map((w) => (
                <div key={w.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/20 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: w.color }} />
                    <span className="truncate font-medium text-[11px]" style={{ color: textColor }}>{w.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono text-[11px]">{w.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Graphs: 7-Day Burn-Down Area & Current Stock vs Reorder Level Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: 7-Day Stock Depletion Burn-Down Curve */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <TrendingDown size={16} className="text-blue-400" />
              7-Day Inventory Consumption Burn Curve (Area Chart)
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              Automated Reorder Trigger
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Burn-down profile showing weekday depletion and auto-replenishment spike.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEPLETION_CURVE}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="day" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="stock" name="Stock Level %" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                <Area type="step" dataKey="safetyStock" name="Safety Threshold" stroke="#EF4444" strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: SKU Stock Level vs Reorder Threshold Bars */}
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: textColor }}>
              <Layers size={16} className="text-amber-400" />
              SKU Stock on Hand vs Reorder Threshold (Bar Chart)
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              6 Core SKUs
            </span>
          </div>
          <p className="text-[11px] mb-4" style={{ color: textMuted }}>
            Red-flagged when current stock falls below minimum reorder trigger limit.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKU_LEVELS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} opacity={0.5} />
                <XAxis dataKey="sku" stroke={textMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={textMuted} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="current" name="On Hand" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reorder" name="Reorder Trigger" fill="#F59E0B" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
