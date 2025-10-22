"use client";
import { useTranslate } from "@/hooks/useTranslate"; 
import TranslateInput from "./TranslateInput";
import TranslateResult from "./TranslateResult";

export function Translate() {
  const translate = useTranslate();

  return (
    <div className="bg-white dark:bg-zinc-900 px-0 lg:p-6 w-full flex flex-col lg:flex-row gap-5">
      <TranslateInput {...translate} />
      <TranslateResult {...translate} />
    </div>
  );
}
