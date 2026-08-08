"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function HistoryEmptyState({ query }: { query?: string }) {
  const t = useTranslations("history");
  const searching = !!query;

  return (
    <div className="surface-card mx-auto max-w-md p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-semibold">
        {searching ? t("emptySearchTitle") : t("emptyTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {searching ? t("emptySearchBody", { query: query! }) : t("emptyBody")}
      </p>
      {!searching && (
        <Button asChild className="mt-5 gap-2">
          <Link href="/dashboard">
            {t("translateSomething")}{" "}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </Button>
      )}
    </div>
  );
}
