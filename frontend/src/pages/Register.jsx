import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", role:"user" });
  const [local, setLocal] = useState("");
  const [show, setShow] = useState(false);

  const change = e => { clearError(); setLocal(""); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };

  const strength = v => {
    if (!v) return null;
    if (v.length < 6) return { l:"Too short", c:"var(--red)", w:"20%" };
    if (v.length < 8) return { l:"Weak", c:"var(--amber)", w:"45%" };
    if (v.length < 12 || !/\d/.test(v)) return { l:"Good", c:"var(--blue)", w:"70%" };
    return { l:"Strong", c:"var(--green)", w:"100%" };
  };

  const str = strength(form.password);

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim() || form.name.trim().length < 2) { setLocal("Name must be at least 2 characters."); return; }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setLocal("Please enter a valid email."); return; }
    if (form.password.length < 6) { setLocal("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setLocal("Passwords do not match."); return; }
    const r = await register(form.name.trim(), form.email.trim().toLowerCase(), form.password, form.role);
    if (r.success) navigate("/dashboard");
  };

  const err = local || error;

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-icon">✦</div>
        <h1 className="auth-h">Create an account</h1>
        <p className="auth-sub">Get started in seconds</p>

        {err && <div className="alert alert-error"><span>⚠</span> {err}</div>}

        <form onSubmit={submit} noValidate>
          <div className="fg">
            <label className="fl">Full name</label>
            <div className="fi-wrap">
              <span className="fi-ico">A</span>
              <input className="fi" type="text" name="name" placeholder="Your name" value={form.name} onChange={change} autoFocus />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Email</label>
            <div className="fi-wrap">
              <span className="fi-ico">@</span>
              <input className="fi" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} autoComplete="email" />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <div className="fi-wrap" style={{ position:"relative" }}>
              <span className="fi-ico">*</span>
              <input className="fi" type={show?"text":"password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={change} style={{ paddingRight:52 }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:"var(--ink3)", fontFamily:"var(--font)" }}>
                {show?"hide":"show"}
              </button>
            </div>
            {str && (
              <div style={{ marginTop:5 }}>
                <div style={{ height:2, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:str.w, background:str.c, borderRadius:99, transition:"all .3s" }} />
                </div>
                <div style={{ fontSize:11, color:str.c, marginTop:3 }}>{str.l}</div>
              </div>
            )}
          </div>
          <div className="fg">
            <label className="fl">Confirm password</label>
            <div className="fi-wrap">
              <span className="fi-ico">*</span>
              <input className="fi" type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={change} />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Role</label>
            <select className="fsel" name="role" value={form.role} onChange={change}>
              <option value="user">User — Standard access</option>
              <option value="admin">Admin — Full admin access</option>
            </select>
          </div>
          <div style={{ marginTop:20 }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ padding:"9px 16px", fontSize:14 }}>
              {loading ? <><span className="spinner" /> Creating account…</> : "Create account →"}
            </button>
          </div>
        </form>

        <p style={{ textAlign:"center", fontSize:13, color:"var(--ink3)", marginTop:20 }}>
          Already have an account? <Link to="/login" style={{ fontWeight:500 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
