"use client";

import React, { useState } from "react";
import { QrCode, Camera, PackageCheck, AlertTriangle, Plus, Minus, Send, X, RefreshCw, CheckCircle2 } from "lucide-react";
import { playTechChime } from "@/lib/WebAudioSFX";

interface StockItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  outlet: string;
}

const MOCK_STOCK_ITEMS: Record<string, StockItem> = {
  "SKU-MOZ-101": {
    sku: "SKU-MOZ-101",
    name: "Mozzarella Cheese Blocks (10kg)",
    category: "Dairy & Frozen",
    currentStock: 12,
    minThreshold: 20,
    unit: "kg",
    unitPrice: 420,
    supplier: "Amul Dairy Corp",
    outlet: "Pune MG Road"
  },
  "SKU-CHI-202": {
    sku: "SKU-CHI-202",
    name: "Marinated Chicken Breasts",
    category: "Meat & Poultry",
    currentStock: 45,
    minThreshold: 30,
    unit: "kg",
    unitPrice: 310,
    supplier: "Venky's Foods",
    outlet: "Mumbai Bandra Hub"
  },
  "SKU-OIL-303": {
    sku: "SKU-OIL-303",
    name: "Refined Sunflower Oil (15L Can)",
    category: "Cooking Medium",
    currentStock: 8,
    minThreshold: 15,
    unit: "cans",
    unitPrice: 1850,
    supplier: "Fortune Agro Products",
    outlet: "Nashik City Center"
  },
  "SKU-COF-404": {
    sku: "SKU-COF-404",
    name: "Arabica Espresso Beans (1kg)",
    category: "Beverage Raw",
    currentStock: 28,
    minThreshold: 10,
    unit: "bags",
    unitPrice: 950,
    supplier: "Sahyadri Coffee Farms",
    outlet: "Bangalore Indiranagar"
  }
};

export default function QRStockScannerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedSku, setSelectedSku] = useState<string>("SKU-MOZ-101");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stockItem, setStockItem] = useState<StockItem>(MOCK_STOCK_ITEMS["SKU-MOZ-101"]);
  const [quantityAdjust, setQuantityAdjust] = useState<number>(0);
  const [poDispatched, setPoDispatched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateScan = (sku: string) => {
    playTechChime("nav");
    setIsScanning(true);
    setTimeout(() => {
      setSelectedSku(sku);
      setStockItem(MOCK_STOCK_ITEMS[sku] || MOCK_STOCK_ITEMS["SKU-MOZ-101"]);
      setQuantityAdjust(0);
      setPoDispatched(false);
      setIsScanning(false);
    }, 600);
  };

  const handleAdjustStock = (delta: number) => {
    playTechChime("click");
    setQuantityAdjust(prev => prev + delta);
  };

  const handleSaveStock = () => {
    playTechChime("success");
    setStockItem(prev => ({
      ...prev,
      currentStock: Math.max(0, prev.currentStock + quantityAdjust)
    }));
    setQuantityAdjust(0);
  };

  const handleDispatchPO = () => {
    playTechChime("success");
    setPoDispatched(true);
  };

  const effectiveStock = stockItem.currentStock + quantityAdjust;
  const isLowStock = effectiveStock <= stockItem.minThreshold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative max-w-xl w-full bg-[#0b0f19] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Mobile QR & Barcode Stockroom Scanner</h3>
                <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Scan shelf QR tags to adjust stock or trigger PO dispatch</p>
            </div>
          </div>
          <button 
            onClick={() => { playTechChime("click"); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center relative overflow-hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              Live Scanner Viewfinder
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Optical Reader Active
            </span>
          </div>

          <div className="w-full h-32 border-2 border-dashed border-cyan-500/40 rounded-xl flex flex-col items-center justify-center bg-slate-900/60 relative">
            {/* Viewfinder corner guides */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            {isScanning ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xs text-cyan-300">Decoding Barcode...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <QrCode className="w-8 h-8 text-cyan-400/80 mb-1" />
                <span className="text-xs font-mono font-bold text-white">{selectedSku}</span>
                <span className="text-[10px] text-slate-400">Align barcode inside frame</span>
              </div>
            )}
          </div>

          {/* Test Barcode Quick Selector */}
          <div className="mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] text-slate-400">Test Barcodes:</span>
            {Object.keys(MOCK_STOCK_ITEMS).map((sku) => (
              <button
                key={sku}
                onClick={() => handleSimulateScan(sku)}
                className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                  selectedSku === sku 
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold" 
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {sku}
              </button>
            ))}
          </div>
        </div>

        {/* Item Data & Controls */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{stockItem.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{stockItem.name}</h4>
                <p className="text-xs text-slate-400">Supplier: <span className="text-slate-200">{stockItem.supplier}</span></p>
              </div>
              <div className="text-right">
                {isLowStock ? (
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/70 border border-rose-500/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Low Stock Alert
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" />
                    Optimal Inventory
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Adjuster */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Current Stock Level</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdjustStock(-1)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-extrabold text-white font-mono">
                    {effectiveStock} <span className="text-xs text-slate-400">{stockItem.unit}</span>
                  </span>
                  <button
                    onClick={() => handleAdjustStock(1)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right flex flex-col justify-end">
                <span className="text-xs text-slate-400 block mb-1">Minimum Threshold</span>
                <span className="text-sm font-bold font-mono text-slate-300">
                  {stockItem.minThreshold} {stockItem.unit}
                </span>
                {quantityAdjust !== 0 && (
                  <button
                    onClick={handleSaveStock}
                    className="mt-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-black px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Save Stock Count ({quantityAdjust > 0 ? `+${quantityAdjust}` : quantityAdjust})
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Instant PO Dispatch Card */}
          {isLowStock && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-amber-300">Trigger Autonomous Purchase Order?</h5>
                <p className="text-[11px] text-slate-300">Dispatch reorder request of 50 {stockItem.unit} to {stockItem.supplier}.</p>
              </div>

              {poDispatched ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  PO Dispatched!
                </span>
              ) : (
                <button
                  onClick={handleDispatchPO}
                  className="text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Auto-PO Now
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
