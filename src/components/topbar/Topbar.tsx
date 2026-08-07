"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Flame, Menu, Search } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { UserMenu } from "./UserMenu";
import { Skeleton } from "../ui/skeleton";
import { navItems } from "@/lib/nav";
import { useUserStats } from "@/hooks/useUserStats";
import { useCommandPalette } from "@/store/useCommandPalette";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StreakPill() {
  const { data: session } = useSession();
  const { stats, isMember } = useUserStats(session?.user?.id);

  if (!isMember || !stats.streak) return null;

  return (
    <Link
      href="/dashboard/community"
      title={`${stats.streak} day streak · ${stats.xp ?? 0} XP`}
      className="hidden items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-500/20 sm:inline-flex dark:text-brand-300"
    >
      <Flame className="h-3.5 w-3.5" />
      <span className="tabular-nums">{stats.streak}</span>
    </Link>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const openPalette = useCommandPalette((s) => s.open);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  const active = navItems.find((item) => item.href === pathname);
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/dashboard" className="lasu-logo text-gradient lg:hidden">
        LaSu
      </Link>

      <div className="hidden min-w-0 lg:block">
        {status === "loading" ? (
          <Skeleton className="h-5 w-56" />
        ) : (
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold leading-tight">
              {active?.label ?? "Dashboard"}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {firstName
                ? `${greeting()}, ${firstName}`
                : active?.description ?? "Learn languages as you browse"}
            </p>
          </div>
        )}
      </div>

      <div className="ms-auto flex items-center gap-2">
        <button
          onClick={openPalette}
          className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="kbd ms-4">{isMac ? "⌘" : "Ctrl"} K</kbd>
        </button>

        <button
          onClick={openPalette}
          aria-label="Search"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        <StreakPill />
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

export default Topbar;
