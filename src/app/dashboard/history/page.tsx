"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { availableLanguages } from "@/lib/languages";
import { Copy, Check } from "lucide-react";
import { MdDelete } from "react-icons/md";

interface Translation {
  _id: string;
  sourceText: string;
  translationType: string;
  createdAt: string;
  result: {
    translations: Record<string, string>;
    example?: Record<string, string>;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Translation[]>([]);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/translation/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-1">📚 Translation History</h1>
      {history.length === 0 && (
        <>
          <p className="text-muted-foreground text-sm my-5 ms-5">
            No translation history found, start a translation to see it here.
          </p>
          <button
            className="btn btn-primary ms-5"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Start a translation
          </button>
        </>
      )}
      <ScrollArea className="h-screen p-6">
        <div className="grid gap-6">
          {history.map((item) => (
            <Card
              key={item._id}
              className={cn(
                "border border-slate-400  border-l-5 rounded-xl w-full  "
              )}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className=" text-blue-950/90 text-sm">
                    {new Date(item.createdAt).toLocaleString().slice(0, -3)}
                  </div>
                  <div className="flex items-center">
                    <Badge>{item.translationType}</Badge>
                    <MdDelete
                      onClick={() => {
                        fetch(
                          `/api/translation/history/${item._id.toString()}`,
                          {
                            method: "DELETE",
                          }
                        ).then(() => {
                          setHistory((prev) =>
                            prev.filter((i) => i._id !== item._id)
                          );
                        });
                      }}
                      size={23}
                      className="float-right ms-2  cursor-pointer text-red-600 hover:text-red-500 transition duration-300 ease-in-out"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    Source Text:
                  </p>
                  <p className="text-lg font-semibold">{item.sourceText}</p>
                </div>

                <div className="grid gap-3">
                  {Object.entries(item.result.translations).map(
                    ([lang, text]) => (
                      <div
                        key={lang}
                        className="rounded-md border p-3 bg-muted/10"
                      >
                        <div className="space-x-1 flex flex-row items-center ">
                          <p className="font-medium text-md">
                            {availableLanguages.filter(
                              (l) => l.value === lang
                            )[0]?.label || lang}
                            :
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-700 dark:text-blue-400 font-semibold">
                              {text}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(text);
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
                            💡 Example:{" "}
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground ">
                                {item.result.example[lang]}
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    item.result.example[lang]
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
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
