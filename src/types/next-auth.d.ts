import { UserRole, UserStatus } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
      discordId: string | null;
      discordTag: string | null;
      minecraftUsername: string | null;
      elo: number;
      wins: number;
      losses: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: UserRole;
    status?: UserStatus;
    discordId?: string | null;
    discordTag?: string | null;
    minecraftUsername?: string | null;
    elo?: number;
    wins?: number;
    losses?: number;
  }
}
