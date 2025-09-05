import JoinCommHero from "@/components/JoinCommHero";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <JoinCommHero />;

  await connectToDB();
  const member = await CommunityUser.findOne({ userId: session.user.id });

  if (!member) {
    return <JoinCommHero />;
  }
  return <div>Community</div>;
}
