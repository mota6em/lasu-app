import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";

const LogoAndMenuBtn = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className="flex lg:hidden items-center gap-2 gap-x-4">
      <button
        className="lg:hidden  rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        title="Open menu"
      >
        <Menu size={28} />
      </button>
      <Link
        className="font-bold text-gray-800 dark:text-gray-200 lasu-logo"
        href="/dashboard"
      >
        LaSu
      </Link>
    </div>
  );
};

export default LogoAndMenuBtn;
