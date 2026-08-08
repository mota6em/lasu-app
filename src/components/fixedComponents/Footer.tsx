"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("footer");
  const highlights = [
    t("aboutPointOne"),
    t("aboutPointTwo"),
    t("aboutPointThree"),
    t("aboutPointFour"),
  ];

  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        {t("about")}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-xl">
            {t("aboutTitle")}
          </DialogTitle>
          <DialogDescription>{t("aboutDescription")}</DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">{t("aboutStack")}</p>

        <DialogFooter className="items-center sm:justify-between">
          <a
            href="https://motasem.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Code2 className="h-4 w-4" /> {t("aboutBy")}
          </a>
          <DialogClose asChild>
            <Button variant="secondary">{t("aboutClose")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContactDialog() {
  const t = useTranslations("footer");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        {t("contact")}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-xl">
            {t("contactTitle")}
          </DialogTitle>
          <DialogDescription>{t("contactDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          <Button asChild>
            <a
              href="https://forms.gle/gNaxyuWNybqstX9ZA"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("contactForm")}
            </a>
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm" dir="ltr">
              {SUPPORT_EMAIL}
            </span>
            <button
              onClick={copyEmail}
              aria-label={t("copyEmail")}
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
  const t = useTranslations("footer");

  return (
    <Dialog>
      <DialogTrigger className="transition-colors hover:text-foreground">
        {t("privacy")}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-xl">
            {t("privacyTitle")}
          </DialogTitle>
          <DialogDescription>{t("privacyDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <section>
            <h4 className="mb-1.5 font-medium text-foreground">
              {t("privacyCollectTitle")}
            </h4>
            <ul className="list-disc space-y-1 ps-5">
              <li>{t("privacyCollectOne")}</li>
              <li>{t("privacyCollectTwo")}</li>
            </ul>
          </section>
          <section>
            <h4 className="mb-1.5 font-medium text-foreground">
              {t("privacyStorageTitle")}
            </h4>
            <ul className="list-disc space-y-1 ps-5">
              <li>{t("privacyStorageOne")}</li>
              <li>{t("privacyStorageTwo")}</li>
              <li>{t("privacyStorageThree")}</li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t("privacyClose")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row lg:px-8">
        <p>{t("rights", { year: new Date().getFullYear() })}</p>

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
