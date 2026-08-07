import { langLocale } from "@/lib/languages";

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  if (cachedVoices.length) return Promise.resolve(cachedVoices);

  const voices = speechSynthesis.getVoices();
  if (voices.length) {
    cachedVoices = voices;
    return Promise.resolve(voices);
  }

  // chrome populates the voice list asynchronously on first call
  return new Promise((resolve) => {
    const done = () => {
      cachedVoices = speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
    speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 600);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], locale: string) {
  const lower = locale.toLowerCase();
  const base = lower.split("-")[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === lower) ??
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lower) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ??
    null
  );
}

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export async function speak(text: string, lang: string) {
  if (!speechSupported() || !text) return false;

  speechSynthesis.cancel();
  const locale = langLocale(lang);
  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(voices, locale);

  utterance.lang = locale;
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;

  return new Promise<boolean>((resolve) => {
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (speechSupported()) speechSynthesis.cancel();
}
