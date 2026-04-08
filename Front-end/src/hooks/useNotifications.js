// frontend/src/hooks/useNotifications.js
// Fixed: better error messages, VAPID key check, SW registration debug

import { useState, useEffect } from "react";
import api from "../api/axios.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export function useNotifications() {
  const [permission,  setPermission]  = useState(() =>
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [subscribed,  setSubscribed]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // Check if already subscribed when component mounts
  useEffect(() => {
    checkExisting();
  }, []);

  async function checkExisting() {
    if (!isSupported()) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    } catch (e) {
      console.warn("SW check failed:", e);
    }
  }

  function isSupported() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }

  async function subscribe() {
    setLoading(true);
    setError(null);

    // 1. Check browser support
    if (!isSupported()) {
      setError("Push notifications are not supported in this browser. Try Chrome on desktop or Android.");
      setLoading(false);
      return false;
    }

    try {
      // 2. Register service worker — must be at /sw.js (in public/ folder)
      console.log("Registering service worker...");
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      console.log("SW registered:", reg.scope);

      // 3. Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      console.log("Notification permission:", perm);

      if (perm !== "granted") {
        setError(
          perm === "denied"
            ? "Notifications are blocked. To fix: click the 🔒 icon in your browser address bar → allow notifications → refresh."
            : "Permission was dismissed. Click Enable again to allow."
        );
        setLoading(false);
        return false;
      }

      // 4. Get VAPID public key from backend
      console.log("Fetching VAPID key...");
      let vapidKey;
      try {
        const { data } = await api.get("/reminders/vapid-key");
        vapidKey = data.publicKey;
        if (!vapidKey) throw new Error("VAPID key missing from server response");
        console.log("VAPID key received ✓");
      } catch (e) {
        setError("Server error: could not get push key. Make sure VAPID_PUBLIC_KEY is set in backend .env");
        setLoading(false);
        return false;
      }

      // 5. Subscribe to push
      console.log("Subscribing to push...");
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      console.log("Push subscription created ✓");

      // 6. Save subscription to backend
      await api.post("/reminders/subscribe", { subscription });
      console.log("Subscription saved to server ✓");

      setSubscribed(true);
      setLoading(false);
      return true;

    } catch (err) {
      console.error("Subscribe error:", err);

      // Give helpful error messages for common failures
      let msg = err.message || "Failed to enable notifications";
      if (msg.includes("applicationServerKey"))
        msg = "Invalid VAPID key — regenerate keys with the command in .env.example";
      if (msg.includes("NetworkError") || msg.includes("Failed to fetch"))
        msg = "Could not reach server — make sure your backend is running";

      setError(msg);
      setLoading(false);
      return false;
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await api.post("/reminders/unsubscribe", { endpoint: sub.endpoint });
        }
      }
      setSubscribed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    permission,
    subscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
    isSupported: isSupported(),
  };
}
