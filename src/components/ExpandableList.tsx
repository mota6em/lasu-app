"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

interface ExpandableListProps {
  title: string;
  items: string[];
  limit?: number;
  max?: number;
}

export default function ExpandableList({
  title,
  items,
  limit = 3,
  max = 15,
}: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items.slice(0, max) : items.slice(0, limit);

  return (
    <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 hover:shadow-xl transition-all">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>

      <ul className="space-y-2">
        {visibleItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <span className="text-sm font-medium">{item}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              #{idx + 1}
            </span>
          </li>
        ))}
      </ul>

      {items.length > limit && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                See less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                See more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
