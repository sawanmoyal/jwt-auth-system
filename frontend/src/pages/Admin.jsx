import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [sr, ur] = await Promise.all([api.get("/admin/stats"), api.get("/admin/users?limit=20")]);
      setStats(sr.data.stats);
      setUsers(ur.data.users);
    } catch (e) { setError(e.response?.data?.message || "Failed to load."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id, name) => {
    setToggling(id); setMsg(null);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle`);
      setUsers(p => p.map(u => u._id===id ? { ...u, isActive:res.data.user.isActive } : u));
      setMsg({ t:"success", m:`${name} ${res.data.user.isActive?"activated":"deactivated"}.` });
      const sr = await api.get("/admin/stats");
      setStats(sr.data.stats);
    } catch (e) { setMsg({ t:"error", m: e.response?.data?.message||"Failed." }); }
    finally { setToggling(null); }
  };

  const fmt = d => d ? new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" }) : "—";

  if (loading) return (
    <div className="loading-screen">
      <div className="loader-ring" />
      <span>Loading admin panel…</span>
    </div>
  );

  return (
    <div className="page">
      <div className="ph">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="ph-title" style={{ marginBottom:0 }}>Admin</div>
          <span className="badge b-admin">👑 Admin access</span>
        </div>
        <div className="ph-sub">Platform overview and user management</div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}
      {msg   && <div className={`alert ${msg.t==="error"?"alert-error":"alert-success"}`}>{msg.t==="error"?"⚠":"✓"} {msg.m}</div>}

      {/* STATS */}
      {stats && (
        <div className="stats-row">
          {[
            { n: stats.totalUsers,  l:"Total users" },
            { n: stats.activeUsers, l:"Active users" },
            { n: stats.adminUsers,  l:"Admins" },
            { n: stats.recentUsers, l:"New this week" },
          ].map((s,i) => (
            <div key={i} className="stat">
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Users</div>
            <div className="card-header-sub">{users.length} registered accounts</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={load}>↻ Refresh</button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
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
              {users.map(u => {
                const ini = u.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
                const self = user?.id === u._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="tbl-user">
                        <div className="tbl-av">{ini}</div>
                        <div>
                          <div className="tbl-name">
                            {u.name}
                            {self && <span style={{ fontSize:11, color:"var(--ink4)", marginLeft:6, fontWeight:400 }}>(you)</span>}
                          </div>
                          <div className="tbl-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${u.role==="admin"?"b-admin":"b-user"}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive?"b-on":"b-off"}`}>{u.isActive?"Active":"Inactive"}</span></td>
                    <td style={{ color:"var(--ink3)", fontSize:13 }}>{fmt(u.createdAt)}</td>
                    <td>
                      {self ? (
                        <span style={{ fontSize:12, color:"var(--ink4)" }}>—</span>
                      ) : (
                        <button
                          className={`btn btn-xs ${u.isActive?"btn-danger":"btn-success"}`}
                          onClick={() => toggle(u._id, u.name)}
                          disabled={toggling===u._id}
                        >
                          {toggling===u._id ? <span className="spinner spinner-dark" /> : u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM */}
      {stats && (
        <div className="card" style={{ marginTop:16 }}>
          <div className="card-header">
            <div className="card-header-title">System</div>
          </div>
          <div className="card-body">
            <div className="info-table">
              <div className="info-row"><span className="info-k">Server time</span><span className="info-v">{new Date(stats.serverTime).toLocaleString()}</span></div>
              <div className="info-row"><span className="info-k">Auth method</span><span className="info-v">JWT + bcrypt + HTTP-only cookies</span></div>
              <div className="info-row"><span className="info-k">Environment</span><span className="info-v"><span className="badge b-on">Production</span></span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
