"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "it" | "en" | "fr" | "de" | "ru";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
];

const STORAGE_KEY = "coralmc-locale";

/** Intl locale used for number formatting per app locale. */
export const INTL_LOCALE: Record<Locale, string> = {
  it: "it-IT",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
};

type Dict = Record<string, string>;

const it: Dict = {
  // Navbar
  "nav.tournaments": "Tornei",
  "nav.teams": "Teams",
  "nav.leaderboard": "Classifica",
  "nav.store": "Store",
  "nav.signIn": "Accedi",
  // Search
  "search.aria": "Cerca",
  "search.placeholder": "Cerca giocatori, team o tornei...",
  "search.hint": "Digita almeno 2 caratteri per cercare.",
  "search.noResults": "Nessun risultato trovato.",
  "search.players": "Giocatori",
  // Hero
  "hero.title1": "Domina",
  "hero.title2": "l'arena",
  "hero.lead": "Entra nell'arena competitiva più avanzata di Minecraft.",
  "hero.highlight1": "Crea team",
  "hero.highlight2": "domina i tornei",
  "hero.highlight3": "scala le classifiche",
  "hero.ctaTournaments": "Esplora Tornei",
  "hero.ctaShop": "Apri Shop",
  // How it works
  "how.tag": "Il processo",
  "how.titlePre": "Come",
  "how.titleAccent": "funziona",
  "how.subtitle":
    "Lo stesso percorso per ogni giocatore: stesso login, stesse regole, dalla registrazione alla vetta della classifica.",
  "how.step1.title": "Crea account",
  "how.step1.desc":
    "Registrati con Discord in pochi secondi e configura il tuo profilo giocatore.",
  "how.step1.caption": "Discord · pochi secondi",
  "how.step2.title": "Forma il team",
  "how.step2.desc":
    "Crea o unisciti a un team, invita i tuoi compagni e preparatevi a competere.",
  "how.step2.caption": "Team · invita amici",
  "how.step3.title": "Vinci tornei",
  "how.step3.desc":
    "Iscriviti ai tornei, scala il bracket e conquista il primo posto in classifica.",
  "how.step3.caption": "Tornei · scala la classifica",
  // Why choose
  "why.tag": "Piattaforma competitiva",
  "why.titlePre": "Perché scegliere",
  "why.subtitle":
    "Una piattaforma pensata per competere: gestione team, bracket avanzati e un'esperienza fluida dal login alla finale.",
  "feature.brackets.title": "Bracket Avanzati",
  "feature.brackets.desc":
    "Eliminazione singola, doppia e round robin con generazione automatica",
  "feature.teams.title": "Gestione Team",
  "feature.teams.desc":
    "Crea team, invita giocatori e gestisci il roster con facilità",
  "feature.prizes.title": "Premi Reali",
  "feature.prizes.desc":
    "Monta premi in palio in ogni torneo: vinci le sfide e conquista ricompense concrete, non solo gloria",
  // Stats
  "stats.players": "Giocatori registrati",
  "stats.tournaments": "Tornei giocati",
  "stats.prizes": "Premi distribuiti",
  // Clips
  "clips.tag": "Community",
  "clips.subtitle":
    "Le clip migliori della settimana direttamente dal Discord. Passa sopra una clip per ingrandirla, audio al click.",
  "clips.audioOn": "Attiva audio",
  "clips.audioOff": "Disattiva audio",
  // Creators
  "creators.tag": "Creator",
  "creators.titlePre": "Scelto dai",
  "creators.titleAccent": "migliori",
  "creators.subtitle":
    "I creator che ci mettono la faccia e portano il progetto davanti a tutti.",
  "creators.watch": "Guarda il canale",
  // Server status
  "server.connecting": "Connessione…",
  "server.online": "Server Online",
  "server.offline": "Server Offline",
  "server.playersOnline": "giocatori online",
  "server.fetching": "Recupero stato…",
  "server.retryLater": "Riprova più tardi",
  "server.copyAria": "Copia l'IP del server",
  "server.copied": "IP copiato negli appunti",
  "server.copyError": "Impossibile copiare l'IP",
  // Champion
  "champion.wins": "vittorie",
  "champion.view": "Vedi classifica →",
  // Discord
  "discord.title": "Unisciti alla nostra community Discord",
  "discord.desc1":
    "Entra ora nel nostro server Discord per rimanere aggiornato su tornei, eventi e novità esclusive.",
  "discord.desc2":
    "Connettiti con altri giocatori, forma team e partecipa a discussioni dedicate. Divertiti con noi!",
  "discord.button": "Entra nel nostro server",
  // Error page
  "error.badge": "Errore 500",
  "error.title": "Qualcosa è andato storto",
  "error.description":
    "Il server ha incontrato un problema imprevisto. Puoi riprovare o tornare alla home.",
  "error.retry": "Riprova",
  "error.home": "Torna alla Home",
};

