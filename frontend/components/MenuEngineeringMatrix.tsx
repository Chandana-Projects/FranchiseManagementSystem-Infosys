"use client";

import React, { useState } from "react";
import { Utensils, Star, TrendingUp, Sparkles, HelpCircle, ArrowUpRight, Check, X } from "lucide-react";

interface MenuEngineeringProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  accent: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  salesVolume: number;
  profitMarginPct: number;
  price: number;
  quadrant: "Star" | "Plowhorse" | "Puzzle" | "Dog";
  pricingAdvice: string;
}

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  { id: "m-1", name: "Iced Caramel Macchiato", category: "Beverages", salesVolume: 1420, profitMarginPct: 78, price: 240, quadrant: "Star", pricingAdvice: "Maintain current price; high yield driver." },
  { id: "m-2", name: "Hazelnut Cold Brew", category: "Beverages", salesVolume: 410, profitMarginPct: 82, price: 260, quadrant: "Puzzle", pricingAdvice: "Promote on homepage; high margin opportunity." },
  { id: "m-3", name: "Classic Butter Croissant", category: "Bakery", salesVolume: 1850, profitMarginPct: 42, price: 120, quadrant: "Plowhorse", pricingAdvice: "Increase price by +₹15 during weekend rush." },
  { id: "m-4", name: "Vegan Matcha Muffin", category: "Bakery", salesVolume: 180, profitMarginPct: 35, price: 160, quadrant: "Dog", pricingAdvice: "Consider replacing with high-margin alternative." },
];

export default function MenuEngineeringMatrix({ isOpen, onClose, t, accent }: MenuEngineeringProps) {
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [appliedAdviceId, setAppliedAdviceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyAdvice = (id: string) => {
    setAppliedAdviceId(id);
    setTimeout(() => setAppliedAdviceId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-4xl rounded-2xl border p-6 shadow-2xl overflow-hidden glass-card max-h-[90vh] flex flex-col"
        style={{ background: t.card, borderColor: t.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: t.gridLine }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: t.text }}>Menu Engineering & Dynamic Yield Pricing</h3>
              <p className="text-xs" style={{ color: t.textFaint }}>BCG 4-quadrant profitability matrix & AI pricing optimization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border text-xs" style={{ borderColor: t.border, color: t.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Quadrants Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-400">⭐ Stars (High Margin & Vol)</span>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>Top revenue generators</p>
          </div>
          <div className="p-3 rounded-xl border bg-sky-500/10 border-sky-500/20">
            <span className="text-[10px] uppercase font-bold text-sky-400">🧩 Puzzles (High Margin, Low Vol)</span>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>Needs promotional push</p>
          </div>
          <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/20">
            <span className="text-[10px] uppercase font-bold text-amber-400">🐴 Plowhorses (Low Margin, High Vol)</span>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>Slight price increase target</p>
          </div>
          <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/20">
            <span className="text-[10px] uppercase font-bold text-rose-400">🐶 Dogs (Low Margin & Vol)</span>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>Phase out candidates</p>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="overflow-x-auto border rounded-xl" style={{ borderColor: t.gridLine }}>
          <table className="w-full text-left text-xs">
            <thead className="border-b" style={{ background: t.inputBg, color: t.textFaint, borderColor: t.gridLine }}>
              <tr>
                <th className="p-3">Dish / Item Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 font-mono">Price (₹)</th>
                <th className="p-3 font-mono">Monthly Sales Vol</th>
                <th className="p-3 font-mono">Margin %</th>
                <th className="p-3">Quadrant</th>
                <th className="p-3">AI Pricing Recommendation</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.gridLine }}>
              {items.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-white/5">
                  <td className="p-3 font-semibold" style={{ color: t.text }}>{m.name}</td>
                  <td className="p-3" style={{ color: t.textFaint }}>{m.category}</td>
                  <td className="p-3 font-mono font-bold" style={{ color: t.text }}>₹{m.price}</td>
                  <td className="p-3 font-mono">{m.salesVolume.toLocaleString("en-IN")} units</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{m.profitMarginPct}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      m.quadrant === "Star" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      m.quadrant === "Puzzle" ? "bg-sky-500/15 text-sky-400 border-sky-500/30" :
                      m.quadrant === "Plowhorse" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                      "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    }`}>
                      {m.quadrant}
                    </span>
                  </td>
                  <td className="p-3 text-[11px]" style={{ color: t.textFaint }}>
                    {m.pricingAdvice}
                  </td>
                  <td className="p-3 text-right">
                    {appliedAdviceId === m.id ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <Check className="w-3 h-3" /> Price Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyAdvice(m.id)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                      >
                        Apply Yield
                      </button>
                    )}
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
