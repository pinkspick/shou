"use client";

import { useEffect } from "react";

/**
 * Global error boundary — catches failures in the root layout itself.
 * It REPLACES <html>/<body>, so it cannot rely on the app layout or its
 * fonts; branding is applied with inline styles to guarantee a polished
 * fallback even when everything else has failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[lumiere] global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 1.5rem",
          backgroundColor: "#f9f6f0",
          color: "#1a1a18",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <span style={{ fontSize: "2rem", color: "#b8962e" }} aria-hidden>
          ◆
        </span>
        <p
          style={{
            marginTop: "1.5rem",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(58,58,54,0.6)",
          }}
        >
          Error 500
        </p>
        <h1
          style={{
            marginTop: "1rem",
            maxWidth: "32rem",
            fontSize: "3rem",
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          A flaw in the setting.
        </h1>
        <p
          style={{
            marginTop: "1.25rem",
            maxWidth: "28rem",
            fontSize: "1.125rem",
            color: "#3a3a36",
          }}
        >
          Something went wrong on our end. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "2.25rem",
            borderRadius: "2px",
            border: "none",
            backgroundColor: "#1a1a18",
            color: "#f9f6f0",
            padding: "1rem 1.75rem",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
