"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Camera, Check, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useProfile from "@/hooks/useProfile";
import { levelProgress } from "@/lib/xp";
import { cn } from "@/lib/utils";

export default function Hero() {
  const t = useTranslations("profile");
  const {
    user,
    allStats,
    icons,
    name,
    setName,
    icon,
    setIcon,
    emailSummary,
    setEmailSummary,
    loading,
    handleSave,
  } = useProfile();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setIcon(user.image || "/imgs/userIcon.jpg");
    }
  }, [user, setName, setIcon]);

  const xp = Number(allStats.xp) || 0;
  const progress = levelProgress(xp);
  const unlocked = icons.filter((item) => xp >= item.requiredXP);
  const locked = icons.filter((item) => xp < item.requiredXP);

  return (
    <section className="surface-card overflow-hidden">
      <div className="relative h-24 bg-gradient-to-r from-brand-500/25 via-brand-400/15 to-iris-500/25">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div className="px-5 pb-5 md:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative w-fit">
            <Image
              src={icon || "/imgs/userIcon.jpg"}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl border-4 border-surface bg-surface object-cover shadow-[var(--shadow-lift)]"
            />

            <Dialog>
              <DialogTrigger asChild>
                <button
                  title={t("changeAvatar")}
                  className="absolute -bottom-1 -end-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
                <DialogHeader className="text-start">
                  <DialogTitle className="font-display text-xl">
                    {t("avatarTitle")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("avatarDescription", { xp })}
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("unlocked")}
                  </h3>
                  <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                    {unlocked.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setIcon(item.src)}
                        className={cn(
                          "relative overflow-hidden rounded-xl border-2 transition-all",
                          icon === item.src
                            ? "border-brand-500 shadow-[var(--shadow-brand)]"
                            : "border-transparent hover:border-border-strong"
                        )}
                      >
                        <Image
                          src={item.src}
                          alt={item.label}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                        {icon === item.src && (
                          <span className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {locked.length > 0 && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Lock className="h-3 w-3" /> {t("locked")}
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                      {locked.map((item) => (
                        <div
                          key={item.id}
                          className="relative overflow-hidden rounded-xl border border-border"
                        >
                          <Image
                            src={item.src}
                            alt=""
                            width={80}
                            height={80}
                            className="h-full w-full object-cover grayscale"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-[11px] font-semibold">
                            {t("requiredXp", { xp: item.requiredXP })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1 pb-1">
            <p className="font-display text-xl font-bold">{name || user?.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user?.email || t("noEmail")}
            </p>
          </div>
        </div>

        <div className="mt-5 max-w-sm">
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("statLevel")} {progress.level}
            </span>
            <span>{t("xpToGo", { remaining: progress.remaining })}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-iris-500 transition-[width] duration-700"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t("displayName")}
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-3 self-end rounded-lg border border-border bg-surface-2 px-3 py-2">
            <span>
              <span className="block text-sm font-medium">
                {t("emailSummaries")}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {t("emailSummariesHint")}
              </span>
            </span>
            <Switch
              checked={emailSummary}
              onCheckedChange={setEmailSummary}
              className="data-[state=checked]:bg-primary"
            />
          </label>
        </div>

        <Button onClick={handleSave} disabled={loading} className="mt-4 gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </section>
  );
}
