import JoinCommHero from "@/components/pages/community/JoinCommHero";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import CommHero from "@/components/pages/community/CommHero";
import TopLearners from "@/components/pages/community/TopLearners";
import CommunityLiveTranslations from "@/components/pages/community/CommunityLiveTranslations";
import ExpandableList from "@/components/pages/community/ExpandableList";
import LangsWordsChart from "@/components/pages/community/LangsWordsChart";
export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <JoinCommHero />;

  await connectToDB();
  const member = await CommunityUser.findOne({ userId: session.user.id });

  if (!member) {
    return <JoinCommHero />;
  }
  return (
    <>
      <CommHero
        userName={session.user.name || "Anonymous"}
        userId={session.user.id}
      />
      <TopLearners userId={session.user.id} />
      <CommunityLiveTranslations />
      <LangsWordsChart />
    </>
  );
}
