export function xpForLevel(level: number) {
  return 100 * Math.pow(Math.max(level - 1, 0), 2);
}

export function levelFromXP(xp: number) {
  return Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;
}

export function levelProgress(xp = 0) {
  const level = levelFromXP(xp);
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const span = ceiling - floor || 1;

  return {
    level,
    into: xp - floor,
    needed: span,
    remaining: Math.max(ceiling - xp, 0),
    percent: Math.min(100, Math.round(((xp - floor) / span) * 100)),
  };
}
