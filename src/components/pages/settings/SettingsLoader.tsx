"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (status === "loading") return;

    const load = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/settings?userId=${session.user.id}`);
          if (!res.ok) return;
          const data = await res.json();
          apply(data?.settings);
        } catch {
          // keep whatever defaults are already in the store
        }
        return;
      }

      try {
        const local = localStorage.getItem("lasu-settings");
        if (local) apply(JSON.parse(local));
      } catch {
        localStorage.removeItem("lasu-settings");
      }
    };

    load();
  }, [session, status]);

  return null;
}
