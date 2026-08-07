"use client";

import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryEmptyState({ query }: { query?: string }) {
  const searching = !!query;

  return (
    <div className="surface-card mx-auto max-w-md p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-semibold">
        {searching ? "Nothing matched" : "Your history is empty"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {searching ? (
          <>
            No saved translation contains “{query}”. Try a different word or clear the
            search.
          </>
        ) : (
          "Everything you translate is saved here automatically, ready to search and practise."
        )}
      </p>
      {!searching && (
        <Button asChild className="mt-5 gap-2">
          <Link href="/dashboard">
            Translate something <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
