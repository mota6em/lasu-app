"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CopyButton from "@/components/ui/copy-button";
import SpeakButton from "@/components/ui/speak-button";
import { Link } from "@/i18n/routing";
import { getLanguage, isRTL, langName } from "@/lib/languages";
import { cn } from "@/lib/utils";
import type { CommunityTranslation } from "@/hooks/useCommunityLive";

interface LiveTranslationCardProps {
  translation: CommunityTranslation;
  cardId: string;
  isNew: boolean;
  selectedLang: string;
  onSelectLang: (lang: string) => void;
}

export default function LiveTranslationCard({
  translation,
  cardId,
  isNew,
  selectedLang,
  onSelectLang,
}: LiveTranslationCardProps) {
  const t = useTranslations("community");
  const langs = Object.keys(translation.result?.translations ?? {});
  const active = selectedLang || langs[0];
  const text = translation.result?.translations?.[active] ?? "";
  const example = translation.result?.example?.[active];
  const displayName = translation.userName?.split(" ")[0] || t("anonymous");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface-card lift group flex flex-col overflow-hidden",
        isNew && "border-brand-500/60 shadow-[var(--shadow-brand)]"
      )}
    >
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold leading-tight">
            {translation.sourceText.charAt(0).toUpperCase() +
              translation.sourceText.slice(1)}
          </h3>
          <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
            {translation.translationType}
            {isNew && (
              <span className="ms-2 inline-flex items-center gap-1 font-medium text-brand-600 dark:text-brand-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                {t("justNow")}
              </span>
            )}
          </p>
        </div>

        <Link
          href={`/dashboard/profile/${translation.userId}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pe-2.5 ps-1 text-[11px] font-medium transition-colors hover:border-border-strong"
        >
          <Image
            src={translation.userImage || "/imgs/userIcon.jpg"}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] rounded-full object-cover"
          />
          <span className="max-w-20 truncate">{displayName}</span>
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-1 px-4">
        {langs.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelectLang(lang)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              active === lang
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 text-muted-foreground hover:text-foreground"
            )}
          >
            <span aria-hidden>{getLanguage(lang)?.flag ?? "🌐"}</span>{" "}
            {langName(lang)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex-1 border-t border-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <p
            dir={isRTL(active) ? "rtl" : "ltr"}
            className="font-display text-xl font-semibold leading-snug break-words"
          >
            {text}
          </p>
          <div className="flex shrink-0 items-center opacity-60 transition-opacity group-hover:opacity-100">
            <SpeakButton text={text} lang={active} size={14} />
            <CopyButton value={text} size={14} />
          </div>
        </div>

        {example && (
          <p
            dir={isRTL(active) ? "rtl" : "ltr"}
            className="mt-2 border-s-2 border-brand-400 ps-2.5 text-xs leading-relaxed text-muted-foreground"
          >
            {example}
          </p>
        )}
      </div>
    </motion.article>
  );
}
