"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface DigitalClockProps {
  theme?: any;
  accentColor?: string;
}

export default function DigitalClock({ theme, accentColor = "#F59E0B" }: DigitalClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono shrink-0 animate-pulse"
        style={{ background: theme?.inputBg || "rgba(6, 7, 9, 0.85)", borderColor: theme?.border || "#1E293B" }}
      >
        <Clock size={13} color={accentColor} />
        <span style={{ color: theme?.textMuted || "#CBD5E1" }}>--:--:-- --</span>
      </div>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  const dayName = time.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const monthName = time.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = time.getDate().toString().padStart(2, "0");

  const formattedTime = `${displayHours}:${minutes}:${seconds} ${ampm}`;
  const formattedDate = `${dayName}, ${dayNum} ${monthName}`;

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono shadow-xs shrink-0 whitespace-nowrap transition-all"
      style={{
        background: theme?.inputBg || "rgba(6, 7, 9, 0.85)",
        borderColor: theme?.border || "#1E293B",
      }}
      title={`System Real-Time Clock: ${formattedDate} ${formattedTime}`}
    >
      <div className="flex items-center gap-1.5">
        <Clock size={13} color={accentColor} className="shrink-0" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-bold tracking-wider" style={{ color: theme?.text || "#F8FAFC" }}>
          {formattedTime}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold"
          style={{ background: "rgba(245, 158, 11, 0.15)", color: accentColor }}
        >
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
