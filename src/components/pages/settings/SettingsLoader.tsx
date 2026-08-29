"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslateStore } from "@/store/useTranslateStore";
import type Settings from "@/types/settings";

function apply(settings?: Partial<Settings> | null) {
  if (!settings) return;
  const { setLanguages, setTranslationType } = useTranslateStore.getState();

  if (Array.isArray(settings.selectedLanguages) && settings.selectedLanguages.length) {
    setLanguages(settings.selectedLanguages);
  }
  if (settings.translationType) {
    setTranslationType(settings.translationType);
  }
}

export default function SettingsLoader() {
  const { data: session, status } = useSession();
  const seenAt = useRef(0);

  const load = useCallback(async () => {
    if (!session?.user?.id) {
      try {
        const local = localStorage.getItem("lasu-settings");
        if (local) apply(JSON.parse(local));
      } catch {
        localStorage.removeItem("lasu-settings");
      }
      return;
    }

    try {
      const res = await fetch("/api/settings", { credentials: "include" });
      if (!res.ok) return;

      const data = (await res.json()) as {
        settings?: Partial<Settings> | null;
        updatedAt?: number;
      };

      const stamp = Number(data?.updatedAt) || 0;
      if (stamp && stamp <= seenAt.current) return;

      seenAt.current = stamp;
      apply(data?.settings);
    } catch {}
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;
    load();
  }, [status, load]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const onFocus = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [status, load]);

  return null;
}
