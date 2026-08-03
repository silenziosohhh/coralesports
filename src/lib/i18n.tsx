"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "it" | "en" | "fr" | "de";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

const STORAGE_KEY = "coralmc-locale";

export const INTL_LOCALE: Record<Locale, string> = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
};

type Dict = Record<string, string>;

const it = {
  "nav.home": "Home",
  "nav.tournaments": "Tornei",
  "nav.teams": "Teams",
  "nav.leaderboard": "Classifica",
  "nav.store": "Store",
  "nav.signIn": "Accedi",
  "search.aria": "Cerca",
  "search.placeholder": "Cerca giocatori, team o tornei...",
  "search.hint": "Digita almeno 2 caratteri per cercare.",
  "search.noResults": "Nessun risultato trovato.",
  "search.players": "Giocatori",
  "hero.title1": "Domina",
  "hero.title2": "l'arena",
  "hero.lead": "Entra nell'arena competitiva più avanzata di Minecraft.",
  "hero.highlight1": "Crea team",
  "hero.highlight2": "domina i tornei",
  "hero.highlight3": "scala le classifiche",
  "hero.ctaTournaments": "Esplora Tornei",
  "hero.ctaShop": "Apri Shop",
  "how.tag": "Il processo",
  "how.titlePre": "Come",
  "how.titleAccent": "funziona",
  "how.subtitle":
    "Lo stesso percorso per ogni giocatore: stesso login, stesse regole, dalla registrazione alla vetta della classifica.",
  "how.step1.title": "Crea account",
  "how.step1.desc": "Registrati con Discord in pochi secondi e configura il tuo profilo giocatore.",
  "how.step1.caption": "Discord · pochi secondi",
  "how.step2.title": "Forma il team",
  "how.step2.desc": "Crea o unisciti a un team, invita i tuoi compagni e preparatevi a competere.",
  "how.step2.caption": "Team · invita amici",
  "how.step3.title": "Vinci tornei",
  "how.step3.desc":
    "Iscriviti ai tornei, scala il bracket e conquista il primo posto in classifica.",
  "how.step3.caption": "Tornei · scala la classifica",
  "why.tag": "Piattaforma competitiva",
  "why.titlePre": "Perché scegliere",
  "why.subtitle":
    "Una piattaforma pensata per competere: gestione team, bracket avanzati e un'esperienza fluida dal login alla finale.",
  "feature.brackets.title": "Bracket Avanzati",
  "feature.brackets.desc": "Eliminazione singola, doppia e round robin con generazione automatica",
  "feature.teams.title": "Gestione Team",
  "feature.teams.desc": "Crea team, invita giocatori e gestisci il roster con facilità",
  "feature.prizes.title": "Premi Reali",
  "feature.prizes.desc":
    "Monta premi in palio in ogni torneo: vinci le sfide e conquista ricompense concrete, non solo gloria",
  "stats.players": "Giocatori registrati",
  "stats.tournaments": "Tornei giocati",
  "stats.prizes": "Premi distribuiti",
  "clips.tag": "Community",
  "clips.titlePre": "Clip della",
  "clips.titleAccent": "settimana",
  "clips.subtitle":
    "Le clip migliori della settimana direttamente dal Discord. Passa sopra una clip per ingrandirla, audio al click.",
  "clips.audioOn": "Attiva audio",
  "clips.audioOff": "Disattiva audio",
  "creators.tag": "Creator",
  "creators.role": "Creatore di contenuti",
  "creators.skinAlt": "Skin di {name}",
  "creators.titlePre": "Scelto dai",
  "creators.titleAccent": "migliori",
  "creators.subtitle": "I creator che ci mettono la faccia e portano il progetto davanti a tutti.",
  "creators.watch": "Guarda il canale",
  "server.connecting": "Connessione…",
  "server.online": "Server Online",
  "server.offline": "Server Offline",
  "server.playersOnline": "giocatori online",
  "server.fetching": "Recupero stato…",
  "server.retryLater": "Riprova più tardi",
  "server.copyAria": "Copia l'IP del server",
  "server.copied": "IP copiato negli appunti",
  "server.copyError": "Impossibile copiare l'IP",
  "champion.wins": "vittorie",
  "champion.view": "Vedi classifica →",
  "champion.skinAlt": "Skin di {name}, primo classificato",
  "champion.linkAria": "{name}, primo classificato — vai alla classifica",
  "discord.title": "Unisciti al nostro Discord",
  "discord.desc1":
    "Entra a far parte della nostra community Discord! Chatta con altri giocatori, ricevi aggiornamenti in tempo reale,",
  "discord.desc2": "partecipa agli eventi esclusivi e ottieni supporto rapido dal nostro staff.",
  "discord.button": "Unisciti al Discord",
  "footer.description":
    "CoralMC Esports è l'arena competitiva definitiva di Minecraft. Forma il tuo team, sfida i migliori giocatori nei tornei ufficiali e scala le classifiche ELO fino alla vetta. Bracket avanzati, premi reali e una community che vive per la competizione: qui ogni partita conta e ogni vittoria ti avvicina alla gloria.",
  "footer.community": "Community",
  "footer.joinDiscord": "Entra su Discord",
  "footer.navigation": "Navigazione",
  "footer.store": "Negozio",
  "footer.credits": "Sito realizzato da Sildev & MrJak3s",
  "footer.rights": "© {year} TierList CoralMC. Tutti i diritti riservati.",
  "store.comingEyebrow": "Negozio in aggiornamento",
  "store.comingTitlePre": "Il Negozio",
  "store.comingTitleAccent": "sta per arrivare",
  "store.comingDescription":
    "Stiamo preparando la nuova vetrina CoralMC. Torna presto per scoprire gradi, cosmetici e vantaggi per il server.",
  "auth.signIn.title": "Accedi a CoralMC",
  "auth.signIn.description":
    "Usa il tuo account Discord per entrare nella piattaforma competitiva.",
  "auth.signIn.continue": "Continua con Discord",
  "auth.signIn.synced": "Profilo sincronizzato",
  "auth.signIn.noPassword": "Nessuna nuova password",
  "loading.aria": "Caricamento della piattaforma CoralMC",
  "loading.title": "Prepariamo l’arena",
  "loading.default": "Stiamo sincronizzando la piattaforma e preparando la tua prossima sfida.",
  "loading.tournament": "Stiamo recuperando iscrizioni, formato e regolamento del torneo.",
  "loading.team": "Stiamo preparando roster, statistiche e storico delle partite del team.",
  "loading.invite": "Stiamo verificando l’invito e preparando il tuo accesso al torneo.",
  "loading.connection": "Connessione",
  "loading.sync": "Sincronizzazione",
  "loading.arena": "Arena",
  "error.badge": "Errore 500",
  "error.title": "Qualcosa è andato storto",
  "error.description":
    "Il server ha incontrato un problema imprevisto. Puoi riprovare o tornare alla home.",
  "error.retry": "Riprova",
  "error.home": "Torna alla Home",
  "error.hero": "Server fuori dall'arena",
  "error.support":
    "La partita si è fermata, ma puoi riprovare subito oppure tornare al sicuro nella home.",
  "error.gameTitle": "Coral Dash",
  "error.gameDescription": "Salta i blocchi server corrotti mentre aspetti il rientro nell'arena.",
  "error.gameStart": "Avvia Coral Dash",
  "error.gameRetry": "Gioca ancora",
  "error.gameScore": "Punti",
  "error.gameBest": "Record",
  "error.gameOver": "Connessione interrotta",
  "cookie.title": "Rispettiamo la tua privacy",
  "cookie.description":
    "Usiamo cookie tecnici per far funzionare il sito e, con il tuo consenso, altri per statistiche e marketing. Puoi cambiare idea dal footer.",
  "cookie.acceptAll": "Accetta tutti",
  "cookie.rejectAll": "Rifiuta i non essenziali",
  "cookie.customize": "Personalizza",
  "cookie.hideDetails": "Nascondi dettagli",
  "cookie.saveChoices": "Salva le scelte",
  "cookie.close": "Chiudi",
  "cookie.alwaysOn": "Sempre attivi",
  "cookie.necessary.title": "Necessari",
  "cookie.necessary.desc": "Accesso, lingua e sicurezza.",
  "cookie.analytics.title": "Statistiche",
  "cookie.analytics.desc": "Dati aggregati sull'uso del sito.",
  "cookie.marketing.title": "Marketing",
  "cookie.marketing.desc": "Annunci e contenuti su misura.",
  "cookie.manage": "Gestisci cookie",
  "team.detail.eyebrow": "Scheda team",
  "team.detail.notFoundTitle": "Team",
  "team.detail.notFoundAccent": "non trovato",
  "team.detail.notFoundDescription": "Il team che cerchi non esiste più oppure il link non è corretto.",
  "team.detail.back": "Torna ai team",
  "team.detail.emptyTitle": "Nessun team a questo indirizzo",
  "team.detail.emptyDescription": "Controlla il link oppure sfoglia l’elenco completo dei team registrati.",
  "team.detail.defaultDescription": "Roster, rendimento dei giocatori e storico delle partite di questo team.",
  "team.detail.members": "{count} membri",
  "team.detail.tournaments": "{count} tornei",
  "team.detail.createdOn": "Creato il {date}",
  "team.detail.invite": "Invita",
  "team.detail.disband": "Sciogli team",
  "team.detail.leave": "Esci",
  "team.detail.leaveFull": "Esci dal team",
  "team.detail.memberRemoved": "Membro rimosso",
  "team.detail.remove": "Rimuovi dal team",
  "team.detail.roster": "Roster",
  "team.detail.memberOptions": "Opzioni membro",
  "team.detail.noAction": "Nessuna azione",
  "team.detail.avatarFromLeader": "Stemma dal leader: {name}",
  "team.detail.leader": "Leader",
  "team.detail.captain": "Capitano",
  "team.detail.member": "Membro",
  "team.score.points": "Punti",
  "team.score.matches": "Partite",
  "team.score.average": "Media",
  "team.score.placeholder": "Numeri di esempio: appena l’API delle statistiche sarà collegata questa scheda mostrerà i dati reali del team.",
  "team.score.performance": "Rendimento dei giocatori",
  "team.score.topImpact": "Ha inciso di più",
  "team.score.history": "Storico partite",
  "team.score.winShort": "V",
  "team.score.lossShort": "S",
  "team.score.victory": "Vittoria",
  "team.score.defeat": "Sconfitta",
  "team.score.skinAlt": "Skin di {name}",
  "team.score.statsAria": "Statistiche: Kills {kills}, Final {finalKills}, Letti {beds}, Vittorie {wins}, Punti {points}, K/D {ratio}",
  "team.score.kills": "Kills",
  "team.score.finalKills": "Final",
  "team.score.beds": "Letti",
  "team.score.wins": "Vittorie",
  "team.score.ratio": "K/D",
  "team.score.statistics": "Statistiche",
  "team.score.unavailable": "non disponibile",
  "team.score.inactive": "inattivo",
  "team.score.mvp": "MVP del team",
  "team.score.contribution": "Contributo: {score} punti squadra",
  "team.score.squad.pink": "Rosa",
  "team.score.squad.aqua": "Aqua",
  "team.score.squad.red": "Rossi",
  "team.score.squad.green": "Verdi",
  "team.score.squad.blue": "Blu",
} satisfies Dict;

