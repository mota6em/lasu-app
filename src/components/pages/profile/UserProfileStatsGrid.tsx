"use client";

import { GiBookshelf } from "react-icons/gi";
import { FaBolt, FaFireAlt } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

interface UserStatsGridProps {
  totalTranslations: any;
  xp: any;
  streakDays: any;
}

export default function UserProfileStatsGrid({
  totalTranslations,
  xp,
  streakDays,
}: UserStatsGridProps) {
  console.log(totalTranslations, xp, streakDays);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center">
          <GiBookshelf className="text-3xl text-yellow-600 mb-1" />
          <p className="text-3xl font-bold text-yellow-600">
            {totalTranslations}
          </p>
          <p className="text-sm text-gray-600">Total Translations</p>
        </CardContent>
      </Card>
      <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center">
          <FaBolt className="text-3xl text-yellow-600 mb-1" />
          <p className="text-3xl font-bold text-yellow-600">{xp}</p>
          <p className="text-sm text-gray-600">XP</p>
        </CardContent>
      </Card>
      <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center">
          <FaFireAlt className="text-3xl text-yellow-600 mb-1" />
          <p className="text-3xl font-bold text-yellow-600">{streakDays}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </CardContent>
      </Card>
    </div>
  );
}
