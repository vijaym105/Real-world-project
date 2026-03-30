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

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon"><img src='finalLogo.png' alt="" height={100} width={100}/></div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map((item, i) => (
          <button
            key={i}
            className={`sidebar__nav-btn ${
              state.activeNav === i ? "sidebar__nav-btn--active" : ""
            }`}
            onClick={() => dispatch({ type: "SET_NAV", payload: i })}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout} title="Logout">
        🚪
      </button>
    </aside>
  );
}
