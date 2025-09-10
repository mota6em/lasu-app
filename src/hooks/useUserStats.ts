import CommunityUser from "@/types/communityUser";
import { useState, useEffect } from "react";

export function useUserStats(userId: string) {
  const [stats, setStats] = useState<CommunityUser>({} as CommunityUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/community/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}
