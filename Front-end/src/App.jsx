// frontend/src/App.jsx
import { useApp } from "./context/AppContext.jsx";
import AuthPage      from "./components/AuthPage.jsx";
import Sidebar from "./components/SideB.jsx";
import Toast         from "./components/Toast.jsx";

// Pages
import DashboardPage from "./pages/DashboardPage.jsx";
import StatsPage from "./Pages/StatsPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import WorkoutsPage from "./pages/WorkoutsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./Pages/SettingPage.jsx";

import "./style/App.scss";
import './style/Pages.scss';


SettingsPage
// Map nav index → page component
const PAGES = [
  DashboardPage,
  StatsPage,
  SchedulePage,
  WorkoutsPage,
  ProfilePage,
  SettingsPage,
];

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" />
      <p>Loading your dashboard...</p>
    </div>
  );
}

function Dashboard() {
  const { state } = useApp();
  const PageComponent = PAGES[state.activeNav] || DashboardPage;

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard__main">
        <PageComponent />
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  const { state } = useApp();
  if (state.loading) return <LoadingScreen />;
  if (!state.token)  return <AuthPage />;
  return <Dashboard />;
}
