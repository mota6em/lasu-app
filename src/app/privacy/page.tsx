import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - LaSu",
  description: "How LaSu handles user data safely and responsibly.",
};

const SECTIONS = [
  {
    title: "Data we process",
    body: (
      <p>
        LaSu only processes the specific text you highlight or select on web pages.
        We do not collect or monitor your browsing history, personal identifiers,
        financial information, or precise location data.
      </p>
    ),
  },
  {
    title: "How AI processing works",
    body: (
      <>
        <p>
          To provide high-quality translations, your selected text is sent securely
          to our servers and then to third-party AI providers such as OpenAI.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 ps-5">
          <li>
            <strong className="font-medium text-foreground">Anonymity:</strong> we do
            not send your name or account details to AI providers.
          </li>
          <li>
            <strong className="font-medium text-foreground">Purpose:</strong> that
            data is used only to generate the translation you requested.
          </li>
          <li>
            <strong className="font-medium text-foreground">History:</strong>{" "}
            translations are saved to your personal history so you can review and
            practise them later.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Local storage & preferences",
    body: (
      <p>
        Settings such as your target languages, register and UI preferences are
        stored on your device so the experience carries between sessions. Signed-out
        translations never leave your browser.
      </p>
    ),
  },
  {
    title: "Security & data sharing",
    body: (
      <p>
        All data in transit is protected with HTTPS. LaSu does not sell your data to
        advertisers, and we only share selected text with our AI sub-processors to
        deliver the core service.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You have full control over your learning data. Clear your translation
        history, change your community visibility or reset your preferences at any
        time inside the app.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-background px-6 py-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-72 grid-bg" />

      <div className="relative mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to LaSu
        </Link>

        <header className="mt-8">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Privacy policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated 23 April 2026
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            LaSu helps you learn languages from the text you already read online. Your
            data is yours, and we keep the practices around it short enough to
            actually read.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section, index) => (
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
            <h2 className="font-display text-xl font-semibold">Contact</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Questions about how we handle your data? Write to{" "}
              <a
                href="mailto:team.lasu.online@gmail.com"
                className="font-medium text-brand-600 underline underline-offset-4 dark:text-brand-400"
              >
                team.lasu.online@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
