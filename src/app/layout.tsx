import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CoralMC eSports",
  description:
    "Join competitive Minecraft tournaments on CoralMC. Create teams, compete in brackets, and climb the leaderboards.",
  keywords: ["minecraft", "tournaments", "esports", "gaming", "competitive"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning className={cn("dark font-sans", inter.variable)}>
      <head>
        <link rel="preconnect" href="https://avyra-skin-api.vercel.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avyra-skin-api.vercel.app" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <CookieConsentBanner />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
