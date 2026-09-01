"use client";

export interface SSENotificationSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 15 or 20 mins
  soundEnabled: boolean;
  lastNotifiedAt: number; // timestamp in ms
}

const STORAGE_KEY = "omni_sse_notification_settings";
const SETTINGS_EVENT = "omni_sse_settings_changed";

export const DEFAULT_SSE_SETTINGS: SSENotificationSettings = {
  enabled: false, // Default to disabled to stop unwanted notifications
  intervalMinutes: 15, // 15-20 mins gap between notifications
  soundEnabled: true,
  lastNotifiedAt: 0,
};

export function getSSESettings(): SSENotificationSettings {
  if (typeof window === "undefined") return DEFAULT_SSE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SSE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_SSE_SETTINGS.enabled,
      intervalMinutes: typeof parsed.intervalMinutes === "number" && parsed.intervalMinutes >= 1 ? parsed.intervalMinutes : DEFAULT_SSE_SETTINGS.intervalMinutes,
      soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : DEFAULT_SSE_SETTINGS.soundEnabled,
      lastNotifiedAt: typeof parsed.lastNotifiedAt === "number" ? parsed.lastNotifiedAt : 0,
    };
  } catch (err) {
    return DEFAULT_SSE_SETTINGS;
  }
}

export function saveSSESettings(updates: Partial<SSENotificationSettings>): SSENotificationSettings {
  if (typeof window === "undefined") return DEFAULT_SSE_SETTINGS;
  const current = getSSESettings();
  const next: SSENotificationSettings = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: next }));
  } catch (err) {
    console.warn("Failed to persist SSE settings", err);
  }
  return next;
}

export function canShowSSENotification(): boolean {
  const settings = getSSESettings();
  if (!settings.enabled) return false;
  const now = Date.now();
  const cooldownMs = settings.intervalMinutes * 60 * 1000;
  return now - settings.lastNotifiedAt >= cooldownMs;
}

export function recordSSENotificationShown(): void {
  saveSSESettings({ lastNotifiedAt: Date.now() });
}

export function getNextAvailableNotificationTime(): number {
  const settings = getSSESettings();
  if (!settings.lastNotifiedAt) return 0;
  const cooldownMs = settings.intervalMinutes * 60 * 1000;
  return settings.lastNotifiedAt + cooldownMs;
}