const en: Dict = {
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
  "how.step1.desc":
    "Sign up with Discord in seconds and set up your player profile.",
  "how.step1.caption": "Discord · a few seconds",
  "how.step2.title": "Build your team",
  "how.step2.desc":
    "Create or join a team, invite your mates and get ready to compete.",
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
  "feature.teams.desc":
    "Create teams, invite players and manage your roster with ease",
  "feature.prizes.title": "Real Prizes",
  "feature.prizes.desc":
    "Prize pools on every tournament: win the challenges and earn concrete rewards, not just glory",
  "stats.players": "Registered players",
  "stats.tournaments": "Tournaments played",
  "stats.prizes": "Prizes awarded",
  "clips.tag": "Community",
  "clips.subtitle":
    "The best clips of the week straight from Discord. Hover a clip to enlarge it, click for audio.",
  "clips.audioOn": "Unmute",
  "clips.audioOff": "Mute",
  "creators.tag": "Creators",
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
  "discord.title": "Join our Discord community",
  "discord.desc1":
    "Join our Discord server now to stay up to date on tournaments, events and exclusive news.",
  "discord.desc2":
    "Connect with other players, build teams and take part in dedicated discussions. Have fun with us!",
  "discord.button": "Join our server",
  "error.badge": "Error 500",
  "error.title": "Something went wrong",
  "error.description":
    "The server ran into an unexpected problem. You can try again or go back home.",
  "error.retry": "Try again",
  "error.home": "Back to Home",
};

const fr: Dict = {
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
  "how.step2.desc":
    "Crée ou rejoins une équipe, invite tes coéquipiers et préparez-vous à jouer.",
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
  "feature.brackets.desc":
    "Élimination simple, double et round robin avec génération automatique",
  "feature.teams.title": "Gestion d'Équipe",
  "feature.teams.desc":
    "Crée des équipes, invite des joueurs et gère ton roster facilement",
  "feature.prizes.title": "Vrais Prix",
  "feature.prizes.desc":
    "Des cagnottes sur chaque tournoi : gagne les défis et remporte des récompenses concrètes, pas seulement de la gloire",
  "stats.players": "Joueurs inscrits",
  "stats.tournaments": "Tournois joués",
  "stats.prizes": "Prix distribués",
  "clips.tag": "Communauté",
  "clips.subtitle":
    "Les meilleurs clips de la semaine directement depuis Discord. Survole un clip pour l'agrandir, clique pour le son.",
  "clips.audioOn": "Activer le son",
  "clips.audioOff": "Couper le son",
  "creators.tag": "Créateurs",
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
  "discord.title": "Rejoins notre communauté Discord",
  "discord.desc1":
    "Rejoins notre serveur Discord maintenant pour rester informé des tournois, événements et nouveautés exclusives.",
  "discord.desc2":
    "Connecte-toi avec d'autres joueurs, forme des équipes et participe à des discussions dédiées. Amuse-toi avec nous !",
  "discord.button": "Rejoins notre serveur",
  "error.badge": "Erreur 500",
  "error.title": "Une erreur est survenue",
  "error.description":
    "Le serveur a rencontré un problème inattendu. Tu peux réessayer ou revenir à l'accueil.",
  "error.retry": "Réessayer",
  "error.home": "Retour à l'accueil",
};