type TranslationKey = keyof typeof it;

const en: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.tournaments": "Tournaments",
  "nav.teams": "Teams",
  "nav.leaderboard": "Leaderboard",
  "nav.store": "Store",
  "nav.signIn": "Sign In",
  "search.aria": "Search",
  "search.placeholder": "Search for players, teams or tournaments...",
  "search.hint": "Type at least 2 characters to search.",
  "search.noResults": "No results found.",
  "search.players": "Players",
  "hero.title1": "Dominate",
  "hero.title2": "the arena",
  "hero.lead": "Enter the most advanced competitive Minecraft arena.",
  "hero.highlight1": "Create teams",
  "hero.highlight2": "win tournaments",
  "hero.highlight3": "climb the leaderboards",
  "hero.ctaTournaments": "Explore Tournaments",
  "hero.ctaShop": "Open Shop",
  "how.tag": "The process",
  "how.titlePre": "How it",
  "how.titleAccent": "works",
  "how.subtitle":
    "The same path for every player: same login, same rules, from sign-up to the top of the leaderboard.",
  "how.step1.title": "Create account",
  "how.step1.desc": "Sign up with Discord in seconds and set up your player profile.",
  "how.step1.caption": "Discord · a few seconds",
  "how.step2.title": "Build your team",
  "how.step2.desc": "Create or join a team, invite your mates and get ready to compete.",
  "how.step2.caption": "Team · invite friends",
  "how.step3.title": "Win tournaments",
  "how.step3.desc":
    "Enter tournaments, climb the bracket and claim first place on the leaderboard.",
  "how.step3.caption": "Tournaments · climb the ranks",
  "why.tag": "Competitive platform",
  "why.titlePre": "Why choose",
  "why.subtitle":
    "A platform built to compete: team management, advanced brackets and a smooth experience from login to the final.",
  "feature.brackets.title": "Advanced Brackets",
  "feature.brackets.desc":
    "Single elimination, double elimination and round robin with automatic generation",
  "feature.teams.title": "Team Management",
  "feature.teams.desc": "Create teams, invite players and manage your roster with ease",
  "feature.prizes.title": "Real Prizes",
  "feature.prizes.desc":
    "Prize pools on every tournament: win the challenges and earn concrete rewards, not just glory",
  "stats.players": "Registered players",
  "stats.tournaments": "Tournaments played",
  "stats.prizes": "Prizes awarded",
  "clips.tag": "Community",
  "clips.titlePre": "Clips of the",
  "clips.titleAccent": "Week",
  "clips.subtitle":
    "The best clips of the week straight from Discord. Hover a clip to enlarge it, click for audio.",
  "clips.audioOn": "Unmute",
  "clips.audioOff": "Mute",
  "creators.tag": "Creators",
  "creators.role": "Content Creator",
  "creators.skinAlt": "Skin of {name}",
  "creators.titlePre": "Chosen by the",
  "creators.titleAccent": "best",
  "creators.subtitle":
    "The creators who put their face on the line and bring the project to everyone.",
  "creators.watch": "Watch the channel",
  "server.connecting": "Connecting…",
  "server.online": "Server Online",
  "server.offline": "Server Offline",
  "server.playersOnline": "players online",
  "server.fetching": "Fetching status…",
  "server.retryLater": "Try again later",
  "server.copyAria": "Copy the server IP",
  "server.copied": "IP copied to clipboard",
  "server.copyError": "Couldn't copy the IP",
  "champion.wins": "wins",
  "champion.view": "View leaderboard →",
  "champion.skinAlt": "Skin of {name}, first-place player",
  "champion.linkAria": "{name}, first-place player — go to the leaderboard",
  "discord.title": "Join our Discord community",
  "discord.desc1":
    "Join our Discord server now to stay up to date on tournaments, events and exclusive news.",
  "discord.desc2":
    "Connect with other players, build teams and take part in dedicated discussions. Have fun with us!",
  "discord.button": "Join our server",
  "footer.description":
    "CoralMC Esports is the ultimate competitive Minecraft arena. Build your team, challenge the best players in official tournaments and climb the ELO rankings to the top. Advanced brackets, real prizes and a community built around competition: every match counts and every victory brings you closer to glory.",
  "footer.community": "Community",
  "footer.joinDiscord": "Join us on Discord",
  "footer.navigation": "Navigation",
  "footer.store": "Store",
  "footer.credits": "Website by Sildev & MrJak3s",
  "footer.rights": "© {year} TierList CoralMC. All rights reserved.",
  "store.comingEyebrow": "Store update in progress",
  "store.comingTitlePre": "The Store",
  "store.comingTitleAccent": "is coming soon",
  "store.comingDescription":
    "We are preparing the new CoralMC storefront. Come back soon to discover ranks, cosmetics and server perks.",
  "auth.signIn.title": "Sign in to CoralMC",
  "auth.signIn.description":
    "Use your Discord account to access the CoralMC competitive platform.",
  "auth.signIn.continue": "Continue with Discord",
  "auth.signIn.synced": "Profile synced",
  "auth.signIn.noPassword": "No additional password required",
  "loading.aria": "Loading the CoralMC platform",
  "loading.title": "Preparing the arena",
  "loading.default": "We are syncing the platform and preparing your next challenge.",
  "loading.tournament": "We are loading the tournament entries, format and rules.",
  "loading.team": "We are preparing the team roster, statistics and match history.",
  "loading.invite": "We are checking the invitation and preparing your tournament access.",
  "loading.connection": "Connection",
  "loading.sync": "Syncing",
  "loading.arena": "Arena",
  "error.badge": "Error 500",
  "error.title": "Something went wrong",
  "error.description":
    "The server ran into an unexpected problem. You can try again or go back home.",
  "error.retry": "Try again",
  "error.home": "Back to Home",
  "error.hero": "Server outside the arena",
  "error.support": "The match stopped, but you can retry now or return safely to the home page.",
  "error.gameTitle": "Coral Dash",
  "error.gameDescription": "Jump over corrupted server blocks while you wait to rejoin the arena.",
  "error.gameStart": "Start Coral Dash",
  "error.gameRetry": "Play again",
  "error.gameScore": "Score",
  "error.gameBest": "Best",
  "error.gameOver": "Connection lost",
  "cookie.title": "We respect your privacy",
  "cookie.description":
    "We use essential cookies to run the site and, with your consent, others for analytics and marketing. You can change your mind from the footer.",
  "cookie.acceptAll": "Accept all",
  "cookie.rejectAll": "Reject non-essential",
  "cookie.customize": "Customise",
  "cookie.hideDetails": "Hide details",
  "cookie.saveChoices": "Save choices",
  "cookie.close": "Close",
  "cookie.alwaysOn": "Always on",
  "cookie.necessary.title": "Necessary",
  "cookie.necessary.desc": "Sign-in, language and security.",
  "cookie.analytics.title": "Analytics",
  "cookie.analytics.desc": "Aggregate data on how the site is used.",
  "cookie.marketing.title": "Marketing",
  "cookie.marketing.desc": "Tailored ads and content.",
  "cookie.manage": "Manage cookies",
  "team.detail.eyebrow": "Team profile",
  "team.detail.notFoundTitle": "Team",
  "team.detail.notFoundAccent": "not found",
  "team.detail.notFoundDescription": "The team you are looking for no longer exists or the link is incorrect.",
  "team.detail.back": "Back to teams",
  "team.detail.emptyTitle": "No team at this address",
  "team.detail.emptyDescription": "Check the link or browse the full list of registered teams.",
  "team.detail.defaultDescription": "Roster, player performance and match history for this team.",
  "team.detail.members": "{count} members",
  "team.detail.tournaments": "{count} tournaments",
  "team.detail.createdOn": "Created on {date}",
  "team.detail.invite": "Invite",
  "team.detail.disband": "Disband team",
  "team.detail.leave": "Leave",
  "team.detail.leaveFull": "Leave team",
  "team.detail.memberRemoved": "Member removed",
  "team.detail.remove": "Remove from team",
  "team.detail.roster": "Roster",
  "team.detail.memberOptions": "Member options",
  "team.detail.noAction": "No actions",
  "team.detail.avatarFromLeader": "Emblem from leader: {name}",
  "team.detail.leader": "Leader",
  "team.detail.captain": "Captain",
  "team.detail.member": "Member",
  "team.score.points": "Points",
  "team.score.matches": "Matches",
  "team.score.average": "Average",
  "team.score.placeholder": "Sample figures: once the statistics API is connected, this profile will show the team’s real data.",
  "team.score.performance": "Player performance",
  "team.score.topImpact": "Top contributor",
  "team.score.history": "Match history",
  "team.score.winShort": "W",
  "team.score.lossShort": "L",
  "team.score.victory": "Victory",
  "team.score.defeat": "Defeat",
  "team.score.skinAlt": "Skin of {name}",
  "team.score.statsAria": "Statistics: Kills {kills}, Final kills {finalKills}, Beds {beds}, Wins {wins}, Points {points}, K/D {ratio}",
  "team.score.kills": "Kills",
  "team.score.finalKills": "Final kills",
  "team.score.beds": "Beds",
  "team.score.wins": "Wins",
  "team.score.ratio": "K/D",
  "team.score.statistics": "Statistics",
  "team.score.unavailable": "unavailable",
  "team.score.inactive": "inactive",
  "team.score.mvp": "Team MVP",
  "team.score.contribution": "Contribution: {score} team points",
  "team.score.squad.pink": "Pink",
  "team.score.squad.aqua": "Aqua",
  "team.score.squad.red": "Red",
  "team.score.squad.green": "Green",
  "team.score.squad.blue": "Blue",
};

