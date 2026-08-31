// OmniFranchise Enterprise Service Worker v1.0
const CACHE_NAME = "omnifranchise-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Cache addAll warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
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
