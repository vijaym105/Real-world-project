// frontend/src/pages/DashboardPage.jsx
import { useApp } from "../context/AppContext.jsx";
import StatsRow      from "../components/StatsRow.jsx";
import WorkoutChart  from "../components/WorkoutChart.jsx";
import WorkoutList, { AddWorkoutModal } from "../components/Workouts.jsx";
import Calendar from '../components/Calender.jsx'
import BMICalculator from "../components/BMICalculator.jsx";

function ProfileCard() {
  const { state } = useApp();
  const user = state.user;
  return (
    <div className="profile-card">
      <div className="profile-card__top">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=c6f135&color=1a1a2e&size=80`}
          alt="avatar"
          className="profile-card__avatar"
        />
        <div>
          <h3 className="profile-card__name">{user?.name || "User"}</h3>
          <p className="profile-card__age">{user?.email}</p>
        </div>
      </div>
      <div className="profile-card__stats">
        <div>
          <span className="profile-stat__value">{user?.height || "—"}</span>
          <span className="profile-stat__label">Height</span>
        </div>
        <div>
          <span className="profile-stat__value">{user?.weight || "—"}</span>
          <span className="profile-stat__label">Weight</span>
        </div>
        <div>
          <span className="profile-stat__value">{user?.gender || "—"}</span>
          <span className="profile-stat__label">Gender</span>
        </div>
      </div>
    </div>
  );
}

function ModalRouter() {
  const { state } = useApp();
  if (state.modal === "addWorkout") return <AddWorkoutModal />;
  return null;
}

export default function DashboardPage() {
  const { state } = useApp();
  const today = new Date().toLocaleString("default", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <>
      {/* Dashboard is the only page that uses the right panel layout */}
      <div className="dashboard-inner">

        {/* Center content */}
        <div className="dashboard-inner__main">
          <header className="dashboard__header">
            <div>
              <h1 className="dashboard__greeting">
                Good Morning, {state.user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="dashboard__sub">{today} · Let's crush your goals today!</p>
            </div>
            <div className="dashboard__header-actions">
              <button className="btn btn--pill">Weekly ▾</button>
              <button className="icon-btn">🔍</button>
              <button className="icon-btn">🔔</button>
            </div>
          </header>

          <StatsRow />

          <div className="middle-row">
            <WorkoutChart />
            <WorkoutList />
          </div>

          <BMICalculator />
        </div>

        {/* Right panel */}
        <aside className="right-panel">
          <ProfileCard />
          <Calendar />
        </aside>
      </div>

      <ModalRouter />
    </>
  );
}
