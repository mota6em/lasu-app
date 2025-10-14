"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Clipboard, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoLanguage } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { useTranslate } from "@/hooks/useTranslate";

export function Translate() {
  const {
    text,
    setText,
    resultLoading,
    result,
    handleTranslate,
    handlePasteInline,
    copiedLang,
    setCopiedLang,
    toggleSettingsDialog,
  } = useTranslate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlText = params.get("text");
    if (urlText) setText(decodeURIComponent(urlText));
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 px-0 lg:p-6   w-full space-y-6 flex flex-col lg:flex-row gap-x-5 ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTranslate();
        }}
        className="flex flex-col gap-3 flex-1 w-full lg:w-1/2"
      >
        {/* Label row */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground flex flex-row gap-x-1 justify-center ">
            <span>Enter your text</span>
            <IoLanguage className="w-5 h-5 text-indigo-800 dark:text-indigo-300" />{" "}
          </div>
          <div
            className="flex text-gray-800 hover:text-gray-950 dark:text-gray-300 dark:hover:text-gray-200 flex-row gap-x-0.5 items-center text-xs cursor-pointer hover:underline  w-fit"
            onClick={() => toggleSettingsDialog()}
          >
            <CiSettings className="w-5.5 h-5.5 p-0" />
            <span className="flex  text-center">Translation Settings</span>
          </div>
        </div>

        {/* Textarea + floating actions */}
        <div className="relative">
          <Textarea
            placeholder="Type or paste your sentence…"
            className="min-h-[120px] pr-20"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
          />

          <TooltipProvider>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        if (!clipText) return;
                        setText((prev) => (prev ? prev + " " : "") + clipText);
                      } catch {}
                    }}
                  >
                    <Clipboard className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Paste</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setText("")}
                    disabled={!text}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Clear</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <p className="text-xs text-muted-foreground">
          <button
            type="button"
            onClick={handlePasteInline}
            className="inline-flex items-center gap-1 p-0 m-0 h-auto align-baseline
               text-current hover:underline hover:text-foreground focus:outline-none
               focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            Paste <span aria-hidden>📋</span>
          </button>
          {", "}
          <button
            type="button"
            onClick={() => setText("")}
            disabled={!text}
            className="inline-flex items-center gap-1 p-0 m-0 h-auto align-baseline
               text-current hover:underline hover:text-foreground disabled:opacity-50
               focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            clear <span aria-hidden>🗑️</span>
          </button>
          {", or hit "}
          <kbd className="px-1 py-0.5 rounded border bg-muted text-[10px]">
            Enter
          </kbd>
          {" to translate."}
        </p>

        <Button
          type="submit"
          className="w-fit bg-slate-600 dark:bg-zinc-100 text-white dark:text-black"
        >
          Translate
        </Button>
      </form>

      {(resultLoading ||
        Object.keys(result?.translations || {}).length > 0) && (
        <div className="flex flex-col w-full lg:w-1/2 ">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded shadow-sm border">
              <p className="font-semibold mb-2">Translation Result</p>
              {resultLoading &&
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-12 w-full mt-2"></div>
                ))}

              {!resultLoading &&
                Object.entries(result?.translations || {}).map(
                  ([lang, text]) => (
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
                  )
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
