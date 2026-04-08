// frontend/src/components/AuthPage.jsx

import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { loginUser, registerUser } from "../api/axios.js";

// Regex Code
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_RULES = [
  { id: "len",   label: "At least 8 characters",      test: p => p.length >= 8       },
  { id: "upper", label: "One uppercase letter (A–Z)",  test: p => /[A-Z]/.test(p)     },
  { id: "num",   label: "One number (0–9)",            test: p => /[0-9]/.test(p)     },
  { id: "spec",  label: "One special character (!@#…)",test: p => /[^A-Za-z0-9]/.test(p) },
];

function validate(form, isLogin) {
  const errors = {};

  if (!isLogin && !form.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Enter a valid email (e.g. user@example.com)";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (!isLogin && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}


function PasswordStrength({ password }) {
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  const colors = ["#ff4d4f", "#ff7a45", "#ffa940", "#73d13d", "#52c41a"];
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const color  = colors[passed];

  return (
    <div className="auth-strength">
      <div className="auth-strength__bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="auth-strength__bar"
            style={{ background: i <= passed ? color : "#e8ecf0" }}
          />
        ))}
      </div>
      {password && (
        <span className="auth-strength__label" style={{ color }}>
          {labels[passed]}
        </span>
      )}
      <div className="auth-strength__rules">
        {PASSWORD_RULES.map(r => (
          <span
            key={r.id}
            className={`auth-strength__rule ${r.test(password) ? "auth-strength__rule--pass" : ""}`}
          >
            {r.test(password) ? "✓" : "○"} {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}


export default function AuthPage() {
  const { dispatch } = useApp();

  const [isLogin,  setIsLogin]  = useState(false); // show signup by default
  const [form,     setForm]     = useState({ name: "", email: "", password: "" });
  const [errors,   setErrors]   = useState({});     // field-level errors
  const [apiError, setApiError] = useState("");      // server error
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [touched,  setTouched]  = useState({});      // track which fields were touched

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setApiError("");

    // Validate on change if field was already touched
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value }, isLogin);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    const newErrors = validate(form, isLogin);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  }

  async function handleSubmit() {
    // Mark all fields as touched so errors show
    setTouched({ name: true, email: true, password: true });

    const validationErrors = validate(form, isLogin);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const fn  = isLogin ? loginUser : registerUser;
      const res = await fn(form);
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "SET_TOKEN", payload: res.data.token });
      dispatch({ type: "SET_USER",  payload: res.data });
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsLogin(v => !v);
    setErrors({});
    setTouched({});
    setApiError("");
    setForm({ name: "", email: "", password: "" });
  }

  const emailValid = form.email && EMAIL_REGEX.test(form.email);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">▽</div>
        <h1 className="auth-card__title">FitTrack</h1>
        <p className="auth-card__sub">
          {isLogin
            ? "Welcome back! Log in to continue."
            : "Create your account — it's free."}
        </p>

        {/* Name (signup only) */}
        {!isLogin && (
          <div className="auth-field">
            <label className="auth-field__label">Full Name</label>
            <input
              className={`auth-field__input ${errors.name && touched.name ? "auth-field__input--error" : ""}`}
              name="name"
              placeholder="Tracy Cortez"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete="name"
            />
            {errors.name && touched.name && (
              <span className="auth-field__error">⚠ {errors.name}</span>
            )}
          </div>
        )}

        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label">Email Address</label>
          <div className="auth-field__input-wrap">
            <input
              className={`auth-field__input ${
                errors.email && touched.email
                  ? "auth-field__input--error"
                  : emailValid
                  ? "auth-field__input--valid"
                  : ""
              }`}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete="email"
            />
            {/* Green tick when email is valid */}
            {emailValid && (
              <span className="auth-field__valid-icon">✓</span>
            )}
          </div>
          {errors.email && touched.email && (
            <span className="auth-field__error">⚠ {errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <div className="auth-field__input-wrap">
            <input
              className={`auth-field__input ${errors.password && touched.password ? "auth-field__input--error" : ""}`}
              name="password"
              type={showPw ? "text" : "password"}
              placeholder={isLogin ? "Your password" : "Min. 8 characters"}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete={isLogin ? "current-password" : "new-password"}
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              className="auth-field__eye"
              onClick={() => setShowPw(v => !v)}
              tabIndex={-1}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className="auth-field__error">⚠ {errors.password}</span>
          )}

          {/* Password strength — signup only */}
          {!isLogin && form.password && (
            <PasswordStrength password={form.password} />
          )}
        </div>

        {/* API / server error */}
        {apiError && (
          <div className="auth-card__error">
            ⚠ {apiError}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn btn--primary btn--full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isLogin ? "Log In" : "Create Account"}
        </button>

        {/* Switch mode */}
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
