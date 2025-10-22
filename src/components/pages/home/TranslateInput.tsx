"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, Trash2 } from "lucide-react";
import { IoLanguage } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TranslateHook } from "@/types/translation";

type Props = Pick<
  TranslateHook,
  | "text"
  | "setText"
  | "handleTranslate"
  | "handlePasteInline"
  | "toggleSettingsDialog"
>;

export default function TranslateInput({
  text,
  setText,
  handleTranslate,
  handlePasteInline,
  toggleSettingsDialog,
}: Props) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlText = params.get("text");
    if (urlText) setText(decodeURIComponent(urlText));
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleTranslate();
      }}
      className="flex flex-col gap-3 flex-1 w-full lg:w-1/2"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex gap-1 items-center">
          <span>Enter your text</span>
          <IoLanguage className="w-5 h-5 text-indigo-800 dark:text-indigo-300" />
        </div>
        <div
          className="flex text-gray-700 dark:text-gray-300 text-xs items-center gap-1 cursor-pointer hover:underline"
          onClick={() => toggleSettingsDialog()}
        >
          <CiSettings className="w-5 h-5" />
          <span>Translation Settings</span>
        </div>
      </div>

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
                    const clip = await navigator.clipboard.readText();
                    if (clip)
                      setText(
                        (prev: string) => (prev ? prev + " " : "") + clip
                      );
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
          className="hover:underline"
        >
          Paste 📋
        </button>
        {", "}
        <button
          type="button"
          onClick={() => setText("")}
          disabled={!text}
          className="hover:underline disabled:opacity-50"
        >
          clear 🗑️
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
  );
}
