"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import TranslationSettingDialog from "./TranslationSettingDialog";
import { useTranslateStore } from "@/store/useTranslateStore";

export function Translate() {
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
        translationType,
      });
      await fetch("/api/translation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: text,
          result: apiResult,
          translationType,
        }),
      });
    } catch (err: any) {
      console.warn("LaSu: Frontend error. ", err.message);
    }
  };

  console.log("res outside", result);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full space-y-6 flex flex-row gap-x-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTranslate();
        }}
        className="flex flex-col gap-4 flex-1 w-1/2"
      >
        <Textarea
          placeholder="Enter your sentence..."
          className="min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleTranslate();
            }
          }}
        />
        <Button type="submit" className="w-fit">
          Translate
        </Button>
      </form>

      <div className="flex flex-col w-1/2 ">
        <TranslationSettingDialog />
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded shadow-sm border">
            <p className="font-semibold mb-2">Translation Result</p>
            {resultLoading &&
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-12 w-full mt-2"></div>
              ))}

            {!resultLoading &&
              Object.entries(result?.translations || {}).map(([lang, text]) => (
                <div key={lang} className="mb-2 p-3 border rounded bg-white">
                  <div className="flex flex-row gap-x-2">
                    <p className="font-semibold capitalize">{lang} :</p>
                    <p>{text}</p>
                  </div>
                  {result?.example?.[lang] && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Example: {result.example[lang]}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