const fr: Record<TranslationKey, string> = {
  "nav.home": "Accueil",
  "nav.tournaments": "Tournois",
  "nav.teams": "Équipes",
  "nav.leaderboard": "Classement",
  "nav.store": "Boutique",
  "nav.signIn": "Connexion",
  "search.aria": "Rechercher",
  "search.placeholder": "Recherche joueurs, équipes ou tournois...",
  "search.hint": "Tape au moins 2 caractères pour rechercher.",
  "search.noResults": "Aucun résultat trouvé.",
  "search.players": "Joueurs",
  "hero.title1": "Domine",
  "hero.title2": "l'arène",
  "hero.lead": "Entre dans l'arène compétitive Minecraft la plus avancée.",
  "hero.highlight1": "Crée des équipes",
  "hero.highlight2": "gagne des tournois",
  "hero.highlight3": "grimpe au classement",
  "hero.ctaTournaments": "Voir les Tournois",
  "hero.ctaShop": "Ouvrir la Boutique",
  "how.tag": "Le processus",
  "how.titlePre": "Comment ça",
  "how.titleAccent": "marche",
  "how.subtitle":
    "Le même parcours pour chaque joueur : même connexion, mêmes règles, de l'inscription au sommet du classement.",
  "how.step1.title": "Crée un compte",
  "how.step1.desc":
    "Inscris-toi avec Discord en quelques secondes et configure ton profil de joueur.",
  "how.step1.caption": "Discord · quelques secondes",
  "how.step2.title": "Forme ton équipe",
  "how.step2.desc": "Crée ou rejoins une équipe, invite tes coéquipiers et préparez-vous à jouer.",
  "how.step2.caption": "Équipe · invite des amis",
  "how.step3.title": "Gagne des tournois",
  "how.step3.desc":
    "Inscris-toi aux tournois, grimpe le bracket et décroche la première place du classement.",
  "how.step3.caption": "Tournois · grimpe au classement",
  "why.tag": "Plateforme compétitive",
  "why.titlePre": "Pourquoi choisir",
  "why.subtitle":
    "Une plateforme pensée pour la compétition : gestion d'équipe, brackets avancés et une expérience fluide de la connexion à la finale.",
  "feature.brackets.title": "Brackets Avancés",
  "feature.brackets.desc": "Élimination simple, double et round robin avec génération automatique",
  "feature.teams.title": "Gestion d'Équipe",
  "feature.teams.desc": "Crée des équipes, invite des joueurs et gère ton roster facilement",
  "feature.prizes.title": "Vrais Prix",
  "feature.prizes.desc":
    "Des cagnottes sur chaque tournoi : gagne les défis et remporte des récompenses concrètes, pas seulement de la gloire",
  "stats.players": "Joueurs inscrits",
  "stats.tournaments": "Tournois joués",
  "stats.prizes": "Prix distribués",
  "clips.tag": "Communauté",
  "clips.titlePre": "Clips de la",
  "clips.titleAccent": "semaine",
  "clips.subtitle":
    "Les meilleurs clips de la semaine directement depuis Discord. Survole un clip pour l'agrandir, clique pour le son.",
  "clips.audioOn": "Activer le son",
  "clips.audioOff": "Couper le son",
  "creators.tag": "Créateurs",
  "creators.role": "Créateur de contenu",
  "creators.skinAlt": "Skin de {name}",
  "creators.titlePre": "Choisi par les",
  "creators.titleAccent": "meilleurs",
  "creators.subtitle":
    "Les créateurs qui mettent leur visage en jeu et portent le projet devant tout le monde.",
  "creators.watch": "Voir la chaîne",
  "server.connecting": "Connexion…",
  "server.online": "Serveur En Ligne",
  "server.offline": "Serveur Hors Ligne",
  "server.playersOnline": "joueurs en ligne",
  "server.fetching": "Récupération du statut…",
  "server.retryLater": "Réessaie plus tard",
  "server.copyAria": "Copier l'IP du serveur",
  "server.copied": "IP copiée dans le presse-papiers",
  "server.copyError": "Impossible de copier l'IP",
  "champion.wins": "victoires",
  "champion.view": "Voir le classement →",
  "champion.skinAlt": "Skin de {name}, joueur classé premier",
  "champion.linkAria": "{name}, joueur classé premier — voir le classement",
  "discord.title": "Rejoins notre communauté Discord",
  "discord.desc1":
    "Rejoins notre serveur Discord maintenant pour rester informé des tournois, événements et nouveautés exclusives.",
  "discord.desc2":
    "Connecte-toi avec d'autres joueurs, forme des équipes et participe à des discussions dédiées. Amuse-toi avec nous !",
  "discord.button": "Rejoins notre serveur",
  "footer.description":
    "CoralMC Esports est l'arène compétitive Minecraft ultime. Forme ton équipe, affronte les meilleurs joueurs lors des tournois officiels et grimpe au sommet du classement ELO. Brackets avancés, vrais prix et une communauté passionnée de compétition : chaque match compte et chaque victoire te rapproche de la gloire.",
  "footer.community": "Communauté",
  "footer.joinDiscord": "Nous rejoindre sur Discord",
  "footer.navigation": "Navigation",
  "footer.store": "Boutique",
  "footer.credits": "Site créé par Sildev & MrJak3s",
  "footer.rights": "© {year} TierList CoralMC. Tous droits réservés.",
  "store.comingEyebrow": "Mise à jour de la boutique",
  "store.comingTitlePre": "La Boutique",
  "store.comingTitleAccent": "arrive bientôt",
  "store.comingDescription":
    "Nous préparons la nouvelle boutique CoralMC. Reviens bientôt pour découvrir les grades, les cosmétiques et les avantages du serveur.",
  "auth.signIn.title": "Se connecter à CoralMC",
  "auth.signIn.description":
    "Utilisez votre compte Discord pour accéder à la plateforme compétitive de CoralMC.",
  "auth.signIn.continue": "Continuer avec Discord",
  "auth.signIn.synced": "Profil synchronisé",
  "auth.signIn.noPassword": "Aucun mot de passe supplémentaire requis",
  "loading.aria": "Chargement de la plateforme CoralMC",
  "loading.title": "Préparation de l’arène",
  "loading.default": "Nous synchronisons la plateforme et préparons votre prochain défi.",
  "loading.tournament": "Nous chargeons les inscriptions, le format et le règlement du tournoi.",
  "loading.team": "Nous préparons l’effectif, les statistiques et l’historique des matchs de l’équipe.",
  "loading.invite": "Nous vérifions l’invitation et préparons votre accès au tournoi.",
  "loading.connection": "Connexion",
  "loading.sync": "Synchronisation",
  "loading.arena": "Arène",
  "error.badge": "Erreur 500",
  "error.title": "Une erreur est survenue",
  "error.description":
    "Le serveur a rencontré un problème inattendu. Tu peux réessayer ou revenir à l'accueil.",
  "error.retry": "Réessayer",
  "error.home": "Retour à l'accueil",
  "error.hero": "Serveur hors de l'arène",
  "error.support": "Le match s'est arrêté, mais tu peux réessayer ou revenir à l'accueil.",
  "error.gameTitle": "Coral Dash",
  "error.gameDescription":
    "Saute par-dessus les blocs serveur corrompus en attendant de rejoindre l'arène.",
  "error.gameStart": "Lancer Coral Dash",
  "error.gameRetry": "Rejouer",
  "error.gameScore": "Score",
  "error.gameBest": "Record",
  "error.gameOver": "Connexion interrompue",
  "cookie.title": "Nous respectons votre vie privée",
  "cookie.description":
    "Nous utilisons des cookies techniques pour faire fonctionner le site et, avec votre accord, d'autres pour les statistiques et le marketing. Vous pouvez changer d'avis depuis le pied de page.",
  "cookie.acceptAll": "Tout accepter",
  "cookie.rejectAll": "Refuser les non essentiels",
  "cookie.customize": "Personnaliser",
  "cookie.hideDetails": "Masquer les détails",
  "cookie.saveChoices": "Enregistrer mes choix",
  "cookie.close": "Fermer",
  "cookie.alwaysOn": "Toujours actifs",
  "cookie.necessary.title": "Nécessaires",
  "cookie.necessary.desc": "Connexion, langue et sécurité.",
  "cookie.analytics.title": "Statistiques",
  "cookie.analytics.desc": "Données agrégées sur l'usage du site.",
  "cookie.marketing.title": "Marketing",
  "cookie.marketing.desc": "Annonces et contenus personnalisés.",
  "cookie.manage": "Gérer les cookies",
  "team.detail.eyebrow": "Fiche de l’équipe",
  "team.detail.notFoundTitle": "Équipe",
  "team.detail.notFoundAccent": "introuvable",
  "team.detail.notFoundDescription": "L’équipe recherchée n’existe plus ou le lien est incorrect.",
  "team.detail.back": "Retour aux équipes",
  "team.detail.emptyTitle": "Aucune équipe à cette adresse",
  "team.detail.emptyDescription": "Vérifie le lien ou consulte la liste complète des équipes inscrites.",
  "team.detail.defaultDescription": "Effectif, performances des joueurs et historique des matchs de cette équipe.",
  "team.detail.members": "{count} membres",
  "team.detail.tournaments": "{count} tournois",
  "team.detail.createdOn": "Créée le {date}",
  "team.detail.invite": "Inviter",
  "team.detail.disband": "Dissoudre l’équipe",
  "team.detail.leave": "Quitter",
  "team.detail.leaveFull": "Quitter l’équipe",
  "team.detail.memberRemoved": "Membre retiré",
  "team.detail.remove": "Retirer de l’équipe",
  "team.detail.roster": "Effectif",
  "team.detail.memberOptions": "Options du membre",
  "team.detail.noAction": "Aucune action",
  "team.detail.avatarFromLeader": "Emblème du leader : {name}",
  "team.detail.leader": "Leader",
  "team.detail.captain": "Capitaine",
  "team.detail.member": "Membre",
  "team.score.points": "Points",
  "team.score.matches": "Matchs",
  "team.score.average": "Moyenne",
  "team.score.placeholder": "Données d’exemple : une fois l’API de statistiques connectée, cette fiche affichera les données réelles de l’équipe.",
  "team.score.performance": "Performances des joueurs",
  "team.score.topImpact": "Meilleur contributeur",
  "team.score.history": "Historique des matchs",
  "team.score.winShort": "V",
  "team.score.lossShort": "D",
  "team.score.victory": "Victoire",
  "team.score.defeat": "Défaite",
  "team.score.skinAlt": "Skin de {name}",
  "team.score.statsAria": "Statistiques : Kills {kills}, Kills finaux {finalKills}, Lits {beds}, Victoires {wins}, Points {points}, K/D {ratio}",
  "team.score.kills": "Kills",
  "team.score.finalKills": "Kills finaux",
  "team.score.beds": "Lits",
  "team.score.wins": "Victoires",
  "team.score.ratio": "K/D",
  "team.score.statistics": "Statistiques",
  "team.score.unavailable": "indisponible",
  "team.score.inactive": "inactif",
  "team.score.mvp": "MVP de l’équipe",
  "team.score.contribution": "Contribution : {score} points d’équipe",
  "team.score.squad.pink": "Rose",
  "team.score.squad.aqua": "Aqua",
  "team.score.squad.red": "Rouges",
  "team.score.squad.green": "Verts",
  "team.score.squad.blue": "Bleus",
};

