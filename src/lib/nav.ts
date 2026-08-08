import type { QueryClient } from "@tanstack/react-query";

export interface NavItem {
  key: "translate" | "practice" | "history" | "stats" | "community";
  href: string;
  icon: "home" | "practice" | "history" | "stats" | "community";
  requiresAuth?: boolean;
}

export const navItems: NavItem[] = [
  { key: "translate", href: "/dashboard", icon: "home" },
  {
    key: "practice",
    href: "/dashboard/practice",
    icon: "practice",
    requiresAuth: true,
  },
  { key: "history", href: "/dashboard/history", icon: "history" },
  { key: "stats", href: "/dashboard/stats", icon: "stats" },
  { key: "community", href: "/dashboard/community", icon: "community" },
];

const json = (url: string) => async () => {
  const res = await fetch(url);
  return res.json();
};

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
