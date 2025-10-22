"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableListProps {
  title?: string;
  items?: { word: string; count: number }[];
  limit?: number;
  max?: number;
  loading?: boolean;
}

export default function ExpandableList({
  title,
  items,
  limit = 3,
  max = 15,
  loading = false,
}: ExpandableListProps) {
  return (
    <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 hover:shadow-xl transition-all w-[350px] md:w-3/12">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>
      {loading ? (
        <ul className={cn(`space-y-2 h-50 !w-full overflow-y-hidden`)}>
          {[...Array(5)].map((_, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg px-3 py-3 bg-gray-50 dark:bg-neutral-800"
            >
              <div className="flex flex-row gap-1 w-3/4">
                <div className="h-4 w-32 bg-gray-300/40 dark:bg-gray-600/50 rounded" />
                <div className="h-3 w-4 bg-yellow-300/40 dark:bg-yellow-600/40 rounded" />
              </div>
              <div className="h-3 w-6 bg-gray-300/40 dark:bg-gray-600/50 rounded" />
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={cn(
            `space-y-2 h-50 !w-full`,
            items.length === 0 && "h-10",
            items.length >= 5 && "overflow-y-scroll"
          )}
        >
          {items.length === 0 && (
            <li className="flex items-center justify-between rounded-lg px-3 py-2 bg-gray-500 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
              <span className="text-sm font-medium">
                No results yet, yours can be the first!
              </span>
            </li>
          )}
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between  rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
            >
              <span className="text-sm font-medium">
                {item.word.slice(0, 1).toUpperCase() + item.word.slice(1)}{" "}
                <span className="text-xs font-medium p-1 text-yellow-500">
                  x{item.count}
                </span>
              </span>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{idx + 1}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
