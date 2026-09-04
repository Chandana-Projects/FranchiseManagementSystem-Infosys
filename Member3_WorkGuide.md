# Member 3 — Frontend Engineer & QA Lead
## Complete Work Guide

**Project**: FranchiseOpsAI (OmniFranchise) — Notification & Communication Module  
**Your Role**: Build all frontend UI views, components, modals, and API integrations for the Notification & Communication Module  
**Stack**: Next.js 16 (React 19) · TypeScript · Tailwind CSS · Framer Motion · Lucide React · Web Push API  
**Teammate Deliverables You Depend On**:
- **Member 1 (Abhishek)**: Notifications API (`/api/notifications`), Escalations API (`/api/escalations`), Notification Rules API (`/api/notification-rules`)
- **Member 2 (Chandana)**: Action Plans API (`/api/action-plans`), Web Push API (`/api/push`)

---

## 🎯 Executive Overview & What You Are Building

The **Notification & Communication Module** transforms static mock notifications into a real-time, multi-channel operational hub. As Member 3, you are responsible for the entire user experience:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        🔔 NOTIFICATION & COMMUNICATION MODULE                          │
├──────────────────────────────┬─────────────────────────────┬───────────────────────────┤
│   TAB 1: Live Alerts & SLA   │    TAB 2: Action Plans      │  TAB 3: Channels & Rules  │
│   Ledger                     │    Studio                   │  Settings                 │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ • Dynamic alerts from API    │ • Kanban/Table plan tracker │ • Web Push enable/disable │
│ • Priority & channel filters │ • Stats (Open/Resolved/SLA) │ • Email & SMS toggles     │
│ • Real-time SLA countdown    │ • Create Action Plan modal  │ • Notification rules view │
│ • 1-Click Acknowledge button │ • Update status & evidence  │ • Frequency & sound HUD   │
│ • "Create Action Plan" link  │ • 1-click resolve button    │ • Test push notification  │
└──────────────────────────────┴─────────────────────────────┴───────────────────────────┘
```

---

## 📋 Teammate API Contracts (Ready for You to Consume)

Both Member 1 and Member 2 have deployed and tested their backend endpoints. You can call these directly:

### 1. Notifications & Escalations (from Member 1)
| Method | Endpoint | Purpose | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/notifications` | Fetch notifications list | `?outlet_id=&priority=&channel=&recipient_role=&limit=&offset=` |
| `GET` | `/api/notifications/stats` | Fetch notification volume & ack metrics | Returns `{ total, unread, acknowledged, escalated, ack_rate }` |
| `POST` | `/api/notifications` | Create & route a new notification | Body: `{ outlet_id, title, message, priority, channel, sla_minutes }` |
| `PATCH` | `/api/notifications/:id/ack` | Acknowledge notification (stops escalation) | None (auto-records user & timestamp) |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read | None |
| `GET` | `/api/escalations` | List escalated alerts | `?limit=&offset=` |
| `GET` | `/api/notification-rules` | List automated channel routing rules | None |

