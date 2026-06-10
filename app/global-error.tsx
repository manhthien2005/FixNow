"use client";

import { useEffect } from "react";

// Replaces the root layout when an error is thrown there, so it cannot rely on
// app providers or globals.css — styles are inlined and copy is Vietnamese.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0e14",
          color: "#e6e8ee",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          Đã xảy ra lỗi nghiêm trọng
        </h1>
        <p style={{ marginTop: "0.75rem", color: "#9aa3b2", maxWidth: 440 }}>
          Hệ thống gặp sự cố không mong muốn. Vui lòng tải lại trang.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            height: 44,
            padding: "0 1.5rem",
            borderRadius: 12,
            border: "1px solid #2a3242",
            background: "#3b5bff",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tải lại trang
        </button>
      </body>
    </html>
  );
}
