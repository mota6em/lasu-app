import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import UpgradeClient from "@/components/pages/billing/UpgradeClient";

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="shimmer h-96 rounded-2xl" />}>
      <UpgradeClient />
    </Suspense>
  );
}
