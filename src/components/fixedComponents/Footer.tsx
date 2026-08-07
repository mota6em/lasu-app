"use client";

import { useState } from "react";
import { Check, Code2, Copy, Mail } from "lucide-react";
import { FaSquareGithub } from "react-icons/fa6";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SUPPORT_EMAIL = "support@lasu.online";

function AboutDialog() {
  const highlights = [
    "Context-aware translations with real-life examples",
    "History that doubles as a spaced-repetition deck",
    "Streaks, XP and a community leaderboard",
    "One account synced between the extension and the web app",
  ];

  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        About
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">About LaSu</DialogTitle>
          <DialogDescription>
            A Chrome extension and web app that turns everyday browsing into
            vocabulary practice.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">
          Built with Next.js, TypeScript, MongoDB and Zustand.
        </p>

        <DialogFooter className="items-center sm:justify-between">
          <a
            href="https://motasem.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Code2 className="h-4 w-4" /> by @motasem
          </a>
          <DialogClose asChild>
            <Button variant="secondary">Nice</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContactDialog() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        Contact
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Get in touch</DialogTitle>
          <DialogDescription>
            Bugs, ideas or partnerships — all of it is welcome.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          <Button asChild>
            <a
              href="https://forms.gle/gNaxyuWNybqstX9ZA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fill out the feedback form
            </a>
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm">{SUPPORT_EMAIL}</span>
            <button
              onClick={copyEmail}
              aria-label="Copy email"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        Privacy
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Privacy & data</DialogTitle>
          <DialogDescription>
            Your data stays yours. We collect the minimum needed to run LaSu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <section>
            <h4 className="mb-1.5 font-medium text-foreground">What we collect</h4>
            <ul className="list-disc space-y-1 ps-5">
              <li>Account name and email, for sign-in and optional summaries</li>
              <li>Your translations, so history, stats and practice work</li>
            </ul>
          </section>
          <section>
            <h4 className="mb-1.5 font-medium text-foreground">
              Storage & control
            </h4>
            <ul className="list-disc space-y-1 ps-5">
              <li>Everything is stored in our database, never sold or shared</li>
              <li>
                Community visibility is opt-in and can be switched off at any time
              </li>
              <li>Signed-out translations stay in your browser only</li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row lg:px-8">
        <p>© {new Date().getFullYear()} LaSu — language learning made effortless.</p>

        <nav className="flex items-center gap-5">
          <AboutDialog />
          <ContactDialog />
          <PrivacyDialog />
          <a
            href="https://github.com/mota6em"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <FaSquareGithub size={18} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
