import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: "🔐", title: "JWT Authentication", desc: "Stateless access tokens with 15-minute expiry and automatic silent refresh." },
    { icon: "🍪", title: "HTTP-Only Cookies", desc: "Refresh tokens stored in secure HTTP-only cookies, fully immune to XSS attacks." },
    { icon: "👑", title: "Role-Based Access", desc: "Granular Admin and User roles with server-side and client-side route protection." },
    { icon: "🔒", title: "Password Security", desc: "Industry-standard bcrypt hashing with 12 salt rounds — never stored in plaintext." },
    { icon: "🛡️", title: "Security Hardened", desc: "Helmet.js headers, CORS whitelisting, and rate limiting on all auth endpoints." },
    { icon: "⚡", title: "Auto Token Refresh", desc: "Axios interceptors silently re-authenticate expired sessions in the background." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Hero */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "7rem 1.5rem 5rem",
        textAlign: "center",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "-200px", left: "50%",
          transform: "translateX(-50%)",
          width: "800px", height: "800px",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        {/* Status pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "99px",
          padding: "0.35rem 1rem",
          fontSize: "0.78rem",
          color: "#6ee7b7",
          fontWeight: 600,
          letterSpacing: "0.04em",
          marginBottom: "2rem",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
          Live — Fully Deployed on Render &amp; Vercel
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          color: "var(--text-primary)",
        }}>
          Secure Authentication
          <br />
          <span style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Built for Production
          </span>
        </h1>

        <p style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          maxWidth: "540px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.75,
        }}>
          A full-stack MERN authentication system with JWT access and refresh tokens,
          role-based access control, and enterprise-grade security practices.
        </p>

        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                Get Started →
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Tech pills */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "3rem" }}>
          {["Node.js", "Express.js", "MongoDB Atlas", "JWT", "bcrypt", "React 18", "Vite", "Axios"].map((t) => (
            <span key={t} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "99px",
              padding: "0.3rem 0.875rem",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "4rem",
        }}>
          {[
            { value: "15min", label: "Access Token Expiry" },
            { value: "7 days", label: "Refresh Token Expiry" },
            { value: "12×", label: "bcrypt Salt Rounds" },
            { value: "100%", label: "Route Protected" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              padding: "1.5rem",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "-0.02em",
                marginBottom: "0.3rem",
              }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}>
            Security-first by design
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto" }}>
            Every layer of the stack is hardened against common attack vectors
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginBottom: "3rem",
        }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{
                fontSize: "1.4rem",
                width: "44px", height: "44px",
                background: "var(--bg-elevated)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                border: "1px solid var(--border)",
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.35rem" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* API Reference */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "5rem",
        }}>
          <div style={{
            background: "var(--bg-elevated)",
            padding: "0.875rem 1.25rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            borderBottom: "1px solid var(--border)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            REST API Reference
          </div>
          <div style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: "0.82rem" }}>
            {[
              { method: "POST", path: "/api/auth/register", color: "#10b981", label: "Create account" },
              { method: "POST", path: "/api/auth/login",    color: "#3b82f6", label: "Authenticate user" },
              { method: "POST", path: "/api/auth/refresh",  color: "#f59e0b", label: "Rotate tokens" },
              { method: "POST", path: "/api/auth/logout",   color: "#ef4444", label: "Invalidate session" },
              { method: "GET",  path: "/api/user/profile",  color: "#3b82f6", label: "Get profile  🔒 Auth required" },
              { method: "PUT",  path: "/api/user/profile",  color: "#3b82f6", label: "Update profile  🔒 Auth required" },
              { method: "GET",  path: "/api/admin/stats",   color: "#a78bfa", label: "Platform stats  👑 Admin only" },
              { method: "GET",  path: "/api/admin/users",   color: "#a78bfa", label: "List users  👑 Admin only" },
            ].map((e, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                padding: "0.55rem 0",
                borderBottom: i < 7 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ color: e.color, fontWeight: 700, minWidth: "44px", fontSize: "0.72rem" }}>
                  {e.method}
                </span>
                <span style={{ color: "var(--text-primary)" }}>{e.path}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginLeft: "auto", whiteSpace: "nowrap" }}>
                  {e.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
