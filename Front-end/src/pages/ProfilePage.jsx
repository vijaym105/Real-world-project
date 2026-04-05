// frontend/src/pages/ProfilePage.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const user = state.user;

  const [form, setForm]       = useState({
    name:   user?.name   || "",
    height: user?.height || "",
    weight: user?.weight || "",
    gender: user?.gender || "",
  });
  const [saving,   setSaving]   = useState(false);
  const [editMode, setEditMode] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      dispatch({ type: "SET_USER", payload: res.data });
      dispatch({ type: "SHOW_TOAST", payload: { message: "Profile updated! ✓", type: "success" } });
      setEditMode(false);
    } catch {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Update failed", type: "error" } });
    } finally {
      setSaving(false);
    }
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=c6f135&color=1a1a2e&size=200`;

  // Stats from workouts
  const totalWorkouts  = state.workouts.length;
  const completedCount = state.workouts.filter(w => w.completed).length;
  const totalMins      = state.workouts.reduce((s, w) => s + (w.duration || 0), 0);
  const attendedDays   = state.attendedDates?.length || 0;

  return (
    <div className="page profile-page">
      <div className="page__header">
        <h1 className="page__title">Profile</h1>
        <button
          className={`btn ${editMode ? "btn--outline" : "btn--primary"}`}
          onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
        >
          {editMode ? "Cancel" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Profile card */}
      <div className="card profile-page__card">
        <img src={avatarUrl} alt="avatar" className="profile-page__avatar" />

        {editMode ? (
          <div className="profile-page__form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Tracy Cortez" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height (e.g. 5.6 inch or 170 cm)</label>
                <input name="height" value={form.height} onChange={handleChange} placeholder="5.6 inch" />
              </div>
              <div className="form-group">
                <label>Weight (e.g. 52 kg or 115 lbs)</label>
                <input name="weight" value={form.weight} onChange={handleChange} placeholder="52 kg" />
              </div>
            </div>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="profile-page__info">
            <h2 className="profile-page__name">{user?.name || "User"}</h2>
            <p className="profile-page__email">{user?.email}</p>

            <div className="profile-page__details">
              {[
                { label: "Height", value: user?.height || "Not set" },
                { label: "Weight", value: user?.weight || "Not set" },
                { label: "Gender", value: user?.gender || "Not set" },
              ].map(d => (
                <div key={d.label} className="profile-page__detail">
                  <span className="profile-page__detail-label">{d.label}</span>
                  <span className="profile-page__detail-value">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fitness stats */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Fitness Overview</h3>
        <div className="profile-page__stats-grid">
          {[
            { label: "Total Workouts",  value: totalWorkouts,  emoji: "💪" },
            { label: "Completed",       value: completedCount, emoji: "✅" },
            { label: "Total Minutes",   value: totalMins,      emoji: "⏱️" },
            { label: "Days Attended",   value: attendedDays,   emoji: "📅" },
          ].map(s => (
            <div key={s.label} className="profile-page__stat">
              <span className="profile-page__stat-emoji">{s.emoji}</span>
              <span className="profile-page__stat-val">{s.value}</span>
              <span className="profile-page__stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card__title">Account</h3>
        <div className="profile-page__account">
          <div className="profile-page__account-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="profile-page__account-row">
            <span>Member since</span>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
