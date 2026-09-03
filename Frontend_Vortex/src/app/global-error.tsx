"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui", padding: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "#1e3a5f" }}>Something went wrong</h2>
        <button
          onClick={() => reset()}
          style={{ background: "#0d9488", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
