type TournamentTeamMode = "SOLO" | "DUO" | "TRIO";

export function playersPerTeamFromMode(mode: TournamentTeamMode) {
  if (mode === "TRIO") return 3;
  if (mode === "DUO") return 2;
  return 1;
}

export type TournamentDateInputs = {
  registrationStart?: Date | null;
  registrationEnd?: Date | null;
  startDate: Date;
  endDate: Date;
};

export function validateTournamentDates({
  registrationStart,
  registrationEnd,
  startDate,
  endDate,
}: TournamentDateInputs): { ok: true } | { ok: false; error: string } {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    return { ok: false, error: "Data inizio torneo non valida" };
  }
  if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
    return { ok: false, error: "Data fine torneo non valida" };
  }
  if (startDate.getTime() >= endDate.getTime()) {
    return { ok: false, error: "L'inizio del torneo deve essere prima della fine" };
  }

  const hasRegStart = !!registrationStart;
  const hasRegEnd = !!registrationEnd;
  if (hasRegStart !== hasRegEnd) {
    return { ok: false, error: "Inserisci sia inizio che fine iscrizioni (oppure nessuno dei due)" };
  }

  if (registrationStart && Number.isNaN(registrationStart.getTime())) {
    return { ok: false, error: "Inizio iscrizioni non valido" };
  }
  if (registrationEnd && Number.isNaN(registrationEnd.getTime())) {
    return { ok: false, error: "Fine iscrizioni non valida" };
  }

  if (registrationStart && registrationEnd) {
    if (registrationStart.getTime() >= registrationEnd.getTime()) {
      return { ok: false, error: "L'inizio iscrizioni deve essere prima della fine iscrizioni" };
    }
    if (registrationEnd.getTime() > startDate.getTime()) {
      return { ok: false, error: "La fine iscrizioni deve essere prima dell'inizio del torneo" };
    }
  }

  return { ok: true };
}

