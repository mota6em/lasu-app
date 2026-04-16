"use client";

import type { ReactElement } from "react";
import { useParams } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import {
  FaCrown,
  FaBolt,
  FaStar,
  FaFire,
  FaLanguage,
  FaUserAlt,
} from "react-icons/fa";

export default function PublicProfilePage() {
  const params = useParams() as { id: string };
  const { id } = params;
  const { allStats, user, publicUserLoading } = useProfile({ sUserId: id });

  if (publicUserLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <FaUserAlt className="text-5xl text-gray-400" />
        <p className="text-gray-500">User not found</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center mb-2 text-yellow-600 flex items-center justify-center gap-2">
        <FaCrown className="text-yellow-600" /> {user.name}'s Profile
      </h2>
      <p className="text-center text-gray-600">Public View Only</p>

      <div className="flex flex-col items-center">
        <img
          src={user.image || "/imgs/icons/default.png"}
          alt={user.name || "User profile"}
          className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow-md object-cover"
        />
        <p className="mt-2 text-lg font-semibold">{user.name}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4">
        <Stat icon={<FaBolt />} label="XP" value={allStats.xp} />
        <Stat icon={<FaStar />} label="Level" value={allStats.level} />
        <Stat icon={<FaFire />} label="Streak" value={allStats.streakDays} />
        <Stat
          icon={<FaLanguage />}
          label="Translations"
          value={allStats.totalTranslations}
        />
      </div>
    </div>
  );
}

const Stat = ({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string | number;
}) => (
  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl shadow flex flex-col items-center justify-center">
    <div className="flex items-center gap-2 text-yellow-600 text-xl">
      {icon}
    </div>
    <p className="text-2xl font-bold text-yellow-700">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);
