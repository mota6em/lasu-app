export interface DayPoint {
  date: string;
  count: number;
}

export function dayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

// the aggregate only returns days that had activity, so gaps are filled in here
// to keep the x-axis honest
export function fillDays(series: DayPoint[], days: number): DayPoint[] {
  const counts = new Map(series.map((point) => [point.date, point.count]));
  const filled: DayPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = dayKey(day);
    filled.push({ date: key, count: counts.get(key) ?? 0 });
  }

  return filled;
}

export function currentStreak(series: DayPoint[]) {
  const counts = new Map(series.map((point) => [point.date, point.count]));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // today not being logged yet should not break a streak that is still alive
  if (!counts.get(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (counts.get(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function busiestDay(series: DayPoint[]) {
  return series.reduce<DayPoint | null>(
    (best, point) => (!best || point.count > best.count ? point : best),
    null
  );
}
