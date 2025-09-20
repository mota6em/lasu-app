"use client";
import { Learner } from "@/types/learner";
import { useEffect, useState } from "react";

type Period = "daily" | "monthly" | "allTime";

export function useTopLearners(period: Period) {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearners() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/community/users/top-learners?period=${period}`
        );
        const topUsers: any[] = await res.json();

        const learnersWithInfo: Learner[] = await Promise.all(
          topUsers.map(async (u) => {
            const userRes = await fetch(`/api/users/${u.userId}`);
            const userData = await userRes.json();

            return {
              id: u.userId,
              name: userData.name || "Anonymous",
              Image: userData.image || "/imgs/userIcon.jpg",
              xp: u.xp || 0,
              totalTranslations: u[period + "Translations"]! || 0,
              showName: u.showName ?? true,
              showPicture: u.showPicture ?? true,
            };
          })
        );

        setLearners(learnersWithInfo);
      } catch (err) {
        console.error("Failed to fetch top learners:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLearners();
  }, [period]);

  return { learners, loading };
}