const de: Record<TranslationKey, string> = {
  "nav.home": "Startseite",
  "nav.tournaments": "Turniere",
  "nav.teams": "Teams",
  "nav.leaderboard": "Rangliste",
  "nav.store": "Shop",
  "nav.signIn": "Anmelden",
  "search.aria": "Suchen",
  "search.placeholder": "Suche nach Spielern, Teams oder Turnieren...",
  "search.hint": "Gib mindestens 2 Zeichen ein.",
  "search.noResults": "Keine Ergebnisse gefunden.",
  "search.players": "Spieler",
  "hero.title1": "Beherrsche",
  "hero.title2": "die Arena",
  "hero.lead": "Betritt die fortschrittlichste kompetitive Minecraft-Arena.",
  "hero.highlight1": "Erstelle Teams",
  "hero.highlight2": "gewinne Turniere",
  "hero.highlight3": "erklimme die Rangliste",
  "hero.ctaTournaments": "Turniere entdecken",
  "hero.ctaShop": "Shop öffnen",
  "how.tag": "Der Ablauf",
  "how.titlePre": "Wie es",
  "how.titleAccent": "funktioniert",
  "how.subtitle":
    "Derselbe Weg für jeden Spieler: gleicher Login, gleiche Regeln, von der Anmeldung bis an die Spitze der Rangliste.",
  "how.step1.title": "Konto erstellen",
  "how.step1.desc": "Melde dich in Sekunden mit Discord an und richte dein Spielerprofil ein.",
  "how.step1.caption": "Discord · wenige Sekunden",
  "how.step2.title": "Team gründen",
  "how.step2.desc":
    "Erstelle ein Team oder tritt einem bei, lade deine Mitspieler ein und macht euch bereit.",
  "how.step2.caption": "Team · Freunde einladen",
  "how.step3.title": "Turniere gewinnen",
  "how.step3.desc":
    "Melde dich für Turniere an, klettere durch den Bracket und hol dir Platz eins der Rangliste.",
  "how.step3.caption": "Turniere · Rangliste erklimmen",
  "why.tag": "Kompetitive Plattform",
  "why.titlePre": "Warum",
  "why.subtitle":
    "Eine Plattform, die für den Wettbewerb gemacht ist: Team-Verwaltung, fortschrittliche Brackets und ein flüssiges Erlebnis vom Login bis zum Finale.",
  "feature.brackets.title": "Fortschrittliche Brackets",
  "feature.brackets.desc":
    "K.-o.-System, doppelte Ausscheidung und Round Robin mit automatischer Erstellung",
  "feature.teams.title": "Team-Verwaltung",
  "feature.teams.desc": "Erstelle Teams, lade Spieler ein und verwalte deinen Kader mühelos",
  "feature.prizes.title": "Echte Preise",
  "feature.prizes.desc":
    "Preispools in jedem Turnier: Gewinne die Herausforderungen und hol dir echte Belohnungen, nicht nur Ruhm",
  "stats.players": "Registrierte Spieler",
  "stats.tournaments": "Gespielte Turniere",
  "stats.prizes": "Vergebene Preise",
  "clips.tag": "Community",
  "clips.titlePre": "Clips der",
  "clips.titleAccent": "Woche",
  "clips.subtitle":
    "Die besten Clips der Woche direkt aus Discord. Fahre über einen Clip zum Vergrößern, klicke für Ton.",
  "clips.audioOn": "Ton an",
  "clips.audioOff": "Ton aus",
  "creators.tag": "Creator",
  "creators.role": "Content-Creator",
  "creators.skinAlt": "Skin von {name}",
  "creators.titlePre": "Gewählt von den",
  "creators.titleAccent": "Besten",
  "creators.subtitle": "Die Creator, die ihr Gesicht zeigen und das Projekt nach vorne bringen.",
  "creators.watch": "Kanal ansehen",
  "server.connecting": "Verbinde…",
  "server.online": "Server Online",
  "server.offline": "Server Offline",
  "server.playersOnline": "Spieler online",
  "server.fetching": "Status wird geladen…",
  "server.retryLater": "Versuch es später",
  "server.copyAria": "Server-IP kopieren",
  "server.copied": "IP in die Zwischenablage kopiert",
  "server.copyError": "IP konnte nicht kopiert werden",
  "champion.wins": "Siege",
  "champion.view": "Rangliste ansehen →",
  "champion.skinAlt": "Skin von {name}, Erstplatzierter",
  "champion.linkAria": "{name}, Erstplatzierter — zur Rangliste",
  "discord.title": "Tritt unserer Discord-Community bei",
  "discord.desc1":
    "Tritt jetzt unserem Discord-Server bei, um über Turniere, Events und exklusive Neuigkeiten informiert zu bleiben.",
  "discord.desc2":
    "Vernetze dich mit anderen Spielern, gründe Teams und nimm an eigenen Diskussionen teil. Viel Spaß mit uns!",
  "discord.button": "Tritt unserem Server bei",
  "footer.description":
    "CoralMC Esports ist die ultimative Minecraft-Wettkampfarena. Stelle dein Team zusammen, fordere die besten Spieler in offiziellen Turnieren heraus und klettere an die Spitze der ELO-Rangliste. Fortschrittliche Brackets, echte Preise und eine Community, die für den Wettbewerb lebt: Jedes Match zählt und jeder Sieg bringt dich dem Ruhm näher.",
  "footer.community": "Community",
  "footer.joinDiscord": "Auf Discord beitreten",
  "footer.navigation": "Navigation",
  "footer.store": "Shop",
  "footer.credits": "Website von Sildev & MrJak3s",
  "footer.rights": "© {year} TierList CoralMC. Alle Rechte vorbehalten.",
  "store.comingEyebrow": "Shop wird aktualisiert",
  "store.comingTitlePre": "Der Shop",
  "store.comingTitleAccent": "kommt bald",
  "store.comingDescription":
    "Wir bereiten den neuen CoralMC-Shop vor. Schau bald wieder vorbei und entdecke Ränge, Kosmetik und Server-Vorteile.",
  "auth.signIn.title": "Bei CoralMC anmelden",
  "auth.signIn.description":
    "Nutze dein Discord-Konto, um auf die CoralMC-Wettkampfplattform zuzugreifen.",
  "auth.signIn.continue": "Mit Discord fortfahren",
  "auth.signIn.synced": "Profil synchronisiert",
  "auth.signIn.noPassword": "Kein zusätzliches Passwort erforderlich",
  "loading.aria": "CoralMC-Plattform wird geladen",
  "loading.title": "Die Arena wird vorbereitet",
  "loading.default": "Wir synchronisieren die Plattform und bereiten deine nächste Herausforderung vor.",
  "loading.tournament": "Wir laden Anmeldungen, Format und Regeln des Turniers.",
  "loading.team": "Wir bereiten Teamaufstellung, Statistiken und Spielverlauf vor.",
  "loading.invite": "Wir prüfen die Einladung und bereiten deinen Turnierzugang vor.",
  "loading.connection": "Verbindung",
  "loading.sync": "Synchronisierung",
  "loading.arena": "Arena",
  "error.badge": "Fehler 500",
  "error.title": "Etwas ist schiefgelaufen",
  "error.description":
    "Der Server hatte ein unerwartetes Problem. Du kannst es erneut versuchen oder zurück zur Startseite.",
  "error.retry": "Erneut versuchen",
  "error.home": "Zur Startseite",
  "error.hero": "Server außerhalb der Arena",
  "error.support":
    "Das Match wurde gestoppt. Versuche es erneut oder kehre sicher zur Startseite zurück.",
  "error.gameTitle": "Coral Dash",
  "error.gameDescription":
    "Springe über beschädigte Serverblöcke, während du auf den Wiedereintritt wartest.",
  "error.gameStart": "Coral Dash starten",
  "error.gameRetry": "Noch einmal",
  "error.gameScore": "Punkte",
  "error.gameBest": "Rekord",
  "error.gameOver": "Verbindung unterbrochen",
  "cookie.title": "Wir respektieren deine Privatsphäre",
  "cookie.description":
    "Wir setzen technische Cookies ein, damit die Seite funktioniert, und mit deiner Zustimmung weitere für Statistik und Marketing. Du kannst deine Wahl im Footer ändern.",
  "cookie.acceptAll": "Alle akzeptieren",
  "cookie.rejectAll": "Nicht notwendige ablehnen",
  "cookie.customize": "Anpassen",
  "cookie.hideDetails": "Details ausblenden",
  "cookie.saveChoices": "Auswahl speichern",
  "cookie.close": "Schließen",
  "cookie.alwaysOn": "Immer aktiv",
  "cookie.necessary.title": "Notwendig",
  "cookie.necessary.desc": "Login, Sprache und Sicherheit.",
  "cookie.analytics.title": "Statistik",
  "cookie.analytics.desc": "Aggregierte Daten zur Nutzung der Seite.",
  "cookie.marketing.title": "Marketing",
  "cookie.marketing.desc": "Passende Werbung und Inhalte.",
  "cookie.manage": "Cookies verwalten",
  "team.detail.eyebrow": "Teamprofil",
  "team.detail.notFoundTitle": "Team",
  "team.detail.notFoundAccent": "nicht gefunden",
  "team.detail.notFoundDescription": "Das gesuchte Team existiert nicht mehr oder der Link ist falsch.",
  "team.detail.back": "Zurück zu den Teams",
  "team.detail.emptyTitle": "Kein Team unter dieser Adresse",
  "team.detail.emptyDescription": "Prüfe den Link oder sieh dir die vollständige Liste der registrierten Teams an.",
  "team.detail.defaultDescription": "Kader, Spielerleistungen und Matchverlauf dieses Teams.",
  "team.detail.members": "{count} Mitglieder",
  "team.detail.tournaments": "{count} Turniere",
  "team.detail.createdOn": "Erstellt am {date}",
  "team.detail.invite": "Einladen",
  "team.detail.disband": "Team auflösen",
  "team.detail.leave": "Verlassen",
  "team.detail.leaveFull": "Team verlassen",
  "team.detail.memberRemoved": "Mitglied entfernt",
  "team.detail.remove": "Aus Team entfernen",
  "team.detail.roster": "Kader",
  "team.detail.memberOptions": "Mitgliedsoptionen",
  "team.detail.noAction": "Keine Aktionen",
  "team.detail.avatarFromLeader": "Wappen vom Leader: {name}",
  "team.detail.leader": "Leader",
  "team.detail.captain": "Kapitän",
  "team.detail.member": "Mitglied",
  "team.score.points": "Punkte",
  "team.score.matches": "Matches",
  "team.score.average": "Durchschnitt",
  "team.score.placeholder": "Beispieldaten: Sobald die Statistik-API verbunden ist, zeigt dieses Profil die echten Teamdaten.",
  "team.score.performance": "Spielerleistungen",
  "team.score.topImpact": "Stärkster Beitrag",
  "team.score.history": "Matchverlauf",
  "team.score.winShort": "S",
  "team.score.lossShort": "N",
  "team.score.victory": "Sieg",
  "team.score.defeat": "Niederlage",
  "team.score.skinAlt": "Skin von {name}",
  "team.score.statsAria": "Statistiken: Kills {kills}, Final Kills {finalKills}, Betten {beds}, Siege {wins}, Punkte {points}, K/D {ratio}",
  "team.score.kills": "Kills",
  "team.score.finalKills": "Final Kills",
  "team.score.beds": "Betten",
  "team.score.wins": "Siege",
  "team.score.ratio": "K/D",
  "team.score.statistics": "Statistiken",
  "team.score.unavailable": "nicht verfügbar",
  "team.score.inactive": "inaktiv",
  "team.score.mvp": "Team-MVP",
  "team.score.contribution": "Beitrag: {score} Teampunkte",
  "team.score.squad.pink": "Rosa",
  "team.score.squad.aqua": "Aqua",
  "team.score.squad.red": "Rot",
  "team.score.squad.green": "Grün",
  "team.score.squad.blue": "Blau",
};

