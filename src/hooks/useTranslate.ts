"use client";

import { useCallback, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslateStore } from "@/store/useTranslateStore";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import type { TranslationResult } from "@/types/translation";

import { readLocalHistory, writeLocalHistory } from "@/lib/localHistory";

const LOCAL_HISTORY_CAP = 200;

function saveLocally(
  sourceText: string,
  result: TranslationResult,
  translationType: string
) {
  try {
    const history = readLocalHistory();
    history.unshift({
      _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sourceText,
      result,
      translationType,
      translationFilter: sourceText.includes(" ") ? "phrase" : "word",
      createdAt: new Date().toISOString(),
    });
    writeLocalHistory(history.slice(0, LOCAL_HISTORY_CAP));
  } catch {}
}

async function fetchPrivacy(userId: string) {
  try {
    const res = await fetch(`/api/community/users/${userId}`);
    if (!res.ok) return null;
    return (await res.json()) as {
      showName?: boolean;
      showPicture?: boolean;
      shareTranslations?: boolean;
    };
  } catch {
    return null;
  }
}

export function useTranslate() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translationType = useTranslateStore((s) => s.translationType);
  const selectedLanguages = useTranslateStore((s) => s.selectedLanguages);
  const { toggleSettingsDialog } = useSettingsDialog();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inFlight = useRef<AbortController | null>(null);

  const handleTranslate = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || resultLoading) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    const langs = selectedLanguages.map((l) => l.value);
    setResultLoading(true);
    setError(null);
    setSubmittedText(trimmed);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, langs, translationType }),
        signal: controller.signal,
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(body?.error || "Translation failed. Try again shortly.");
      }

      const payload: TranslationResult =
        body?.data ?? JSON.parse(body?.translation ?? "{}");

      if (!payload?.translations || !Object.keys(payload.translations).length) {
        throw new Error("No translation came back. Try rephrasing it.");
      }

      setResult(payload);
      setResultLoading(false);

      if (!session?.user?.id) {
        saveLocally(trimmed, payload, translationType);
        return;
      }

      await fetch("/api/translation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: trimmed,
          result: payload,
          translationType,
        }),
      }).catch(() => null);

      const privacy = await fetchPrivacy(session.user.id);

      if (privacy?.shareTranslations && !trimmed.includes(" ") && trimmed.length < 100) {
        await fetch("/api/community/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            userName: privacy.showName
              ? session.user.name || session.user.email?.split("@")[0]
              : "Anonymous",
            userImage: privacy.showPicture ? session.user.image : "/imgs/userIcon.jpg",
            sourceText: trimmed,
            translationType,
            result: payload,
          }),
        }).catch(() => null);
      }

      queryClient.invalidateQueries({ queryKey: ["translation-history"] });
      queryClient.invalidateQueries({ queryKey: ["translation-stats"] });
      queryClient.invalidateQueries({ queryKey: ["practice-words"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
      setResultLoading(false);
      toast.error(message);
    }
  }, [
    text,
    resultLoading,
    selectedLanguages,
    translationType,
    session,
    queryClient,
  ]);

  const handlePasteInline = useCallback(async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (!clip) return;
      setText((prev) => (prev ? `${prev} ${clip}` : clip));
    } catch {
      toast.error("Clipboard access was blocked by your browser.");
    }
  }, []);

  const reset = useCallback(() => {
    inFlight.current?.abort();
    setText("");
    setResult(null);
    setError(null);
    setSubmittedText("");
    setResultLoading(false);
  }, []);

  return {
    text,
    setText,
    submittedText,
    resultLoading,
    result,
    error,
    handleTranslate,
    handlePasteInline,
    reset,
    toggleSettingsDialog,
  };
}
