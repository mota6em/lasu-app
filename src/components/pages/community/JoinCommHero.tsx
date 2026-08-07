"use client";

import { signIn, useSession } from "next-auth/react";
import { Flame, Globe2, Trophy, Users } from "lucide-react";
import JoinCommModal from "./JoinCommModal";
import { Button } from "@/components/ui/button";

const PERKS = [
  {
    icon: Flame,
    title: "Streaks that count",
    body: "Every day you translate keeps the flame alive.",
  },
  {
    icon: Trophy,
    title: "Daily leaderboards",
    body: "Daily, monthly and all-time rankings against other learners.",
  },
  {
    icon: Globe2,
    title: "A live word feed",
    body: "See what the rest of the community is looking up right now.",
  },
];

export default function JoinCommHero() {
  const { data: session } = useSession();

  return (
    <section className="surface-card relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-iris-500/20 blur-3xl animate-aurora"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl animate-aurora"
      />

      <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-10">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium">
            <Users className="h-3.5 w-3.5 text-brand-500" />
            LaSu Community
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Learning alone is <br />
            <span className="text-gradient">slower than this</span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Join the community to earn XP for every word, hold a streak, and see what
            other learners are translating in real time.
          </p>

          <div className="mt-6">
            {session ? (
              <JoinCommModal />
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button size="lg" onClick={() => signIn("google")}>
                  Sign in to join
                </Button>
                <span className="text-xs text-muted-foreground">
                  Takes a couple of seconds. Your privacy settings stay yours.
                </span>
              </div>
            )}
          </div>
        </div>

        <ul className="flex flex-col justify-center gap-3">
          {PERKS.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="flex gap-3 rounded-xl border border-border bg-surface/80 p-4 animate-fade-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/12">
                <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
