"use client";

import Link from "next/link";
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
import { FaUser } from "react-icons/fa";
import { LogOut } from "lucide-react";

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
        className="text-xs md:text-sm px-4 py-2 rounded-md font-semibold bg-black dark:bg-amber-600 cursor-pointer hover:bg-blue-950 text-white"
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
        <DropdownMenuLabel className="text-md text-black w-full text-center dark:text-white font-bold">
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-center text-gray-400">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 text-sm text-black dark:text-white"
          >
            <FaUser className="text-yellow-600" /> My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
