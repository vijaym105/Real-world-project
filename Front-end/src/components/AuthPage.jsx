import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { loginUser, registerUser } from "../api/axios.js";

export default function AuthPage() {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(false); // default: show signup
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit() {
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      return setError("Please fill in all fields");
    }
    setLoading(true);
    try {
      const fn  = isLogin ? loginUser : registerUser;
      const res = await fn(form);
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "SET_TOKEN", payload: res.data.token });
      dispatch({ type: "SET_USER",  payload: res.data });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsLogin((v) => !v);
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo"><img src="finalLogo.png" alt="" height={100} /></div>
        <h1 className="auth-card__title">FitMate</h1>
        <p className="auth-card__sub">
          {isLogin
            ? "Welcome back! Log in to continue."
            : "Create your account to get started."}
        </p>

        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Tracy Cortez"
              value={form.name}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="tracy@example.com"
            value={form.email}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)", fontSize: 14,
                opacity: 0.5, background: "none", border: "none", cursor: "pointer",
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && <p className="auth-card__error">{error}</p>}

        <button
          className="btn btn--primary btn--full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
        </button>

        <p className="auth-card__switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="btn-link" onClick={switchMode}>
            {isLogin ? "Sign up free" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
