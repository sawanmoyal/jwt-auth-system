import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: "🔐", title: "JWT Authentication", desc: "Stateless access tokens with 15-minute expiry and automatic silent refresh via interceptors." },
    { icon: "🍪", title: "HTTP-Only Cookies", desc: "Refresh tokens stored in secure cookies — completely immune to XSS attacks." },
    { icon: "👑", title: "Role-Based Access", desc: "Admin and User roles with full server-side and client-side route protection." },
    { icon: "🔒", title: "Password Security", desc: "bcrypt hashing with 12 salt rounds. Passwords never stored in plaintext." },
    { icon: "🛡️", title: "Security Headers", desc: "Helmet.js, CORS whitelisting, and rate limiting on every auth endpoint." },
    { icon: "⚡", title: "Token Auto-Refresh", desc: "Axios interceptors silently re-authenticate sessions without disrupting the user." },
  ];

  const endpoints = [
    { method: "POST", path: "/api/auth/register", color: "#34d399", label: "Create account" },
    { method: "POST", path: "/api/auth/login",    color: "#4f8ef7", label: "Authenticate" },
    { method: "POST", path: "/api/auth/refresh",  color: "#fbbf24", label: "Rotate tokens" },
    { method: "POST", path: "/api/auth/logout",   color: "#f87171", label: "End session" },
    { method: "GET",  path: "/api/user/profile",  color: "#4f8ef7", label: "Profile — Auth required" },
    { method: "PUT",  path: "/api/user/profile",  color: "#4f8ef7", label: "Update — Auth required" },
    { method: "GET",  path: "/api/admin/stats",   color: "#a78bfa", label: "Stats — Admin only" },
    { method: "GET",  path: "/api/admin/users",   color: "#a78bfa", label: "Users — Admin only" },
  ];

  const S = {
    page: { minHeight: "100vh", background: "var(--bg)" },
    hero: { position: "relative", overflow: "hidden", padding: "clamp(3.5rem,8vw,6rem) 1.25rem clamp(2.5rem,5vw,4rem)", textAlign: "center" },
    glow: { position: "absolute", top: "-180px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(79,142,247,0.09) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none" },
    pill: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "99px", padding: "5px 14px", fontSize: "clamp(11px,2.5vw,13px)", color: "#34d399", fontWeight: 600, letterSpacing: "0.03em", marginBottom: "1.75rem" },
    dot: { width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", flexShrink: 0 },
    h1: { fontSize: "clamp(2rem,6vw,3.75rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: "1.25rem", color: "var(--t1)" },
    grad: { background: "linear-gradient(135deg,#4f8ef7,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
    sub: { fontSize: "clamp(0.9rem,2.5vw,1.05rem)", color: "var(--t2)", maxWidth: "520px", margin: "0 auto 2.25rem", lineHeight: 1.75 },
    btns: { display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" },
    pills: { display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" },
    tp: { background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "99px", padding: "4px 12px", fontSize: "clamp(11px,2vw,13px)", color: "var(--t2)", fontWeight: 500 },
    wrap: { maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem clamp(3rem,6vw,5rem)" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden", margin: "clamp(1.5rem,4vw,2.5rem) 0" },
    statCell: { background: "var(--bg-2)", padding: "clamp(1rem,3vw,1.5rem)", textAlign: "center" },
    statVal: { fontSize: "clamp(1.35rem,3vw,1.85rem)", fontWeight: 800, color: "var(--blue)", letterSpacing: "-0.02em", marginBottom: "4px", fontFamily: "var(--font)" },
    statLbl: { fontSize: "clamp(10px,2vw,12px)", color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 },
    secHead: { textAlign: "center", marginBottom: "clamp(1.5rem,4vw,2.5rem)" },
    secTitle: { fontSize: "clamp(1.3rem,3.5vw,1.75rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--t1)", marginBottom: "0.4rem" },
    secSub: { fontSize: "clamp(13px,2.5vw,15px)", color: "var(--t2)", maxWidth: "380px", margin: "0 auto" },
    featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "0.875rem", marginBottom: "clamp(2rem,5vw,3.5rem)" },
    fc: { background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.1rem 1.2rem", display: "flex", gap: "0.875rem", alignItems: "flex-start", transition: "border-color 0.18s" },
    fIco: { width: "38px", height: "38px", background: "var(--bg-4)", border: "1px solid var(--border-2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
    fTitle: { fontWeight: 700, fontSize: "clamp(13px,2.5vw,14px)", color: "var(--t1)", marginBottom: "4px" },
    fDesc: { fontSize: "clamp(12px,2vw,13px)", color: "var(--t2)", lineHeight: 1.55 },
    apiBox: { background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" },
    apiHead: { background: "var(--bg-3)", padding: "10px 16px", fontSize: "11px", color: "var(--t3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px" },
    apiRow: { display: "flex", gap: "12px", alignItems: "center", padding: "9px 16px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" },
    method: { fontWeight: 700, fontSize: "11px", minWidth: "40px", fontFamily: "var(--mono)" },
    path: { color: "var(--t1)", fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,13px)", flex: 1, minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    label: { fontSize: "11px", color: "var(--t3)", marginLeft: "auto", whiteSpace: "nowrap" },
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.glow} />
        <div style={S.pill}>
          <span style={S.dot} />
          Live — Deployed on Render &amp; Vercel
        </div>
        <h1 style={S.h1}>
          Secure Authentication<br />
          <span style={S.grad}>Built for Production</span>
        </h1>
        <p style={S.sub}>
          A full-stack MERN authentication system with JWT access and refresh tokens,
          role-based access control, and enterprise-grade security practices.
        </p>
        <div style={S.btns}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: "clamp(14px,2.5vw,16px)", padding: "0.75rem 1.75rem" }}>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: "clamp(14px,2.5vw,16px)", padding: "0.75rem 1.75rem" }}>
                Get Started →
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: "clamp(14px,2.5vw,16px)", padding: "0.75rem 1.75rem" }}>
                Sign In
              </Link>
            </>
          )}
        </div>
        <div style={S.pills}>
          {["Node.js","Express.js","MongoDB Atlas","JWT","bcrypt","React 18","Vite","Axios"].map(t => (
            <span key={t} style={S.tp}>{t}</span>
          ))}
        </div>
      </div>

      <div style={S.wrap}>
        {/* Stats */}
        <div style={{ ...S.statsRow, gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))" }}>
          {[
            { value: "15 min", label: "Token Expiry" },
            { value: "7 days", label: "Refresh Token" },
            { value: "12×",    label: "bcrypt Rounds" },
            { value: "100%",   label: "Routes Protected" },
          ].map((s, i) => (
            <div key={i} style={S.statCell}>
              <div style={S.statVal}>{s.value}</div>
              <div style={S.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={S.secHead}>
          <h2 style={S.secTitle}>Security-first by design</h2>
          <p style={S.secSub}>Every layer of the stack hardened against common attack vectors</p>
        </div>
        <div style={S.featureGrid}>
          {features.map((f, i) => (
            <div key={i} style={S.fc}>
              <div style={S.fIco}>{f.icon}</div>
              <div>
                <div style={S.fTitle}>{f.title}</div>
                <div style={S.fDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* API */}
        <div style={S.apiBox}>
          <div style={S.apiHead}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
            REST API Reference
          </div>
          <div>
            {endpoints.map((e, i) => (
              <div key={i} style={{ ...S.apiRow, borderBottom: i < endpoints.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ ...S.method, color: e.color }}>{e.method}</span>
                <span style={S.path}>{e.path}</span>
                <span style={S.label}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
