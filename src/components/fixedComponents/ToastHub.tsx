"use client";

import { Toaster } from "react-hot-toast";

export default function ToastHub() {
  return (
    <Toaster
      position="bottom-center"
      gutter={10}
      toastOptions={{
        duration: 3200,
        className:
          "!bg-surface !text-foreground !border !border-border !shadow-[var(--shadow-lift)] !rounded-xl !text-sm !px-4 !py-3 !max-w-[92vw]",
        success: { iconTheme: { primary: "var(--success)", secondary: "var(--surface)" } },
        error: { iconTheme: { primary: "var(--destructive)", secondary: "var(--surface)" } },
      }}
    />
  );
}
