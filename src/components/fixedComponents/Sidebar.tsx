"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Flame, LogOut, Settings, Sparkles, X, Zap } from "lucide-react";
import NavIcon from "./NavIcon";
import Logo from "@/components/brand/Logo";
import TranslationSettingDialog from "../pages/settings/TranslationSettingDialog";
import { Link, usePathname } from "@/i18n/routing";
import { navItems, prefetchRoute } from "@/lib/nav";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import { useUserStats } from "@/hooks/useUserStats";
import { cn } from "@/lib/utils";

function StreakCard() {
  const t = useTranslations("shell");
  const { data: session } = useSession();
  const { stats, isMember } = useUserStats(session?.user?.id);

  if (!session || !isMember) return null;

  return (
    <Link
      href="/dashboard/community"
      className="lift block rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-500/12 to-iris-500/10 p-3"
    >
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-brand-500" />
        <span className="font-display text-lg font-bold tabular-nums">
          {stats.streak ?? 0}
        </span>
        <span className="text-xs text-muted-foreground">{t("dayStreak")}</span>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3 text-brand-500" />
          {t("xpShort", { xp: stats.xp ?? 0 })}
        </span>
        <span>{t("level", { level: stats.level ?? 1 })}</span>
      </div>
    </Link>
  );
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const t = useTranslations("nav");
  const tShell = useTranslations("shell");
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isOpen, toggleSettingsDialog } = useSettingsDialog();
  const queryClient = useQueryClient();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const prefetch = (href: string) => () =>
    prefetchRoute(queryClient, href, session?.user?.id);

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || status !== "unauthenticated"
  );

  return (
    <>
      <TranslationSettingDialog />

      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-border bg-surface transition-transform duration-300",
          mobileOpen
            ? "translate-x-0"
            : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"
        )}
        style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-baseline gap-2"
          >
            <Logo markClassName="h-9 w-9" wordClassName="text-[26px]" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label={tShell("closeMenu")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 lg:hidden"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("workspace")}
          </p>

          <ul className="space-y-0.5">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    onMouseEnter={prefetch(item.href)}
                    onFocus={prefetch(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        className="absolute inset-0 rounded-lg border border-brand-500/25 bg-brand-500/10"
                      />
                    )}
                    <NavIcon
                      name={item.icon}
                      className={cn(
                        "relative h-[18px] w-[18px] shrink-0",
                        isActive && "text-brand-600 dark:text-brand-400"
                      )}
                    />
                    <span className="relative">{t(item.key)}</span>
                  </Link>
                </li>
              );
            })}

            <li>
              <button
                onClick={toggleSettingsDialog}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isOpen
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
              >
                <Settings className="h-[18px] w-[18px] shrink-0" />
                <span>{t("preferences")}</span>
              </button>
            </li>
          </ul>

          {status === "unauthenticated" && (
            <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <p className="text-sm font-semibold">{tShell("unlockTitle")}</p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {tShell("unlockBody")}
              </p>
              <button
                onClick={() => signIn("google")}
                className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
              >
                {tShell("continueWithGoogle")}
              </button>
            </div>
          )}
        </nav>

        <div className="space-y-3 border-t border-border p-3">
          <StreakCard />

          {session?.user && (
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
              <Image
                src={session.user.image || "/imgs/userIcon.jpg"}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{session.user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                title={tShell("signOut")}
                aria-label={tShell("signOut")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