const ru: Dict = {
  "nav.tournaments": "Турниры",
  "nav.teams": "Команды",
  "nav.leaderboard": "Рейтинг",
  "nav.store": "Магазин",
  "nav.signIn": "Войти",
  "search.aria": "Поиск",
  "search.placeholder": "Поиск игроков, команд или турниров...",
  "search.hint": "Введите не менее 2 символов.",
  "search.noResults": "Ничего не найдено.",
  "search.players": "Игроки",
  "hero.title1": "Покори",
  "hero.title2": "арену",
  "hero.lead": "Войди в самую продвинутую соревновательную арену Minecraft.",
  "hero.highlight1": "Создавай команды",
  "hero.highlight2": "побеждай в турнирах",
  "hero.highlight3": "поднимайся в рейтинге",
  "hero.ctaTournaments": "Смотреть турниры",
  "hero.ctaShop": "Открыть магазин",
  "how.tag": "Процесс",
  "how.titlePre": "Как это",
  "how.titleAccent": "работает",
  "how.subtitle":
    "Один путь для каждого игрока: один вход, одни правила — от регистрации до вершины рейтинга.",
  "how.step1.title": "Создай аккаунт",
  "how.step1.desc": "Зарегистрируйся через Discord за секунды и настрой свой профиль игрока.",
  "how.step1.caption": "Discord · пара секунд",
  "how.step2.title": "Собери команду",
  "how.step2.desc":
    "Создай команду или вступи в неё, пригласи друзей и готовьтесь к соревнованиям.",
  "how.step2.caption": "Команда · пригласи друзей",
  "how.step3.title": "Побеждай в турнирах",
  "how.step3.desc": "Записывайся на турниры, проходи сетку и занимай первое место в рейтинге.",
  "how.step3.caption": "Турниры · поднимайся в рейтинге",
  "why.tag": "Соревновательная платформа",
  "why.titlePre": "Почему выбирают",
  "why.subtitle":
    "Платформа, созданная для соревнований: управление командой, продвинутые сетки и плавный опыт от входа до финала.",
  "feature.brackets.title": "Продвинутые сетки",
  "feature.brackets.desc":
    "Одиночное и двойное выбывание, круговая система с автоматической генерацией",
  "feature.teams.title": "Управление командой",
  "feature.teams.desc": "Создавай команды, приглашай игроков и легко управляй составом",
  "feature.prizes.title": "Реальные призы",
  "feature.prizes.desc":
    "Призовой фонд в каждом турнире: выигрывай испытания и получай реальные награды, а не только славу",
  "stats.players": "Зарегистрированных игроков",
  "stats.tournaments": "Сыграно турниров",
  "stats.prizes": "Выдано призов",
  "clips.tag": "Сообщество",
  "clips.subtitle":
    "Лучшие клипы недели прямо из Discord. Наведи на клип, чтобы увеличить, кликни для звука.",
  "clips.audioOn": "Включить звук",
  "clips.audioOff": "Выключить звук",
  "creators.tag": "Авторы",
  "creators.titlePre": "Выбор",
  "creators.titleAccent": "лучших",
  "creators.subtitle": "Авторы, которые не боятся показать лицо и продвигают проект для всех.",
  "creators.watch": "Смотреть канал",
  "server.connecting": "Подключение…",
  "server.online": "Сервер онлайн",
  "server.offline": "Сервер офлайн",
  "server.playersOnline": "игроков онлайн",
  "server.fetching": "Загрузка статуса…",
  "server.retryLater": "Попробуй позже",
  "server.copyAria": "Скопировать IP сервера",
  "server.copied": "IP скопирован в буфер обмена",
  "server.copyError": "Не удалось скопировать IP",
  "champion.wins": "побед",
  "champion.view": "Открыть рейтинг →",
  "discord.title": "Присоединяйся к нашему сообществу в Discord",
  "discord.desc1":
    "Заходи на наш сервер Discord, чтобы быть в курсе турниров, событий и эксклюзивных новостей.",
  "discord.desc2":
    "Общайся с другими игроками, собирай команды и участвуй в тематических обсуждениях. Веселись с нами!",
  "discord.button": "Зайти на наш сервер",
  "error.badge": "Ошибка 500",
  "error.title": "Что-то пошло не так",
  "error.description":
    "Сервер столкнулся с непредвиденной проблемой. Попробуй ещё раз или вернись на главную.",
  "error.retry": "Повторить",
  "error.home": "На главную",
  "error.hero": "Сервер вне арены",
  "error.support": "Матч остановлен. Попробуй снова или вернись на главную страницу.",
  "error.gameTitle": "Coral Dash",
  "error.gameDescription":
    "Перепрыгивай повреждённые серверные блоки, пока ждёшь возвращения на арену.",
  "error.gameStart": "Запустить Coral Dash",
  "error.gameRetry": "Играть снова",
  "error.gameScore": "Очки",
  "error.gameBest": "Рекорд",
  "error.gameOver": "Соединение потеряно",
};

