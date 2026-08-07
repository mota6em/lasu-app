import type { QueryClient } from "@tanstack/react-query";

export interface NavItem {
  label: string;
  href: string;
  icon: "home" | "practice" | "history" | "stats" | "community";
  description: string;
  requiresAuth?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Translate",
    href: "/dashboard",
    icon: "home",
    description: "Translate a word or a sentence",
  },
  {
    label: "Practice Hub",
    href: "/dashboard/practice",
    icon: "practice",
    description: "Drill the words you saved",
    requiresAuth: true,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: "history",
    description: "Everything you have translated",
  },
  {
    label: "Stats",
    href: "/dashboard/stats",
    icon: "stats",
    description: "Your activity and top languages",
  },
  {
    label: "Community",
    href: "/dashboard/community",
    icon: "community",
    description: "Leaderboards and live translations",
  },
];

const json = (url: string) => async () => {
  const res = await fetch(url);
  return res.json();
};

// warm the cache for a nav destination on hover so the page has data the instant it mounts
export function prefetchRoute(
  queryClient: QueryClient,
  href: string,
  userId?: string
) {
  if (href === "/dashboard/community") {
    queryClient.prefetchQuery({
      queryKey: ["community-stats"],
      queryFn: async () => (await (await fetch("/api/community/stats")).json()).data,
    });
    queryClient.prefetchQuery({
      queryKey: ["community-live"],
      queryFn: json("/api/community/live"),
    });
    return;
  }

  if (!userId) return;

  if (href === "/dashboard/history") {
    queryClient.prefetchQuery({
      queryKey: ["translation-history", "all"],
      queryFn: json("/api/translation/history?filter=all"),
    });
  } else if (href === "/dashboard/stats") {
    queryClient.prefetchQuery({
      queryKey: ["translation-stats", userId],
      queryFn: json("/api/translation/history?wantStats=1"),
    });
  } else if (href === "/dashboard/practice") {
    queryClient.prefetchQuery({
      queryKey: ["practice-words"],
      queryFn: json("/api/translation/history?limit=50&filter=word"),
    });
  }
}
