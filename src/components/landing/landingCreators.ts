export type LandingCreator = {
  name: string;
  role: string;
  /**
   * Username Minecraft: Java del creator. La skin viene renderizzata lato server
   * dall'Avyra Skin API (/api/body) che risolve il nome via Mojang — vedi CreatorSkin.
   */
  minecraftUsername: string;
  youtubeUrl: string;
  /** Iscritti: valore statico, non c'è una API YouTube configurata. */
  subscribers: string;
};

export const landingCreators: LandingCreator[] = [
  {
    name: "Carpyy",
    role: "Content Creator",
    minecraftUsername: "Carpyy",
    youtubeUrl: "https://www.youtube.com/@Carpyy",
    subscribers: "295K",
  },
  {
    name: "FelpaVerde",
    role: "Content Creator",
    minecraftUsername: "FelpaVerde",
    youtubeUrl: "https://www.youtube.com/@FelpaVerde",
    subscribers: "5.76K",
  },
];
