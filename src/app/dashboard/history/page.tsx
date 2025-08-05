"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { availableLanguages } from "@/lib/languages";

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

  useEffect(() => {
    fetch("/api/translation/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-1">📚 Translation History</h1>
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
                  <Badge>{item.translationType}</Badge>
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
                          <p>{text}</p>
                        </div>

                        {item.result.example?.[lang] && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            💡 Example: {item.result.example[lang]}
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
