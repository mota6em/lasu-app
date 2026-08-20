export type PartialTranslation = {
  sourceText: string;
  sourceLanguage: string;
  meaning: string;
  translations: Record<string, string>;
};

function trimDanglingEscape(value: string) {
  const match = value.match(/(\\u[0-9a-fA-F]{0,3}|\\)$/);
  return match ? value.slice(0, -match[0].length) : value;
}

function decode(value: string) {
  try {
    return JSON.parse(`"${trimDanglingEscape(value)}"`) as string;
  } catch {
    return trimDanglingEscape(value);
  }
}

function readString(raw: string, start: number) {
  let i = start + 1;
  let escaped = false;

  for (; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"')
      return { value: decode(raw.slice(start + 1, i)), end: i + 1 };
  }

  return { value: decode(raw.slice(start + 1)), end: -1 };
}

function readField(raw: string, key: string) {
  const at = raw.indexOf(`"${key}"`);
  if (at === -1) return "";

  const colon = raw.indexOf(":", at + key.length + 2);
  if (colon === -1) return "";

  const quote = raw.indexOf('"', colon + 1);
  if (quote === -1) return "";

  return readString(raw, quote).value;
}

function readStringMap(raw: string, key: string) {
  const out: Record<string, string> = {};

  const at = raw.indexOf(`"${key}"`);
  if (at === -1) return out;

  const open = raw.indexOf("{", at + key.length + 2);
  if (open === -1) return out;

  let i = open + 1;

  while (i < raw.length) {
    const keyQuote = raw.indexOf('"', i);
    if (keyQuote === -1) break;

    const brace = raw.indexOf("}", i);
    if (brace !== -1 && brace < keyQuote) break;

    const mapKey = readString(raw, keyQuote);
    if (mapKey.end === -1) break;

    const colon = raw.indexOf(":", mapKey.end);
    if (colon === -1) break;

    const valueQuote = raw.indexOf('"', colon + 1);
    if (valueQuote === -1) break;

    const mapValue = readString(raw, valueQuote);
    if (mapValue.value) out[mapKey.value.toLowerCase()] = mapValue.value;
    if (mapValue.end === -1) break;

    i = mapValue.end;
  }

  return out;
}

export function parsePartialTranslation(raw: string): PartialTranslation {
  const text = raw.replace(/^\s*```(?:json)?/i, "");

  return {
    sourceText: readField(text, "sourceText"),
    sourceLanguage: readField(text, "sourceLanguage"),
    meaning: readField(text, "meaning"),
    translations: readStringMap(text, "translations"),
  };
}
