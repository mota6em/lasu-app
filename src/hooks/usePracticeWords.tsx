import { useQuery } from "@tanstack/react-query";
import Translation from "@/types/translation";

export function usePracticeWords() {
  return useQuery<Translation[]>({
    queryKey: ["practice-words"],
    queryFn: async () => {
      const res = await fetch(`/api/translation/history?limit=50&filter=word`);
      if (!res.ok) throw new Error("Failed to fetch practice words");
      return res.json();
    },
  });
}
