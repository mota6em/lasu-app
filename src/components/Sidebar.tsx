"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Home, History, BarChart, Settings, LogOut } from "lucide-react";
import { useSettingsDialog } from "@/store/useSettingsDialog";
import TranslationSettingDialog from "./TranslationSettingDialog";

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
  const { data: session } = useSession();
  const { isOpen, toggleSettingsDialog } = useSettingsDialog();

  const showSettingsDialog = () => {
    toggleSettingsDialog();
  };

  return (
    <aside className="w-56 bg-white border-r min-h-screen px-5 py-6 flex flex-col justify-between">
      <div>
        <TranslationSettingDialog />
        <h2 className="text-2xl font-bold mb-8 text-gray-800 lasu-logo">
          LaSu
        </h2>

        {!session && (
          <div className="group">
            <div className="space-y-4 group">
              <div className="flex flex-row gap-2 items-center ">
                <img
                  src="/imgs/sad-lasu-icon.png"
                  alt="Sad Owl"
                  className="w-10 h-10 group-hover:hidden"
                />
                <img
                  src="/imgs/happy-lasu-icon.png"
                  alt="Happy Owl"
                  className="w-10 h-10 hidden group-hover:block"
                />
                <p className="text-sm text-gray-500 ">
                  You're not logged in. <br />
                  Please log in to use our full features.
                </p>
              </div>
              <button
                className="bg-blue-900 group-hover:bg-blue-700 cursor-pointer text-white text-sm px-3 py-2 rounded-md w-full group"
                onClick={() => signIn("google")}
              >
                Login with Google
              </button>
            </div>
          </div>
        )}

        {session && (
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
                        ? "bg-gray-100 text-black border border-gray-300"
                        : ""
                    } flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-black"
                        : "text-gray-600 hover:bg-gray-50"
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
                      ? "bg-gray-100 text-black border border-gray-300"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {session && (
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm cursor-pointer text-gray-500 hover:text-black transition mt-8"
        >
          <LogOut size={18} />
          Logout
        </button>
      )}
    </aside>
  );
}
