import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { ico: "🔐", title: "JWT Access Tokens", desc: "Short-lived 15-minute tokens with HS256 signing and issuer validation on every request." },
  { ico: "🍪", title: "HTTP-Only Cookies", desc: "Refresh tokens stored in secure cookies inaccessible to JavaScript — XSS-immune." },
  { ico: "🔄", title: "Token Rotation", desc: "Every refresh issues a new refresh token. Reuse detection invalidates compromised tokens." },
  { ico: "🔒", title: "bcrypt Hashing", desc: "12 salt rounds. Passwords are never stored — only their one-way hash." },
  { ico: "🛡️", title: "Security Headers", desc: "Helmet.js sets 15+ HTTP headers. CORS strictly whitelisted to your frontend domain." },
  { ico: "⚡", title: "Silent Auto-Refresh", desc: "Axios interceptors catch 401s and silently re-authenticate. Users never get logged out." },
];

const ENDPOINTS = [
  { m: "POST", p: "/api/auth/register",        c: "#16a34a", l: "Create account" },
  { m: "POST", p: "/api/auth/login",           c: "#2563eb", l: "Authenticate" },
  { m: "POST", p: "/api/auth/refresh",         c: "#d97706", l: "Rotate tokens" },
  { m: "POST", p: "/api/auth/logout",          c: "#dc2626", l: "End session" },
  { m: "GET",  p: "/api/user/profile",         c: "#2563eb", l: "Get profile — Auth" },
  { m: "PUT",  p: "/api/user/profile",         c: "#2563eb", l: "Update profile — Auth" },
  { m: "GET",  p: "/api/admin/stats",          c: "#7c3aed", l: "Platform stats — Admin" },
  { m: "GET",  p: "/api/admin/users",          c: "#7c3aed", l: "List users — Admin" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="home-wrap">
      {/* ── HERO ── */}
      <div className="home-hero">
        <div className="home-eyebrow">
          <span className="live-dot" />
          Live on Render &amp; Vercel
        </div>
        <h1 className="home-h1">
          Authentication<br />
          <span>built right.</span>
        </h1>
        <p className="home-p">
          A production-ready MERN stack authentication system — JWT access and refresh tokens, role-based access control, and enterprise security practices baked in.
        </p>
        <div className="home-btns">
          {isAuthenticated ? (
            <Link to="/dashboard"><button className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Go to dashboard →</button></Link>
          ) : (
            <>
              <Link to="/register"><button className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Get started →</button></Link>
              <Link to="/login"><button className="btn btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>Sign in</button></Link>
            </>
          )}
        </div>
        <div className="home-pills">
          {["Node.js","Express.js","MongoDB Atlas","JWT","bcrypt","React 18","Vite","Axios"].map(t => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="home-stats">
        {[
          { v: "15 min",  l: "Access token expiry" },
          { v: "7 days",  l: "Refresh token window" },
          { v: "12 ×",    l: "bcrypt salt rounds" },
          { v: "8",       l: "REST API endpoints" },
        ].map((s,i) => (
          <div key={i} className="hs">
            <div className="hs-val">{s.v}</div>
            <div className="hs-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <div className="home-feats">
        <div className="hf-head">
          <div className="hf-title">Security-first, from the ground up</div>
          <div className="hf-sub">Every layer hardened against the OWASP top 10</div>
        </div>
        <div className="hf-grid">
          {FEATURES.map((f,i) => (
            <div key={i} className="hf-card">
              <div className="hf-ico">{f.ico}</div>
              <div>
                <div className="hf-title2">{f.title}</div>
                <div className="hf-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── API ── */}
      <div className="api-box">
        <div className="api-hd">
          <span style={{ width:8,height:8,borderRadius:"50%",background:"var(--green)",display:"inline-block" }} />
          API Reference
        </div>
        <div className="api-body">
          {ENDPOINTS.map((e,i) => (
            <div key={i} className="api-row">
              <span className="api-method" style={{ color: e.c }}>{e.m}</span>
              <span className="api-path">{e.p}</span>
              <span className="api-label">{e.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
