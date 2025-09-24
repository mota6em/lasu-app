"use client";
import { ModeToggle } from "./ModeToggle";
import { UserMenu } from "./UserMenu";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import LogoAndMenuBtn from "./LogoAndMenuBtn";
import { Skeleton } from "../ui/skeleton";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session, status } = useSession();
  return (
    <header className="z-40 sticky top-0 w-full ps-4 px-6 py-1 lg:py-2 border-b bg-white dark:bg-[#121212] flex justify-between items-center">
      <div className="hidden lg:block">
        {status === "loading" && <Skeleton className="h-6 w-[275px] " />}
        {status !== "loading" && (
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-200">
            Welcome to LaSu
            {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
          </h3>
        )}
      </div>
      <div className="flex items-center gap-3">
        <LogoAndMenuBtn onMenuClick={onMenuClick} />

        {status === "loading" && (
          <Skeleton className="  h-6 mt-1 w-[275px] hidden md:block lg:hidden " />
        )}

        {session && (
          <div className="hidden md:block lg:hidden pt-1">
            <h3 className="text-md font-sans text-gray-600 dark:text-gray-500 text-end">
              | Happy to see you
              {session?.user?.name
                ? `, ${session.user.name.split(" ")[0]}`
                : ""}
              !
            </h3>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
export default Topbar;
