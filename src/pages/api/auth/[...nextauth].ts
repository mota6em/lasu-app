import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import { User, type ISubscription } from "@/models/user";
import { effectiveTier } from "@/lib/entitlement";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const TIER_TTL_MS = 5 * 60 * 1000;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user, trigger, session }: any) {
      if (account && user) {
        await connectToDB();
        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: "/imgs/icons/penguin.jpg",
            selectedLanguages: ["english", "spanish"],
            translationType: "formal",
          });
          token.id = newUser._id.toString();
          token.name = newUser.name;
          token.picture = newUser.image;
          token.tier = effectiveTier(newUser);
          token.tierAt = Date.now();
        } else {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.tier = effectiveTier(dbUser);
          token.tierAt = Date.now();
        }
      }

      const forceTier = trigger === "update" && session?.tier === true;

      if (token.id && (forceTier || Date.now() - (token.tierAt ?? 0) > TIER_TTL_MS)) {
        try {
          await connectToDB();
          const fresh = await User.findById(token.id)
            .select("tier subscription")
            .lean<{ tier?: "free" | "pro"; subscription?: ISubscription } | null>();
          token.tier = fresh ? effectiveTier(fresh) : "free";
          token.tierAt = Date.now();
        } catch (err) {
          console.error("tier refresh failed, keeping cached tier:", err);
        }
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.tier = token.tier ?? "free";
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
