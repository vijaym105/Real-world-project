import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { createWorkout, toggleWorkout, deleteWorkout } from "../api/axios.js";

const TYPES = [
  "Cardio", "Strength", "Yoga", "HIIT",
  "Cycling", "Running", "Swimming", "Stretching", "Other",
];

// ─── Add Workout Modal ──────────────────────────────────────────────────────
export function AddWorkoutModal() {
  const { dispatch } = useApp();
  const [form,    setForm]    = useState({ name: "", type: "Cardio", duration: "", notes: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.duration) {
      return dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Name and duration required", type: "error" },
      });
    }
    setLoading(true);
    try {
      const res = await createWorkout({ ...form, duration: parseInt(form.duration) });
      dispatch({ type: "ADD_WORKOUT",  payload: res.data });
      dispatch({ type: "SHOW_TOAST",   payload: { message: "Workout added! 💪", type: "success" } });
      dispatch({ type: "CLOSE_MODAL" });
    } catch {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Failed to add workout", type: "error" } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Add Workout 💪</h2>
          <button className="modal__close" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
            ✕
          </button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Workout Name *</label>
            <input
              name="name"
              placeholder="e.g. Morning Run"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Duration (mins) *</label>
              <input
                name="duration"
                type="number"
                placeholder="30"
                min="1"
                value={form.duration}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              placeholder="How did it go?"
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--outline" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Workout"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Workout List Card ──────────────────────────────────────────────────────
export default function WorkoutList() {
  const { state, dispatch } = useApp();
  const today         = new Date().toISOString().split("T")[0];
  const todayWorkouts = state.workouts.filter((w) => w.date === today);
  const completed     = todayWorkouts.filter((w) => w.completed).length;

  async function handleToggle(workout) {
    try {
      const res = await toggleWorkout(workout._id);
      dispatch({ type: "UPDATE_WORKOUT", payload: res.data });
    } catch {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Update failed", type: "error" } });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await deleteWorkout(id);
      dispatch({ type: "DELETE_WORKOUT", payload: id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "Workout deleted", type: "success" } });
    } catch {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Delete failed", type: "error" } });
    }
  }

  return (
    <div className="card workout-list">
      <div className="card__header">
        <h3>Today's Workouts</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="workout-badge">
            {completed}/{todayWorkouts.length} done
          </span>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => dispatch({ type: "OPEN_MODAL", payload: "addWorkout" })}
          >
            + Add
          </button>
        </div>
      </div>

      {todayWorkouts.length === 0 ? (
        <div className="workout-list__empty">
          <p>No workouts yet today</p>
          <button
            className="btn btn--primary"
            onClick={() => dispatch({ type: "OPEN_MODAL", payload: "addWorkout" })}
          >
            + Add your first workout
          </button>
        </div>
      ) : (
        <div className="workout-list__items">
          {todayWorkouts.map((w) => (
            <div
              key={w._id}
              className={`workout-item ${w.completed ? "workout-item--done" : ""}`}
            >
              <button className="workout-item__check" onClick={() => handleToggle(w)}>
                {w.completed ? "✅" : "⬜"}
              </button>
              <div className="workout-item__info">
                <span className="workout-item__name">{w.name}</span>
                <span className="workout-item__meta">
                  {w.type} · {w.duration} mins{w.notes ? ` · ${w.notes}` : ""}
                </span>
              </div>
              <button
                className="workout-item__delete"
                onClick={() => handleDelete(w._id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
