import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    await logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-in">
        <NavLink to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <div className="nav-logo-mark">S</div>
          <span>SecureAuth</span>
        </NavLink>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => "nav-a" + (isActive ? " cur" : "")}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => "nav-a" + (isActive ? " cur" : "")}>
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => "nav-pill" + (isActive ? " cur" : "")} style={{ textDecoration: "none" }}>
                  Admin
                </NavLink>
              )}
              <div style={{ width: 1, height: 20, background: "var(--border2)", margin: "0 4px" }} />
              <button onClick={handleLogout} disabled={busy} className="nav-logout">
                {busy ? "…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => "nav-a" + (isActive ? " cur" : "")}>
                Sign in
              </NavLink>
              <NavLink to="/register" style={{ textDecoration: "none" }}>
                <button className="btn btn-primary btn-sm">Get started</button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
