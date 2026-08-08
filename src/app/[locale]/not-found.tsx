import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div aria-hidden className="absolute inset-0 grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-400/25 blur-3xl animate-aurora"
      />

      <div className="relative">
        <p className="font-display text-[6rem] font-extrabold leading-none tracking-tighter text-gradient md:text-[9rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
          Lost in translation
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          This page does not exist in any of our 74 languages. Let&apos;s get you back
          to something useful.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.97]"
          >
            Back to translating
          </Link>
          <Link
            href="/dashboard/history"
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Open my history
          </Link>
        </div>
      </div>
    </main>
  );
}
