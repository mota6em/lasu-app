"use client";
import { useEffect, useState } from "react";

type Period = "daily" | "monthly" | "allTime";

export function useTopLearners(period: Period) {
  const [learners, setLearners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearners() {
      setLoading(true);
      const res = await fetch(`/api/community/top-learners?period=${period}`);
      const data = await res.json();
      setLearners(data);
      setLoading(false);
    }
    fetchLearners();
  }, [period]);

  return { learners, loading };
}
