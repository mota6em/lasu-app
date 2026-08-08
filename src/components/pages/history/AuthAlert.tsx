"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { CloudOff } from "lucide-react";

export default function AuthAlert() {
  const t = useTranslations("history");
  const tShell = useTranslations("shell");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-500/25 bg-brand-500/8 p-4 sm:flex-row sm:items-center">
      <CloudOff className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{t("localOnlyTitle")}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {t("localOnlyBody")}
        </p>
      </div>
      <button
        onClick={() => signIn("google")}
        className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
      >
        {tShell("signIn")}
      </button>
    </div>
  );
}
