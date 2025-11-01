"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FaCrown, FaFireAlt } from "react-icons/fa";
import { GiBookshelf, GiBrain } from "react-icons/gi";
import { Toaster } from "react-hot-toast";
import useProfile from "@/hooks/useProfile";
import Hero from "@/components/pages/profile/Hero";
import CommHero from "@/components/pages/community/CommHero";
import UserStats from "@/components/pages/community/UserStats";

export default function ProfilePage() {
  const { user, stats, setName, setIcon } = useProfile();

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-3xl font-bold text-center mb-2 text-yellow-600 flex items-center justify-center gap-2">
        <FaCrown className="text-yellow-600" /> My Profile
      </h2>
      <p className="text-center text-gray-600">Manage your info and rewards.</p>

      <Hero />
      <UserStats userId={user.id} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <GiBookshelf className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.totalTranslations}
            </p>
            <p className="text-sm text-gray-600">Total Translations</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <GiBrain className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.wordsLearned}
            </p>
            <p className="text-sm text-gray-600">Words Learned</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <FaFireAlt className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.streakDays}
            </p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4 flex items-center justify-center gap-1">
        <FaCrown className="text-yellow-600" /> LaSu — Language learning made
        powerful.
      </p>
    </div>
  );
}
