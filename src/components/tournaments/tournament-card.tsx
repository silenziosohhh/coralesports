"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    description: string | null;
    banner: string | null;
    status: string;
    startDate: Date;
    maxTeams: number;
    prizePool: string | null;
    format: string;
    teamMode: "SOLO" | "DUO" | "TRIO";
    _count: {
      teams: number;
    };
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "UPCOMING":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "LIVE":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "FINISHED":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const [dominantColor, setDominantColor] = useState("#0a0f14");

  useEffect(() => {
    const extractColor = async () => {
      try {
        const img = document.createElement("img");
        img.crossOrigin = "Anonymous";
        img.src = tournament.banner || "/default_tournament_banner.jpeg";
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        // Darken the color significantly (20% of original brightness)
        r = Math.floor(r * 0.2);
        g = Math.floor(g * 0.2);
        b = Math.floor(b * 0.2);

        setDominantColor(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    };

    extractColor();
  }, [tournament.banner]);

  return (
    <Card 
      className="flex flex-col overflow-hidden border border-transparent hover:border-[var(--color-accent)] transition-colors duration-300"
      style={{ backgroundColor: dominantColor }}
    >
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={tournament.banner || "/default_tournament_banner.jpeg"}
          alt={tournament.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t to-transparent"
          style={{ 
            backgroundImage: `linear-gradient(to top, ${dominantColor}, ${dominantColor}80, transparent)` 
          }}
        />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <Badge className={getStatusColor(tournament.status)}>
            {tournament.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader style={{ backgroundColor: dominantColor }}>
        <CardTitle className="line-clamp-1">{tournament.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {tournament.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col" style={{ backgroundColor: dominantColor }}>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {tournament._count.teams}/{tournament.maxTeams > 0 ? tournament.maxTeams : "∞"} Teams
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(tournament.startDate.toISOString())}</span>
          </div>
          {tournament.prizePool && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>Prize: {tournament.prizePool}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{tournament.teamMode}</span>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="cyan" className="w-full" asChild>
            <Link href={`/tournaments/${tournament.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
