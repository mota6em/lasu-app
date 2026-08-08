"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { useSettingsDialog } from "@/store/useSettingsDialog";

export function UserMenu() {
  const t = useTranslations("userMenu");
  const tShell = useTranslations("shell");
  const { data: session, status } = useSession();
  const { toggleSettingsDialog } = useSettingsDialog();
  const user = session?.user;

  if (status === "loading") {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.97]"
      >
        {tShell("signIn")}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback className="bg-surface-2 text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase() ?? "LS"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? ""} alt="" />
            <AvatarFallback className="text-xs">
              {user.name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/dashboard/profile">
            <User className="h-4 w-4" /> {t("profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={toggleSettingsDialog}
          className="cursor-pointer gap-2"
        >
          <Settings className="h-4 w-4" /> {t("preferences")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" /> {tShell("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
