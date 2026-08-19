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

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("That image could not be read."));
    reader.readAsDataURL(file);
  });
}

function saveLocally(
  sourceText: string,
  result: TranslationResult,
  translationType: string,
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
  const [image, setImageState] = useState<string | null>(null);
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

  const clearImage = useCallback(() => setImageState(null), []);

  // Accepts a File/Blob from a picker, a drop or a paste, or a ready data URI.
  const setImage = useCallback(async (input: File | Blob | string | null) => {
    if (input === null) return setImageState(null);

    if (typeof input === "string") {
      setImageState(input.trim() || null);
      return;
    }

    if (input.type && !input.type.startsWith("image/")) {
      const message = "That file is not an image.";
      setError(message);
      toast.error(message);
      return;
    }

    if (input.size > MAX_IMAGE_BYTES) {
      const message = `That photo is over ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB. Crop it and try again.`;
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setImageState(await fileToDataUrl(input));
      setError(null);
    } catch {
      const message = "That image could not be read.";
      setError(message);
      toast.error(message);
    }
  }, []);

  // Everything after the translation lands. Nothing here may fail the translation.
  const persist = useCallback(
    async (sourceText: string, payload: TranslationResult) => {
      if (!session?.user?.id) {
        saveLocally(sourceText, payload, translationType);
        return;
      }

      await fetch("/api/translation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText, result: payload, translationType }),
      }).catch(() => null);

      const privacy = await fetchPrivacy(session.user.id);

      if (
        privacy?.shareTranslations &&
        !sourceText.includes(" ") &&
        sourceText.length < 100
      ) {
        await fetch("/api/community/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            userName: privacy.showName
              ? session.user.name || session.user.email?.split("@")[0]
              : "Anonymous",
            userImage: privacy.showPicture
              ? session.user.image
              : "/imgs/userIcon.jpg",
            sourceText,
            translationType,
            result: payload,
          }),
        }).catch(() => null);
      }

      queryClient.invalidateQueries({ queryKey: ["translation-history"] });
      queryClient.invalidateQueries({ queryKey: ["translation-stats"] });
      queryClient.invalidateQueries({ queryKey: ["practice-words"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    [session, translationType, queryClient],
  );

  const handleTranslate = useCallback(async () => {
    const trimmed = text.trim();
    if ((!trimmed && !image) || resultLoading) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    const langs = selectedLanguages.map((l) => l.value);
    setResultLoading(true);
    setError(null);
    // With a photo the source text is whatever the model reads out of it, so it
    // is only known once the response lands.
    setSubmittedText(image ? "" : trimmed);

    let sourceText = trimmed;
    let payload: TranslationResult;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          image
            ? { image, langs, translationType }
            : { text: trimmed, langs, translationType },
        ),
        signal: controller.signal,
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          body?.error || "Translation failed. Try again shortly.",
        );
      }

      payload = body?.data ?? JSON.parse(body?.translation ?? "{}");

      if (!payload?.translations || !Object.keys(payload.translations).length) {
        throw new Error("No translation came back. Try rephrasing it.");
      }

      if (
        image &&
        typeof body?.sourceText === "string" &&
        body.sourceText.trim()
      ) {
        sourceText = body.sourceText.trim();
      }

      setResult(payload);
      setSubmittedText(sourceText);
      setResultLoading(false);
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
      setResultLoading(false);
      toast.error(message);
      return;
    }

    try {
      await persist(sourceText, payload);
    } catch {}
  }, [text, image, resultLoading, selectedLanguages, translationType, persist]);

  const handlePasteInline = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read?.().catch(() => null);

      if (items) {
        for (const item of items) {
          const type = item.types.find((t) => t.startsWith("image/"));
          if (type) {
            await setImage(await item.getType(type));
            return;
          }
        }
      }

      const clip = await navigator.clipboard.readText();
      if (!clip) return;
      setText((prev) => (prev ? `${prev} ${clip}` : clip));
    } catch {
      toast.error("Clipboard access was blocked by your browser.");
    }
  }, [setImage]);

  const reset = useCallback(() => {
    inFlight.current?.abort();
    setText("");
    setImageState(null);
    setResult(null);
    setError(null);
    setSubmittedText("");
    setResultLoading(false);
  }, []);

  return {
    text,
    setText,
    image,
    setImage,
    clearImage,
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
