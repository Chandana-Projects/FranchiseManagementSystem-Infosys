"use client";

import React from "react";
import { Globe, MapPin, ChevronDown } from "lucide-react";
import {
  GLOBAL_LOCATIONS,
  INDIAN_STATES,
  INTERNATIONAL_COUNTRIES,
  LocationNode,
} from "../lib/GlobalLocationRegistry";

interface GlobalRegionSelectorProps {
  selectedCountry: string;
  selectedState: string;
  onSelectCountry: (country: string) => void;
  onSelectState: (state: string) => void;
  accentColor?: string;
  theme?: any;
}

export default function GlobalRegionSelector({
  selectedCountry,
  selectedState,
  onSelectCountry,
  onSelectState,
  accentColor = "#3B82F6",
  theme,
}: GlobalRegionSelectorProps) {
  const textColor = theme?.text || "#F8FAFC";
  const borderCol = theme?.border || "#1E293B";
  const bgInput = theme?.inputBg || "rgba(6, 7, 9, 0.85)";

  const availableStates =
    selectedCountry === "India"
      ? INDIAN_STATES
      : Array.from(
          new Set(
            GLOBAL_LOCATIONS.filter(
              (l) => selectedCountry === "All" || l.country === selectedCountry
            ).map((l) => l.state)
          )
        );

  return (
    <div className="flex items-center gap-2 flex-nowrap shrink-0">
      {/* Country Filter */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shadow-sm transition-all shrink-0"
        style={{ background: bgInput, borderColor: borderCol }}
      >
        <Globe size={13} color={accentColor} />
        <select
          value={selectedCountry}
          onChange={(e) => {
            onSelectCountry(e.target.value);
            onSelectState("All");
          }}
          className="bg-transparent outline-none font-semibold cursor-pointer text-xs w-auto max-w-[160px]"
          style={{ color: textColor }}
        >
          <option value="All" style={{ background: "#0F172A", color: "#F8FAFC" }}>
            All Countries (169)
          </option>
          <option value="India" style={{ background: "#0F172A", color: "#F8FAFC" }}>
            India (28 States)
          </option>
          {INTERNATIONAL_COUNTRIES.map((c) => (
            <option key={c} value={c} style={{ background: "#0F172A", color: "#F8FAFC" }}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* State / Province Filter */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shadow-sm transition-all shrink-0"
        style={{ background: bgInput, borderColor: borderCol }}
      >
        <MapPin size={13} color={accentColor} />
        <select
          value={selectedState}
          onChange={(e) => onSelectState(e.target.value)}
          className="bg-transparent outline-none font-semibold cursor-pointer text-xs w-auto max-w-[140px]"
          style={{ color: textColor }}
        >
          <option value="All" style={{ background: "#0F172A", color: "#F8FAFC" }}>
            All States ({availableStates.length})
          </option>
          {availableStates.map((st) => (
            <option key={st} value={st} style={{ background: "#0F172A", color: "#F8FAFC" }}>
              {st}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
