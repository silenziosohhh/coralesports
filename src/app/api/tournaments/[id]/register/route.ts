import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function uniqueStrings(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const strings = value
    .filter((v) => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
  const unique = Array.from(new Set(strings));
  if (unique.length !== strings.length) return null;
  return unique;
}

function playersPerTeamFromMode(mode: "SOLO" | "DUO" | "TRIO") {
  if (mode === "TRIO") return 3;
  if (mode === "DUO") return 2;
  return 1;
}

function generateTag() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "TT";
  for (let i = 0; i < 3; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function createAutoTeam({
  tx,
  createdById,
  tournamentSlug,
}: {
  tx: Prisma.TransactionClient;
  createdById: string;
  tournamentSlug: string;
}) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const tag = generateTag();
    const name = `Tournament ${tournamentSlug.toUpperCase()} - ${tag}`;
    try {
      return await tx.team.create({
        data: {
          name,
          tag,
          visibility: "PRIVATE",
          createdById,
          description: "Team generato automaticamente per iscrizione torneo.",
        },
        select: { id: true, name: true, tag: true },
      });
    } catch (error: any) {
      if (error?.code === "P2002") continue;
      throw error;
    }
  }
  throw new Error("Impossibile creare un team (collisioni)");
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { minecraftUsername: true, status: true },
    });

    if (!me || me.status !== "ACTIVE") {
      return NextResponse.json({ error: "Utente non valido" }, { status: 400 });
    }

    if (!me.minecraftUsername) {
      return NextResponse.json(
        { error: "Collega prima il nick Minecraft" },
        { status: 400 }
      );
    }

    const tournamentId = params.id;
    const body = await req.json().catch(() => ({}));
    const inviteeIds = uniqueStrings(body?.inviteeIds);
    if (inviteeIds === null) {
      return NextResponse.json(
        { error: "inviteeIds non valido" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        slug: true,
        status: true,
        maxTeams: true,
        teamMode: true,
        registrationStart: true,
        registrationEnd: true,
        startDate: true,
        _count: { select: { teams: true } },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Torneo non trovato" }, { status: 404 });
    }

    if (!["UPCOMING", "REGISTRATION_OPEN"].includes(tournament.status)) {
      return NextResponse.json(
        { error: "Le iscrizioni sono chiuse" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now.getTime() >= tournament.startDate.getTime()) {
      return NextResponse.json({ error: "Le iscrizioni sono chiuse" }, { status: 400 });
    }

    if (tournament.registrationStart && now.getTime() < tournament.registrationStart.getTime()) {
      return NextResponse.json(
        { error: "Le iscrizioni non sono ancora aperte" },
        { status: 400 }
      );
    }

    if (tournament.registrationEnd && now.getTime() > tournament.registrationEnd.getTime()) {
      return NextResponse.json({ error: "Le iscrizioni sono chiuse" }, { status: 400 });
    }

    const requiredPlayers = playersPerTeamFromMode(tournament.teamMode);

    const existingEntry = await prisma.tournamentTeam.findFirst({
      where: {
        tournamentId,
        players: { some: { userId: session.user.id } },
      },
      select: {
        id: true,
        status: true,
        players: { select: { userId: true } },
      },
    });

    const acceptedPlayersCount = existingEntry?.players.length ?? 0;
    const missingPlayers = Math.max(0, requiredPlayers - acceptedPlayersCount);

    if (inviteeIds.includes(session.user.id)) {
      return NextResponse.json(
        { error: "Non puoi invitare te stesso" },
        { status: 400 }
      );
    }

    const maxInvitesNow = Math.max(0, requiredPlayers - 1);
    if (inviteeIds.length > maxInvitesNow) {
      return NextResponse.json(
        { error: "Troppi utenti selezionati" },
        { status: 400 }
      );
    }

    if (existingEntry) {
      if (existingEntry.status === "REGISTERED") {
        return NextResponse.json(
          { error: "Iscrizione già completa" },
          { status: 400 }
        );
      }
      if (existingEntry.status !== "PENDING") {
        return NextResponse.json(
          { error: "Non puoi modificare questa iscrizione" },
          { status: 400 }
        );
      }
      if (missingPlayers === 0) {
        return NextResponse.json(
          { error: "Iscrizione già completa" },
          { status: 400 }
        );
      }
      if (inviteeIds.length !== missingPlayers) {
        return NextResponse.json(
          { error: `Devi selezionare esattamente ${missingPlayers} player` },
          { status: 400 }
        );
      }
    } else {
      if (tournament.maxTeams > 0 && tournament._count.teams >= tournament.maxTeams) {
        return NextResponse.json(
          { error: "Torneo al completo" },
          { status: 400 }
        );
      }
      if (requiredPlayers === 1 && inviteeIds.length !== 0) {
        return NextResponse.json(
          { error: "Questo torneo è SOLO: non devi selezionare altri utenti" },
          { status: 400 }
        );
      }
      if (requiredPlayers > 1 && inviteeIds.length !== requiredPlayers - 1) {
        return NextResponse.json(
          { error: `Devi selezionare esattamente ${requiredPlayers - 1} player` },
          { status: 400 }
        );
      }
    }

    const users = inviteeIds.length
      ? await prisma.user.findMany({
          where: {
            id: { in: inviteeIds },
            status: "ACTIVE",
            minecraftUsername: { not: null },
          },
          select: { id: true },
        })
      : [];

    if (users.length !== inviteeIds.length) {
      return NextResponse.json(
        { error: "Alcuni utenti non sono invitabili (nick Minecraft mancante o utente non valido)" },
        { status: 400 }
      );
    }

    const alreadyRegisteredInvitees = inviteeIds.length
      ? await prisma.tournamentTeamPlayer.findMany({
          where: {
            userId: { in: inviteeIds },
            tournamentTeam: { tournamentId },
          },
          select: { userId: true },
        })
      : [];

    if (alreadyRegisteredInvitees.length > 0) {
      return NextResponse.json(
        { error: "Alcuni utenti sono già iscritti al torneo" },
        { status: 400 }
      );
    }

    const expiresAt = tournament.registrationEnd ?? tournament.startDate;

    const result = await prisma.$transaction(async (tx) => {
      const entryId = existingEntry?.id ?? null;

      let resolvedEntryId = entryId;
      let currentStatus: string = existingEntry?.status ?? "PENDING";

      if (!resolvedEntryId) {
        const team = await createAutoTeam({
          tx,
          createdById: session.user.id,
          tournamentSlug: tournament.slug,
        });

        const initialStatus = requiredPlayers === 1 ? "REGISTERED" : "PENDING";

        const entry = await tx.tournamentTeam.create({
          data: {
            tournamentId,
            teamId: team.id,
            status: initialStatus as any,
            players: {
              create: [{ userId: session.user.id }],
            },
          },
          select: { id: true, status: true },
        });
        resolvedEntryId = entry.id;
        currentStatus = entry.status;
      }

      if (!resolvedEntryId) {
        throw new Error("Missing entry id");
      }

      if (inviteeIds.length === 0) {
        return {
          entryId: resolvedEntryId,
          status: currentStatus,
          invites: [] as Array<{ token: string; invitedUserId: string; status: string }>,
        };
      }

      const existingPending = await tx.tournamentTeamInvite.findMany({
        where: {
          tournamentId,
          status: "PENDING",
          invitedUserId: { in: inviteeIds },
        },
        select: { invitedUserId: true },
      });

      if (existingPending.length > 0) {
        throw new Error("Alcuni utenti hanno già un invito pendente per questo torneo");
      }

      const invites = await Promise.all(
        inviteeIds.map((invitedUserId) =>
          tx.tournamentTeamInvite.create({
            data: {
              tournamentTeamId: resolvedEntryId!,
              tournamentId,
              invitedById: session.user.id,
              invitedUserId,
              expiresAt,
              status: "PENDING",
            },
            select: { token: true, invitedUserId: true, status: true },
          })
        )
      );

      await tx.notification.createMany({
        data: invites.map((i) => ({
          userId: i.invitedUserId,
          type: "TOURNAMENT_INVITATION",
          title: "Invito Torneo",
          message: "Hai ricevuto un invito per iscriverti a un torneo. Apri l’invito per accettare o rifiutare.",
          link: `/tournament-invites/${i.token}`,
        })),
        skipDuplicates: true,
      });

      return {
        entryId: resolvedEntryId,
        status: currentStatus,
        invites,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error registering for tournament:", error);

    const message = (error as any)?.message;
    if (typeof message === "string" && message.includes("invito pendente")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Errore durante l'iscrizione" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const tournamentId = params.id;

    const entry = await prisma.tournamentTeam.findFirst({
      where: {
        tournamentId,
        team: { createdById: session.user.id },
      },
      select: {
        id: true,
        teamId: true,
        tournament: { select: { status: true } },
      },
      orderBy: { registeredAt: "desc" },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Iscrizione non trovata" },
        { status: 404 }
      );
    }

    if (!["UPCOMING", "REGISTRATION_OPEN"].includes(entry.tournament.status)) {
      return NextResponse.json(
        { error: "Non puoi ritirarti da un torneo già iniziato" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.tournamentTeam.delete({ where: { id: entry.id } });

      const teamUsage = await tx.tournamentTeam.count({
        where: { teamId: entry.teamId },
      });

      const teamMembers = await tx.teamMember.count({
        where: { teamId: entry.teamId },
      });

      if (teamUsage === 0 && teamMembers === 0) {
        await tx.team.delete({ where: { id: entry.teamId } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unregistering from tournament:", error);
    return NextResponse.json(
      { error: "Errore durante il ritiro" },
      { status: 500 }
    );
  }
}
