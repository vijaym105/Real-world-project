import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { updateStats } from "../api/axios.js";

function StatCard({ field, value, label, emoji, unit }) {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [input,   setInput]   = useState(value);
  const [saving,  setSaving]  = useState(false);

  async function handleSave() {
    const num = parseFloat(input);
    if (isNaN(num)) return setEditing(false);
    setSaving(true);
    try {
      const updated = { ...state.stats, [field]: num };
      await updateStats(updated);
      dispatch({ type: "SET_STATS", payload: { [field]: num } });
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: `${label} updated! ✓`, type: "success" },
      });
    } catch {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Save failed", type: "error" },
      });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div
      className={`stat-card ${editing ? "stat-card--editing" : ""}`}
      onClick={() => { setInput(value); setEditing(true); }}
      title="Click to edit"
    >
      <div className="stat-card__top">
        {editing ? (
          <input
            className="stat-card__input"
            type="number"
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="stat-card__value">
            {saving ? "..." : value}
            {unit && <small> {unit}</small>}
          </span>
        )}
        <span className="stat-card__emoji">{emoji}</span>
      </div>
      <p className="stat-card__label">{label}</p>
      {editing && (
        <p className="stat-card__hint">Enter to save · Esc to cancel</p>
      )}
    </div>
  );
}

export default function StatsRow() {
  const { state } = useApp();
  const { water, calories, bpm, sleep } = state.stats;
  return (
    <div className="stats-row">
      <StatCard field="water"    value={water}    label="Water liters"     emoji="💧" unit="L"    />
      <StatCard field="calories" value={calories} label="Kilo Calories"    emoji="🔥" unit="kcal" />
      <StatCard field="bpm"      value={bpm}      label="Beats per minute" emoji="❤️" unit="bpm"  />
      <StatCard field="sleep"    value={sleep}    label="Hours Sleeping"   emoji="⏰" unit="hrs"  />
    </div>
  );
}
