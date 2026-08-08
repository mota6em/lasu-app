const DAY = 86_400_000;

/** key into the `history` message namespace, or null when the label is a date */
export type DayBucketKey = "today" | "yesterday" | "thisWeek" | "thisMonth" | null;

export function dayBucket(input: string | Date, locale: string) {
  const date = new Date(input);
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const startOfDate = new Date(date).setHours(0, 0, 0, 0);
  const diffDays = Math.round((startOfToday - startOfDate) / DAY);

  if (diffDays <= 0) return { key: "today" as const, label: "today" };
  if (diffDays === 1) return { key: "yesterday" as const, label: "yesterday" };
  if (diffDays < 7) return { key: "thisWeek" as const, label: "thisWeek" };
  if (diffDays < 30) return { key: "thisMonth" as const, label: "thisMonth" };

  // older entries fall back to a real month name in the reader's own locale
  const label = date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
  return { key: null, label };
}

export function shortTime(input: string | Date, locale = "en") {
  const date = new Date(input);
  const sameDay =
    new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);

  return sameDay
    ? date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export function groupByDay<T>(
  items: T[],
  getDate: (item: T) => string | Date,
  locale: string
) {
  const groups = new Map<string, { key: DayBucketKey; entries: T[] }>();

  for (const item of items) {
    const { key, label } = dayBucket(getDate(item), locale);
    const bucket = groups.get(label);
    if (bucket) bucket.entries.push(item);
    else groups.set(label, { key, entries: [item] });
  }

  return Array.from(groups, ([label, bucket]) => ({ label, ...bucket }));
}
