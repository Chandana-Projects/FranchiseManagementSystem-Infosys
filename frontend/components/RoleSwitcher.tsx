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
  const textColor = theme?.text || "#F8FAFC";
  const borderCol = theme?.border || "#1E293B";
  const bgInput = theme?.inputBg || "rgba(6, 7, 9, 0.85)";

  const ActiveIcon = ROLE_CONFIGS[activeRole].icon;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shadow-sm transition-all shrink-0"
      style={{ background: bgInput, borderColor: borderCol }}
    >
      <ActiveIcon size={13} color={accentColor} />
      <select
        value={activeRole}
        onChange={(e) => onChangeRole(e.target.value as ExecutiveRole)}
        className="bg-transparent outline-none font-semibold cursor-pointer text-xs w-auto"
        style={{ color: textColor }}
      >
        {(Object.keys(ROLE_CONFIGS) as ExecutiveRole[]).map((r) => (
          <option key={r} value={r} style={{ background: "#0F172A", color: "#F8FAFC" }}>
            {ROLE_CONFIGS[r].label} ({ROLE_CONFIGS[r].badge})
          </option>
        ))}
      </select>
    </div>
  );
}
