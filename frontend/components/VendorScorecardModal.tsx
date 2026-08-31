"use client";

import React, { useState } from "react";
import { Truck, Star, ShieldAlert, Award, RefreshCw, X, Check } from "lucide-react";

interface VendorScorecardProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  accent: string;
}

interface VendorItem {
  id: string;
  name: string;
  category: string;
  onTimeSla: number;
  freshnessRating: number;
  damageClaimRate: number;
  status: "Tier-1 Preferred" | "Standard" | "Under Review";
}

const SAMPLE_VENDORS: VendorItem[] = [
  { id: "v-1", name: "BeanMaster Coffee Supplies", category: "Raw Coffee Beans", onTimeSla: 98.4, freshnessRating: 4.9, damageClaimRate: 0.2, status: "Tier-1 Preferred" },
  { id: "v-2", name: "MilkRich Dairy Farms", category: "Fresh Dairy & Cream", onTimeSla: 96.1, freshnessRating: 4.8, damageClaimRate: 0.5, status: "Tier-1 Preferred" },
  { id: "v-3", name: "EcoPack Containers Ltd", category: "Cups & Eco Packaging", onTimeSla: 91.5, freshnessRating: 4.2, damageClaimRate: 1.8, status: "Standard" },
  { id: "v-4", name: "Western Bakery Provisions", category: "Pastries & Croissants", onTimeSla: 84.2, freshnessRating: 3.6, damageClaimRate: 4.1, status: "Under Review" },
];

export default function VendorScorecardModal({ isOpen, onClose, t, accent }: VendorScorecardProps) {
  const [vendors, setVendors] = useState<VendorItem[]>(SAMPLE_VENDORS);
  const [escalatedVendorId, setEscalatedVendorId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEscalate = (id: string) => {
    setEscalatedVendorId(id);
    setTimeout(() => setEscalatedVendorId(null), 3000);
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
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: t.text }}>Vendor & Supply Chain SLA Rating Scorecard</h3>
              <p className="text-xs" style={{ color: t.textFaint }}>Track supplier delivery speed, ingredient freshness & damage claims</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border text-xs" style={{ borderColor: t.border, color: t.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vendors Grid */}
        <div className="my-4 overflow-x-auto border rounded-xl" style={{ borderColor: t.gridLine }}>
          <table className="w-full text-left text-xs">
            <thead className="border-b" style={{ background: t.inputBg, color: t.textFaint, borderColor: t.gridLine }}>
              <tr>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">On-Time SLA %</th>
                <th className="p-3">Quality Rating</th>
                <th className="p-3">Damage Claims %</th>
                <th className="p-3">Tier Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.gridLine }}>
              {vendors.map((v) => (
                <tr key={v.id} className="transition-colors hover:bg-white/5">
                  <td className="p-3 font-semibold" style={{ color: t.text }}>{v.name}</td>
                  <td className="p-3" style={{ color: t.textFaint }}>{v.category}</td>
                  <td className="p-3 font-mono font-bold" style={{ color: v.onTimeSla >= 95 ? "#10B981" : "#F59E0B" }}>
                    {v.onTimeSla}%
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 font-semibold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{v.freshnessRating} / 5.0</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono" style={{ color: v.damageClaimRate > 2 ? "#FB7185" : t.textMuted }}>
                    {v.damageClaimRate}%
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      v.status === "Tier-1 Preferred" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      v.status === "Standard" ? "bg-sky-500/15 text-sky-400 border-sky-500/30" :
                      "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {escalatedVendorId === v.id ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <Check className="w-3 h-3" /> Escalation Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEscalate(v.id)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      >
                        Claim SLA Penalty
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
