import Translation from "@/types/translation";
import User from "@/types/user";
import { getLanguage } from "@/lib/languages";
import { cadenceDays, type DigestSchedule } from "@/lib/summarySchedule";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
} as SMTPTransport.Options);

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://lasu.online").replace(/\/$/, "");

const LINKS = {
  history: `${APP_URL}/dashboard/history`,
  practice: `${APP_URL}/dashboard/practice`,
  stats: `${APP_URL}/dashboard/stats`,
  community: `${APP_URL}/dashboard/community`,
  upgrade: `${APP_URL}/dashboard/upgrade`,
  settings: `${APP_URL}/dashboard?settings=email`,
};

const C = {
  page: "#f2f0ec",
  card: "#ffffff",
  soft: "#f8f7f4",
  ink: "#15171e",
  inkSoft: "#40424a",
  muted: "#676972",
  line: "#e5e3df",
  brand: "#ee9b1a",
  brandDeep: "#b45d1b",
  brandTint: "#fcf7e8",
  brandLine: "#f8de97",
  iris: "#6953e3",
  irisDeep: "#5642c8",
  irisTint: "#f5f4fe",
  irisLine: "#d7d4ff",
  night: "#1c154b",
  success: "#29a259",
  successTint: "#eaf7ef",
};

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
const DAY_MS = 86_400_000;

export interface CommunityStats {
  streak?: number;
  level?: number;
  xp?: number;
  rank?: number;
}

export type SummaryOptions = {
  since: Date;
  schedule: DigestSchedule;
  isPro?: boolean;
  community?: CommunityStats;
  nextAt?: Date | null;
  now?: Date;
};

type Entry = {
  text: string;
  kind: "word" | "phrase";
  langs: Record<string, string>;
  romanization: Record<string, string>;
  examples: Record<string, string>;
  exampleMeanings: Record<string, string>;
  meaning: string;
  partOfSpeech: string;
  difficulty: string;
  note: string;
  synonyms: string[];
  createdAt: Date;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(user: User) {
  const name = (user.name || "").trim().split(/\s+/)[0];
  return name || "there";
}

function langMeta(lang: string) {
  const meta = getLanguage(lang);
  return {
    flag: meta?.flag || "🌍",
    name: meta?.name || lang.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()),
    dir: meta?.rtl ? "rtl" : "ltr",
  };
}

