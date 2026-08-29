"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslateStore } from "@/store/useTranslateStore";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import type { TranslationResult } from "@/types/translation";
import type { QuotaErrorCode, TranslateError } from "@/types/billing";
import {
  parsePartialTranslation,
  type PartialTranslation,
} from "@/lib/partialTranslation";

import { explainLanguage } from "@/i18n/locales";
import { readLocalHistory, writeLocalHistory } from "@/lib/localHistory";
import { BILLING_KEY } from "@/hooks/useBilling";

const LOCAL_HISTORY_CAP = 200;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const QUOTA_CODES: Record<string, QuotaErrorCode> = {
  login_required: "login_required",
  upgrade_required: "upgrade_required",
  quota_exceeded: "quota_exceeded",
};

function quotaError(res: Response, body: Record<string, unknown> | null): TranslateError | null {
  const code = QUOTA_CODES[String(body?.error ?? "")];
  const retryAfter = Number(res.headers.get("Retry-After"));
  const resetAt =
    Number(body?.resetTime) ||
    (Number.isFinite(retryAfter) && retryAfter > 0 ? Date.now() + retryAfter * 1000 : 0);

  if (!code && res.status !== 429) return null;

  return {
    code: code ?? "rate_limited",
    message: typeof body?.error === "string" ? body.error : "",
    limit: Number(body?.limit) || undefined,
    used: Number(body?.used) || undefined,
    resetAt: resetAt || undefined,
  };
}

function toError(err: unknown): TranslateError {
  if (err && typeof err === "object" && "code" in err) return err as TranslateError;
  return {
    code: "generic",
    message: err instanceof Error ? err.message : "Something went wrong. Try again.",
  };
}

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

type StreamEvent =
  | { event: "delta"; data: string }
  | {
      event: "done";
      data: {
        data?: TranslationResult;
        translation?: string;
        sourceText?: string | null;
      };
    }
  | { event: "error"; data: { error?: string } };

async function* readEvents(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let split = buffer.indexOf("\n\n");
    while (split !== -1) {
      const frame = buffer.slice(0, split);
      buffer = buffer.slice(split + 2);
      split = buffer.indexOf("\n\n");

      let name = "message";
      const payload: string[] = [];

      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) name = line.slice(6).trim();
        else if (line.startsWith("data:")) payload.push(line.slice(5).trim());
      }

      if (!payload.length) continue;

      try {
        yield {
          event: name,
          data: JSON.parse(payload.join("\n")),
        } as StreamEvent;
      } catch {
      }
    }
  }
}

const EMPTY_PARTIAL: PartialTranslation = {
  sourceText: "",
  sourceLanguage: "",
  meaning: "",
  translations: {},
};

export function useTranslate() {
  const [text, setText] = useState("");
  const [image, setImageState] = useState<string | null>(null);
  const [submittedText, setSubmittedText] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<TranslateError | null>(null);
  const [partial, setPartial] = useState<PartialTranslation>(EMPTY_PARTIAL);

  const translationType = useTranslateStore((s) => s.translationType);
  const selectedLanguages = useTranslateStore((s) => s.selectedLanguages);
  const { toggleSettingsDialog } = useSettingsDialog();
  const { data: session } = useSession();
  const explainLang = explainLanguage(useLocale());
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
      setError({ code: "generic", message });
      toast.error(message);
      return;
    }

    if (input.size > MAX_IMAGE_BYTES) {
      const message = `That photo is over ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB. Crop it and try again.`;
      setError({ code: "generic", message });
      toast.error(message);
      return;
    }

    try {
      setImageState(await fileToDataUrl(input));
      setError(null);
    } catch {
      const message = "That image could not be read.";
      setError({ code: "generic", message });
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
    setPartial(EMPTY_PARTIAL);

    setSubmittedText(image ? "" : trimmed);

    let sourceText = trimmed;
    let payload: TranslationResult;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          ...(image ? { image } : { text: trimmed }),
          langs,
          translationType,
          explainLang,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as Record<
          string,
          unknown
        > | null;

        const quota = quotaError(res, body);
        if (quota) throw quota;

        throw new Error(
          typeof body?.error === "string"
            ? body.error
            : "Translation failed. Try again shortly.",
        );
      }

      let done: {
        data?: TranslationResult;
        translation?: string;
        sourceText?: string | null;
      } | null = null;
      let raw = "";

      for await (const frame of readEvents(res.body)) {
        if (frame.event === "delta") {
          raw += frame.data;
          setPartial(parsePartialTranslation(raw));
          continue;
        }
        if (frame.event === "error") {
          throw new Error(
            frame.data?.error || "Translation failed. Try again shortly.",
          );
        }
        if (frame.event === "done") {
          done = frame.data;
          break;
        }
      }

      if (!done) throw new Error("The translation stopped early. Try again.");

      payload =
        done.data ??
        (JSON.parse(done.translation ?? "{}") as TranslationResult);

      if (!payload?.translations || !Object.keys(payload.translations).length) {
        throw new Error("No translation came back. Try rephrasing it.");
      }

      if (
        image &&
        typeof done.sourceText === "string" &&
        done.sourceText.trim()
      ) {
        sourceText = done.sourceText.trim();
      }

      setResult(payload);
      setSubmittedText(sourceText);
      setResultLoading(false);
      setPartial(EMPTY_PARTIAL);
    } catch (err) {
      if (controller.signal.aborted) return;
      const failure = toError(err);
      setError(failure);
      if (failure.code !== "generic") {
        queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      }
      setResultLoading(false);
      setPartial(EMPTY_PARTIAL);
      if (failure.code === "generic" && failure.message) toast.error(failure.message);
      return;
    }

    try {
      await persist(sourceText, payload);
    } catch {}
  }, [
    text,
    image,
    resultLoading,
    selectedLanguages,
    translationType,
    explainLang,
    persist,
    queryClient,
  ]);

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
    setPartial(EMPTY_PARTIAL);
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
    partial,
    error,
    handleTranslate,
    handlePasteInline,
    reset,
    toggleSettingsDialog,
  };
}
