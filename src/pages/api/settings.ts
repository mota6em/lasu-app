import { getServerSession } from "next-auth/next";
import { connectToDB } from "@/lib/mongodb";
import { UserSettings } from "@/models/userSettings";
import { User } from "@/models/user";
import { authOptions } from "./auth/[...nextauth]";
import { locales } from "@/i18n/locales";
import { availableLanguages } from "@/lib/languages";
import { effectiveTier } from "@/lib/entitlement";
import { isTimeZone, normalizeSchedule, type DigestPrefs } from "@/lib/summarySchedule";
import { NextApiRequest, NextApiResponse } from "next";

const TONES = ["formal", "casual", "slang", "academic", "funny"];
const MAX_LANGS = 4;

type StoredSettings = {
  selectedLanguages: { value: string; label: string }[];
  translationType: string;
  uiLocale: string;
};

function sanitizeLanguages(input: unknown) {
  if (!Array.isArray(input)) return null;

  const seen = new Set<string>();
  const out: { value: string; label: string }[] = [];

  for (const entry of input) {
    const value =
      typeof entry === "string"
        ? entry
        : typeof (entry as { value?: unknown })?.value === "string"
          ? ((entry as { value: string }).value)
          : "";

    const clean = value.toLowerCase().trim();
    if (!clean || seen.has(clean)) continue;

    const meta = availableLanguages.find((l) => l.value === clean);
    if (!meta) continue;

    seen.add(clean);
    out.push({ value: clean, label: meta.label ?? clean });
    if (out.length === MAX_LANGS) break;
  }

  return out.length ? out : null;
}

function buildPatch(input: unknown) {
  const src = (input ?? {}) as Record<string, unknown>;
  const patch: Partial<StoredSettings> = {};

  const languages = sanitizeLanguages(src.selectedLanguages);
  if (languages) patch.selectedLanguages = languages;

  if (typeof src.translationType === "string" && TONES.includes(src.translationType)) {
    patch.translationType = src.translationType;
  }

  if (typeof src.uiLocale === "string") {
    const code = src.uiLocale.trim();
    if (code === "" || locales.includes(code)) patch.uiLocale = code;
  }

  return patch;
}

type UserDigestDoc = {
  emailSummary?: boolean;
  emailDigest?: unknown;
  tier?: "free" | "pro";
  subscription?: Parameters<typeof effectiveTier>[0]["subscription"];
};

function digestOf(user: UserDigestDoc | null): DigestPrefs & { isPro: boolean } {
  const isPro = effectiveTier(user ?? {}) === "pro";
  return {
    ...normalizeSchedule(user?.emailDigest, isPro),
    enabled: user?.emailSummary !== false,
    isPro,
  };
}

function buildDigestPatch(input: unknown, current: UserDigestDoc | null) {
  const src = (input ?? {}) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  if (typeof src.emailSummary === "boolean") patch.emailSummary = src.emailSummary;

  const digest = src.emailDigest as Record<string, unknown> | undefined;
  if (digest && typeof digest === "object") {
    const stored = (current?.emailDigest ?? {}) as Record<string, unknown>;
    const merged = { ...stored, ...digest };
    const next = normalizeSchedule(merged, effectiveTier(current ?? {}) === "pro");
    patch["emailDigest.hour"] = next.hour;
    patch["emailDigest.days"] = next.days;
    patch["emailDigest.includeSentences"] = next.includeSentences;
    if (isTimeZone(merged.timeZone)) patch["emailDigest.timeZone"] = next.timeZone;
  }

  return patch;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "login_required" });
  }

  const userId = session.user.id;
  await connectToDB();
  res.setHeader("Cache-Control", "private, no-store");

  const readUser = () =>
    User.findById(userId)
      .select("emailSummary emailDigest tier subscription")
      .lean<UserDigestDoc | null>();

  if (req.method === "GET") {
    const [found, user] = await Promise.all([
      UserSettings.findOne({ userId }).lean<{
        settings?: StoredSettings;
        updatedAt?: Date;
      } | null>(),
      readUser(),
    ]);

    return res.status(200).json({
      settings: found?.settings ?? null,
      email: digestOf(user),
      updatedAt: found?.updatedAt?.getTime() ?? 0,
    });
  }

  if (req.method === "POST") {
    const patch = buildPatch(req.body?.settings);
    const current = await readUser();
    const digestPatch = buildDigestPatch(req.body?.settings, current);

    if (!Object.keys(patch).length && !Object.keys(digestPatch).length) {
      return res.status(400).json({ error: "nothing_to_save" });
    }

    const [saved, user] = await Promise.all([
      Object.keys(patch).length
        ? UserSettings.findOneAndUpdate(
            { userId },
            {
              $set: Object.fromEntries(
                Object.entries(patch).map(([key, value]) => [`settings.${key}`, value]),
              ),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          ).lean<{ settings?: StoredSettings; updatedAt?: Date } | null>()
        : UserSettings.findOne({ userId }).lean<{
            settings?: StoredSettings;
            updatedAt?: Date;
          } | null>(),
      Object.keys(digestPatch).length
        ? User.findByIdAndUpdate(userId, { $set: digestPatch }, { new: true })
            .select("emailSummary emailDigest tier subscription")
            .lean<UserDigestDoc | null>()
        : current,
    ]);

    return res.status(200).json({
      settings: saved?.settings ?? null,
      email: digestOf(user),
      updatedAt: saved?.updatedAt?.getTime() ?? Date.now(),
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
