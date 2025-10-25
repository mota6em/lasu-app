import JoinCommHero from "@/components/pages/community/JoinCommHero";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import CommHero from "@/components/pages/community/CommHero";
import CommunityLiveTranslations from "@/components/pages/community/CommunityLiveTranslations";
import CommTopStats from "@/components/pages/community/CommTopStats";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import CommSettings from "@/components/pages/community/CommSettings";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <JoinCommHero />;

  await connectToDB();
  const member = await CommunityUser.findOne({ userId: session.user.id });

  if (!member) {
    return <JoinCommHero />;
  }
  return (
    <div>
      <CommSettings />
      <CommHero
        userName={session.user.name || "Anonymous"}
        userId={session.user.id}
      />
      <CommTopStats userId={session.user.id} />
      <CommunityLiveTranslations />
      <ScrollToTop />
    </div>
  );
}
