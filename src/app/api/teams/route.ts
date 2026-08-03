import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_CONTENT_ENABLED, getDemoTeams, toDemoTeamApi } from "@/lib/demo-content";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                discordTag: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            tournamentTeams: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teams, { headers: { "X-Coral-Data-Source": "api" } });
  } catch (error) {
    if (DEMO_CONTENT_ENABLED) {
      console.warn("Team API unavailable; using demo teams.", error);
      const teams = getDemoTeams().map((team) => {
        const demo = toDemoTeamApi(team);
        const creator = team.members.find((member) => member.user.id === team.createdById)?.user;
        return {
          ...demo,
          createdBy: creator
            ? { id: creator.id, name: creator.name, image: creator.image }
            : null,
          _count: {
            members: team.members.length,
            tournamentTeams: demo._count.tournamentTeams,
          },
        };
      });
      return NextResponse.json(teams, { headers: { "X-Coral-Data-Source": "demo" } });
    }

    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dei team" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await req.json();
    const { name, tag, logo, description, visibility } = body;

    if (!name || !tag) {
      return NextResponse.json(
        { error: "Nome e tag sono obbligatori" },
        { status: 400 }
      );
    }

    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [{ name }, { tag }],
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Nome o tag già in uso" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        tag,
        logo,
        description,
        visibility: visibility || "PUBLIC",
        createdById: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "CAPTAIN",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                discordTag: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: session.user.role === "USER" ? "TEAM_CAPTAIN" : session.user.role,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TEAM_CREATED",
        entityType: "Team",
        entityId: team.id,
        changes: {
          name,
          tag,
        },
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del team" },
      { status: 500 }
    );
  }
}
