import Link from "next/link";
import "./globals.css";

// catches paths that never resolved to a locale segment, so it cannot rely on
// translations and stays deliberately plain
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <p className="font-display text-6xl font-extrabold text-gradient">404</p>
          <p className="text-sm text-muted-foreground">
            This page could not be found.
          </p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to LaSu
          </Link>
        </main>
      </body>
    </html>
  );
}