function plural(count: number, word: string) {
  if (count === 1) return `${count} ${word}`;
  const suffix = /[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ies` : `${word}s`;
  return `${count} ${suffix}`;
}

function seedFrom(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function dateLabel(at: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, month: "short", day: "numeric" }).format(at);
}

function whenLabel(at: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(at);
}

function spanOf(since: Date, now: Date) {
  const days = Math.max(1, Math.round((now.getTime() - since.getTime()) / DAY_MS));
  if (days <= 1) {
    return { days, of: "your day", when: "today", badge: "Daily summary", pick: "Pick of the day" };
  }
  if (days >= 6 && days <= 8) {
    return { days, of: "your week", when: "this week", badge: "Weekly summary", pick: "Pick of the week" };
  }
  return {
    days,
    of: `the last ${days} days`,
    when: `over the last ${days} days`,
    badge: `Every ${days} days`,
    pick: "Standout pick",
  };
}

function buildEntries(userTranslations: Translation[]) {
  const merged = new Map<string, Entry>();

  for (const t of userTranslations) {
    const text = (t.sourceText || "").trim();
    if (!text) continue;

    const key = text.toLowerCase();
    const result = t.result || ({} as Translation["result"]);
    const kind: "word" | "phrase" =
      result.kind === "phrase" || result.kind === "word"
        ? result.kind
        : /\s/.test(text)
          ? "phrase"
          : "word";

    let entry = merged.get(key);
    if (!entry) {
      entry = {
        text,
        kind,
        langs: {},
        romanization: {},
        examples: {},
        exampleMeanings: {},
        meaning: "",
        partOfSpeech: "",
        difficulty: "",
        note: "",
        synonyms: [],
        createdAt: new Date(t.createdAt),
      };
      merged.set(key, entry);
    }

    const createdAt = new Date(t.createdAt);
    if (createdAt > entry.createdAt) entry.createdAt = createdAt;

    entry.meaning ||= result.meaning || "";
    entry.partOfSpeech ||= result.partOfSpeech || "";
    entry.difficulty ||= result.difficulty || "";
    entry.note ||= result.note || "";
    if (!entry.synonyms.length && Array.isArray(result.synonyms)) {
      entry.synonyms = result.synonyms.filter(Boolean).slice(0, 3);
    }

    const translations: Record<string, string> = result.translations || {};
    for (const [lang, value] of Object.entries(translations)) {
      if (!value) continue;
      entry.langs[lang] ||= value;
      const roman = result.romanization?.[lang];
      if (roman) entry.romanization[lang] ||= roman;
      const example = result.example?.[lang];
      if (example) entry.examples[lang] ||= example;
      const exampleMeaning = result.exampleMeaning?.[lang];
      if (exampleMeaning) entry.exampleMeanings[lang] ||= exampleMeaning;
    }
  }

  return Array.from(merged.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

function pickSpotlight(entries: Entry[], seed: number) {
  let best: Entry | null = null;
  let bestScore = -1;

  entries.forEach((entry, index) => {
    const exampleCount = Object.keys(entry.examples).length;
    const score =
      (exampleCount ? 3 : 0) +
      (entry.meaning ? 2 : 0) +
      (entry.note ? 2 : 0) +
      (entry.synonyms.length ? 1 : 0) +
      Math.min(Object.keys(entry.langs).length, 4) +
      CEFR.indexOf(entry.difficulty) +
      ((seed + index) % 3);

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });

  return best as Entry | null;
}

function button(href: string, label: string, variant: "solid" | "ghost" = "solid") {
  const bg = variant === "solid" ? C.brand : C.card;
  const fg = variant === "solid" ? "#2b1503" : C.irisDeep;
  const border = variant === "solid" ? C.brand : C.irisLine;

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:0 auto;">
    <tr>
      <td align="center" bgcolor="${bg}" class="btn" style="border-radius:12px;border:1px solid ${border};">
        <a href="${href}" target="_blank" style="display:inline-block;padding:13px 24px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;line-height:20px;color:${fg};text-decoration:none;border-radius:12px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function chip(label: string, bg: string, fg: string, line: string) {
  return `<span style="display:inline-block;margin:0 4px 4px 0;padding:3px 9px;background-color:${bg};border:1px solid ${line};border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${fg};">${escapeHtml(label)}</span>`;
}

function difficultyChip(level: string) {
  if (!CEFR.includes(level)) return "";
  if (level.startsWith("A")) return chip(level, C.successTint, "#1c7a42", "#c9e9d6");
  if (level.startsWith("B")) return chip(level, C.brandTint, C.brandDeep, C.brandLine);
  return chip(level, C.irisTint, C.irisDeep, C.irisLine);
}

function translationRows(entry: Entry, withExamples: boolean) {
  return Object.entries(entry.langs)
    .map(([lang, value]) => {
      const meta = langMeta(lang);
      const roman = entry.romanization[lang];
      const example = withExamples ? entry.examples[lang] : "";
      const exampleMeaning = withExamples ? entry.exampleMeanings[lang] : "";

      return `
      <tr>
        <td width="28" valign="top" style="padding:7px 0 0 0;font-size:16px;line-height:20px;">${meta.flag}</td>
        <td valign="top" style="padding:6px 0 6px 0;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${C.muted};" class="dm-muted">${escapeHtml(meta.name)}</div>
          <div dir="${meta.dir}" style="font-size:16px;line-height:22px;font-weight:600;color:${C.ink};margin-top:2px;" class="dm-text">${escapeHtml(value)}${
            roman
              ? `<span dir="ltr" style="font-weight:400;font-size:12px;color:${C.muted};"> · ${escapeHtml(roman)}</span>`
              : ""
          }</div>
          ${
            example
              ? `<div style="margin-top:7px;padding:9px 11px;background-color:${C.soft};border-left:3px solid ${C.brandLine};border-radius:0 8px 8px 0;" class="dm-soft">
                   <div dir="${meta.dir}" style="font-size:13px;line-height:19px;color:${C.inkSoft};font-style:italic;" class="dm-text-soft">“${escapeHtml(example)}”</div>
                   ${
                     exampleMeaning
                       ? `<div style="font-size:12px;line-height:18px;color:${C.muted};margin-top:4px;" class="dm-muted">→ ${escapeHtml(exampleMeaning)}</div>`
                       : ""
                   }
                 </div>`
              : ""
          }
        </td>
      </tr>`;
    })
    .join("");
}

function spotlightCard(entry: Entry, label: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.brandTint};border:1px solid ${C.brandLine};border-radius:18px;margin:0 0 8px 0;" class="dm-spot">
    <tr>
      <td style="padding:20px 22px 22px 22px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${C.brandDeep};">⭐ ${escapeHtml(label)}</div>
        <div style="font-size:30px;line-height:38px;font-weight:800;color:${C.ink};margin:8px 0 4px 0;letter-spacing:-0.01em;" class="dm-text">${escapeHtml(entry.text)}</div>
        <div>${entry.partOfSpeech ? chip(entry.partOfSpeech, "#ffffff", C.brandDeep, C.brandLine) : ""}${difficultyChip(entry.difficulty)}</div>
        ${
          entry.meaning
            ? `<div style="font-size:14px;line-height:21px;color:${C.inkSoft};margin:8px 0 0 0;" class="dm-text-soft">${escapeHtml(entry.meaning)}</div>`
            : ""
        }
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:#ffffff;border-radius:14px;margin-top:14px;" class="dm-card">
          <tr>
            <td style="padding:8px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${translationRows(entry, true)}</table>
            </td>
          </tr>
        </table>
        ${
          entry.note
            ? `<div style="font-size:13px;line-height:19px;color:${C.brandDeep};margin-top:12px;">💡 ${escapeHtml(entry.note)}</div>`
            : ""
        }
        ${
          entry.synonyms.length
            ? `<div style="font-size:12px;line-height:18px;color:${C.muted};margin-top:8px;" class="dm-muted">Also: ${entry.synonyms.map((s) => escapeHtml(s)).join(" · ")}</div>`
            : ""
        }
      </td>
    </tr>
  </table>`;
}

function detailCard(entry: Entry) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.card};border:1px solid ${C.line};border-radius:16px;margin:0 0 10px 0;" class="dm-card">
    <tr>
      <td style="padding:16px 18px 14px 18px;">
        <div style="font-size:20px;line-height:26px;font-weight:700;color:${C.ink};letter-spacing:-0.01em;" class="dm-text">${escapeHtml(entry.text)}</div>
        <div style="margin-top:6px;">${entry.partOfSpeech ? chip(entry.partOfSpeech, C.irisTint, C.irisDeep, C.irisLine) : ""}${difficultyChip(entry.difficulty)}</div>
        ${
          entry.meaning
            ? `<div style="font-size:13px;line-height:20px;color:${C.muted};margin-top:2px;" class="dm-muted">${escapeHtml(entry.meaning)}</div>`
            : ""
        }
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">${translationRows(entry, true)}</table>
        ${
          entry.note
            ? `<div style="font-size:12px;line-height:18px;color:${C.brandDeep};margin-top:10px;padding-top:10px;border-top:1px solid ${C.line};" class="dm-divider">💡 ${escapeHtml(entry.note)}</div>`
            : ""
        }
      </td>
    </tr>
  </table>`;
}

function sentenceCard(entry: Entry) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.irisTint};border:1px solid ${C.irisLine};border-radius:16px;margin:0 0 10px 0;" class="dm-card">
    <tr>
      <td style="padding:15px 18px 14px 18px;">
        <div style="font-size:16px;line-height:24px;font-weight:650;color:${C.ink};letter-spacing:-0.01em;" class="dm-text">“${escapeHtml(entry.text)}”</div>
        ${
          entry.meaning
            ? `<div style="font-size:12px;line-height:19px;color:${C.muted};margin-top:4px;" class="dm-muted">${escapeHtml(entry.meaning)}</div>`
            : ""
        }
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">${translationRows(entry, false)}</table>
      </td>
    </tr>
  </table>`;
}

