import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);

  // Parse JWT to show token metadata (client-side, no secret needed)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        const expiresIn = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
        setTokenInfo({
          expiresIn,
          issuedAt: new Date(decoded.iat * 1000).toLocaleTimeString(),
          issuer: decoded.iss,
        });
      } catch {
        // ignore
      }
    }

    const interval = setInterval(() => {
      const t = localStorage.getItem("accessToken");
      if (t) {
        try {
          const [, p] = t.split(".");
          const d = JSON.parse(atob(p));
          setTokenInfo((prev) => ({
            ...prev,
            expiresIn: Math.max(0, d.exp - Math.floor(Date.now() / 1000)),
          }));
        } catch { /* ignore */ }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatExpiry = (secs) => {
    if (secs <= 0) return "Expired";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="dashboard-greeting">{getGreeting()}</div>
        <div className="dashboard-name">
          Hey, <span>{user?.name?.split(" ")[0] || "User"}</span> 👋
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span className={`badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
            {isAdmin ? "👑 Administrator" : "👤 User"}
          </span>
          <span className="badge badge-active">● Active Session</span>
          {tokenInfo && (
            <div className="token-status-bar">
              <div className="status-dot" />
              Token expires in {formatExpiry(tokenInfo.expiresIn)}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🔐</div>
          <div>
            <div className="stat-value">JWT</div>
            <div className="stat-label">Auth Method</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">Active</div>
            <div className="stat-label">Session Status</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🔄</div>
          <div>
            <div className="stat-value">15 min</div>
            <div className="stat-label">Token Expiry</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🍪</div>
          <div>
            <div className="stat-value">Secure</div>
            <div className="stat-label">Cookie Storage</div>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Account info */}
        <div className="card">
          <div className="card-title">Account Details</div>
          <div className="card-subtitle" style={{ marginBottom: "1rem" }}>Your current session info</div>
          <div className="info-row">
            <span className="info-label">Name</span>
            <span className="info-value">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value" style={{ fontSize: "0.83rem" }}>{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className={`badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {user?.role}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">User ID</span>
            <span className="info-value" style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {user?.id?.slice(-8)}…
            </span>
          </div>
        </div>

        {/* Token info */}
        <div className="card">
          <div className="card-title">Token Details</div>
          <div className="card-subtitle" style={{ marginBottom: "1rem" }}>Access token metadata</div>
          <div className="info-row">
            <span className="info-label">Expiry</span>
            <span className="info-value" style={{ color: tokenInfo?.expiresIn < 60 ? "var(--danger)" : "var(--success)" }}>
              {tokenInfo ? formatExpiry(tokenInfo.expiresIn) : "—"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Issued At</span>
            <span className="info-value" style={{ fontSize: "0.83rem" }}>
              {tokenInfo?.issuedAt || "—"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Issuer</span>
            <span className="info-value" style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>
              {tokenInfo?.issuer || "—"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Auto-Refresh</span>
            <span className="badge badge-active">Enabled</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="section-header">
        <div>
          <div className="section-title">Available Features</div>
          <div className="section-desc">All active for your account</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {[
          { icon: "👤", title: "Profile Management", desc: "Update your name and view account details.", link: "/profile", label: "View Profile" },
          { icon: "🔄", title: "Token Refresh", desc: "Refresh tokens rotate automatically on each use.", link: null, label: "Active" },
          { icon: "🍪", title: "HTTP-Only Cookies", desc: "Refresh token stored securely, immune to XSS.", link: null, label: "Secured" },
          ...(isAdmin ? [{ icon: "👑", title: "Admin Panel", desc: "Manage all users and view platform stats.", link: "/admin", label: "Open Panel" }] : []),
        ].map((feat, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "1.75rem" }}>{feat.icon}</div>
            <div>
              <div className="card-title">{feat.title}</div>
              <div className="card-subtitle" style={{ marginTop: "0.3rem" }}>{feat.desc}</div>
            </div>
            {feat.link ? (
              <Link to={feat.link} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                {feat.label} →
              </Link>
            ) : (
              <span className="badge badge-active" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                ✓ {feat.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
