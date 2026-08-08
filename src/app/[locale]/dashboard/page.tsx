import { getTranslations, setRequestLocale } from "next-intl/server";
import { OverviewCards } from "@/components/pages/home/OverviewCards";
import RecentWords from "@/components/pages/home/RecentWords";
import { Translate } from "@/components/pages/home/Translate";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="space-y-8">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {t.rich("heading", {
            accent: (chunks) => <span className="text-gradient">{chunks}</span>,
          })}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("subheading")}</p>
      </header>

      <Translate />

      <RecentWords />

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">{t("progress")}</h2>
        <OverviewCards />
      </section>
    </div>
  );
}
