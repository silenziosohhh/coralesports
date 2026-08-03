import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { playersPerTeamFromMode, validateTournamentDates } from "@/lib/tournament-rules";
import {
  DEMO_CONTENT_ENABLED,
  getDemoTournament,
  toDemoTournamentApi,
} from "@/lib/demo-content";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        teams: {
          where: { status: "REGISTERED" },
          include: {
            team: {
              select: {
                id: true,
                name: true,
                tag: true,
                logo: true,
              },
            },
          },
        },
        _count: {
          select: {
            teams: true,
          },
        },
      },
    });

    if (tournament) {
      return NextResponse.json(tournament, { headers: { "X-Coral-Data-Source": "api" } });
    }

    const demoTournament = DEMO_CONTENT_ENABLED ? getDemoTournament(params.id) : null;
    if (demoTournament) {
      return NextResponse.json(toDemoTournamentApi(demoTournament), {
        headers: { "X-Coral-Data-Source": "demo" },
      });
    }

    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  } catch (error) {
    const demoTournament = DEMO_CONTENT_ENABLED ? getDemoTournament(params.id) : null;
    if (demoTournament) {
      console.warn("Tournament API unavailable; using demo data.", error);
      return NextResponse.json(toDemoTournamentApi(demoTournament), {
        headers: { "X-Coral-Data-Source": "demo" },
      });
    }

    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
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

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: { createdById: true },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isCreator = tournament.createdById === session.user.id;
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      format,
      teamMode,
      prizePool,
      banner,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      status,
      rules,
    } = body;

    if (typeof banner === "string" && !banner.trim()) {
      return NextResponse.json({ error: "Banner obbligatorio" }, { status: 400 });
    }
    if (typeof description === "string" && !description.trim()) {
      return NextResponse.json({ error: "Descrizione obbligatoria" }, { status: 400 });
    }
    if (typeof rules === "string" && !rules.trim()) {
      return NextResponse.json({ error: "Ruleset obbligatorio" }, { status: 400 });
    }

    let resolvedTeamMode: "SOLO" | "DUO" | "TRIO" | undefined;
    let resolvedPlayersPerTeam: number | undefined;
    if (teamMode !== undefined) {
      if (teamMode !== "SOLO" && teamMode !== "DUO" && teamMode !== "TRIO") {
        return NextResponse.json(
          { error: "Modalità team non valida (SOLO/DUO/TRIO)" },
          { status: 400 }
        );
      }
      resolvedTeamMode = teamMode;
      resolvedPlayersPerTeam = playersPerTeamFromMode(teamMode);
    }

    const existing = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: {
        startDate: true,
        endDate: true,
        registrationStart: true,
        registrationEnd: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const nextStartDate = startDate ? new Date(startDate) : existing.startDate;
    const nextEndDate =
      endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate;

    if (!nextEndDate) {
      return NextResponse.json({ error: "La data fine torneo è obbligatoria" }, { status: 400 });
    }

    const nextRegistrationStart =
      registrationStart !== undefined
        ? registrationStart
          ? new Date(registrationStart)
          : null
        : existing.registrationStart;
    const nextRegistrationEnd =
      registrationEnd !== undefined
        ? registrationEnd
          ? new Date(registrationEnd)
          : null
        : existing.registrationEnd;

    const dateValidation = validateTournamentDates({
      registrationStart: nextRegistrationStart,
      registrationEnd: nextRegistrationEnd,
      startDate: nextStartDate,
      endDate: nextEndDate,
    });
    if (!dateValidation.ok) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 });
    }

    const updatedTournament = await prisma.$transaction(async (tx) => {
      const nextStatus = typeof status === "string" ? status : undefined;

      const updated = await tx.tournament.update({
        where: { id: params.id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(banner !== undefined && { banner }),
          ...(format && { format }),
          ...(resolvedTeamMode !== undefined && { teamMode: resolvedTeamMode }),
          ...(resolvedPlayersPerTeam !== undefined && { playersPerTeam: resolvedPlayersPerTeam }),
          ...(prizePool !== undefined && { prizePool }),
          ...(registrationStart !== undefined && {
            registrationStart: registrationStart ? new Date(registrationStart) : null,
          }),
          ...(registrationEnd !== undefined && {
            registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
          }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate !== undefined && {
            endDate: endDate ? new Date(endDate) : null,
          }),
          ...(nextStatus && { status: nextStatus }),
          ...(rules !== undefined && { rules }),
        },
        include: {
          teams: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                  tag: true,
                  logo: true,
                },
              },
            },
          },
        },
      });

      if (nextStatus === "LIVE") {
        await tx.tournamentTeamInvite.updateMany({
          where: {
            tournamentId: params.id,
            status: "PENDING",
          },
          data: {
            status: "EXPIRED",
          },
        });

        await tx.tournamentTeam.deleteMany({
          where: {
            tournamentId: params.id,
            status: "PENDING",
          },
        });
      }

      return updated;
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error("Error updating tournament:", error);
    return NextResponse.json(
      { error: "Failed to update tournament" },
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

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: { createdById: true },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isCreator = tournament.createdById === session.user.id;
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.tournament.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return NextResponse.json(
      { error: "Failed to delete tournament" },
      { status: 500 }
    );
  }
}
