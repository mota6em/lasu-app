import { OverviewCards } from "@/components/pages/home/OverviewCards";
import RecentWords from "@/components/pages/home/RecentWords";
import { Translate } from "@/components/pages/home/Translate";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          What are we <span className="text-gradient">learning</span> today?
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Drop in a word for the full breakdown, or a whole sentence for a natural
          translation.
        </p>
      </header>

      <Translate />

      <RecentWords />

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Your progress</h2>
        <OverviewCards />
      </section>
    </div>
  );
}
