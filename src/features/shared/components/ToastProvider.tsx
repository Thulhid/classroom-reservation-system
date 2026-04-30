"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.14)",
          color: "#1e293b",
          fontSize: "14px",
          maxWidth: "360px",
          padding: "12px 14px",
        },
        success: {
          iconTheme: {
            primary: "#059669",
            secondary: "#ecfdf5",
          },
          style: {
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fef2f2",
          },
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
          },
        },
      }}
    />
  );
}
