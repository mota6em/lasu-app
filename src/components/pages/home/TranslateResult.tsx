"use client";
import { TranslateHook } from "@/types/translation";
import { Copy, Check } from "lucide-react";

type Props = Pick<
  TranslateHook,
  "result" | "resultLoading" | "copiedLang" | "setCopiedLang"
>;

export default function TranslateResult({
  result,
  resultLoading,
  copiedLang,
  setCopiedLang,
}: Props) {
  const hasResult = Object.keys(result?.translations || {}).length > 0;

  if (!resultLoading && !hasResult) return null;

  return (
    <div className="flex flex-col w-full lg:w-1/2">
      <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded shadow-sm border">
        <p className="font-semibold mb-2">Translation Result</p>

        {resultLoading &&
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full mt-2"></div>
          ))}

        {!resultLoading &&
          Object.entries(result?.translations || {}).map(
            ([lang, text]: any) => (
              <div
                key={lang}
                className="mb-2 p-3 border rounded bg-white dark:bg-zinc-800"
              >
                <div className="flex gap-2 items-center">
                  <p className="font-semibold capitalize">{lang}:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                      {text}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        setCopiedLang(lang);
                        setTimeout(() => setCopiedLang(null), 2000);
                      }}
                      className="hover:text-primary transition"
                    >
                      {copiedLang === lang ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {result?.example?.[lang] && (
                  <div className="text-sm text-muted-foreground mt-1 flex gap-2">
                    Example:
                    <div className="flex items-center gap-2">
                      <p>{result.example[lang]}</p>
                      <button
                        onClick={() => {
                          const exampleText = result.example?.[lang];
                          if (!exampleText) return;
                          navigator.clipboard.writeText(exampleText);
                          setCopiedLang(lang + "-example");
                          setTimeout(() => setCopiedLang(null), 2000);
                        }}
                        className="hover:text-primary transition"
                      >
                        {copiedLang === lang + "-example" ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
      </div>
    </div>
  );
}
