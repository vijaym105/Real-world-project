// frontend/src/pages/SettingsPage.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function SettingsPage() {
  const { dispatch } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);
  const [unit,          setUnit]          = useState("metric");
  const [waterGoal,     setWaterGoal]     = useState(3);
  const [calorieGoal,   setCalorieGoal]   = useState(2000);
  const [sleepGoal,     setSleepGoal]     = useState(8);
  const [saved,         setSaved]         = useState(false);

  function handleSave() {
    // Save to localStorage for now (can extend to backend later)
    localStorage.setItem("settings", JSON.stringify({
      notifications, darkMode, unit, waterGoal, calorieGoal, sleepGoal,
    }));
    setSaved(true);
    dispatch({ type: "SHOW_TOAST", payload: { message: "Settings saved! ✓", type: "success" } });
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <div className="page settings-page">
      <div className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__sub">Customize your FitTrack experience</p>
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
            <p className="settings-page__row-sub">Metric (kg/cm) or Imperial (lbs/inch)</p>
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

      {/* Daily goals */}
      <div className="card settings-page__section" style={{ marginTop: 16 }}>
        <h3 className="card__title">Daily Goals</h3>

        {[
          { label: "Water Goal (L)",       value: waterGoal,   setter: setWaterGoal,   min: 1, max: 10, step: 0.5 },
          { label: "Calories Goal (kcal)", value: calorieGoal, setter: setCalorieGoal, min: 500, max: 5000, step: 100 },
          { label: "Sleep Goal (hrs)",     value: sleepGoal,   setter: setSleepGoal,   min: 4, max: 12, step: 0.5 },
        ].map(g => (
          <div key={g.label} className="settings-page__goal-row">
            <div className="settings-page__goal-info">
              <span className="settings-page__row-label">{g.label}</span>
              <span className="settings-page__goal-val">{g.value}</span>
            </div>
            <input
              type="range"
              min={g.min} max={g.max} step={g.step}
              value={g.value}
              onChange={e => g.setter(parseFloat(e.target.value))}
              className="settings-page__slider"
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        className="btn btn--primary"
        style={{ marginTop: 20, width: "100%", padding: 14, borderRadius: 12, fontSize: 15 }}
        onClick={handleSave}
      >
        {saved ? "✅ Saved!" : "Save Settings"}
      </button>

      {/* Danger zone */}
      <div className="card settings-page__section settings-page__danger" style={{ marginTop: 20 }}>
        <h3 className="card__title" style={{ color: "#ff4d4f" }}>Account</h3>
        <div className="settings-page__row">
          <div>
            <p className="settings-page__row-label">Log out</p>
            <p className="settings-page__row-sub">Sign out of your account</p>
          </div>
          <button className="btn btn--outline" style={{ borderColor: "#ff4d4f !important", color: "#ff4d4f" }} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
