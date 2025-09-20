"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { availableLanguages } from "@/lib/languages";
import Translation from "@/types/translation";

interface HistoryCardProps {
  item: Translation;
  onDelete: (id: string) => void;
}

const HistoryCard = ({ item, onDelete }: HistoryCardProps) => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  return (
    <Card
      className={cn(
        "border border-slate-400 py-3 lg:py-4 dark:border-zinc-700 bg-accent dark:bg-zinc-900 border-l-5 rounded-xl w-full"
      )}
    >
      <CardContent className="px-3 py-0 lg:p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-blue-950/90 dark:text-white/60 text-sm">
            {new Date(item.createdAt).toLocaleString().slice(0, -3)}
          </div>
          <div className="flex items-center">
            <Badge>{item.translationType}</Badge>
            <MdDelete
              onClick={() => onDelete(item._id.toString())}
              size={23}
              className="float-right ms-2 cursor-pointer text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-1">Source Text:</p>
          <p className="text-lg font-semibold">{item.sourceText}</p>
        </div>

        <div className="grid gap-3 bg-accent dark:bg-zinc-900">
          {Object.entries(item.result.translations).map(([lang, text]) => (
            <div
              key={lang}
              className="rounded-md border p-3 bg-muted/10 dark:bg-zinc-850"
            >
              <div className="space-x-1 flex flex-row items-center">
                <p className="font-medium text-md">
                  {availableLanguages.find((l) => l.value === lang)?.label ||
                    lang}
                  :
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                    {String(text)}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(text));
                      setCopiedLang(lang);
                      setTimeout(() => setCopiedLang(null), 2000);
                    }}
                    className="text-muted-foreground hover:text-primary transition"
                  >
                    {copiedLang === lang ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              {item.result.example?.[lang] && (
                <p className="text-sm text-muted-foreground mt-2 italic flex flex-row gap-x-2">
                  💡 Example:
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {item.result.example?.[lang]}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          item.result.example?.[lang] || ""
                        );
                        setCopiedLang(lang + "-example");
                        setTimeout(() => setCopiedLang(null), 2000);
                      }}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {copiedLang === lang + "-example" ? (
                        <Check size={13} className="text-green-500" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
