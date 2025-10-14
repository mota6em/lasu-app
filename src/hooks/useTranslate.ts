"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslateStore } from "@/store/useTranslateStore";
import { useSettingsDialog } from "@/store/useSettingsDialog";

export function useTranslate() {
  const [resultLoading, setResultLoading] = useState(false);
  const [text, setText] = useState("");
  const translationType = useTranslateStore((state) => state.translationType);
  const selectedLanguages = useTranslateStore(
    (state) => state.selectedLanguages
  );
  const [result, setResult] = useState<{
    translations?: Record<string, string>;
    example?: Record<string, string>;
  }>({});
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const { toggleSettingsDialog } = useSettingsDialog();
  const { data: session } = useSession();
  const handleTranslate = async () => {
    if (!text || text.length === 0) return;
    const langs = selectedLanguages.map((lang) => lang.value);
    setResultLoading(true);
    try {
      const raw = await fetch(`/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          langs,
          translationType,
        }),
      })
        .then((res) => res.json())
        .then((data) => data.translation)
        .catch((err) => console.log("LaSu: Backend error. ", err.message));

      const apiResult = JSON.parse(raw);
      setResult({
        translations: apiResult?.translations || {},
        example: apiResult?.example || {},
      });
      setResultLoading(false);

      //save to db
      console.log("save to db", {
        sourceText: text,
        result: apiResult || {},
        userId: session?.user?.id,
        userName: session?.user?.name,
        userImage: session?.user?.image,
        translationType,
      });
      if (session) {
        await fetch("/api/translation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceText: text,
            result: apiResult,
            translationType,
          }),
        });
        if (!text.trim().includes(" ") && text.length < 100) {
          await fetch("/api/community/live", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session?.user?.id,
              userName:
                session?.user?.name ||
                session?.user?.email?.split("@")[0] ||
                "Anonymous",
              sourceText: text,
              userImage: session?.user?.image,
              translationType,
              result: apiResult,
            }),
          });
        }
      } else {
        console.log("save to local storage");
        try {
          const existing = localStorage.getItem("lasu-history");
          const parsed = JSON.parse(existing || "[]");
          const history = Array.isArray(parsed) ? parsed : [];

          const newEntry = {
            sourceText: text,
            result: apiResult,
            translationType,
            createdAt: new Date().toISOString(),
            _id:
              apiResult._id ||
              Date.now().toString() + Math.random().toString(36),
          };

          history.unshift(newEntry);
          localStorage.setItem("lasu-history", JSON.stringify(history));
        } catch (err) {
          console.warn("LaSu: Failed to save history to local storage", err);
        }
      }
    } catch (err: any) {
      console.warn("LaSu: Frontend error. ", err.message);
    }
  };
  const handlePasteInline = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText) return;
      setText((prev) => (prev ? prev + " " : "") + clipText);
    } catch {}
  };

  return {
    text,
    setText,
    resultLoading,
    result,
    handleTranslate,
    handlePasteInline,
    copiedLang,
    setCopiedLang,
    toggleSettingsDialog,
  };
}
