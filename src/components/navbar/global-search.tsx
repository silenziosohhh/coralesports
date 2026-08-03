"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, Trophy, Users, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type SearchResults = {
  tournaments: { id: string; name: string; status: string; banner: string | null }[];
  teams: { id: string; name: string; tag: string; logo: string | null }[];
  users: { id: string; name: string | null; image: string | null; elo: number }[];
};

const emptyResults: SearchResults = { tournaments: [], teams: [], users: [] };

const glassSurface =
  "border border-[rgba(255,255,255,0.12)] bg-[rgba(10,20,38,0.62)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-150";

export function GlobalSearch() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(emptyResults);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json();
        })
        .then((data) => {
          if (!data.error) setResults(data);
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          console.error("Error searching:", error);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleNavigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const hasQuery = query.trim().length >= 2;
  const hasResults =
    results.tournaments.length > 0 || results.teams.length > 0 || results.users.length > 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="focus-visible:ring-[var(--color-accent)]/40 relative rounded-full bg-white/0 transition-colors hover:bg-white/5 focus-visible:ring-2"
        aria-label={t("search.aria")}
      >
        <Search className="h-5 w-5" />
      </Button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(2,6,16,0.72)] backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <DialogPrimitive.Content className="fixed left-1/2 top-[88px] z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
            <DialogPrimitive.Title className="sr-only">{t("search.aria")}</DialogPrimitive.Title>

            <div className={`flex items-center gap-3 rounded-xl px-5 ${glassSurface}`}>
              <Search className="h-4 w-4 shrink-0 text-[rgba(255,255,255,0.45)]" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("search.placeholder")}
                className="h-14 flex-1 border-0 bg-transparent text-base text-white outline-none placeholder:text-[rgba(255,255,255,0.4)]"
              />
              {loading && (
                <Loader2
                  className="h-4 w-4 shrink-0 animate-spin text-[rgba(255,255,255,0.45)]"
                  aria-hidden
                />
              )}
              <DialogPrimitive.Close
                className="focus-visible:ring-[var(--color-accent)]/40 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[rgba(255,255,255,0.55)] transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-white focus-visible:ring-2"
                aria-label="✕"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {(hasQuery || loading) && (
              <div className={`mt-3 max-h-[60vh] overflow-y-auto rounded-xl p-2 ${glassSurface}`}>
                {hasQuery && !loading && !hasResults && (
                  <p className="px-3 py-6 text-center text-sm text-[rgba(255,255,255,0.45)]">
                    {t("search.noResults")}
                  </p>
                )}

                {results.tournaments.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                      {t("nav.tournaments")}
                    </p>
                    {results.tournaments.map((tournament) => (
                      <button
                        key={tournament.id}
                        onClick={() => handleNavigate(`/tournaments/${tournament.id}`)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                      >
                        <div className="bg-[var(--color-accent)]/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                          <Trophy className="h-4 w-4 text-[var(--color-accent)]" />
                        </div>
                        <span className="truncate">{tournament.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {results.teams.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                      {t("nav.teams")}
                    </p>
                    {results.teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleNavigate(`/teams/${team.id}`)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                      >
                        <div className="bg-[var(--color-secondary)]/15 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                          {team.logo ? (
                            <Image
                              src={team.logo}
                              alt={team.name}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="h-4 w-4 text-[var(--color-secondary)]" />
                          )}
                        </div>
                        <span className="truncate">
                          {team.name}{" "}
                          <span className="text-[rgba(255,255,255,0.45)]">[{team.tag}]</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {results.users.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.45)]">
                      {t("search.players")}
                    </p>
                    {results.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() =>
                          handleNavigate(
                            `/leaderboard?view=players&q=${encodeURIComponent(user.name ?? "")}`
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                      >
                        <div className="bg-[var(--color-primary)]/15 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name ?? ""}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-[var(--color-primary)]" />
                          )}
                        </div>
                        <span className="flex-1 truncate">{user.name}</span>
                        <span className="shrink-0 text-xs text-[rgba(255,255,255,0.45)]">
                          {user.elo} ELO
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
