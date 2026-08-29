import { getServerSession } from "next-auth/next";
import { connectToDB } from "@/lib/mongodb";
import { UserSettings } from "@/models/userSettings";
import { authOptions } from "./auth/[...nextauth]";
import { locales } from "@/i18n/locales";
import { availableLanguages } from "@/lib/languages";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "login_required" });
  }

  const userId = session.user.id;
  await connectToDB();

  if (req.method === "GET") {
    const found = await UserSettings.findOne({ userId }).lean<{
      settings?: StoredSettings;
      updatedAt?: Date;
    } | null>();

    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({
      settings: found?.settings ?? null,
      updatedAt: found?.updatedAt?.getTime() ?? 0,
    });
  }

  if (req.method === "POST") {
    const patch = buildPatch(req.body?.settings);

    if (!Object.keys(patch).length) {
      return res.status(400).json({ error: "nothing_to_save" });
    }

    const update = Object.fromEntries(
      Object.entries(patch).map(([key, value]) => [`settings.${key}`, value])
    );

    const saved = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean<{ settings?: StoredSettings; updatedAt?: Date } | null>();

    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({
      settings: saved?.settings ?? null,
      updatedAt: saved?.updatedAt?.getTime() ?? Date.now(),
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
