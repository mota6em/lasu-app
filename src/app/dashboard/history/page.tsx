"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { availableLanguages } from "@/lib/languages";
import { Copy, Check } from "lucide-react";
import { MdDelete } from "react-icons/md";
import Translation from "@/types/translation";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HistoryCardSkeleton } from "@/components/HistoryCardSkeleton";

export default function HistoryPage() {
  const [history, setHistory] = useState<Translation[]>([]);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (status === "authenticated") {
        const res = await fetch("/api/translation/history");
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } else if (status === "unauthenticated") {
        const local = localStorage.getItem("lasu-history");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      }
      setFetched(true);
    };
    fetchHistory();
  }, [session, status]);
  const isLoading = status === "loading";
  if (isLoading)
    return (
      <>
        <h1 className="text-3xl font-bold mb-1">📚 Translation History</h1>{" "}
        <ScrollArea className="h-screen p-6">
          <div className="space-y-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <HistoryCardSkeleton key={i} />
            ))}
          </div>
        </ScrollArea>
      </>
    );

  if (fetched && history.length === 0)
    return (
      <>
        <h1 className="text-3xl font-bold mb-1">📚 Translation History</h1>{" "}
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
    );

  return (
    <>
      {!session && (
        <Alert
          variant="destructive"
          className="mb-5 bg-red-100 dark:bg-red-300/10"
        >
          <AlertTitle className="flex items-center font-bold text-lg">
            You're not logged in!
          </AlertTitle>
          <AlertDescription>
            To save your translation history and access it anytime, please sign
            in with your Google account.
            <br />
            It only takes a few seconds — and we’ll remember your progress for
            you 😊
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-bold mb-1">📚 Translation History</h1>

      <ScrollArea className="h-screen p-6">
        <div className="grid gap-6">
          {history?.map((item) => (
            <Card
              key={item._id}
              className={cn(
                "border border-slate-400 dark:border-zinc-700 bg-accent dark:bg-zinc-900  border-l-5 rounded-xl w-full  "
              )}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className=" text-blue-950/90 dark:text-white/60 text-sm">
                    {new Date(item.createdAt).toLocaleString().slice(0, -3)}
                  </div>
                  <div className="flex items-center">
                    <Badge>{item.translationType}</Badge>
                    <MdDelete
                      onClick={() => {
                        session
                          ? fetch(
                              `/api/translation/history/${item._id.toString()}`,
                              {
                                method: "DELETE",
                              }
                            )
                          : localStorage.setItem(
                              "lasu-history",
                              JSON.stringify(
                                history.filter((i) => i._id !== item._id)
                              )
                            );
                        setHistory((prev) =>
                          prev.filter((i) => i._id !== item._id)
                        );
                      }}
                      size={23}
                      className="float-right ms-2  cursor-pointer text-red-600 dark:text-red-500  hover:text-red-500 dark:hover:text-red-400 transition duration-300 ease-in-out"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    Source Text:
                  </p>
                  <p className="text-lg font-semibold">{item.sourceText}</p>
                </div>

                <div className="grid gap-3 bg-accent dark:bg-zinc-900">
                  {Object.entries(item.result.translations).map(
                    ([lang, text]) => (
                      <div
                        key={lang}
                        className="rounded-md border p-3 bg-muted/10 dark:bg-zinc-850"
                      >
                        <div className="space-x-1 flex flex-row items-center ">
                          <p className="font-medium text-md">
                            {availableLanguages.filter(
                              (l) => l.value === lang
                            )[0]?.label || lang}
                            :
                          </p>
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
