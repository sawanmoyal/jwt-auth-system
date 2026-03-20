import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [secs, setSecs] = useState(900);

  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    if (t) {
      try {
        const d = JSON.parse(atob(t.split(".")[1]));
        setSecs(Math.max(0, d.exp - Math.floor(Date.now()/1000)));
      } catch {}
    }
    const iv = setInterval(() => {
      const tok = localStorage.getItem("accessToken");
      if (tok) {
        try {
          const d = JSON.parse(atob(tok.split(".")[1]));
          setSecs(Math.max(0, d.exp - Math.floor(Date.now()/1000)));
        } catch {}
      }
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = s => {
    const m = Math.floor(s/60), sc = s%60;
    return m > 0 ? `${m}m ${sc}s` : `${sc}s`;
  };

  const greet = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  const initials = user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  const FEATURES = [
    { ico:"👤", title:"Profile", desc:"Update your name and view account details.", to:"/profile" },
    { ico:"🔄", title:"Token Refresh", desc:"Refresh tokens rotate automatically on each use.", to:null },
    { ico:"🍪", title:"HTTP-Only Cookie", desc:"Refresh token stored securely — XSS immune.", to:null },
    ...(isAdmin ? [{ ico:"👑", title:"Admin Panel", desc:"Manage users and view platform stats.", to:"/admin" }] : []),
  ];

  return (
    <div className="page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-greet">{greet()}</div>
        <div className="hero-name">Hey, <em>{user?.name?.split(" ")[0] || "there"}</em> 👋</div>
        <div className="hero-meta">
          <span className={`badge ${isAdmin?"b-admin":"b-user"}`}>
            {isAdmin ? "👑 Admin" : "👤 User"}
          </span>
          <span className="badge b-on">● Active</span>
          <div className="tok-bar">
            <span className="tok-dot" />
            Token expires in {fmt(secs)}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat">
          <div className="stat-n">JWT</div>
          <div className="stat-l">Auth method</div>
        </div>
        <div className="stat">
          <div className="stat-n" style={{ color:"var(--green)" }}>{fmt(secs)}</div>
          <div className="stat-l">Token remaining</div>
        </div>
        <div className="stat">
          <div className="stat-n">Auto</div>
          <div className="stat-l">Refresh mode</div>
        </div>
        <div className="stat">
          <div className="stat-n">Secure</div>
          <div className="stat-l">Cookie storage</div>
        </div>
      </div>

      {/* INFO GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-header-title">Account</div>
              <div className="card-header-sub">Your session details</div>
            </div>
          </div>
          <div className="card-body">
            <div className="info-table">
              <div className="info-row"><span className="info-k">Name</span><span className="info-v">{user?.name}</span></div>
              <div className="info-row"><span className="info-k">Email</span><span className="info-v" style={{ fontSize:12.5 }}>{user?.email}</span></div>
              <div className="info-row"><span className="info-k">Role</span><span className="info-v"><span className={`badge ${isAdmin?"b-admin":"b-user"}`}>{user?.role}</span></span></div>
              <div className="info-row"><span className="info-k">User ID</span><span className="info-v mono" style={{ fontSize:11.5, color:"var(--ink3)" }}>{user?.id?.slice(-8)}…</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-header-title">Token</div>
              <div className="card-header-sub">Access token metadata</div>
            </div>
          </div>
          <div className="card-body">
            <div className="info-table">
              <div className="info-row"><span className="info-k">Expires in</span><span className="info-v" style={{ color: secs<60?"var(--red)":"var(--green)" }}>{fmt(secs)}</span></div>
              <div className="info-row"><span className="info-k">Issued at</span><span className="info-v">{new Date().toLocaleTimeString()}</span></div>
              <div className="info-row"><span className="info-k">Algorithm</span><span className="info-v mono">HS256</span></div>
              <div className="info-row"><span className="info-k">Auto-refresh</span><span className="info-v"><span className="badge b-on">Enabled</span></span></div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="sh">
        <div>
          <div className="sh-title">Features</div>
          <div className="sh-sub">Available for your account</div>
        </div>
      </div>
      <div className="feat-grid">
        {FEATURES.map((f,i) => (
          <div key={i} className="feat-card">
            <div className="feat-ico">{f.ico}</div>
            <div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
            {f.to ? (
              <Link to={f.to}><button className="btn btn-secondary btn-sm" style={{ marginTop:"auto" }}>Open →</button></Link>
            ) : (
              <span className="badge b-on" style={{ marginTop:"auto", alignSelf:"flex-start" }}>Active</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
