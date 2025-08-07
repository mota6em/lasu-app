"use client";
import { ModeToggle } from "./ModeToggle";
import { UserMenu } from "./UserMenu";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export function Topbar() {
  const { data: session, status } = useSession();
  return (
    <header className="z-50 sticky top-0 w-full px-6 py-3 border-b bg-white dark:bg-[#121212] flex justify-between items-center">
      {status === "loading" && <Skeleton className="h-6 w-[275px] " />}
      {status !== "loading" && (
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-200">
          Welcome to LaSu
          {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
        </h3>
      )}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
