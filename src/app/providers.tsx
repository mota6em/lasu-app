"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // data is considered fresh for 30s, so switching tabs/pages within
            // that window shows the cached result instantly instead of a spinner
            staleTime: 30 * 1000,
            // keep unused cache entries around so navigating back re-shows them
            // immediately while a background refetch happens (stale-while-revalidate)
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