const dictionaries: Record<Locale, Dict> = { it, en, fr, de };

type TranslatedNodeState = { source: string; rendered: string };
type TranslatedAttributeState = Record<string, TranslatedNodeState>;

const translatedTextNodes = new WeakMap<Text, TranslatedNodeState>();
const translatedAttributes = new WeakMap<Element, TranslatedAttributeState>();
const TRANSLATABLE_ATTRIBUTES = ["aria-label", "placeholder", "title"] as const;
const SKIPPED_TRANSLATION_TAGS = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);

function normalizeAutomaticSource(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("it-IT");
}

function automaticTarget(set: readonly [string, string, string], locale: Locale) {
  return set[locale === "en" ? 0 : locale === "fr" ? 1 : 2];
}

const automaticExactTables = {} as Record<Locale, Map<string, string>>;

type AutomaticTranslations = Record<string, readonly [string, string, string]>;
let automaticTranslationsInstalled = false;

for (const locale of LOCALES.map(({ code }) => code)) {
  const exact = new Map<string, string>();
  if (locale !== "it") {
    for (const [key, source] of Object.entries(it)) {
      const target = dictionaries[locale][key];
      if (source && target) exact.set(normalizeAutomaticSource(source), target);
    }
  }
  automaticExactTables[locale] = exact;
}

