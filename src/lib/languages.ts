export interface LanguageMeta {
  value: string;
  label: string;
  name: string;
  native: string;
  flag: string;
  locale: string;
  rtl?: boolean;
}

const LANGS: Omit<LanguageMeta, "label">[] = [
  { value: "afrikaans", name: "Afrikaans", native: "Afrikaans", flag: "🇿🇦", locale: "af-ZA" },
  { value: "albanian", name: "Albanian", native: "Shqip", flag: "🇦🇱", locale: "sq-AL" },
  { value: "amharic", name: "Amharic", native: "አማርኛ", flag: "🇪🇹", locale: "am-ET" },
  { value: "arabic", name: "Arabic", native: "العربية", flag: "🇸🇦", locale: "ar-SA", rtl: true },
  { value: "armenian", name: "Armenian", native: "Հայերեն", flag: "🇦🇲", locale: "hy-AM" },
  { value: "azerbaijani", name: "Azerbaijani", native: "Azərbaycanca", flag: "🇦🇿", locale: "az-AZ" },
  { value: "bengali", name: "Bengali", native: "বাংলা", flag: "🇧🇩", locale: "bn-BD" },
  { value: "bosnian", name: "Bosnian", native: "Bosanski", flag: "🇧🇦", locale: "bs-BA" },
  { value: "bulgarian", name: "Bulgarian", native: "Български", flag: "🇧🇬", locale: "bg-BG" },
  { value: "catalan", name: "Catalan", native: "Català", flag: "🇪🇸", locale: "ca-ES" },
  { value: "chinese", name: "Chinese", native: "中文", flag: "🇨🇳", locale: "zh-CN" },
  { value: "croatian", name: "Croatian", native: "Hrvatski", flag: "🇭🇷", locale: "hr-HR" },
  { value: "czech", name: "Czech", native: "Čeština", flag: "🇨🇿", locale: "cs-CZ" },
  { value: "danish", name: "Danish", native: "Dansk", flag: "🇩🇰", locale: "da-DK" },
  { value: "dutch", name: "Dutch", native: "Nederlands", flag: "🇳🇱", locale: "nl-NL" },
  { value: "english", name: "English", native: "English", flag: "🇺🇸", locale: "en-US" },
  { value: "estonian", name: "Estonian", native: "Eesti", flag: "🇪🇪", locale: "et-EE" },
  { value: "finnish", name: "Finnish", native: "Suomi", flag: "🇫🇮", locale: "fi-FI" },
  { value: "french", name: "French", native: "Français", flag: "🇫🇷", locale: "fr-FR" },
  { value: "georgian", name: "Georgian", native: "ქართული", flag: "🇬🇪", locale: "ka-GE" },
  { value: "german", name: "German", native: "Deutsch", flag: "🇩🇪", locale: "de-DE" },
  { value: "greek", name: "Greek", native: "Ελληνικά", flag: "🇬🇷", locale: "el-GR" },
  { value: "gujarati", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", locale: "gu-IN" },
  { value: "haitian_creole", name: "Haitian Creole", native: "Kreyòl", flag: "🇭🇹", locale: "ht-HT" },
  { value: "hebrew", name: "Hebrew", native: "עברית", flag: "🇮🇱", locale: "he-IL", rtl: true },
  { value: "hindi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳", locale: "hi-IN" },
  { value: "hungarian", name: "Hungarian", native: "Magyar", flag: "🇭🇺", locale: "hu-HU" },
  { value: "icelandic", name: "Icelandic", native: "Íslenska", flag: "🇮🇸", locale: "is-IS" },
  { value: "indonesian", name: "Indonesian", native: "Indonesia", flag: "🇮🇩", locale: "id-ID" },
  { value: "italian", name: "Italian", native: "Italiano", flag: "🇮🇹", locale: "it-IT" },
  { value: "japanese", name: "Japanese", native: "日本語", flag: "🇯🇵", locale: "ja-JP" },
  { value: "kannada", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", locale: "kn-IN" },
  { value: "kazakh", name: "Kazakh", native: "Қазақша", flag: "🇰🇿", locale: "kk-KZ" },
  { value: "khmer", name: "Khmer", native: "ខ្មែរ", flag: "🇰🇭", locale: "km-KH" },
  { value: "korean", name: "Korean", native: "한국어", flag: "🇰🇷", locale: "ko-KR" },
  { value: "kurdish", name: "Kurdish", native: "Kurdî", flag: "🇮🇶", locale: "ku", rtl: true },
  { value: "lao", name: "Lao", native: "ລາວ", flag: "🇱🇦", locale: "lo-LA" },
  { value: "latvian", name: "Latvian", native: "Latviešu", flag: "🇱🇻", locale: "lv-LV" },
  { value: "lithuanian", name: "Lithuanian", native: "Lietuvių", flag: "🇱🇹", locale: "lt-LT" },
  { value: "macedonian", name: "Macedonian", native: "Македонски", flag: "🇲🇰", locale: "mk-MK" },
  { value: "malay", name: "Malay", native: "Melayu", flag: "🇲🇾", locale: "ms-MY" },
  { value: "malayalam", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳", locale: "ml-IN" },
  { value: "marathi", name: "Marathi", native: "मराठी", flag: "🇮🇳", locale: "mr-IN" },
  { value: "mongolian", name: "Mongolian", native: "Монгол", flag: "🇲🇳", locale: "mn-MN" },
  { value: "nepali", name: "Nepali", native: "नेपाली", flag: "🇳🇵", locale: "ne-NP" },
  { value: "norwegian", name: "Norwegian", native: "Norsk", flag: "🇳🇴", locale: "nb-NO" },
  { value: "pashto", name: "Pashto", native: "پښتو", flag: "🇦🇫", locale: "ps-AF", rtl: true },
  { value: "persian", name: "Persian", native: "فارسی", flag: "🇮🇷", locale: "fa-IR", rtl: true },
  { value: "polish", name: "Polish", native: "Polski", flag: "🇵🇱", locale: "pl-PL" },
  { value: "portuguese", name: "Portuguese", native: "Português", flag: "🇵🇹", locale: "pt-PT" },
  { value: "punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", locale: "pa-IN" },
  { value: "romanian", name: "Romanian", native: "Română", flag: "🇷🇴", locale: "ro-RO" },
  { value: "russian", name: "Russian", native: "Русский", flag: "🇷🇺", locale: "ru-RU" },
  { value: "serbian", name: "Serbian", native: "Српски", flag: "🇷🇸", locale: "sr-RS" },
  { value: "slovak", name: "Slovak", native: "Slovenčina", flag: "🇸🇰", locale: "sk-SK" },
  { value: "slovenian", name: "Slovenian", native: "Slovenščina", flag: "🇸🇮", locale: "sl-SI" },
  { value: "somali", name: "Somali", native: "Soomaali", flag: "🇸🇴", locale: "so-SO" },
  { value: "spanish", name: "Spanish", native: "Español", flag: "🇪🇸", locale: "es-ES" },
  { value: "swahili", name: "Swahili", native: "Kiswahili", flag: "🇰🇪", locale: "sw-KE" },
  { value: "swedish", name: "Swedish", native: "Svenska", flag: "🇸🇪", locale: "sv-SE" },
  { value: "tamil", name: "Tamil", native: "தமிழ்", flag: "🇮🇳", locale: "ta-IN" },
  { value: "telugu", name: "Telugu", native: "తెలుగు", flag: "🇮🇳", locale: "te-IN" },
  { value: "thai", name: "Thai", native: "ไทย", flag: "🇹🇭", locale: "th-TH" },
  { value: "turkish", name: "Turkish", native: "Türkçe", flag: "🇹🇷", locale: "tr-TR" },
  { value: "ukrainian", name: "Ukrainian", native: "Українська", flag: "🇺🇦", locale: "uk-UA" },
  { value: "urdu", name: "Urdu", native: "اردو", flag: "🇵🇰", locale: "ur-PK", rtl: true },
  { value: "uzbek", name: "Uzbek", native: "Oʻzbekcha", flag: "🇺🇿", locale: "uz-UZ" },
  { value: "vietnamese", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳", locale: "vi-VN" },
  { value: "welsh", name: "Welsh", native: "Cymraeg", flag: "🏴", locale: "cy-GB" },
  { value: "xhosa", name: "Xhosa", native: "isiXhosa", flag: "🇿🇦", locale: "xh-ZA" },
  { value: "yoruba", name: "Yoruba", native: "Yorùbá", flag: "🇳🇬", locale: "yo-NG" },
  { value: "zulu", name: "Zulu", native: "isiZulu", flag: "🇿🇦", locale: "zu-ZA" },
];

export const availableLanguages: LanguageMeta[] = LANGS.map((l) => ({
  ...l,
  label: `${l.name} ${l.flag}`,
}));

const byValue = new Map(availableLanguages.map((l) => [l.value, l]));

export function getLanguage(value?: string): LanguageMeta | undefined {
  if (!value) return undefined;
  return byValue.get(value.toLowerCase());
}

export function langName(value: string) {
  return getLanguage(value)?.name ?? value.charAt(0).toUpperCase() + value.slice(1);
}

export function langFlag(value: string) {
  return getLanguage(value)?.flag ?? "🌐";
}

export function langLocale(value: string) {
  return getLanguage(value)?.locale ?? "en-US";
}

export function isRTL(value: string) {
  return getLanguage(value)?.rtl ?? false;
}

export const popularLanguages = [
  "english",
  "spanish",
  "french",
  "german",
  "arabic",
  "japanese",
  "chinese",
  "portuguese",
  "italian",
  "turkish",
  "korean",
  "russian",
];
