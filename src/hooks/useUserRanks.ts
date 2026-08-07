import { useQuery } from "@tanstack/react-query";

interface UserRanks {
  daily: number | null;
  monthly: number | null;
  allTime: number | null;
}

async function fetchUserRanks(userId: string): Promise<UserRanks> {
  const res = await fetch(`/api/community/users/userRank?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user ranks");
  const data = await res.json();
  return { daily: data.daily, monthly: data.monthly, allTime: data.allTime };
}

export function useUserRanks(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-ranks", userId],
    queryFn: () => fetchUserRanks(userId),
    enabled: !!userId,
    refetchInterval: 60_000,
  });

  return {
    userRanks: data ?? { daily: null, monthly: null, allTime: null },
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
