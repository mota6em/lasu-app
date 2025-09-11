"use client";
import { useEffect, useState } from "react";

export function useLiveTranslations() {
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("/api/community/live");
      const data = await res.json();
      setTranslations(data);
      setLoading(false);
    }
    fetchData();

    //refresh every 10s for "live" feel
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { translations, loading };
}
