"use client";
import { useUserRanks } from "@/hooks/useUserRanks";

export default function UserRanks({ userId }: { userId: string }) {
  const { userRanks, isLoading } = useUserRanks(userId);
  return (
    <span className="text-xs text-gray-400">
      Your Ranks:{" "}
      <span className="text-yellow-700 dark:text-yellow-400">Today:</span>{" "}
      {isLoading ? "-" : userRanks.daily ?? "-"} /{" "}
      <span className="text-yellow-700 dark:text-yellow-400">This Month:</span>{" "}
      {isLoading ? "-" : userRanks.monthly ?? "-"} /{" "}
      <span className="text-yellow-700 dark:text-yellow-400">All Time:</span>{" "}
      {isLoading ? "-" : userRanks.allTime ?? "-"}
    </span>
  );
}
