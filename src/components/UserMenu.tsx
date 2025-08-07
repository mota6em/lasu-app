"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signIn, signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!user || status === "unauthenticated") {
    return (
      <button
        onClick={() => signIn("google")}
        className="text-sm px-4 py-2 rounded-md font-semibold bg-black dark:bg-amber-600 cursor-pointer hover:bg-blue-950 text-white"
      >
        Login
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback>
            {user.name?.slice(0, 2).toUpperCase() ?? "US"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-md text-black dark:text-white font-bold">
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-gray-400">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
