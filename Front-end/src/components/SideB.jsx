// frontend/src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";

const NAV = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "📊", label: "Stats"     },
  { icon: "📅", label: "Schedule"  },
  { icon: "📋", label: "Workouts"  },
  { icon: "👤", label: "Profile"   },
  { icon: "⚙️", label: "Settings"  },
];

export default function SideB() {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer when nav item clicked or on ESC key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleNav(i) {
    dispatch({ type: "SET_NAV", payload: i });
    setMobileOpen(false); // close drawer after navigating
  }

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ 600px) ─────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">▽</div>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((item, i) => (
            <button
              key={i}
              className={`sidebar__nav-btn ${state.activeNav === i ? "sidebar__nav-btn--active" : ""}`}
              onClick={() => dispatch({ type: "SET_NAV", payload: i })}
              title={item.label}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={handleLogout} title="Logout">
          <span className="sidebar__nav-icon">🚪</span>
          <span className="sidebar__nav-label">Logout</span>
        </button>
      </aside>

      {/* ── Mobile: hamburger button (top-left, only on mobile) ──────────── */}
      <button
        className="sidebar__hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <span className="sidebar__hamburger-dot" />
        <span className="sidebar__hamburger-dot" />
        <span className="sidebar__hamburger-dot" />
      </button>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={`sidebar__backdrop ${mobileOpen ? "sidebar__backdrop--visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile drawer (slides in from left) ──────────────────────────── */}
      <aside className={`sidebar__drawer ${mobileOpen ? "sidebar__drawer--open" : ""}`}>

        {/* Drawer header */}
        <div className="sidebar__drawer-header">
          <div className="sidebar__logo-icon">▽</div>
          <span className="sidebar__drawer-brand">FitTrack</span>
          <button
            className="sidebar__drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* User info strip */}
        {state.user && (
          <div className="sidebar__drawer-user">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.name || "U")}&background=c6f135&color=1a1a2e&size=60`}
              alt="avatar"
              className="sidebar__drawer-avatar"
            />
            <div>
              <p className="sidebar__drawer-name">{state.user.name}</p>
              <p className="sidebar__drawer-email">{state.user.email}</p>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="sidebar__drawer-nav">
          {NAV.map((item, i) => (
            <button
              key={i}
              className={`sidebar__drawer-btn ${state.activeNav === i ? "sidebar__drawer-btn--active" : ""}`}
              onClick={() => handleNav(i)}
            >
              <span className="sidebar__drawer-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <button className="sidebar__drawer-logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