function compactRow(entry: Entry) {
  const targets = Object.entries(entry.langs)
    .slice(0, 3)
    .map(([lang, value]) => {
      const meta = langMeta(lang);
      const text = `${meta.flag} ${escapeHtml(value)}`;
      return meta.dir === "rtl" ? `<span dir="rtl">${text}</span>` : text;
    })
    .join("&nbsp;&nbsp;·&nbsp;&nbsp;");

  return `
  <tr>
    <td style="padding:10px 16px;border-bottom:1px solid ${C.line};" class="dm-divider">
      <div style="font-size:15px;line-height:21px;font-weight:600;color:${C.ink};" class="dm-text">${escapeHtml(entry.text)}${
        entry.difficulty ? `<span style="font-weight:400;font-size:11px;color:${C.muted};"> · ${escapeHtml(entry.difficulty)}</span>` : ""
      }</div>
      <div style="font-size:13px;line-height:19px;color:${C.inkSoft};margin-top:3px;" class="dm-text-soft">${targets}</div>
    </td>
  </tr>`;
}

function statTile(value: string, label: string, accent: string) {
  return `
  <td width="33%" align="center" valign="top" class="stack" style="padding:0 5px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.card};border:1px solid ${C.line};border-radius:14px;" class="dm-card">
      <tr>
        <td align="center" style="padding:14px 6px 13px 6px;">
          <div style="font-size:26px;line-height:30px;font-weight:800;color:${accent};letter-spacing:-0.02em;">${escapeHtml(value)}</div>
          <div style="font-size:10px;line-height:15px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${C.muted};margin-top:4px;" class="dm-muted">${escapeHtml(label)}</div>
        </td>
      </tr>
    </table>
  </td>`;
}

