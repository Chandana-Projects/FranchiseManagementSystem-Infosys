"use client";

import React from "react";
import { Trophy, Medal, Star, Award, TrendingUp, ShieldCheck } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  outletName: string;
  revenue: number;
  growth: number;
  nps: number;
  auditScore: number;
  badge: string;
  badgeColor: string;
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    outletName: "Mumbai Central",
    revenue: 210000,
    growth: 18.4,
    nps: 96,
    auditScore: 99,
    badge: "Revenue Titan",
    badgeColor: "#F59E0B",
  },
  {
    rank: 2,
    outletName: "Bangalore Indiranagar",
    revenue: 185000,
    growth: 14.2,
    nps: 92,
    auditScore: 97,
    badge: "Audit Sentinel",
    badgeColor: "#3B82F6",
  },
  {
    rank: 3,
    outletName: "Pune HQ Outlet",
    revenue: 154000,
    growth: 12.1,
    nps: 94,
    auditScore: 98,
    badge: "Zero Waste Champion",
    badgeColor: "#10B981",
  },
  {
    rank: 4,
    outletName: "Hyderabad Cyberabad",
    revenue: 142000,
    growth: 9.8,
    nps: 89,
    auditScore: 94,
    badge: "Customer Favorite",
    badgeColor: "#8B5CF6",
  },
  {
    rank: 5,
    outletName: "Nashik Outlet",
    revenue: 88000,
    growth: 3.5,
    nps: 81,
    auditScore: 88,
    badge: "Rising Star",
    badgeColor: "#EC4899",
  },
];

interface LeaderboardCardProps {
  accentColor?: string;
  theme?: any;
}

export default function LeaderboardCard({ accentColor = "#3B82F6", theme }: LeaderboardCardProps) {
  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div
      className="rounded-xl border p-5 transition-all shadow-xl"
      style={{ background: bgCard, borderColor: borderCol }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} color="#F59E0B" />
          <h3 className="text-base font-bold" style={{ color: textColor }}>
            Franchise Outlet Leaderboard & Achievement Badges
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10 font-bold">
          Monthly Performance Ranking
        </span>
      </div>

      <div className="space-y-3">
        {LEADERBOARD_DATA.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01]"
            style={{
              background: entry.rank === 1 ? "#F59E0B0F" : "#06070940",
              borderColor: entry.rank === 1 ? "#F59E0B40" : borderCol,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                style={{
                  background:
                    entry.rank === 1
                      ? "#F59E0B"
                      : entry.rank === 2
                      ? "#94A3B8"
                      : entry.rank === 3
                      ? "#B45309"
                      : borderCol,
                  color: "#0F172A",
                }}
              >
                #{entry.rank}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold" style={{ color: textColor }}>
                    {entry.outletName}
                  </h4>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      background: `${entry.badgeColor}20`,
                      color: entry.badgeColor,
                      borderColor: `${entry.badgeColor}40`,
                    }}
                  >
                    {entry.badge}
                  </span>
                </div>
                <div className="text-xs flex items-center gap-3 mt-0.5" style={{ color: textMuted }}>
                  <span>Revenue: <strong className="text-slate-200">₹{entry.revenue.toLocaleString("en-IN")}</strong></span>
                  <span>Growth: <strong className="text-emerald-400">+{entry.growth}%</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-[10px] text-slate-400">NPS Rating</div>
                <div className="text-xs font-bold text-emerald-400">{entry.nps}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Audit Score</div>
                <div className="text-xs font-bold" style={{ color: accentColor }}>
                  {entry.auditScore}/100
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
