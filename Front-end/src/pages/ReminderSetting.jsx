// frontend/src/components/ReminderSettings.jsx
// Drop this anywhere in your app — best place is the Settings page
// Shows a toggle to enable/disable push notifications + reminder schedule

import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications.js";

const REMINDER_INFO = [
  { key: "water",    emoji: "💧", label: "Water Intake",    desc: "Remind me to drink water every 2 hours"  },
  { key: "calories", emoji: "🔥", label: "Calories",        desc: "Daily calorie goal check at 12pm & 6pm"  },
  { key: "bpm",      emoji: "❤️", label: "Heart Rate",      desc: "Log your BPM reading in the morning"     },
  { key: "sleep",    emoji: "⏰", label: "Sleep Reminder",  desc: "Bedtime reminder at your chosen time"     },
];

export default function ReminderSettings() {
  const { permission, subscribed, loading, error, subscribe, unsubscribe } = useNotifications();
  const [enabled, setEnabled] = useState({
    water: true, calories: true, bpm: true, sleep: true,
  });

  const isSupported = "serviceWorker" in navigator && "PushManager" in window;

  async function handleToggle() {
    if (subscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  }

  if (!isSupported) {
    return (
      <div className="reminder-settings reminder-settings--unsupported">
        <span>⚠️</span>
        <p>Push notifications are not supported in this browser. Try Chrome or Firefox on desktop/Android.</p>
      </div>
    );
  }

  return (
    <div className="reminder-settings">
      {/* Main enable toggle */}
      <div className="reminder-settings__header">
        <div className="reminder-settings__header-info">
          <h4 className="reminder-settings__title">Push Notifications</h4>
          <p className="reminder-settings__sub">
            {subscribed
              ? "✅ Notifications active — you'll get reminders on this device"
              : permission === "denied"
              ? "❌ Blocked — allow notifications in browser settings"
              : "Get reminders for water, calories, heart rate & sleep"}
          </p>
        </div>

        <button
          className={`reminder-settings__toggle ${subscribed ? "reminder-settings__toggle--on" : ""}`}
          onClick={handleToggle}
          disabled={loading || permission === "denied"}
        >
          {loading ? "..." : subscribed ? "ON" : "OFF"}
        </button>
      </div>

      {error && (
        <p className="reminder-settings__error">⚠️ {error}</p>
      )}

      {/* Individual reminder toggles — only shown when subscribed */}
      {subscribed && (
        <div className="reminder-settings__list">
          {REMINDER_INFO.map((r) => (
            <div key={r.key} className="reminder-settings__item">
              <span className="reminder-settings__item-emoji">{r.emoji}</span>
              <div className="reminder-settings__item-info">
                <span className="reminder-settings__item-label">{r.label}</span>
                <span className="reminder-settings__item-desc">{r.desc}</span>
              </div>
              <label className="reminder-settings__switch">
                <input
                  type="checkbox"
                  checked={enabled[r.key]}
                  onChange={(e) =>
                    setEnabled((prev) => ({ ...prev, [r.key]: e.target.checked }))
                  }
                />
                <span className="reminder-settings__switch-track">
                  <span className="reminder-settings__switch-thumb" />
                </span>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* How it works note */}
      <p className="reminder-settings__note">
        Reminders are sent from the server and appear even when the app is closed.
        You only need to enable this once per device.
      </p>
    </div>
  );
}