### 2. Action Plans & Web Push (from Member 2)
| Method | Endpoint | Purpose | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/action-plans` | List action plans | `?outlet_id=&status=&priority=&assigned_to=` |
| `GET` | `/api/action-plans/stats` | Action plan KPIs & SLA summary | Returns `{ total, open, in_progress, resolved, overdue, avg_resolution_hours }` |
| `POST` | `/api/action-plans` | Create a new action plan | Body: `{ title, description, outlet_id, priority, assigned_to, due_date, evidence_url }` |
| `PATCH` | `/api/action-plans/:id` | Update status, comments, or evidence | Body: `{ status, comments, evidence_url, priority }` |
| `DELETE` | `/api/action-plans/:id` | Delete or cancel an action plan | None |
| `GET` | `/api/push/vapid-key` | Fetch VAPID public key for browser push | None |
| `POST` | `/api/push/subscribe` | Register browser push subscription | Body: `{ subscription, user_id, outlet_id }` |
| `POST` | `/api/push/send` | Send test web push notification | Body: `{ title, message, url }` |

---

## 🚀 Your 5 Implementation Steps

```
Step 1: TypeScript Interfaces & API Client Services (`frontend/lib/notificationApi.ts`)
Step 2: Action Plans Studio Component (`frontend/components/ActionPlansStudio.tsx`)
Step 3: Web Push & Channel Preferences HUD (`frontend/components/NotificationChannelsModal.tsx`)
Step 4: Notifications Hub & SLA Tracker (`frontend/components/NotificationHub.tsx`)
Step 5: Integrate into `OutletMonitoring.tsx` & Verify TypeCheck (`npm run verify`)
```

---

## Step 1 — TypeScript Interfaces & API Client

Create the file: `frontend/lib/notificationApi.ts`

```typescript
/**
 * notificationApi.ts
 * Frontend API client for Notifications, Escalations, Action Plans, and Web Push.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Types ─────────────────────────────────────────────────────────────

export interface NotificationItem {
  notification_id: number;
  outlet_id?: number | null;
  title: string;
  message: string;
  notification_type?: string;
  channel?: "push" | "email" | "sms" | "sse" | string;
  priority: "low" | "medium" | "high" | "critical";
  is_read: boolean;
  is_acknowledged: boolean;
  acknowledged_at?: string | null;
  recipient_role?: string;
  recipient_user_id?: number | null;
  deep_link_url?: string;
  sla_minutes: number;
  escalated: boolean;
  escalated_at?: string | null;
  resolved: boolean;
  resolved_at?: string | null;
  created_at: string;
  outlets?: {
    outlet_id: number;
    outlet_name: string;
    city?: string;
  } | null;
}

export interface NotificationStats {
  total: number;
  unread: number;
  acknowledged: number;
  escalated: number;
  ack_rate_percent: number;
  by_priority?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ActionPlan {
  plan_id: number;
  notification_id?: number | null;
  outlet_id?: number | null;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "archived";
  assigned_to?: number | null;
  due_date?: string | null;
  created_by?: number | null;
  evidence_url?: string | null;
  comments?: string | null;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  outlets?: {
    outlet_id: number;
    outlet_name: string;
  } | null;
  assignee?: {
    user_id: number;
    name: string;
    email: string;
  } | null;
}

export interface ActionPlanStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  overdue: number;
  avg_resolution_hours: number;
}

export interface NotificationRule {
  rule_id: number;
  event_type: string;
  priority: string;
  channels: string[];
  sla_minutes: number;
  auto_escalate: boolean;
  is_active: boolean;
  created_at: string;
}

// ── Notifications API Methods ─────────────────────────────────────────

export async function fetchNotifications(params?: {
  outlet_id?: number;
  priority?: string;
  channel?: string;
  is_acknowledged?: boolean;
}): Promise<NotificationItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.outlet_id) query.append("outlet_id", String(params.outlet_id));
    if (params?.priority && params.priority !== "all") query.append("priority", params.priority.toLowerCase());
    if (params?.channel && params.channel !== "all") query.append("channel", params.channel.toLowerCase());
    if (params?.is_acknowledged !== undefined) query.append("is_acknowledged", String(params.is_acknowledged));

    const res = await fetch(`${API_BASE}/notifications?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("Falling back to local notifications:", err);
    return [];
  }
}

export async function fetchNotificationStats(): Promise<NotificationStats> {
  try {
    const res = await fetch(`${API_BASE}/notifications/stats`);
    if (!res.ok) throw new Error("Failed to fetch notification stats");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return { total: 0, unread: 0, acknowledged: 0, escalated: 0, ack_rate_percent: 0 };
  }
}

export async function acknowledgeNotification(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/notifications/${id}/ack`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markNotificationAsRead(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Action Plans API Methods ──────────────────────────────────────────

export async function fetchActionPlans(): Promise<ActionPlan[]> {
  try {
    const res = await fetch(`${API_BASE}/action-plans`);
    if (!res.ok) throw new Error("Failed to fetch action plans");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("Falling back to empty action plans:", err);
    return [];
  }
}

export async function fetchActionPlanStats(): Promise<ActionPlanStats> {
  try {
    const res = await fetch(`${API_BASE}/action-plans/stats`);
    if (!res.ok) throw new Error("Failed to fetch action plan stats");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return { total: 0, open: 0, in_progress: 0, resolved: 0, overdue: 0, avg_resolution_hours: 0 };
  }
}

export async function createActionPlan(payload: Partial<ActionPlan>): Promise<ActionPlan | null> {
  try {
    const res = await fetch(`${API_BASE}/action-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create action plan");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateActionPlan(id: number, payload: Partial<ActionPlan>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/action-plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteActionPlan(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/action-plans/${id}`, {
      method: "DELETE"
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Web Push & Rules API Methods ──────────────────────────────────────

export async function getVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/push/vapid-key`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.publicKey || json.publicKey || null;
  } catch {
    return null;
  }
}

export async function registerPushSubscription(subscription: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchNotificationRules(): Promise<NotificationRule[]> {
  try {
    const res = await fetch(`${API_BASE}/notification-rules`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}
```

---

## Step 2 — Action Plans Studio Component

Create the file: `frontend/components/ActionPlansStudio.tsx`

This component renders:
1. **Header KPI Cards**: Open Plans, In Progress, Resolved, SLA Overdue, Avg Resolution Time
2. **Status Filter Tabs**: All, Open, In Progress, Resolved
3. **Plan Cards**: Due date countdown, Assignee badge, Priority badge, Evidence links
4. **Create Action Plan Modal**: Interactive form with validation
5. **Quick-Resolve & Evidence Action**: Mark plan resolved with 1-click

```tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  Building2,
  Trash2,
  ArrowRight
} from "lucide-react";
import {
  ActionPlan,
  ActionPlanStats,
  fetchActionPlans,
  fetchActionPlanStats,
  createActionPlan,
  updateActionPlan,
  deleteActionPlan
} from "../lib/notificationApi";

interface ActionPlansStudioProps {
  t: any;
  accent: string;
  defaultOutletId?: number;
  initialNewPlan?: { title: string; description: string; outlet_id?: number; notification_id?: number } | null;
  onClearInitialPlan?: () => void;
}

export default function ActionPlansStudio({
  t,
  accent,
  defaultOutletId,
  initialNewPlan,
  onClearInitialPlan
}: ActionPlansStudioProps) {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [stats, setStats] = useState<ActionPlanStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    overdue: 0,
    avg_resolution_hours: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [formDueDate, setFormDueDate] = useState("");
  const [formEvidence, setFormEvidence] = useState("");
  const [formNotificationId, setFormNotificationId] = useState<number | undefined>(undefined);

  const loadData = async () => {
    setLoading(true);
    const [fetchedPlans, fetchedStats] = await Promise.all([
      fetchActionPlans(),
      fetchActionPlanStats()
    ]);
    setPlans(fetchedPlans);
    setStats(fetchedStats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle triggered creation from notification
  useEffect(() => {
    if (initialNewPlan) {
      setFormTitle(initialNewPlan.title);
      setFormDesc(initialNewPlan.description);
      setFormNotificationId(initialNewPlan.notification_id);
      setShowCreateModal(true);
      if (onClearInitialPlan) onClearInitialPlan();
    }
  }, [initialNewPlan]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await createActionPlan({
      title: formTitle,
      description: formDesc,
      priority: formPriority,
      outlet_id: defaultOutletId || 1,
      due_date: formDueDate || undefined,
      evidence_url: formEvidence || undefined,
      notification_id: formNotificationId,
      status: "open"
    });

    setFormTitle("");
    setFormDesc("");
    setFormEvidence("");
    setShowCreateModal(false);
    loadData();
  };

  const handleStatusChange = async (planId: number, nextStatus: "open" | "in_progress" | "resolved") => {
    await updateActionPlan(planId, { status: nextStatus });
    loadData();
  };

  const handleDelete = async (planId: number) => {
    if (confirm("Are you sure you want to delete this action plan?")) {
      await deleteActionPlan(planId);
      loadData();
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & New Plan Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: t.text }}>
            <ShieldAlert size={22} color={accent} /> Franchise Operational Action Plans
          </h2>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
            Track corrective operational tasks, SLA deadlines, assigned managers, and verification proof.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-md cursor-pointer transition-transform active:scale-95"
          style={{ background: accent, color: "#fff" }}
        >
          <Plus size={16} /> Create Action Plan
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: t.textMuted }}>Total Action Plans</span>
            <Clock size={16} color={accent} />
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: t.text }}>{stats.total}</p>
          <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>{stats.open} open · {stats.in_progress} in progress</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: t.textMuted }}>Resolved Plans</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-400">{stats.resolved}</p>
          <p className="text-[11px] mt-1 text-emerald-400/70">Verified & closed out</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: t.textMuted }}>SLA Overdue</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-rose-400">{stats.overdue}</p>
          <p className="text-[11px] mt-1 text-rose-400/70">Require immediate intervention</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: t.textMuted }}>Avg Resolution Speed</span>
            <UserCheck size={16} color={accent} />
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: t.text }}>{stats.avg_resolution_hours}h</p>
          <p className="text-[11px] mt-1" style={{ color: t.textFaint }}>Mean time to resolution</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: t.border }}>
        {[
          { id: "all", label: `All Plans (${plans.length})` },
          { id: "open", label: `Open (${plans.filter(p => p.status === "open").length})` },
          { id: "in_progress", label: `In Progress (${plans.filter(p => p.status === "in_progress").length})` },
          { id: "resolved", label: `Resolved (${plans.filter(p => p.status === "resolved").length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            style={{
              background: statusFilter === tab.id ? `${accent}20` : "transparent",
              color: statusFilter === tab.id ? accent : t.textMuted,
              border: statusFilter === tab.id ? `1px solid ${accent}50` : "1px solid transparent"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="p-8 text-center text-xs" style={{ color: t.textMuted }}>Loading action plans...</div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-12 text-center rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
          <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400/50" />
          <p className="font-semibold text-sm" style={{ color: t.text }}>No Action Plans Found</p>
          <p className="text-xs mt-1" style={{ color: t.textMuted }}>All corrective measures are currently resolved or none match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPlans.map((plan) => {
            const isCritical = plan.priority === "critical" || plan.priority === "high";
            return (
              <div
                key={plan.plan_id}
                className="p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ background: t.card, borderColor: t.border }}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {plan.priority}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                        plan.status === "resolved"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : plan.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                      }`}
                    >
                      {plan.status.replace("_", " ")}
                    </span>
                    {plan.due_date && (
                      <span className="text-[11px] flex items-center gap-1" style={{ color: t.textFaint }}>
                        <Clock size={12} /> Due: {new Date(plan.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold" style={{ color: t.text }}>{plan.title}</h4>
                  {plan.description && (
                    <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{plan.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] pt-1" style={{ color: t.textFaint }}>
                    {plan.outlets && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} /> {plan.outlets.outlet_name}
                      </span>
                    )}
                    {plan.evidence_url && (
                      <a
                        href={plan.evidence_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-teal-400 hover:underline"
                      >
                        <ExternalLink size={12} /> View Evidence Proof
                      </a>
                    )}
                  </div>
                </div>

                {/* Status Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {plan.status === "open" && (
                    <button
                      onClick={() => handleStatusChange(plan.plan_id, "in_progress")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer"
                      style={{ borderColor: accent, color: accent }}
                    >
                      Start Task <ArrowRight size={13} />
                    </button>
                  )}

                  {plan.status === "in_progress" && (
                    <button
                      onClick={() => handleStatusChange(plan.plan_id, "resolved")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 size={14} /> Mark Resolved
                    </button>
                  )}

                  {plan.status === "resolved" && (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 px-2 py-1">
                      <CheckCircle2 size={14} /> Closed
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(plan.plan_id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-500/10"
                    title="Delete Action Plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Action Plan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{ background: t.panel, borderColor: t.border }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold" style={{ color: t.text }}>Create Operational Action Plan</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Action Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Calibrate Deep Freezer #2 & Replace Thermocouple"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none font-medium"
                  style={{ background: t.card, borderColor: t.border, color: t.text }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Detailed Directives</label>
                <textarea
                  rows={3}
                  placeholder="Steps required by outlet staff to resolve and prevent recurrence..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none"
                  style={{ background: t.card, borderColor: t.border, color: t.text }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e: any) => setFormPriority(e.target.value)}
                    className="w-full p-2.5 rounded-lg border outline-none"
                    style={{ background: t.card, borderColor: t.border, color: t.text }}
                  >
                    <option value="critical">Critical (Immediate)</option>
                    <option value="high">High (24 Hours)</option>
                    <option value="medium">Medium (3 Days)</option>
                    <option value="low">Low (Routine)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>SLA Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border outline-none"
                    style={{ background: t.card, borderColor: t.border, color: t.text }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: t.textMuted }}>Evidence URL (Doc/Photo)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or cloud storage URL"
                  value={formEvidence}
                  onChange={(e) => setFormEvidence(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none"
                  style={{ background: t.card, borderColor: t.border, color: t.text }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                  style={{ borderColor: t.border, color: t.textMuted }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white shadow-md"
                  style={{ background: accent }}
                >
                  Confirm & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 3 — Web Push & Multi-Channel HUD

Create the file: `frontend/components/NotificationChannelsModal.tsx`

This component allows the franchise owner or manager to:
1. **Enable Browser Push Notifications** using Member 2's VAPID endpoint
2. **Toggle Channels**: Web Push, Email Notifications, SMS Alert Gateways
3. **View Active Notification Routing Rules** from Member 1's API

```tsx
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
```

---

## Step 4 — Upgraded Notifications Hub & SLA Tracker

Create the file: `frontend/components/NotificationHub.tsx`

This component replaces the static `notificationsList` with real backend data:
- **Filters**: By Priority (Critical, High, Medium, Low), Channel, and Acknowledged state
- **Real-Time SLA Countdown Badge**: Computes remaining minutes against `sla_minutes`
- **1-Click Acknowledge Button**: Halts automatic escalation
- **1-Click "Convert to Action Plan"**: Hands off the notification directly into Member 2's Action Plan engine!
- **Deep Linking Navigation**: Jumps user to specific outlet/dashboard views

```tsx
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
```

---

## Step 5 — Wire into `OutletMonitoring.tsx`

Now bring everything together in `frontend/components/OutletMonitoring.tsx`!

### 1. Add Imports at the top of `OutletMonitoring.tsx`:
```tsx
import NotificationHub from "./NotificationHub";
import ActionPlansStudio from "./ActionPlansStudio";
import NotificationChannelsModal from "./NotificationChannelsModal";
```

### 2. Add State inside `OutletMonitoring`:
```tsx
const [notificationTab, setNotificationTab] = useState<"alerts" | "plans" | "channels">("alerts");
const [handoffPlanData, setHandoffPlanData] = useState<{
  title: string;
  description: string;
  outlet_id?: number;
  notification_id?: number;
} | null>(null);
```

### 3. Replace the `active === "notifications"` block (around lines 6981–7086):

```tsx
          ) : active === "notifications" ? (
            <div className="space-y-6">
              {/* Notification Master Module Header & Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: t.border }}>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: t.text }}>Enterprise Notification & Action Center</h2>
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    Multi-channel routing (Push, Email, SMS), SLA escalation monitoring, and operational corrective action plans.
                  </p>
                </div>

                {/* Sub-Tab Navigation */}
                <div className="flex items-center gap-2 p-1 rounded-xl border" style={{ background: t.card, borderColor: t.border }}>
                  <button
                    onClick={() => setNotificationTab("alerts")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    style={{
                      background: notificationTab === "alerts" ? accent : "transparent",
                      color: notificationTab === "alerts" ? "#fff" : t.textMuted
                    }}
                  >
                    🔔 Live Alerts & SLA Ledger
                  </button>
                  <button
                    onClick={() => setNotificationTab("plans")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    style={{
                      background: notificationTab === "plans" ? accent : "transparent",
                      color: notificationTab === "plans" ? "#fff" : t.textMuted
                    }}
                  >
                    📋 Action Plans Studio
                  </button>
                  <button
                    onClick={() => setNotificationTab("channels")}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    style={{
                      background: notificationTab === "channels" ? accent : "transparent",
                      color: notificationTab === "channels" ? "#fff" : t.textMuted
                    }}
                  >
                    ⚡ Channel Delivery & Rules
                  </button>
                </div>
              </div>

              {/* Tab 1: Live Alerts & SLA Ledger */}
              {notificationTab === "alerts" && (
                <div className="space-y-6">
                  <SSENotificationControl t={t} accent={accent} />
                  <NotificationHub
                    t={t}
                    accent={accent}
                    onOpenActionPlanWithData={(data) => {
                      setHandoffPlanData(data);
                      setNotificationTab("plans");
                    }}
                  />
                </div>
              )}

              {/* Tab 2: Action Plans Studio */}
              {notificationTab === "plans" && (
                <ActionPlansStudio
                  t={t}
                  accent={accent}
                  defaultOutletId={selectedOutlet?.outlet_id || 1}
                  initialNewPlan={handoffPlanData}
                  onClearInitialPlan={() => setHandoffPlanData(null)}
                />
              )}

              {/* Tab 3: Channel Delivery & Rules */}
              {notificationTab === "channels" && (
                <NotificationChannelsModal t={t} accent={accent} />
              )}
            </div>
```

---

## 🧪 Verification & QA Checklist (For QA Lead)

After creating and integrating these components, run the verification commands:

```bash
# 1. Frontend TypeScript Typecheck
cd frontend
npm run verify

# 2. Start Dev Server to manually test UI
npm run dev
```

### Manual Test Flows to Verify:
- [ ] **Tab Switching**: Smooth switching between "Live Alerts & SLA Ledger", "Action Plans Studio", and "Channel Delivery & Rules"
- [ ] **SLA Countdown**: Verify SLA minutes badge displays and turns red if breached
- [ ] **Acknowledge**: Click "Acknowledge" on a notification card — badge immediately updates to "SLA Met"
- [ ] **Action Plan Handoff**: Click "Create Action Plan" on a notification card — opens Action Plans Studio with the form pre-filled
- [ ] **Create Action Plan**: Add a new plan — appears instantly in the Open plans list and stats counter increments
- [ ] **Resolve Action Plan**: Move from Open → In Progress → Mark Resolved — updates stats and changes badge to Closed
- [ ] **Web Push Subscription**: In "Channel Delivery & Rules", click "Enable Web Push" and verify permission prompt
- [ ] **Zero TypeScript Errors**: `npm run verify` passes with 0 errors

---

## 👥 Coordination Notes

- **Member 1 (Abhishek)**: Handed off the backend schemas, `/api/notifications`, `/api/escalations`, `/api/notification-rules`, and the SLA escalation cron job.
- **Member 2 (Chandana)**: Handed off the email, SMS, push services, and `/api/action-plans` CRUD routes.
- **Member 3 (Mamta)**: Completes the full frontend suite connecting the users directly to these multi-channel communication pipelines!
