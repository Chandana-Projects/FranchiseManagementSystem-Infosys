"use client";

import React from "react";
import { Boxes, PackageCheck, AlertTriangle, Layers, ShieldAlert } from "lucide-react";

export interface StockBin {
  id: string;
  sku: string;
  name: string;
  category: string;
  levelPercent: number; // 0 to 100
  shelf: string;
  status: "Healthy" | "Low" | "Critical";
}

export const BINS_DATA: StockBin[] = [
  { id: "b1", sku: "SKU-CB-01", name: "Arabica Coffee Beans", category: "Coffee", levelPercent: 28, shelf: "A1-Top", status: "Critical" },
  { id: "b2", sku: "SKU-MK-02", name: "Whole Dairy Milk", category: "Dairy", levelPercent: 42, shelf: "A2-Chilled", status: "Low" },
  { id: "b3", sku: "SKU-CP-03", name: "Paper Cups (350ml)", category: "Packaging", levelPercent: 88, shelf: "B1-Dry", status: "Healthy" },
  { id: "b4", sku: "SKU-SY-04", name: "Vanilla Flavor Syrup", category: "Syrups", levelPercent: 74, shelf: "B2-Dry", status: "Healthy" },
  { id: "b5", sku: "SKU-SP-05", name: "Splenda Sugar Pouches", category: "Condiments", levelPercent: 92, shelf: "C1-Top", status: "Healthy" },
  { id: "b6", sku: "SKU-TC-06", name: "Takeaway Carry Bags", category: "Packaging", levelPercent: 35, shelf: "C2-Floor", status: "Low" },
];

interface StockroomVisualizerProps {
  accentColor?: string;
  theme?: any;
}

export default function StockroomVisualizer({ accentColor = "#3B82F6", theme }: StockroomVisualizerProps) {
  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div
      className="rounded-xl border p-5 transition-all shadow-xl"
      style={{ background: bgCard, borderColor: borderCol }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Boxes size={20} color={accentColor} />
          <div>
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              3D Warehouse Stockroom Storage Visualizer
            </h3>
            <p className="text-xs" style={{ color: textMuted }}>
              Real-time shelf inventory fill-rate telemetry across storage bays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy (&gt;60%)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low (&lt;50%)
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (&lt;30%)
          </span>
        </div>
      </div>

      {/* Grid of Storage Bins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {BINS_DATA.map((bin) => {
          const color =
            bin.status === "Healthy"
              ? "#10B981"
              : bin.status === "Low"
              ? "#F59E0B"
              : "#FB7185";

          return (
            <div
              key={bin.id}
              className="relative p-4 rounded-xl border overflow-hidden transition-all hover:scale-[1.02]"
              style={{ background: "#06070960", borderColor: borderCol }}
            >
              {/* Top Fill-level Indicator Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${bin.levelPercent}%`, background: color }}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Shelf {bin.shelf}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    background: `${color}1F`,
                    color,
                    borderColor: `${color}40`,
                  }}
                >
                  {bin.levelPercent}% Capacity
                </span>
              </div>

              <h4 className="text-sm font-bold truncate mb-1" style={{ color: textColor }}>
                {bin.name}
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>SKU: {bin.sku}</span>
                <span className="font-semibold text-slate-300">{bin.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
