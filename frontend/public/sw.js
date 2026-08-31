// OmniFranchise Enterprise Service Worker v3.0
//
// CRITICAL: This SW immediately self-destructs in development mode.
// In dev, Next.js HMR changes JS chunk hashes on every save/refresh.
// Caching those chunks causes stale-asset bugs that require clearing
// browser data to fix. The SW must NEVER cache anything in dev.

const CACHE_NAME = "omnifranchise-v3";

// Only cache truly static assets that never change between deploys.
// Deliberately excludes: /, /_next/*, /api/* — all dynamic in Next.js.
const STATIC_ASSETS = [
  "/manifest.json",
  "/logo.png",
];

// ─── Dev-mode self-destruct ───────────────────────────────────────────────────
// The PWAInstaller sends a "x-sw-env" header on registration.
// But more reliably: localhost is always dev, so we check the SW's own URL.
const IS_DEV = self.location.hostname === "localhost" ||
               self.location.hostname === "127.0.0.1" ||
               self.location.port !== "";

if (IS_DEV) {
  // In dev: wipe all caches and unregister this SW immediately on install.
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.skipWaiting())
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      // Unregister self so the SW is completely gone after this activation.
      // Next refresh will have zero SW interference.
      self.registration.unregister().then(() => {
        console.log("[SW] Dev mode: Service Worker unregistered itself. No caching active.");
      })
    );
  });

  // In dev, pass ALL fetches straight through — never intercept.
  // (No fetch listener registered means the browser handles everything natively.)

} else {
  // ─── Production mode ───────────────────────────────────────────────────────

  // Install: cache only the small set of truly static assets.
  // skipWaiting() runs AFTER cache is ready (not synchronously before),
  // preventing the mid-load tab-claim reload loop in Chrome.
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn("[SW] Cache addAll warning:", err);
        }))
        .then(() => self.skipWaiting())
    );
  });

  // Activate: delete old caches only. No clients.claim() — that forces
  // Chrome to reload all controlled tabs immediately, which restarted the
  // background video and blocked the login screen from mounting.
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
    );
  });

  // Fetch: stale-while-revalidate for static assets only.
  // NEVER cache: Next.js chunks (_next/), API calls, or HTML pages.
  self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // Skip: Next.js internal chunks (change every build), API routes, HTML
    if (
      url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/api/") ||
      url.pathname === "/" ||
      event.request.headers.get("accept")?.includes("text/html")
    ) {
      return; // Let browser handle natively — no SW interception
    }

    // Only intercept known static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  });

  // Push Notification Event Listener
  self.addEventListener("push", (event) => {
    let data = { title: "OmniFranchise Alert", body: "Critical inventory or outlet status update." };
    if (event.data) {
      try { data = event.data.json(); }
      catch (e) { data = { title: "OmniFranchise Alert", body: event.data.text() }; }
    }
    const options = {
      body: data.body,
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/" },
      actions: [
        { action: "explore", title: "View Dashboard" },
        { action: "close",   title: "Dismiss" }
      ]
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  });

  // Notification Click Event Listener
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === targetUrl && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
    );
  });
}
