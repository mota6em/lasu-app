export const metadata = {
  title: "Privacy Policy - LaSu",
  description: "How LaSu handles user data safely and responsibly.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

        <p>
          <strong>Last updated:</strong> November 2025
        </p>

        <p>
          LaSu helps users learn languages by providing AI-powered translations
          for selected text while browsing. We value your privacy and keep
          things simple.
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">
            1. Data We Process
          </h2>
          <p>
            LaSu only processes text you select on web pages to generate
            translations. We do not collect personal, financial, or location
            data.
          </p>
        </section>

        <section>
          <section>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              2. How Data Is Used
            </h2>
            <p>
              Selected text is sent securely to LaSu&apos;s servers (and AI
              providers like OpenAI) to produce translations. Stored
              translations are only for your personal history and review.
              Nothing is sold or shared.
            </p>
          </section>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">
            3. Local Preferences
          </h2>
          <p>
            Language and feature settings may be saved locally on your device to
            improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">4. Security</h2>
          <p>
            All communication uses HTTPS. No personal data is sold, shared, or
            transferred.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">
            5. Children's Privacy
          </h2>
          <p>
            LaSu is intended for general audiences and not for children under
            13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">6. Contact</h2>
          <p>
            For any questions, email us at{" "}
            <a
              href="mailto:team.lasu.app@gmail.com"
              className="text-purple-600 dark:text-purple-400 underline"
            >
              team.lasu.app@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
