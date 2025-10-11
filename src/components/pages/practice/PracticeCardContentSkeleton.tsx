"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LuTimer } from "react-icons/lu";

const PracticeCardContentSkeleton = () => {
  return (
    <Card className="w-xs py-1 md:w-xl lg:w-3xl shadow-xl rounded-2xl border-0 bg-sky-900 dark:bg-indigo-900/50 backdrop-blur-sm">
      <CardHeader className="flex mt-5 flex-row items-center justify-center">
        <CardTitle className="text-xl md:text-4xl font-bold text-violet-50">
          <Skeleton className="h-8 w-40 bg-violet-400/30 rounded-md" />
        </CardTitle>

        <Badge className="bg-violet-900/0 text-xl md:text-4xl flex items-center text-amber-400">
          <LuTimer className="!w-6 !h-6" />
          <Skeleton className="h-6 bg-yellow-500/50 w-10 ml-2" />
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3 md:gap-6 relative">
        <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-1 md:gap-3 items-center justify-end w-3/4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-6 w-50 bg-violet-400/30 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center flex-col gap-1 md:gap-3 w-full mt-1">
          <Skeleton className="h-8 md:h-10 w-2/4 bg-lime-400/30 rounded-lg" />
          <Skeleton className="h-8 md:h-10 w-2/4 bg-red-400/30 rounded-lg" />
        </div>

        <div className="w-full flex gap-x-3 md:gap-x-4 justify-center md:justify-end -mr-10 md:-mr-5">
          <Skeleton className="h-3 md:h-5 w-30 bg-green-400/30 rounded-md" />
          <Skeleton className="h-3 md:h-5 w-30 bg-red-400/30 rounded-md" />
          <Skeleton className="h-3 md:h-5 w-30 bg-yellow-400/30 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeCardContentSkeleton;
