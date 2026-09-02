"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  ShieldAlert,
  Flame,
  Search,
  Scale,
  ChefHat,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { playTechChime } from "@/lib/WebAudioSFX";

interface RecipeVarianceModalProps {
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

interface IngredientBOM {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitCost: number;
  theoreticalQty: number;
  actualQty: number;
  shrinkageTag: "Portion Inaccuracy" | "Spillage / Spoilage" | "Potential Pilferage" | "Optimal";
}

interface RecipeProfile {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  menuPrice: number;
  ingredients: IngredientBOM[];
}

const SAMPLE_RECIPES: RecipeProfile[] = [
  {
    id: "rec-1",
    name: "Signature Double Cheese Burger",
    category: "Food / Mains",
    unitsSold: 420,
    menuPrice: 280,
    ingredients: [
      { id: "ing-1", name: "Brioche Sesame Buns", category: "Bakery", unit: "pcs", unitCost: 18, theoreticalQty: 420, actualQty: 485, shrinkageTag: "Portion Inaccuracy" },
      { id: "ing-2", name: "Plant/Gourmet Patties", category: "Frozen", unit: "pcs", unitCost: 45, theoreticalQty: 840, actualQty: 960, shrinkageTag: "Potential Pilferage" },
      { id: "ing-3", name: "Aged Cheddar Slices", category: "Dairy", unit: "slices", unitCost: 12, theoreticalQty: 840, actualQty: 1050, shrinkageTag: "Portion Inaccuracy" },
      { id: "ing-4", name: "Special House Secret Sauce", category: "Sauces", unit: "kg", unitCost: 220, theoreticalQty: 12.6, actualQty: 16.8, shrinkageTag: "Spillage / Spoilage" },
      { id: "ing-5", name: "Pickled Jalapeños", category: "Condiments", unit: "kg", unitCost: 140, theoreticalQty: 6.3, actualQty: 6.8, shrinkageTag: "Optimal" },
    ]
  },
  {
    id: "rec-2",
    name: "Artisanal Hazelnut Cold Brew",
    category: "Beverages",
    unitsSold: 610,
    menuPrice: 210,
    ingredients: [
      { id: "ing-6", name: "Arabica Blend Coffee Grounds", category: "Beans", unit: "kg", unitCost: 850, theoreticalQty: 15.2, actualQty: 18.9, shrinkageTag: "Potential Pilferage" },
      { id: "ing-7", name: "Organic Hazelnut Syrup", category: "Syrups", unit: "L", unitCost: 520, theoreticalQty: 12.2, actualQty: 15.4, shrinkageTag: "Portion Inaccuracy" },
      { id: "ing-8", name: "Whole Condensed Cream", category: "Dairy", unit: "L", unitCost: 110, theoreticalQty: 30.5, actualQty: 34.0, shrinkageTag: "Spillage / Spoilage" },
      { id: "ing-9", name: "Eco Compostable Tumblers", category: "Packaging", unit: "pcs", unitCost: 9, theoreticalQty: 610, actualQty: 630, shrinkageTag: "Optimal" },
    ]
  },
  {
    id: "rec-3",
    name: "Truffle Mushroom Sourdough Toast",
    category: "Bakery / Toast",
    unitsSold: 280,
    menuPrice: 240,
    ingredients: [
      { id: "ing-10", name: "Artisan Sourdough Loaf (Slices)", category: "Bakery", unit: "slices", unitCost: 14, theoreticalQty: 560, actualQty: 640, shrinkageTag: "Spillage / Spoilage" },
      { id: "ing-11", name: "Button & Shiitake Mushrooms", category: "Produce", unit: "kg", unitCost: 180, theoreticalQty: 28.0, actualQty: 35.5, shrinkageTag: "Portion Inaccuracy" },
      { id: "ing-12", name: "White Truffle Infused Olive Oil", category: "Oils", unit: "L", unitCost: 1600, theoreticalQty: 2.8, actualQty: 4.1, shrinkageTag: "Potential Pilferage" },
      { id: "ing-13", name: "Parmesan Shavings", category: "Dairy", unit: "kg", unitCost: 950, theoreticalQty: 4.2, actualQty: 5.6, shrinkageTag: "Portion Inaccuracy" },
    ]
  }
];

export default function RecipeVarianceEngineModal({
  isOpen,
  onClose,
  t,
  accent = "#3B82F6",
  isDark = true
}: RecipeVarianceModalProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProfile>(SAMPLE_RECIPES[0]);
  const [auditToast, setAuditToast] = useState<string | null>(null);

  // Variance & Financial Computations
  const calculations = useMemo(() => {
    let totalTheoreticalCost = 0;
    let totalActualCost = 0;
    let highRiskCount = 0;

    const items = selectedRecipe.ingredients.map((ing) => {
      const theoCost = ing.theoreticalQty * ing.unitCost;
      const actCost = ing.actualQty * ing.unitCost;
      const varianceQty = +(ing.actualQty - ing.theoreticalQty).toFixed(1);
      const variancePct = +(((ing.actualQty - ing.theoreticalQty) / ing.theoreticalQty) * 100).toFixed(1);
      const costVariance = Math.round(actCost - theoCost);

      totalTheoreticalCost += theoCost;
      totalActualCost += actCost;
      if (ing.shrinkageTag === "Potential Pilferage") highRiskCount++;

      return {
        ...ing,
        theoCost,
        actCost,
        varianceQty,
        variancePct,
        costVariance
      };
    });

    const totalMenuSales = selectedRecipe.unitsSold * selectedRecipe.menuPrice;
    const idealFoodCostPct = totalMenuSales > 0 ? +((totalTheoreticalCost / totalMenuSales) * 100).toFixed(1) : 0;
    const actualFoodCostPct = totalMenuSales > 0 ? +((totalActualCost / totalMenuSales) * 100).toFixed(1) : 0;
    const grossLeakage = Math.round(totalActualCost - totalTheoreticalCost);

    return {
      items,
      totalTheoreticalCost: Math.round(totalTheoreticalCost),
      totalActualCost: Math.round(totalActualCost),
      idealFoodCostPct,
      actualFoodCostPct,
      grossLeakage,
      highRiskCount
    };
  }, [selectedRecipe]);

  // Chart Data
  const chartData = useMemo(() => {
    return calculations.items.map((i) => ({
      name: i.name.length > 18 ? i.name.substring(0, 16) + "..." : i.name,
      Theoretical: i.theoreticalQty,
      Actual: i.actualQty,
      unit: i.unit
    }));
  }, [calculations]);

  const handleTriggerKitchenAudit = () => {
    playTechChime();
    setAuditToast(`Portion Control Audit dispatched to Head Chef for ${selectedRecipe.name}`);
    setTimeout(() => setAuditToast(null), 3500);
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
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: t.text }}>
                  Recipe BOM vs. Actual Depletion Variance Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ChefHat className="w-3 h-3" /> FOOD COST LEAKAGE AUDIT
                </span>
              </div>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Identify kitchen shrinkage, portion over-serving, and potential raw material pilferage across recipe standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerKitchenAudit}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer shadow-xs"
            >
              <ClipboardList className="w-3.5 h-3.5" /> Dispatch Kitchen Audit
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

        {/* Toast Alert */}
        {auditToast && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {auditToast}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Recipe Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Select Recipe:
            </span>
            {SAMPLE_RECIPES.map((rec) => {
              const isSel = rec.id === selectedRecipe.id;
              return (
                <button
                  key={rec.id}
                  onClick={() => {
                    playTechChime();
                    setSelectedRecipe(rec);
                  }}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSel
                      ? "bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-400/50 shadow-md"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {rec.name}
                  <span className="ml-2 text-[10px] text-slate-400 font-mono">({rec.unitsSold} sold)</span>
                </button>
              );
            })}
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Ideal Food Cost */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-cyan-400" /> Ideal Theoretical Food Cost
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">{calculations.idealFoodCostPct}%</div>
              <div className="text-[10px] text-slate-400">₹{calculations.totalTheoreticalCost.toLocaleString("en-IN")} standard cost</div>
            </div>

            {/* KPI 2: Actual Food Cost */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-400" /> Actual Realized Food Cost
              </div>
              <div className="text-2xl font-extrabold text-rose-400">{calculations.actualFoodCostPct}%</div>
              <div className="text-[10px] text-rose-300 font-bold">
                +{(calculations.actualFoodCostPct - calculations.idealFoodCostPct).toFixed(1)}% Cost Erosion
              </div>
            </div>

            {/* KPI 3: Gross Profit Leakage */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" /> Monthly Shrinkage Loss
              </div>
              <div className="text-2xl font-extrabold text-amber-400">
                ₹{calculations.grossLeakage.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-amber-300/80">Discrepancy across {selectedRecipe.unitsSold} units</div>
            </div>

            {/* KPI 4: High Suspicion Count */}
            <div className="p-4 rounded-xl border bg-slate-900/30 space-y-1" style={{ borderColor: t.border }}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-400" /> Flagged Pilferage Risks
              </div>
              <div className="text-2xl font-extrabold text-purple-400">
                {calculations.highRiskCount} Ingredients
              </div>
              <div className="text-[10px] text-purple-300 font-bold">Variance exceeds ±15% threshold</div>
            </div>
          </div>

          {/* BOM Breakdown Table */}
          <div className="rounded-xl border overflow-hidden bg-slate-900/40" style={{ borderColor: t.border }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" /> Bill of Materials (BOM) Depletion Ledger
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Formula: Actual Stock Depleted - (Portion Qty × Units Sold)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b text-slate-400 bg-slate-800/50" style={{ borderColor: t.border }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ingredient SKU</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold text-right">Theoretical Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Actual Depleted</th>
                    <th className="px-4 py-3 font-semibold text-right">Variance</th>
                    <th className="px-4 py-3 font-semibold text-right">Loss Impact</th>
                    <th className="px-4 py-3 font-semibold">Classification & Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {calculations.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-200">{item.name}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{item.category}</td>
                      <td className="px-4 py-3 text-right font-mono text-cyan-300">
                        {item.theoreticalQty} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">
                        {item.actualQty} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        <span className={item.variancePct > 10 ? "text-rose-400" : item.variancePct > 0 ? "text-amber-400" : "text-emerald-400"}>
                          +{item.varianceQty} {item.unit} ({item.variancePct}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                        +₹{item.costVariance.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            item.shrinkageTag === "Potential Pilferage"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : item.shrinkageTag === "Portion Inaccuracy"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : item.shrinkageTag === "Spillage / Spoilage"
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {item.shrinkageTag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Recharts Bar Graph */}
          <div className="p-4 rounded-xl border bg-slate-900/30 space-y-3" style={{ borderColor: t.border }}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Visual Variance Disparity: Theoretical Standards vs. Physical Depletion
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} angle={-10} textAnchor="end" />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="Theoretical" fill="#38BDF8" name="Theoretical Recipe Qty" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#F43F5E" name="Actual Physical Depleted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
