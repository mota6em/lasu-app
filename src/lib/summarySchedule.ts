const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const MIN_GAP_MS = 20 * HOUR_MS;
const TOLERANCE_MS = 2 * HOUR_MS;
const MAX_WINDOW_MS = 30 * DAY_MS;

export const FREE_HOUR = 18;
export const FREE_EVERY_DAYS = 3;

export type DigestSchedule = {
  hour: number;
  days: number[];
  includeSentences: boolean;
  timeZone: string;
};

export type DigestPrefs = DigestSchedule & { enabled: boolean };

export const FREE_SCHEDULE: Omit<DigestSchedule, "timeZone"> = {
  hour: FREE_HOUR,
  days: [],
  includeSentences: false,
};

const formatters = new Map<string, Intl.DateTimeFormat>();
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function formatter(timeZone: string) {
  let found = formatters.get(timeZone);
  if (!found) {
    found = new Intl.DateTimeFormat("en-US", {
      timeZone: isTimeZone(timeZone) ? timeZone : "UTC",
      hour: "2-digit",
      hour12: false,
      weekday: "short",
    });
    formatters.set(timeZone, found);
  }
  return found;
}

export function localParts(at: Date, timeZone: string) {
  const parts = formatter(timeZone).formatToParts(at);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const weekday = WEEKDAYS.indexOf(parts.find((p) => p.type === "weekday")?.value ?? "Sun");
  return { hour, weekday: weekday < 0 ? 0 : weekday };
}

export function normalizeSchedule(input: unknown, isPro: boolean): DigestSchedule {
  const src = (input ?? {}) as Partial<DigestSchedule>;
  const timeZone = isTimeZone(src.timeZone) ? src.timeZone : "UTC";
  if (!isPro) return { ...FREE_SCHEDULE, timeZone };

  const days = [
    ...new Set(
      (Array.isArray(src.days) ? src.days : [])
        .map(Number)
        .filter((day) => Number.isInteger(day) && day >= 0 && day < 7),
    ),
  ].sort((a, b) => a - b);

  const hour = Number(src.hour);
  return {
    hour: Number.isInteger(hour) && hour >= 0 && hour < 24 ? hour : FREE_HOUR,
    days,
    includeSentences: Boolean(src.includeSentences),
    timeZone,
  };
}

export function isDue(schedule: DigestSchedule, lastSentAt: Date | null, at: Date) {
  const { hour, weekday } = localParts(at, schedule.timeZone);
  if (hour !== schedule.hour) return false;

  const last = lastSentAt?.getTime() ?? 0;
  const elapsed = at.getTime() - last;
  if (last && elapsed < MIN_GAP_MS) return false;
  if (schedule.days.length) return schedule.days.includes(weekday);

  return !last || elapsed >= FREE_EVERY_DAYS * DAY_MS - TOLERANCE_MS;
}

export function windowStart(schedule: DigestSchedule, lastSentAt: Date | null, at: Date) {
  const fallback = (schedule.days.length ? 7 : FREE_EVERY_DAYS) * DAY_MS;
  const since = lastSentAt?.getTime() ?? at.getTime() - fallback;
  return new Date(Math.max(since, at.getTime() - MAX_WINDOW_MS));
}

export function nextRun(schedule: DigestSchedule, lastSentAt: Date | null, from: Date) {
  const start = Math.ceil(from.getTime() / HOUR_MS) * HOUR_MS;
  for (let step = 0; step < 24 * 14; step++) {
    const at = new Date(start + step * HOUR_MS);
    if (isDue(schedule, lastSentAt, at)) return at;
  }
  return null;
}

export function cadenceDays(schedule: DigestSchedule) {
  return schedule.days.length ? Math.round(7 / schedule.days.length) : FREE_EVERY_DAYS;
}
