"use client";
import { Learner } from "@/types/learner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Period = "daily" | "monthly" | "allTime" | null;

async function fetchTopLearners(period: Period): Promise<Learner[]> {
  const res = await fetch(`/api/community/users/top-learners?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch top learners");
  const topUsers: any[] = await res.json();

  return topUsers.map((u) => ({
    id: u.userId,
    name: u.name || "Anonymous",
    Image: u.image || "/imgs/userIcon.jpg",
    xp: u.xp || 0,
    totalTranslations: u[period + "Translations"]! || 0,
    showName: u.showName ?? true,
    showPicture: u.showPicture ?? true,
  }));
}

export function useTopLearners(period: Period) {
  const { data, isLoading } = useQuery({
    queryKey: ["top-learners", period],
    queryFn: () => fetchTopLearners(period),
    enabled: !!period,
    // show the previous period's list while the new one loads instead of a blank/skeleton flash
    placeholderData: keepPreviousData,
  });

  return { learners: data ?? [], loading: isLoading };
}
