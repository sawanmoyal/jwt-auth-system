import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.email || !form.password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    const result = await login(form.email.trim(), form.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-layout">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="form-input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input${displayError ? " error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              <span className="form-input-icon">✉️</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input${displayError ? " error" : ""}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span className="form-input-icon">🔑</span>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm" /> Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </div>
        </form>

        <div className="divider">or</div>

        {/* Demo credentials helper */}
        <div style={{
          background: "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: "8px",
          padding: "0.875rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.8rem",
          color: "var(--text-secondary)"
        }}>
          <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: "0.4rem" }}>
            🧪 Demo Credentials
          </div>
          <div>Register any account, or use role <strong style={{color:"var(--admin-color)"}}>admin</strong> on signup for admin access.</div>
        </div>

        <p className="text-center" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
