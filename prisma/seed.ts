import {
  MatchStatus,
  PrismaClient,
  TeamMemberRole,
  TeamVisibility,
  TournamentFormat,
  TournamentStatus,
  TournamentTeamMode,
  TournamentTeamStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;

const globalTopPlayers = [
  { rank: 1, name: "r1spe", uuid: "733022857155706913", points: 4250, title: "S Tier (Bedwars)" },
  { rank: 2, name: "parpp", uuid: "696024584369209395", points: 3750, title: "A+ Tier (Nodebuff)" },
  { rank: 3, name: "nordal", uuid: "612624551628767253", points: 3750, title: "A+ Tier (Bedwars)" },
  {
    rank: 4,
    name: "Emisferoh_",
    uuid: "775338732294635520",
    points: 3600,
    title: "A+ Tier (Bedfight)",
  },
  { rank: 5, name: "rehhab", uuid: "420256877411041280", points: 3450, title: "A+ Tier (Boxing)" },
  {
    rank: 6,
    name: "GenoveseG0d",
    uuid: "691338038432890970",
    points: 3450,
    title: "A- Tier (Classic)",
  },
  { rank: 7, name: "P0RC00", uuid: "811308486842646538", points: 3400, title: "B+ Tier (Bedwars)" },
  {
    rank: 8,
    name: "ZypLean",
    uuid: "1079858575360413766",
    points: 3300,
    title: "A+ Tier (Boxing)",
  },
  {
    rank: 9,
    name: "Justnute",
    uuid: "1155836469194276916",
    points: 3150,
    title: "B+ Tier (Bedwars)",
  },
  {
    rank: 10,
    name: "Toccamy",
    uuid: "1297343484151464068",
    points: 3100,
    title: "A- Tier (Classic)",
  },
  {
    rank: 11,
    name: "MrJak3s",
    uuid: "905938551336759328",
    points: 2600,
    title: "B+ Tier (Boxing)",
  },
  {
    rank: 12,
    name: "Venuxis",
    uuid: "1160332697609187348",
    points: 2225,
    title: "B- Tier (Bedwars)",
  },
  {
    rank: 13,
    name: "oShxke",
    uuid: "586540767216926741",
    points: 2200,
    title: "B+ Tier (Bedwars)",
  },
  {
    rank: 14,
    name: "DevilTaras",
    uuid: "1487016856245239858",
    points: 2100,
    title: "C+ Tier (Battlerush)",
  },
  {
    rank: 15,
    name: "christxpher",
    uuid: "272830425183944704",
    points: 2100,
    title: "S Tier (Nodebuff)",
  },
  {
    rank: 16,
    name: "savthings",
    uuid: "1268203280295788564",
    points: 2050,
    title: "B+ Tier (Nodebuff)",
  },
  {
    rank: 17,
    name: "Arvoss",
    uuid: "657505019628617730",
    points: 2050,
    title: "A+ Tier (Classic)",
  },
  {
    rank: 18,
    name: "kvnyewest",
    uuid: "909140906895097866",
    points: 2000,
    title: "A+ Tier (Battlerush)",
  },
  {
    rank: 19,
    name: "FuchingTrapper",
    uuid: "1436796596435288064",
    points: 1850,
    title: "B+ Tier (Bedwars)",
  },
  {
    rank: 20,
    name: "Lorenz223",
    uuid: "622825740920160259",
    points: 1800,
    title: "A- Tier (Bedfight)",
  },
] as const;

const teamDefinitions = [
  {
    id: "demo-team-tidal",
    name: "Tidal Titans",
    tag: "TIDE",
    description: "Aggressivi, coordinati e sempre pronti a dominare il bracket.",
    elo: 1450,
    wins: 18,
    losses: 5,
    playerIndexes: [0, 1, 2, 18],
  },
  {
    id: "demo-team-abyss",
    name: "Abyss Reapers",
    tag: "ABYS",
    description: "Strategie profonde e clutch impossibili nei momenti decisivi.",
    elo: 1395,
    wins: 16,
    losses: 7,
    playerIndexes: [3, 4, 5, 19],
  },
  {
    id: "demo-team-coral",
    name: "Coral Guardians",
    tag: "CRL",
    description: "Il roster di casa: controllo, difesa e grande esperienza.",
    elo: 1340,
    wins: 14,
    losses: 9,
    playerIndexes: [6, 7, 8],
  },
  {
    id: "demo-team-neon",
    name: "Neon Krakens",
    tag: "NKR",
    description: "Giocate rapide, stile spettacolare e pressione costante.",
    elo: 1315,
    wins: 13,
    losses: 10,
    playerIndexes: [9, 10, 11],
  },
  {
    id: "demo-team-phoenix",
    name: "Blue Phoenix",
    tag: "BPH",
    description: "Un team emergente con tanto talento e voglia di sorprendere.",
    elo: 1240,
    wins: 10,
    losses: 12,
    playerIndexes: [12, 13, 14],
  },
  {
    id: "demo-team-reef",
    name: "Reef Raiders",
    tag: "REEF",
    description: "Gli outsider del torneo, imprevedibili fino all'ultimo round.",
    elo: 1185,
    wins: 8,
    losses: 14,
    playerIndexes: [15, 16, 17],
  },
] as const;

async function seedUsers() {
  for (let index = 0; index < globalTopPlayers.length; index += 1) {
    const player = globalTopPlayers[index];
    const wins = 42 - index;
    const losses = 4 + Math.floor(index / 2);
    const id = `demo-user-${String(index + 1).padStart(2, "0")}`;

    await prisma.user.upsert({
      where: { id },
      update: {
        name: player.name,
        discordId: player.uuid,
        minecraftUsername: player.name,
        discordTag: player.name,
        image: `https://mc-heads.net/avatar/${player.name}/128`,
        role: index % 3 === 0 ? UserRole.TEAM_CAPTAIN : UserRole.USER,
        status: UserStatus.ACTIVE,
        elo: player.points,
        wins,
        losses,
        bio: `Top globale #${player.rank} · ${player.title}`,
      },
      create: {
        id,
        name: player.name,
        email: `demo.player.${index + 1}@coralmc.local`,
        discordId: player.uuid,
        discordTag: player.name,
        minecraftUsername: player.name,
        image: `https://mc-heads.net/avatar/${player.name}/128`,
        role: index % 3 === 0 ? UserRole.TEAM_CAPTAIN : UserRole.USER,
        status: UserStatus.ACTIVE,
        elo: player.points,
        wins,
        losses,
        bio: `Top globale #${player.rank} · ${player.title}`,
        createdAt: new Date(Date.now() - (90 - index) * DAY),
      },
    });
  }
}

async function seedTeams() {
  for (const [teamIndex, definition] of teamDefinitions.entries()) {
    const captainId = `demo-user-${String(definition.playerIndexes[0] + 1).padStart(2, "0")}`;

    await prisma.team.upsert({
      where: { id: definition.id },
      update: {
        name: definition.name,
        tag: definition.tag,
        description: definition.description,
        logo: `https://mc-heads.net/avatar/${globalTopPlayers[definition.playerIndexes[0]].name}/128`,
        visibility: TeamVisibility.PUBLIC,
        elo: definition.elo,
        wins: definition.wins,
        losses: definition.losses,
        createdById: captainId,
      },
      create: {
        id: definition.id,
        name: definition.name,
        tag: definition.tag,
        description: definition.description,
        logo: `https://mc-heads.net/avatar/${globalTopPlayers[definition.playerIndexes[0]].name}/128`,
        visibility: TeamVisibility.PUBLIC,
        elo: definition.elo,
        wins: definition.wins,
        losses: definition.losses,
        createdById: captainId,
        createdAt: new Date(Date.now() - (60 - teamIndex * 3) * DAY),
      },
    });

    await prisma.teamMember.deleteMany({ where: { teamId: definition.id } });

    await prisma.teamMember.createMany({
      data: definition.playerIndexes.map((playerIndex, memberIndex) => ({
        id: `demo-member-${teamIndex + 1}-${memberIndex + 1}`,
        teamId: definition.id,
        userId: `demo-user-${String(playerIndex + 1).padStart(2, "0")}`,
        role: memberIndex === 0 ? TeamMemberRole.CAPTAIN : TeamMemberRole.MEMBER,
        joinedAt: new Date(Date.now() - (45 - memberIndex * 2) * DAY),
      })),
    });
  }
}

async function createTournamentEntry(
  tournamentId: string,
  teamIndex: number,
  status: TournamentTeamStatus,
  seed: number,
  playersPerTeam: number
) {
  const team = teamDefinitions[teamIndex];
  const tournamentTeamId = `demo-entry-${tournamentId.replace("demo-tournament-", "")}-${teamIndex + 1}`;

  return prisma.tournamentTeam.create({
    data: {
      id: tournamentTeamId,
      tournamentId,
      teamId: team.id,
      status,
      seed,
      checkedInAt: status === TournamentTeamStatus.CHECKED_IN ? new Date() : null,
      registeredAt: new Date(Date.now() - (12 - teamIndex) * DAY),
      players: {
        create: team.playerIndexes.slice(0, playersPerTeam).map((playerIndex, playerPosition) => ({
          id: `demo-ttp-${tournamentId.replace("demo-tournament-", "")}-${teamIndex + 1}-${playerPosition + 1}`,
          userId: `demo-user-${String(playerIndex + 1).padStart(2, "0")}`,
        })),
      },
    },
  });
}

async function seedTournaments() {
  const tournamentIds = [
    "demo-tournament-masters",
    "demo-tournament-rookie",
    "demo-tournament-finals",
  ];

  await prisma.tournament.deleteMany({ where: { id: { in: tournamentIds } } });

  const adminId = "demo-user-01";
  const now = Date.now();

  await prisma.tournament.create({
    data: {
      id: tournamentIds[0],
      name: "Coral Masters Live",
      slug: "coral-masters-live-demo",
      description:
        "Il torneo principale della stagione: sei team, bracket serrato e finali in diretta.",
      rules:
        "Best of 3. Vietato l'uso di client non autorizzati. Rispetto e fair play obbligatori.",
      banner:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
      format: TournamentFormat.DOUBLE_ELIMINATION,
      teamMode: TournamentTeamMode.TRIO,
      playersPerTeam: 4,
      status: TournamentStatus.LIVE,
      maxTeams: 8,
      minTeams: 4,
      prizePool: "€1.500 + Rank esclusivo",
      registrationStart: new Date(now - 20 * DAY),
      registrationEnd: new Date(now - 2 * DAY),
      startDate: new Date(now + 14 * DAY),
      endDate: new Date(now + 17 * DAY),
      checkInStart: new Date(now - DAY),
      checkInEnd: new Date(now + DAY),
      createdById: adminId,
      createdAt: new Date(now - 30 * DAY),
    },
  });

  await prisma.tournament.create({
    data: {
      id: tournamentIds[1],
      name: "Rookie Rush Cup",
      slug: "rookie-rush-cup-demo",
      description:
        "Una coppa dedicata ai nuovi roster: formato rapido, tanta azione e premi community.",
      rules: "Best of 1 fino alle semifinali. Best of 3 per la finale.",
      banner:
        "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1600&q=85",
      format: TournamentFormat.SINGLE_ELIMINATION,
      teamMode: TournamentTeamMode.DUO,
      playersPerTeam: 2,
      status: TournamentStatus.UPCOMING,
      maxTeams: 16,
      minTeams: 4,
      prizePool: "€500 + Cosmetic Pack",
      registrationStart: new Date(now - 3 * DAY),
      registrationEnd: new Date(now + 3 * DAY),
      startDate: new Date(now + 7 * DAY),
      endDate: new Date(now + 8 * DAY),
      createdById: adminId,
      createdAt: new Date(now - 8 * DAY),
    },
  });

  await prisma.tournament.create({
    data: {
      id: tournamentIds[2],
      name: "Winter Arena Finals",
      slug: "winter-arena-finals-demo",
      description:
        "La finale della scorsa stagione, conclusa con una rimonta memorabile dei Tidal Titans.",
      rules: "Round robin con playoff finali. Punteggio: 3 vittoria, 1 pareggio, 0 sconfitta.",
      banner:
        "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1600&q=85",
      format: TournamentFormat.ROUND_ROBIN,
      teamMode: TournamentTeamMode.TRIO,
      playersPerTeam: 3,
      status: TournamentStatus.FINISHED,
      maxTeams: 8,
      minTeams: 4,
      prizePool: "€1.000",
      registrationStart: new Date(now - 52 * DAY),
      registrationEnd: new Date(now - 38 * DAY),
      startDate: new Date(now - 35 * DAY),
      endDate: new Date(now - 32 * DAY),
      createdById: adminId,
      createdAt: new Date(now - 60 * DAY),
    },
  });

  for (let index = 0; index < teamDefinitions.length; index += 1) {
    await createTournamentEntry(
      tournamentIds[0],
      index,
      index === 4 ? TournamentTeamStatus.PENDING : TournamentTeamStatus.REGISTERED,
      index + 1,
      4
    );
  }

  for (let index = 0; index < 4; index += 1) {
    await createTournamentEntry(
      tournamentIds[1],
      index,
      TournamentTeamStatus.REGISTERED,
      index + 1,
      2
    );
  }

  for (let index = 0; index < teamDefinitions.length; index += 1) {
    await createTournamentEntry(
      tournamentIds[2],
      index,
      TournamentTeamStatus.REGISTERED,
      index + 1,
      3
    );
  }

  const liveRoundOne = await prisma.round.create({
    data: {
      id: "demo-round-masters-1",
      tournamentId: tournamentIds[0],
      roundNumber: 1,
      name: "Fase a gironi",
      startDate: new Date(now - DAY),
    },
  });

  const liveRoundTwo = await prisma.round.create({
    data: {
      id: "demo-round-masters-2",
      tournamentId: tournamentIds[0],
      roundNumber: 2,
      name: "Playoff",
      startDate: new Date(now),
    },
  });

  const liveMatches = [
    [0, 5, 3, 0, 0, liveRoundOne.id],
    [1, 2, 2, 1, 1, liveRoundOne.id],
    [3, 5, 2, 2, -1, liveRoundOne.id],
    [0, 2, 1, 1, -1, liveRoundOne.id],
    [1, 3, 0, 2, 3, liveRoundOne.id],
    [2, 5, 3, 1, 2, liveRoundTwo.id],
    [0, 1, 2, 0, 0, liveRoundTwo.id],
    [3, 2, 2, 1, 3, liveRoundTwo.id],
  ] as const;

  for (const [index, match] of liveMatches.entries()) {
    const [team1Index, team2Index, team1Score, team2Score, winnerIndex, roundId] = match;
    await prisma.match.create({
      data: {
        id: `demo-match-masters-${index + 1}`,
        tournamentId: tournamentIds[0],
        roundId,
        team1Id: teamDefinitions[team1Index].id,
        team2Id: teamDefinitions[team2Index].id,
        team1Score,
        team2Score,
        winnerId: winnerIndex >= 0 ? (teamDefinitions.at(winnerIndex)?.id ?? null) : null,
        status: MatchStatus.COMPLETED,
        startedAt: new Date(now - (9 - index) * 60 * 60 * 1000),
        completedAt: new Date(now - (8 - index) * 60 * 60 * 1000),
        bracketPosition: index + 1,
      },
    });
  }

  await prisma.match.create({
    data: {
      id: "demo-match-masters-next",
      tournamentId: tournamentIds[0],
      roundId: liveRoundTwo.id,
      team1Id: teamDefinitions[0].id,
      team2Id: teamDefinitions[3].id,
      status: MatchStatus.SCHEDULED,
      scheduledAt: new Date(now + 3 * 60 * 60 * 1000),
      bracketPosition: 9,
    },
  });

  const finishedRound = await prisma.round.create({
    data: {
      id: "demo-round-finals-1",
      tournamentId: tournamentIds[2],
      roundNumber: 1,
      name: "Finale",
      startDate: new Date(now - 33 * DAY),
      endDate: new Date(now - 32 * DAY),
    },
  });

  await prisma.match.create({
    data: {
      id: "demo-match-finals-1",
      tournamentId: tournamentIds[2],
      roundId: finishedRound.id,
      team1Id: teamDefinitions[0].id,
      team2Id: teamDefinitions[1].id,
      team1Score: 3,
      team2Score: 2,
      winnerId: teamDefinitions[0].id,
      status: MatchStatus.COMPLETED,
      startedAt: new Date(now - 33 * DAY),
      completedAt: new Date(now - 33 * DAY + 90 * 60 * 1000),
      bracketPosition: 1,
    },
  });
}

async function main() {
  await seedUsers();
  await seedTeams();
  await seedTournaments();

  const [users, teams, tournaments, tournamentEntries, matches] = await Promise.all([
    prisma.user.count({ where: { id: { startsWith: "demo-user-" } } }),
    prisma.team.count({ where: { id: { startsWith: "demo-team-" } } }),
    prisma.tournament.count({ where: { id: { startsWith: "demo-tournament-" } } }),
    prisma.tournamentTeam.count({ where: { id: { startsWith: "demo-entry-" } } }),
    prisma.match.count({ where: { id: { startsWith: "demo-match-" } } }),
  ]);

  console.log({ users, teams, tournaments, tournamentEntries, matches });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
