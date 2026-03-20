import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: "🔐", title: "JWT Auth", desc: "Access + Refresh token system with automatic rotation." },
    { icon: "🍪", title: "HTTP-Only Cookies", desc: "Refresh tokens in secure cookies. XSS-immune by design." },
    { icon: "👑", title: "Role-Based Access", desc: "Admin and User roles with protected route guards." },
    { icon: "🔒", title: "bcrypt Hashing", desc: "Passwords hashed with bcrypt at 12 salt rounds." },
    { icon: "🛡️", title: "Security Headers", desc: "Helmet.js security headers on every response." },
    { icon: "⚡", title: "Auto Token Refresh", desc: "Seamless silent re-auth via axios interceptors." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Hero */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
      }}>
        <div style={{
          position: "absolute",
          top: "-200px", left: "50%",
          transform: "translateX(-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: "99px",
          padding: "0.35rem 1rem",
          fontSize: "0.8rem",
          color: "var(--accent)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          marginBottom: "2rem",
        }}>
          🎓 Campus Placement Project — Fully Deployed
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          color: "var(--text-primary)",
        }}>
          Advanced JWT{" "}
          <span style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Authentication
          </span>
          <br />System
        </h1>

        <p style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          maxWidth: "520px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.7,
        }}>
          Production-ready auth with access + refresh tokens, role-based access control,
          HTTP-only cookies, and full MERN stack deployment.
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
          {["Node.js", "Express", "MongoDB Atlas", "JWT", "React", "Vite", "Render", "Vercel"].map((t) => (
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

      {/* Features */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}>
            Everything included
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            All placement requirements met and then some
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{
                fontSize: "1.5rem",
                width: "42px", height: "42px",
                background: "var(--bg-elevated)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* API preview */}
        <div style={{ marginTop: "3rem" }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            <div style={{
              background: "var(--bg-elevated)",
              padding: "0.75rem 1.25rem",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              API Endpoints
            </div>
            <div style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 2 }}>
              {[
                { method: "POST", path: "/api/auth/register", color: "#10b981", label: "Register" },
                { method: "POST", path: "/api/auth/login",    color: "#3b82f6", label: "Login" },
                { method: "POST", path: "/api/auth/refresh",  color: "#f59e0b", label: "Refresh Token" },
                { method: "POST", path: "/api/auth/logout",   color: "#ef4444", label: "Logout" },
                { method: "GET",  path: "/api/user/profile",  color: "#3b82f6", label: "Get Profile 🔒" },
                { method: "GET",  path: "/api/admin/stats",   color: "#a78bfa", label: "Admin Stats 👑" },
                { method: "GET",  path: "/api/admin/users",   color: "#a78bfa", label: "All Users 👑" },
              ].map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{
                    color: e.color, fontWeight: 700,
                    minWidth: "48px",
                    fontSize: "0.75rem",
                  }}>
                    {e.method}
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>{e.path}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "auto" }}>
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