function languageStrip(counts: Map<string, number>) {
  if (counts.size < 2) return "";

  const items = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, count]) => {
      const meta = langMeta(lang);
      return `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 10px;background-color:${C.card};border:1px solid ${C.line};border-radius:999px;font-size:12px;line-height:16px;color:${C.inkSoft};" class="dm-card dm-text-soft">${meta.flag}&nbsp;${escapeHtml(meta.name)}&nbsp;<b style="color:${C.ink};" class="dm-text">${count}</b></span>`;
    })
    .join("");

  return `<div style="padding:14px 0 0 0;">${items}</div>`;
}

function sectionHeading(title: string, hint: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 12px 0;">
    <tr>
      <td>
        <div style="font-size:16px;line-height:22px;font-weight:750;color:${C.ink};letter-spacing:-0.01em;" class="dm-text">${escapeHtml(title)}</div>
        ${hint ? `<div style="font-size:12px;line-height:18px;color:${C.muted};margin-top:2px;" class="dm-muted">${escapeHtml(hint)}</div>` : ""}
      </td>
    </tr>
  </table>`;
}

function recallBlock(entries: Entry[], of: string) {
  if (entries.length < 3) return "";

  const prompts = entries
    .slice(0, 3)
    .map((entry) => {
      const [lang, value] = Object.entries(entry.langs)[0] || [];
      if (!lang || !value) return "";
      const meta = langMeta(lang);
      return `
      <tr>
        <td style="padding:7px 0;">
          <div dir="${meta.dir}" style="font-size:15px;line-height:21px;color:#ffffff;font-weight:600;">${meta.flag} ${escapeHtml(value)}</div>
          <div style="font-size:12px;line-height:18px;color:#c9c3ee;margin-top:2px;">…what was the original word?</div>
        </td>
      </tr>`;
    })
    .join("");

  if (!prompts.trim()) return "";

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.night};background-image:linear-gradient(135deg,#241a58 0%,#4a3096 100%);border-radius:18px;margin:26px 0 0 0;">
    <tr>
      <td style="padding:22px 22px 24px 22px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${C.brand};">🧠 60-second recall</div>
        <div style="font-size:19px;line-height:26px;font-weight:750;color:#ffffff;margin:7px 0 3px 0;">Can you still remember these?</div>
        <div style="font-size:13px;line-height:19px;color:#c9c3ee;">Three from ${escapeHtml(of)}. Answer them out loud before you scroll.</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 18px 0;">${prompts}</table>
        ${button(LINKS.practice, "Check yourself in Practice →")}
      </td>
    </tr>
  </table>`;
}

