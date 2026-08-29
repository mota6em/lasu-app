"use client";

import { useEffect, useState } from "react";

function format(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  if (hours) return `${hours}h ${pad(minutes)}m`;
  if (minutes) return `${minutes}m ${pad(seconds)}s`;
  return `${seconds}s`;
}

export function useCountdown(resetAt: number | null | undefined) {
  const [left, setLeft] = useState(() =>
    resetAt ? Math.max(0, resetAt - Date.now()) : 0,
  );

  useEffect(() => {
    if (!resetAt) return;
    setLeft(Math.max(0, resetAt - Date.now()));

    const timer = setInterval(() => {
      const remaining = Math.max(0, resetAt - Date.now());
      setLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [resetAt]);

  return { left, elapsed: Boolean(resetAt) && left <= 0, label: format(left) };
}

export function Countdown({
  resetAt,
  className,
  render,
}: {
  resetAt: number | null | undefined;
  className?: string;
  render: (label: string, elapsed: boolean) => React.ReactNode;
}) {
  const { label, elapsed } = useCountdown(resetAt);
  if (!resetAt) return null;
  return <span className={className}>{render(label, elapsed)}</span>;
}
