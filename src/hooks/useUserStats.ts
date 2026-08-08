import CommunityUser from "@/types/communityUser";
import { useQuery } from "@tanstack/react-query";

async function fetchUserStats(userId: string): Promise<CommunityUser | null> {
  const res = await fetch(`/api/community/users/${userId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useUserStats(userId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: () => fetchUserStats(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });

  return {
    stats: data ?? ({} as CommunityUser),
    isMember: !!data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
