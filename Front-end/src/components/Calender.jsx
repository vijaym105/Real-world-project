import { useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getAttendance, markDate, unmarkDate } from "../api/axios.js";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March",     "April",   "May",      "June",
  "July",    "August",   "September", "October", "November", "December",
];

export default function Calender() {
  const { state, dispatch } = useApp();
  const { currentMonth, currentYear, attendedDates } = state;

  // Reload when month/year changes
  useEffect(() => {
    getAttendance(currentYear, currentMonth)
      .then((res) => dispatch({ type: "SET_ATTENDANCE", payload: res.data }))
      .catch(console.error);
  }, [currentMonth, currentYear]);

  function navigate(dir) {
    const d = new Date(currentYear, currentMonth + dir);
    dispatch({
      type: "SET_MONTH",
      payload: { month: d.getMonth(), year: d.getFullYear() },
    });
  }

  async function handleDayClick(day) {
    const dateStr  = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const attended = attendedDates.includes(dateStr);

    dispatch({ type: "TOGGLE_DATE", payload: dateStr }); // optimistic update

    try {
      if (attended) {
        await unmarkDate(dateStr);
      } else {
        await markDate(dateStr);
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Attendance marked ✅", type: "success" },
        });
      }
    } catch {
      dispatch({ type: "TOGGLE_DATE", payload: dateStr }); // rollback
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Failed to update", type: "error" },
      });
    }
  }

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today       = new Date();
  const todayStr    = today.toISOString().split("T")[0];

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="card calendar">
      <div className="calendar__nav">
        <button className="calendar__arrow" onClick={() => navigate(-1)}>‹</button>
        <span className="calendar__title">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button className="calendar__arrow" onClick={() => navigate(1)}>›</button>
      </div>

      <p className="calendar__attendance-count">
        {attendedDates.length} day{attendedDates.length !== 1 ? "s" : ""} attended this month
      </p>

      <div className="calendar__grid-header">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="calendar__grid">
        {cells.map((day, i) => {
          if (!day)
            return <span key={`e-${i}`} className="calendar__day calendar__day--empty" />;

          const dateStr  = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday  = dateStr === todayStr;
          const attended = attendedDates.includes(dateStr);
          const isFuture = new Date(dateStr) > today;

          return (
            <span
              key={day}
              className={[
                "calendar__day",
                isToday  ? "calendar__day--today"    : "",
                attended ? "calendar__day--attended" : "",
                isFuture ? "calendar__day--future"   : "",
              ].join(" ")}
              onClick={() => !isFuture && handleDayClick(day)}
              title={
                isFuture  ? "Can't mark future dates" :
                attended  ? "Click to unmark" :
                            "Click to mark attended"
              }
            >
              {day}
              {attended && <span className="calendar__dot" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
