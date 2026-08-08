import { getServerSession } from "next-auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import JoinCommHero from "@/components/pages/community/JoinCommHero";
import CommHero from "@/components/pages/community/CommHero";
import CommSettings from "@/components/pages/community/CommSettings";
import CommTopStats from "@/components/pages/community/CommTopStats";
import CommunityLiveTranslations from "@/components/pages/community/CommunityLiveTranslations";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <JoinCommHero />;

  await connectToDB();
  const member = await CommunityUser.findOne({ userId: session.user.id });
  if (!member) return <JoinCommHero />;

  const t = await getTranslations("community");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <CommSettings />
      </div>

      <CommHero
        userName={session.user.name || t("anonymous")}
        userId={session.user.id}
      />

      <CommTopStats />
      <CommunityLiveTranslations />
    </div>
  );
}
