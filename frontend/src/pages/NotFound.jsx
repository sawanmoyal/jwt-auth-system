import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div style={{ minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 24px" }}>
      <div style={{ fontSize:11, fontWeight:600, color:"var(--ink4)", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>404</div>
      <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:"-.5px", color:"var(--ink)", marginBottom:8 }}>Page not found</h1>
      <p style={{ fontSize:14, color:"var(--ink3)", marginBottom:24, maxWidth:320 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/"><button className="btn btn-secondary">← Back to home</button></Link>
    </div>
  );
}
