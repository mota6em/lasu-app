"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { BookOpen, Flame, Sparkles, TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const PERKS = [
  {
    icon: Sparkles,
    title: "Translations built for learning",
    body: "Definitions, examples and pronunciation, not just a swapped word.",
  },
  {
    icon: BookOpen,
    title: "Every word becomes a flashcard",
    body: "Your history turns straight into practice sessions.",
  },
  {
    icon: Flame,
    title: "Streaks, XP and leaderboards",
    body: "Small daily wins that are genuinely hard to break.",
  },
];

export default function WelcomePage() {
  const [open, setOpen] = useState(false);
  const login = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <span className="lasu-logo-lg text-gradient animate-float">LaSu</span>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
        Learn a language <span className="text-gradient">while you browse</span>
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
        Highlight anything online, get an AI translation with real context, and keep
        every word you meet.
      </p>

      <div className="mt-7 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" className="gap-2" onClick={login}>
          <FaGoogle /> Continue with Google
        </Button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="ghost">
              Skip for now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-warning" />
                You will lose the good parts
              </AlertDialogTitle>
              <AlertDialogDescription>
                Without an account your translations stay on this device only — no
                sync, no practice deck, no streak.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Link href="/dashboard">Continue anyway</Link>
              </AlertDialogCancel>
              <AlertDialogAction onClick={login}>Sign in instead</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ul className="mt-10 grid w-full gap-3 text-left sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, body }, index) => (
          <li
            key={title}
            className="surface-card animate-fade-up p-4"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/12">
              <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
            </span>
            <p className="mt-2.5 text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
