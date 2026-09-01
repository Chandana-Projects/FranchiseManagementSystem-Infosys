"use client";

import React, { useState, useEffect } from "react";
import { Clock, Globe, Calendar, ChevronDown, Check } from "lucide-react";

interface DigitalWorldClockProps {
  t?: {
    border: string;
    text: string;
    textMuted: string;
    panel: string;
    card: string;
  };
  accent?: string;
  isDark?: boolean;
}

interface WorldCity {
  name: string;
  timezone: string;
  flag: string;
  label: string;
}

const WORLD_CITIES: WorldCity[] = [
  { name: "Pune HQ (IST)", timezone: "Asia/Kolkata", flag: "🇮🇳", label: "Central HQ" },
  { name: "London Hub (GMT)", timezone: "Europe/London", flag: "🇬🇧", label: "Europe Ops" },
  { name: "Dubai Hub (GST)", timezone: "Asia/Dubai", flag: "🇦🇪", label: "Middle East" },
  { name: "Singapore (SGT)", timezone: "Asia/Singapore", flag: "🇸🇬", label: "APAC Regional" },
  { name: "New York (EST)", timezone: "America/New_York", flag: "🇺🇸", label: "Americas East" },
];

export default function DigitalWorldClock({
  accent = "#0D9488",
  isDark = true,
}: DigitalWorldClockProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<WorldCity>(WORLD_CITIES[0]);
  const [is24Hour, setIs24Hour] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(new Date());
      setTick((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 text-xs font-mono">
        <Clock size={14} className="animate-spin text-teal-400" />
        <span>Syncing Clock...</span>
      </div>
    );
  }

  // Format time in selected timezone
  const timeString = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedCity.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
  }).format(now);

  // Format Date: "Tue, 01 Sep 2026"
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedCity.timezone,
    weekday: "short",
  }).format(now);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedCity.timezone,
    day: "2-digit",
  }).format(now);

  const month = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedCity.timezone,
    month: "short",
  }).format(now);

  const year = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedCity.timezone,
    year: "numeric",
  }).format(now);

  return (
    <div className="relative inline-block">
      {/* Clock Badge Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl border backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer shadow-xs whitespace-nowrap text-left group"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(13, 148, 136, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(13, 148, 136, 0.08) 100%)",
          borderColor: isOpen ? accent : isDark ? "rgba(13, 148, 136, 0.35)" : "rgba(13, 148, 136, 0.25)",
        }}
        title="Live Real-World Digital Clock (Click to view World Franchise Clocks)"
      >
        {/* Live Pulsing Dot */}
        <div className="relative flex items-center justify-center shrink-0">
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-opacity duration-300"
            style={{
              background: tick ? "#10B981" : "#0D9488",
              boxShadow: tick ? "0 0 8px #10B981" : "0 0 3px #0D9488",
            }}
          />
        </div>

        {/* Time and Date Display */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-mono font-black text-xs tracking-tight text-white">
            <span className="text-teal-400 group-hover:text-teal-300 transition-colors">
              {timeString}
            </span>
            <span className="hidden xl:inline-block text-[9px] font-sans font-semibold px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {selectedCity.name.split(" ")[0]}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[9px] text-slate-400 font-medium leading-none">
            <Calendar size={9} className="text-slate-400 shrink-0" />
            <span>
              {weekday}, {day} {month} <span className="font-bold text-slate-300">{year}</span>
            </span>
          </div>
        </div>

        <ChevronDown
          size={11}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-teal-400" : ""}`}
        />
      </button>

      {/* World Franchise Clocks Dropdown Popover */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-80 p-4 rounded-2xl shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl bg-slate-900/95 border-slate-700 text-slate-100 text-xs"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-teal-400" />
                <span className="font-bold text-sm text-white">Global Franchise Clocks</span>
              </div>
              <button
                onClick={() => setIs24Hour(!is24Hour)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer"
              >
                {is24Hour ? "24h Mode" : "12h Mode"}
              </button>
            </div>

            {/* List of Global Cities */}
            <div className="space-y-2">
              {WORLD_CITIES.map((city) => {
                const cityTime = new Intl.DateTimeFormat("en-US", {
                  timeZone: city.timezone,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: !is24Hour,
                }).format(now);

                const cityDate = new Intl.DateTimeFormat("en-US", {
                  timeZone: city.timezone,
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(now);

                const isSelected = selectedCity.timezone === city.timezone;

                return (
                  <div
                    key={city.timezone}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500/60 text-white shadow-xs"
                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{city.flag}</span>
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{city.name}</span>
                          {isSelected && <Check size={12} className="text-teal-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{cityDate} • {city.label}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-bold text-teal-400 text-xs">{cityTime}</div>
                      <div className="text-[9px] text-slate-500">Live UTC sync</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Atomic Real-Time Clock
              </span>
              <span className="font-mono text-slate-400">Year {year}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
