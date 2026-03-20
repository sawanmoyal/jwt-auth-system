import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{
        fontSize: "5rem",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        color: "var(--border)",
        letterSpacing: "-0.05em",
        lineHeight: 1,
        marginBottom: "0.5rem",
      }}>
        404
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        marginBottom: "0.75rem",
      }}>
        Page Not Found
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "320px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">← Back to Home</Link>
    </div>
  );
}
