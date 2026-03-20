import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users?limit=20"),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (userId, currentName) => {
    setTogglingId(userId);
    setMessage(null);
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: res.data.user.isActive } : u
        )
      );
      setMessage({
        type: "success",
        text: `${currentName} has been ${res.data.user.isActive ? "activated" : "deactivated"}.`,
      });
      // Refresh stats
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Action failed." });
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-ring" />
        <p>Loading admin panel…</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h1 className="page-title">Admin Panel</h1>
          <span className="badge badge-admin">👑 Admin</span>
        </div>
        <p className="page-subtitle">Platform overview and user management</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
          <span className="alert-icon">{message.type === "error" ? "⚠️" : "✅"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[
            { icon: "👥", label: "Total Users", value: stats.totalUsers, color: "blue" },
            { icon: "✅", label: "Active Users", value: stats.activeUsers, color: "green" },
            { icon: "👑", label: "Admins", value: stats.adminUsers, color: "purple" },
            { icon: "🆕", label: "New This Week", value: stats.recentUsers, color: "amber" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users table */}
      <div className="section-header">
        <div>
          <div className="section-title">User Management</div>
          <div className="section-desc">{users.length} users registered</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchData}>
          ↻ Refresh
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const initials = u.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const isSelf = u._id === user?.id;

              return (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div
                        className="user-avatar-sm"
                        style={{
                          background: u.role === "admin"
                            ? "linear-gradient(135deg, #8b5cf6, #a78bfa)"
                            : "linear-gradient(135deg, #3b82f6, #60a5fa)",
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="user-name">
                          {u.name}
                          {isSelf && (
                            <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", color: "var(--accent)" }}>
                              (you)
                            </span>
                          )}
                        </div>
                        <div className="user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role === "admin" ? "👑" : "👤"} {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? "badge-active" : "badge-inactive"}`}>
                      {u.isActive ? "● Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.83rem" }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td>
                    {isSelf ? (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>—</span>
                    ) : (
                      <button
                        className={`btn btn-sm ${u.isActive ? "btn-danger" : "btn-success"}`}
                        onClick={() => handleToggle(u._id, u.name)}
                        disabled={togglingId === u._id}
                      >
                        {togglingId === u._id ? (
                          <span className="spinner-sm" />
                        ) : u.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Server info */}
      {stats && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-title" style={{ marginBottom: "0.75rem" }}>System Info</div>
          <div className="info-row">
            <span className="info-label">Server Time</span>
            <span className="info-value" style={{ fontSize: "0.85rem" }}>
              {new Date(stats.serverTime).toLocaleString()}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Regular Users</span>
            <span className="info-value">{stats.regularUsers}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Auth Method</span>
            <span className="info-value">JWT + bcrypt + HTTP-only Cookies</span>
          </div>
        </div>
      )}
    </div>
  );
}
