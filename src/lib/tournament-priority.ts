export function pickMainTournament<T extends { status: string; startDate: string }>(
  tournaments: T[],
): T | null {
  if (!tournaments.length) return null;

  const rank = (status: string) =>
    status === "LIVE" ? 0 : status === "REGISTRATION_OPEN" ? 1 : status === "UPCOMING" ? 2 : 3;

  return [...tournaments].sort((a, b) => {
    const byRank = rank(a.status) - rank(b.status);
    if (byRank !== 0) return byRank;
    const aTime = new Date(a.startDate).getTime();
    const bTime = new Date(b.startDate).getTime();
    return rank(a.status) <= 2 ? aTime - bTime : bTime - aTime;
  })[0];
}