function upsellBlock() {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.brandTint};border:1px solid ${C.brandLine};border-radius:16px;margin:26px 0 0 0;" class="dm-spot">
    <tr>
      <td style="padding:16px 18px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.11em;text-transform:uppercase;color:${C.brandDeep};">👑 On Pro</div>
        <div style="font-size:15px;line-height:22px;font-weight:700;color:${C.ink};margin-top:5px;" class="dm-text">Pick your own days and hour</div>
        <div style="font-size:13px;line-height:20px;color:${C.inkSoft};margin-top:4px;" class="dm-text-soft">Free summaries land every 3 days at 18:00 with your words only. Pro lets you choose the days and the time, and adds every sentence you translated.</div>
        <div style="margin-top:12px;"><a href="${LINKS.upgrade}" style="font-size:13px;font-weight:700;color:${C.brandDeep};text-decoration:underline;">See what Pro changes →</a></div>
      </td>
    </tr>
  </table>`;
}

function subjectFor(
  span: ReturnType<typeof spanOf>,
  name: string,
  count: number,
  langCount: number,
  spotlight: Entry | null,
  streak: number,
  seed: number,
) {
  if (count === 1) return `${name}, one new word from ${span.of} ✨`;

  const spot = spotlight ? spotlight.text : "";
  const variants = [
    `${name}, ${plural(count, "new word")} from ${span.of} ✨`,
    spot ? `“${spot}” and ${count - 1} more from ${span.of}` : `${plural(count, "new word")} are waiting for you ✨`,
    streak > 1
      ? `🔥 Day ${streak} of your streak — ${plural(count, "word")} to keep`
      : `${plural(count, "word")} in ${plural(langCount, "language")} 🌍`,
  ];

  return variants[seed % variants.length];
}

function preheaderFor(spotlight: Entry | null, words: Entry[], sentences: Entry[]) {
  const parts: string[] = [];
  if (spotlight) {
    const first = Object.values(spotlight.langs)[0];
    parts.push(first ? `${spotlight.text} → ${first}` : spotlight.text);
  }
  const rest = words.length - (spotlight ? 1 : 0);
  if (rest > 0) parts.push(`${plural(rest, "more word")} inside`);
  if (sentences.length) parts.push(plural(sentences.length, "sentence"));
  return parts.join(" · ") || "Your latest words are ready.";
}

function plainText(
  user: User,
  words: Entry[],
  sentences: Entry[],
  spotlight: Entry | null,
  span: ReturnType<typeof spanOf>,
  nextLine: string,
) {
  const lines = [
    `Hi ${firstName(user)},`,
    "",
    `Here is your LaSu summary — ${plural(words.length + sentences.length, "entry")} from ${span.of}.`,
    "",
  ];

  if (spotlight) {
    lines.push(`${span.pick.toUpperCase()}: ${spotlight.text}`);
    if (spotlight.meaning) lines.push(spotlight.meaning);
    for (const [lang, value] of Object.entries(spotlight.langs)) {
      lines.push(`  ${langMeta(lang).name}: ${value}`);
      const example = spotlight.examples[lang];
      if (example) lines.push(`    "${example}"`);
    }
    lines.push("");
  }

  const list = (title: string, entries: Entry[]) => {
    if (!entries.length) return;
    lines.push(title);
    for (const entry of entries) {
      const targets = Object.entries(entry.langs)
        .map(([lang, value]) => `${langMeta(lang).name}: ${value}`)
        .join(" | ");
      lines.push(`- ${entry.text} — ${targets}`);
    }
    lines.push("");
  };

  list("WORDS", words.filter((entry) => entry !== spotlight));
  list("SENTENCES", sentences);

  lines.push(
    `Practice them: ${LINKS.practice}`,
    `See everything: ${LINKS.history}`,
    "",
    nextLine,
    `Change when these arrive, or turn them off: ${LINKS.settings}`,
  );

  return lines.join("\n");
}

export async function sendSummary(
  user: User,
  userTranslations: Translation[],
  options: SummaryOptions,
) {
  const now = options.now ?? new Date();
  const { schedule, community = {} } = options;
  const span = spanOf(options.since, now);

  const all = buildEntries(userTranslations);
  const words = all.filter((entry) => entry.kind === "word").slice(0, 50);
  const sentences = schedule.includeSentences
    ? all.filter((entry) => entry.kind === "phrase").slice(0, 20)
    : [];

  if (!words.length && !sentences.length) return false;

  const name = firstName(user);
  const seed = seedFrom(`${user.email}-${now.toDateString()}`);
  const total = words.length + sentences.length;

  const counts = new Map<string, number>();
  let topLevel = "";
  for (const entry of [...words, ...sentences]) {
    for (const lang of Object.keys(entry.langs)) counts.set(lang, (counts.get(lang) ?? 0) + 1);
    if (CEFR.indexOf(entry.difficulty) > CEFR.indexOf(topLevel)) topLevel = entry.difficulty;
  }

  const spotlight = pickSpotlight(words.length ? words : sentences, seed);
  const rest = words.filter((entry) => entry !== spotlight);
  const detailed = rest.slice(0, 6);
  const compact = rest.slice(6);
  const streak = community.streak ?? 0;

  const statTiles = [
    statTile(String(words.length), words.length === 1 ? "word" : "words", C.brandDeep),
    statTile(String(counts.size), counts.size === 1 ? "language" : "languages", C.iris),
    streak > 1
      ? statTile(`${streak}🔥`, "day streak", C.brandDeep)
      : statTile(
          sentences.length ? String(sentences.length) : topLevel || "—",
          sentences.length ? "sentences" : topLevel ? "top level" : "keep going",
          C.success,
        ),
  ].join("");

  const headline = `${total === 1 ? "1 new thing" : `${total} new things`} you picked up ${span.when}`;
  const range = `${dateLabel(options.since, schedule.timeZone)} – ${dateLabel(now, schedule.timeZone)}`;
  const nextLine = options.nextAt
    ? `Your next summary: ${whenLabel(options.nextAt, schedule.timeZone)}.`
    : `These arrive every ${plural(cadenceDays(schedule), "day")}.`;

  const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>Your LaSu summary</title>
<style type="text/css">
  body { margin:0 !important; padding:0 !important; width:100% !important; }
  img { border:0; outline:none; text-decoration:none; }
  table { border-collapse:collapse !important; }
  a { color:${C.irisDeep}; }
  @media only screen and (max-width:600px) {
    .wrap { width:100% !important; }
    .pad { padding-left:16px !important; padding-right:16px !important; }
    .stack { display:block !important; width:100% !important; padding:0 0 8px 0 !important; }
    .hero-title { font-size:25px !important; line-height:32px !important; }
  }
  @media (prefers-color-scheme: dark) {
    .dm-page { background-color:#101018 !important; }
    .dm-card { background-color:#1a1a24 !important; border-color:#2c2c3a !important; }
    .dm-soft { background-color:#20202c !important; }
    .dm-spot { background-color:#241d10 !important; border-color:#4a3a18 !important; }
    .dm-text { color:#f4f3f7 !important; }
    .dm-text-soft { color:#cfcdd8 !important; }
    .dm-muted { color:#9a98a6 !important; }
    .dm-divider { border-color:#2c2c3a !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.page};" class="dm-page">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheaderFor(spotlight, words, sentences))}</div>
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;&#8199;&#847;&zwnj;&nbsp;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" class="dm-page" style="background-color:${C.page};">
  <tr>
    <td align="center" style="padding:24px 12px 40px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:600px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

        <tr>
          <td style="padding:0 0 14px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td width="26" bgcolor="${C.night}" style="width:26px;border-radius:8px;">
                      <img src="${APP_URL}/brand/lasu-mark-512.png" width="26" height="26" alt="LaSu" style="display:block;width:26px;height:26px;border:0;border-radius:8px;" />
                    </td>
                    <td style="padding-left:8px;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${C.ink};" class="dm-text">LaSu</td>
                  </tr></table>
                </td>
                <td align="right" style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};" class="dm-muted">${escapeHtml(span.badge)} &nbsp;·&nbsp; ${escapeHtml(range)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background-color:${C.night};background-image:linear-gradient(135deg,#1c154b 0%,#4a2d7a 55%,#b45d1b 100%);border-radius:20px;padding:30px 26px 28px 26px;" class="pad">
            <div style="font-size:13px;line-height:19px;color:${C.brandLine};font-weight:600;">Hi ${escapeHtml(name)} 👋</div>
            <div class="hero-title" style="font-size:30px;line-height:38px;font-weight:800;color:#ffffff;margin:8px 0 10px 0;letter-spacing:-0.02em;">${escapeHtml(headline)}</div>
            <div style="font-size:14px;line-height:21px;color:#e6dcf5;">${
              streak > 1
                ? `That's ${streak} days in a row. Don't let today be the one that breaks it.`
                : "Five minutes with them now is worth an hour of re-learning them later."
            }</div>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 0 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>${statTiles}</tr>
            </table>
            ${languageStrip(counts)}
          </td>
        </tr>

        <tr>
          <td class="pad" style="padding:22px 0 0 0;">
            ${spotlight ? spotlightCard(spotlight, span.pick) : ""}
            ${detailed.length ? sectionHeading("Your words", "Newest first, with the example sentences you asked for.") : ""}
            ${detailed.map(detailCard).join("")}
            ${
              compact.length
                ? `${sectionHeading("Quick list", `${plural(compact.length, "more word")} from ${span.of}.`)}
                   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.card};border:1px solid ${C.line};border-radius:16px;overflow:hidden;" class="dm-card">
                     ${compact.map(compactRow).join("")}
                   </table>`
                : ""
            }
            ${
              sentences.length
                ? `${sectionHeading("Your sentences", `${plural(sentences.length, "phrase")} you translated in full.`)}
                   ${sentences.map(sentenceCard).join("")}`
                : ""
            }
            ${recallBlock(rest, span.of)}
            ${options.isPro ? "" : upsellBlock()}
          </td>
        </tr>

        <tr>
          <td style="padding:26px 0 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" align="center" class="stack" style="padding:0 5px;">${button(LINKS.history, "Open your history")}</td>
                <td width="50%" align="center" class="stack" style="padding:0 5px;">${button(LINKS.stats, "See your progress", "ghost")}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:26px 0 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background-color:${C.irisTint};border:1px solid ${C.irisLine};border-radius:16px;" class="dm-card">
              <tr>
                <td style="padding:16px 18px;">
                  <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${C.irisDeep};">💡 One small habit</div>
                  <div style="font-size:14px;line-height:21px;color:${C.inkSoft};margin-top:6px;" class="dm-text-soft">Say each word out loud once before you close this email. Speaking it moves a word from “I recognise that” to “I can use that” faster than any amount of re-reading.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:26px 8px 0 8px;">
            <div style="font-size:12px;line-height:19px;color:${C.muted};" class="dm-muted">
              ${escapeHtml(nextLine)}<br />
              <a href="${LINKS.settings}" style="color:${C.muted};text-decoration:underline;">Change the schedule</a> &nbsp;·&nbsp;
              <a href="${LINKS.settings}" style="color:${C.muted};text-decoration:underline;">Turn these off</a> &nbsp;·&nbsp;
              <a href="${LINKS.community}" style="color:${C.muted};text-decoration:underline;">Community</a>
            </div>
            <div style="font-size:11px;line-height:17px;color:#9a98a6;margin-top:12px;">LaSu — learn languages as you browse · <a href="${APP_URL}" style="color:#9a98a6;text-decoration:none;">lasu.online</a></div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"LaSu — Learn Languages As You Browse" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: subjectFor(span, name, words.length || total, counts.size, spotlight, streak, seed),
    html: htmlContent,
    text: plainText(user, words, sentences, spotlight, span, nextLine),
    headers: {
      "List-Unsubscribe": `<${LINKS.settings}>`,
    },
  });

  return true;
}
