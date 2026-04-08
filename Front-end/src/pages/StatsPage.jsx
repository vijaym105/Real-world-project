// frontend/src/pages/StatsPage.jsx
// Goals come from state.goals (set in Settings page)

import { useApp } from "../context/AppContext.jsx";
import { updateStats } from "../api/axios.js";
import { useState } from "react";

function BigStatCard({ field, value, label, emoji, unit, color }) {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [input,   setInput]   = useState(value);
  const [saving,  setSaving]  = useState(false);

  async function handleSave() {
    const num = parseFloat(input);
    if (isNaN(num)) return setEditing(false);
    setSaving(true);
    try {
      await updateStats({ ...state.stats, [field]: num });
      dispatch({ type: "SET_STATS", payload: { [field]: num } });
      dispatch({ type: "SHOW_TOAST", payload: { message: `${label} updated!`, type: "success" } });
    } catch {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Save failed", type: "error" } });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div
      className="stats-page__card"
      style={{ borderTop: `4px solid ${color}` }}
      onClick={() => { setInput(value); setEditing(true); }}
      title="Click to edit"
    >
      <div className="stats-page__card-emoji">{emoji}</div>
      {editing ? (
        <input
          className="stats-page__card-input"
          type="number"
          value={input}
          autoFocus
          onChange={e => setInput(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === "Enter")  handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <div className="stats-page__card-value" style={{ color }}>
          {saving ? "..." : value}
          <span className="stats-page__card-unit">{unit}</span>
        </div>
      )}
      <div className="stats-page__card-label">{label}</div>
      {editing && <p className="stats-page__card-hint">Enter to save</p>}
    </div>
  );
}

// Progress ring
function Ring({ value, max, color, label, unit }) {
  const pct    = Math.min(value / Math.max(max, 1), 1);
  const r      = 36;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="stats-page__ring">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#f0f4f8" strokeWidth="9" />
        <circle
          cx="45" cy="45" r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="45" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a2e">
          {Math.round(pct * 100)}%
        </text>
        <text x="45" y="55" textAnchor="middle" fontSize="9" fill="#888">of goal</text>
      </svg>
      <p className="stats-page__ring-label">{label}</p>
      <p className="stats-page__ring-sub">{value} / {max} {unit}</p>
    </div>
  );
}

export default function StatsPage() {
  const { state } = useApp();
  const { water, calories, bpm, sleep } = state.stats;

  // ← Goals come from global state, set by SettingsPage
  const { water: wGoal, calories: cGoal, bpm: bGoal, sleep: sGoal } = state.goals;

  return (
    <div className="page stats-page">
      <div className="page__header">
        <h1 className="page__title">My Stats</h1>
        <p className="page__sub">
          Goals set in Settings · click any card to update today's numbers
        </p>
      </div>

      {/* Big stat cards */}
      <div className="stats-page__grid">
        <BigStatCard field="water"    value={water}    label="Water Intake"    emoji="💧" unit=" L"    color="#4fc3f7" />
        <BigStatCard field="calories" value={calories} label="Calories Burned" emoji="🔥" unit=" kcal" color="#c6f135" />
        <BigStatCard field="bpm"      value={bpm}      label="Heart Rate"      emoji="❤️" unit=" bpm"  color="#ff6b6b" />
        <BigStatCard field="sleep"    value={sleep}    label="Sleep Duration"  emoji="⏰" unit=" hrs"  color="#9c88ff" />
      </div>

      {/* Goal progress rings — uses state.goals */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 className="card__title" style={{ margin: 0 }}>Daily Goals Progress</h3>
          <span
            style={{ fontSize: 11, color: "#888", cursor: "pointer" }}
            onClick={() => {/* Could navigate to settings */}}
          >
            Change goals in ⚙️ Settings
          </span>
        </div>
        <div className="stats-page__rings">
          <Ring value={water}    max={wGoal} color="#4fc3f7" label="Water"    unit="L"    />
          <Ring value={calories} max={cGoal} color="#c6f135" label="Calories" unit="kcal" />
          <Ring value={bpm}      max={bGoal} color="#ff6b6b" label="Heart Rate" unit="bpm" />
          <Ring value={sleep}    max={sGoal} color="#9c88ff" label="Sleep"    unit="hrs"  />
        </div>
      </div>

      {/* Summary table — also uses state.goals */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Today's Summary</h3>
        <table className="stats-page__table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>Goal</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "💧 Water",    value: water,    goal: wGoal, unit: "L"    },
              { label: "🔥 Calories", value: calories, goal: cGoal, unit: "kcal" },
              { label: "❤️ Heart Rate",value: bpm,     goal: bGoal, unit: "bpm"  },
              { label: "⏰ Sleep",    value: sleep,    goal: sGoal, unit: "hrs"  },
            ].map(row => {
              const pct = Math.min(Math.round((row.value / Math.max(row.goal, 1)) * 100), 100);
              const met = row.value >= row.goal;
              return (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td><strong>{row.value} {row.unit}</strong></td>
                  <td style={{ color: "#888" }}>{row.goal} {row.unit}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f0f4f8", borderRadius: 3 }}>
                        <div style={{
                          width: `${pct}%`, height: "100%",
                          background: met ? "#c6f135" : "#ffa940",
                          borderRadius: 3, transition: "width 0.5s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#888", minWidth: 32 }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`stats-page__badge ${met ? "stats-page__badge--good" : "stats-page__badge--low"}`}>
                      {met ? "✅ Met" : "⏳ In progress"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
