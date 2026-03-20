import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🔐</div>
          AuthSystem
        </NavLink>

        <div className="navbar-nav">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  <span className="nav-badge">👑 Admin</span>
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-logout"
              >
                {loggingOut ? "…" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
