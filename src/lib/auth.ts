import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "./prisma";

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
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          discordId: profile.id,
          discordTag: profile.global_name || profile.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            status: true,
            discordId: true,
            discordTag: true,
            minecraftUsername: true,
            elo: true,
            wins: true,
            losses: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.discordId = dbUser.discordId;
          token.discordTag = dbUser.discordTag;
          token.minecraftUsername = dbUser.minecraftUsername;
          token.elo = dbUser.elo;
          token.wins = dbUser.wins;
          token.losses = dbUser.losses;
        }
      }

      if (token?.id && token.minecraftUsername == null) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            minecraftUsername: true,
            status: true,
            role: true,
            discordId: true,
            discordTag: true,
            elo: true,
            wins: true,
            losses: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.discordId = dbUser.discordId;
          token.discordTag = dbUser.discordTag;
          token.minecraftUsername = dbUser.minecraftUsername;
          token.elo = dbUser.elo;
          token.wins = dbUser.wins;
          token.losses = dbUser.losses;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.status = token.status as any;
        session.user.discordId = token.discordId as string;
        session.user.discordTag = token.discordTag as string;
        session.user.minecraftUsername = (token.minecraftUsername as string) ?? null;
        session.user.elo = token.elo as number;
        session.user.wins = token.wins as number;
        session.user.losses = token.losses as number;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { status: true },
        });
        
        if (dbUser?.status === "BANNED") {
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
