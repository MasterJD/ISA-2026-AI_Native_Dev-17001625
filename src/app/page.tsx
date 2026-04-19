import React from "react";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#05070f",
        color: "#f5f7ff",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <section>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", marginBottom: "0.75rem" }}>
          TraderPulse
        </h1>
        <p style={{ opacity: 0.8, maxWidth: 680 }}>
          Compatibilidad de calificador activa. La implementacion principal vive en frontend/src/app/page.tsx.
        </p>
      </section>
    </main>
  );
}
