import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setMessage({ type: "error", text: "Name must be at least 2 characters." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put("/user/profile", { name: name.trim() });
      updateUser({ name: res.data.user.name });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("This will log you out from ALL devices. Continue?")) return;
    setLogoutAllLoading(true);
    try {
      await api.post("/auth/logout-all");
      await logout();
    } catch {
      setLogoutAllLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account details and security settings</p>
      </div>

      {message && (
        <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
          <span className="alert-icon">{message.type === "error" ? "⚠️" : "✅"}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-grid">
        {/* Left — Avatar + quick info */}
        <div className="card profile-avatar-section">
          <div className="avatar-ring">{initials}</div>
          <div>
            <div className="profile-name-display">{user?.name}</div>
            <div className="profile-email-display">{user?.email}</div>
          </div>
          <span className={`badge ${user?.role === "admin" ? "badge-admin" : "badge-user"}`}>
            {user?.role === "admin" ? "👑 Administrator" : "👤 User"}
          </span>
          <div style={{
            background: "var(--success-bg)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            fontSize: "0.8rem",
            color: "#6ee7b7",
            width: "100%",
            textAlign: "center",
          }}>
            ● Account Active
          </div>
        </div>

        {/* Right — Details + edit */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <div className="section-header" style={{ marginBottom: "1rem" }}>
              <div>
                <div className="card-title">Account Information</div>
                <div className="card-subtitle">Your personal details</div>
              </div>
              {!editMode && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setEditMode(true); setMessage(null); setName(user?.name || ""); }}
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                    <span className="form-input-icon">👤</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                    {saving ? <><span className="spinner-sm" /> Saving…</> : "✓ Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setEditMode(false); setMessage(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role</span>
                  <span className={`badge ${user?.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {user?.role}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{formatDate(user?.createdAt)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">User ID</span>
                  <span className="info-value" style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {user?.id}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Security section */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "0.25rem" }}>Security</div>
            <div className="card-subtitle" style={{ marginBottom: "1.25rem" }}>Manage your sessions</div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem",
              background: "var(--bg-surface)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>
                  🚪 Logout All Devices
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Invalidates all refresh tokens across all devices
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogoutAll}
                disabled={logoutAllLoading}
              >
                {logoutAllLoading ? <span className="spinner-sm" /> : "Logout All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
