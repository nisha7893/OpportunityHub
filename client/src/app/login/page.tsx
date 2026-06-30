"use client";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ecfdf8 0%, #ffffff 60%, #d1fae5 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: "52px" }}>🚀</div>

        <h1
          style={{
            marginTop: "10px",
            fontSize: "34px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          OpportunityHub
        </h1>

        <p
          style={{
            marginTop: "18px",
            fontSize: "26px",
            fontWeight: "600",
            color: "#0f766e",
          }}
        >
          Login Coming Soon
        </p>

        <p
          style={{
            marginTop: "18px",
            color: "#64748b",
            lineHeight: "28px",
            fontSize: "17px",
          }}
        >
          We're building a secure authentication system.
          <br />
          Until then, you can explore internships and jobs on the homepage.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "35px",
            background: "#0f766e",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 34px",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(15,118,110,0.25)",
          }}
        >
          ← Back to Home
        </button>

        <p
          style={{
            marginTop: "22px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          Version 1.0 • Authentication will be available soon.
        </p>
      </div>
    </div>
  );
}