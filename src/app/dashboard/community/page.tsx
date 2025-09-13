import JoinCommHero from "@/components/JoinCommHero";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import CommHero from "@/components/CommHero";
import TopLearners from "@/components/TopLearners";
import CommunityLiveTranslations from "@/components/CommunityLiveTranslations";
import ExpandableList from "@/components/ExpandableList";
import LangsWordsChart from "@/components/LangsWordsChart";
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
