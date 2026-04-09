// frontend/src/pages/SettingsPage.jsx

import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import ReminderSettings from "./ReminderSettings.jsx";


export default function SettingsPage() {
  const { state, dispatch } = useApp();

  // Pre-fill from global goals state (so sliders always show saved values)
  const [notifications, setNotifications] = useState(true);
  const [unit,          setUnit]          = useState("metric");
  const [waterGoal,     setWaterGoal]     = useState(state.goals.water);
  const [calorieGoal,   setCalorieGoal]   = useState(state.goals.calories);
  const [sleepGoal,     setSleepGoal]     = useState(state.goals.sleep);
  const [bpmGoal,       setBpmGoal]       = useState(state.goals.bpm);
  const [saved,         setSaved]         = useState(false);

  function handleSave() {
    // Push goals into global state → Stats page reads from state.goals
    dispatch({
      type: "SET_GOALS",
      payload: {
        water:    waterGoal,
        calories: calorieGoal,
        sleep:    sleepGoal,
        bpm:      bpmGoal,
      },
    });

    // Also save preferences
    localStorage.setItem("fittrack_prefs", JSON.stringify({ notifications, unit }));

    setSaved(true);
    dispatch({
      type: "SHOW_TOAST",
      payload: { message: "Goals saved! Stats page is now updated ✓", type: "success" },
    });
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  const goalSliders = [
    {
      key:    "water",
      label:  "Daily Water Goal",
      unit:   "L",
      value:  waterGoal,
      setter: setWaterGoal,
      min: 1, max: 10, step: 0.5,
      color:  "#4fc3f7",
      emoji:  "💧",
    },
    {
      key:    "calories",
      label:  "Daily Calorie Goal",
      unit:   "kcal",
      value:  calorieGoal,
      setter: setCalorieGoal,
      min: 500, max: 5000, step: 100,
      color:  "#c6f135",
      emoji:  "🔥",
    },
    {
      key:    "sleep",
      label:  "Daily Sleep Goal",
      unit:   "hrs",
      value:  sleepGoal,
      setter: setSleepGoal,
      min: 4, max: 12, step: 0.5,
      color:  "#9c88ff",
      emoji:  "⏰",
    },
    {
      key:    "bpm",
      label:  "Resting BPM Target",
      unit:   "bpm",
      value:  bpmGoal,
      setter: setBpmGoal,
      min: 40, max: 120, step: 1,
      color:  "#ff6b6b",
      emoji:  "❤️",
    },
  ];

  return (
    <div className="page settings-page">
      <div className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__sub">Changes are applied to your Stats page instantly</p>
      </div>

      {/* Preferences */}
      <div className="card settings-page__section">
        <h3 className="card__title">Preferences</h3>

        <div className="settings-page__row">
          <div>
            <p className="settings-page__row-label">Notifications</p>
            <p className="settings-page__row-sub">Daily reminders to log your stats</p>
          </div>
          <label className="settings-page__toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
            />
            <span className="settings-page__toggle-track">
              <span className="settings-page__toggle-thumb" />
            </span>
          </label>
        </div>

        <div className="settings-page__divider" />

        <div className="settings-page__row">
          <div>
            <p className="settings-page__row-label">Unit System</p>
            <p className="settings-page__row-sub">Metric (kg/cm) or Imperial (lbs/in)</p>
          </div>
          <select
            className="settings-page__select"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>
      </div>

      {/* Daily Goals — connected to Stats page */}
      <div className="card settings-page__section" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 className="card__title" style={{ margin: 0 }}>Daily Goals</h3>
          <span style={{ fontSize: 11, color: "#888", background: "#f0f4f8", padding: "3px 10px", borderRadius: 20 }}>
            Synced with Stats page
          </span>
        </div>

        {goalSliders.map(g => (
          <div key={g.key} className="settings-page__goal-row">
            <div className="settings-page__goal-info">
              <span className="settings-page__row-label">
                {g.emoji} {g.label}
              </span>
              <span
                className="settings-page__goal-val"
                style={{ color: g.color, fontWeight: 700 }}
              >
                {g.value} {g.unit}
              </span>
            </div>
            <input
              type="range"
              min={g.min} max={g.max} step={g.step}
              value={g.value}
              onChange={e => g.setter(parseFloat(e.target.value))}
              className="settings-page__slider"
              style={{ accentColor: g.color }}
            />
            <div className="settings-page__goal-range">
              <span>{g.min} {g.unit}</span>
              <span>{g.max} {g.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Push Notifications */}
      <div className="card settings-page__section" style={{ marginTop: 16 }}>
        <h3 className="card__title">Push Reminders</h3>
        <ReminderSettings />
      </div>

      {/* Save */}
      <button
        className="btn btn--primary"
        style={{ marginTop: 20, width: "100%", padding: 14, borderRadius: 12, fontSize: 15 }}
        onClick={handleSave}
      >
        {saved ? "✅ Goals Saved & Synced!" : "Save Settings"}
      </button>

      {/* Account */}
      <div className="card settings-page__section settings-page__danger" style={{ marginTop: 20 }}>
        <h3 className="card__title" style={{ color: "#ff4d4f" }}>Account</h3>
        <div className="settings-page__row">
          <div>
            <p className="settings-page__row-label">Log out</p>
            <p className="settings-page__row-sub">Sign out of your account on this device</p>
          </div>
          <button
            className="btn btn--outline"
            style={{ color: "#ff4d4f", borderColor: "#ff4d4f" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
