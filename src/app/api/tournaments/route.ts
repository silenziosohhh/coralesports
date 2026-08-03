import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TournamentFormat, TournamentStatus } from "@prisma/client";
import { playersPerTeamFromMode, validateTournamentDates } from "@/lib/tournament-rules";
import {
  DEMO_CONTENT_ENABLED,
  getDemoTournaments,
  toDemoTournamentApi,
} from "@/lib/demo-content";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (status && !Object.values(TournamentStatus).includes(status as TournamentStatus)) {
      return NextResponse.json({ error: "Stato torneo non valido" }, { status: 400 });
    }

    const where = status ? { status: status as TournamentStatus } : {};

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            teams: true,
            matches: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(tournaments, { headers: { "X-Coral-Data-Source": "api" } });
  } catch (error) {
    if (DEMO_CONTENT_ENABLED) {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      console.warn("Tournament API unavailable; using demo tournaments.", error);

      const tournaments = getDemoTournaments()
        .filter((tournament) => !status || tournament.status === status)
        .map((tournament) => {
          const demo = toDemoTournamentApi(tournament);
          return {
            ...demo,
            createdBy: null,
            _count: { teams: demo._count.teams, matches: 0 },
          };
        });

      return NextResponse.json(tournaments, {
        headers: { "X-Coral-Data-Source": "demo" },
      });
    }

    console.error("Error fetching tournaments:", error);
    return NextResponse.json({ error: "Errore nel recupero dei tornei" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non hai i permessi per creare tornei" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      rules,
      banner,
      format,
      teamMode,
      minTeams,
      prizePool,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      checkInStart,
      checkInEnd,
    } = body;

    if (
      typeof name !== "string" ||
      typeof format !== "string" ||
      typeof teamMode !== "string" ||
      typeof startDate !== "string" ||
      typeof endDate !== "string" ||
      typeof banner !== "string" ||
      typeof description !== "string" ||
      typeof rules !== "string" ||
      !name.trim() ||
      !banner.trim() ||
      !description.trim() ||
      !rules.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Banner, titolo, descrizione, ruleset, formato, modalità team, inizio e fine torneo sono obbligatori",
        },
        { status: 400 }
      );
    }

    const resolvedTeamMode =
      teamMode === "TRIO" || teamMode === "DUO" || teamMode === "SOLO" ? teamMode : null;

    const resolvedFormat = Object.values(TournamentFormat).includes(format as TournamentFormat)
      ? (format as TournamentFormat)
      : null;

    if (!resolvedTeamMode) {
      return NextResponse.json(
        { error: "Modalità team non valida (SOLO/DUO/TRIO)" },
        { status: 400 }
      );
    }

    if (!resolvedFormat) {
      return NextResponse.json({ error: "Formato torneo non valido" }, { status: 400 });
    }

    const resolvedPlayersPerTeam = playersPerTeamFromMode(resolvedTeamMode);

    const parsedRegistrationStart = registrationStart ? new Date(registrationStart) : null;
    const parsedRegistrationEnd = registrationEnd ? new Date(registrationEnd) : null;
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const dateValidation = validateTournamentDates({
      registrationStart: parsedRegistrationStart,
      registrationEnd: parsedRegistrationEnd,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });
    if (!dateValidation.ok) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 });
    }

    let slug = generateSlug(name);
    let slugExists = await prisma.tournament.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await prisma.tournament.findUnique({ where: { slug } });
      counter++;
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        slug,
        description,
        rules,
        banner,
        format: resolvedFormat,
        teamMode: resolvedTeamMode,
        playersPerTeam: resolvedPlayersPerTeam,
        status: "DRAFT",
        maxTeams: 0,
        minTeams: minTeams ? parseInt(minTeams) : 2,
        prizePool,
        registrationStart: parsedRegistrationStart,
        registrationEnd: parsedRegistrationEnd,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        checkInStart: checkInStart ? new Date(checkInStart) : null,
        checkInEnd: checkInEnd ? new Date(checkInEnd) : null,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TOURNAMENT_CREATED",
        entityType: "Tournament",
        entityId: tournament.id,
        changes: {
          name,
          format,
          teamMode: resolvedTeamMode,
          maxTeams: 0,
        },
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json({ error: "Errore nella creazione del torneo" }, { status: 500 });
  }
}
