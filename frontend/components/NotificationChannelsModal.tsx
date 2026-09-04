"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Radio,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send
} from "lucide-react";
import {
  getVapidPublicKey,
  registerPushSubscription,
  fetchNotificationRules,
  NotificationRule
} from "../lib/notificationApi";

interface NotificationChannelsModalProps {
  t: any;
  accent: string;
}

export default function NotificationChannelsModal({ t, accent }: NotificationChannelsModalProps) {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>("Checking status...");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    // Check browser notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setPushEnabled(true);
        setPushStatus("Web Push Enabled");
      } else if (Notification.permission === "denied") {
        setPushStatus("Push Notifications Blocked by Browser");
      } else {
        setPushStatus("Web Push Available (Not subscribed)");
      }
    }

    // Load active routing rules from Member 1
    fetchNotificationRules().then(setRules);
  }, []);

  const handleEnablePush = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Push notifications are not supported by this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("Permission Denied");
        return;
      }

      const vapidKey = await getVapidPublicKey();
      if (!vapidKey) {
        alert("VAPID public key could not be retrieved from backend.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });

      const success = await registerPushSubscription(subscription);
      if (success) {
        setPushEnabled(true);
        setPushStatus("Subscribed & Active");
      }
    } catch (err) {
      console.error("Push registration error:", err);
      setPushStatus("Registration Failed");
    }
  };

  const handleSendTestPush = async () => {
    try {
      await fetch("http://localhost:5000/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "OmniFranchise Push Test",
          message: "Web Push Notification channel is operational and delivering in real-time.",
          url: "/dashboard"
        })
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    } catch (err) {
      alert("Failed to send test push notification.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
        <h3 className="text-base font-bold flex items-center gap-2 mb-1" style={{ color: t.text }}>
          <Radio size={18} color={accent} /> Multi-Channel Gateway Configuration
        </h3>
        <p className="text-xs" style={{ color: t.textMuted }}>
          Control real-time dispatch across Web Push, Nodemailer SMTP, and MSG91 SMS gateways.
        </p>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Web Push */}
          <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: t.panel, borderColor: t.border }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={18} color={accent} />
                  <span className="font-semibold text-xs" style={{ color: t.text }}>Web Push (PWA)</span>
                </div>
                {pushEnabled ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="text-amber-400" />
                )}
              </div>
              <p className="text-[11px]" style={{ color: t.textFaint }}>
                Instant desktop & mobile OS lockscreen alerts for critical operational anomalies.
              </p>
              <p className="text-[10px] font-mono text-teal-400">{pushStatus}</p>
            </div>

            <div className="pt-4 flex items-center gap-2">
              {!pushEnabled ? (
                <button
                  onClick={handleEnablePush}
                  className="w-full py-2 text-xs font-semibold rounded-lg text-white shadow-sm cursor-pointer"
                  style={{ background: accent }}
                >
                  Enable Web Push
                </button>
              ) : (
                <button
                  onClick={handleSendTestPush}
                  className="w-full py-1.5 text-xs font-medium rounded-lg border border-teal-500/30 text-teal-400 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-teal-500/10"
                >
                  <Send size={12} /> {testSent ? "Alert Dispatched!" : "Send Test Push"}
                </button>
              )}
            </div>
          </div>

          {/* Email Channel */}
          <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: t.panel, borderColor: t.border }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-400" />
                  <span className="font-semibold text-xs" style={{ color: t.text }}>Nodemailer SMTP</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Active</span>
              </div>
              <p className="text-[11px]" style={{ color: t.textFaint }}>
                HTML executive digest, inventory replenishment POs, and daily compliance summaries.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t" style={{ borderColor: t.border }}>
              <span className="text-xs" style={{ color: t.textMuted }}>Email Dispatch</span>
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="cursor-pointer accent-teal-500"
              />
            </div>
          </div>

          {/* SMS Channel */}
          <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: t.panel, borderColor: t.border }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className="text-purple-400" />
                  <span className="font-semibold text-xs" style={{ color: t.text }}>MSG91 SMS Gateway</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Configured</span>
              </div>
              <p className="text-[11px]" style={{ color: t.textFaint }}>
                High-priority emergency SMS sent to outlet managers for critical temperature or stock spikes.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t" style={{ borderColor: t.border }}>
              <span className="text-xs" style={{ color: t.textMuted }}>SMS Alerts</span>
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="cursor-pointer accent-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Automated Channel Routing Rules Table */}
      <div className="rounded-xl border p-5" style={{ background: t.card, borderColor: t.border }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.text }}>
          <ShieldCheck size={16} color={accent} /> Automated Dispatch Rules (Member 1 Rule Engine)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: t.border, color: t.textFaint }}>
                <th className="pb-2">Event Trigger</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Dispatched Channels</th>
                <th className="pb-2">SLA Time</th>
                <th className="pb-2">Auto-Escalate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.border }}>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-xs" style={{ color: t.textMuted }}>
                    Defaulting to enterprise policy rules.
                  </td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.rule_id} style={{ color: t.text }}>
                    <td className="py-2.5 font-medium">{r.event_type}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] font-mono" style={{ color: t.textMuted }}>
                      {Array.isArray(r.channels) ? r.channels.join(", ") : String(r.channels)}
                    </td>
                    <td className="py-2.5 font-mono">{r.sla_minutes} mins</td>
                    <td className="py-2.5">
                      {r.auto_escalate ? (
                        <span className="text-emerald-400 font-medium">Enabled</span>
                      ) : (
                        <span style={{ color: t.textFaint }}>Disabled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}