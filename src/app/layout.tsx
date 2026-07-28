import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CoralMC eSports",
  description: "Join competitive Minecraft tournaments on CoralMC. Create teams, compete in brackets, and climb the leaderboards.",
  keywords: ["minecraft", "tournaments", "esports", "gaming", "competitive"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <head>
        {/*
          Precarico l'host della Skin API (Avyra): tutte le skin — campione hero
          e card creator — arrivano da qui. Con preconnect avviamo subito DNS +
          handshake TLS, così quando la prima <img> parte la connessione è già
          calda e la skin compare prima. dns-prefetch è il fallback per i browser
          che ignorano il preconnect cross-origin.
        */}
        <link rel="preconnect" href="https://avyra-skin-api.vercel.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avyra-skin-api.vercel.app" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
