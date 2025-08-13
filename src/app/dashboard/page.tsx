import { OverviewCards } from "@/components/OverviewCards";
import { Translate } from "@/components/Translate";

export default function DashboardPage() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900">
      <h2 className="text-4xl font-bold mb-6">Dashboard</h2>
      <div className="flex flex-col gap-y-6 lg:gap-y-3">
        <Translate />
        <OverviewCards />
      </div>
    </div>
  );
}
