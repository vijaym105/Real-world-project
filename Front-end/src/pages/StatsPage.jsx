// frontend/src/pages/StatsPage.jsx
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
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
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

// Simple progress ring
function Ring({ value, max, color, label }) {
  const pct    = Math.min(value / max, 1);
  const r      = 40;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="stats-page__ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f0f4f8" strokeWidth="10"/>
        <circle
          cx="50" cy="50" r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fontSize="14" fontWeight="700" fill={color}>
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <p className="stats-page__ring-label">{label}</p>
    </div>
  );
}

export default function StatsPage() {
  const { state } = useApp();
  const { water, calories, bpm, sleep } = state.stats;

  const goals = { water: 3, calories: 2000, bpm: 80, sleep: 8 };

  return (
    <div className="page stats-page">
      <div className="page__header">
        <h1 className="page__title">My Stats</h1>
        <p className="page__sub">Click any card to update today's numbers</p>
      </div>

      {/* Big stat cards */}
      <div className="stats-page__grid">
        <BigStatCard field="water"    value={water}    label="Water Intake"     emoji="💧" unit=" L"    color="#4fc3f7" />
        <BigStatCard field="calories" value={calories} label="Calories Burned"  emoji="🔥" unit=" kcal" color="#c6f135" />
        <BigStatCard field="bpm"      value={bpm}      label="Heart Rate"       emoji="❤️" unit=" bpm"  color="#ff6b6b" />
        <BigStatCard field="sleep"    value={sleep}    label="Sleep Duration"   emoji="⏰" unit=" hrs"  color="#9c88ff" />
      </div>

      {/* Goal progress rings */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Daily Goals Progress</h3>
        <div className="stats-page__rings">
          <Ring value={water}    max={goals.water}    color="#4fc3f7" label="Water"    />
          <Ring value={calories} max={goals.calories} color="#c6f135" label="Calories" />
          <Ring value={bpm}      max={goals.bpm}      color="#ff6b6b" label="Heart Rate"/>
          <Ring value={sleep}    max={goals.sleep}    color="#9c88ff" label="Sleep"    />
        </div>
      </div>

      {/* Summary table */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Today's Summary</h3>
        <table className="stats-page__table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Water (L)",       value: water,    goal: goals.water,    unit: "L"    },
              { label: "Calories (kcal)", value: calories, goal: goals.calories, unit: "kcal" },
              { label: "Heart Rate (bpm)",value: bpm,      goal: goals.bpm,      unit: "bpm"  },
              { label: "Sleep (hrs)",     value: sleep,    goal: goals.sleep,    unit: "hrs"  },
            ].map(row => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td><strong>{row.value} {row.unit}</strong></td>
                <td>{row.goal} {row.unit}</td>
                <td>
                  <span className={`stats-page__badge ${row.value >= row.goal ? "stats-page__badge--good" : "stats-page__badge--low"}`}>
                    {row.value >= row.goal ? "✅ Goal met" : "⏳ In progress"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
