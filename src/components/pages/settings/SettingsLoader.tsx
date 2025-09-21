    "use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslateStore } from "@/store/useTranslateStore";

export default function SettingsLoader() {
  const { data: session } = useSession();

  useEffect(() => {
    const loadSettings = async () => {
      if (session?.user) {
        const res = await fetch(`/api/settings?userId=${session.user.id}`);
        const data = await res.json();
        if (data.settings) {
          useTranslateStore
            .getState()
            .setLanguages(data.settings.selectedLanguages);
          useTranslateStore
            .getState()
            .setTranslationType(data.settings.translationType);
        }
      } else {
        const local = localStorage.getItem("lasu-settings");
        if (local) {
          const parsed = JSON.parse(local);
          useTranslateStore.getState().setLanguages(parsed.selectedLanguages);
          useTranslateStore
            .getState()
            .setTranslationType(parsed.translationType);
        }
      }
    };

    loadSettings();
  }, [session]);

  return null;
}
