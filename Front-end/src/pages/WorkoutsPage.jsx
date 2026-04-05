// frontend/src/pages/WorkoutsPage.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { createWorkout, toggleWorkout, deleteWorkout, getWorkouts } from "../api/axios.js";

const TYPES = ["Cardio","Strength","Yoga","HIIT","Cycling","Running","Swimming","Stretching","Other"];

const TYPE_COLORS = {
  Cardio:"#c6f135", Strength:"#4fc3f7", Yoga:"#9c88ff",
  HIIT:"#ff6b6b", Running:"#ffa940", Cycling:"#1a1a2e",
  Swimming:"#00b894", Stretching:"#fd79a8", Other:"#888",
};

export default function WorkoutsPage() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState("all");  // "all" | "today" | "completed" | "pending"
  const [form, setForm]         = useState({ name:"", type:"Cardio", duration:"", notes:"" });
  const [loading, setLoading]   = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Filter workouts
  const filtered = state.workouts.filter(w => {
    if (filter === "today")     return w.date === today;
    if (filter === "completed") return w.completed;
    if (filter === "pending")   return !w.completed;
    return true;
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.duration) {
      return dispatch({ type:"SHOW_TOAST", payload:{ message:"Name and duration required", type:"error" } });
    }
    setLoading(true);
    try {
      const res = await createWorkout({ ...form, duration: parseInt(form.duration) });
      dispatch({ type:"ADD_WORKOUT", payload: res.data });
      dispatch({ type:"SHOW_TOAST", payload:{ message:"Workout added! 💪", type:"success" } });
      setForm({ name:"", type:"Cardio", duration:"", notes:"" });
      setShowForm(false);
    } catch {
      dispatch({ type:"SHOW_TOAST", payload:{ message:"Failed to add", type:"error" } });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(w) {
    try {
      const res = await toggleWorkout(w._id);
      dispatch({ type:"UPDATE_WORKOUT", payload: res.data });
    } catch {
      dispatch({ type:"SHOW_TOAST", payload:{ message:"Update failed", type:"error" } });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await deleteWorkout(id);
      dispatch({ type:"DELETE_WORKOUT", payload: id });
      dispatch({ type:"SHOW_TOAST", payload:{ message:"Deleted", type:"success" } });
    } catch {
      dispatch({ type:"SHOW_TOAST", payload:{ message:"Delete failed", type:"error" } });
    }
  }

  const completedCount = state.workouts.filter(w => w.completed).length;
  const totalMins      = state.workouts.reduce((s, w) => s + (w.duration || 0), 0);

  return (
    <div className="page workouts-page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Workouts</h1>
          <p className="page__sub">{state.workouts.length} total · {completedCount} completed · {totalMins} mins</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? "✕ Cancel" : "+ Add Workout"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card workouts-page__form">
          <h3 className="card__title">New Workout</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" placeholder="e.g. Morning Run" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (mins) *</label>
              <input name="duration" type="number" min="1" placeholder="30" value={form.duration} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input name="notes" placeholder="Optional notes" value={form.notes} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn--primary" onClick={handleAdd} disabled={loading}>
            {loading ? "Saving..." : "Add Workout"}
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="workouts-page__filters">
        {["all","today","completed","pending"].map(f => (
          <button
            key={f}
            className={`workouts-page__filter-btn ${filter === f ? "workouts-page__filter-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="workouts-page__filter-count">
              {f === "all"       ? state.workouts.length :
               f === "today"     ? state.workouts.filter(w => w.date === today).length :
               f === "completed" ? state.workouts.filter(w => w.completed).length :
                                   state.workouts.filter(w => !w.completed).length}
            </span>
          </button>
        ))}
      </div>

      {/* Workout list */}
      {filtered.length === 0 ? (
        <div className="workouts-page__empty">
          <p>No workouts found</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>+ Add your first workout</button>
        </div>
      ) : (
        <div className="workouts-page__list">
          {filtered.map(w => (
            <div key={w._id} className={`workouts-page__item ${w.completed ? "workouts-page__item--done" : ""}`}>
              <div className="workouts-page__item-color" style={{ background: TYPE_COLORS[w.type] || "#888" }} />

              <button className="workouts-page__check" onClick={() => handleToggle(w)}>
                {w.completed ? "✅" : "⬜"}
              </button>

              <div className="workouts-page__item-info">
                <span className="workouts-page__item-name">{w.name}</span>
                <span className="workouts-page__item-meta">
                  <span className="workouts-page__item-tag" style={{ background: TYPE_COLORS[w.type] + "22", color: TYPE_COLORS[w.type] }}>
                    {w.type}
                  </span>
                  {w.duration} mins · {w.date}
                  {w.notes && ` · ${w.notes}`}
                </span>
              </div>

              <button className="workouts-page__delete" onClick={() => handleDelete(w._id)} title="Delete">
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
