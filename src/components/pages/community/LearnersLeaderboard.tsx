"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface Learner {
  id: string;
  name?: string;
  image?: string;
  showName?: boolean;
  showPicture?: boolean;
  xp?: number;
  totalTranslations?: number;
}

const RANK_TONE = [
  "text-brand-500",
  "text-muted-foreground",
  "text-brand-800 dark:text-brand-600",
];

function Avatar({ learner, size }: { learner: Learner; size: number }) {
  if (learner.showPicture && learner.image) {
    return (
      <Image
        src={learner.image}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-surface-3"
    >
      <Medal className="h-1/2 w-1/2 text-muted-foreground" />
    </span>
  );
}



export default function LearnersLeaderboard({
  learners,
  loading,
}: {
  learners: Learner[];
  loading: boolean;
}) {
  const t = useTranslations("community");
  const displayName = (learner: Learner) =>
    learner.showName && learner.name ? learner.name : t("anonymous");

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="shimmer h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!learners.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {t("noLearners")}
      </p>
    );
  }

  const [first, second, third, ...rest] = learners;
  const podium = [second, first, third].filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
        {podium.map((learner) => {
          const rank = learners.indexOf(learner) + 1;
          const isFirst = rank === 1;
          return (
            <motion.div
              key={learner.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rank * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/dashboard/profile/${learner.id}`}
                className="group flex flex-col items-center rounded-lg text-center transition-colors"
              >
                <div className="relative">
                  {isFirst && (
                    <Crown className="absolute -top-5 left-1/2 h-5 w-5 -translate-x-1/2 text-brand-500" />
                  )}
                  <span
                    className={cn(
                      "block rounded-full p-0.5 transition-transform group-hover:scale-105",
                      isFirst
                        ? "bg-gradient-to-br from-brand-400 to-brand-600"
                        : "bg-border-strong"
                    )}
                  >
                    <span className="block rounded-full bg-surface p-0.5">
                      <Avatar learner={learner} size={isFirst ? 56 : 44} />
                    </span>
                  </span>
                </div>

                <p className="mt-2 max-w-full truncate text-xs font-semibold transition-colors group-hover:text-brand-600 sm:text-sm dark:group-hover:text-brand-400">
                  {displayName(learner)}
                </p>
                <p className="text-[11px] tabular-nums text-muted-foreground">
                  {learner.xp ?? 0} XP
                </p>

                <div
                  className={cn(
                    "mt-2 w-full rounded-t-lg border border-b-0 border-border bg-surface-2 transition-colors group-hover:bg-surface-3",
                    isFirst ? "h-14" : "h-9"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-full items-center justify-center font-display text-lg font-bold",
                      RANK_TONE[rank - 1]
                    )}
                  >
                    {rank}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <ul className="divide-y divide-border border-t border-border">
          {rest.map((learner, index) => (
            <li key={learner.id}>
              <Link
                href={`/dashboard/profile/${learner.id}`}
                className="flex items-center gap-3 py-2.5 transition-colors hover:bg-surface-2"
              >
                <span className="w-6 text-center font-mono text-xs tabular-nums text-muted-foreground">
                  {index + 4}
                </span>
                <Avatar learner={learner} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {displayName(learner)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {t("learnerTranslations", {
                      count: learner.totalTranslations ?? 0,
                    })}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {learner.xp ?? 0} XP
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
