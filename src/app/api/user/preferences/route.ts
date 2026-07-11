import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        minecraftUsername: true,
        // Add preferences fields if they exist in your schema
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const bio = body?.bio;
    const minecraftUsername = body?.minecraftUsername;

    let resolvedMinecraftUsername: string | null | undefined;
    if (minecraftUsername !== undefined) {
      if (minecraftUsername === null || minecraftUsername === "") {
        resolvedMinecraftUsername = null;
      } else if (typeof minecraftUsername === "string") {
        const trimmed = minecraftUsername.trim();
        const isValid = /^[A-Za-z0-9_]{3,16}$/.test(trimmed);
        if (!isValid) {
          return NextResponse.json(
            { error: "Nick Minecraft non valido (3-16 caratteri, lettere/numeri/_)" },
            { status: 400 }
          );
        }
        resolvedMinecraftUsername = trimmed;
      } else {
        return NextResponse.json(
          { error: "Nick Minecraft non valido" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(resolvedMinecraftUsername !== undefined && {
          minecraftUsername: resolvedMinecraftUsername,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating preferences:", error);

    if ((error as any)?.code === "P2002") {
      return NextResponse.json(
        { error: "Nick Minecraft già in uso" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
