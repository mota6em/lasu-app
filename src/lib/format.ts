const DAY = 86_400_000;

export function relativeDay(input: string | Date) {
  const date = new Date(input);
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const startOfDate = new Date(date).setHours(0, 0, 0, 0);
  const diffDays = Math.round((startOfToday - startOfDate) / DAY);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "Earlier this week";
  if (diffDays < 30) return "This month";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function shortTime(input: string | Date) {
  const date = new Date(input);
  const sameDay =
    new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);

  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function groupByDay<T>(items: T[], getDate: (item: T) => string | Date) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = relativeDay(getDate(item));
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }

  return Array.from(groups, ([label, entries]) => ({ label, entries }));
}
