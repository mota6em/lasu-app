import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { buildAlternates } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPage");

  const sections = [
    { title: t("dataTitle"), body: <p>{t("dataBody")}</p> },
    {
      title: t("aiTitle"),
      body: (
        <>
          <p>{t("aiBody")}</p>
          <ul className="mt-3 list-disc space-y-1.5 ps-5">
            <li>
              <strong className="font-medium text-foreground">
                {t("aiAnonymity")}
              </strong>{" "}
              {t("aiAnonymityBody")}
            </li>
            <li>
              <strong className="font-medium text-foreground">
                {t("aiPurpose")}
              </strong>{" "}
              {t("aiPurposeBody")}
            </li>
            <li>
              <strong className="font-medium text-foreground">
                {t("aiHistory")}
              </strong>{" "}
              {t("aiHistoryBody")}
            </li>
          </ul>
        </>
      ),
    },
    { title: t("storageTitle"), body: <p>{t("storageBody")}</p> },
    { title: t("securityTitle"), body: <p>{t("securityBody")}</p> },
    { title: t("rightsTitle"), body: <p>{t("rightsBody")}</p> },
  ];

  return (
    <main className="relative min-h-screen bg-background px-6 py-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-72 grid-bg" />

      <div className="relative mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" /> {t("back")}
        </Link>

        <header className="mt-8">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("updated")}</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold">
                <span className="me-2 text-muted-foreground">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </section>
          ))}

          <section className="border-t border-border pt-8">
            <h2 className="font-display text-xl font-semibold">
              {t("contactTitle")}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {t("contactBody")}{" "}
              <a
                href="mailto:team.lasu.online@gmail.com"
                dir="ltr"
                className="font-medium text-brand-600 underline underline-offset-4 dark:text-brand-400"
              >
                team.lasu.online@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
