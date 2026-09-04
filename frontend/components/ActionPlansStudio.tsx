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