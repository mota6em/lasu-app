import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { useUserStats } from "@/hooks/useUserStats";

const UserStats = ({ userId }: { userId: string }) => {
  const [mounted, setMounted] = useState(false);
  const { stats, loading, error } = useUserStats(userId);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex justify-center gap-6 mt-6 text-center">
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
  );
};

export default UserStats;
