// frontend/src/pages/SchedulePage.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

const WORKOUT_COLORS = {
  Cardio:     "#c6f135",
  Strength:   "#4fc3f7",
  Yoga:       "#9c88ff",
  HIIT:       "#ff6b6b",
  Running:    "#ffa940",
  Cycling:    "#1a1a2e",
  Other:      "#888",
};

export default function SchedulePage() {
  const { state } = useApp();
  const [viewDate, setViewDate] = useState(new Date());

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  function navigate(dir) {
    const d = new Date(year, month + dir, 1);
    setViewDate(d);
  }

  // Build weekly schedule starting from Monday of current week
  const today      = new Date();
  const dayOfWeek  = today.getDay();
  const monday     = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  // Group workouts by date
  function workoutsForDate(date) {
    const ds = date.toISOString().split("T")[0];
    return state.workouts.filter(w => w.date === ds);
  }

  const todayStr = today.toISOString().split("T")[0];

  return (
    <div className="page schedule-page">
      <div className="page__header">
        <h1 className="page__title">Schedule</h1>
        <p className="page__sub">Your weekly workout plan</p>
      </div>

      {/* Week strip */}
      <div className="card schedule-page__week">
        <div className="schedule-page__week-header">
          <button className="calendar__arrow" onClick={() => navigate(-1)}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            {MONTHS[month]} {year}
          </span>
          <button className="calendar__arrow" onClick={() => navigate(1)}>›</button>
        </div>

        <div className="schedule-page__week-grid">
          {weekDates.map((date, i) => {
            const ds         = date.toISOString().split("T")[0];
            const isToday    = ds === todayStr;
            const dayWorkouts = workoutsForDate(date);

            return (
              <div
                key={i}
                className={`schedule-page__day ${isToday ? "schedule-page__day--today" : ""}`}
              >
                <span className="schedule-page__day-name">{DAYS[(i + 1) % 7]}</span>
                <span className={`schedule-page__day-num ${isToday ? "schedule-page__day-num--today" : ""}`}>
                  {date.getDate()}
                </span>

                <div className="schedule-page__day-workouts">
                  {dayWorkouts.length === 0 ? (
                    <span className="schedule-page__rest">Rest</span>
                  ) : (
                    dayWorkouts.map((w, j) => (
                      <span
                        key={j}
                        className="schedule-page__workout-pill"
                        style={{ background: WORKOUT_COLORS[w.type] || "#888" }}
                      >
                        {w.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's detailed schedule */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Today's Workouts</h3>
        {workoutsForDate(today).length === 0 ? (
          <div className="schedule-page__empty">
            <p>No workouts scheduled for today.</p>
            <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
              Go to the Workouts page to add some!
            </p>
          </div>
        ) : (
          <div className="schedule-page__today-list">
            {workoutsForDate(today).map((w, i) => (
              <div key={i} className="schedule-page__today-item">
                <div
                  className="schedule-page__today-color"
                  style={{ background: WORKOUT_COLORS[w.type] || "#888" }}
                />
                <div className="schedule-page__today-info">
                  <span className="schedule-page__today-name">{w.name}</span>
                  <span className="schedule-page__today-meta">
                    {w.type} · {w.duration} mins {w.completed ? "✅" : "⏳"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly summary */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">This Week's Summary</h3>
        <div className="schedule-page__summary">
          {[
            { label: "Total sessions",  value: state.workouts.length },
            { label: "Completed",       value: state.workouts.filter(w => w.completed).length },
            { label: "Total mins",      value: state.workouts.reduce((s, w) => s + (w.duration || 0), 0) },
            { label: "Active days",     value: [...new Set(state.workouts.map(w => w.date))].length },
          ].map(s => (
            <div key={s.label} className="schedule-page__summary-item">
              <span className="schedule-page__summary-val">{s.value}</span>
              <span className="schedule-page__summary-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
