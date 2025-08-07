import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HistoryCardSkeleton() {
  return (
    <Card className="rounded-xl ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" /> {/* Date */}
          <Skeleton className="h-6 w-12 rounded-full" /> {/* Mode chip */}
        </div>
        <Skeleton className="h-5 w-1/3 mt-2" /> {/* Source text */}
        <Skeleton className="h-5 w-1/3 mt-2" /> {/* Source text */}
      </CardHeader>
      <CardContent className="space-y-7">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-28" /> {/* Language name */}
            <Skeleton className="h-5 w-full rounded-md" /> {/* Translation */}
            <Skeleton className="h-4 w-3/4" /> {/* Example sentence */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
