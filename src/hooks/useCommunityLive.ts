"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TranslationResult } from "@/types/translation";

export interface CommunityTranslation {
  userId: string;
  userName: string;
  userImage: string;
  sourceText: string;
  translationType: string;
  translationFilter: string;
  result: TranslationResult;
  createdAt: string | Date;
}

async function fetchLiveTranslations(): Promise<CommunityTranslation[]> {
  const res = await fetch("/api/community/live");
  if (!res.ok) throw new Error("Failed to fetch live translations");
  return res.json();
}

export function useCommunityLive() {
  const { data, isLoading } = useQuery({
    queryKey: ["community-live"],
    queryFn: fetchLiveTranslations,
    refetchInterval: 10_000,
  });

  const translations = data ?? [];
  const [newCards, setNewCards] = useState<Set<string>>(new Set());
  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>({});
  const seen = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!data) return;

    const ids = data.map((t) => t.userId.toString() + t.sourceText);

    if (firstLoad.current) {
      firstLoad.current = false;
      seen.current = new Set(ids);
      return;
    }

    const fresh = ids.filter((id) => !seen.current.has(id));
    seen.current = new Set([...seen.current, ...ids]);
    if (!fresh.length) return;

    setNewCards((prev) => new Set([...prev, ...fresh]));
    const timeout = setTimeout(() => {
      setNewCards((prev) => {
        const copy = new Set(prev);
        fresh.forEach((id) => copy.delete(id));
        return copy;
      });
    }, 6000);

    return () => clearTimeout(timeout);
  }, [data]);

  const selectLanguage = useCallback((cardId: string, lang: string) => {
    setSelectedLangs((prev) => ({ ...prev, [cardId]: lang }));
  }, []);

  return { translations, isLoading, newCards, selectedLangs, selectLanguage };
}
