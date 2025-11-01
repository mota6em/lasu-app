"use client";
import { FaCrown } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import useProfile from "@/hooks/useProfile";
import Hero from "@/components/pages/profile/Hero";
import UserProfileStatsGrid from "@/components/pages/profile/UserProfileStatsGrid";

export default function ProfilePage() {
  const { user, allStats } = useProfile();

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
      <UserProfileStatsGrid {...allStats} />

      <p className="text-center text-gray-400 text-sm mt-4 flex items-center justify-center gap-1">
        <FaCrown className="text-yellow-600" /> LaSu — Language learning made
        powerful.
      </p>
    </div>
  );
}
