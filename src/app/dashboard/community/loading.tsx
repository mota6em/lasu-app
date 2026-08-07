import LiveTranslationsSkeleton from "@/components/pages/community/LiveTranslationsSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="shimmer h-8 w-40 rounded-lg" />
        <div className="shimmer h-8 w-24 rounded-lg" />
      </div>
      <div className="shimmer h-64 rounded-2xl" />
      <div className="shimmer h-72 rounded-2xl" />
      <LiveTranslationsSkeleton />
    </div>
  );
}