function installAutomaticTranslations(translations: AutomaticTranslations) {
  if (automaticTranslationsInstalled) return;

  for (const locale of LOCALES.map(({ code }) => code)) {
    if (locale === "it") continue;
    const exact = automaticExactTables[locale];
    for (const [source, set] of Object.entries(translations)) {
      exact.set(normalizeAutomaticSource(source), automaticTarget(set, locale));
    }
  }

  automaticTranslationsInstalled = true;
}

export function translateUiText(value: string, locale: Locale) {
  if (locale === "it" || !value.trim()) return value;

  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return value;
  const [, leading, core, trailing] = match;
  const normalized = normalizeAutomaticSource(core);
  const exact = automaticExactTables[locale].get(normalized);
  if (exact) return `${leading}${exact}${trailing}`;

  return value;
}

function canTranslateTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent || SKIPPED_TRANSLATION_TAGS.has(parent.tagName)) return false;
  return !parent.closest('[data-no-translate], [translate="no"], [contenteditable="true"]');
}

function translateTextNode(node: Text, locale: Locale) {
  if (!canTranslateTextNode(node)) return;
  const current = node.data;
  const previous = translatedTextNodes.get(node);
  const source =
    previous && (current === previous.rendered || current === previous.source)
      ? previous.source
      : current;
  const rendered = translateUiText(source, locale);
  translatedTextNodes.set(node, { source, rendered });
  if (current !== rendered) node.data = rendered;
}

