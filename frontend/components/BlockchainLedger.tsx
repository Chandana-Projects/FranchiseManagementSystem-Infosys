"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Hash, Cpu, CheckCircle2, Terminal } from "lucide-react";

export interface BlockEntry {
  blockHeight: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactionType: string;
  payloadSummary: string;
  validator: string;
  status: "CONFIRMED";
}

export const INITIAL_BLOCKS: BlockEntry[] = [
  {
    blockHeight: 89412,
    hash: "0x8F92A1B7C3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABC",
    previousHash: "0x7E8190A6B2C3D4E567890123456789ABCDEF0123456789ABCDEF0123456789AB",
    timestamp: new Date().toLocaleTimeString(),
    transactionType: "POS_SALE_TRANSACTION",
    payloadSummary: "Pune HQ Outlet - Sale #4912 (₹1,250) - Deducted 2 cups, 50g coffee",
    validator: "Consensus-Node-Alpha (0x3F91)",
    status: "CONFIRMED",
  },
  {
    blockHeight: 89411,
    hash: "0x7E8190A6B2C3D4E567890123456789ABCDEF0123456789ABCDEF0123456789AB",
    previousHash: "0x6D708995A1B2C3D4567890123456789ABCDEF0123456789ABCDEF0123456789A",
    timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
    transactionType: "AUTO_PO_DISPATCH",
    payloadSummary: "Supplier PO #882 - Dispatched 100kg Arabica Coffee Beans via WhatsApp",
    validator: "Consensus-Node-Beta (0x7C22)",
    status: "CONFIRMED",
  },
  {
    blockHeight: 89410,
    hash: "0x6D708995A1B2C3D4567890123456789ABCDEF0123456789ABCDEF0123456789A",
    previousHash: "0x5C6F788490A1B2C34567890123456789ABCDEF0123456789ABCDEF0123456789",
    timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
    transactionType: "AUDIT_COMPLIANCE_SIGNATURE",
    payloadSummary: "Mumbai Central - Food Safety Temperature Check Passed (99/100)",
    validator: "Consensus-Node-Gamma (0x9E44)",
    status: "CONFIRMED",
  },
];

interface BlockchainLedgerProps {
  accentColor?: string;
  theme?: any;
}

export default function BlockchainLedger({ accentColor = "#3B82F6", theme }: BlockchainLedgerProps) {
  const [blocks, setBlocks] = useState<BlockEntry[]>(INITIAL_BLOCKS);

  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div
      className="rounded-xl border p-5 transition-all shadow-xl space-y-4"
      style={{ background: bgCard, borderColor: borderCol }}
    >
      <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2" style={{ borderColor: borderCol }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} color="#10B981" />
          <div>
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              Cryptographic Blockchain Immutability Ledger
            </h3>
            <p className="text-xs" style={{ color: textMuted }}>
              SHA-256 Merkle tree verification & zero-trust audit compliance trail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} /> VERIFIED BY CONSENSUS NODES
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {blocks.map((b) => (
          <div
            key={b.blockHeight}
            className="p-4 rounded-xl border space-y-2 transition-all hover:scale-[1.01]"
            style={{ background: "#06070960", borderColor: borderCol }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400">Block #{b.blockHeight}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/40 text-cyan-400 bg-cyan-500/10 font-bold">
                  {b.transactionType}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">{b.timestamp}</span>
            </div>

            <div className="text-xs font-semibold" style={{ color: textColor }}>
              {b.payloadSummary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t" style={{ borderColor: borderCol }}>
              <div className="truncate">
                Hash: <span className="text-slate-200">{b.hash.substring(0, 24)}...</span>
              </div>
              <div className="truncate text-right md:text-right">
                Validator: <span className="text-emerald-400">{b.validator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
