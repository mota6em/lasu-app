import { useState, useEffect } from "react";

interface UserRanks {
  daily: number | null;
  monthly: number | null;
  allTime: number | null;
}

export function useUserRanks(userId: string) {
  const [userRanks, setUserRanks] = useState<UserRanks>({
    daily: null,
    monthly: null,
    allTime: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchRanks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/community/users/userRank?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user ranks");
        const data = await res.json();
        setUserRanks({
          daily: data.daily,
          monthly: data.monthly,
          allTime: data.allTime,
        });
        
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanks();

    // refresh every minute
    const interval = setInterval(fetchRanks, 60_000);
    return () => clearInterval(interval);
  }, [userId]);

  return { userRanks, isLoading, error };
}
