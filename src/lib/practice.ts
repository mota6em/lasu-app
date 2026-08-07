// answers are graded leniently: case, accents, punctuation and articles are
// noise for a vocabulary drill, and one typo should not read as "wrong"
const ARTICLES = /^(the|a|an|le|la|les|un|une|el|los|las|der|die|das|il|lo|gli)\s+/i;

export function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,!?;:'"()\[\]{}]/g, "")
    .replace(ARTICLES, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous = current;
  }

  return previous[b.length];
}

export type AnswerVerdict = "correct" | "close" | "wrong";

export function gradeAnswer(given: string, expected: string): AnswerVerdict {
  const a = normalizeAnswer(given);
  const b = normalizeAnswer(expected);

  if (!a) return "wrong";
  if (a === b) return "correct";

  // one slip in a longer word still counts, it is just flagged as close
  const tolerance = b.length > 7 ? 2 : b.length > 4 ? 1 : 0;
  return tolerance && levenshtein(a, b) <= tolerance ? "close" : "wrong";
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