const de: Dict = {
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
  "how.step1.desc":
    "Melde dich in Sekunden mit Discord an und richte dein Spielerprofil ein.",
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
  "feature.teams.desc":
    "Erstelle Teams, lade Spieler ein und verwalte deinen Kader mühelos",
  "feature.prizes.title": "Echte Preise",
  "feature.prizes.desc":
    "Preispools in jedem Turnier: Gewinne die Herausforderungen und hol dir echte Belohnungen, nicht nur Ruhm",
  "stats.players": "Registrierte Spieler",
  "stats.tournaments": "Gespielte Turniere",
  "stats.prizes": "Vergebene Preise",
  "clips.tag": "Community",
  "clips.subtitle":
    "Die besten Clips der Woche direkt aus Discord. Fahre über einen Clip zum Vergrößern, klicke für Ton.",
  "clips.audioOn": "Ton an",
  "clips.audioOff": "Ton aus",
  "creators.tag": "Creator",
  "creators.titlePre": "Gewählt von den",
  "creators.titleAccent": "Besten",
  "creators.subtitle":
    "Die Creator, die ihr Gesicht zeigen und das Projekt nach vorne bringen.",
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
  "discord.title": "Tritt unserer Discord-Community bei",
  "discord.desc1":
    "Tritt jetzt unserem Discord-Server bei, um über Turniere, Events und exklusive Neuigkeiten informiert zu bleiben.",
  "discord.desc2":
    "Vernetze dich mit anderen Spielern, gründe Teams und nimm an eigenen Diskussionen teil. Viel Spaß mit uns!",
  "discord.button": "Tritt unserem Server bei",
  "error.badge": "Fehler 500",
  "error.title": "Etwas ist schiefgelaufen",
  "error.description":
    "Der Server hatte ein unerwartetes Problem. Du kannst es erneut versuchen oder zurück zur Startseite.",
  "error.retry": "Erneut versuchen",
  "error.home": "Zur Startseite",
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
  "how.step1.desc":
    "Зарегистрируйся через Discord за секунды и настрой свой профиль игрока.",
  "how.step1.caption": "Discord · пара секунд",
  "how.step2.title": "Собери команду",
  "how.step2.desc":
    "Создай команду или вступи в неё, пригласи друзей и готовьтесь к соревнованиям.",
  "how.step2.caption": "Команда · пригласи друзей",
  "how.step3.title": "Побеждай в турнирах",
  "how.step3.desc":
    "Записывайся на турниры, проходи сетку и занимай первое место в рейтинге.",
  "how.step3.caption": "Турниры · поднимайся в рейтинге",
  "why.tag": "Соревновательная платформа",
  "why.titlePre": "Почему выбирают",
  "why.subtitle":
    "Платформа, созданная для соревнований: управление командой, продвинутые сетки и плавный опыт от входа до финала.",
  "feature.brackets.title": "Продвинутые сетки",
  "feature.brackets.desc":
    "Одиночное и двойное выбывание, круговая система с автоматической генерацией",
  "feature.teams.title": "Управление командой",
  "feature.teams.desc":
    "Создавай команды, приглашай игроков и легко управляй составом",
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
  "creators.subtitle":
    "Авторы, которые не боятся показать лицо и продвигают проект для всех.",
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
};

const dictionaries: Record<Locale, Dict> = { it, en, fr, de, ru };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "it" || value === "en" || value === "fr" || value === "de" || value === "ru";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start from the default locale so the server and first client render
  // match (no hydration mismatch); the stored preference is applied after mount.
  const [locale, setLocaleState] = useState<Locale>("it");

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
      /* localStorage may be unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
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
    [locale],
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
