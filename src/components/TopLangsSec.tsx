import { availableLanguages } from "@/lib/languages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
const TopLangsSec = ({ topLangs, isLoading }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 -ml-2.5">🌟 Top Languages</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-muted dark:via-muted/20 dark:to-muted/10"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" /> {/* Language name */}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-2" /> {/* Count */}
                  <Skeleton className="h-4 w-20" /> {/* "translations" */}
                </CardContent>
              </Card>
            ))
          : topLangs.slice(0, 3).map(([lang, count]) => (
              <Card
                key={lang}
                className="bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-muted dark:via-muted/20 dark:to-muted/10"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {availableLanguages.find((l) => l.value === lang)?.label ||
                      lang}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">{count}</p>
                  <p className="text-muted-foreground text-sm">translations</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default TopLangsSec;
