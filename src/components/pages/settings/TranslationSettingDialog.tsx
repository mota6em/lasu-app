"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Check, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { availableLanguages, popularLanguages } from "@/lib/languages";
import { useTranslateStore } from "@/store/useTranslateStore";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import saveSettings from "@/store/saveSettings";
import { cn } from "@/lib/utils";
import type Language from "@/types/language";

const MAX_LANGS = 4;
const MIN_LANGS = 1;

const TONES = ["formal", "casual", "slang", "academic", "funny"] as const;

const TranslationSettingDialog = () => {
  const t = useTranslations("settings");
  const tTone = useTranslations("tone");
  const { isOpen, toggleSettingsDialog } = useSettingsDialog();
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  const selectedLanguages = useTranslateStore((s) => s.selectedLanguages);
  const setSelectedLanguages = useTranslateStore((s) => s.setLanguages);
  const translationType = useTranslateStore((s) => s.translationType);
  const setTranslationType = useTranslateStore((s) => s.setTranslationType);

  const isFull = selectedLanguages.length >= MAX_LANGS;

  const languages = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = availableLanguages.filter(
      (lang) =>
        !term ||
        lang.name.toLowerCase().includes(term) ||
        lang.native.toLowerCase().includes(term)
    );
    if (term) return matches;
    // no search yet, so float the languages most people want to the top
    const rank = (value: string) => {
      const i = popularLanguages.indexOf(value);
      return i === -1 ? popularLanguages.length : i;
    };
    return [...matches].sort((a, b) => rank(a.value) - rank(b.value));
  }, [query]);

  const toggleLanguage = (lang: Language) => {
    const isSelected = selectedLanguages.some((l) => l.value === lang.value);

    if (isSelected) {
      if (selectedLanguages.length <= MIN_LANGS) {
        toast(t("keepOne"));
        return;
      }
      setSelectedLanguages(selectedLanguages.filter((l) => l.value !== lang.value));
      return;
    }

    if (isFull) {
      toast(t("maxReached"));
      return;
    }
    setSelectedLanguages([...selectedLanguages, { value: lang.value, label: lang.label }]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings({ selectedLanguages, translationType }, session);
      toast.success(t("saved"));
      toggleSettingsDialog();
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleSettingsDialog}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-6 py-4 text-start">
          <DialogTitle className="font-display text-xl">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          <section>
            <div className="mb-2.5 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{t("register")}</h3>
              <span className="text-xs text-muted-foreground">
                {t("registerHint")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TONES.map((tone) => {
                const active = translationType === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setTranslationType(tone)}
                    className={cn(
                      "rounded-xl border p-2.5 text-left transition-all",
                      active
                        ? "border-brand-500 bg-brand-500/10 shadow-[var(--shadow-brand)]"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-2"
                    )}
                  >
                    <span className="block text-sm font-medium">{tTone(tone)}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {tTone(`${tone}Hint`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-2.5 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{t("targets")}</h3>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  isFull ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground"
                )}
              >
                {selectedLanguages.length} / {MAX_LANGS}
              </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {selectedLanguages.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
                >
                  {lang.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            <div className="relative mb-2">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchLanguages", { count: availableLanguages.length })}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 ps-9 pe-3 text-sm outline-none transition-colors focus:border-brand-400"
              />
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-border">
              {languages.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {t("noLanguage", { query })}
                </p>
              )}
              {languages.map((lang) => {
                const active = selectedLanguages.some((l) => l.value === lang.value);
                const disabled = !active && isFull;
                return (
                  <button
                    key={lang.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left text-sm transition-colors last:border-b-0",
                      active ? "bg-brand-500/10" : "hover:bg-surface-2",
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span className="text-base" aria-hidden>
                      {lang.flag}
                    </span>
                    <span className="flex-1 truncate">
                      {lang.name}
                      <span className="ms-2 text-xs text-muted-foreground">
                        {lang.native}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-surface px-6 py-4">
          <Button variant="ghost" onClick={toggleSettingsDialog}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranslationSettingDialog;
