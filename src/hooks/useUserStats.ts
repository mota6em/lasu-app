import CommunityUser from "@/types/communityUser";
import { useQuery } from "@tanstack/react-query";

async function fetchUserStats(userId: string): Promise<CommunityUser> {
  const res = await fetch(`/api/community/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useUserStats(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });

  return {
    stats: data ?? ({} as CommunityUser),
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
