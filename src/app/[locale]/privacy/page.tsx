import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "privacyPage",
  path: "/privacy",
  descriptionKey: "intro",
});

const CONTACT_EMAIL = "team.lasu.online@gmail.com";

// Each section is a title, one lead paragraph, and zero or more bullet points
// made of a bold label and a body. The keys follow the section number so the
// message bundles stay readable next to the page.
const SECTIONS: { id: string; bullets: string[] }[] = [
  { id: "s1", bullets: ["a", "b", "c", "d"] },
  { id: "s2", bullets: ["a", "b", "c"] },
  { id: "s3", bullets: ["a", "b"] },
  { id: "s4", bullets: ["a", "b"] },
  { id: "s5", bullets: [] },
  { id: "s6", bullets: [] },
  { id: "s7", bullets: ["a", "b", "c"] },
  { id: "s8", bullets: [] },
  { id: "s9", bullets: [] },
  { id: "s10", bullets: [] },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPage");

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
          {SECTIONS.map(({ id, bullets }, index) => (
            <section key={id}>
              <h2 className="font-display text-xl font-semibold">
                <span className="me-2 text-muted-foreground">{index + 1}.</span>
                {t(`${id}Title`)}
              </h2>
              <div className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                <p>{t(`${id}Body`)}</p>
                {bullets.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 ps-5">
                    {bullets.map((b) => (
                      <li key={b}>
                        <strong className="font-medium text-foreground">
                          {t(`${id}${b}`)}
                        </strong>{" "}
                        {t(`${id}${b}Body`)}
                      </li>
                    ))}
                  </ul>
                )}
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
                href={`mailto:${CONTACT_EMAIL}`}
                dir="ltr"
                className="font-medium text-brand-600 underline underline-offset-4 dark:text-brand-400"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