function translateElementAttributes(element: Element, locale: Locale) {
  if (
    SKIPPED_TRANSLATION_TAGS.has(element.tagName) ||
    element.closest('[data-no-translate], [translate="no"], [contenteditable="true"]')
  ) {
    return;
  }

  const previousAttributes = translatedAttributes.get(element) ?? {};
  let hasTranslatedAttribute = false;

  for (const attribute of TRANSLATABLE_ATTRIBUTES) {
    const current = element.getAttribute(attribute);
    if (current === null) continue;
    const previous = previousAttributes[attribute];
    const source =
      previous && (current === previous.rendered || current === previous.source)
        ? previous.source
        : current;
    const rendered = translateUiText(source, locale);
    previousAttributes[attribute] = { source, rendered };
    hasTranslatedAttribute = true;
    if (current !== rendered) element.setAttribute(attribute, rendered);
  }

  if (hasTranslatedAttribute) translatedAttributes.set(element, previousAttributes);
}

function translateDomTree(root: Node, locale: Locale) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, locale);
    return;
  }
  if (!(root instanceof Element)) return;

  translateElementAttributes(root, locale);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) translateTextNode(current as Text, locale);
    else translateElementAttributes(current as Element, locale);
    current = walker.nextNode();
  }
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "it" || value === "en" || value === "fr" || value === "de";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");
  const [automaticTranslationVersion, setAutomaticTranslationVersion] = useState(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
        return;
      }
      const browser = navigator.language.slice(0, 2);
      if (isLocale(browser)) setLocaleState(browser);
    } catch {
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (locale === "it" || automaticTranslationsInstalled) return;

    let cancelled = false;
    void import("@/lib/automatic-translations")
      .then(({ AUTOMATIC_TRANSLATIONS }) => {
        installAutomaticTranslations(AUTOMATIC_TRANSLATIONS);
        if (!cancelled) setAutomaticTranslationVersion((version) => version + 1);
      })
      .catch(() => {
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    const body = document.body;
    translateDomTree(body, locale);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text, locale);
          continue;
        }
        if (mutation.type === "attributes") {
          translateElementAttributes(mutation.target as Element, locale);
          continue;
        }
        for (const node of mutation.addedNodes) translateDomTree(node, locale);
      }
    });

    observer.observe(body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, [automaticTranslationVersion, locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = dictionaries[locale][key] ?? dictionaries.it[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
