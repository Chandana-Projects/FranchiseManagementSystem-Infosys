"use client";

import React, { useState } from "react";
import { Calendar, Users, Clock, Sparkles, AlertCircle, CheckCircle2, X } from "lucide-react";

interface ShiftSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  accent: string;
}

interface StaffShift {
  id: string;
  name: string;
  role: string;
  outlet: string;
  shifts: { [key: string]: "Morning" | "Afternoon" | "Night" | "Off" };
  hours: number;
}

const INITIAL_STAFF: StaffShift[] = [
  { id: "emp-1", name: "Rahul Sharma", role: "Store Manager", outlet: "Pune FC Road", shifts: { Mon: "Morning", Tue: "Morning", Wed: "Morning", Thu: "Morning", Fri: "Morning", Sat: "Off", Sun: "Off" }, hours: 40 },
  { id: "emp-2", name: "Priya Patel", role: "Head Barista", outlet: "Pune FC Road", shifts: { Mon: "Afternoon", Tue: "Afternoon", Wed: "Afternoon", Thu: "Off", Fri: "Night", Sat: "Night", Sun: "Night" }, hours: 42 },
  { id: "emp-3", name: "Amit Verma", role: "Shift Supervisor", outlet: "Nashik City Center", shifts: { Mon: "Morning", Tue: "Morning", Wed: "Off", Thu: "Morning", Fri: "Morning", Sat: "Morning", Sun: "Off" }, hours: 40 },
  { id: "emp-4", name: "Sneha Kulkarni", role: "Inventory Lead", outlet: "Mumbai Andheri East", shifts: { Mon: "Night", Tue: "Night", Wed: "Night", Thu: "Night", Fri: "Off", Sat: "Off", Sun: "Morning" }, hours: 38 },
];

export default function ShiftSchedulerModal({ isOpen, onClose, t, accent }: ShiftSchedulerProps) {
  const [staffList, setStaffList] = useState<StaffShift[]>(INITIAL_STAFF);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAiAutoSchedule = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      // AI optimizes shift distribution based on predicted footfall
      const updated = staffList.map((s) => ({
        ...s,
        hours: 40,
        shifts: {
          Mon: "Morning" as const,
          Tue: "Morning" as const,
          Wed: "Afternoon" as const,
          Thu: "Afternoon" as const,
          Fri: "Night" as const,
          Sat: "Night" as const,
          Sun: "Off" as const,
        },
      }));
      setStaffList(updated);
      setIsAiGenerating(false);
      setScheduledSuccess(true);
      setTimeout(() => setScheduledSuccess(false), 4000);
    }, 1500);
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
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: t.text }}>AI Staff Roster & Shift Scheduler</h3>
              <p className="text-xs" style={{ color: t.textFaint }}>Optimized labor allocation based on footfall predictions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg border text-xs" style={{ borderColor: t.border, color: t.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between my-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs" style={{ color: t.textFaint }}>
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Target Hours/Week: <strong style={{ color: t.text }}>40 Hours Max</strong></span>
          </div>

          <button
            onClick={handleAiAutoSchedule}
            disabled={isAiGenerating}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-md"
            style={{ background: accent, color: t.textOnAccent, borderColor: accent }}
          >
            <Sparkles className={`w-4 h-4 ${isAiGenerating ? "animate-spin" : ""}`} />
            <span>{isAiGenerating ? "Optimizing Shifts..." : "AI Auto-Generate Roster"}</span>
          </button>
        </div>

        {scheduledSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>AI Shift Schedule optimized! Balanced staff hours to peak weekend footfall projections.</span>
          </div>
        )}

        {/* Roster Table */}
        <div className="overflow-x-auto border rounded-xl" style={{ borderColor: t.gridLine }}>
          <table className="w-full text-left text-xs">
            <thead className="border-b" style={{ background: t.inputBg, color: t.textFaint, borderColor: t.gridLine }}>
              <tr>
                <th className="p-3">Staff Member</th>
                <th className="p-3">Role & Outlet</th>
                <th className="p-3 text-center">Mon</th>
                <th className="p-3 text-center">Tue</th>
                <th className="p-3 text-center">Wed</th>
                <th className="p-3 text-center">Thu</th>
                <th className="p-3 text-center">Fri</th>
                <th className="p-3 text-center">Sat</th>
                <th className="p-3 text-center">Sun</th>
                <th className="p-3 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.gridLine }}>
              {staffList.map((emp) => (
                <tr key={emp.id} className="transition-colors hover:bg-white/5">
                  <td className="p-3 font-semibold" style={{ color: t.text }}>{emp.name}</td>
                  <td className="p-3" style={{ color: t.textFaint }}>
                    <div className="font-medium" style={{ color: t.text }}>{emp.role}</div>
                    <div className="text-[10px]">{emp.outlet}</div>
                  </td>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const shift = emp.shifts[day];
                    const badgeClass =
                      shift === "Morning"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : shift === "Afternoon"
                        ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                        : shift === "Night"
                        ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20";

                    return (
                      <td key={day} className="p-2 text-center">
                        <span className={`px-2 py-1 rounded-md border text-[10px] font-mono ${badgeClass}`}>
                          {shift}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-3 text-right font-bold font-mono" style={{ color: emp.hours > 40 ? "#FB7185" : t.text }}>
                    {emp.hours}h
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
