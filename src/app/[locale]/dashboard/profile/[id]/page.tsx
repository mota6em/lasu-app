"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import UserProfileStatsGrid from "@/components/pages/profile/UserProfileStatsGrid";
import useProfile from "@/hooks/useProfile";
import { levelProgress } from "@/lib/xp";

export default function PublicProfilePage() {
  const t = useTranslations("profile");
  const { id } = useParams() as { id: string };
  const { allStats, user, publicUserLoading } = useProfile({ sUserId: id });

  if (publicUserLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="shimmer h-44 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="surface-card mx-auto max-w-md p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
          <UserX className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="font-display text-xl font-semibold">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("notFoundBody")}</p>
        <Button asChild variant="outline" className="mt-5 gap-2">
          <Link href="/dashboard/community">
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />{" "}
            {t("backToCommunity")}
          </Link>
        </Button>
      </div>
    );
  }

  const progress = levelProgress(Number(allStats.xp) || 0);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <Link
        href="/dashboard/community"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" /> {t("backToCommunity")}
      </Link>

      <section className="surface-card overflow-hidden">
        <div className="relative h-20 bg-gradient-to-r from-iris-500/25 to-brand-500/25">
          <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <Image
              src={user.image || "/imgs/userIcon.jpg"}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl border-4 border-surface bg-surface object-cover shadow-[var(--shadow-lift)]"
            />
            <div className="pb-1">
              <h1 className="font-display text-xl font-bold">{user.name}</h1>
              <p className="text-xs text-muted-foreground">
                {t("publicLevel", { level: progress.level })}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-iris-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {t("publicProgress", {
                into: progress.into,
                needed: progress.needed,
                level: progress.level + 1,
              })}
            </p>
          </div>
        </div>
      </section>

      <UserProfileStatsGrid {...allStats} />
    </div>
  );
}
