import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const result = await register(
      form.name.trim(),
      form.email.trim().toLowerCase(),
      form.password,
      form.role
    );

    if (result.success) {
      navigate("/dashboard");
    }
  };

  const displayError = localError || error;

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "var(--danger)", width: "25%" };
    if (p.length < 8) return { label: "Weak", color: "var(--warning)", width: "50%" };
    if (p.length < 12 && /[0-9]/.test(p)) return { label: "Good", color: "var(--accent)", width: "75%" };
    return { label: "Strong", color: "var(--success)", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-layout">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✨</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join with secure JWT authentication</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="form-input-wrapper">
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
              <span className="form-input-icon">👤</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="form-input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
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
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="form-input-icon">🔑</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  padding: 0,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {strength && (
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{
                  height: "3px",
                  background: "var(--bg-elevated)",
                  borderRadius: "99px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: strength.width,
                    background: strength.color,
                    borderRadius: "99px",
                    transition: "all 0.3s ease",
                  }} />
                </div>
                <div style={{ fontSize: "0.72rem", color: strength.color, marginTop: "0.25rem" }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="form-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="form-input-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Account Role</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">👤 User — Standard access</option>
              <option value="admin">👑 Admin — Full admin access</option>
            </select>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm" /> Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-2" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
