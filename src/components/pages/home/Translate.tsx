"use client";

import { Suspense } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import TranslateComposer from "./TranslateComposer";
import TranslateResult from "./TranslateResult";

export function Translate() {
  const translate = useTranslate();

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <Suspense fallback={<div className="shimmer h-56 rounded-2xl" />}>
          <TranslateComposer {...translate} />
        </Suspense>
      </div>
      <TranslateResult {...translate} />
    </section>
  );
}
