// frontend/public/sw.js
// This file MUST be in the public/ folder so it's served at the root URL
// It runs in the background even when your app tab is closed

// Listen for push events from the server
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const title   = data.title   || "FitTrack Reminder";
  const options = {
    body:    data.body    || "Time to check your fitness goals!",
    icon:    data.icon    || "/icon.png",
    badge:   "/badge.png",
    tag:     data.tag     || "fittrack-reminder",   // replaces old notification of same tag
    vibrate: [100, 50, 100],
    data:    { url: data.url || "/" },
    actions: [
      { action: "open",    title: "Open App" },
      { action: "dismiss", title: "Dismiss"  },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "dismiss") return;

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/");
      }
    })
  );
});

// Activate immediately (don't wait for old SW to die)
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
