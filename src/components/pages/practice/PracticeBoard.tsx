"use client";

import { usePracticeSession } from "@/hooks/usePracticeSession";
import PracticeSetup from "./PracticeSetup";
import PracticeRunner from "./PracticeRunner";
import PracticeSummary from "./PracticeSummary";

function BoardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="shimmer h-24 rounded-2xl" />
      <div className="shimmer h-40 rounded-2xl" />
      <div className="shimmer h-14 rounded-2xl" />
    </div>
  );
}

export default function PracticeBoard() {
  const session = usePracticeSession();

  if (session.isLoading) return <BoardSkeleton />;

  if (session.isError) {
    return (
      <div className="surface-card mx-auto max-w-md p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Could not load your words.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Refresh the page and they should come back.
        </p>
      </div>
    );
  }

  if (session.phase === "summary") return <PracticeSummary {...session} />;
  if (session.phase === "active") return <PracticeRunner {...session} />;
  return <PracticeSetup {...session} />;
}
