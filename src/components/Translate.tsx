"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";

import { useTranslateStore } from "@/store/useTranslateStore";
import { CiSettings } from "react-icons/ci";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import { useSession } from "next-auth/react";

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

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full space-y-6 flex flex-col lg:flex-row gap-x-5 ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTranslate();
        }}
        className="flex flex-col gap-4 flex-1 w-full lg:w-1/2"
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
        <Button
          type="submit"
          className="w-fit bg-slate-600 dark:bg-zinc-100 text-white dark:text-black"
        >
          Translate
        </Button>
      </form>

      <div className="flex flex-col w-full lg:w-1/2 ">
        <div
          className="flex flex-row gap-x-0.5 items-center text-sm cursor-pointer hover:underline  w-fit"
          onClick={() => toggleSettingsDialog()}
        >
          <CiSettings className="w-5.5 h-5.5 p-0" />
          <span className="flex  text-center">Translation Settings</span>
        </div>
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded shadow-sm border">
            <p className="font-semibold mb-2">Translation Result</p>
            {resultLoading &&
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-12 w-full mt-2"></div>
              ))}

            {!resultLoading &&
              Object.entries(result?.translations || {}).map(([lang, text]) => (
                <div
                  key={lang}
                  className="mb-2 p-3 border rounded bg-white dark:bg-zinc-800"
                >
                  <div className="flex flex-row gap-x-2">
                    <p className="font-semibold capitalize">{lang} :</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                        {text}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(text);
                          setCopiedLang(lang);
                          setTimeout(() => setCopiedLang(null), 2000);
                        }}
                        className="text-muted-foreground hover:text-primary transition"
                      >
                        {copiedLang === lang ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  {result?.example?.[lang] && (
                    <div className="text-sm text-muted-foreground mt-1 flex flex-row gap-x-2">
                      Example:{" "}
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground ">
                          {result?.example?.[lang] || ""}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              result?.example?.[lang] || ""
                            );
                            setCopiedLang(lang + "-example");
                            setTimeout(() => setCopiedLang(null), 2000);
                          }}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          {copiedLang === lang + "-example" ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
