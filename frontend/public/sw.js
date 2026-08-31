// OmniFranchise Enterprise Service Worker v2.0
const CACHE_NAME = "omnifranchise-v2";
const STATIC_ASSETS = [
  "/manifest.json",
  "/logo.png"
];

// Install Event — cache static assets first, THEN skip waiting.
// skipWaiting() is called AFTER the cache is primed so the SW is
// ready before it takes over. Do NOT call it synchronously before
// waitUntil() resolves — that causes Chrome to claim tabs mid-load
// and trigger a visible page reload / video restart loop.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Cache addAll warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — clean up old caches.
// clients.claim() is intentionally REMOVED. Calling it here forces
// Chrome to immediately reload every controlled tab when the SW
// activates, which restarted the background video and prevented the
// login screen from mounting. New tabs automatically use this SW.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Event - Stale while revalidate strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

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
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "OmniFranchise Alert", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: "/logo.png",
    badge: "/logo.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
    actions: [
      { action: "explore", title: "View Dashboard" },
      { action: "close", title: "Dismiss" }
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
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
