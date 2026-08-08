"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
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
import { Link } from "@/i18n/routing";

const PERKS = [
  { icon: Sparkles, key: "One" },
  { icon: BookOpen, key: "Two" },
  { icon: Flame, key: "Three" },
] as const;

export default function WelcomePage() {
  const t = useTranslations("welcome");
  const [open, setOpen] = useState(false);
  const login = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <span className="lasu-logo-lg text-gradient animate-float">LaSu</span>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
        {t.rich("heading", {
          accent: (chunks) => <span className="text-gradient">{chunks}</span>,
        })}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("subheading")}
      </p>

      <div className="mt-7 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" className="gap-2" onClick={login}>
          <FaGoogle /> {t("signIn")}
        </Button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="ghost">
              {t("skip")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="text-start">
              <AlertDialogTitle className="flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-warning" />
                {t("skipTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>{t("skipBody")}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Link href="/dashboard">{t("skipConfirm")}</Link>
              </AlertDialogCancel>
              <AlertDialogAction onClick={login}>{t("skipCancel")}</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ul className="mt-10 grid w-full gap-3 text-start sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, key }, index) => (
          <li
            key={key}
            className="surface-card animate-fade-up p-4"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/12">
              <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
            </span>
            <p className="mt-2.5 text-sm font-semibold">{t(`perk${key}Title`)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t(`perk${key}Body`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
