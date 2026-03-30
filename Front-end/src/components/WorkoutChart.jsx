// "Sessions" (lime) = number of workouts logged per day
// "Duration" (dark) = total minutes per day
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { getWorkouts } from "../api/axios.js";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split("T")[0],
      day:     SHORT_DAYS[d.getDay()],
    };
  });
}

const FALLBACK = [
  { day: "Sun", online: 1, offline: 30  },
  { day: "Mon", online: 3, offline: 75  },
  { day: "Tue", online: 2, offline: 50  },
  { day: "Wed", online: 4, offline: 90  },
  { day: "Thu", online: 2, offline: 45  },
  { day: "Fri", online: 3, offline: 60  },
  { day: "Sat", online: 1, offline: 20  },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a1a2e", borderRadius: 10,
      padding: "10px 14px", fontSize: 12, color: "#fff",
    }}>
      <p style={{ marginBottom: 6, fontWeight: 600, color: "#c6f135" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey === "online" ? "🟢 Sessions" : "⚫ Duration"}:{" "}
          <strong>
            {p.value}
            {p.dataKey === "offline" ? " min" : ""}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default function WorkoutChart() {
  const [data,    setData]    = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const last7   = getLast7Days();
        const results = await Promise.all(
          last7.map(({ dateStr }) =>
            getWorkouts(dateStr).then((r) => r.data).catch(() => [])
          )
        );
        const chart = last7.map(({ day }, i) => ({
          day,
          online:  results[i].length,
          offline: results[i].reduce((s, w) => s + (w.duration || 0), 0),
        }));
        if (chart.some((d) => d.online > 0 || d.offline > 0)) setData(chart);
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSessions = data.reduce((s, d) => s + d.online,  0);
  const totalMins     = data.reduce((s, d) => s + d.offline, 0);

  return (
    <div className="card workout-activity">
      <div className="card__header">
        <h3>Workout Activity</h3>
        <div className="workout-activity__legend">
          <span className="legend-dot legend-dot--online" /> Sessions
          <span className="legend-dot legend-dot--offline" style={{ marginLeft: 10 }} /> Duration
        </div>
      </div>

      <div className="workout-activity__summary">
        <div className="workout-activity__pill">
          <span className="workout-activity__pill-val" style={{ color: "#c6f135" }}>
            {totalSessions}
          </span>
          <span className="workout-activity__pill-lbl">Sessions this week</span>
        </div>
        <div className="workout-activity__pill">
          <span className="workout-activity__pill-val">{totalMins} min</span>
          <span className="workout-activity__pill-lbl">Total active time</span>
        </div>
      </div>

      {loading ? (
        <div className="workout-activity__loading">
          <div className="workout-activity__skeleton" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c6f135" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#c6f135" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradOffline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1a1a2e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#aaa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#ccc" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="offline"
              stroke="#1a1a2e"
              strokeWidth={2}
              fill="url(#gradOffline)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="#c6f135"
              strokeWidth={2.5}
              fill="url(#gradOnline)"
              dot={{ r: 3, fill: "#c6f135", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
