"use client";
import { useUserStats } from "@/hooks/useUserStats";
import { useEffect, useState } from "react";
import { MdOutlineCelebration } from "react-icons/md";

import StatCard from "./StatCard";

export default function CommHero({
  userName,
  userId,
}: {
  userName: string;
  userId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { stats, loading, error } = useUserStats(userId);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="p-6 text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold flex items-center gap-2 animate-bounce">
        Hi{" "}
        <span className="italic text-yellow-600 dark:text-yellow-500">
          {userName.split(" ")[0]}
        </span>{" "}
        <MdOutlineCelebration className="" />
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Here's what your mates are learning —{" "}
        <span className="text-yellow-600 dark:text-yellow-500">
          join the fun!
        </span>
      </p>
      <div className="flex w-md justify-center gap-6 mt-6 text-center">
        <StatCard title="XP" value={mounted ? stats.xp : 0} loading={loading} />
        <StatCard
          title="Level"
          value={mounted ? stats.level : 0}
          loading={loading}
        />
        <StatCard
          title="Streak"
          value={mounted ? stats.streak : 0}
          loading={loading}
          suffix="days"
        />
      </div>
    </div>
  );
}
