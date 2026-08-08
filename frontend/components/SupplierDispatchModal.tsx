"use client";

import React, { useState, useEffect } from "react";
import { Truck, CheckCircle2, MessageSquare, Clock, MapPin, Send, AlertCircle, X } from "lucide-react";

interface SupplierItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  unit: string;
  supplier: string;
  phone: string;
}

export const LOW_STOCK_ITEMS: SupplierItem[] = [
  {
    id: "item-1",
    name: "Arabica Coffee Beans (Grade A)",
    category: "Beverages",
    stock: 14,
    threshold: 50,
    unit: "kg",
    supplier: "Deccan Roasters Co.",
    phone: "919876543210",
  },
  {
    id: "item-2",
    name: "Biodegradable Paper Cups (350ml)",
    category: "Packaging",
    stock: 320,
    threshold: 1000,
    unit: "pcs",
    supplier: "EcoPack Solutions",
    phone: "919876543211",
  },
  {
    id: "item-3",
    name: "Organic Whole Milk",
    category: "Dairy",
    stock: 25,
    threshold: 80,
    unit: "L",
    supplier: "Sahyadri Dairy Farms",
    phone: "919876543212",
  },
];

interface SupplierDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  theme?: any;
}

export default function SupplierDispatchModal({
  isOpen,
  onClose,
  accentColor = "#3B82F6",
  theme,
}: SupplierDispatchModalProps) {
  const [dispatchedItems, setDispatchedItems] = useState<Record<string, { etaMinutes: number; driverName: string; vehicle: string }>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "item-1": 100,
    "item-2": 2000,
    "item-3": 150,
  });

  if (!isOpen) return null;

  const handleDispatch = (item: SupplierItem) => {
    const qty = quantities[item.id] || 100;
    const message = encodeURIComponent(
      `*OmniFranchise Auto-PO Dispatch Request*\n\n` +
      `Item: ${item.name}\n` +
      `Quantity: ${qty} ${item.unit}\n` +
      `Supplier: ${item.supplier}\n` +
      `Delivery Target: Pune HQ Warehouse\n\n` +
      `Please confirm dispatch ETA.`
    );

    // Open WhatsApp Web Link
    window.open(`https://wa.me/${item.phone}?text=${message}`, "_blank");

    // Track simulated dispatch
    setDispatchedItems((prev) => ({
      ...prev,
      [item.id]: {
        etaMinutes: Math.floor(Math.random() * 25) + 15,
        driverName: "Suresh Shinde",
        vehicle: "MH-12-VT-8492",
      },
    }));
  };

  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-5"
        style={{ background: bgCard, borderColor: borderCol }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: borderCol }}>
          <div className="flex items-center gap-2.5">
            <Truck size={22} color={accentColor} />
            <div>
              <h3 className="text-base font-bold" style={{ color: textColor }}>
                Automated Supplier Dispatch & WhatsApp Gateway
              </h3>
              <p className="text-xs" style={{ color: textMuted }}>
                Direct PO generation & live shipment ETA telemetry tracking
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {LOW_STOCK_ITEMS.map((item) => {
            const isDispatched = !!dispatchedItems[item.id];
            const dispatchData = dispatchedItems[item.id];

            return (
              <div
                key={item.id}
                className="rounded-xl border p-4 transition-all"
                style={{
                  background: isDispatched ? "#10B9810D" : "#06070940",
                  borderColor: isDispatched ? "#10B98140" : borderCol,
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: textColor }}>
                      {item.name}
                    </h4>
                    <p className="text-xs" style={{ color: textMuted }}>
                      Supplier: <strong className="text-slate-300">{item.supplier}</strong>
                    </p>
                  </div>

                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                    style={{
                      background: item.stock < item.threshold ? "#FB718520" : "#F59E0B20",
                      color: item.stock < item.threshold ? "#FB7185" : "#F59E0B",
                      borderColor: item.stock < item.threshold ? "#FB718540" : "#F59E0B40",
                    }}
                  >
                    Stock: {item.stock} / {item.threshold} {item.unit}
                  </span>
                </div>

                {isDispatched ? (
                  <div className="mt-3 p-3 rounded-lg border bg-emerald-950/20 border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>
                        PO Dispatched via WhatsApp | Vehicle: <strong>{dispatchData.vehicle}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-amber-300">
                      <Clock size={14} /> ETA: {dispatchData.etaMinutes} mins
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Order Quantity:</span>
                      <input
                        type="number"
                        value={quantities[item.id] || 100}
                        onChange={(e) =>
                          setQuantities({ ...quantities, [item.id]: Number(e.target.value) })
                        }
                        className="w-24 px-2 py-1 rounded border text-xs font-semibold"
                        style={{ background: "#060709", borderColor: borderCol, color: textColor }}
                      />
                      <span className="text-xs text-slate-400">{item.unit}</span>
                    </div>

                    <button
                      onClick={() => handleDispatch(item)}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                      style={{
                        background: "#25D366",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 14px #25D36640",
                      }}
                    >
                      <MessageSquare size={14} /> Dispatch via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
