import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [logoutAllBusy, setLogoutAllBusy] = useState(false);

  const initials = user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";
  const isAdmin = user?.role === "admin";

  const save = async e => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) { setMsg({ t:"error", m:"Name must be at least 2 characters." }); return; }
    setSaving(true); setMsg(null);
    try {
      const res = await api.put("/user/profile", { name: name.trim() });
      updateUser({ name: res.data.user.name });
      setMsg({ t:"success", m:"Profile updated." });
      setEdit(false);
    } catch (err) {
      setMsg({ t:"error", m: err.response?.data?.message || "Update failed." });
    } finally { setSaving(false); }
  };

  const logoutAll = async () => {
    if (!confirm("Log out from all devices?")) return;
    setLogoutAllBusy(true);
    try { await api.post("/auth/logout-all"); await logout(); }
    catch { setLogoutAllBusy(false); }
  };

  const fmt = d => d ? new Date(d).toLocaleDateString("en-US",{ year:"numeric", month:"long", day:"numeric" }) : "—";

  return (
    <div className="page-sm">
      <div className="ph">
        <div className="ph-title">Profile</div>
        <div className="ph-sub">Manage your account information</div>
      </div>

      {msg && (
        <div className={`alert ${msg.t==="error"?"alert-error":"alert-success"}`}>
          {msg.t==="error"?"⚠":"✓"} {msg.m}
        </div>
      )}

      <div className="prof-grid">
        {/* Avatar card */}
        <div className="card">
          <div className="prof-av-wrap">
            <div className="av">{initials}</div>
            <div>
              <div className="av-name">{user?.name}</div>
              <div className="av-email">{user?.email}</div>
            </div>
            <span className={`badge ${isAdmin?"b-admin":"b-user"}`}>
              {isAdmin ? "👑 Admin" : "👤 User"}
            </span>
            <div style={{ width:"100%", textAlign:"center", padding:"8px 12px", background:"var(--green-bg)", border:"1px solid var(--green-b)", borderRadius:"var(--r)", fontSize:12, color:"var(--green)" }}>
              ● Account active
            </div>
          </div>
        </div>

        {/* Info + edit */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-header-title">Account information</div>
                <div className="card-header-sub">Your personal details</div>
              </div>
              {!edit && (
                <button className="btn btn-secondary btn-sm" onClick={() => { setEdit(true); setMsg(null); setName(user?.name||""); }}>
                  Edit
                </button>
              )}
            </div>
            <div className="card-body">
              {edit ? (
                <form onSubmit={save}>
                  <div className="fg">
                    <label className="fl">Full name</label>
                    <div className="fi-wrap">
                      <span className="fi-ico">A</span>
                      <input className="fi" type="text" value={name} onChange={e=>setName(e.target.value)} autoFocus />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                      {saving ? <><span className="spinner" /> Saving…</> : "Save changes"}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEdit(false); setMsg(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-table">
                  <div className="info-row"><span className="info-k">Full name</span><span className="info-v">{user?.name}</span></div>
                  <div className="info-row"><span className="info-k">Email</span><span className="info-v">{user?.email}</span></div>
                  <div className="info-row"><span className="info-k">Role</span><span className="info-v"><span className={`badge ${isAdmin?"b-admin":"b-user"}`}>{user?.role}</span></span></div>
                  <div className="info-row"><span className="info-k">Member since</span><span className="info-v">{fmt(user?.createdAt)}</span></div>
                  <div className="info-row"><span className="info-k">User ID</span><span className="info-v mono" style={{ fontSize:11, color:"var(--ink3)" }}>{user?.id}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-header-title">Security</div>
                <div className="card-header-sub">Manage your sessions</div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"var(--r)" }}>
                <div>
                  <div style={{ fontSize:13.5, fontWeight:500, color:"var(--ink)" }}>Sign out everywhere</div>
                  <div style={{ fontSize:12, color:"var(--ink3)", marginTop:2 }}>Invalidates all active sessions on all devices</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={logoutAll} disabled={logoutAllBusy}>
                  {logoutAllBusy ? <span className="spinner spinner-dark" /> : "Sign out all"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
