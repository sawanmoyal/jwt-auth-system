import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [local, setLocal] = useState("");

  const change = e => { clearError(); setLocal(""); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };

  const submit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setLocal("Please fill in all fields."); return; }
    const r = await login(form.email.trim(), form.password);
    if (r.success) navigate(from, { replace: true });
  };

  const err = local || error;

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-h">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        {err && (
          <div className="alert alert-error">
            <span>⚠</span> {err}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className="fg">
            <label className="fl">Email</label>
            <div className="fi-wrap">
              <span className="fi-ico">@</span>
              <input className={`fi${err?" err":""}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} autoComplete="email" autoFocus />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <div className="fi-wrap">
              <span className="fi-ico">*</span>
              <input className={`fi${err?" err":""}`} type="password" name="password" placeholder="Your password" value={form.password} onChange={change} autoComplete="current-password" />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ padding: "9px 16px", fontSize: 14 }}>
              {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
            </button>
          </div>
        </form>

        <div className="div-row">or</div>

        <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"12px 14px", fontSize:13, color:"var(--ink3)", marginBottom:20 }}>
          <div style={{ fontWeight:600, color:"var(--ink2)", marginBottom:6 }}>Demo accounts</div>
          <div style={{ cursor:"pointer", marginBottom:4 }} onClick={() => setForm({ email:"user@demo.com", password:"demo123" })}>
            👤 <span style={{ color:"var(--blue)" }}>user@demo.com</span> / demo123
          </div>
          <div style={{ cursor:"pointer" }} onClick={() => setForm({ email:"admin@demo.com", password:"admin123" })}>
            👑 <span style={{ color:"var(--purple)" }}>admin@demo.com</span> / admin123
          </div>
        </div>

        <p style={{ textAlign:"center", fontSize:13, color:"var(--ink3)" }}>
          No account? <Link to="/register" style={{ fontWeight:500 }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
