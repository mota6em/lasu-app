"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Home, History, BarChart, Settings, LogOut } from "lucide-react";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import TranslationSettingDialog from "./TranslationSettingDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { stat } from "fs";

const menu = [
  { label: "Overview", href: "/dashboard", icon: <Home size={18} /> },
  { label: "History", href: "/dashboard/history", icon: <History size={18} /> },
  { label: "Stats", href: "/dashboard/stats", icon: <BarChart size={18} /> },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={18} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isOpen, toggleSettingsDialog } = useSettingsDialog();

  const showSettingsDialog = () => {
    toggleSettingsDialog();
  };

  return (
    <aside className="w-56 bg-white dark:bg-[#121212] border-r min-h-screen px-5 py-6 flex flex-col justify-between">
      <div>
        <TranslationSettingDialog />
        <Link
          className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200 lasu-logo"
          href="/dashboard"
        >
          LaSu
        </Link>
        <nav className="space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            if (item.label === "Settings") {
              return (
                <div
                  key={item.href}
                  onClick={() => showSettingsDialog()}
                  className={`${
                    isOpen
                      ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                      : ""
                  } flex items-center gap-2 px-3 py-2 rounded-md transition text-sm font-medium  ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition text-sm font-medium ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          {status === "unauthenticated" && !session && (
            <div className="group absolute bottom-10 left-3 w-45">
              <div className="space-y-4 group">
                <div className="flex flex-row gap-2 items-center ">
                  <img
                    src="/imgs/sad-lasu-icon.png"
                    alt="Sad Owl"
                    className="w-10 h-10 group-hover:hidden dark:bg-amber-600 rounded-2xl "
                  />
                  <img
                    src="/imgs/happy-lasu-icon.png"
                    alt="Happy Owl"
                    className="w-10 h-10 hidden group-hover:block dark:bg-amber-500 rounded-xl"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-50 ">
                    You're not logged in. <br />
                    Please log in to use our full features.
                  </p>
                </div>
                <button
                  className="bg-black group-hover:bg-blue-950 dark:bg-amber-600 dark:group-hover:bg-amber-500  cursor-pointer text-white text-sm px-3 py-2 rounded-md w-full group"
                  onClick={() => signIn("google")}
                >
                  Login with Google
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
      {status === "loading" && <Skeleton className="h-4 w-[75px]" />}
      {session && (
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition mt-8"
        >
          <LogOut size={18} />
          Logout
        </button>
      )}
    </aside>
  );
}
