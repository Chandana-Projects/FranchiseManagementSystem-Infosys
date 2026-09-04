"use client";

import React from "react";
import { Crown, MapPin, Store, ChevronDown } from "lucide-react";

export type ExecutiveRole = "HQ_ADMIN" | "REGIONAL_MANAGER" | "STORE_MANAGER";

interface RoleSwitcherProps {
  activeRole: ExecutiveRole;
  onChangeRole: (role: ExecutiveRole) => void;
  accentColor?: string;
  theme?: any;
}

export const ROLE_CONFIGS: Record<ExecutiveRole, { label: string; icon: any; badge: string }> = {
  HQ_ADMIN: { label: "Global HQ Admin", icon: Crown, badge: "Full Access" },
  REGIONAL_MANAGER: { label: "Regional Manager", icon: MapPin, badge: "Area Scope" },
  STORE_MANAGER: { label: "Store Manager", icon: Store, badge: "Local Scope" },
};

export default function RoleSwitcher({
  activeRole,
  onChangeRole,
  accentColor = "#F59E0B",
  theme,
}: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const textColor = theme?.text || "#F8FAFC";
  const borderCol = theme?.border || "#1E293B";
  const bgInput = theme?.inputBg || "rgba(6, 7, 9, 0.85)";

  const ActiveConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.HQ_ADMIN;
  const ActiveIcon = ActiveConfig.icon;

  return (
    <div className="relative inline-block shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shadow-sm transition-all shrink-0 whitespace-nowrap cursor-pointer hover:border-amber-400/50 group"
        style={{ background: bgInput, borderColor: isOpen ? accentColor : borderCol }}
        title="Switch Executive Role Scope"
      >
        <ActiveIcon size={13} color={accentColor} className="shrink-0" />
        <span className="font-semibold text-xs" style={{ color: textColor }}>
          {ActiveConfig.label} <span className="text-[10px] text-amber-400 font-mono font-normal">({ActiveConfig.badge})</span>
        </span>
        <ChevronDown
          size={11}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-amber-400" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-0 top-full mt-2 w-56 p-1.5 rounded-xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl bg-slate-900/95 border-slate-700 text-xs"
            style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}
          >
            <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
              Select Role Scope
            </div>
            {(Object.keys(ROLE_CONFIGS) as ExecutiveRole[]).map((r) => {
              const cfg = ROLE_CONFIGS[r];
              const Icon = cfg.icon;
              const isSelected = r === activeRole;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onChangeRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                    isSelected ? "bg-amber-500/15 text-amber-300 font-semibold" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} color={isSelected ? accentColor : "#94A3B8"} />
                    <span>{cfg.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-slate-700 bg-slate-800/80 text-slate-400">
                    {cfg.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
