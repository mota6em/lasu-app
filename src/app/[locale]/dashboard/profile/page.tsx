"use client";

import useProfile from "@/hooks/useProfile";
import Hero from "@/components/pages/profile/Hero";
import UserProfileStatsGrid from "@/components/pages/profile/UserProfileStatsGrid";

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="shimmer h-64 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, allStats } = useProfile();

  if (!user) return <ProfileSkeleton />;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your identity, avatar and progress in one place.
        </p>
      </header>

      <Hero />
      <UserProfileStatsGrid {...allStats} />
    </div>
  );
}
