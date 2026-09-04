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