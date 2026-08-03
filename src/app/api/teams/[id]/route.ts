import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_CONTENT_ENABLED, getDemoTeam, toDemoTeamApi } from "@/lib/demo-content";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                minecraftUsername: true,
                discordTag: true,
                elo: true,
              },
            },
          },
        },
        _count: {
          select: {
            tournamentTeams: true,
          },
        },
      },
    });

    if (team) return NextResponse.json(team, { headers: { "X-Coral-Data-Source": "api" } });

    const demoTeam = DEMO_CONTENT_ENABLED ? getDemoTeam(params.id) : null;
    if (demoTeam) {
      return NextResponse.json(toDemoTeamApi(demoTeam), {
        headers: { "X-Coral-Data-Source": "demo" },
      });
    }

    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  } catch (error) {
    const demoTeam = DEMO_CONTENT_ENABLED ? getDemoTeam(params.id) : null;
    if (demoTeam) {
      console.warn("Team API unavailable; using demo data.", error);
      return NextResponse.json(toDemoTeamApi(demoTeam), {
        headers: { "X-Coral-Data-Source": "demo" },
      });
    }

    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId: params.id,
        userId: session.user.id,
        role: "CAPTAIN",
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, tag, description, logo } = body;

    const team = await prisma.team.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(tag && { tag }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                elo: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId: params.id,
        userId: session.user.id,
        role: "CAPTAIN",
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.team.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
