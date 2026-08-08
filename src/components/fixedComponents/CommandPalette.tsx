"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  CornerDownLeft,
  Globe,
  LogIn,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NavIcon from "./NavIcon";
import { useRouter } from "@/i18n/routing";
import { getLocaleMeta } from "@/i18n/locales";
import { navItems } from "@/lib/nav";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import { useCommandPalette } from "@/store/useCommandPalette";
import { useLanguageDialog } from "@/store/useLanguageDialog";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

export default function CommandPalette() {
  const t = useTranslations("palette");
  const tNav = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tShell = useTranslations("shell");

  const { isOpen: open, toggle, close } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const locale = useLocale();
  const { status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleSettingsDialog } = useSettingsDialog();
  const openLanguages = useLanguageDialog((s) => s.open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };

    const base: Command[] = navItems
      .filter((item) => !item.requiresAuth || status === "authenticated")
      .map((item) => ({
        id: item.href,
        label: tNav(item.key),
        hint: tNav(`${item.key}Hint`),
        icon: <NavIcon name={item.icon} className="h-4 w-4" />,
        run: go(item.href),
      }));

    base.push({
      id: "preferences",
      label: tNav("preferences"),
      hint: t("preferencesHint"),
      icon: <Settings className="h-4 w-4" />,
      run: () => {
        close();
        toggleSettingsDialog();
      },
    });

    base.push({
      id: "language",
      label: t("language"),
      hint: t("languageHint", { language: getLocaleMeta(locale)?.native ?? locale }),
      icon: <Globe className="h-4 w-4" />,
      run: () => {
        close();
        openLanguages();
      },
    });

    base.push({
      id: "theme",
      label: resolvedTheme === "dark" ? tTheme("switchToLight") : tTheme("switchToDark"),
      icon:
        resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        ),
      run: () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        close();
      },
    });

    base.push(
      status === "authenticated"
        ? {
            id: "signout",
            label: tShell("signOut"),
            icon: <LogOut className="h-4 w-4" />,
            run: () => {
              close();
              signOut();
            },
          }
        : {
            id: "signin",
            label: t("signInWithGoogle"),
            icon: <LogIn className="h-4 w-4" />,
            run: () => {
              close();
              signIn("google");
            },
          }
    );

    return base;
  }, [
    router,
    status,
    resolvedTheme,
    setTheme,
    toggleSettingsDialog,
    openLanguages,
    locale,
    close,
    t,
    tNav,
    tTheme,
    tShell,
  ]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matched = term
      ? commands.filter(
          (c) =>
            c.label.toLowerCase().includes(term) ||
            c.hint?.toLowerCase().includes(term)
        )
      : commands;

    if (!term) return matched;

    return [
      {
        id: "translate",
        label: t("translateAction", { query: query.trim() }),
        hint: t("translateHint"),
        icon: <ArrowRight className="h-4 w-4" />,
        run: () => {
          close();
          router.push(`/dashboard?text=${encodeURIComponent(query.trim())}`);
        },
      } as Command,
      ...matched,
    ];
  }, [commands, query, router, close, t]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent
        showCloseButton={false}
        className="top-[18%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setCursor((c) => (c + 1) % Math.max(results.length, 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            results[cursor]?.run();
          }
        }}
      >
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="h-13 w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          )}
          {results.map((command, index) => (
            <button
              key={command.id}
              data-index={index}
              onMouseEnter={() => setCursor(index)}
              onClick={command.run}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors",
                index === cursor ? "bg-surface-2" : "hover:bg-surface-2/60"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface",
                  index === cursor && "border-brand-500/40 text-brand-600 dark:text-brand-400"
                )}
              >
                {command.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {command.label}
                </span>
                {command.hint && (
                  <span className="block truncate text-xs text-muted-foreground">
                    {command.hint}
                  </span>
                )}
              </span>
              {index === cursor && (
                <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground rtl:-scale-x-100" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-border bg-surface-2/60 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> {t("navigate")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="kbd">↵</kbd> {t("open")}
          </span>
          <span className="ms-auto flex items-center gap-1">
            <kbd className="kbd">/</kbd> {t("focusComposer")}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
