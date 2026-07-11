"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";
import { DiscordAuthLayout } from "@/components/auth/DiscordAuthLayout";

export default function SignInPage() {
  return (
    <DiscordAuthLayout>
      <Card className="glass-card mx-auto w-full max-w-[34rem] border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <Image src="/logo.png" alt="CoralMC" width={44} height={44} className="rounded-xl shadow-lg" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-white">Accedi con Discord</CardTitle>
          <CardDescription className="mx-auto max-w-md text-base text-white/70">
            Un click e sei dentro: profilo, team, tornei e dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            size="lg"
            variant="discord"
            className="h-14 w-full gap-3 rounded-xl text-base font-bold shadow-2xl shadow-black/30"
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          >
            <FaDiscord className="h-5 w-5" />
            Continua con Discord
          </Button>
        </CardContent>
      </Card>
    </DiscordAuthLayout>
  );
}
