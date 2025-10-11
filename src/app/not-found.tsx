"use client";

import Link from "next/link";
import { FaRobot } from "react-icons/fa";
import { MdOutlineTranslate } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-sky-900 to-indigo-800 text-center p-5">
      <FaRobot className="text-8xl md:text-[120px] text-yellow-400 mb-4 animate-bounce" />
      <h2 className="text-3xl md:text-5xl font-bold text-yellow-300 mb-3">
        Oops! Language lost in translation...
      </h2>
      <p className="text-md md:text-xl text-white/80 mb-6 max-w-md flex flex-col items-center gap-2">
        <span>
          The page you're looking for doesn't exist. Maybe it's stuck in another
          language!
        </span>
        <MdOutlineTranslate className="text-3xl text-white/50 animate-spin mt-2" />
      </p>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-sky-900 font-semibold rounded-lg hover:bg-amber-500 transition"
      >
        <AiOutlineSearch className="text-xl" /> Return to Dashboard
      </Link>

      <div className="mt-10 text-white/50 animate-pulse flex items-center gap-2">
        <AiOutlineSearch /> Try translating something new instead!
      </div>
    </div>
  );
}
