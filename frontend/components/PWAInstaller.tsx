"use client";

import React, { useEffect, useState } from "react";
import { Bell, Download, Check, ShieldAlert } from "lucide-react";

interface PWAInstallerProps {
  t: any;
}

export default function PWAInstaller({ t }: PWAInstallerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // ── Development: actively remove any previously installed SW + caches ──
      // This is a one-time self-healing step so the user never needs to
      // manually clear browser data when running locally.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          reg.unregister();
          console.log("[PWA] Dev mode: unregistered SW →", reg.scope);
        });
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            caches.delete(key);
            console.log("[PWA] Dev mode: deleted cache →", key);
          });
        });
      }
    } else {
      // ── Production only: register the SW ──
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // Check Notification Permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // Capture PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("OmniFranchise Push Enabled", {
          body: "You will now receive real-time telemetry, stock reorder, and audit alerts.",
          icon: "/logo.png",
          badge: "/logo.png",
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* PWA Install Button */}
      {deferredPrompt && !isInstalled && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors shadow-sm"
          title="Install OmniFranchise Desktop/Mobile App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {/* Push Notification Toggle Button */}
      {notificationPermission !== "granted" ? (
        <button
          onClick={handleEnableNotifications}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 transition-colors shadow-sm"
          title="Enable Push Notifications"
        >
          <Bell className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Enable Alerts</span>
        </button>
      ) : (
        <span
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          title="Push Alerts Active"
        >
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Push Active</span>
        </span>
      )}
    </div>
  );
}
