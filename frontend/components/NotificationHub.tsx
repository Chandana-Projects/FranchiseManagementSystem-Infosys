"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  PlusCircle,
  Radio,
  FileCheck
} from "lucide-react";
import {
  NotificationItem,
  NotificationStats,
  fetchNotifications,
  fetchNotificationStats,
  acknowledgeNotification,
  markNotificationAsRead
} from "../lib/notificationApi";

interface NotificationHubProps {
  t: any;
  accent: string;
  onOpenActionPlanWithData?: (planData: { title: string; description: string; outlet_id?: number; notification_id?: number }) => void;
}

export default function NotificationHub({
  t,
  accent,
  onOpenActionPlanWithData
}: NotificationHubProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    acknowledged: 0,
    escalated: 0,
    ack_rate_percent: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterChannel, setFilterChannel] = useState<string>("all");

  const loadNotifications = async () => {
    setLoading(true);
    const [list, metrics] = await Promise.all([
      fetchNotifications({ priority: filterPriority, channel: filterChannel }),
      fetchNotificationStats()
    ]);
    setNotifications(list);
    setStats(metrics);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [filterPriority, filterChannel]);

  const handleAcknowledge = async (id: number) => {
    const success = await acknowledgeNotification(id);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_acknowledged: true } : n))
      );
    }
  };

  const handleMarkRead = async (id: number) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
  };

  // Helper to calculate SLA status
  const getSlaBadge = (item: NotificationItem) => {
    if (item.is_acknowledged) {
      return (
        <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
          <FileCheck size={12} /> SLA Met (Acknowledged)
        </span>
      );
    }

    if (item.escalated) {
      return (
        <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
          <AlertTriangle size={12} /> SLA Breached · Escalated
        </span>
      );
    }

    const createdTime = new Date(item.created_at).getTime();
    const elapsedMinutes = Math.floor((Date.now() - createdTime) / (60 * 1000));
    const remaining = Math.max(0, (item.sla_minutes || 30) - elapsedMinutes);

    if (remaining === 0) {
      return (
        <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
          <Clock size={12} /> SLA Overdue
        </span>
      );
    }

    return (
      <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1">
        <Clock size={12} /> {remaining}m SLA remaining
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: t.textMuted }}>Delivered Alerts</span>
            <Bell size={16} color={accent} />
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: t.text }}>{stats.total}</p>
          <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>{stats.unread} unread</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: t.textMuted }}>Acknowledgement Rate</span>
            <CheckCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-400">{stats.ack_rate_percent}%</p>
          <p className="text-[11px] mt-1 text-emerald-400/70">{stats.acknowledged} acknowledged</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: t.textMuted }}>SLA Escalations</span>
            <ShieldAlert size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-rose-400">{stats.escalated}</p>
          <p className="text-[11px] mt-1 text-rose-400/70">Escalated to HQ Admin</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: t.textMuted }}>Channel Status</span>
            <Radio size={16} color={accent} />
          </div>
          <p className="text-base font-bold mt-2 text-teal-400">4 Active Channels</p>
          <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Push · Email · SMS · SSE</p>
        </div>
      </div>

      {/* Filter HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: t.textMuted }}>Priority:</span>
          {["all", "critical", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className="text-xs px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer"
              style={{
                background: filterPriority === p ? `${accent}20` : "transparent",
                color: filterPriority === p ? accent : t.textMuted,
                border: filterPriority === p ? `1px solid ${accent}50` : "1px solid transparent"
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: t.textMuted }}>Channel:</span>
          {["all", "push", "email", "sms", "sse"].map((c) => (
            <button
              key={c}
              onClick={() => setFilterChannel(c)}
              className="text-xs px-2.5 py-1 rounded-md uppercase transition-colors cursor-pointer"
              style={{
                background: filterChannel === c ? `${accent}20` : "transparent",
                color: filterChannel === c ? accent : t.textMuted,
                border: filterChannel === c ? `1px solid ${accent}50` : "1px solid transparent"
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Cards */}
      {loading ? (
        <div className="p-8 text-center text-xs" style={{ color: t.textMuted }}>Refreshing live alert ledger...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <CheckCheck size={36} className="mx-auto mb-2 text-emerald-400/50" />
          <p className="font-semibold text-sm" style={{ color: t.text }}>No Alerts In Ledger</p>
          <p className="text-xs mt-1" style={{ color: t.textMuted }}>All operational parameters are currently within normal thresholds.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const isCritical = item.priority === "critical" || item.priority === "high";
            return (
              <div
                key={item.notification_id}
                onClick={() => !item.is_read && handleMarkRead(item.notification_id)}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !item.is_read ? "border-l-4" : ""
                }`}
                style={{
                  background: t.card,
                  borderColor: t.border,
                  borderLeftColor: !item.is_read ? accent : t.border
                }}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.priority}
                    </span>

                    {item.channel && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {item.channel}
                      </span>
                    )}

                    {getSlaBadge(item)}

                    {item.outlets && (
                      <span className="text-[11px]" style={{ color: t.textFaint }}>
                        · {item.outlets.outlet_name}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold" style={{ color: t.text }}>{item.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{item.message}</p>
                  <p className="text-[10px]" style={{ color: t.textFaint }}>
                    {new Date(item.created_at).toLocaleTimeString()} · {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!item.is_acknowledged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(item.notification_id);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <CheckCheck size={14} /> Acknowledge
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenActionPlanWithData) {
                        onOpenActionPlanWithData({
                          title: `Corrective Action: ${item.title}`,
                          description: `Triggered by notification #${item.notification_id}: ${item.message}`,
                          outlet_id: item.outlet_id || 1,
                          notification_id: item.notification_id
                        });
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-white/5"
                    style={{ borderColor: t.border, color: t.text }}
                    title="Generate an Action Plan task from this notification"
                  >
                    <PlusCircle size={14} color={accent} /> Create Action Plan
                  </button>

                  {item.deep_link_url && (
                    <a
                      href={item.deep_link_url}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      title="Navigate to resource"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}