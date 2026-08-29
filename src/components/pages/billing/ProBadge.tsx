"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProBadge({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  const t = useTranslations("billing");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-brand-500/35 bg-gradient-to-r from-brand-500/18 to-iris-500/18 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 dark:text-brand-300",
        className,
      )}
    >
      {showIcon && <Sparkles className="h-2.5 w-2.5" />}
      {t("proBadge")}
    </span>
  );
}

export default ProBadge;
