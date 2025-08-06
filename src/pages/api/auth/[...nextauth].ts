import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account?: any;
      user?: any;
    }) {
      if (account && user) {
        await connectToDB();
        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            selectedLanguages: ["english", "spanish"],
            translationType: "formal",
          });
          token.id = newUser._id.toString();
        } else {
          token.id = dbUser._id.toString();
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
