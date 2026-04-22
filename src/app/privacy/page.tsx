import React from "react";

export const metadata = {
  title: "Privacy Policy - LaSu",
  description: "How LaSu handles user data safely and responsibly.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-20 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <div className="max-w-2xl w-full space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: 2026 april 23
          </p>
        </header>

        <section className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            LaSu is built to help you master new languages by providing
            AI-powered translations for the text you encounter while browsing.
            We believe your data is yours, and we keep our privacy practices
            simple and transparent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Data We Process</h2>
          <p>
            LaSu only processes the **specific text you highlight or select** on
            web pages. We do not collect or monitor your browsing history,
            personal identifiers, financial information, or precise location
            data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. How AI Processing Works
          </h2>
          <p className="mb-4">
            To provide high-quality translations, your selected text is sent
            securely to our servers and then to third-party AI providers (such
            as OpenAI).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Anonymity:</strong> We do not send your name or account
              details to AI providers.
            </li>
            <li>
              <strong>Purpose:</strong> Data sent to these providers is used
              solely to generate the translation or explanation you requested.
            </li>
            <li>
              <strong>History:</strong> Translations are saved to your personal
              history so you can review and practice them later.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Local Storage & Preferences
          </h2>
          <p>
            Settings such as your target language, UI preferences, and feature
            toggles are stored locally on your device (using LocalStorage or
            cookies) to ensure a seamless experience across browsing sessions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Security & Data Sharing
          </h2>
          <p>
            We use industry-standard <strong>HTTPS encryption</strong> for all
            data in transit. LaSu does not sell your data to advertisers. We
            only share selected text with our AI sub-processors to fulfill the
            core service of the app.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>
            You have full control over your learning data. You can clear your
            translation history or reset your settings at any time within the
            app interface.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p>
            If you have questions about how we handle your data, feel free to
            reach out:
          </p>
          <div className="mt-4">
            <a
              href="mailto:team.lasu.app@gmail.com"
              className="text-purple-600 dark:text-purple-400 font-medium underline underline-offset-4 hover:text-purple-500 transition-colors"
            >
              team.lasu.app@gmail.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
