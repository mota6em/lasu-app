"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, Globe, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";
import { localeCatalogue } from "@/i18n/locales";
import { cn } from "@/lib/utils";

export function useLocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      const query = search?.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        locale: next,
        scroll: false,
      });
    });
  };

  return { locale, switchTo, pending };
}

export default function LanguageSwitcher({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("language");
  const { locale, switchTo, pending } = useLocaleSwitcher();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return localeCatalogue;
    return localeCatalogue.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.native.toLowerCase().includes(term) ||
        item.code.includes(term)
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4 text-start">
          <DialogTitle className="flex items-center gap-2 font-display text-lg">
            <Globe className="h-4.5 w-4.5 text-brand-500" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              className="h-10 w-full rounded-lg border border-border bg-surface-2 pe-3 ps-9 text-sm outline-none transition-colors focus:border-brand-400"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t("noResults", { query })}
            </p>
          )}

          {results.map((item) => {
            const active = item.code === locale;
            return (
              <button
                key={item.code}
                disabled={pending}
                onClick={() => {
                  switchTo(item.code);
                  onOpenChange(false);
                }}
                dir={item.rtl ? "rtl" : "ltr"}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors disabled:opacity-60",
                  active ? "bg-brand-500/10" : "hover:bg-surface-2"
                )}
              >
                <span className="text-base" aria-hidden>
                  {item.flag}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {item.native}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {item.name}
                  </span>
                </span>
                {active && (
                  <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                )}
                {pending && !active && (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
