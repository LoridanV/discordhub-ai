import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        // Fetch discord-specific info
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { discordId: true, discriminator: true, image: true },
        });
        if (dbUser) {
          session.user.discordId = dbUser.discordId;
          session.user.discriminator = dbUser.discriminator || "0";
          session.user.image = dbUser.image ?? "";
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as {
          id: string;
          username: string;
          discriminator: string;
          avatar: string;
          email: string;
        };

        await prisma.user.upsert({
          where: { discordId: discordProfile.id },
          update: {
            name: discordProfile.username,
            email: discordProfile.email,
            discriminator: discordProfile.discriminator,
            image: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordProfile.discriminator) % 5}.png`,
          },
          create: {
            discordId: discordProfile.id,
            name: discordProfile.username,
            email: discordProfile.email,
            discriminator: discordProfile.discriminator,
            image: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordProfile.discriminator) % 5}.png`,
          },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
      name: string;
      email: string;
      image: string;
      discriminator: string;
    };
  }
}
