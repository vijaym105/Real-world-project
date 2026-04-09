// frontend/src/hooks/useNotifications.js
// Call this hook once in your app to set up push notifications

import { useState, useEffect } from "react";
import api from "../api/axios.js";

// Convert VAPID public key from base64 to Uint8Array
// (required by the browser's push subscription API)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function useNotifications() {
  const [permission,  setPermission]  = useState(Notification.permission);
  const [subscribed,  setSubscribed]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // Check if already subscribed on mount
  useEffect(() => {
    checkExistingSubscription();
  }, []);

  async function checkExistingSubscription() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    } catch {}
  }

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setError("Push notifications not supported in this browser");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
        
      // 1. Register the service worker
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;  

      // 2. Ask user for permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setError("Notification permission denied");
        return false;
      }

      // 3. Get VAPID public key from backend
      const { data } = await api.get("/reminders/vapid-key");
      console.log(data)
      // 4. Subscribe to push
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      // 5. Send subscription to backend to save in MongoDB
      await api.post("/reminders/subscribe", { subscription });

      setSubscribed(true);
      return true;
    } catch (err) {
      setError(err.message || "Failed to subscribe");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await api.post("/reminders/unsubscribe", { endpoint: sub.endpoint });
      }
      setSubscribed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { permission, subscribed, loading, error, subscribe, unsubscribe };
}
