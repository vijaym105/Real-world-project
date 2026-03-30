import React from "react";
import {  createContext, useContext, useReducer, useEffect } from "react";
import {
  getTodayStats,
  getWorkouts,
  getAttendance,
  getMe,
} from '../api/axios';

const initialState = {
  user:          null,
  token:         localStorage.getItem("token") || null,
  stats:         { water: 0, calories: 0, bpm: 72, sleep: 0 },
  workouts:      [],
  attendedDates: [],
  currentMonth:  new Date().getMonth(),
  currentYear:   new Date().getFullYear(),
  loading:       true,
  activeNav:     0,
  modal:         null,
  toast:         null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":       return { ...state, user: action.payload };
    case "SET_TOKEN":      return { ...state, token: action.payload };
    case "LOGOUT":         return { ...initialState, token: null, loading: false };
    case "SET_STATS":      return { ...state, stats: { ...state.stats, ...action.payload } };
    case "SET_WORKOUTS":   return { ...state, workouts: action.payload };
    case "ADD_WORKOUT":    return { ...state, workouts: [action.payload, ...state.workouts] };
    case "UPDATE_WORKOUT": return {
      ...state,
      workouts: state.workouts.map((w) =>
        w._id === action.payload._id ? action.payload : w
      ),
    };
    case "DELETE_WORKOUT": return {
      ...state,
      workouts: state.workouts.filter((w) => w._id !== action.payload),
    };
    case "SET_ATTENDANCE": return { ...state, attendedDates: action.payload };
    case "TOGGLE_DATE":    return {
      ...state,
      attendedDates: state.attendedDates.includes(action.payload)
        ? state.attendedDates.filter((d) => d !== action.payload)
        : [...state.attendedDates, action.payload],
    };
    case "SET_MONTH":      return {
      ...state,
      currentMonth: action.payload.month,
      currentYear:  action.payload.year,
    };
    case "SET_LOADING":    return { ...state, loading: action.payload };
    case "SET_NAV":        return { ...state, activeNav: action.payload };
    case "OPEN_MODAL":     return { ...state, modal: action.payload };
    case "CLOSE_MODAL":    return { ...state, modal: null };
    case "SHOW_TOAST":     return { ...state, toast: action.payload };
    case "CLEAR_TOAST":    return { ...state, toast: null };
    default:               return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load all data once the token is available
  useEffect(() => {
    if (!state.token) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    async function loadAll() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const [userRes, statsRes, workoutsRes, attendanceRes] =
          await Promise.all([
            getMe(),
            getTodayStats(),
            getWorkouts(todayStr),
            getAttendance(today.getFullYear(), today.getMonth()),
          ]);

        dispatch({ type: "SET_USER",       payload: userRes.data });
        dispatch({ type: "SET_STATS",      payload: statsRes.data });
        dispatch({ type: "SET_WORKOUTS",   payload: workoutsRes.data });
        dispatch({ type: "SET_ATTENDANCE", payload: attendanceRes.data });
      } catch (err) {
        console.error("Load error:", err);
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Failed to load data", type: "error" },
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    loadAll();
  }, [state.token]);

  // Auto-dismiss toast after 3s
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3000);
    return () => clearTimeout(t);
  }, [state.toast]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
