import axios from "axios";

const api = axios.create({
  baseURL: 'https://project-fitmate.onrender.com' || "http://localhost:3000/api",
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout when token expires (401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ──────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser    = (data) => api.post("/auth/login", data);
export const getMe        = ()     => api.get("/auth/me");

// ─── Stats ─────────────────────────────────────────────────────────────────
export const getTodayStats  = ()     => api.get("/stats/today");
export const updateStats    = (data) => api.put("/stats/today", data);
export const getWeeklyStats = ()     => api.get("/stats/weekly");

// ─── Workouts ──────────────────────────────────────────────────────────────
export const getWorkouts   = (date) => api.get("/workouts", { params: { date } });
export const createWorkout = (data) => api.post("/workouts", data);
export const toggleWorkout = (id)   => api.patch(`/workouts/${id}/toggle`);
export const deleteWorkout = (id)   => api.delete(`/workouts/${id}`);

// ─── Attendance ────────────────────────────────────────────────────────────
export const getAttendance = (year, month) =>
  api.get("/attendance", { params: { year, month } });
export const markDate   = (date) => api.post("/attendance", { date });
export const unmarkDate = (date) => api.delete(`/attendance/${date}`);
