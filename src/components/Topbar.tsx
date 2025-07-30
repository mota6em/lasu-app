"use client";
import { UserMenu } from "./UserMenu";
import { useSession } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();
  return (
    <header className="w-full px-6 py-4 border-b bg-white flex justify-between items-center">
      <h3 className="text-xl font-bold">
        Welcome to LaSu{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
      </h3>
      <UserMenu />
    </header>
  );
}
